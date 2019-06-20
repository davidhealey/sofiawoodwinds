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

//Handles the GUI side of articulation changing.
namespace Articulations
{    
    reg current = -1; //Currently selected articulation
    reg last = -1; //The previous articulation
        
    //GUI
    
    //Articulation envelope controls
    const var knbLiveRelease = Content.getComponent("knbLiveRelease");
    const var knbSusRelease = Content.getComponent("knbSusRelease");
    const var knbSusAttack = Content.getComponent("knbSusAttack");
    const var knbLegAtk = Content.getComponent("knbLegAtk");
    
    //Articulations panel
    const var pnlArticulations = Content.getComponent("pnlArticulations");
    pnlArticulations.setPaintRoutine(function(g)
    {
        reg text = ["Live", "Sustain", "Staccato", "Releases"];
          
        for (i = 0; i < text.length; i++) 
        {
            //Paint background
            if (i == Articulations.current)
                g.setColour(0xFFDED7CA);
            else
                g.setColour(0xFFCEC9BD);
            
            g.fillRoundedRectangle([0, i*55, 316, 50], 5.0);
        
            //Draw text
            g.setColour(0xFF000000);
            g.setFont("Asap-SemiBold", 18);
            g.drawAlignedText(text[i], [10, i*55, 316, 50], "left");
        }
    
        //Set panel height
        this.set("height", i*55);
        this.data.numRows = i;
    });
    
    pnlArticulations.setMouseCallback(function(event)
    {
        if (event.clicked)
        {
            var value = parseInt(event.y / this.getHeight() * this.data.numRows);
            Articulations.changeArticulation(value);
        }
    });
    
    //Release sampler purge button
    const var release = Synth.getChildSynth("release");
    
    inline function onbtnRelPurgeControl(component, value)
    {
        if (release.getAttribute(release.Purged) != 1-value)
            release.setAttribute(release.Purged, 1-value);
    };

    Content.getComponent("btnRelPurge").setControlCallback(onbtnRelPurgeControl);
    
    //Functions    
    inline function changeArticulation(index)
    {
        if (index !== Articulations.current && index < Manifest.articulations.names.length)
        {
            local name = Manifest.articulations.names[index];
            
            //Enable envelope controls
            knbLiveRelease.set("enabled", name == "legato");
            knbSusRelease.set("enabled", name != "legato");
            knbSusAttack.set("enabled", name != "legato");
                   
            Articulations.last = Articulations.current;
            Articulations.current = index;
            pnlArticulations.repaint();
        }
    }

    //Set initial articulation
    Articulations.changeArticulation(0);
}