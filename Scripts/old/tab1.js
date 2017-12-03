namespace tab1
{
	inline function initCallback()
	{
		const var TAB_ID = 1;
		const var tabPanel = uiTab.getPanelName(tabs[TAB_ID]);

		const var ROWS_TO_SHOW = 5; //Number of articulation rows to display on screen at a time

		const var sustainControlPanel = Synth.getMidiProcessor("sustainControlPanel"); //Control panel script in sustain container
		const var playableRangeScript = Synth.getMidiProcessor("playableRange"); //Get playable range script processor

		const var playableRange = [playableRangeScript.getAttribute(0), playableRangeScript.getAttribute(1)] //Playable range, from playable range script
		const var UACC = 32; //The controller number for universal articulation control

		const var keySwitches = []; //All keyswitches assigned, each index refers to same index in arts array
		const var uaccs = []; //All UACC settings that are assigned as articulation triggers - indexes are the same as arts array
		const var arts = []; //Articulation objects

		const var containerNames = Synth.getIdList("Container"); //Names of all containers - one container per artiulation, excluding master and main
		const var sustainControls = {SUSTAIN:0, LEGATO:1, GLIDE:2, TRILL:3, SAME_NOTE:4, WHOLE_TONE:5}; //Sustain control panel script buttons

		//GUI

		//Manually created articulations
		arts.push(Articulation.define("sustain", false));
		arts.push(Articulation.define("Legato", true));
		arts.push(Articulation.define("Glide", true));
		arts.push(Articulation.define("Trill", true));

		//AUTOGENERATE ARTICULATION LIST BASED ON CONTAINER AND MIDI PROCESSOR NAMES
		for (containerName in containerNames)
		{
			if (containerName == containerNames[0]) continue; //Ignore master container
			if (containerName == containerNames[1]) continue; //Ignore first child container
			if (Engine.matchesRegex(containerName, "(sustain)") == true) continue; //Skip sustain container
			if (Engine.matchesRegex(containerName, "(exclude)") == true) continue; //Skip containers with exclude in their name

			arts.push(Articulation.define(containerName, false)); //Create articulation
		}

		//Create scrollBox object for scrolling through the articulation edtior GUI controls
		const var scroller = scrollBox.addContainer("art", 584, 142, 26, 71, -1, -1, arts.length, 30)
		scrollBox.getViewport(scroller).set("parentComponent", tabPanel); //Assign parent to scrollBox

		//Scroll up and down arrows
		const var btnDn = ui.button(40, 54, {width:12, height:10, filmstripImage:"downArrow.png", parentComponent:tabPanel});
		const var btnUp = ui.button(26, 54, {width:12, height:10, filmstripImage:"upArrow.png", parentComponent:tabPanel});

		//Populate KS and UACC menu item arrays
		const var menuItems = {ks:[], Uacc:[]}; //GUI menu items
		for (i = 0; i < 128; i++)
		{
			menuItems.ks[i] = Engine.getMidiNoteName(i);
			if (i > 0) menuItems.Uacc[i-1] = i;
		}

		menuItems.Uacc.push("None");
		menuItems.ks.push("None");

		//MAIN ARTICULATION SETTING CONTROLS
		reg articulationName; //For formatting the articulation name
		reg scrollContainer = scrollBox.getContainerName(scroller); //Name of the scrollbox container - used as parent of other controls
		const var gui = {state:[], name:[], ks:[], uacc:[], purge:[], attack:[], release:[]}; //Main GUI controls types

		for (i = 0; i < arts.length; i++) //Each articulation
		{
			articulationName = capitalizeString(Articulation.getId(arts[i])); //Capitalise the articulation name for UI

			gui.name[i] = ui.label(35, 30*i, {width:110, height:20, text:articulationName, textColour:"4282194451", fontName:"Josefin Sans", fontStyle:"Bold", fontSize:22, parentComponent:scrollContainer});
			gui.state[i] = ui.button(0, 30*i, {width:100, height:20, filmstripImage:"radioButton.png", radioGroup:1, parentComponent:scrollContainer});			
			gui.ks[i] = ui.comboBox(178, 30*i, {width:106, height:20, itemColour:0, itemColour2:0, bgColour:0, text:"Key Switch", items:menuItems.ks, parentComponent:scrollContainer});
			gui.uacc[i] = ui.comboBox(298, 30*i, {width:106, height:20, itemColour:0, itemColour2:0, bgColour:0, text:"UACC", items:menuItems.Uacc, parentComponent:scrollContainer});
			
			//Scripted articulations don't have their own envelope and purge controls
			if (Articulation.getIsScripted(arts[i]) == false)
			{
				gui.purge[i] = ui.button(420, 30*i, {width:40, height:20, filmstripImage:"toggleSwitch.png", parentComponent:scrollContainer});
				gui.attack[i] = ui.knob(480, 30*i, {width:100, height:10, mode:"Time", max:5000, defaultValue:5, middlePosition:2500, filmstripImage:"fader.png", numStrips:128, dragDirection:"Horizontal", parentComponent:scrollContainer});
				gui.release[i] = ui.knob(480, 10+30*i, {width:100, height:10, mode:"Time", max: 5000, defaultValue:350, middlePosition:2500, filmstripImage:"fader.png", numStrips:128, dragDirection:"Horizontal", parentComponent:scrollContainer});
			}
		}

		const var postInit = ui.button(0, 0, {visible:false}); //Hidden button to trigger last control callback on init
		Synth.sendController(64, 0); //Sustain pedal is off by default
	}

	//FUNCTIONS
	inline function changeArticulation(n)
	{
		reg artId = Articulation.getId(arts[n]); //Get articulation's ID

		//Mute all articulations
		for (art in arts)
		{
			Articulation.mute(art);
		}

		//If one of the sustain articulations was passed then unmute sustain
		if (["sustain", "Legato", "Glide", "Trill"].contains(artId))
		{
			sustainControlPanel.setAttribute(n, 1); //Activate the button (sustain, legato, glide, trill) on sustain container's control panel
			Articulation.unmute(arts[0]); //Unmute sustain container
			Articulation.setState(arts[n], 1); //Set mute state for articulation n
		}
		else
		{
			sustainControlPanel.setAttribute(0, 1); //Mute the Legato, Glide, and Trill scripts
			Articulation.unmute(arts[n]); //Turn on given articulation
		}

		//Turn off all articulation state buttons and turn on the one for articulation n
		for (button in gui.state)
		{
			button.setValue(0);
		}

		gui.state[n].setValue(1); //Activate the articulation button
	}

	//Callbacks
	inline function onNoteOnCallback()
	{
		if (keySwitches.indexOf(Message.getNoteNumber()) != -1) //A keyswitch triggered the callback
		{
			changeArticulation(keySwitches.indexOf(Message.getNoteNumber()));

			//Scroll to active articulation
			if (keySwitches.indexOf(Message.getNoteNumber()) > (ROWS_TO_SHOW-1))
			{
				scrollBox.setVOffset(scroller, Math.floor(keySwitches.indexOf(Message.getNoteNumber())) - (ROWS_TO_SHOW-1));
				scrollBox.vScroll(scroller, 30);
			}
			else 
			{
				scrollBox.setVOffset(scroller, 0);
				scrollBox.vScroll(scroller, 30);
			}

			Message.ignoreEvent(true); //Don't allow any further processing from this event
		}
		else 
		{
			if (!inRange(Message.getNoteNumber(), playableRange[0], playableRange[1])) //Outside of playable range
			{
				Message.ignoreEvent(true);
			}
		}	
	}

	inline function onNoteOffCallback()
	{
		//Ignore key switches and notes that are out of playable range
		if (keySwitches.indexOf(Message.getNoteNumber()) != -1 || !inRange(Message.getNoteNumber(), playableRange[0], playableRange[1]))
		{
			Message.ignoreEvent(true);
		}
	}

	inline function onControllerCallback()
	{
		//If the UACC controller triggered the callback change to the assigned articulation, if any
		if (Message.getControllerNumber() == UACC)
		{
			if (uaccs.indexOf(Message.getControllerValue()) != -1)
			{
				changeArticulation(uaccs.indexOf(Message.getControllerValue()));
			}
		}
	}

	inline function onTimerCallback()
	{	
	}

	inline function onControlCallback(number, value)
	{
		for (i = 0; i < arts.length; i++) //Each articulation
		{
			//Articulation state button
			if (number == gui.state[i])
			{
				changeArticulation(i);
			}

			//Key switch menus
			if (number == gui.ks[i])
			{
				if (value < number.get("max")) //None is not selected
				{
					//Key switch is not already assigned and is outside of playable range
					if (keySwitches.indexOf(value-1) == -1 && !inRange(value-1, playableRange[0], playableRange[1]))
					{
						//Reset the key switch colour before assigning a new KS
						if (Articulation.getKs(arts[i]) != undefined) resetKeyColour(Articulation.getKs(arts[i]));

						Articulation.setKs(arts[i], value-1);
						keySwitches[i] = value-1; //Store KS in array
						Engine.setKeyColour(value-1, Colours.withAlpha(Colours.red, 0.3)); //Key switches are red					
					}
					else 
					{
						number.setValue(parseInt(keySwitches[i]+1)); //Set drop down menu back to previously assigned KS
					}

				}
				else 
				{
					keySwitches[i] = undefined;
					Articulation.setKs(arts[i], undefined);
					number.setValue(undefined);
				}

				break;
			}

			//UACC menus
			if (number == gui.uacc[i])
			{
				if (uaccs.indexOf(value) == -1 || value == number.get("max")) //UACC number is not already assigned
				{
					value < number.get("max") ? Articulation.setUacc(arts[i], value) : number.setValue(undefined);
					uaccs[i] = value; //Store UACC value in array
				}
				else 
				{
					number.setValue(uaccs[i]);
				}

				break;
			}

			//Purge button
			if (number == gui.purge[i])
			{
				Articulation.purge(arts[i], value);
			}

			//Attack knob
			if ((Articulation.getIsScripted(arts[i]) == false) && number == gui.attack[i])
			{
				Articulation.setAttack(arts[i], value);
				number.set("tooltip", "Attack: " + value + "ms"); //Use tooltip to display value
				break;
			}

			//Release knob
			if ((Articulation.getIsScripted(arts[i]) == false) && number == gui.release[i])
			{
				Articulation.setRelease(arts[i], value);
				number.set("tooltip", "Release: " + value + "ms"); //Use tooltip to display value
				break;
			}
		}

		//Scroll down and up buttons
		if (number == btnDn)
		{
			scrollBox.setVOffset(scroller, scrollBox.getVOffset(scroller)+1);
			scrollBox.vScroll(scroller, 30);
			btnDn.setValue(0);
		}

		if (number == btnUp)
		{
			scrollBox.setVOffset(scroller, scrollBox.getVOffset(scroller)-1);
			scrollBox.vScroll(scroller, 30);
			btnUp.setValue(0);
		}

		//Post init event trigger
		if (number == postInit)
		{
			changeArticulation(0); //First articulation activated by default
		}
	}
}