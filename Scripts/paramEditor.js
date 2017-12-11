namespace paramEditor
{
	inline function onInitCB()
	{	
		const var PARAMETERS =
		{
			LABELS:["Dynamics", "Expression", "Vibrato Depth", "Vibrato Rate", "Flutter"],
			DYNAMICS:0,
			EXPRESSION:1,
			VIBRATO:2, //Vibrato depth
			VIBRATO_RATE:3,
			BLEND:4 //Flutter/sustain blend
		};
				
		reg realCc = [1, 11, 20, 21, 23]; //Actual CC numbers assigned to modulators (corrospond to parameter enums), -1 means internal/scripted CC, -2 = velocity
		reg userCc = []; //CCs assigned by the user - indexes corrospond to PARAMETERS and realCc[]
		const var controllerNumbers = [];
		
		for (i = 1; i < 128; i++)
		{
			controllerNumbers.push(i);
		}		
		
		//GUI
		const var zone = ui.panel("parameterEditor", 440, 0, {width:200, height:225, paintRoutine:paintRoutines.zone, parentComponent:tab.getPanelId(tabs[0])}); //Outer panel
		const var lblTitle = ui.label("lblTitle", 0, 0, {width:200, height:25, text:"Controllers", textColour:Theme.H1.colour, fontName:Theme.H1.font, fontSize:Theme.H1.fontSize, alignment:"centred", parentComponent:"parameterEditor"});

		const var lblParam = ui.label("lblParam", 5, 42, {width:85, height:25, text:"Parameter", fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"topLeft", parentComponent:"parameterEditor"});
		const var lblCc = ui.label("lblCc", 5, 77, {width:85, height:25, text:"Controller",  fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"topLeft", parentComponent:"parameterEditor"});
		const var lblValue = ui.label("lblValue", 5, 112, {width:85, height:25, text:"Value",  fontName:Theme.H2.font, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize, alignment:"topLeft", parentComponent:"parameterEditor"});

		//Parameter selection dropdown
		const var cmbParam = ui.comboBoxPanel("cmbParam", 90, 42, {width:100, height:25, text:"Parameter", items:PARAMETERS.LABELS, paintRoutine:paintRoutines.dropDown, parentComponent:"parameterEditor"});

		const var cmbCc = []; //One CC number selection dropdown per parameter
		const var sliValue = []; //One value slider per parameter
		const var tblResponse = []; //One response curve table per parameter
		const var responseBg = ui.panel("pnlResponseBg", 10, 147, {width:180, height:70, paintRoutine:function(g){g.fillAll(Theme.TABLE.bg);}, parentComponent:"parameterEditor"}); //Background for tables
		
		for (p in PARAMETERS.LABELS)
		{
			cmbCc.push(ui.comboBoxPanel("cmbCC"+p, 90, 77, {width:100, height:25, text:"Controller", visible:false, items:controllerNumbers, paintRoutine:paintRoutines.dropDown, parentComponent:"parameterEditor"}));
			sliValue.push(ui.knob("sliValue"+p, 90, 112, {width:100, height:25, style:"Horizontal", min:0, max:127, visible:false, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:0, parentComponent:"parameterEditor"}));
			tblResponse.push(ui.table("tblResponse"+p, 10, 147, {width:180, height:70, visible:false, parentComponent:"parameterEditor"})); //Add a response curve table for each parameter - hide by default
		}
	}
	
	inline function onControllerCB(ccNum, ccVal)
	{
		if (ccNum != 32 && ccNum != 64 && userCc.contains(ccNum)) //User assigned CC triggered callback - ignore UACC and Sustain pedal
		{
			Message.ignoreEvent(true); //I'll take it from here :-)

			//Redirect incoming user CC to each real CC it's mapped to or to elsewhere for internal CCs	
			for (i = 0; i < PARAMETERS.LABELS.length; i++) //Each parameter
			{
				if (ccNum == cmbCc[i].getValue()) //CC that triggered the callback has been assigned to this index (i)
				{
					parameterResponseHandler(i, ccVal); //Scale the value and pass it to correct CC
					
					//If parameter is currently selected then update UI
					if (cmbParam.getValue()-1 == i) asyncUpdater.setFunctionAndUpdate(updateParameterValueSlider, ccVal);
				}
			}
		}
	}
	
	inline function onControlCB(number, value)
	{		
		if (number == cmbParam)
		{				
			//Hide all parameter controls
			for (i = 0; i < PARAMETERS.LABELS.length; i++)
			{
				cmbCc[i].set("visible", false);
				sliValue[i].set("visible", false);
				tblResponse[i].set("visible", false);
			}
				
			//Show controls for selected parameter
			if (value != 0)
			{
				cmbCc[value-1].set("visible", true);
				sliValue[value-1].set("visible", true);
				tblResponse[value-1].set("visible", true);
				
				cmbCc[value-1].repaint();
			}
		}
		
		for (i = 0; i < PARAMETERS.LABELS.length; i++)
		{
			if (number == cmbCc[i])
			{
				userCc[i] = value; //Store the selected CC
				break;
			}
			else if (number == sliValue[i])
			{
				parameterResponseHandler(cmbParam.getValue()-1, value);
				break;
			}
		}
	}
	
	/*
	 * parameterResponseHandler
	 *
	 * Takes the paramIndex (enum) and current value of the parameter and uses the parameter's response table to 
	 * scale the parameter value and output it as appropriate depending on the type of parameter.
	*/
	inline function parameterResponseHandler(paramIndex, value)
	{
		if (realCc[paramIndex] >= 0) Synth.sendController(realCc[paramIndex], 1 + 126 * tblResponse[paramIndex].getTableValue(value));
	}
		
	inline function updateParameterValueSlider(v)
	{
		sliValue[cmbParam.getValue()-1].setValue(v); //Set value of currently selected parameter's value slider to v
	}
}