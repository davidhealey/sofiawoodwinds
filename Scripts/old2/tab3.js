namespace tab3
{
	inline function initCB()
	{	
		const var thisTab = tabs[3];
		const var tabPanel = tab.getPanelId(thisTab);

		reg chanFilter = Synth.getMidiProcessor("instrumentChannelFilter"); //Instrument level MIDI channel filter
		const var channels = ["Omni", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
		
		const var footer = ui.panel(10, 260, {width:630, height:30, parentComponent:tabPanel, paintRoutine:footerPaint});
		const var presetBrowser = ui.floatingTile(10, 0, {width:630, height:260, parentComponent:tabPanel}, {"Type":"PresetBrowser", "ColourData":{itemColour1:"0xFF994C46", bgColour:"0xFC333333"}});
		
		const var lblStats = ui.label(15, 264, {width:350, height:21, parentComponent:tabPanel, text:"", fontSize:15, textColour:0xFFFFFFFF});
		const var btnStats = ui.button(15, 264, {width:350, height:21, parentComponent:tabPanel, filmstripImage:"empty.png"});
		
		const var lblChanHeading = ui.label(490, 264, {width:100, height:21, parentComponent:tabPanel, text:"MIDI Channel:", fontSize:15, textColour:0xFFFFFFFF});
		const var cmbChan = ui.comboBoxPanel(590, 264, {width:40, height:21, parentComponent:tabPanel, paintRoutine:cmbPaint, items:channels});
	}
	
	inline function onControlCB(number, value)
	{
		switch (number)
		{ 
			case cmbChan: //Instrument channel filter
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
			
			case btnStats: //Updates the displayed stats
				reg stats = "RAM: " + Math.floor(Engine.getMemoryUsage()) + " MB | BPM: " + Engine.getHostBpm() + " | Version: " + Engine.getVersion() + " by David Healey";
				lblStats.set("text", stats);
			break;
		}
	}
	
	const var footerPaint = function(g)
	{
		g.fillAll(0xF0333333); //Dark Grey
	};
	
	const var cmbPaint = function(g)
	{
		g.fillAll(0xF0555555); //Slightly less dark grey
			
		if (this.getValue()-1 > -1)
		{
			g.setColour(0xFFFFFFFF); //White
			g.drawAlignedText(this.data.items[this.getValue()-1], [4, 2, 80, 15], "left");
		}
	}
}