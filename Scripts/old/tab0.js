namespace tab0
{
	//Init
	
	inline function initCallback()
	{
		const var TAB_ID = 0;
		const var tabPanel = uiTab.getPanelName(tabs[TAB_ID]);
		const var ccNumbers = [];

		const var scriptProcessors = Synth.getIdList("Script Processor");
		const var legatoProcessor = Synth.getMidiProcessor("Legato");
		const var releaseProcessors = [];
		const var rrProcessors = [];
		const var humaniserProcessors = [];

		const var samplerNames = Synth.getIdList("Sampler");
		const var allSamplers = [];
		const var releaseSamplers = [];

		//RR Script controls
		const var RR_TYPE = 0;
		const var RR_MODE = 1;
		const var RR_RESET_TIME = 5;

		for (i = 0; i < 129; i++)
		{
			ccNumbers[i] = i;
		}

		for (scriptProcessor in scriptProcessors)
		{
			if (Engine.matchesRegex(scriptProcessor, "(elease)")) releaseProcessors.push(Synth.getMidiProcessor(scriptProcessor)); //Array of release trigger processors
			if (Engine.matchesRegex(scriptProcessor, "(?=.*ound)(?=.*obin)")) rrProcessors.push(Synth.getMidiProcessor(scriptProcessor)); //Array of RR processors
			if (Engine.matchesRegex(scriptProcessor, "(umanise|umanize)")) humaniserProcessors.push(Synth.getMidiProcessor(scriptProcessor)); //Array of humaniser processors

		}

		//Build sampler arrays
		for (samplerName in samplerNames)
		{
			allSamplers.push(Synth.getSampler(samplerName)); //All samplers in one array

			if (Engine.matchesRegex(samplerName, "(elease)")) //Release samplers
			{
				releaseSamplers.push(Synth.getSampler(samplerName));
			}
		}

		//GUI

		//ROUND ROBIN
		//RR Type and Mode Combo Boxes
		const var cmbType = ui.comboBox(24, 71, {width:106, height:20, text:"Type", itemColour:0, itemColour2:0, bgColour:0, items:["Off", "Real", "Synthetic", "Hybrid"], parentComponent:tabPanel});
		cmbType.set("tooltip", "Type: Set the round robin type. Real (different samples), Synthetic (sample borrowing), Hybrid (Real and Synthetic).");

		const var cmbMode = ui.comboBox(24, 101, {width:106, height:20, text:"Mode", itemColour:0, itemColour2:0, bgColour:0, items:["Cycle", "Random", "Random Cycle"], parentComponent:tabPanel});
		cmbMode.set("tooltip", "Mode: Rond Robin operation mode. Cycle (plays in sequence), Random (truly random), Random Full Cycle (random and won't repeat a sample until all other repetitions have been played).");

		//Reset timeout knob and label
		const var knbReset = ui.knob(26, 160, {width:23, height:23, filmstripImage:"knob.png", numStrips:128, min:0, max:60, stepSize:1, defaultValue:5, suffix:"Seconds", parentComponent:tabPanel});
		knbReset.set("tooltip", "Reset: Round Robin reset time. The round robin counter of each note will reset after this time (in seconds) has elapsed.");
		const var lblReset = ui.label(61, 161, {width:100, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});

		//RELEASES
		const var btnReleasePurge = ui.button(206, 71, {width:40, height:20, filmstripImage:"toggleSwitch.png", parentComponent:tabPanel});
		const var btnReleaseMode = ui.button(206, 101, {width:40, height:20, filmstripImage:"toggleSwitch.png", parentComponent:tabPanel});

		//HUMANISER
		const var knbNoteOn = ui.knob(326, 70, {width:23, height:23, filmstripImage:"knob.ong", numStrips:128, mode:"Time", min:0, max:100, stepSize:0.1, parentComponent:tabPanel});
		knbNoteOn.set("tooltip", "Note On: adds random delay (0 ms - 100 ms) to the Note On of each note.");
		const var lblNoteOn = ui.label(360, 71, {width:100, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});

		const var knbNoteOff = ui.knob(326, 100, {width:23, height:23, filmstripImage:"knob.ong", numStrips:128, mode:"Time", min:0, max:100, stepSize:0.1, parentComponent:tabPanel});
		knbNoteOff.set("tooltip", "Note Off: adds random delay (0 ms - 100 ms) to the Note Off of each note.");
		const var lblNoteOff = ui.label(360, 101, {width:100, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});

		const var knbVelocity = ui.knob(326, 130, {width:23, height:23, filmstripImage:"knob.ong", numStrips:128, min:0, max:100, stepSize:1, defaultValue:0, suffix:"%", parentComponent:tabPanel});
		knbVelocity.set("tooltip", "Velocity: adds or subtracts random value in selected +-range of played velocity.");
		const var lblVelocity = ui.label(360, 131, {width:100, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});

		const var knbVolume = ui.knob(326, 160, {width:23, height:23, filmstripImage:"knob.ong", numStrips:128, min:0, max:8, stepSize:0.1, defaultValue:0, suffix:"dB", parentComponent:tabPanel});
		knbVolume.set("tooltip", "Volume: changes the volume of each note randomly from -8db to +8 db.");
		const var lblVolume = ui.label(360, 161, {width:100, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});

		const var knbPitch = ui.knob(326, 190, {width:23, height:23, filmstripImage:"knob.ong", numStrips:128, min:0, max:100, stepSize:1, suffix:"Cents", parentComponent:tabPanel});
		knbPitch.set("tooltip", "Pitch: detunes each note randomly in the selected +-range - up to 1 semi-tone.");
		const var lblPitch = ui.label(360, 191, {width:100, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});

		//Buffer and preload size menu
		const var bufferSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
		const var cmbBuffer = ui.comboBox(444, 71, {width:106, height:20, text:"Buffer", itemColour:0, itemColour2:0, bgColour:0, items:bufferSizes, parentComponent:tabPanel});
		cmbBuffer.set("tooltip", "Buffer Size: Sets the size of the instrument's main buffer. A higher buffer uses more RAM.");

		const var preloadSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
		const var cmbPreload = ui.comboBox(444, 101, {width:106, height:20, text:"Preload Size", itemColour:0, itemColour2:0, bgColour:0, items:bufferSizes, parentComponent:tabPanel});
		cmbPreload.set("tooltip", "Preload Size: Sets the size of the instrument's preload buffer. A higher buffer uses more RAM.");

		//Legato max transition offset knob
		const var knbOffset = ui.knob(506, 160, {width:23, height:23, filmstripImage:"knob.png", numStrips:128, min:0.2, max:0.9, stepSize:0.01, defaultValue:0.76, suffix:"%", parentComponent:tabPanel});
		knbOffset.set("tooltip", "Lag: Sets the maximum sample start offset of legato transitions. A lower value creates a smoother transition but it can sound less realistic.");
		const var lblOffset = ui.label(541, 162, {width:50, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});

		//Legato transition offset knob
		const var knbOffsetTime = ui.knob(506, 190, {width:23, height:23, filmstripImage:"knob.png", numStrips:128, min:1, max:1000, stepSize:1, defaultValue:250, suffix:"ms", parentComponent:tabPanel});
		knbOffsetTime.set("tooltip", "Lag Threshold Time: The maximum time between two legato notes that will affect the applied lag.");
		const var lblOffsetTime = ui.label(541, 192, {width:50, height:20, textColour:"4282194451", fontName:"Arial", fontStyle: "Italic", fontSize:14, parentComponent:tabPanel});
	}

	//Functions

	//Callbacks
	inline function onNoteOnCallback()
	{
	}

	inline function onNoteOffCallback()
	{
	}

	inline function onControllerCallback()
	{
	}

	inline function onTimerCallback()
	{	
	}

	inline function onControlCallback(number, value)
	{
		switch (number)
		{
			case cmbType: //RR Type
				for (rrProcessor in rrProcessors)
				{
					rrProcessor.setAttribute(RR_TYPE, value);
				}
			break; 

			case cmbMode: //RR Mode
				for (rrProcessor in rrProcessors)
				{
					rrProcessor.setAttribute(RR_MODE, value);
				}
			break;

			case knbReset: //RR Reset

				for (rrProcessor in rrProcessors)
				{
					rrProcessor.setAttribute(RR_RESET_TIME, value);
				}
				lblReset.set("text", value + " " + knbReset.get("suffix"));
			break;

			case btnReleasePurge:
				for (sampler in releaseSamplers)
				{
					sampler.setAttribute(12 ,value); //Purge samplers
				}
			break;

			case btnReleaseMode: //Release trigger script's legato mode
				for (processor in releaseProcessors)
				{
					processor.setAttribute(1, value);
				}
			break;

			//Pass value to processor offset knobs
			case knbOffset:
				reg scaledValue = (((value - 0.2) * (1)) / (0.9 - 0.2));
				if (scaledValue < 0) scaledValue = 0;

				legatoProcessor.setAttribute(1, value); //Legato max offset
				lblOffset.set("text", Engine.doubleToString(scaledValue * 100, 1) + knbOffset.get("suffix"));
			break;

			case knbOffsetTime: //Pass value to processor offset knobs
				legatoProcessor.setAttribute(3, value); //Legato offset threshold time
				lblOffsetTime.set("text", value + number.get("suffix"));
			break;

			case knbNoteOn:
				for (humaniserProcessor in humaniserProcessors)
				{
					humaniserProcessor.setAttribute(0, value);
				}
				lblNoteOn.set("text", Engine.doubleToString(value, 1) + knbNoteOn.get("suffix"));
			break;

			case knbNoteOff:
				for (humaniserProcessor in humaniserProcessors)
				{
					humaniserProcessor.setAttribute(1, value);
				}
				lblNoteOff.set("text", Engine.doubleToString(value, 1) + knbNoteOff.get("suffix"));
			break;

			case knbVelocity:
				for (humaniserProcessor in humaniserProcessors)
				{
					humaniserProcessor.setAttribute(2, value);
				}
				lblVelocity.set("text", value + knbVelocity.get("suffix"));
			break;

			case knbVolume:
				for (humaniserProcessor in humaniserProcessors)
				{
					humaniserProcessor.setAttribute(4, value);
				}
				lblVolume.set("text", Engine.doubleToString(value, 2) + " " + knbVolume.get("suffix"));
			break;

			case knbPitch:
				for (humaniserProcessor in humaniserProcessors)
				{
					humaniserProcessor.setAttribute(3, value);
				}
				lblPitch.set("text", value + " " + knbPitch.get("suffix"));
			break;

			case cmbBuffer: //Applies the buffer size settings to all samplers

				for (sampler in allSamplers)
				{
					sampler.setAttribute(5, parseInt(cmbBuffer.getItemText())); //Buffer
				}

			break;

			case cmbPreload: //Applies the preload size settings to all samplers

				for (sampler in allSamplers)
				{
					sampler.setAttribute(4, parseInt(cmbPreload.getItemText())); //Preload
				}

			break;
		}
	}
}