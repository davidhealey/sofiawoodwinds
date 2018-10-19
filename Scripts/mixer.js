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

namespace Mixer
{
	inline function onInitCB()
	{

		//Retrieve samplers and store in samplers array
		const var samplerIds = Synth.getIdList("Sampler"); //Get IDs of samplers
		const var samplers = [];

		for (s in samplerIds)
		{
		    samplers.push(Synth.getSampler(s));
		}

		//Background panel
		Content.setPropertiesFromJSON("pnlMixer", {itemColour:Theme.C3, itemColour2:Theme.C3});
			
		//Knobs and sliders
		const var purge = [];

		for (i = 0; i < 3; i++)
		{
		    //Purge button
		    Content.setPropertiesFromJSON("btnPurge"+i, {textColour:Theme.C6, itemColour:Theme.C5});
			purge[i] = ui.buttonPanel("btnPurge"+i, purgeButtonPaintRoutine);
			purge[i].setControlCallback(btnPurgeCB);
			
		    //Volume slider
		    Content.setPropertiesFromJSON("sliVol"+i, {bgColour:Theme.C2, itemColour:Theme.F});
		    
		    //Pan knob
			Content.setPropertiesFromJSON("sliPan"+i, {bgColour:Theme.C2, itemColour:Theme.F});
			ui.sliderPanel("sliPan"+i, paintRoutines.knob, 0, 0.5);

			//Width knob
            Content.setPropertiesFromJSON("sliWidth"+i, {bgColour:Theme.C2, itemColour:Theme.F});
			ui.sliderPanel("sliWidth"+i, paintRoutines.knob, 0, 0.5);
			
			//Delay knob
			Content.setPropertiesFromJSON("sliDelay"+i, {bgColour:Theme.C2, itemColour:Theme.F});
			ui.sliderPanel("sliDelay"+i, paintRoutines.knob, 0, 0.5);
		}
	}
	
	inline function enablePurgeButtons()
    {
        for (i = 0; i < 3; i++)
		{
		    purge[i].setValue(1);
		    purge[i].changed();
		}
    }
	
	inline function btnPurgeCB(control, value)
	{
		local idx = purge.indexOf(control);

		for (s in samplers) //Each sampler
		{
			//Only purge or load if it's state has changed
			if (s.getNumMicPositions() > 1 && s.isMicPositionPurged(idx) != 1-value)
			{
				s.purgeMicPosition(s.getMicPositionName(idx), 1-value);
			}
		}
	}
	
    function purgeButtonPaintRoutine(g)
	{							
		this.getValue() == 1 ? g.setColour(this.get("textColour")) : g.setColour(this.get("itemColour"));

		g.setFont(Theme.BOLD, 22);
		g.drawAlignedText(this.get("text"), [0, 0, this.get("width"), this.get("height")], "centred");
	};
}
