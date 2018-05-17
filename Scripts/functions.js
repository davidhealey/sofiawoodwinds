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

inline function loadLegatoSettings()
{
    local attributes = {BEND_TIME:4, MIN_BEND:5, MAX_BEND:6, FADE_TIME:7}; //Legato handler attributes
    local settings = idh.getData(instrumentName)["legatoSettings"]; //Get instrument's legato settings

    legatoHandler.setAttribute(attributes.BEND_TIME, settings.bendTime);
    legatoHandler.setAttribute(attributes.MIN_BEND, settings.minBend);
    legatoHandler.setAttribute(attributes.MAX_BEND, settings.maxBend);
    legatoHandler.setAttribute(attributes.FADE_TIME, settings.fadeTime);
}

inline function loadVibratoSettings()
{
    local settings = idh.getData(instrumentName)["vibratoSettings"]; //Get instrument's vibrato settings

    gainMod.setIntensity(settings.gain);
    pitchMod.setIntensity(settings.pitch);
}

//Set the range of the sustain/legato/glide round robin handler
inline function setRoundRobinRange()
{
    local range = idh.getArticulationRange(instrumentName, "sustain");

    sustainRoundRobin.setAttribute(2, range[0]);
    sustainRoundRobin.setAttribute(3, range[1]);
}
//Turn round robin on or off
inline function changeRRSettings()
{
    for (r in rrHandlers) //Each round robin handler script
    {
        r.setAttribute(0, 1-btnRR.getValue()); //Bypass button
        if (btnRR.getValue() == 1) r.setAttribute(1, 1); //Random mode
    }
}
