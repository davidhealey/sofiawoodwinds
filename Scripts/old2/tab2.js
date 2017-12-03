namespace tab2
{
	inline function initCB()
	{	
		const var tabPanel = tab.getPanelId(tabs[2]);
		
		// Create a storage panel, hide it, and save it in the preset
		const var presetStorage = Content.addPanel("presetStorage", 0, 0);
		presetStorage.set("visible", false);
		presetStorage.set("saveInPreset", true);

		// Create object that will hold the preset values for this tab.
		var data = {ks:[24, 25, 26], uacc:[1, 2, 3], attack:[], release:[], userCC:[-1, 1, 11, 20, 21, 22, 23], paramValue:[]};

		// Set the storage as widget value for the hidden panel.
		// Important: this will not clone the object but share a reference!
		presetStorage.setValue(data);

		//ID Lists and Modules
		const var containerList = Synth.getIdList("Container"); //Get containers ids
		const var muterList = Synth.getIdList("MidiMuter"); //Get MIDI Muter IDs
		const var envelopeIds = Synth.getIdList("Simple Envelope");

		//Midi Processors
		reg legatoHandler = Synth.getMidiProcessor("legatoHandler"); //Control panel for switching between sustain, legato, glide
		
		//Variables
		const var UACC_NUM = 32;
		const var articulationNames = ["sustain", "legato", "glide"]; //Default articulation names, more will be picked up from container ID
		const var keyswitches = [];
		const var controllerNumbers = [];
		const var uaccValues = ["Disabled"];
		reg tblResponse = []; //To store response curve tables - one per parameter
		reg realCC = [-1, 1, 11, 20, 21, -2, 23]; //Actual CC numbers assigned to modulators, -1 means internal CC, -2 is internal CC tempo sync mode
		reg rates = ["1/1", "1/2", "1/2T", "1/4", "1/4T", "1/8", "1/8T", "1/16", "1/16T", "1/32", "1/32T", "Velocity"];
		reg muters = []; //MIDI Muter modules - every articulation must have a MIDI muter with an ID that includes its container's ID
		reg envelopes = {}; //Simple envelopes for each articulation
		
		for (i = 0; i < 128; i++)
		{
			keyswitches.push(Engine.getMidiNoteName(i));
			if (i > 0) controllerNumbers.push(i); //User can assign controllers greater than 0
			if (i > 0) uaccValues.push(i); //UACC choices must be greater than 0
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
				muters[i] = Synth.getMidiProcessor(m);
			}
			
			//Find envelopes for each articulation
			for (e in envelopeIds)
			{
				if (e.indexOf(articulationNames[i]) == -1 || e.indexOf("Release") != -1 || e.indexOf("Envelope") == -1) continue;
				if (envelopes[i] == undefined) envelopes[i] = [];
				envelopes[i].push(Synth.getModulator(e));
			}
			articulationNames[i] = capitalizeString(articulationNames[i]); //Capitalise the articulation name
		}
		
		//GUI		
		//Articulation Editor
		const var lblArtHeading = ui.label(29, 59, {width:100, height:25, text:"Articulation", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblKsHeading = ui.label(29, 94, {width:100, height:25, text:"Key Switch", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblUaccHeading = ui.label(29, 129, {width:100, height:25, text:"UACC", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});		
		const var lblAttackHeading = ui.label(29, 162, {width:100, height:25, text:"Attack", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});		
		const var lblReleasekHeading = ui.label(29, 195, {width:100, height:25, text:"Release", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});		
		const var cmbArt = ui.comboBoxPanel(155, 61, {width:100, height:20, text:"Articulation", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:articulationNames});
		const var cmbKs = ui.comboBoxPanel(155, 96, {width:100, height:20, text:"Key Switch", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:keyswitches});
		const var cmbUacc = ui.comboBoxPanel(155, 131, {width:100, height:20, text:"UACC", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:uaccValues});
		const var sliAttack = ui.sliderPanel(155, 164, {width:100, height:20, min:0, max:5000, stepSize:1, sensitivity:0.03, paintRoutine:sliderPaint, parentComponent:tabPanel});
		const var lblAttack = ui.label(255, 162, {width:75, height:25, text:"", textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, alignment:"left", parentComponent:tabPanel});
		const var sliRelease = ui.sliderPanel(155, 197, {width:100, height:20, min:0, max:10000, stepSize:1, sensitivity:0.01, paintRoutine:sliderPaint, parentComponent:tabPanel});
		const var lblRelease = ui.label(255, 195, {width:75, height:25, text:"", textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, alignment:"left", parentComponent:tabPanel});
		
		//Parameter Editor
		const var lblParamHeading = ui.label(329, 59, {width:100, height:25, saveInPreset:false, text:"Parameter", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblCcHeading = ui.label(329, 94, {width:100, height:25, saveInPreset:false, text:"Controller", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblValueHeading = ui.label(329, 129, {width:100, height:25, saveInPreset:false, text:"Value", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblResponseHeading = ui.label(329, 162, {width:120, height:25, saveInPreset:false, text:"Response Curve", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var pnlBg = ui.panel(455, 162, {width:160, height:63, parentComponent:tabPanel, paintRoutine:function(g){g.fillAll(0xFF333333);}});
		
		const var cmbParam = ui.comboBoxPanel(455, 61, {width:100, height:20, text:"Parameter", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:PARAMETERS.LABELS});
		const var cmbCc = ui.comboBoxPanel(455, 96, {width:100, height:20, text:"Controller", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:controllerNumbers});
		
		const var sliValue = ui.sliderPanel(455, 129, {width:100, height:20, min:0, max:127, stepSize:0.1, sensitivity:1, paintRoutine:sliderPaint, parentComponent:tabPanel});
		const var lblParam = ui.label(565, 129, {width:75, height:25, text:"", textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, alignment:"left", parentComponent:tabPanel});
				
		//Add parameter names to cmbParam and create response curve table for each parameter
		for (p in PARAMETERS.LABELS)
		{
			tblResponse.push(ui.table(455, 162, {width:160, height:63, parentComponent:tabPanel, visible:false})); //Add a response curve table for each parameter - hide by default
		}
	}
	
	inline function onNoteCB(noteNumber, velocity)
	{
		if (data.ks.contains(noteNumber)) //A KS triggered callback
		{
			cmbArt.setValue(data.ks.indexOf(noteNumber)+1);
			changeArticulation(cmbArt.getValue()-1);		
			displayArticulationValues(cmbArt.getValue()-1);
		}
		else 
		{
			//If the current articulation is legato, two notes are held, and the sustain pedal is down, trigger the glide mode
			if (cmbArt.getValue()-1 == ARTICULATIONS.LEGATO && Synth.isLegatoInterval() && Synth.isSustainPedalDown())
			{
				cmbArt.setValue(ARTICULATIONS.GLIDE+1);				
				changeArticulation(cmbArt.getValue()-1);				
				displayArticulationValues(cmbArt.getValue()-1);
			}
		
			//Scale the velocity to the velocity response curve	
			parameterResponseHandler(PARAMETERS.VELOCITY, Message.getVelocity());
			updateParamLabelText(PARAMETERS.VELOCITY);
			Message.setVelocity(Math.round(data.paramValue[PARAMETERS.VELOCITY]));			
		}
	}
	
	inline function onControllerCB(CC, value)
	{
		if (CC == UACC_NUM && value > 0) //UACC
		{
			if (data.uacc.contains(value)) //Triggered UACC value is assigned to an articulation
			{			
				changeArticulation(cmbArt.getValue()-1);				
				displayArticulationValues(cmbArt.getValue()-1);
			}
		}		
		else if (CC == 64) //Sustain Pedal
		{
			if (cmbArt.getValue()-1 == ARTICULATIONS.LEGATO) //Current articulation is legato
			{
				Synth.isSustainPedalDown() ? legatoHandler.setAttribute(12, 1) : legatoHandler.setAttribute(12, 0); //Toggle same note legato based on sustain pedal position
			}
			else if (cmbArt.getValue()-1 == ARTICULATIONS.GLIDE && !Synth.isSustainPedalDown()) //Current articulation is glide and sustain pedal is lifted
			{
				cmbArt.setValue(ARTICULATIONS.LEGATO+1);
				changeArticulation(cmbArt.getValue()-1);
				displayArticulationValues(cmbArt.getValue()-1);
			}	
		}
		else if (data.userCC.contains(CC)) //A user assigned CC
		{
			Message.ignoreEvent(true);
			
			//Redirect incoming user CC to each realCC it's mapped to - or to elsewhere for internal CCs
			for (i = 1; i < data.userCC.length; i++) //Start at 1 to skip velocity which is handled in onNoteCB
			{
				if (CC == data.userCC[i]) //CC that triggered the callback has been assigned to index (i)
				{
					parameterResponseHandler(i, value);
					if (cmbParam.getValue()-1 == i) sliValue.setValue(value); //Set sliValue's value if parameter is currently selected
				}
			}			
			updateParamLabelText(cmbParam.getValue()-1);
		}
	}
	
	inline function onControlCB(number, value)
	{
		switch (number)
		{ 		
			case presetStorage:
				if (typeof presetStorage.getValue() == "object") data = presetStorage.getValue(); //Restore data from panel	
			break;
		
			case cmbArt:
				changeArticulation(value-1);				
				displayArticulationValues(value-1);
			break;
			
			case cmbKs:		
				data.ks[cmbArt.getValue()-1] = value-1; //Assign new KS
				setKsColours(); //Update KS colours
			break;

			case cmbUacc:
				data.uacc[current] = value-1;
			break;
			
			case sliAttack:
				for (e in envelopes[cmbArt.getValue()-1])
				{
					e.setAttribute(e.Attack, value);
				}
				data.attack[cmbArt.getValue()-1] = value;
				lblAttack.set("text", Math.round(value) + " ms");
			break;
		
			case sliRelease:
				for (e in envelopes[cmbArt.getValue()-1])
				{
					e.setAttribute(e.Release, value);
				}
				data.release[cmbArt.getValue()-1] = value;
				lblRelease.set("text", Math.round(value) + " ms");
			break;
			
			case cmbParam:
				if (value-1 != PARAMETERS.VELOCITY)
				{
					cmbCc.set("enabled", true);
					sliValue.set("enabled", true);
					cmbCc.setValue(data.userCC[value-1]); //Display selected CC for the param
					sliValue.setValue(data.paramValue[value-1]); //Display saved CC value for param
				}
				else
				{
					cmbCc.set("enabled", false); //Disable CC dropdown when velocity selected
					sliValue.set("enabled", false); //Disable CC value knob
					lblParam.set("text", " ");
					cmbCc.setValue(undefined);
				}
				
				updateParamLabelText(value-1);
				cmbCc.repaint(); // runs the paint routine and repaints the component
				sliValue.repaint();
				
				//Hide all response tables
				for (t in tblResponse)
				{
					t.set("visible", false);
				}
				tblResponse[value-1].set("visible", true); //Show response table for selected parameter
			break;
			
			case cmbCc:
				data.userCC[cmbParam.getValue()-1] = value; //Store selected user CC for param
			break;
			
			case sliValue:
				parameterResponseHandler(cmbParam.getValue()-1, value);
				updateParamLabelText(cmbParam.getValue()-1);
			break;
		}	
	}
	
	//FUNCTIONS
	
	/* changeArticulation
	 *
	 * Enables the mute button on all articulation MIDI muters and disables the mute button for the articulation with the passed artIndex.
	 * If the artIndex refers to one of the sustain, legato, glide script articulations it also enables the correct attribute on that script.
	 *
	*/
	inline function changeArticulation(artIndex)
	{
		//Mute all articulations by default
		for (m in muters)
		{
			if (m != undefined) m.setAttribute(0, 1);
		}
						
		if (artIndex >= ARTICULATIONS.SUSTAIN && artIndex <= ARTICULATIONS.GLIDE) //Sustain, Legato, Glide
		{
			muters[0].setAttribute(0, 0); //Unmute sustain container
			legatoHandler.setAttribute(artIndex, 1);
		}
		else
		{
			muters[artIndex].setAttribute(0, 0); //Unmute
		}
	}
	
	//Set the colour of keyswitches on the on screen keyboard to red and any other keys (that are outside the playable range) to white
	inline function setKsColours()
	{
		for (i = 0; i < 128; i++)
		{
			if (i <= playableRange[0] || i >= playableRange[1]) ui.resetKeyColour(i); //Reset colour of all keys outside of playable range
			if (data.ks.contains(i)) Engine.setKeyColour(i, Colours.withAlpha(Colours.red, 0.3)); //Set colour of key switches
		}
	}
	
	//Display the keyswitch and UACC assignments for the articulation (artIndex)
	inline function displayArticulationValues(artIndex)
	{
		if (data.ks[artIndex] != undefined) cmbKs.setValue(data.ks[artIndex]+1);
		if (data.uacc[artIndex] != undefined) cmbUacc.setValue(data.uacc[artIndex]+1);
		cmbKs.repaint(); // runs the paint routine and repaints the component
		cmbUacc.repaint(); // runs the paint routine and repaints the component
		
		//Attack and release sliders
		if (artIndex == ARTICULATIONS.LEGATO || artIndex == ARTICULATIONS.GLIDE) //Not used for scripted articulations
		{
			sliAttack.set("enabled", false);
			sliRelease.set("enabled", false);
		}
		else 
		{
			sliAttack.set("enabled", true);
			sliRelease.set("enabled", true);
			if (data.attack[artIndex] != undefined) sliAttack.setValue(data.attack[artIndex]);
			if (data.release[artIndex] != undefined) sliRelease.setValue(data.release[artIndex]);
		}
		sliAttack.repaint();
		sliRelease.repaint();
	}
	
	/*
	 * parameterResponseHandler
	 *
	 * Takes the paramIndex (enum) and current value of the parameter and uses the parameter's response table to 
	 * scale the parameter value and output it as appropriate depending on the type of parameter.
	*/
	inline function parameterResponseHandler(paramIndex, value)
	{
		reg tableValue = tblResponse[paramIndex].getTableValue(value); //Convert the input value (0-127) to the table value (0.0 - 1.0)
		data.paramValue[paramIndex] = (127 / 100) * (tableValue * 100); //Treat tableValue as a percentage to scale the value
	
		if (realCC[paramIndex] == -1) //Internal parameters (including velocity)
		{
		}
		else if (realCC[paramIndex] == -2) //Tempo sync CC
		{
			switch (paramIndex)
			{
				case PARAMETERS.GLIDE_RATE: //Glide feature is part of legatoHandler script
					legatoHandler.setAttribute(11, Math.floor((data.paramValue[paramIndex] * 12) / 128)); //Convert CC value to tempo sync scale (0-11)	
				break;
			}
		}
		else //Normal user CC to just pass to real CC
		{
			Synth.sendController(realCC[paramIndex], Math.round(data.paramValue[paramIndex]));
		}
	}
	
	/*
	 * updateParamLabelText
	 *
	 * If the parameter currently selected in cmbParam is the same as the passed paramIndex then the value of that parameter 
	 * is set as the text for the lblParam label.
	*/
	inline function updateParamLabelText(paramIndex)
	{
		reg text;

		//Only update the label if the currently selected parameter is for the ID that is passed
		if (cmbParam.getValue()-1 == paramIndex && typeof data.paramValue[paramIndex] == "number")
		{
			if (realCC[paramIndex] == -1)
			{
				text = Math.round(data.paramValue[paramIndex]);
			}
			else if (realCC[paramIndex] == -2) //Tempo sync
			{
				text = rates[Math.floor((data.paramValue[paramIndex] * 12) / 128)];
			}
			else 
			{
				text = Math.ceil(data.paramValue[paramIndex]);
			}
			
			lblParam.set("text", text); //Set the label's text
		}	
	}
}