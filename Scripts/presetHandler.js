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
    const var gainMod = Synth.getModulator("globalGainModLFO"); //Vibrato gain modulator
    const var pitchMod = Synth.getModulator("globalPitchModLFO"); //Vibrato pitch modulator
    const var legatoHandler = Synth.getMidiProcessor("legatoHandler"); //legato handler script
    const var sustainRoundRobin = Synth.getMidiProcessor("sustainRoundRobin"); //Sustain/legato/glide round robin handler

    //Get samplers as child synths
    const var samplerIds = Synth.getIdList("Sampler");
    const var childSynths = {};

    for (id in samplerIds)
    {
      childSynths[id] = Synth.getChildSynth(id);
    }

    const var presetNames = ui.getPresetNames(); //Get array of preset names

    //Persistent panel for loading preset data
    const var pnlPreset = ui.setupControl("pnlPreset", {itemColour:Theme.PRESET, itemColour2:Theme.PRESET});
    pnlPreset.setControlCallback(pnlPresetCB);

    //Preset menu - not persistent
    const var cmbPreset = ui.comboBoxPanel("cmbPreset", paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, presetNames);
    Content.setPropertiesFromJSON("cmbPreset", {itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
    cmbPreset.setControlCallback(cmbPresetCB);

    //Preset save button
    const var btnSavePreset = ui.momentaryButtonPanel("btnSavePreset", paintRoutines.disk);
    btnSavePreset.setControlCallback(btnSavePresetCB);
  }

  //UI Callbacks
  inline function pnlPresetCB(control, value)
  {
    //Get the internal instrumentName from the preset name
    if (cmbPreset.getValue() < 1) cmbPreset.setValue(1); //Min cmbPreset value is 1
    local presetName = presetNames[cmbPreset.getValue()-1];
    Instrument.name = presetName.substring(presetName.lastIndexOf(": ")+2, presetName.length); //Set global variable

    //Load the preset settings
    loadSampleMaps(); //Load sample maps for current preset
    setRoundRobinRange(); //Set the upper and lower note range of the RR scripts
    loadLegatoSettings();
    loadVibratoSettings();

    Instrument.range = Manifest.patches[Instrument.name].maxRange; //Get the instruments playable range
    Instrument.articulations = Manifest.patches[Instrument.name].articulations; //Get instrument's articulation names
    Instrument.displayNames = Manifest.patches[Instrument.name].displayNames; //Get articulation display names
    Instrument.keyswitches = Manifest.patches[Instrument.name].keyswitches; //Get instrument's keyswitch numbers
    Instrument.glideIndex = Instrument.articulations.indexOf("glide"); //Get glide articulation index

    colourKeyswitches();
  }

  inline function cmbPresetCB(control, value)
  {
     Engine.loadUserPreset(Engine.getUserPresetList()[value-1]);
  }

  inline function btnSavePresetCB(control, value)
  {
    //Save the current user preset
    if (value == 1) Engine.saveUserPreset("");
  }

  //Functions
  inline function colourKeyswitches()
  {
    for (i = 0; i < 128; i++) //Every MIDI note
    {
      if (i < Instrument.range[0] || i > Instrument.range[1]) //j is outside max playable range
      {
          Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Reset current KS colour

          if (Instrument.keyswitches.contains(i)) //j is an assigned key switch
          {
              Engine.setKeyColour(i, Colours.withAlpha(Colours.red, 0.3)); //Colour KS
          }
      }
    }
  }

  inline function loadSampleMaps()
	{
    local sampleMapId = Manifest.patches[Instrument.name].sampleMapId; //Get patch's sample map id
    local sampleMaps = Sampler.getSampleMapList();
    local childSynth;
    local s;

    for (id in samplerIds) //Each sampler
    {
      childSynth = childSynths[id];

      if (sampleMaps.contains(sampleMapId + "_" + id)) //A sample map for this patch was found
      {
        childSynth.setBypassed(false); //Enable sampler
        childSynth.asSampler().loadSampleMap(sampleMapId + "_" + id); //Load the sample map for this sampler
      }
      else
      {
        childSynth.setBypassed(true); //Bypass sampler
        childSynth.asSampler().loadSampleMap("empty"); //Load empty sample map for this sampler
      }
    }
	}

  inline function loadLegatoSettings()
  {
      local attributes = {BEND_TIME:4, MIN_BEND:5, MAX_BEND:6, FADE_TIME:7}; //Legato handler attributes
      local settings = Manifest.patches[Instrument.name].legatoSettings; //Get instrument's legato settings

      legatoHandler.setAttribute(attributes.BEND_TIME, settings.bendTime);
      legatoHandler.setAttribute(attributes.MIN_BEND, settings.minBend);
      legatoHandler.setAttribute(attributes.MAX_BEND, settings.maxBend);
      legatoHandler.setAttribute(attributes.FADE_TIME, settings.fadeTime);
  }

  inline function loadVibratoSettings()
  {
      local settings = Manifest.patches[Instrument.name].vibratoSettings; //Get instrument's vibrato settings

      gainMod.setIntensity(settings.gain);
      pitchMod.setIntensity(settings.pitch);
  }

  //Set the range of the sustain/legato/glide round robin handler
  inline function setRoundRobinRange()
  {
      local range = Manifest.patches[Instrument.name].ranges["sustain"];

      sustainRoundRobin.setAttribute(2, range[0]);
      sustainRoundRobin.setAttribute(3, range[1]);
  }
}
