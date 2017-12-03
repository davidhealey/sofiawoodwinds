/** External Script File settings.js */

namespace settings
{
	inline function onInitCB()
	{
		//ID Lists and MIDI Processors
		const var scriptIds = Synth.getIdList("Script Processor"); //All script processor IDs
		const var chanFilter = Synth.getMidiProcessor("instrumentChannelFilter"); //Instrument level MIDI channel filter
		const var legatoHandler = Synth.getMidiProcessor("legatoHandler"); //Get legato handler script
		const var sustainReleaseHandler = Synth.getMidiProcessor("sustainReleaseHandler"); //Handles sustain release triggers
		
		//Variables
		const var bufferSizes = [256, 512, 1024, 2048, 4096, 8192, 16384];
		const var channels = ["Omni", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
		const var rates = ["1/1", "1/2", "1/2T", "1/4", "1/4T", "1/8", "1/8T", "1/16", "1/16T", "1/32", "1/32T", "Velocity"];
		const var rrHandlers = [];
		const var GLIDE_CC = 5;
				
		//Get all round robin handler script processors and store in array
		
		for (s in scriptIds) //Each script processor
		{
			if (s.indexOf("RoundRobin") != -1)
			{
				rrHandlers.push(Synth.getMidiProcessor(s));
			}
		}
		
		//GUI
		
		//Memory settings
		const var leftZone = ui.panel(10, 12, {width:200, height:225, id:"sLeftZone", paintRoutine:function(g){g.fillAll(Theme.ZONE);}, parentComponent:tab.getPanelId(tabs[1])}); //Outer parent
		const var lblTitle1 = ui.label(0, 3, {width:200, height:25, text:"Instrument", textColour:Theme.H1, fontSize:16, fontStyle:"Bold", alignment:"centred", parentComponent:"sLeftZone"});
		
		const var lblChan = ui.label(5, 42, {width:85, height:25, text:"Channel", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sLeftZone"});
		const var lblPre = ui.label(5, 77, {width:85, height:25, text:"Preload", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sLeftZone"});
		const var lblBuf = ui.label(5, 112, {width:85, height:25, text:"Buffer", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sLeftZone"});
		const var lblRel = ui.label(5, 147, {width:120, height:25, text:"Releases", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sLeftZone"});
		const var lblRam = ui.label(5, 182, {width:85, height:25, text:"RAM Use", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sLeftZone"});
		
		const var cmbChan = ui.comboBoxPanel(90, 42, {width:100, height:25, text:"Channel", items:channels, paintRoutine:paintRoutines.dropDown, parentComponent:"sLeftZone"});
		const var cmbPre = ui.comboBoxPanel(90, 77, {width:100, height:25, text:"Preload", items:bufferSizes, paintRoutine:paintRoutines.dropDown, parentComponent:"sLeftZone"});
		const var cmbBuf = ui.comboBoxPanel(90, 112, {width:100, height:25, text:"Buffer", items:bufferSizes, paintRoutine:paintRoutines.dropDown, parentComponent:"sLeftZone"});
		const var btnRel = ui.buttonPanel(90+50, 147, {width:50, height:25, paintRoutine:paintRoutines.toggleButton, parentComponent:"sLeftZone"});
		const var lblRamDisp = ui.label(95, 182, {width:100, height:25, text:"256MB", textColour:Theme.COMBO_TEXT, fontSize:14, alignment:"right", parentComponent:"sLeftZone"});
	
		//RR settings
		const var midZone = ui.panel(225, 12, {width:200, height:225, id:"sMidZone", paintRoutine:function(g){g.fillAll(Theme.ZONE);}, parentComponent:tab.getPanelId(tabs[1])}); //Outer panel
		const var lblTitle2 = ui.label(0, 3, {width:200, height:25, text:"Round Robin", textColour:Theme.H1, fontSize:16, fontStyle:"Bold", alignment:"centred", parentComponent:"sMidZone"});
		
		const var lblRRType = ui.label(5, 42, {width:85, height:25, text:"Type", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sMidZone"});
		const var lblRRMode = ui.label(5, 77, {width:85, height:25, text:"Mode", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sMidZone"});
		const var lblRRReset = ui.label(5, 112, {width:85, height:25, text:"Reset Time", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sMidZone"});
		
		const var cmbRRType = ui.comboBoxPanel(90, 42, {width:100, height:25, text:"Type", enableMidiLearn:true, items:["Off", "Real", "Synthetic", "Hybrid"], paintRoutine:paintRoutines.dropDown, parentComponent:"sMidZone"});
		const var cmbRRMode = ui.comboBoxPanel(90, 77, {width:100, height:25, text:"Mode", items:["Cycle", "Random", "Random Cycle"], paintRoutine:paintRoutines.dropDown, parentComponent:"sMidZone"});
		const var sliRRReset = ui.knob(90, 112, {width:100, height:25, style:"Horizontal", min:0, max:60, defaultValue:2, stepSize:1, suffix:" Seconds", bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:Theme.SLIDER_TEXT, parentComponent:"sMidZone"});
		
		//Legato settings
		const var rightZone = ui.panel(440, 12, {width:200, height:225, id:"sRightZone", paintRoutine:function(g){g.fillAll(Theme.ZONE);}, parentComponent:tab.getPanelId(tabs[1])}); //Outer panel
		const var lblTitle3 = ui.label(0, 3, {width:200, height:25, text:"Legato", textColour:Theme.H1, fontSize:16, fontStyle:"Bold", alignment:"centred", parentComponent:"sRightZone"});
		
		const var lblOffset = ui.label(5, 42, {width:85, height:25, text:"Offset", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sRightZone"});
		const var lblRatio = ui.label(5, 77, {width:85, height:25, text:"Fade Ratio", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sRightZone"});
		const var lblLegGlide = ui.label(5, 112, {width:85, height:25, text:"Glide Rate", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sRightZone"});
		const var lblLegRel = ui.label(5, 147, {width:110, height:25, text:"Releases", textColour:Theme.H2, fontSize:14, fontStyle:"Bold", parentComponent:"sRightZone"});
		
		const var sliOffset = ui.knob(90, 42, {width:100, height:25, style:"Horizontal", min:0, max:100, middlePosition:40, defaultValue:25, stepSize:0.1, suffix:"%", bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:Theme.SLIDER_TEXT, parentComponent:"sRightZone"});
		const var sliRatio = ui.knob(90, 77, {width:100, height:25, style:"Horizontal", min:20, max:100, defaultValue:50, stepSize:1, suffix:"%", bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:Theme.SLIDER_TEXT, parentComponent:"sRightZone"});
		const var sliGlide = ui.knob(90, 112, {width:100, height:25, style:"Horizontal", min:0, max:11, defaultValue:5, stepSize:1, bgColour:Theme.CONTROL_BG, itemColour:Theme.CONTROL_FG, itemColour2:0, textColour:0, parentComponent:"sRightZone"});
		const var lblGlideValue = ui.label(90, 112, {width:100, height:25, textColour:Theme.SLIDER_TEXT, alignment:"centred", parentComponent:"sRightZone"});
		const var btnLegRel = ui.buttonPanel(90+50, 147, {width:50, height:25, paintRoutine:paintRoutines.toggleButton, parentComponent:"sRightZone"});		
	}
	
	inline function onControllerCB(ccNum, ccVal)
	{
		if (ccNum == GLIDE_CC) //Glide time CC
		{
			reg v = Math.round(ccVal/12);
			legatoHandler.setAttribute(10, v);
			asyncUpdater.setFunctionAndUpdate(updateGlideSlider, v); //Defer GUI update
		}
	}
	
	inline function onControlCB(number, value)
	{
		switch (number)
		{
			case cmbChan: //MIDI channel filter
				if (value == 1) //Omni
				{
					chanFilter.setBypassed(true);
				}
				else 
				{
					chanFilter.setBypassed(false);
					chanFilter.setAttribute(0, value-1);
				}
			break;
			
			case cmbPre:
				changeBufferSettings(4, value-1);
				updateRamDisplay();
			break;
			
			case cmbBuf:
				changeBufferSettings(5, value-1);
				updateRamDisplay();
			break;
			
			case btnRel:
				for (s in releaseSamplers) //releaseSamplers is global level array
				{
					s.setAttribute(12, 1-value);
				}
				updateRamDisplay();
			break;
			
			case cmbRRType:
				changeRRSettings(0, value);
				cmbRRType.repaint();
			break;
			
			case cmbRRMode:
				changeRRSettings(1, value);
			break;
			
			case sliRRReset:
				changeRRSettings(5, value);
			break;
			
			case sliOffset:
				legatoHandler.setAttribute(9, 1-(value/100));
			break;
			
			case sliRatio:
				legatoHandler.setAttribute(8, value);
			break;
			
			case sliGlide:
				legatoHandler.setAttribute(10, value);
				lblGlideValue.set("text", rates[value]);
			break;
			
			case btnLegRel:
				sustainReleaseHandler.setAttribute(1, 1-value);
			break;
		}
	}	
	
	//Set's the glide value slider to v
	inline function updateGlideSlider(v)
	{
		sliGlide.setValue(v);
		lblGlideValue.set("text", rates[v]);
		sliGlide.repaint();
	}
	
	inline function updateRamDisplay()
	{
		lblRamDisp.set("text", Math.round(Engine.getMemoryUsage())+"MB");
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

