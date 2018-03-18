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

namespace mixer
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
		
		const var micNames = ["Close", "Decca", "Hall"]; //Close, decca, hall
		const var pan = [];
		const var purge = [];

		for (i = 0; i < micNames.length; i++)
		{
			pan[i] = ui.setupControl("sliPan"+i, {stepSize:0.01, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			ui.sliderPanel("sliPan"+i, paintRoutines.biDirectionalSlider, 0, 0.5); //Set up callbacks for pan slider

			Content.setPropertiesFromJSON("sliVol"+i, {type:"Decibel", max:3, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			Content.setPropertiesFromJSON("sliDelay"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			Content.setPropertiesFromJSON("sliWidth"+i, {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			purge[i] = ui.setupControl("btnPurge"+i, {text:micNames[i], bgColour:Theme.CONTROL1, textColour:Theme.BLACK});			
			ui.buttonPanel("btnPurge"+i, paintRoutines.textButton); //Set up callbacks for purge button
		}
    }
	
	inline function onControlCB(number, value)
	{
		for (i = 0; i < micNames.length; i++)
		{
			if (number == pan[i])
			{
				pan[i].repaint();
				break;
			}
			else if (number == purge[i])
			{
                for (s in samplers) //Each sampler
                {
                    //Only purge or load if it's not already purged/loaded
                    if (s.getNumMicPositions() > 1 && s.isMicPositionPurged(i) != value)
                    {
                        s.purgeMicPosition(s.getMicPositionName(i), value);
                    }
                }
				purge[i].repaint();
				break;
			}
		}		
	}
}