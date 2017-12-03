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
		const var leftZone = ui.panel(10, 12, {width:200, height:225, id:"aeLeftZone", paintRoutine:function(g){g.fillAll(Theme.ZONE);}, parentComponent:tab.getPanelId(tabs[0])}); //Outer parent
		
		const var lblTitle = ui.label(0, 3, {width:200, height:25, text:"Articulation Editor", textColour:Theme.H1, fontSize:16, fontStyle:"Bold", alignment:"centred", parentComponent:"aeLeftZone"});		
		
		//Headings
		const var lblArt = ui.label(5, 42, {width:85, height:25, text:"Articulation", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblKs = ui.label(5, 77, {width:85, height:25, text:"Key Switch", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblUacc = ui.label(5, 112, {width:85, height:25, text:"UACC", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblAttack = ui.label(5, 147, {width:85, height:25, text:"Attack", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblRelease = ui.label(5, 182, {width:85, height:25, text:"Release", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblOffset = ui.label(5, 147, {width:85, height:25, text:"Offset", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblRatio = ui.label(5, 180, {width:85, height:25, text:"Fade Ratio", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblGlide = ui.label(5, 147, {width:85, height:25, text:"Rate", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		const var lblGlideMode = ui.label(5, 180, {width:85, height:25, text:"Whole Step", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"aeLeftZone"});
		
		//Articulation dropdown
		const var cmbArt = ui.comboBoxPanel(90, 42, {width:100, height:25, text:"Articulation", items:articulationNames, paintRoutine:paintRoutines.dropDown, parentComponent:"aeLeftZone"});
		
		//One set of controls per articulation
		const var cmbKs = []; //Key switch selector
		const var cmbUacc = []; //UACC selector
		const var sliAttack = []; //Attack slider
		const var sliRelease = []; //Release slider
		
		for (i = 0; i < articulationNames.length; i++)
		{
			cmbKs.push(ui.comboBoxPanel(90, 77, {width:100, height:25, text:"Key Switch", items:noteNames, paintRoutine:paintRoutines.dropDown, parentComponent:"aeLeftZone"}));	
			cmbUacc.push(ui.comboBoxPanel(90, 112, {width:100, height:25, text:"UACC", items:uaccValues, paintRoutine:paintRoutines.dropDown, parentComponent:"aeLeftZone"}));
			sliAttack.push(ui.knob(90, 147, {width:100, height:25, style:"Horizontal", min:5, max:5000, middlePosition:1000, defaultValue:5, suffix:"ms", stepSize:1, bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:Theme.SLIDER_TEXT, parentComponent:"aeLeftZone"}));
			sliRelease.push(ui.knob(90, 182, {width:100, height:25, style:"Horizontal", min:25, max:20000, middlePosition:1000, defaultValue:350, suffix:"ms", stepSize:1, bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:Theme.SLIDER_TEXT, parentComponent:"aeLeftZone"}));
		}
		
		//Change default attack slider value for sustain articulation
		sliAttack[ARTICULATIONS.SUSTAIN].set("defaultValue", 300);
			
		//Add extra controls for legato and glide articulations
		const var sliOffset = ui.knob(90, 147, {width:100, height:25, style:"Horizontal", min:0, max:100, middlePosition:40, defaultValue:25, stepSize:0.1, suffix:"%", bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:Theme.SLIDER_TEXT, parentComponent:"aeLeftZone"});
		const var sliRatio = ui.knob(90, 182, {width:100, height:25, style:"Horizontal", min:20, max:100, defaultValue:100, stepSize:1, suffix:"%", bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:Theme.SLIDER_TEXT, parentComponent:"aeLeftZone"});
		const var sliGlide = ui.knob(90, 147, {width:100, height:25, style:"Horizontal", min:0, max:11, defaultValue:5, stepSize:1, bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:0, parentComponent:"aeLeftZone"});
		const var lblGlideValue = ui.label(90, 147, {width:100, height:25, textColour:Theme.SLIDER_TEXT, alignment:"centred", parentComponent:"aeLeftZone"});
		const var btnGlideMode = ui.buttonPanel(90+50, 180, {width:50, height:25, paintRoutine:paintRoutines.toggleButton, parentComponent:"aeLeftZone"});		
		
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
						keyswitches[i] = value-1; //Update articulation's KS
						setKsColours(); //Update KS colours
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
			if (i < playableRange[0] || i > playableRange[1]) ui.resetKeyColour(i); //Reset colour of all keys outside of playable range
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
		
			if (artIndex != ARTICULATIONS.LEGATO && artIndex != ARTICULATIONS.GLIDE) //Not legato or glide
			{
				lblOffset.set("visible", false);
				lblRatio.set("visible", false);
				lblGlide.set("visible", false);
				lblGlideMode.set("visible", false);
				sliOffset.set("visible", false);
				sliRatio.set("visible", false);
				sliGlide.set("visible", false);
				lblGlideValue.set("visible", false);
				btnGlideMode.set("visible", false);
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