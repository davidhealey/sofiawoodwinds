/*
    Copyright 2018, 2019 David Healey

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

namespace Articulations
{    
    reg current = 0; //Currently selected articulation
    const var articulations = ["legato", "sustain", "staccato", "flutter"];
    
    inline function btnArtCB(control, value)
    {
        local idx;
        if (value == 1)
        {
            idx = btnArt.indexOf(control);
            changeArticulation(idx);
        }
    }
    
    inline function changeArticulation(index)
    {
        /*for (i = 0; i < samplerIds.length; i++)
        {
            if (Manifest.articulations[articulationNames[index]].samplers.indexOf(samplerIds[i]) != -1)
            {
                childSynths[i].setBypassed(false);
            }
            else 
            {
                childSynths[i].setBypassed(true);
            }
        }*/
    }
}



/*
const var samplerIds = Synth.getIdList("Sampler");
const var childSynths = [];
        
const var articulationNames = []; //All articulation names
const var longA = []; //Long articulations
const var shortA = []; //Short articulations
const var btnArt = []; //Articulation buttons
        
for (k in Manifest.articulations)
{
    articulationNames.push(k);
    Manifest.articulations[k].short != true ? longA.push(k) : shortA.push(k);
}
        
for (i = 0; i < articulationNames.length; i++)
{
    btnArt[i] = Content.getComponent("btnArt"+i);
    btnArt[i].setControlCallback(btnArtCB);
}
        
for (id in samplerIds)
{
    childSynths.push(Synth.getChildSynth(id));
}*/

//GUI;

//Container panel inside viewport
