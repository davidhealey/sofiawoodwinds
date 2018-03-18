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
		const var envelopeIds = Synth.getIdList("Simple Envelope");
		const var envelopes = []; //Stores simple envelopes
		const var muterIds = Synth.getIdList("MidiMuter");
		const var muters = []; //Stores MIDI muters
        const var rates = ["1/1", "1/2D", "1/2", "1/2T", "1/4D", "1/4", "1/4T", "1/8D", "1/8", "1/8T", "1/16D", "1/16", "1/16T", "1/32D", "1/32", "1/32T", "1/64D", "1/64", "1/64T", "Velocity"]; //Glide rates
		const var keyswitches = [24, 25, 26];
		
        //Store some articulation indexes to reduce CPU usage
        const var sustainIndex = idh.getArticulationIndex("sustain", false);
        const var glideIndex = idh.getArticulationIndex("glide", false);
        		               		
		//GUI
		//Use the panel to persistently store the selected articulation
		const var currentArt = Content.getComponent("pnlArticulations");
		
		colourKeyswitches();
		
		//Labels
		for (i = 0; i < 4; i++)
	    {
	        Content.setPropertiesFromJSON("lblArt"+i, {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
	    }
	    
	    const var sliOffset = ui.setupControl("sliOffset", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var sliRatio = ui.setupControl("sliRatio", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var sliRate = ui.setupControl("sliRate", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var btnGlideMode = ui.buttonPanel("btnGlideMode", paintRoutines.pushButton);
		Content.setPropertiesFromJSON("btnGlideMode", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var lblRateVal = Content.getComponent("lblRateVal");
		const var sliRel = ui.setupControl("sliRel", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
				        
        //Build array of envelopes
        for (e in envelopeIds)
	    {
	        if (e.indexOf("xclude") != -1) continue; //Skip envelopes with "xclude" in their ID
	        envelopes.push(Synth.getModulator(e));
	    }
        
	    //Build array of MIDI muters, should be one per keyswitchable articulation
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
			if (Synth.isLegatoInterval() && Synth.isSustainPedalDown() && currentArt.getValue() == sustainIndex)
			{
			    idx = glideIndex; //Get index of glide articulation
			}
	    }
		
		if (idx != -1) //Keyswitch triggered the callback or switched to glide articulation via sustain pedal
		{
			changeArticulation(idx); //MIDI muter handler
			asyncUpdater.deferFunction(colourPlayableKeys, idx);
		}
	}
		
	inline function onControllerCB()
	{
	    local ccNum;
	    local ccValue;
		local v; //For converting the CC value (0-127) to the correct slider value
		local skewFactor = 5.0; //values > 1 will yield more resolution at the lower end
		local normalised = Message.getControllerValue() / 127.0;

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
			case 5: //Glide Rate
			    v = Math.ceil(sliRate.get("max") / 100 * (normalised * 100));
			    if (v != sliRate.getValue()) asyncUpdater.deferFunction(changeGlideRate, v);
			break;
			
			case 15: //Legato offset
			    v = Math.ceil(sliOffset.get("max") / 100 * (normalised * 100));
			    if (v != sliOffset.getValue()) asyncUpdater.deferFunction(changeLegatoOffset, v);
			break;
			
			case 32: //UACC
				idx = idh.getProgramIndex(ccValue); //Lookup program number
				
				if (idx != -1) //Assigned program number triggered callback
				{
					changeArticulation(idx);
					asyncUpdater.deferFunction(colourPlayableKeys, idx);
				}
			break;
			
			case 64: //Sustain pedal
						
                if (currentArt.getValue() == sustainIndex) //Current articulation is sustain/legato
                {	
                    Message.ignoreEvent(true);
                    
                    //Toggle same note legato based on sustain pedal position
                    Synth.isSustainPedalDown() ? legatoHandler.setAttribute(11, 1) : legatoHandler.setAttribute(11, 0);
                }
                else if (!Synth.isSustainPedalDown() && currentArt.getValue() == glideIndex) //Current articulation is glide and sustain pedal is lifted
                {
                    Message.ignoreEvent(true);
                    
                    //Change articulation to sustain/legato
                    changeArticulation(sustainIndex);
                    asyncUpdater.deferFunction(colourPlayableKeys, idx);
                }	
			break;
			
			case 65: //Glide whole tone on/off
			    if (ccValue > 64 != btnGlideMode.getValue()) //Only carry on if the value has changed
		        {
		            asyncUpdater.deferFunction(updateGlideWholeToneState, (ccValue > 64));
		        }
			break;
			
			case 72: //ADSR release
				v = (Math.pow(normalised, skewFactor)) * 20000.0;
				if(v != sliRel.getValue(v))
                {
                    sliRel.setValue(v);
                    asyncUpdater.deferFunction(setEnvelopeRelease, v);		        
                }
			break;		
		}
	}
	
	inline function onControlCB(number, value)
	{	    
	    switch (number)
	    {            
	        case currentArt: //pnlArticulations
	            colourPlayableKeys(value);
	            articulationName = idh.getDisplayName(value); //Update variable in main
	        break;
	        
		    case sliOffset:
				changeLegatoOffset(value);
			break;
			
			case sliRatio:
				legatoHandler.setAttribute(8, value);
			break;
			
			case sliRate:
                changeGlideRate(value);
			break;
			
			case btnGlideMode:
                updateGlideWholeToneState(value);
			break;
			
			case sliRel:
			    setEnvelopeRelease(value);
			break;
	    }
	}
		
	inline function changeGlideRate(v)
    {
        sliRate.setValue(v);
        legatoHandler.setAttribute(10, v);
        lblRateVal.set("text", rates[v]);
    }
    
    inline function changeLegatoOffset(v)
    {
        sliOffset.setValue(v);
        legatoHandler.setAttribute(9, 1-(v/100));
    }
    
	inline function setEnvelopeRelease(v)
	{
	    for (e in envelopes)
	    {
	        e.setAttribute(e.Release, v);
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
		    
		    currentArt.setValue(idx); //Store the articulation as the panel's value
		    articulationName = idh.getDisplayName(idx); //Update variable in main
		}
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
	    local n;
	    local r;
	    
		n = idh.getArticulationName(idx, false); //Name of current articulation
		r = idh.getArticulationRange(instrumentName, n); //Range of current articulation

		for (i = 0; i < 128; i++)
		{
		    if (keyswitches.indexOf(i) != -1) continue; //Skip key switches
		    
            Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Reset key colour   
			
			if (i >= r[0] && i <= r[1]) //i is in articulation's range
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
}