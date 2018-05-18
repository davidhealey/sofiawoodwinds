/*
    Copyright 2018 David Healey

    This file is part of Libre Winds.

    Libre Winds is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Libre Winds is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Libre Winds. If not, see <http://www.gnu.org/licenses/>.
*/

include("HISE-Scripting-Framework/libraries/asyncUpdater.js");
include("HISE-Scripting-Framework/libraries/uiFactory.js");

include("manifest.js");
include("theme.js");
include("paintRoutines.js");
include("presetHandler.js");
include("header.js");
include("articulationHandler.js");
include("mixer.js");
include("controllerHandler.js");
include("settingsWindowJson.js");
include("footer.js");

Content.makeFrontInterface(676, 392);

namespace Instrument
{
  reg name = "";
  reg range = [];
  reg articulations = []; //Instrument's articulation names
  reg displayNames = []; //Articulation display names
  reg keyswitches = [];
  reg sustainIndex = 0; //Index of sustain articulation
  reg glideIndex; //Holds index of glide articulation
}

//Loop iterators
reg i;
reg j;

//Tabs
const var tabs = [];
tabs[0] = Content.getComponent("pnlMain");
tabs[1] = Content.getComponent("pnlSettings");

//*** GUI ***
Content.setPropertiesFromJSON("pnlMain", {itemColour:Theme.BODY, itemColour2:Theme.BODY}); //Main tab background panel

//Settings tab
const var fltSettings = Content.getComponent("fltSettings");
fltSettings.setContentData(SettingsJson.settings);

//Includes initialisation
Header.onInitCB();
PresetHandler.onInitCB();
ArticulationHandler.onInitCB();
Mixer.onInitCB();
ControllerHandler.onInitCB();
Footer.onInitCB();function onNoteOn()
{
    ControllerHandler.onNoteCB();
    ArticulationHandler.onNoteCB();
}
function onNoteOff()
{
	
}
function onController()
{      
    if (Message.getControllerNumber() == 14) //Controls RR on/off
    {
        Footer.onControllerCB();
    }
    else //Articulation switching
    {
        ArticulationHandler.onControllerCB();
    }
}
function onTimer()
{
	
}
function onControl(number, value)
{
	
}
