/*
    Copyright 2018 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this file. If not, see <http://www.gnu.org/licenses/>.
*/

namespace articulationEditor
{
	inline function onInitCB()
	{
		const var muterIds = Synth.getIdList("MidiMuter"); //One muter per articulation
		const var muters = []; //Stores MIDI muters
        const var rates = ["1/1", "1/2D", "1/2", "1/2T", "1/4D", "1/4", "1/4T", "1/8D", "1/8", "1/8T", "1/16D", "1/16", "1/16T", "1/32D", "1/32", "1/32T", "1/64D", "1/64", "1/64T", "Velocity"]; //Glide rates
        const var sustainIndex = 0; //Holds index of sustain/legato articulation for current instrument
        
        //Instrument specific variables set in pnlArticulation's callback
        reg range;
		reg keyswitches; //idh.getKeyswitches(instrumentName);
		reg articulations; //Instrument's articulation names
		reg displayNames; //Articulation display names
        reg glideIndex; //Holds index of glide articulation for current instrument
                        
		//GUI
        const var pnlArticulations = Content.getComponent("pnlArticulations"); //Articulation controls parent
				
		//Labels
		//Legato and glide labels
		const var lblOffset = ui.setupControl("lblOffset", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblRate = ui.setupControl("lblRate", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblGlideMode = ui.setupControl("lblGlideMode", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		
		//Generic labels for most articulations
		const var lbls = [];
		for (i = 0; i < 4; i++)
	    {
	        lbls[i] = ui.setupControl("lblArt"+i, {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
	    }

	    //Articulation selection combo box
	    const var cmbArt = ui.comboBoxPanel("cmbArt", paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, []);
	    Content.setPropertiesFromJSON("cmbArt", {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
	    
	    //Get volume, attack, and release controls and set their properties
	    const var vol = [];
	    const var atk = [];
	    const var rel = [];
	    
	    for (i = 0; i < idh.getNumArticulations(true); i++) //Every articulation available (even meta)
	    {
	        vol[i] = ui.setupControl("sliArtVol"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:0x00000000});
	        atk[i] = ui.setupControl("sliAtk"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
	        rel[i] = ui.setupControl("sliRel"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
	    }	    
	    
	    //Legato and glide controls
	    const var sliOffset = ui.setupControl("sliOffset", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var sliRate = ui.setupControl("sliRate", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var btnGlideMode = ui.buttonPanel("btnGlideMode", paintRoutines.pushButton);
		Content.setPropertiesFromJSON("btnGlideMode", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var lblRateVal = Content.getComponent("lblRateVal");
		
   	    //Build array of MIDI muters - one per keyswitchable articulation
	    for (m in muterIds)
	    {
	        muters.push(Synth.getMidiProcessor(m));
	    }
	}
	
	inline function onNoteCB()
	{
        local idx = -1;
        
	    //If the note is outside of the instrument's playable range check if it is a key switch
	    if (Message.getNoteNumber() < range[0] || Message.getNoteNumber() > range[1])
	    {
	        Message.ignoreEvent(true);
            idx = keyswitches.indexOf(Message.getNoteNumber()); //Check if note is ks
	    }

		if (idx == -1) //keyswitch did not trigger callback
	    {
            //If two notes are held, and the sustain pedal is down, and the current articulation is legato change to the glide articulation
			if (Synth.isLegatoInterval() && Synth.isSustainPedalDown() && cmbArt.getValue() == sustainIndex)
			{
			    idx = glideIndex; //Get index of glide articulation
			}
	    }
		
		if (idx != -1) //Keyswitch triggered the callback or switched to glide articulation via sustain pedal
		{
		    cmbArt.setValue(idx+1);
		    cmbArt.changed();			
			asyncUpdater.deferFunction(updateGUI, idx);
		}
	}
		
	inline function onControllerCB()
	{
	    local ccNum;
	    local ccValue;

		if (Message.isProgramChange())
	    {
	        ccNum = 32; //Treat program changes as UACC
	        ccValue = Message.getProgramChangeNumber();
	    }
	    else
	    {
	        ccNum = Message.getControllerNumber();
	        ccValue = Message.getControllerValue();
	    }
				
		switch (ccNum)
		{					
			case 32: //UACC
				idx = idh.getProgramIndex(ccValue); //Lookup program number
				
				if (idx != -1) //Assigned program number triggered callback
				{
					changeArticulation(idx);
					asyncUpdater.deferFunction(updateGUI, idx); //Change articulation to sustain/legato
				}
			break;
			
			case 64: //Sustain pedal
						
                if (cmbArt.getValue()-1 == sustainIndex) //Current articulation is sustain/legato
                {	
                    Message.ignoreEvent(true);
                    
                    //Toggle same note legato based on sustain pedal position
                    Synth.isSustainPedalDown() ? legatoHandler.setAttribute(11, 1) : legatoHandler.setAttribute(11, 0);
                }
                else if (!Synth.isSustainPedalDown() && cmbArt.getValue()-1 == glideIndex) //Current articulation is glide and sustain pedal is lifted
                {
                    Message.ignoreEvent(true);
                    asyncUpdater.deferFunction(updateGUI, sustainIndex); //Change articulation to sustain/legato
                }	
			break;
		}
	}
	
	inline function onControlCB(number, value)
	{	    
	    switch (number)
	    {   	        
	        case pnlArticulations:
                range = idh.getRange(instrumentName); //Get the instruments playable range
                articulations = idh.getArticulationNames(instrumentName); //Get instrument's articulation names
                displayNames = idh.getArticulationDisplayNames(instrumentName); //Get articulation display names
                keyswitches = idh.getKeyswitches(instrumentName); //Get instrument's keyswitch numbers
                glideIndex = articulations.indexOf("glide"); //Get glide articulation index
                colourKeyswitches();
                
                //Set patch's articulation names as cmbArt's menu items
                ui.setComboPanelItems("cmbArt", idh.getArticulationDisplayNames(instrumentName));
	        break;
	        
	        case cmbArt:
	            changeArticulation(value-1);
	            updateGUI(value-1);
	        break;
	        
		    case sliOffset:
				changeLegatoOffset(value);
			break;
						
			case sliRate:
                changeGlideRate(value);
			break;
			
			case btnGlideMode:
                updateGlideWholeToneState(value);
			break;
	    }
	}
		    	    
	inline function changeArticulation(idx)
	{
		if (idx > -1) //Sanity check
		{
			//Mute every articulation
			for (m in muters) //Each Midi muter
			{
				m.setAttribute(0, 1);
			}
		    
		    if (idx == sustainIndex || idx == glideIndex)
		    {
		        //Enable correct legato script mode
		        idx == sustainIndex ? legatoHandler.setAttribute(1, 1) : legatoHandler.setAttribute(2, 1);
                muters[sustainIndex].setAttribute(0, 0); //Unmute sustain/legato/glide muter
		    }
		    else
		    {
		        muters[idx].setAttribute(0, 0); //Unmute articulation (idx)
		    }
		}
	}
	
	inline function changeLegatoOffset(v)
    {
        sliOffset.setValue(v);
        legatoHandler.setAttribute(9, 1-(v/100));
    }
    
	inline function changeGlideRate(v)
    {
        sliRate.setValue(v);
        legatoHandler.setAttribute(10, v);
        lblRateVal.set("text", rates[v]);
    }
        
	inline function updateGlideWholeToneState(v)
    {        
        btnGlideMode.setValue(v);
        btnGlideMode.repaint();
        legatoHandler.setAttribute(3, v);
        v == 1 ? btnGlideMode.set("text", "Whole Step") : btnGlideMode.set("text", "Half Step");
    }
    
    inline function colourPlayableKeys(idx)
	{
	    local aRange;
	    
		aRange = idh.getArticulationRange(instrumentName, articulations[idx]); //Range of current articulation

		for (i = range[0]; i <= range[1]; i++) //Max playable range of instrument
		{		    
            Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Reset key colour   
			
			if (i >= aRange[0] && i <= aRange[1]) //i is in articulation's range
			{
				Engine.setKeyColour(i, Colours.withAlpha(Colours.blue, 0.3)); //Update colour	
			}
		}
	}
	
    inline function colourKeyswitches()
    {
        for (i = 0; i < 128; i++) //Every MIDI note
        {
            if (i < range[0] || i > range[1]) //j is outside max playable range
            {
                Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Reset current KS colour
                                
                if (keyswitches.contains(i)) //j is an assigned key switch
                {
                    Engine.setKeyColour(i, Colours.withAlpha(Colours.red, 0.3)); //Colour KS
                }
            }
        }
    }
    
    //This function should only ever be called async
    inline function updateGUI(idx)
    {
        local i;
        
        colourPlayableKeys(idx);
                
        //Hide all articulation controls
        for (i = 0; i < vol.length; i++)
        {
            vol[i].showControl(false);
            atk[i].showControl(false);
            rel[i].showControl(false);
        }
               
        lblOffset.showControl(false);
        lblRate.showControl(false);
        lblGlideMode.showControl(false);
        sliRate.showControl(false);
        sliOffset.showControl(false);
        btnGlideMode.showControl(false);        
        
        //Show controls for current articulation
        if (articulations[idx] == "glide") //Glide has specific controls...
        {
            lblRate.showControl(true);
            lblGlideMode.showControl(true);
            sliRate.showControl(true);
            btnGlideMode.showControl(true);
            
            //Hide generic labels
            for (i = 1; i < lbls.length; i++)
            {
                lbls[i].showControl(false);
            }
        }
        else
        {
            if (articulations[idx] == "sustain") //Sustain/legato specific controls
            {
                lblOffset.showControl(true);
                sliOffset.showControl(true);
            }
                
            for (i = 0; i < lbls.length; i++) //Generic labels
            {
                lbls[i].showControl(true);
            }
        
            vol[idx].showControl(true);
            atk[idx].showControl(true);
            rel[idx].showControl(true);   
        }
    }
}