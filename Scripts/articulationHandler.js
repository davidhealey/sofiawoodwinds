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
    reg last = 0; //The previous articulation
            
    //GUI
    const var pnlArticulations = Content.getComponent("pnlArticulations");
    pnlArticulations.setPaintRoutine(function(g)
    {
        reg text = ["Live", "Sustain", "Staccato", "Releases"];
          
        for (i = 0; i < text.length; i++) 
        {
            //Paint background
            if (i == Articulations.current)
                g.setColour(0xFFeee6d6);
            else
                g.setColour(0xFFCEC9BD);
            
            g.fillRoundedRectangle([0, i*57, 316, 52], 5.0);
        
            //Draw text
            g.setColour(0xFF000000);
            g.setFont("Arial", 18);
            g.drawAlignedText(text[i], [10, i*56, 316, 52], "left");
        }
    
        //Set panel height
        this.set("height", i*56);
    });
    
    //Functions
    inline function getKSIndex(patchName, note)
    {
        local ks = Manifest.patches[patchName].ks;
        return ks.indexOf(note);
    }
    
    inline function changeArticulation(index)
    {
        if (index !== Articulations.current)
        {
            switch (index)
            {
                case 0: //Legato
                    sustainMuter.setAttribute(sustainMuter.ignoreButton, 0);
                    staccatoMuter.setAttribute(sustainMuter.ignoreButton, 0);
                    legatoHandler.setAttribute(legatoHandler.btnMute, 0);
                    overlayMuter.setAttribute(overlayMuter.ignoreButton, 0);
                    staccatoMuter.setAttribute(staccatoMuter.ignoreButton, 0);
                    overlayVelocityFilter.setBypassed(false);
                    transitionMuter.setAttribute(transitionMuter.ignoreButton, 0);
                    liveEnvelope.setBypassed(false);
                    sustainEnvelope.setBypassed(true);
                    overlayEnvelope.setBypassed(false);
                    staccatoEnvelope.setBypassed(true);
                break;
        
                case 1: //Sustain
                    sustainMuter.setAttribute(sustainMuter.ignoreButton, 0);
                    overlayMuter.setAttribute(overlayMuter.ignoreButton, 1);
                    legatoHandler.setAttribute(legatoHandler.btnMute, 1);
                    transitionMuter.setAttribute(transitionMuter.ignoreButton, 1);
                    liveEnvelope.setBypassed(true);
                    sustainEnvelope.setBypassed(false);
                break;
        
                case 2: //Staccato
                    sustainMuter.setAttribute(sustainMuter.ignoreButton, 1);
                    overlayMuter.setAttribute(overlayMuter.ignoreButton, 0);
                    staccatoMuter.setAttribute(sustainMuter.ignoreButton, 0);
                    overlayVelocityFilter.setBypassed(true);
                    overlayEnvelope.setBypassed(true);
                    staccatoEnvelope.setBypassed(false);
                break;
            }
        
            Articulations.last = Articulations.current;
            Articulations.current = index;
            pnlArticulations.repaint();
        }
    }
}