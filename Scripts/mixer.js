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
		const var genericMixer = Synth.getMidiProcessor("genericMixer");
		const var ATTRIBUTES = {GAIN:0, DELAY:1, WIDTH:2, PAN:3, MUTE:4, SOLO:5, PURGE:6}; //The attributes/controls of the mic mixer module script
		const var NUM_ATTRIBUTES = 7;
		
		const var micNames = ["Close", "Decca", "Hall"]; //Close, decca, hall
		const var pan = [];
		const var vol = [];
		const var delay = [];
		const var width = [];
		const var purge = [];

		for (i = 0; i < micNames.length; i++)
		{
			pan[i] = Content.getComponent("sliPan"+i);
			vol[i] = Content.getComponent("sliVol"+i);
			delay[i] = Content.getComponent("sliDelay"+i);
			width[i] = Content.getComponent("sliWidth"+i);
			purge[i] = Content.getComponent("btnPurge"+i);

			Content.setPropertiesFromJSON("sliPan"+i, {x:20+(i*60), stepSize:0.01, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			Content.setPropertiesFromJSON("sliVol"+i, {x:35+(i*60), type:"Decibel", max:3, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			Content.setPropertiesFromJSON("sliDelay"+i, {x:20+(i*60), bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			Content.setPropertiesFromJSON("sliWidth"+i, {x:20+(i*60), bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2});
			Content.setPropertiesFromJSON("btnPurge"+i, {x:20+(i*60), text:micNames[i], bgColour:Theme.CONTROL1, textColour:Theme.BLACK});
	
			ui.sliderPanel("sliPan"+i, paintRoutines.biDirectionalSlider, 0, 0.5); //Set up callbacks for pan slider
			ui.buttonPanel("btnPurge"+i, paintRoutines.textButton); //Set up callbacks for purge button
		}
	}
	
	inline function onControlCB(number, value)
	{
		for (i = 0; i < micNames.length; i++)
		{
			if (number == vol[i])
			{
				genericMixer.setAttribute(ATTRIBUTES.GAIN+1 * (NUM_ATTRIBUTES*i), value);
				break;
			}
			else if (number == pan[i])
			{
				genericMixer.setAttribute(ATTRIBUTES.PAN+1 * (NUM_ATTRIBUTES*i), value);	
				pan[i].repaint();
				break;
			}
			else if (number == delay[i])
			{
				genericMixer.setAttribute(ATTRIBUTES.DELAY+1 * (NUM_ATTRIBUTES*i), value);
				break;
			}
			else if (number == width[i])
			{
				genericMixer.setAttribute(ATTRIBUTES.WIDTH+1 * (NUM_ATTRIBUTES*i), value);
				break;
			}
			else if (number == purge[i])
			{
				genericMixer.setAttribute(ATTRIBUTES.PURGE+1 * (NUM_ATTRIBUTES*i), 1-value);
				purge[i].repaint();
				break;
			}
		}		
	}
}