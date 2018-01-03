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
		
		reg containers = []; //Containers whose IDs match articulation names
		reg muters = [];
		reg envelopes = {};
	
		//Get articulation containers
		for (c in containerIds) //containerIDs is in main script
		{
			if (idh.getArticulationNames(null).indexOf(c) != -1)
			{
				containers.push(Synth.getChildSynth(c));
			}
		}
		
		//GUI
		const var cmbKs = [];
		const var sliArtVol = [];
		const var sliAtk = [];
		const var sliRel = [];
				
		const var cmbArt = Content.getComponent("cmbArt");
		ui.comboBoxPanel("cmbArt", paintRoutines.comboBox, idh.getArticulationDisplayNames(instrumentName));
	
		Content.setPropertiesFromJSON("lblArt", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblKs", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblArtVol", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblAtk", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		Content.setPropertiesFromJSON("lblRel", {fontName:Theme.H2.fontName, fontSize:Theme.H2.fontSize});
		
		for (i = 0; i < idh.getNumArticulations(null); i++)
		{
			cmbKs.push(Content.getComponent("cmbKs"+i));
			ui.comboBoxPanel("cmbKs"+i, paintRoutines.comboBox, noteNames);
			Content.setPropertiesFromJSON("cmbKs"+i, {x:90});
	
			sliAtk.push(Content.getComponent("sliAtk"+i));
			Content.setPropertiesFromJSON("sliAtk"+i, {x:90, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg});
	
			sliRel.push(Content.getComponent("sliRel"+i));
			Content.setPropertiesFromJSON("sliRel"+i, {x:90, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg});
	
			sliArtVol.push(Content.getComponent("sliArtVol"+i));
			Content.setPropertiesFromJSON("sliArtVol"+i, {x:90, bgColour:Theme.SLIDER.bg, itemColour:Theme.SLIDER.fg});
	
			//Get MIDI muter for each articulation
			for (m in muterIds) //Each MIDI muter ID
			{
				if (m.indexOf(idh.getArticulationNames(null)[i]) != -1) //MIDI muter ID contains articulation name
				{
					muters[i] = Synth.getMidiProcessor(m); //Get muter for articulation
					break; //Exit inner loop
				}
			}
	
			//Find envelopes for each articulation - ignore those with Release or Without envelope in the ID
			for (e in envelopeIds)
			{
				if (e.indexOf(idh.getArticulationNames(null)[i]) != -1 && e.indexOf("nvelope") != -1 && e.indexOf("Release") == -1)
				{
					if (envelopes[i] == undefined) envelopes[i] = []; //An articulation may have more than one envelope
					envelopes[i].push(Synth.getModulator(e));
				}
			}
		}
	}
	
	inline function onNoteCB()
	{
		local idx = idh.getKeyswitchIndex(instrumentName, Message.getNoteNumber()); //Check for index in keyswitches array

		if (idx != -1) //Keyswitch triggered the callback
		{
			changeArticulation(idx);
			asyncUpdater.setFunctionAndUpdate(showArticulationControlsAndColourKeys, idx);
			cmbArt.setValue(idh.instrumentArticulationIndexToAllArticulationIndex(idx)+1); //Change selected articulation display
			cmbArt.repaint(); //Async repaint	
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
					asyncUpdater.setFunctionAndUpdate(showArticulationControlsAndColourKeys, idx);
					cmbArt.setValue(idh.instrumentArticulationIndexToAllArticulationIndex(idx)+1); //Change displayed selected articulation
					cmbArt.repaint(); //Async repaint
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
		if (number == cmbArt)
		{
			local idx = idh.allArticulationIndexToInstrumentArticulationIndex(value-1);
			changeArticulation(idx);
		    colourPlayableKeys();
		    showArticulationControls(idx); //Change displayed articulation controls
		}

		for (i = 0; i < idh.getNumArticulations(null); i++) //Each of the instrument's articulations
		{
			if (number == cmbKs[i]) //Key switch
			{
				local r = idh.getRange(instrumentName); //Full playable range of instrument

				if (value-1 < r[0] || value-1 > r[1]) //Outside playable range
				{
					Engine.setKeyColour(idh.getKeyswitch(instrumentName, i), Colours.withAlpha(Colours.white, 0.0)); //Reset current KS colour
					
					if (idh.searchArticulationIndexes(i) != -1) //If the articulation is used by the instrument
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
	
	inline function showArticulationControls(a)
	{
		for (i = 0; i < idh.getNumArticulations(null); i++)
		{
			//Hide all articulations controls
			cmbKs[i].set("visible", false);
			sliArtVol[i].set("visible", false);
			sliAtk[i].set("visible", false);
			sliRel[i].set("visible", false);
		}
		
		//Show controls for current articulation (a)
		cmbKs[a].set("visible", true);
		sliArtVol[a].set("visible", true);
		sliAtk[a].set("visible", true);
		sliRel[a].set("visible", true);		
	}
	
	inline function showArticulationControlsAndColourKeys(idx)
	{
		colourPlayableKeys();
		showArticulationControls(idx); //Change displayed articulation controls
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
			muters[idx].setAttribute(0, 0); //Unmute articulation (a)	
		}
	}
	
	inline function colourPlayableKeys()
	{
		local instRange = idh.getRange(instrumentName); //Full playable range of instrument
		local a = idh.getArticulationNameByIndex(cmbArt.getValue()-1);
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