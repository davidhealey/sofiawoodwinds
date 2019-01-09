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

	    //Multi-channel routing - Get a reference to its routing matrix
        const var MasterChain = Synth.getChildSynth("sofiaWoodwinds");
        const var matrix = MasterChain.getRoutingMatrix();

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
		const var cmbOutput = [];

		for (i = 0; i < 3; i++)
		{
		    //Purge button
		    Content.setPropertiesFromJSON("btnPurge"+i, {textColour:Theme.C6, itemColour:Theme.C5});
			purge[i] = ui.buttonPanel("btnPurge"+i, purgeButtonPaintRoutine);
			purge[i].setControlCallback(btnPurgeCB);
			
		    //Channel routing combo boxes
            cmbOutput[i] = Content.getComponent("cmbOutput"+i);
            cmbOutput[i].setControlCallback(cmbOutputCB);
            Engine.isPlugin() ? cmbOutput[i].set("items", "1/2\n3/4\n5/6") : cmbOutput[i].set("items", "1/2");
			
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
		
		//Output vu meter
		const var pnlOutputMeter0 = VuMeter.createVuMeter("pnlOutputMeter0");
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
	
    inline function cmbOutputCB(control, value)
    {   
        // this variable checks if the output channel exists.
        local success = true;
        local idx = cmbOutput.indexOf(control); //Mic index

        switch(value)
        {
            case 1:
                matrix.addConnection(0 + (idx * 2), 0);
                matrix.addConnection(1 + (idx * 2), 1);
                break;
            case 2:
                matrix.addConnection(0 + (idx * 2), 2);
                success = matrix.addConnection(1 + (idx * 2), 3);
                break;
            case 3:
                matrix.addConnection(0 + (idx * 2), 4);
                success = matrix.addConnection(1 + (idx * 2), 5);
                break;
        }

        //Reset to Channel 1+2 in case of an error
        if(!success)
        {
            matrix.addConnection(0 + (idx * 2), 0);
            matrix.addConnection(1 + (idx * 2), 1);
        }
    };
	
    function purgeButtonPaintRoutine(g)
	{							
		this.getValue() == 1 ? g.setColour(this.get("textColour")) : g.setColour(this.get("itemColour"));

		g.setFont(Theme.BOLD, 22);
		g.drawAlignedText(this.get("text"), [0, 0, this.get("width"), this.get("height")], "centred");
	};
}
