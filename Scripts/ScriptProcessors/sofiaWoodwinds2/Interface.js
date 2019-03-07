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

include("manifest.js");
include("presetHandler.js");
include("mixer.js");
include("settings.js");
include("preloadBar.js");

Content.makeFrontInterface(800, 675);
Synth.deferCallbacks(true);

//Loop iterators
reg i;
reg j;

//Legato handler - referenced in a few places
const var legato = Synth.getMidiProcessor("legato");

//Glide rate knob and velocity > glide rate button
const var knbGlideRate = Content.getComponent("knbGlideRate");
Content.getComponent("btnVelocityRate").setControlCallback(onbtnVelocityRateControl);

inline function onbtnVelocityRateControl(component, value)
{
    knbGlideRate.set("enabled", 1-value);
    legato.setAttribute(legato.btnGlideVel, value); //Link to legato script
};

//Dynamics\breath control
const var dynamicsCC = Synth.getModulator("dynamicsCC");
const var dynamicsFilter = Synth.getModulator("dynamicsFilter");
const var knbDynamics = Content.getComponent("knbDynamics");
knbDynamics.setControlCallback(onknbDynamicsControl);

inline function onknbDynamicsControl(control, value)
{
    dynamicsCC.setAttribute(dynamicsCC.DefaultValue, value);
    dynamicsFilter.setAttribute(dynamicsFilter.DefaultValue, value);
    legato.setAttribute(legato.knbBreath, value);
}

//Curve editors
const var btnCC = [];
const var tblCC = [];

for (i = 0; i < 4; i++)
{
    btnCC[i] = Content.getComponent("btnCC"+i);
    btnCC[i].setControlCallback(onbtnCCControl);
    tblCC[i] = Content.getComponent("tblCC"+i);
}

inline function onbtnCCControl(control, value)
{
    local idx = btnCC.indexOf(control);

    for (i = 0; i < tblCC.length; i++)
    {
        tblCC[i].showControl(false);
        btnCC[i].setValue(false);
    }

    tblCC[idx].showControl(value);
    btnCC[idx].setValue(value);
}

//Includes initialisation
PresetHandler.onInitCB();
Mixer.onInitCB();
Settings.onInitCB();function onNoteOn()
{
	
}
function onNoteOff()
{
	
}
function onController()
{
	
}
function onTimer()
{
	
}
function onControl(number, value)
{
	
}
