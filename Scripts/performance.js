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
        //Background panel
		Content.setPropertiesFromJSON("pnlPerformance", {itemColour:Theme.C3, itemColour2:Theme.C3});
	    		
        //Sliders
        Content.setPropertiesFromJSON("sliOffset", {bgColour:Theme.C2, itemColour:Theme.F});
        Content.setPropertiesFromJSON("sliGlide", {bgColour:Theme.C2, itemColour:Theme.F, textColour:Theme.C6});
        ui.sliderPanel("sliGlide", sliGlidePaintRoutine, 5, 5);
        
        Content.setPropertiesFromJSON("sliRelease", {bgColour:Theme.C2, itemColour:Theme.F});
    
        //Release trigger purge button
	    Content.setPropertiesFromJSON("btnPurgeReleases", {bgColour:Theme.C5, itemColour:Theme.C4, itemColour2:Theme.C2, textColour:Theme.C6});
	    ui.buttonPanel("btnPurgeReleases", paintRoutines.onOffButton);
        
        //Round robin button		
	    Content.setPropertiesFromJSON("btnRR", {bgColour:Theme.C5, itemColour:Theme.C4, itemColour2:Theme.C2, textColour:Theme.C6});
	    ui.buttonPanel("btnRR", paintRoutines.onOffButton);
	}
	   
    function sliGlidePaintRoutine(g)
    {   
        reg rates = ["1/1", "1/2D", "1/2", "1/2T", "1/4D", "1/4", "1/4T", "1/8D", "1/8", "1/8T", "1/16D", "1/16", "1/16T", "1/32D", "1/32", "1/32T", "1/64D", "1/64", "1/64T"];
        reg range = this.get("max") - this.get("min");
        reg newVal = (this.getWidth() / range) * (this.get("min") + this.getValue());
     
        g.fillAll(this.get("bgColour"));
        g.setColour(this.get("itemColour"));
        
        g.fillRect([0, 0, newVal, this.getHeight()]);
        
        //Border
        g.setColour(0xFF000000);
        g.drawRect([0, 0, this.getWidth(), this.getHeight()], 1);
        
        //Text
        g.setColour(this.get("textColour"));
        g.drawAlignedText(rates[this.getValue()], [0, 0, this.getWidth(), this.getHeight()], "centred");
    }
}