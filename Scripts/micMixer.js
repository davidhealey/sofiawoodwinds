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
		const var zone = ui.panel("mMidZone", 225, 0, {width:200, height:225, paintRoutine:paintRoutines.zone, parentComponent:tab.getPanelId(tabs[0])}); //Volume, pan, purge
		const var lblTitle = ui.label("lblTitle", 0, 0, {width:200, height:25, text:"Mixer", textColour:Theme.H1.colour, fontSize:Theme.H1.fontSize, fontName:Theme.H1.font, alignment:"centred", parentComponent:"mMidZone"});
		
		for (i = 0; i < NUM_CHANNELS; i++)
		{
			pan[i] = ui.sliderPanel("sliPan"+i, 28+(i*55), 40, {width:34, height:20, min:-100, max:100, paintRoutine:paintRoutines.biDirectionalSlider, sensitivity:0.5, parentComponent:"mMidZone"});
			pan[i].data.defaultValue = 0;
			delay[i] = ui.knob("sliDelay"+i, 28+(i*55), 125, {width:10, height:45, style:"Vertical", min:0, max:500, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:0, parentComponent:"mMidZone"});
			width[i] = ui.knob("sliWidth"+i, 28+(i*55), 70, {width:10, height:45, style:"Vertical", min:0, max:200, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:0, parentComponent:"mMidZone"});
			vol[i] = ui.knob("sliVol"+i, 28+15+(i*55), 70, {width:19, height:100, style:"Vertical", min:0, max:4, middlePosition:1, defaultValue:1, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, itemColour2:0, textColour:0, parentComponent:"mMidZone"});
			purge[i] = ui.buttonPanel("btnPurge"+i, 28+(i*55), 182, {width:34, height:25, text:micNames[i], paintRoutine:paintRoutines.textButton, parentComponent:"mMidZone"});
		}
		
		width[0].set("visible", false); //First channel is for close/mono so no need for width
	}
	
	inline function onControlCB(number, value)
	{		
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
				mixer.setAttribute(ATTRIBUTES.PURGE+1 * (NUM_ATTRIBUTES*i), 1-value);
				purge[i].repaint();
				break;
			}
		}	
	}	
}