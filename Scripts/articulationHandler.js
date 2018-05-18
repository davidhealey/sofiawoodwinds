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

namespace ArticulationHandler
{
  inline function onInitCB()
  {
    const var legatoHandler = Synth.getMidiProcessor("legatoHandler"); //legato handler script
    const var sustainRoundRobin = Synth.getMidiProcessor("sustainRoundRobin"); //Sustain/legato/glide round robin handler

    //MIDI muters - one per sampler
    const var muterIds = Synth.getIdList("MidiMuter");
		const var muters = [];

    for (m in muterIds)
    {
        muters.push(Synth.getMidiProcessor(m));
    }

    const var pnlArticulations = Content.getComponent("pnlArticulations"); //Articulation controls parent
    pnlArticulations.setControlCallback(pnlArticulationsCB);

    //Glide rates
    const var rates = ["1/1", "1/2D", "1/2", "1/2T", "1/4D", "1/4", "1/4T", "1/8D", "1/8", "1/8T", "1/16D", "1/16", "1/16T", "1/32D", "1/32", "1/32T", "1/64D", "1/64", "1/64T", "Velocity"];

    //Panel
    ui.setupControl("pnlArticulations", {"itemColour":Theme.ZONE, "itemColour2":Theme.ZONE});

    //Title label
    Content.setPropertiesFromJSON("lblArtTitle", {fontName:Theme.ZONE_FONT, fontSize:Theme.ZONE_FONT_SIZE});

    //Articulation selection combo box
    const var cmbArt = ui.comboBoxPanel("cmbArt", paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, []);
    Content.setPropertiesFromJSON("cmbArt", {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
    cmbArt.setControlCallback(cmbArtCB);

    //Labels for articulation controls
		const var lbls = [];
    lbls[0] = ui.setupControl("lblArtVol", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
    lbls[1] = ui.setupControl("lblAtk", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
    lbls[2] = ui.setupControl("lblRel", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});

    //Get volume, attack, and release controls and set their properties
    const var vol = [];
    const var atk = [];
    const var rel = [];

    for (i = 0; i < Manifest.allArticulations.length-1; i++) //Every articulation (except glide)
    {
        vol[i] = ui.setupControl("sliArtVol"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
        vol[i].setControlCallback(sliArtVolCB);

        atk[i] = ui.setupControl("sliAtk"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
        rel[i] = ui.setupControl("sliRel"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
    }

    //Legato and glide controls
    const var legatoCtrl = [];
    legatoCtrl[0] = ui.setupControl("lblOffset", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
    legatoCtrl[1] = ui.setupControl("sliOffset", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});

    const var glideCtrl = [];
    glideCtrl[0] = ui.setupControl("lblRate", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
    glideCtrl[1] = ui.setupControl("lblGlideMode", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
    glideCtrl[2] = ui.setupControl("sliRate", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
    glideCtrl[3] = Content.getComponent("lblRateVal");
    glideCtrl[4] = ui.buttonPanel("btnGlideMode", paintRoutines.pushButton);
    Content.setPropertiesFromJSON("btnGlideMode", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
    glideCtrl[2].setControlCallback(sliGlideRateCB);
    glideCtrl[4].setControlCallback(btnGlideModeCB);
  }

  inline function onNoteCB()
  {
    local idx = -1;

    //If the note is outside of the instrument's playable range check if it is a key switch
    if (Message.getNoteNumber() < Instrument.range[0] || Message.getNoteNumber() > Instrument.range[1])
    {
        Message.ignoreEvent(true);
        idx = Instrument.keyswitches.indexOf(Message.getNoteNumber());
    }

    if (idx == -1) //keyswitch did not trigger callback
    {
        //If two notes are held, the sustain pedal is down, and the current articulation is sustain, enable glide
        if (Synth.isLegatoInterval() && Synth.isSustainPedalDown())
        {
            if (cmbArt.getValue()-1 == Instrument.sustainIndex)
            {
                idx = Instrument.glideIndex; //Enable glide
            }
        }
    }

    if (idx != -1) //Keyswitch triggered the callback or switched to glide
    {
        cmbArt.setValue(idx+1);
        changeArticulation(idx);
        asyncUpdater.deferFunction(ArticulationHandler.updateGUI, idx);
    }
  }

  inline function onControllerCB()
	{
    local ccNum = Message.getControllerNumber();
    local ccValue = Message.getControllerValue();

    if (Message.isProgramChange()) //Program change message
    {
      ccNum = 32; //Treat program changes as UACC
      ccValue = Message.getProgramChangeNumber();
    }

    switch (ccNum)
    {
      case 32: //UACC
        idx = Manifest.programs.indexOf(ccValue); //Lookup program number

        if (idx != -1) //Assigned program number triggered callback
        {
          cmbArt.setValue(idx+1);
          changeArticulation(idx);
          asyncUpdater.deferFunction(updateGUI, idx);
        }
      break;

      case 64: //Sustain pedal

        if (cmbArt.getValue()-1 == Instrument.sustainIndex) //Current articulation is sustain/legato
        {
          Message.ignoreEvent(true);
          legatoHandler.setAttribute(11, Synth.isSustainPedalDown()); //Toggle same note legato based on sustain pedal position
        }
        else if (!Synth.isSustainPedalDown() && cmbArt.getValue()-1 == Instrument.glideIndex) //Current articulation is glide and sustain pedal is lifted
        {
          Message.ignoreEvent(true);
          cmbArt.setValue(Instrument.sustainIndex+1);
          changeArticulation(Instrument.sustainIndex);
          asyncUpdater.deferFunction(updateGUI, Instrument.sustainIndex);
        }
      break;
    }
	}

  //*** UI CALLBACKS ***
  inline function pnlArticulationsCB(control, value)
  {
      ui.setComboPanelItems("cmbArt", Manifest.patches[Instrument.name].displayNames); //Populate cmbArt dropdown
  }

  inline function cmbArtCB(control, value)
  {
    changeArticulation(value-1);
    updateGUI(value-1);
  }

  inline function sliArtVolCB(control, value)
  {
    //Set the gain of the control's processor (container)
    local id = control.get("processorId"); //Get container ID
    local processor = Synth.getChildSynth(id); //Get container
    local gain = Engine.getGainFactorForDecibels(value); //Convert dB to gain
    processor.setAttribute(processor.GAIN, gain); //Set container's volume
  }

  inline function sliGlideRateCB(control, value)
  {
    changeGlideRate(value);
  }

  inline function btnGlideModeCB(control, value)
  {
    updateGlideWholeToneState(value);
  }

  //*** FUNCTIONS ***

  inline function changeArticulation(idx)
  {
    //Mute every articulation
    for (m in muters) //Each Midi muter
    {
      m.setAttribute(0, 1);
    }

    if (idx == Instrument.sustainIndex || idx == Instrument.glideIndex)
    {
        //Enable correct legato script mode
        idx == Instrument.sustainIndex ? legatoHandler.setAttribute(1, 1) : legatoHandler.setAttribute(2, 1);
        muters[Instrument.sustainIndex].setAttribute(0, 0); //Unmute sustain/legato/glide muter
    }
    else
    {
        muters[idx].setAttribute(0, 0); //Unmute articulation (idx)
    }
  }

  inline function colourPlayableKeys(idx)
  {
    local aRange = Manifest.patches[Instrument.name].ranges[Instrument.articulations[idx]]; //Range of current articulation

    for (i = Instrument.range[0]; i <= Instrument.range[1]; i++) //Max playable range of instrument
    {
      Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0)); //Reset key colour

      if (i >= aRange[0] && i <= aRange[1]) //i is in articulation's range
      {
        Engine.setKeyColour(i, Colours.withAlpha(Colours.blue, 0.3)); //Update colour
      }
    }
  }

  inline function changeGlideRate(v)
  {
    legatoHandler.setAttribute(10, v);
    glideCtrl[3].set("text", rates[v]);
  }

  inline function updateGlideWholeToneState(v)
  {
    legatoHandler.setAttribute(3, v);
    v == 1 ? glideCtrl[4].set("text", "Whole Step") : glideCtrl[4].set("text", "Half Step");
    glideCtrl[4].repaint();
  }

  //Wrapper function - should only ever be called async
  inline function updateGUI(idx)
  {
    local i;

    //Show volume, attack, and release controls for articulation (idx), hide others
    for (i = 0; i < vol.length; i++)
    {
      vol[i].showControl(i == idx);
      atk[i].showControl(i == idx);
      rel[i].showControl(i == idx);
    }

    //Show hide generic labels
    for (l in lbls)
    {
      l.showControl(1-(idx == Instrument.glideIndex));
    }

    //Sustain/Legato specific controls
    for (c in legatoCtrl)
    {
      c.showControl(idx == Instrument.sustainIndex);
    }

    //Glide specific controls
    for (c in glideCtrl)
    {
      c.showControl(idx == Instrument.glideIndex);
    }

    colourPlayableKeys(idx);

    cmbArt.repaint();
  }
}
