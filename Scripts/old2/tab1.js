namespace tab1
{
	inline function initCB()
	{
		const var mixer = Synth.getMidiProcessor("micMixer"); //Get mic mixer script
		
		const var tabPanel = tab.getPanelId(tabs[1]);
		const var NUM_CHANNELS = 3;

		const var NUM_ATTRIBUTES = 7;
		const var ATTRIBUTES = {GAIN:0, DELAY:1, WIDTH:2, PAN:3, MUTE:4, SOLO:5, PURGE:6};
		
		//GUI
		
		//Headings
		const var lblChannelHeading = ui.label(30, 59, {width:100, height:25, "text":"Channel", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblVolumeHeading = ui.label(150, 59, {width:100, height:25, "text":"Volume", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblPanHeading = ui.label(277, 59, {width:100, height:25, "text":"Pan", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblDelayHeading = ui.label(330, 59, {width:100, height:25, "text":"Delay", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblWidthHeading = ui.label(390, 59, {width:100, height:25, "text":"Width", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblMuteHeading = ui.label(453, 59, {width:100, height:25, "text":"Mute", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblSoloHeading = ui.label(514, 59, {width:100, height:25, "text":"Solo", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblPurgeHeading = ui.label(569, 59, {width:100, height:25, "text":"Purge", textColour:0xFF000000, fontName:"Arial", fontSize:16, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		
		const var lblCloseHeading = ui.label(29, 109, {width:100, height:25, "text":"Close", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblDeccaHeading = ui.label(29, 144, {width:100, height:25, "text":"Decca", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		const var lblHallHeading = ui.label(29, 179, {width:100, height:25, "text":"Hall", textColour:"4282194451", fontName:"Arial", fontSize:15, fontStyle:"Bold", alignment:"left", parentComponent:tabPanel});
		
		const var vol = [];
		const var pan = [];
		const var delay = [];
		const var width = [];
		const var mute = [];
		const var solo = [];
		const var purge = [];
				
		for (i = 0; i < NUM_CHANNELS; i++)
		{		
			vol[i] = ui.sliderPanel(155, 111+(35*i), {width:100, height:20, min:0, max:2, stepSize:0.1, defaultValue:1, paintRoutine:sliderPaint, sensitivity:75, parentComponent:tabPanel});
			pan[i] = ui.sliderPanel(283, 109+(35*i), {width:25, height:25, min:-100, max:100, stepSize:0.1, paintRoutine:knobPaint, sensitivity:0.5, parentComponent:tabPanel});
			pan[i].data.defaultValue = 0;
			delay[i] = ui.sliderPanel(343, 109+(35*i), {width:25, height:25, min:0, max:500, stepSize:0.1, defaultValue:0, sensitivity:0.2, paintRoutine:knobPaint, parentComponent:tabPanel});
			delay[i].data.defaultValue = 0;
			width[i] = ui.sliderPanel(403, 109+(35*i), {width:25, height:25, min:0, max:200, stepSize:0.1, defaultValue:100, sensitivity:0.5, paintRoutine:knobPaint, parentComponent:tabPanel});
			mute[i] = ui.buttonPanel(465, 111+(35*i), {width:20, height:20, paintRoutine:pushButtonPaint, parentComponent:tabPanel});
			solo[i] = ui.buttonPanel(525, 111+(35*i), {width:20, height:20, paintRoutine:pushButtonPaint, parentComponent:tabPanel});
			purge[i] = ui.buttonPanel(575, 111+(35*i), {width:40, height:20, paintRoutine:buttonPaint, parentComponent:tabPanel});
		}
	}
	
	inline function onControlCB(number, value)
	{
		for (i = 0; i < NUM_CHANNELS; i++)
		{
			if (number == vol[i])
			{
				mixer.setAttribute(ATTRIBUTES.GAIN+1 * (NUM_ATTRIBUTES*i), value);
			}
			else if (number == pan[i])
			{
				mixer.setAttribute(ATTRIBUTES.PAN+1 * (NUM_ATTRIBUTES*i), value);	
			}
			else if (number == delay[i])
			{
				mixer.setAttribute(ATTRIBUTES.DELAY+1 * (NUM_ATTRIBUTES*i), value);
			}
			else if (number == width[i])
			{
				mixer.setAttribute(ATTRIBUTES.WIDTH+1 * (NUM_ATTRIBUTES*i), value);
			}
			else if (number == mute[i])
			{
				if (value == 1) solo[i].setValue(0);
				muteSolo();				
				mixer.setAttribute(ATTRIBUTES.MUTE+1 * (NUM_ATTRIBUTES*i), value);
			}
			else if (number == solo[i])
			{
				if (value == 1) mute[i].setValue(0);
				muteSolo();
				mixer.setAttribute(ATTRIBUTES.SOLO+1 * (NUM_ATTRIBUTES*i), value);
			}
			else if (number == purge[i])
			{
				//mixer.setAttribute(ATTRIBUTES.PURGE+1 * (NUM_ATTRIBUTES*i), value);
			}				
		}
	}
	
	inline function muteSolo()
	{
		local soloOn = false;
		
		//Check if any mics are soloed
		for (i = 0; i < solo.length; i++)
		{
			if (solo[i].getValue() == 1) soloOn = true;
		}
		
		for (i = 0; i < solo.length; i++)
		{	
			if (mute[i].getValue() == 1)
			{
				vol[i].set("enabled", false);
			}
			else if (solo[i].getValue() == 1)
			{
				vol[i].set("enabled", true);
			}
			else if (soloOn == true)
			{
				vol[i].set("enabled", false);
			}
			else 
			{
				vol[i].set("enabled", true);
			}
			
			mute[i].repaint();
			solo[i].repaint();
			vol[i].repaint();
		}
	}
}