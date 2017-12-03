namespace tab2
{
	inline function initCallback()
	{
		const var TAB_ID = 2
		const var tabPanel = uiTab.getPanelName(tabs[TAB_ID]);

		const var ccMenuItems = [""];
		const var processors = {}; //Script processors

		const var controllerNames = ["Dynamics", "Expression", "Vibrato Depth", "Vibrato Rate", "Blend", "Glide Rate", "Trill Rate", "Velocity"];
		const var ccMap = [1, 11, 20, 21, 23, -1, -1]; //Indexes a particular controller - controllerNames indexes are the same
		const var userCcMap = []; //User selected CCs - these are forwarded to the CCs of the ccMap array

		processors.glide = Synth.getMidiProcessor("Glide");
		processors.trill = Synth.getMidiProcessor("Trill");

		//GUI 

		//Create scrollBox object for scrolling through the articulation edtior GUI controls
		const var scroller = scrollBox.addContainer("ccs", 587, 148, 20, 68, -1, -1, ccMap.length, 30)
		scrollBox.getViewport(scroller).set("parentComponent", tabPanel); //Assign parent to scrollBox

		//Scroll up and down arrows
		const var btnDn = ui.button(40, 54, {width:12, height:10, filmstripImage:"downArrow.png", parentComponent:tabPanel});
		const var btnUp = ui.button(26, 54, {width:12, height:10, filmstripImage:"upArrow.png", parentComponent:tabPanel});

		//Populate CC menu items array
		for (i = 1; i < 100; i++)
		{
			ccMenuItems[i] = i;
		}

		//Remove UACC and sustain pedal from menu choices
		ccMenuItems.remove(32);
		ccMenuItems.remove(64); 

		//Main CC Setting Controls
		
		const var gui = {ccName:[], ccNum:[], ccValue:[], ccValueLabel:[]}; //GUI control types
		reg scrollContainer = scrollBox.getContainerName(scroller); //Name of the scrollbox container

		for (i = 0; i < ccMap.length; i++)
		{
			gui.ccName[i] = ui.label(0, 2+30*i, {width:150, height:20, text:controllerNames[i], textColour:"4282194451", fontName:"Josefin Sans", fontStyle:"Bold", fontSize:22, parentComponent:scrollContainer});
			gui.ccNum[i] = ui.comboBox(184, 3+30*i, {width:106, height:20, text:"CC Number", itemColour:0, itemColour2:0, bgColour:0, items:ccMenuItems, parentComponent:scrollContainer});
			gui.ccNum[i].setColour(3, "D31414");
			gui.ccValue[i] = ui.knob(306, 2+30*i, {width:23, height:23, text:"CC Value", filmstripImage:"knob.png", numStrips:128, min:0, max:127, stepSize:1, defaultValue:0, parentComponent:scrollContainer});
			gui.ccValueLabel[i] = ui.label(341, 3+30*i, {width:50, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:scrollContainer});

			switch(ccMap[i])
			{
				case -1: //Temp sync knobs
					gui.ccValue[i].set("mode", "TempoSync");
					gui.ccValue[i].set("defaultValue", "6");
				break;
			}	
		}

		//Controls for editing parameter curves
		const var paramTables = [];
		const var cmbParam = ui.comboBox(444, 71, {width:106, height:20, itemColour:0, itemColour2:0, bgColour:0, text:"Parameter", items:controllerNames, parentComponent:tabPanel});

		//Create a parameter table for each parameter menu item
		for (i = 0; i <= ccMap.length; i++)
		{
			paramTables[i] = ui.table(446, 120, {width:160, height:91, parentComponent:tabPanel});
		}
	}

	//FUNCTIONS
	inline function getScaledValue(ccMapIndex, value)
	{
		return Math.ceil((127 / 100) * (paramTables[ccMapIndex].getTableValue(value) * 100)); //Scale value based on table	
	}

	inline function forwardValueToController(ccMapIndex, value)
	{
		Synth.sendController(ccMap[ccMapIndex], value); //Send value to controller
		gui.ccValueLabel[ccMapIndex].set("text", Math.floor(remapRange(value, 0, 127, 0, 100)) + "%"); //Update label on GUI

		return value;
	}

	inline function forwardValueToProcessor(ccMapIndex, value)
	{
		switch (ccMap[ccMapIndex])
		{
			case -1:
				gui.ccValueLabel[ccMapIndex].set("text", getTextForTempoIndex(value)); //Set label text to tempo

				switch (ccMapIndex)
				{
					case 5: processors.glide.setAttribute(2, value); break; //Glide Rate
					case 6: processors.trill.setAttribute(2, value); break; //Trill Rate
				}
			break;
		}
	}

	//Callbacks
	inline function onNoteOnCallback()
	{
		//Scale velocity based on the velocity table curve
		Message.setVelocity(Math.ceil((127 / 100) * (paramTables[paramTables.length-1].getTableValue(Message.getVelocity()) * 100)));
	}

	inline function onNoteOffCallback()
	{
	}

	inline function onControllerCallback()
	{
		if (Message.getControllerNumber() < 128) //Pitch bend is CC 128
		{
			for (i = 0; i < ccMap.length; i++) //Each assigned CC
			{
				if (userCcMap[i] == Message.getControllerNumber()) //If a user assigned CC triggered the callback
				{	
					Message.setControllerValue(getScaledValue(i, Message.getControllerValue())); //Scale the controller value using the param table
					
					if (ccMap[i] > -1) //Forward to real CC
					{
						//Send scaled controller value and Set knob scaled value
						gui.ccValue[i].setValue(forwardValueToController(i, Message.getControllerValue()));
					}
					else //Scale CC value, set knob to that value, pass scaled value to appropriate processor or modulator
					{
						if (gui.ccValue[i].get("stepSize") == 1) //Round these knob values
						{
							gui.ccValue[i].setValue(Math.ceil(remapRange(Message.getControllerValue(), 0, 127, gui.ccValue[i].get("min"), gui.ccValue[i].get("max")))); //Set knob value
						}
						else 
						{
							gui.ccValue[i].setValue(remapRange(Message.getControllerValue(), 0, 127, gui.ccValue[i].get("min"), gui.ccValue[i].get("max"))); //Set knob value
						}
						
						forwardValueToProcessor(i, gui.ccValue[i].getValue()); //Forward knob values to modulators and or processors
					}
				}
			}

			//Change incoming CC to undefined CC number so it gets ignored by later modules - except CCs 32 and 64
			if (Message.getControllerNumber() != 32 && Message.getControllerNumber() != 64)
			{
				Message.setControllerNumber(102);
			}
		}
	}

	inline function onTimerCallback()
	{	
	}

	inline function onControlCallback(number, value)
	{
		for (i = 0; i < ccMap.length; i++) //Each CC control
		{
			//CC selection combo box
			if (number == gui.ccNum[i])
			{
				userCcMap[i] = parseInt(gui.ccNum[i].getItemText()); //Get integer from menu text and put in array
			}
 			
 			//CC Value Knob
			if (number == gui.ccValue[i])
			{
				if (ccMap[i] > -1) //Forward to real CC
				{
					forwardValueToController(i, value);
				}
				else //Forward to processor
				{
					forwardValueToProcessor(i, value);
				}		
			}
		}

		//Parameter curve tables
		if (number == cmbParam && value != undefined)
		{
			//Hide all parameter tables
			for (paramTable in paramTables)
			{
				paramTable.set("visible", false);
			}

			paramTables[value-1].set("visible", true); //Show table for selected parameter
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
	}
}