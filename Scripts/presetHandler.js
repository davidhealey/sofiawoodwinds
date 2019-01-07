/*
    Copyright 2018 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

namespace PresetHandler
{
    inline function onInitCB()
    {
        const var legato = Synth.getMidiProcessor("legato"); //legato script       
        const var roundRobin = [];
        roundRobin[0] = Synth.getMidiProcessor("roundRobin"); //Sustain/staccato round robin handler
        roundRobin[1] = Synth.getMidiProcessor("transitionRoundRobin"); //Transition round robin handler

        //Get samplers as child synths
        const var samplerIds = Synth.getIdList("Sampler");
        const var childSynths = {};

        for (id in samplerIds)
        {
          childSynths[id] = Synth.getChildSynth(id);
        }

        //Get array of preset names from manifest
        const var patchNames = [];
        for (k in Manifest.patches)
        {
            patchNames.push(k);
        }

        //Persistent panel for loading preset data
        const var pnlPreset = Content.getComponent("pnlPreset");
        pnlPreset.setControlCallback(pnlPresetCB);

        //Preset selection dropdown
        const var cmbPreset = Content.getComponent("cmbPreset");
        Content.setPropertiesFromJSON("cmbPreset", {itemColour:Theme.C4, itemColour2:Theme.C4, textColour:Theme.C6, items:patchNames.join("\n")});
        cmbPreset.setControlCallback(cmbPresetCB);
    }

    //UI Callbacks
    inline function pnlPresetCB(control, value)
    {
        if (cmbPreset.getValue() < 1) cmbPreset.setValue(1); //Default
    }

    inline function cmbPresetCB(control, value)
    {
        loadPatch(patchNames[value-1]);
    }

    //Functions

    /*Function wrapper*/
    inline function loadPatch(name)
    {
        patchName = name; //Set global variable

        colourKeys(name);
        loadSampleMaps(name); //Load sample maps for current preset
        loadGainSettings(name);
        loadLegatoSettings(name);
        setRoundRobinRange(name); //Set the upper and lower note range of the RR scripts
        Mixer.enablePurgeButtons(); //Set purge buttons to 1 (unpurged)
    }

    inline function colourKeys(patchName)
    {
        local range = Manifest.patches[patchName].range;

        for (i = 0; i < 128; i++) //Every MIDI note
        {
            if (i < range[0] || i > range[1]) //i is outside max playable range
            {
                Engine.setKeyColour(i, Colours.withAlpha(Colours.black, 0.5)); //Reset current KS colour
            }
            else
            {
                Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Set key colour
            }
        }
    }

    inline function loadSampleMaps(patchName)
    {
        local sampleMapId = Manifest.patches[patchName].sampleMapId; //Get patch's sample map id
        local sampleMaps = Sampler.getSampleMapList();

        for (id in samplerIds) //Each sampler
        {
          //A sample map for this patch was found or sampler is transition sampler
          if (sampleMaps.contains(sampleMapId + "_" + id) || id == "transitions")
          {
            childSynths[id].setBypassed(false); //Enable sampler
            
            if (id == "transitions")
            {
                childSynths[id].asSampler().loadSampleMap(sampleMapId + "_staccato"); //Load staccato sample map
            }
            else
            {
                childSynths[id].asSampler().loadSampleMap(sampleMapId + "_" + id); //Load the sample map
            }
          }
          else
          {
            childSynths[id].setBypassed(true); //Bypass sampler
            childSynths[id].asSampler().loadSampleMap("empty"); //Load empty sample map for this sampler
          }
        }
    }

    inline function loadGainSettings(patchName)
    {
        local settings = Manifest.patches[patchName].gain;

        //Set gain of each sampler
        for (id in samplerIds)
        {
            if (settings[id]) //A settings for this sampler is in the manifest
            {
                childSynths[id].setAttribute(0, Engine.getGainFactorForDecibels(settings[id]));
            }
            else //Default to 0dB if no value provided
            {
                childSynths[id].setAttribute(0, Engine.getGainFactorForDecibels(0));
            }
        }
    }

    inline function loadLegatoSettings(patchName)
    {
        local attributes = {
            BEND_TIME:8,
            MIN_BEND:9,
            MAX_BEND:10,
            FADE_TIME_MIN:5,
            FADE_TIME_MAX:6
        };        
        
        local settings = Manifest.patches[patchName].legatoSettings; //Get instrument's settings

        legato.setAttribute(attributes.BEND_TIME, settings.bendTime);
        legato.setAttribute(attributes.MIN_BEND, settings.minBend);
        legato.setAttribute(attributes.MAX_BEND, settings.maxBend);
        legato.setAttribute(attributes.FADE_TIME_MAX, settings.fadeTimeMax);
    }
   
    //Set the range of the sustain/legato/glide round robin handler
    inline function setRoundRobinRange(patchName)
    {
      local range = Manifest.patches[patchName].range;
      for (i = 0; i < roundRobin.length; i++)
        {
          roundRobin[i].setAttribute(2, range[0]);
          roundRobin[i].setAttribute(3, range[1]);   
        }
    }
}
