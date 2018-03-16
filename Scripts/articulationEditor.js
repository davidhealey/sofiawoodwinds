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
		const var muterIds = Synth.getIdList("MidiMuter");
		const var containerIds = Synth.getIdList("Container");
        const var rates = ["1/1", "1/2D", "1/2", "1/2T", "1/4D", "1/4", "1/4T", "1/8D", "1/8", "1/8T", "1/16D", "1/16", "1/16T", "1/32D", "1/32", "1/32T", "1/64D", "1/64", "1/64T", "Velocity"]; //Glide rates
        const var releaseHandler = Synth.getMidiProcessor("releaseHandler"); //Release handler script
		const var containers = []; //Containers whose IDs match articulation names
		const var muters = [];
		const var envelopes = [];
		const var keyswitches = [];
		
        //Store some articulation indexes to reduce CPU usage
        const var legatoIndex = idh.getArticulationIndex("meta_legato", false);
        const var glideIndex = idh.getArticulationIndex("meta_glide", false);
        		        
        //Populate note names array
        const var noteNames = [];
        for (i = 0; i < 127; i++)
        {
            noteNames[i] = Engine.getMidiNoteName(i);
        }
        		
		//GUI
		const var cmbKs = [];
		const var sliArtVol = [];
		const var sliAtk = [];
		const var sliRel = [];

		//Labels
		Content.setPropertiesFromJSON("lblArt", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
	    Content.setPropertiesFromJSON("lblKs", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblVol = ui.setupControl("lblVol", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblAtk = ui.setupControl("lblAtk", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblRel = ui.setupControl("lblRel", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblOffset = ui.setupControl("lblOffset", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblRatio = ui.setupControl("lblRatio", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblRate = ui.setupControl("lblRate", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		const var lblGlide = ui.setupControl("lblGlide", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		
		//Combo boxes, sliders, and buttons
		const var cmbArt = ui.comboBoxPanel("cmbArt", paintRoutines.comboBox, idh.getArticulationDisplayNames());
	    Content.setPropertiesFromJSON("cmbArt", {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
	    
	    const var sliOffset = ui.setupControl("sliOffset", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var sliRatio = ui.setupControl("sliRatio", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var sliRate = ui.setupControl("sliRate", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var btnGlideMode = ui.buttonPanel("btnGlideMode", paintRoutines.pushButton);
		Content.setPropertiesFromJSON("btnGlideMode", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		const var lblGlideVal = Content.getComponent("lblGlideVal");
				
        local parentIdx; //The parent index of meta articulations
        local articulationName;
        
		for (i = 0; i < idh.getNumArticulations(true); i++) //All available articulations
		{
		    articulationName = idh.getArticulationName(i, true); //Name of current (i) articulation in allArticulations array
		    
			cmbKs.push(Content.getComponent("cmbKs"+i)); //key switches
			ui.comboBoxPanel("cmbKs"+i, paintRoutines.comboBox, noteNames);
			Content.setPropertiesFromJSON("cmbKs"+i, {x:90, y:80, bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
	
			//Attack release and volume controls, only applicable to non-meta articulations
			if (articulationName.indexOf("meta_") == -1)
		    {
                sliAtk[i] = Content.getComponent("sliAtk"+i);
                Content.setPropertiesFromJSON("sliAtk"+i, {x:90, y:150, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
                sliAtk[i].set("defaultValue", idh.getAttack(instrumentName, idh.getArticulationName(i, false)));
	
                sliRel[i] = Content.getComponent("sliRel"+i);
                Content.setPropertiesFromJSON("sliRel"+i, {x:90, y:185, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
                sliRel[i].set("defaultValue", idh.getRelease(instrumentName, idh.getArticulationName(i, false)));
	
                sliArtVol[i] = Content.getComponent("sliArtVol"+i);
                Content.setPropertiesFromJSON("sliArtVol"+i, {x:90, y:115, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
		    }
		    
            //Get containers and muters for each articulation
            for (j = 0; j < containerIds.length; j++)
            {
                //Meta artculation uses parent's container and muter
		        if (articulationName.indexOf("meta_") != -1)
				{
                    parentIdx = idh.getParentIdx(instrumentName, articulationName); //Get the parent's index
				    containers[i] = containers[parentIdx];; //Use parent's container for meta articulation
				    muters[i] = muters[parentIdx]; //Use parent's muter for meta articulation
				    break; //Exit inner loop
				}
				else 
                {
                    //Container's ID contains articulation name
                    if (containerIds[j].indexOf(articulationName) != -1)
                    {
                        containers.push(Synth.getChildSynth(containerIds[j]));
                    }
                    
                    //MIDI muter ID contains articulation name
                    if (j < muterIds.length && muterIds[j].indexOf(articulationName) != -1)
                    {
                        muters.push(Synth.getMidiProcessor(muterIds[j])); //Get muter for articulation
                    } 
                }
            }
            		    	
			//Find envelopes for each articulation - ignore those with Release or without envelope in the ID
			for (e in envelopeIds)
			{
				if (e.indexOf(articulationName) != -1 && e.indexOf("nvelope") != -1 && e.indexOf("Release") == -1)
				{
   				    if (articulationName.indexOf("meta_") != -1) continue; //Skip meta articulations
   				    envelopes[i] = Synth.getModulator(e);
				}
			}
		}
	}
	
	inline function onNoteCB()
	{
        local idx = -1;
        
	    //If the note is outside of the instrument's playable range check if it is a key switch
	    if (Message.getNoteNumber() < range[0] || Message.getNoteNumber() > range[1])
	    {
	        Message.ignoreEvent(true);
            idx = idh.getKeyswitchIndex(instrumentName, Message.getNoteNumber()); //Check if note is ks
	    }

		if (idx == -1) //keyswitch did not trigger callback
	    {
            //If two notes are held, and the sustain pedal is down, and the current articulation is legato change to the glide articulation
			if (Synth.isLegatoInterval() && Synth.isSustainPedalDown() && cmbArt.getValue()-1 == legatoIndex)
			{
			    idx = glideIndex; //Get index of glide articulation
			}
	    }
		
		if (idx != -1) //Keyswitch triggered the callback or switched to glide articulation via sustain pedal
		{
		    cmbArt.setValue(idx+1);
			cmbArt.repaint(); //Async repaint
			changeArticulation(idx); //MIDI muter handler
			asyncUpdater.deferFunction(articulationUIHandlerAndColourKeys, idx); //Async UI update
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
			case 5: //Glide Time
			    v = Math.ceil(sliRate.get("max") / 100 * (normalised * 100));
			    sliRate.setValue(v);
			    lblGlideVal.set("text", rates[v]);
			break;
			
			case 32: //UACC
				idx = idh.getProgramIndex(ccValue); //Lookup program number
				
				if (idx != -1) //Assigned program number triggered callback
				{
				    cmbArt.setValue(idx+1); //Change displayed selected articulation
				    cmbArt.repaint(); //Async repaint
					changeArticulation(idx);
					asyncUpdater.deferFunction(articulationUIHandlerAndColourKeys, idx);
				}
			break;
			
			case 64: //Sustain pedal
						
                if (cmbArt.getValue()-1 == legatoIndex) //Current articulation is legato
                {	
                    Message.ignoreEvent(true);
                    Synth.isSustainPedalDown() ? legatoHandler.setAttribute(11, 1) : legatoHandler.setAttribute(11, 0); //Toggle same note legato based on sustain pedal position
                }
                else if (!Synth.isSustainPedalDown() && cmbArt.getValue()-1 == glideIndex) //Current articulation is glide and sustain pedal is lifted
                {
                    Message.ignoreEvent(true);
                    
                    //Change articulation to legato                    
                    cmbArt.setValue(legatoIndex+1);
                    cmbArt.repaint();
                    changeArticulation(legatoIndex);
                    asyncUpdater.deferFunction(articulationUIHandlerAndColourKeys, legatoIndex);
                }	
			break;
			
			case 65: //Glide whole tone on/off
			    if (ccValue > 64 != btnGlideMode.getValue()) //Only carry on if the value has changed
		        {
		            btnGlideMode.setValue(ccValue > 64);
		            updateGlideWholeToneState();
		        }
			break;
			
			case 72: //MIDI release
				v = (Math.pow(normalised, skewFactor)) * 20000.0;
				sliRel[cmbArt.getValue()-1].setValue(v);
				setEnvelopeRelease(cmbArt.getValue()-1, v);
			break;
			
			case 73: //MIDI attack
				v = (Math.pow(normalised, skewFactor)) * 20000.0;
				sliAtk[cmbArt.getValue()-1].setValue(v);
				setEnvelopeAttack(cmbArt.getValue()-1, v);
			break;			
		}
	}
	
	inline function onControlCB(number, value)
	{	    
	    switch (number)
	    {
	        case cmbArt:
                changeArticulation(value-1);
                colourPlayableKeys();
                updateUI(value-1); //Change displayed articulation controls
            break;
            
		    case sliOffset:
				legatoHandler.setAttribute(9, 1-(value/100));
			break;
			
			case sliRatio:
				legatoHandler.setAttribute(8, value);
			break;
			
			case sliRate:
				legatoHandler.setAttribute(10, value);
				lblGlideVal.set("text", rates[value]);
			break;
			
			case btnGlideMode:
                updateGlideWholeToneState();
			break;
			
            default: //Common controls for each articulations
                for (i = 0; i < cmbKs.length; i++)
                {
                    if (number == cmbKs[i]) //Key switch drop down
                    {                                                
                        if (value-1 < range[0] || value-1 > range[1]) //Selection is outside max playable range
                        {
                            keyswitches[i] = value-1;
                            colourKeyswitches();
                        }
                        else //Selection overlaps playable range
                        {
                            cmbKs[i].setValue(idh.getKeyswitch(instrumentName, i)+1); //Revert to previous KS
                            cmbKs[i].repaint();
                        }
                        break;
                    }
                    else if (number == sliArtVol[i]) //Volume
                    {
                        containers[i].setAttribute(0, Engine.getGainFactorForDecibels(value));
                        break;
                    }
                    else if (number == sliAtk[i]) //Attack
                    {
                        setEnvelopeAttack(i, value);
                        break;
                    }
                    else if (number == sliRel[i]) //Release
                    {
                        setEnvelopeRelease(i, value);
                        break;
                    }
                }
            break;
	    }
	}
	
	inline function setEnvelopeAttack(idx, value)
	{
        envelopes[idx].setAttribute(envelopes[idx].Attack, value);
	}
	
	inline function setEnvelopeRelease(idx, value)
	{
        envelopes[idx].setAttribute(envelopes[idx].Release, value);
	}
	
	//idx = instrumentArticulations array index (not allArticulations)
	inline function updateUI(idx)
	{	    	    
	    local n;
	    
        n = idh.getArticulationName(idx, false); //Get name of articulation (idx)
        
	    //Hide articulation controls
		for (i = 0; i < cmbKs.length; i++)
		{
			cmbKs[i].showControl(false);
			
			if (idh.getArticulationName(i, true).indexOf("meta_") != -1) continue; //Skip meta articulations

			sliArtVol[i].showControl(false);
			sliAtk[i].showControl(false);
			sliRel[i].showControl(false);
		}
		
		//Hide meta articulation controls
		lblOffset.showControl(false);
		lblRatio.showControl(false);
        lblRate.showControl(false);
        lblGlide.showControl(false);
		sliOffset.showControl(false);
		sliRatio.showControl(false);
        sliRate.showControl(false);
        lblGlideVal.showControl(false);
        btnGlideMode.showControl(false);            

        //Show controls for given articulation index (idx)
		cmbKs[idx].set("visible", true);
		
		if (n.indexOf("meta_") == -1) //Not a meta articulation
	    {
            sliArtVol[idx].showControl(true);
            sliAtk[idx].showControl(true);
            sliRel[idx].showControl(true);
            lblVol.showControl(true);
            lblAtk.showControl(true);
            lblRel.showControl(true);
	    }
	    else //Meta articulations
	    {	        
            if (n == "meta_legato"  || n == "meta_glide") //Legato script articulation
            {
                lblVol.showControl(false);
                lblAtk.showControl(false);
                lblRel.showControl(false);
            
                if (n == "meta_legato") //Legato specific controls
                {
                    lblOffset.showControl(true);
                    lblRatio.showControl(true);
                    sliOffset.showControl(true);
                    sliRatio.showControl(true);
                }
                else //Glide specific controls
                {
                    lblRate.showControl(true);
                    lblGlide.showControl(true);
                    sliRate.showControl(true);
                    lblGlideVal.showControl(true);
                    btnGlideMode.showControl(true);
                }
            }
	    }
	}
    
	inline function changeArticulation(idx)
	{
	    local n;
	    
		if (idx > -1) //Sanity check
		{
		    n = idh.getArticulationName(idx, false); //Get name of articulation
		    
			//Mute every articulation
			for (m in muters) //Each Midi muter
			{
				m.setAttribute(0, 1);
			}		
			muters[idx].setAttribute(0, 0); //Unmute articulation (idx)
			
			//Meta articulations
            if (n.indexOf("meta_") != -1)
		    {
                if (n == "meta_legato"  || n == "meta_glide") //Legato script articulation
                {
                    legatoHandler.setAttribute(idx, 1); //Enable correct legato script mode
                    releaseHandler.setAttribute(1, 1); //Enable release legato mode
                }
            }
            else //Not meta articulation 
		    {
		        legatoHandler.setAttribute(0, 1); //Bypass legato script
	            releaseHandler.setAttribute(1, 0); //Disable release legato mode
		    }
		}
	}
	
    /*This function is just a wrapper that can be called asynchronously to trigger its two contained functions*/
	inline function articulationUIHandlerAndColourKeys(idx)
	{
		colourPlayableKeys();
		updateUI(idx); //Change displayed articulation controls
	}
		
	inline function updateGlideWholeToneState()
    {
        local state = btnGlideMode.getValue();
        
        legatoHandler.setAttribute(3, state);
        state == 1 ? btnGlideMode.set("text", "Enabled") : btnGlideMode.set("text", "Disabled");
        btnGlideMode.repaint(); //Async redraw
    }
    
    inline function colourPlayableKeys()
	{
	    local n;
	    local r;
	    
		n = idh.getArticulationName(cmbArt.getValue()-1, false); //Name of current articulation
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