/*
    Copyright 2018 David Healey

    This file is part of Libre Harp.

    Libre Harp is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Libre Harp is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Libre Harp.  If not, see <http://www.gnu.org/licenses/>.
*/

namespace articulationEditor
{
	inline function onInitCB()
	{
		const var envelopeIds = Synth.getIdList("Simple Envelope");
		const var muterIds = Synth.getIdList("MidiMuter");
		const var containerIds = Synth.getIdList("Container");
        const var rates = ["1/1", "1/2D", "1/2", "1/2T", "1/4D", "1/4", "1/4T", "1/8D", "1/8", "1/8T", "1/16D", "1/16", "1/16T", "1/32D", "1/32", "1/32T", "1/64D", "1/64", "1/64T", "Velocity"]; //Glide rates
        const var releaseHandler = Synth.getMidiProcessor("sustainReleaseHandler"); //Sustain/legato/glide release handler
        
		reg containers = []; //Containers whose IDs match articulation names
		reg muters = [];
		reg envelopes = {};
		
		//Variables used to get the parent index of meta articulations
        local articulationName;
        local parentName;
        local parentIdx;
        		
		//GUI
		const var cmbKs = [];
		const var sliArtVol = [];
		const var sliAtk = [];
		const var sliRel = [];
		const var lblVol = Content.getComponent("lblVol");
		const var lblAtk = Content.getComponent("lblAtk");
		const var lblRel = Content.getComponent("lblRel");
		
		const var lblOffset = ui.setupControl("lblOffset", {fontName:Theme.H2.fontName, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize});
		const var lblRatio = ui.setupControl("lblRatio", {fontName:Theme.H2.fontName, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize});
		const var lblRate = ui.setupControl("lblRate", {fontName:Theme.H2.fontName, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize});
		const var lblGlide = ui.setupControl("lblGlide", {fontName:Theme.H2.fontName, textColour:Theme.H2.colour, fontSize:Theme.H2.fontSize});
		const var sliOffset = ui.setupControl("sliOffset", {bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, textColour:Theme.SLIDER.text});
		const var sliRatio = ui.setupControl("sliRatio", {bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, textColour:Theme.SLIDER.text});
		const var sliRate = ui.setupControl("sliRate", {bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg, textColour:Theme.SLIDER.text});
		const var lblGlideVal = Content.getComponent("lblGlideVal");
		const var btnGlideMode = ui.buttonPanel("btnGlideMode", paintRoutines.pushButton);		
		
		const var cmbArt = Content.getComponent("cmbArt");
		ui.comboBoxPanel("cmbArt", paintRoutines.comboBox, idh.getArticulationDisplayNames(instrumentName));
	
		Content.setPropertiesFromJSON("lblArt", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblKs", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblArtVol", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblAtk", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblRel", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		
		for (i = 0; i < idh.getNumArticulations(true); i++) //All available articulations
		{
			cmbKs.push(Content.getComponent("cmbKs"+i));
			ui.comboBoxPanel("cmbKs"+i, paintRoutines.comboBox, noteNames);
			Content.setPropertiesFromJSON("cmbKs"+i, {x:90});
	
			//Attack release and volume controls, only applicable to non-meta articulations
			if (idh.getArticulationNames(true)[i].indexOf("meta_") == -1)
		    {
                sliAtk[i] = Content.getComponent("sliAtk"+i);
                Content.setPropertiesFromJSON("sliAtk"+i, {x:90, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg});
	
                sliRel[i] = Content.getComponent("sliRel"+i);
                Content.setPropertiesFromJSON("sliRel"+i, {x:90, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg});
	
                sliArtVol[i] = Content.getComponent("sliArtVol"+i);
                Content.setPropertiesFromJSON("sliArtVol"+i, {x:90, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg});
		    }
		    
            //Get containers and muters for each articulation
            for (j = 0; j < containerIds.length; j++)
            {
		        if (idh.getArticulationNames(true)[i].indexOf("meta_") != -1) //Meta artculation uses parent's container and muter
				{
				    //Get the parent's index
				    articulationName = idh.getArticulationNames(null)[i];
				    parentName = idh.getData(instrumentName).articulations[articulationName].parent;
				    parentIdx = idh.getArticulationNames(null).indexOf(parentName);

				    containers[i] = containers[parentIdx];; //Use parent's container for meta articulation
				    muters[i] = muters[parentIdx]; //Use parent's muter for meta articulation
				    break; //Exit inner loop
				}
				else 
                {
                    if (containerIds[j].indexOf(idh.getArticulationNames(null)[i]) != -1)
                    {
                        containers.push(Synth.getChildSynth(containerIds[j]));
                    }
                    
                    if (j < muterIds.length && muterIds[j].indexOf(idh.getArticulationNames(null)[i]) != -1) //MIDI muter ID contains articulation name   
                    {
                        muters.push(Synth.getMidiProcessor(muterIds[j])); //Get muter for articulation
                    } 
                }
            }
            		    	
			//Find envelopes for each articulation - ignore those with Release or without envelope in the ID
			for (e in envelopeIds)
			{
				if (e.indexOf(idh.getArticulationNames(null)[i]) != -1 && e.indexOf("nvelope") != -1 && e.indexOf("Release") == -1)
				{
   				    if (idh.getArticulationNames(null)[i].indexOf("meta_") != -1) continue; //Skip meta articulations
					if (envelopes[i] == undefined) envelopes[i] = []; //An articulation may have more than one envelope
					envelopes[i].push(Synth.getModulator(e));
				}
			}
		}
	}
	
	inline function onNoteCB()
	{
		reg idx = idh.getKeyswitchIndex(instrumentName, Message.getNoteNumber()); //Check for index in keyswitches array

		if (idx == -1) //keyswitch did not trigger callback
	    {
            //If the current articulation is legato, two notes are held, and the sustain pedal is down, change to the glide articulation
			if (cmbArt.getValue()-1 == idh.getArticulationIndex("meta_legato", false) && Synth.isLegatoInterval() && Synth.isSustainPedalDown())
			{
			    idx = idh.getArticulationIndex("meta_glide", false);
			}
	    }
		
		if (idx != -1) //Keyswitch triggered the callback or switched to glide articulation via sustain pedal
		{
		    cmbArt.setValue(idx+1);
			cmbArt.repaint(); //Async repaint
			changeArticulation(idx);
			asyncUpdater.setFunctionAndUpdate(articulationUIHandlerAndColourKeys, idx);
		}
	}
		
	inline function onControllerCB()
	{
		local v; //For converting the CC value (0-127) to the correct slider value
		local skewFactor = 5.0; //values > 1 will yield more resolution at the lower end
		local normalised = Message.getControllerValue() / 127.0;
		
		switch (Message.getControllerNumber())
		{		
			case 32: //UACC
				local idx = idh.getProgramIndex(Message.getControllerValue()); //Lookup program number
				
				if (idx != -1) //Assigned program number triggered callback
				{
					changeArticulation(idx);
					asyncUpdater.setFunctionAndUpdate(articulationUIHandlerAndColourKeys, idx);
					cmbArt.setValue(idh.instrumentArticulationIndexToAllArticulationIndex(idx)+1); //Change displayed selected articulation
					cmbArt.repaint(); //Async repaint
				}
			break;
			
			case 64: //Sustain pedal
			    Message.ignoreEvent(true);
			
                if (cmbArt.getValue()-1 == idh.getArticulationIndex("meta_legato", false)) //Current articulation is legato
                {				
                    Synth.isSustainPedalDown() ? legatoHandler.setAttribute(11, 1) : legatoHandler.setAttribute(11, 0); //Toggle same note legato based on sustain pedal position
                }
                else if (cmbArt.getValue()-1 == idh.getArticulationIndex("meta_glide", false) && !Synth.isSustainPedalDown()) //Current articulation is glide and sustain pedal is lifted
                {
                    //Change articulation to legato
                    local idx = idh.getArticulationIndex("meta_legato", false);
                    
                    cmbArt.setValue(idx+1);
                    cmbArt.repaint();
                    changeArticulation(idx);
                    asyncUpdater.setFunctionAndUpdate(articulationUIHandlerAndColourKeys, idx);
                }	
			break;			
			
			case 73: //MIDI attack CC
				v = (Math.pow(normalised, skewFactor)) * 20000.0;
				sliAtk[cmbArt.getValue()-1].setValue(v);
				setEnvelopeAttack(cmbArt.getValue()-1, v);
			break;
			
			case 72: //MIDI release CC
				v = (Math.pow(normalised, skewFactor)) * 20000.0;
				sliRel[cmbArt.getValue()-1].setValue(v);
				setEnvelopeRelease(cmbArt.getValue()-1, v);
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
                articulationUIHandler(value-1); //Change displayed articulation controls
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
				legatoHandler.setAttribute(3, value);
				btnGlideMode.repaintImmediately();
			break;
			
            default:
                for (i = 0; i < idh.getNumArticulations(null); i++) //Each of the instrument's articulations
                {
                    if (number == cmbKs[i]) //Key switch
                    {
                        local r = idh.getRange(instrumentName); //Full playable range of instrument

                        if (value-1 < r[0] || value-1 > r[1]) //Outside playable range
                        {
                            Engine.setKeyColour(idh.getKeyswitch(instrumentName, i), Colours.withAlpha(Colours.white, 0.0)); //Reset current KS colour
					
                            if (idh.getArticulationNames(false).contains(idh.getArticulationNames(true)[i])) //If the articulation is used by the instrument
                            {
                                idh.setKeyswitch(instrumentName, i, value-1); //Update KS
                                Engine.setKeyColour(value-1, Colours.withAlpha(Colours.red, 0.3)); //Update KS colour					
                            }
                        }
                        else 
                        {
                            cmbKs[i].setValue(idh.getKeyswitch(instrumentName, i)+1); //Revert to previous KS
                            cmbKs[i].repaintImmediately();
                        }
                        break;
                    }
                    else if (number == sliArtVol[i]) //Articulation volume
                    {
                        containers[i].setAttribute(0, Engine.getGainFactorForDecibels(value));
                        break;
                    }
                    else if (number == sliAtk[i])
                    {
                        setEnvelopeAttack(i, value);
                        break;
                    }
                    else if (number == sliRel[i])
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
		for (e in envelopes[idx]) //Each envelope for the articulation (i)
		{
			e.setAttribute(e.Attack, value);
		}
	}
	
	inline function setEnvelopeRelease(idx, value)
	{
		for (e in envelopes[idx]) //Each envelope for the articulation (i)
		{
			e.setAttribute(e.Release, value);
		}
	}
	
	//idx = instrumentArticulations array index (not allArticulations)
	inline function articulationUIHandler(idx)
	{	    	    
        local a = idh.getArticulationName(idx, false); //Get name of articulation

	    //Hide all articulation controls
		for (i = 0; i < idh.getNumArticulations(null); i++)
		{
			cmbKs[i].set("visible", false);
			
			if (idh.getArticulationNames(null)[i].indexOf("meta_") != -1) continue; //Skip meta articulations

			sliArtVol[i].set("visible", false);
			sliAtk[i].set("visible", false);
			sliRel[i].set("visible", false);
		}
		
		//Hide meta articulation controls
		lblOffset.set("visible", false);
		lblRatio.set("visible", false);
        lblRate.set("visible", false);
        lblGlide.set("visible", false);
		sliOffset.set("visible", false);
		sliRatio.set("visible", false);
        sliRate.set("visible", false);
        lblGlideVal.set("visible", false);
        btnGlideMode.set("visible", false);            

        //Show controls for given articulation index (idx)
		cmbKs[idx].set("visible", true);
		
		if (a.indexOf("meta_") == -1) //Not a meta articulation
	    {
            sliArtVol[idx].set("visible", true);
            sliAtk[idx].set("visible", true);
            sliRel[idx].set("visible", true);
            lblVol.set("visible", true);
            lblAtk.set("visible", true);
            lblRel.set("visible", true);
            if (a == "sustain") changeRRSettings(); //If articulation is sustain enable correct round robin mode
	    }
	    else
	    {
	        metaArticulationUIHandler(a);
	    }
	}
	
	inline function metaArticulationUIHandler(a)
    {        
        if (a == "meta_legato"  || a == "meta_glide") //Legato script articulation
        {            
            lblVol.set("visible", false);
            lblAtk.set("visible", false);
            lblRel.set("visible", false);
            
            if (a == "meta_legato") //Legato specific controls
            {
                lblOffset.set("visible", true);
                lblRatio.set("visible", true);
                sliOffset.set("visible", true);
                sliRatio.set("visible", true);
            }
            else //Glide specific controls
            {
                lblRate.set("visible", true);
                lblGlide.set("visible", true);
                sliRate.set("visible", true);
                lblGlideVal.set("visible", true);
                btnGlideMode.set("visible", true);
            }
        }
    }
    
	inline function changeArticulation(idx)
	{
		if (idx > -1) //Sanity check
		{
		    local a = idh.getArticulationName(idx, false); //Get name of articulation
		    
			//Mute every articulation
			for (m in muters) //Each Midi muter
			{
				m.setAttribute(0, 1);
			}		
			muters[idx].setAttribute(0, 0); //Unmute articulation (a)	
			
			//Meta articulations
            if (a.indexOf("meta_") != -1)
		    {
                if (a == "meta_legato"  || a == "meta_glide") //Legato script articulation
                {
                    legatoHandler.setAttribute(idx, 1); //Enable correct legato script mode
                    releaseHandler.setAttribute(1, 1); //Enable release legato mode
                    sustainRoundRobin.setAttribute(0, 1); //Bypass round robin
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
		articulationUIHandler(idx); //Change displayed articulation controls
	}
	
	inline function colourPlayableKeys()
	{
		local instRange = idh.getRange(instrumentName); //Full playable range of instrument
		local a = idh.getArticulationName(cmbArt.getValue()-1, false);
		local r = idh.getArticulationRange(instrumentName, a); //Range of current articulation

		for (i = 0; i < 128; i++)
		{
		    if (idh.getKeyswitchIndex(instrumentName, i) != -1) continue; //Skip key switches
		    
            Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Reset key colour   
			
			if (i >= r[0] && i <= r[1]) //i is in articulation's range
			{
				Engine.setKeyColour(i, Colours.withAlpha(Colours.blue, 0.3)); //Update KS colour	
			}
		}
	}
}