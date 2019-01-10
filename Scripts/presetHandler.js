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
        const var sustainFlutter = Synth.getModulator("sustainFlutter"); //Flutter CC gain mod
        const var roundRobin = [];
        roundRobin[0] = Synth.getMidiProcessor("roundRobin"); //Sustain/staccato round robin handler
        roundRobin[1] = Synth.getMidiProcessor("transitionRoundRobin"); //Transition round robin handler

        //Previos/Next preset buttons
        const var btnPreset = [];
        btnPreset[0] = Content.getComponent("btnPreset0"); //Prev
        btnPreset[1] = Content.getComponent("btnPreset1"); //Next
        btnPreset[0].setControlCallback(loadAdjacentPreset);
        btnPreset[1].setControlCallback(loadAdjacentPreset);
        
        //Get samplers as child synths
        const var samplerIds = Synth.getIdList("Sampler");
        const var childSynths = {};

        for (id in samplerIds)
        {
          childSynths[id] = Synth.getChildSynth(id);
        }

        //Get array of patch names from manifest
        const var patchNames = [];
        for (k in Manifest.patches)
        {
            patchNames.push(k);
        }

        //Persistent panel for loading preset data
        const var pnlPreset = Content.getComponent("pnlPreset");
        pnlPreset.setControlCallback(pnlPresetCB);

        //Preset selection dropdown
        const var cmbPatch = Content.getComponent("cmbPatch");
        Content.setPropertiesFromJSON("cmbPatch", {itemColour:Theme.C4, itemColour2:Theme.C4, textColour:Theme.C6, items:patchNames.join("\n")});
        cmbPatch.setControlCallback(cmbPatchCB);
    }

    //UI Callbacks
    inline function pnlPresetCB(control, value)
    {
        if (cmbPatch.getValue() < 1) cmbPatch.setValue(1); //Default
    }

    inline function loadAdjacentPreset(control, value)
    {
        local idx = btnPreset.indexOf(control);
        idx == 0 ? Engine.loadPreviousUserPreset(false) : Engine.loadNextUserPreset(false);
        Content.getComponent("lblPreset").set("text", Engine.getCurrentUserPresetName());
    }
    
    //Load patch and settings from manifest
    inline function cmbPatchCB(control, value)
    {
        local patchName = patchNames[value-1];
        
        colourKeys(patchName);
        loadSampleMaps(patchName);
        loadLegatoSettings(patchName);
        setRoundRobinRange(patchName);
        sustainFlutter.setBypassed(1-Manifest.patches[patchName].hasFlutter);
        Content.getComponent("lblPreset").set("text", Engine.getCurrentUserPresetName());
    }

    //Functions
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
        local sampleMaps = Sampler.getSampleMapList();

        for (id in samplerIds) //Each sampler
        {
          //A sample map for this patch was found or sampler is transition sampler
          if (sampleMaps.contains(patchName + "_" + id) || id == "transitions")
          {
            childSynths[id].setBypassed(false); //Enable sampler
            
            if (id == "transitions")
            {
                childSynths[id].asSampler().loadSampleMap(patchName + "_staccato"); //Load staccato sample map
            }
            else
            {
                childSynths[id].asSampler().loadSampleMap(patchName + "_" + id); //Load the sample map
            }
          }
          else
          {
            childSynths[id].setBypassed(true); //Bypass sampler
            childSynths[id].asSampler().loadSampleMap("empty"); //Load empty sample map for this sampler
          }
        }
    }

    inline function loadLegatoSettings(patchName)
    {
        local attributes = {BEND_TIME:8, MIN_BEND:9, MAX_BEND:10, MIN_FADE:5, MAX_FADE:6};
        local settings = Manifest.patches[patchName].legatoSettings; //Get instrument's settings

        legato.setAttribute(attributes.BEND_TIME, settings.bendTime);
        legato.setAttribute(attributes.MIN_BEND, settings.minBend);
        legato.setAttribute(attributes.MAX_BEND, settings.maxBend);
        legato.setAttribute(attributes.MIN_FADE, settings.minFade);
        legato.setAttribute(attributes.MAX_FADE, settings.maxFade);
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
