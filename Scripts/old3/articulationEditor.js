namespace articulationEditor
{
	inline function onInitCB()
	{					
		//Enums
		const var ARTICULATIONS = {SUSTAIN:0, LEGATO:1,	GLIDE:2}; //Legato handler articulations
		
		//ID Lists and Modules
		const var containerList = Synth.getIdList("Container"); //Get container ids
		const var muterList = Synth.getIdList("MidiMuter"); //Get MIDI Muter IDs
		const var envelopeIds = Synth.getIdList("Simple Envelope");
		
		//Script processors
		reg legatoHandler = Synth.getMidiProcessor("legatoHandler"); //Control panel for switching between sustain, legato, glide
		reg sustainReleaseHandler = Synth.getMidiProcessor("sustainReleaseHandler"); //Manages sustain/legato/glide release samples
			
		//Variables
		const var GLIDE_TIME_CC = 5; //CC to control glide time
		const var GLIDE_MODE_CC = 6; //CC to control glide whole step mode
		const var UACC_NUM = 32;
		const var rates = ["1/1", "1/2", "1/2T", "1/4", "1/4T", "1/8", "1/8T", "1/16", "1/16T", "1/32", "1/32T", "Velocity"]; //Glide time rates
		const var articulationNames = ["sustain", "legato", "glide"]; //Default articulation names, more will be picked up from container IDs
		const var noteNames = [];
		const var uaccValues = ["Disabled"]; //UACC drop down menu options - will be populated further
		const var keyswitches = []; //All currently assigned key switches
		const var uacc = []; //All currently assigned UACCs
		reg muters = []; //MIDI Muter modules - every articulation must have a MIDI muter with an ID that includes the articulation ID
		reg envelopes = {}; //Simple envelopes for each articulation
		reg ksIndex; //Used in onNote to handle key switches
		reg uaccIndex; //Used in onController to hand UACC triggers changes
		
		//Populate noteNames and uaccValues arrays
		for (i = 0; i < 128; i++)
		{
			noteNames.push(Engine.getMidiNoteName(i));	
			if (i > 0) uaccValues.push(i); //UACC values stat at 1
		}
		
		//Get names of articulations from container IDs that contain the word "_articulation"
		for (c in containerList)
		{
			if (c.indexOf("_articulation") == -1) continue;
			articulationNames.push(c.substring(0, c.indexOf("_"))); //Add ID to articulationNames array
		}
		
		//Find the MIDI muters and envelopes associated with each articulationName
		for (i = 0; i < articulationNames.length; i++)
		{
			for (m in muterList) //Each MIDI muter ID
			{
				if (m.indexOf(articulationNames[i]) == -1) continue; //Skip MIDI muters that don't contain the articulation name
				muters[i] = Synth.getMidiProcessor(m); //Add muter to muter's array
			}
			
			//Find envelopes for each articulation - ignore those with Release in the ID
			for (e in envelopeIds)
			{
				if (e.indexOf(articulationNames[i]) == -1 || e.indexOf("Release") != -1 || e.indexOf("Envelope") == -1) continue;
				if (envelopes[i] == undefined) envelopes[i] = []; //An articulation may have more than one envelope
				envelopes[i].push(Synth.getModulator(e));
			}
			
			articulationNames[i] = helpers.capitalizeString(articulationNames[i]); //Capitalise each articulation name
		}

		//GUI		
		const var articulationEditor = Content.addPanel("articulationEditor", 10, 0);
		ui.setProperties("articulationEditor", {width:200, height:225, paintRoutine:paintRoutines.zone, parentComponent:"pnlMain"}); //Outer parent		
		
		const var lblTitle = Content.addLabel("lblTitle", 0, 0);
		ui.setProperties("lblTitle", {width:200, height:25, text:"Articulations", textColour:Theme.H1.colour, fontSize:Theme.H1.fontSize, fontName:Theme.H1.font, alignment:"centred", parentComponent:"articulationEditor"});		
		
		//Headings	
		const var lblArt = Content.addLabel("lblArt", 5, 41);
		ui.setProperties("lblArt", {width:85, height:25, text:"Articulation", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		
		const var lblKs = Content.addLabel("lblKs", 5, 76);
		ui.setProperties("lblKs", {width:85, height:25, text:"Key Switch", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		
		const var lblUacc = Content.addLabel("lblUacc", 5, 111);
		ui.setProperties("lblUacc", {width:85, height:25, text:"UACC", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		
		const var lblAttack = Content.addLabel("lblAttack", 5, 147);
		ui.setProperties("lblAttack", {width:85, height:25, text:"Attack", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		const var lblRelease = Content.addLabel("lblRelease", 5, 182);
 		ui.setProperties("lblRelease", {width:85, height:25, text:"Release", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		const var lblOffset = Content.addLabel("lblOffset", 5, 147);
		ui.setProperties("lblOffset", {width:85, height:25, text:"Offset", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		const var lblRatio = Content.addLabel("lblRatio", 5, 182);
		ui.setProperties("lblRatio", {width:85, height:25, text:"Fade Ratio", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		const var lblGlide = Content.addLabel("lblRate", 5, 147); 
		ui.setProperties("lblRate", {width:85, height:25, text:"Rate", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		const var lblGlideMode = Content.addLabel("lblGlMode", 5000, 182);
 		ui.setProperties("lblGlMode", {width:85, height:25, text:"Whole Step", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"left", parentComponent:"articulationEditor"});
		
		//Articulation dropdown
		const var cmbArt = Content.addPanel("cmbArt", 90, 42);
		ui.comboBoxPanel("cmbArt", {width:100, height:25, text:"Articulation", items:articulationNames, paintRoutine:paintRoutines.dropDown, parentComponent:"articulationEditor"});
		
		//One set of controls per articulation
		const var cmbKs = []; //Key switch selector
		const var cmbUacc = []; //UACC selector
		const var sliAttack = []; //Attack slider
		const var sliRelease = []; //Release slider
		
		for (i = 0; i < articulationNames.length; i++)
		{
			cmbKs.push(Content.addPanel("cmbKs"+i, 90, 77));			
			ui.comboBoxPanel("cmbKs"+i, {width:100, height:25, text:"Key Switch", items:noteNames, paintRoutine:paintRoutines.dropDown, parentComponent:"articulationEditor"});
			cmbUacc.push(Content.addPanel("cmbUacc"+i, 90, 112));
			ui.comboBoxPanel("cmbUacc"+i, {width:100, height:25, text:"UACC", items:uaccValues, paintRoutine:paintRoutines.dropDown, parentComponent:"articulationEditor"});
			sliAttack.push(Content.addKnob("sliAttack"+i, 90, 147));
			ui.setProperties("sliAttack"+i, {width:100, height:25, style:"Horizontal", min:5, max:5000, middlePosition:1000, defaultValue:5, suffix:"ms", stepSize:1, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:Theme.SLIDER.text, parentComponent:"articulationEditor"});
			sliRelease.push(Content.addKnob("sliRelease"+i, 90, 182));
			ui.setProperties("sliRelease"+i, {width:100, height:25, style:"Horizontal", min:25, max:20000, middlePosition:1000, defaultValue:350, suffix:"ms", stepSize:1, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:Theme.SLIDER.text, parentComponent:"articulationEditor"});
		}
		
		//Change default attack slider value for sustain articulation
		sliAttack[ARTICULATIONS.SUSTAIN].set("defaultValue", 300);
			
		//Add extra controls for legato and glide articulations
		const var sliOffset = Content.addKnob("sliOffset", 90, 147);
		ui.setProperties("sliOffset", {width:100, height:25, style:"Horizontal", min:0, max:100, middlePosition:40, defaultValue:25, stepSize:0.1, suffix:"%", bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:Theme.SLIDER.text, parentComponent:"articulationEditor"});
		const var sliRatio = Content.addKnob("sliRatio", 90, 182);
		ui.setProperties("sliRatio", {width:100, height:25, style:"Horizontal", min:20, max:100, defaultValue:100, stepSize:1, suffix:"%", bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:Theme.SLIDER.text, parentComponent:"articulationEditor"});
		const var sliGlide = Content.addKnob("sliGlide", 90, 147);
		ui.setProperties("sliGlide", {width:100, height:25, style:"Horizontal", min:0, max:11, defaultValue:5, stepSize:1, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:0, parentComponent:"articulationEditor"});
		const var lblGlideValue = Content.addLabel("sliGlVal", 90, 145);
		ui.setProperties("sliGlVal", {width:100, height:25, textColour:Theme.SLIDER.text, alignment:"centred", parentComponent:"articulationEditor"});
		const var btnGlideMode = Content.addButton("btnGlMode", 90, 182);
		ui.buttonPanel("btnGlMode", {width:100, height:25, text:"Whole Step", paintRoutine:paintRoutines.pushButton, parentComponent:"articulationEditor"});
		
		setKsColours(); //Update KS colours
	}

	inline function onNoteOnCB(noteNumber, velocity)
	{		
		if (keyswitches.contains(noteNumber)) //A KS triggered the callback
		{
			ksIndex = keyswitches.indexOf(noteNumber); //Get artIndex from KS array index
			
			cmbArt.setValue(ksIndex); //Update articulation selection drop down
			changeArticulation(ksIndex);
			asyncUpdater.setFunctionAndUpdate(displayArticulationValues, ksIndex); //Asynchronously update the UI
		}
		else 
		{
			//If the current articulation is legato, two notes are held, and the sustain pedal is down, change to the glide articulation
			if (cmbArt.getValue()-1 == ARTICULATIONS.LEGATO && Synth.isLegatoInterval() && Synth.isSustainPedalDown())
			{
				cmbArt.setValue(ARTICULATIONS.GLIDE+1);
				changeArticulation(ARTICULATIONS.GLIDE);
				asyncUpdater.setFunctionAndUpdate(displayArticulationValues, ARTICULATIONS.GLIDE);
			}
		}
	}
	
	inline function onControllerCB(ccNum, ccVal)
	{
		if (ccNum == UACC_NUM && ccVal > 0) //UACC
		{
			if (uacc.contains(ccVal)) //Triggered UACC value is assigned to an articulation
			{			
				uaccIndex = uacc.indexOf(ccVal);
				changeArticulation(uaccIndex);
				asyncUpdater.setFunctionAndUpdate(displayArticulationValues, uaccIndex);
			}
		}
		else if (ccNum == GLIDE_TIME_CC) //Glide time CC
		{
			reg v = Math.round(ccVal/12);
			legatoHandler.setAttribute(10, v);
			asyncUpdater.setFunctionAndUpdate(updateGlideSlider, v); //Defer GUI update
		}
		else if (ccNum == GLIDE_MODE_CC) //Glide whole step mode CC
		{
			//By checking the attribute value the script will only continue if the state has changed - less cpu!
			if (ccVal > 63 && legatoHandler.getAttribute(3) == 0)
			{
				legatoHandler.setAttribute(3, 1);
				btnGlideMode.setValue(1);
				btnGlideMode.repaint();
			}
			else if (ccVal < 64 && legatoHandler.getAttribute(3) == 1)
			{
				legatoHandler.setAttribute(3, 0);
				btnGlideMode.setValue(0);
				btnGlideMode.repaint();
			}
		}
		else if (ccNum == 64) //Sustain Pedal
		{
			Message.ignoreEvent(true);
			
			if (cmbArt.getValue()-1 == ARTICULATIONS.LEGATO) //Current articulation is legato
			{				
				Synth.isSustainPedalDown() ? legatoHandler.setAttribute(11, 1) : legatoHandler.setAttribute(11, 0); //Toggle same note legato based on sustain pedal position
			}
			else if (cmbArt.getValue()-1 == ARTICULATIONS.GLIDE && !Synth.isSustainPedalDown()) //Current articulation is glide and sustain pedal is lifted
			{
				//Change articulation to legato
				cmbArt.setValue(ARTICULATIONS.LEGATO+1);
				changeArticulation(ARTICULATIONS.LEGATO);
				asyncUpdater.setFunctionAndUpdate(displayArticulationValues, ARTICULATIONS.LEGATO);
			}	
		}
	}
	
	inline function onControlCB(number, value)
	{
		switch (number)
		{
			case cmbArt: //Articulation selector
				changeArticulation(value-1);
				displayArticulationValues(value-1);
			break;
			
			case sliOffset:
				legatoHandler.setAttribute(9, 1-(value/100));
			break;
			
			case sliRatio:
				legatoHandler.setAttribute(8, value);
			break;
			
			case sliGlide:
				legatoHandler.setAttribute(10, value);
				lblGlideValue.set("text", rates[value]);
			break;
			
			case btnGlideMode:
				legatoHandler.setAttribute(3, value);
			break;
			
			default:		
				for (var i = 0; i < articulationNames.length; i++)
				{
					if (number == cmbKs[i]) //Key switch drop down
					{
						if (value-1 < playableRange[0] || value-1 > playableRange[1]) //Make sure selected KS is outside the playable range
						{
							keyswitches[i] = value-1; //Update articulation's KS
							setKsColours(); //Update KS colours	
						}
						else
						{
							cmbKs[i].setValue(keyswitches[i]+1); //Restore ks to previously set value
							cmbKs[i].repaint();
						}
						break;
					}
					else if (number == cmbUacc[i])
					{
						uacc[i] = value; //Update UACC assigned to articulation
						break;
					}
					else if (cmbArt.getValue()-1 != ARTICULATIONS.LEGATO && cmbArt.getValue()-1 != ARTICULATIONS.GLIDE) //Ignore if legato or glide selected
					{
						if (number == sliAttack[i]) //Attack slider
						{
							for (e in envelopes[i])
							{
								e.setAttribute(e.Attack, value);
							}
							
							//Legato and Glide share the same envelope settings as sustain
							if (i == ARTICULATIONS.SUSTAIN)
							{
								sliAttack[ARTICULATIONS.LEGATO].setValue(value);
								sliAttack[ARTICULATIONS.GLIDE].setValue(value);
							}
							break;
						}
						else if (number == sliRelease[i]) //Release slider
						{
							for (e in envelopes[i])
							{
								e.setAttribute(e.Release, value);
							}
								
							//Legato and Glide share the same envelope settings as sustain
							if (i == ARTICULATIONS.SUSTAIN)
							{
								sliRelease[ARTICULATIONS.LEGATO].setValue(value);
								sliRelease[ARTICULATIONS.GLIDE].setValue(value);
							}
							break;
						}
					}
				}
			break;
		}
	}
	
	//Set the colour of keyswitches on the on screen keyboard to red and any other keys (that are outside the playable range) to white
	inline function setKsColours()
	{
		for (i = 0; i < 128; i++)
		{
			if (i < playableRange[0] || i > playableRange[1])  Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Reset colour of all keys outside of playable range
			if (keyswitches.contains(i)) Engine.setKeyColour(i, Colours.withAlpha(Colours.red, 0.3)); //Set colour of key switches
		}
	}
	
	/* changeArticulation
	 *
	 * Enables the mute button on all articulation MIDI muters and disables the mute button for the articulation with the passed artIndex.
	 * If the artIndex refers to one of the sustain, legato, glide script articulations it also enables the correct attribute on that script.
	 *
	*/
	inline function changeArticulation(artIndex)
	{
		if (artIndex >= 0) //Sanity test
		{
			//Mute all articulations by default
			for (m in muters)
			{
				if (m != undefined) m.setAttribute(0, 1);
			}
		
			if (artIndex >= ARTICULATIONS.SUSTAIN && artIndex <= ARTICULATIONS.GLIDE) //Sustain, Legato, Glide
			{
				muters[ARTICULATIONS.SUSTAIN].setAttribute(0, 0); //Unmute sustain container
				legatoHandler.setAttribute(artIndex, 1); //Select legato handler mode - sustain/legato/glide
				changeRRSettings(); //Update the RR settings - part of front interface script
				
				if (artIndex == ARTICULATIONS.SUSTAIN)
				{
					sustainReleaseHandler.setAttribute(1, 0); //Disable release handler legato mode
				}
				else 
				{
					sustainReleaseHandler.setAttribute(1, 1); //Enable release handler legato mode
				}
			}
			else
			{
				muters[artIndex].setAttribute(0, 0); //Unmute articulation
			}	
		}
	}
	
	//Display the keyswitch and UACC assignments for the articulation (artIndex)
	inline function displayArticulationValues(artIndex)
	{
		if (artIndex >= 0) //Sanity test
		{
			//Hide articulation controls		
			for (var i = 0; i < articulationNames.length; i++)
			{
				cmbKs[i].set("visible", false);
				cmbUacc[i].set("visible", false);
				sliAttack[i].set("visible", false);
				sliRelease[i].set("visible", false);
			}
						
			//Show/hide controls for artIndex		
			if (cmbArt.getValue() != artIndex+1) cmbArt.setValue(artIndex+1);
			cmbKs[artIndex].set("visible", true);
			cmbUacc[artIndex].set("visible", true);
		
			lblOffset.set("visible", false);
			lblRatio.set("visible", false);
			lblGlide.set("visible", false);
			lblGlideMode.set("visible", false);
			sliOffset.set("visible", false);
			sliRatio.set("visible", false);
			sliGlide.set("visible", false);
			lblGlideValue.set("visible", false);
			btnGlideMode.set("visible", false);
			
			if (artIndex != ARTICULATIONS.LEGATO && artIndex != ARTICULATIONS.GLIDE) //Not legato or glide
			{
				lblAttack.set("visible", true);
				lblRelease.set("visible", true);				
				sliAttack[artIndex].set("visible", true);
				sliRelease[artIndex].set("visible", true);
			}
			else 
			{
				lblAttack.set("visible", false);
				lblRelease.set("visible", false);				
				
				if	(artIndex == ARTICULATIONS.LEGATO) //Legato specific controls
				{
					lblOffset.set("visible", true);
					lblRatio.set("visible", true);
					sliOffset.set("visible", true);
					sliRatio.set("visible", true);			
				}
				else //glide
				{
					lblGlide.set("visible", true);
					lblGlideMode.set("visible", true);
					sliGlide.set("visible", true);
					lblGlideValue.set("visible", true);
					btnGlideMode.set("visible", true);				
				}
			}

			//Repaint controls
			cmbArt.repaint();
			cmbKs[artIndex].repaint();
			cmbUacc[artIndex].repaint();
		}
	}
	
	//Set's the glide value slider to v
	inline function updateGlideSlider(v)
	{
		sliGlide.setValue(v);
		lblGlideValue.set("text", rates[v]);
		sliGlide.repaint();
	}
}