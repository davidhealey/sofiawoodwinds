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

namespace Performance
{
	inline function onInitCB()
	{	    		            
        //Release trigger purge button
	    Content.setPropertiesFromJSON("btnPurgeReleases", {bgColour:Theme.C5, itemColour:Theme.C4, itemColour2:Theme.C2, textColour:Theme.C6});
	    ui.buttonPanel("btnPurgeReleases", paintRoutines.onOffButton);
        
	}
	   
}