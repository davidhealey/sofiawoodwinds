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
		
        //Channel routing and purge buttons
		const var purge = [];
		const var cmbOutput = [];

		for (i = 0; i < 3; i++)
		{
		    //Purge button
		    purge[i] = Content.getComponent("btnPurge"+i);
			purge[i].setControlCallback(onbtnPurgeControl);
			
		    //Channel routing combo boxes
            cmbOutput[i] = Content.getComponent("cmbOutput"+i);
            cmbOutput[i].setControlCallback(cmbOutputCB);
            Engine.isPlugin() ? cmbOutput[i].set("items", "1/2\n3/4\n5/6") : cmbOutput[i].set("items", "1/2");
		}
	}
		
	inline function onbtnPurgeControl(control, value)
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
}
