namespace tab0
{
	inline function initCB()
	{
		const var tabPanel = tab.getPanelId(tabs[0]);
		const var scriptIds = Synth.getIdList("Script Processor");
		const var legatoHandler = Synth.getMidiProcessor("legatoHandler"); //Get legato handler script
		const var sustainReleaseHandler = Synth.getMidiProcessor("sustainReleaseMidiMuter"); //Handles sustain release triggers
		
		//Get all round robin handler script processors and store in array
		const var rrHandlers = [];
		for (s in scriptIds) //Each script processor
		{
			if (s.indexOf("RoundRobin") != -1)
			{
				rrHandlers.push(Synth.getMidiProcessor(s));
			}
		}
		
		//MEMORY
		const var lblMemoryHeading = ui.label(29, 59, {width:100, height:25, "saveInPreset":false, "text":"Memory", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var bufferSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
		
		const var lblBufferHeading = ui.label(29, 94, {width:100, height:25, "saveInPreset":false, "text":"Buffer", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var cmbBuffer = ui.comboBoxPanel(95, 96, {width:100, height:20, text:"Buffer", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:bufferSizes});
		cmbBuffer.set("tooltip", "Buffer Size: Sets the size of the instrument's main buffer. A higher buffer uses more RAM.");
		
		const var lblPreloadHeading = ui.label(29, 129, {width:100, height:25, "saveInPreset":false, "text":"Preload", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var cmbPreload = ui.comboBoxPanel(95, 131, {width:100, height:20, text:"Preload", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:bufferSizes});
		cmbPreload.set("tooltip", "Preload Size: Sets the size of the instrument's preload buffer. A higher setting uses more RAM.");
		
		const var lblReleaseHeading = ui.label(29, 163, {width:110, height:25, "saveInPreset":false, "text":"Purge Releases", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var btnRelease = ui.buttonPanel(155, 166, {width:40, height:20, paintRoutine:buttonPaint, parentComponent:tabPanel});
		btnRelease.set("tooltip", "Release Sample Purge/Load: Toggle status of release trigger samples. Purging the samples results in lower RAM usage.");
		
		//ROUND ROBIN
		const var lblRoundRobinHeading = ui.label(269, 58, {width:100, height:25, "text":"Round Robin", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var cmbType = ui.comboBoxPanel(275, 96, {width:100, height:20, text:"Type", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:["Off", "Real", "Synthetic", "Hybrid"]});
		cmbType.set("tooltip", "Type: Set the round robin type. Real (different samples), Synthetic (sample borrowing), Hybrid (Real and Synthetic).");
		
		const var cmbMode = ui.comboBoxPanel(275, 131, {width:100, height:20, text:"Mode", parentComponent:tabPanel, paintRoutine:comboBoxPaint, items:["Cycle", "Random", "Random Cycle"]});
		cmbMode.set("tooltip", "Mode: Rond Robin operation mode. Cycle (plays in sequence), Random (truly random), Random Full Cycle (random and won't repeat a sample until all other repetitions have been played).");
		
		const var lblResetHeading = ui.label(269, 163, {width:100, height:25, "text":"Reset", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var knbReset = ui.sliderPanel(350, 164, {width:25, height:25, min:0, max:5, stepSize:1, defaultValue:2, sensitivity:25, paintRoutine:knobPaint, parentComponent:tabPanel});
		knbReset.set("tooltip", "Reset: Round Robin reset time. The round robin counter of each note will reset after this time (in seconds) has elapsed.");
		
		//LEGATO
		const var lblLegatoHeading = ui.label(449, 58, {width:100, height:25, "text":"Legato", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		
		const var lblLagHeading = ui.label(449, 92, {width:100, height:25, "text":"Lag", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var knbLag = ui.sliderPanel(530, 94, {width:25, height:25, min:0.2, max:0.9, stepSize:0.01, defaultValue:0.75, paintRoutine:knobPaint, sensitivity:150, parentComponent:tabPanel});
		knbLag.set("tooltip", "Lag: Sets the maximum sample offset of legato transitions. A lower value creates a smoother transition but it can sound less realistic.");
		const var lblLag = ui.label(568, 94, {width:55, height:25, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, alignment:"left", parentComponent:tabPanel});

		const var lblRatioHeading = ui.label(449, 127, {width:100, height:25, "text":"Ratio", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var knbRatio = ui.sliderPanel(530, 129, {width:25, height:25, min:20, max:100, stepSize:1, defaultValue:50, paintRoutine:knobPaint, sensitivity:2, parentComponent:tabPanel});
		knbRatio.set("tooltip", "Ratio: Adjust the fade in/out ratio for legato transitions.");
		const var lblRatio = ui.label(568, 128, {width:55, height:25, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, alignment:"left", parentComponent:tabPanel});
		
		const var lblLegReleaseHeading = ui.label(450, 163, {width:125, height:25, "text":"Release Triggers", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var btnLegRelease = ui.buttonPanel(575, 166, {width:40, height:20, paintRoutine:buttonPaint, parentComponent:tabPanel});
		btnLegRelease.set("tooltip", "Legato Releases: When enabled release samples will only be triggered at the end of a legato phrase instead of for every note.");
	}
	
	inline function onControlCB(number, value)
	{
		switch (number)
		{ 
			case cmbBuffer:
				changeBufferSettings(5, value-1);
			break;
			
			case cmbPreload:
				changeBufferSettings(4, value-1);
			break;
			
			case btnRelease:
				for (s in releaseSamplers)
				{
					s.setAttribute(12, value);
				}
			break;
			
			case cmbType:
				changeRRSettings(0, value);
			break;
			
			case cmbMode:
				changeRRSettings(1, value);
			break;
			
			case knbReset:
				changeRRSettings(5, value);
			break;
			
			case knbLag:
				legatoHandler.setAttribute(10, value);
				lblLag.set("text", Math.round(value*100) + "%");
			break;
			
			case knbRatio:
				legatoHandler.setAttribute(9, value);
				lblRatio.set("text", Math.round(value) + "%");
			break;
			
			case btnLegRelease: //Select whether release samples are triggered for each note of a legato phrase or only at the end of a phrase
				sustainReleaseHandler.setAttribute(1, value);
			break;
		}				
	}
	
	inline function changeBufferSettings(attribute, value)
	{
		for (s in samplers)
		{
			s.setAttribute(attribute, bufferSizes[value]); //Preload
		}
	}
	
	inline function changeRRSettings(attribute, value)
	{
		for (r in rrHandlers)
		{
			r.setAttribute(attribute, value);
		}
	}
}