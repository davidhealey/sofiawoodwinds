namespace micMixer
{
	inline function onInitCB()
	{
		const var mixer = Synth.getMidiProcessor("micMixer"); //Get mic module script
		
		const var NUM_CHANNELS = 3
		const var NUM_ATTRIBUTES = 7;
		const var ATTRIBUTES = {GAIN:0, DELAY:1, WIDTH:2, PAN:3, MUTE:4, SOLO:5, PURGE:6}; //The attributes/controls of the mic mixer module script
		
		const var micNames = ["C", "D", "H"]; //Close, decca, hall
		const var vol = [];
		const var pan = [];
		const var delay = [];
		const var width = [];
		const var purge = [];

		//GUI
		const var zone = ui.panel(225, 12, {width:200, height:225, id:"mMidZone", paintRoutine:function(g){g.fillAll(Theme.ZONE);}, parentComponent:tab.getPanelId(tabs[0])}); //Volume, pan, purge
		const var lblTitle = ui.label(0, 3, {width:200, height:25, text:"Mixer", textColour:Theme.H1, fontSize:16, fontStyle:"Bold", alignment:"centred", parentComponent:"mMidZone"});
		const var lblSubTitle = ui.label(0, 42, {width:200, height:25, text:"Delay & Width", textColour:Theme.H2, fontSize:14, alignment:"centred", parentComponent:"mMidZone"});
		
		for (i = 0; i < NUM_CHANNELS; i++)
		{
			pan[i] = ui.sliderPanel(37+(i*50.5), 42, {width:25, height:24, min:-100, max:100, paintRoutine:paintRoutines.biDirectionalSlider, sensitivity:0.5, parentComponent:"mMidZone"});
			pan[i].data.defaultValue = 0;	
			vol[i] = ui.knob(37+(i*50.5), 77, {width:25, height:100, style:"Vertical", min:0, max:4, middlePosition:1, defaultValue:1, bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:0, parentComponent:"mMidZone"});
			purge[i] = ui.buttonPanel(37+(i*50.5), 179, {width:25, height:25, text:micNames[i], paintRoutine:paintRoutines.textButton, parentComponent:"mMidZone"});
			
			//Delay and width controls are made visible via the mode button
			delay[i] = ui.knob(32+(i*50.5), 77, {width:15, height:100, style:"Vertical", min:0, max:500, bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:0, parentComponent:"mMidZone"});
			width[i] = ui.knob(32+20+(i*50.5), 77, {width:15, height:100, style:"Vertical", min:0, max:200, bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:0, parentComponent:"mMidZone"});
		}
		
		const var btnMode = ui.buttonPanel(650/2-4, 222, {width:7, height:7, paintRoutine:paintRoutines.circleButton, parentComponent:tab.getPanelId(tabs[0])});
	}
	
	inline function onControlCB(number, value)
	{
		if (number == btnMode)
		{
			for (i = 0; i < NUM_CHANNELS; i++)
			{
				if (value == 0)
				{
					pan[i].set("visible", true);
					vol[i].set("visible", true);
					delay[i].set("visible", false);
					width[i].set("visible", false);
					lblSubTitle.set("visible", false);
				}
				else 
				{
					pan[i].set("visible", false);
					vol[i].set("visible", false);
					delay[i].set("visible", true);
					width[i].set("visible", true);
					lblSubTitle.set("visible", true);
				}	
			}
		}
		
		for (i = 0; i < NUM_CHANNELS; i++)
		{
			if (number == vol[i])
			{
				mixer.setAttribute(ATTRIBUTES.GAIN+1 * (NUM_ATTRIBUTES*i), value);
				break;
			}
			else if (number == pan[i])
			{
				mixer.setAttribute(ATTRIBUTES.PAN+1 * (NUM_ATTRIBUTES*i), value);	
				pan[i].repaint();
				break;
			}
			else if (number == delay[i])
			{
				mixer.setAttribute(ATTRIBUTES.DELAY+1 * (NUM_ATTRIBUTES*i), value);
				break;
			}
			else if (number == width[i])
			{
				mixer.setAttribute(ATTRIBUTES.WIDTH+1 * (NUM_ATTRIBUTES*i), value);
				break;
			}
			else if (number == purge[i])
			{
			//	mixer.setAttribute(ATTRIBUTES.PURGE+1 * (NUM_ATTRIBUTES*i), 1-value);
				break;
			}
		}	
	}	
}