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

include("HISE-Scripting-Framework/libraries/uiFactory.js");

include("manifest.js");
include("theme.js");
include("paintRoutines.js");
include("presetHandler.js");
include("pageHandler.js");
include("header.js");
include("mixer.js");
include("controllerHandler.js");
include("performance.js");
include("settings.js");
include("preloadBar.js");

Content.makeFrontInterface(700, 800);

reg patchName = "";

//Loop iterators
reg i;
reg j;

//*** GUI ***
Content.setPropertiesFromJSON("pnlMain", {itemColour:Theme.C2, itemColour2:Theme.C2}); //Main background panel

//Menu
Content.setPropertiesFromJSON("lblMenu", {textColour:Theme.C5});
Content.setPropertiesFromJSON("pnlMenu", {itemColour:Theme.C3, itemColour2:Theme.C3});

//Includes initialisation
Header.onInitCB();
PresetHandler.onInitCB();
PageHandler.onInitCB();
Mixer.onInitCB();
ControllerHandler.onInitCB();
Performance.onInitCB();
Settings.onInitCB();function onNoteOn()
{
	ControllerHandler.onNoteCB();
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
