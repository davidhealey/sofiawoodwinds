namespace tab3
{
	inline function initCallback()
	{
		//Init
		const var TAB_ID = 3;
		const var tabPanel = uiTab.getPanelName(tabs[TAB_ID]);

		reg initOver = 0;

		//GUI
		const var gui = {}; //For defining the mixers GUI controls
		const var mixer = []; //A collection of channel objects
		const var controls = [[], [], [], [], [], [], []]; //For storing the actual GUI controls created by the channel class
		const var samplerNames = Synth.getIdList("Sampler"); //Get the ids of all child samplers
		const var simpleGainNames = Synth.getIdList("Simple Gain"); //Get IDs of simple gain FX - assume one per mic channel
		const var samplers = []; //All samplers - required for purging

		//Create scrollBox object for scrolling through the articulation edtior GUI controls
		const var scroller = scrollBox.addContainer("mixer", 587, 148, 20, 68, -1, -1, simpleGainNames.length, 30)
		scrollBox.getViewport(scroller).set("parentComponent", tabPanel); //Assign parent to scrollBox

		//Scroll up and down arrows
		const var btnDn = ui.button(40, 54, {width:12, height:10, filmstripImage:"downArrow.png", parentComponent:tabPanel});
		const var btnUp = ui.button(26, 54, {width:12, height:10, filmstripImage:"upArrow.png", parentComponent:tabPanel});
		
		if (simpleGainNames.length < 6) //Scroll buttons are only required when more than 5 channels are present
		{
			btnDn.set("filmstripImage", "{PROJECT_FOLDER}downArrowTransparent.png");
			btnUp.set("filmstripImage", "{PROJECT_FOLDER}upArrowTransparent.png");
		}

		//Get all samplers
		for (samplerName in samplerNames)
		{
			samplers.push(Synth.getSampler(samplerName));
		}

		reg scrollContainer = scrollBox.getContainerName(scroller);
		reg channelName;
		for (i = 0; i < simpleGainNames.length; i++)
		{
			channelName = capitalizeString(simpleGainNames[i]);

			gui.volume = {x:126, y:8+30*i, width:100, height:10, filmstripImage:"fader.png", numStrips:128, parentComponent:scrollContainer};
			gui.balance = {x:246, y:2+30*i, width:23, height:23, filmstripImage:"knob.png", numStrips:128, parentComponent:scrollContainer};
			gui.delay = {x:306, y:2+30*i, width:23, height:23, filmstripImage:"knob.png", numStrips:128, parentComponent:scrollContainer};
			gui.width = {x:366, y:2+30*i, width:23, height:23, filmstripImage:"knob.png", numStrips:128, parentComponent:scrollContainer};
			gui.mute = {x:426, y:3+30*i, width:20, height:20, filmstripImage:"miniButton.png", parentComponent:scrollContainer};
			gui.solo = {x:486, y:3+30*i, width:20, height:20, filmstripImage:"miniButton.png", parentComponent:scrollContainer};
			gui.purge = {x:546, y:3+30*i, width:40, height:20, filmstripImage:"toggleSwitch.png", parentComponent:scrollContainer};
			
			mixer[i] = channel.newChannel(i, simpleGainNames[i], gui); //Add channel to mixer
			
			//Add extra non-vital controls to channel
			channel.addControl(mixer[i], "channelLabel", ui.label(0, 4+30*i, {width:110, height:18, text:channelName, textColour:"4282194451", fontName:"Josefin Sans", fontStyle:"Bold", fontSize:22, parentComponent:scrollContainer}));
		}

		const var postInit = ui.button(0, 0, {visible:false}); //Hidden button to trigger last control callback on init
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
		for (i = 0; i < mixer.length; i++) //Each channel
		{
			if (number == channel.getVolumeControl(mixer[i]))
			{
				channel.setVolume(mixer[i], value);
				number.set("tooltip", "Volume: " + Engine.doubleToString(value, 1) + "dB");
				break;
			}

			if (number == mixer[i].gui.knbBalance)
			{
				channel.setBalance(mixer[i], value);
				if (value < 0)
				{
					number.set("tooltip", "Pan: " + Engine.doubleToString(-value, 1) + "L"); //Left
				}
				else 
				{
					number.set("tooltip", "Pan: " + Engine.doubleToString(value, 1) + "R"); //Right
				}

				break;
			}

			if (number == mixer[i].gui.knbDelay)
			{
				channel.setDelay(mixer[i], value);
				number.set("tooltip", "Delay: " + Engine.doubleToString(value, 1) + "ms");
				break;
			}
				
			if (number == mixer[i].gui.knbWidth)
			{
				channel.setWidth(mixer[i], value);
				number.set("tooltip", "Width: " + Engine.doubleToString(value, 1) + "%");
				break;
			}
				
			if (number == mixer[i].gui.btnMute)
			{
				channel.setMute(mixer[i], mixer, value);
				break;
			}
				
			if (number == mixer[i].gui.btnSolo)
			{
				channel.setSolo(mixer[i], mixer, value);
				break;
			}

			if (number == mixer[i].gui.btnPurge && initOver == 1)
			{
				channel.setPurge(samplers, mixer[i], value);
				break;
			}
		}

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

		if (number == postInit)
		{
			initOver = 1;
		}
	}
}