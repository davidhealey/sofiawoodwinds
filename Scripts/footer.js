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

namespace Footer
{
  inline function onInitCB()
  {
    //Build array of round robin handler scrips
    const var scriptIds = Synth.getIdList("Script Processor");
    const var rrHandlers = [];
    for (id in scriptIds)
    {
        if (id.indexOf("RoundRobin") == -1) continue;
        rrHandlers.push(Synth.getMidiProcessor(id));
    }

    //Get release samplers
    const var samplerIds = Synth.getIdList("Sampler");
    const var releaseSamplers = [];

    for (id in samplerIds)
    {
      if (id.indexOf("elease") == -1) continue;
      releaseSamplers.push(Synth.getSampler(id));
    }

    const var btnSettings = ui.buttonPanel("btnSettings", paintRoutines.gear); //Settings
    btnSettings.setControlCallback(btnSettingsCB);

    const var btnRR = ui.buttonPanel("btnRR", paintRoutines.roundRobin); //Round Robin
    btnRR.setControlCallback(btnRRCB);

    const var btnRelease = ui.buttonPanel("btnRelease", paintRoutines.release); //Release samples purge/load
    btnRelease.setControlCallback(btnReleaseCB);

    //Footer stat bar/performance meter
    const var pnlStats = Content.getComponent("pnlStats");
    const var lblStats = Content.getComponent("lblStats");
    pnlStats.startTimer(250);
    pnlStats.setTimerCallback(function()
    {
        lblStats.set("text", "CPU: " + Math.round(Engine.getCpuUsage()) + "%" + ", " + "RAM: " + Math.round(Engine.getMemoryUsage()) + "MB" + ", " + "Voices: " + Engine.getNumVoices());
    });
  }

  inline function onControllerCB()
  {
    if (Message.getControllerValue() > 64 != btnRR.getValue()) //Value has changed
    {
      btnRR.setValue(Message.getControllerValue() > 64);
      btnRR.changed();
      btnRR.repaint();
    }    
  }

  //UI Callbacks
  inline function btnSettingsCB(control, value)
  {
    tabs[0].showControl(1-value);
    tabs[1].showControl(value);
  }

  inline function btnRRCB(control, value)
  {
    for (r in rrHandlers) //Each round robin handler script
    {
        r.setAttribute(0, 1-value); //Bypass button
        if (1-value == 1) r.setAttribute(1, 1); //Random mode
    }
  }

  inline function btnReleaseCB(control, value)
  {
    for (s in releaseSamplers)
    {
      s.setAttribute(12, 1-value);
    }
  }
}
