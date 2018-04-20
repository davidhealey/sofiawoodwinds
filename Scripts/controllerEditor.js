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

namespace controllerEditor
{
	inline function onInitCB()
	{
		const var parameters = ["Velocity", "Expression", "Dynamics", "Vibrato Depth", "Vibrato Rate"];
        const var reservedCc = [5, 14, 15, 32, 64, 65]; //CCs used internally, not user selectable

        const var ccMods = [];
        ccMods[1] = Synth.getModulator("expressionCC");
        ccMods[2] = Synth.getModulator("dynamicsCC");
        ccMods[3] = Synth.getModulator("vibratoIntensityCC");
        ccMods[4] = Synth.getModulator("vibratoRateCC");

        const var ccNums = [];
        //Populate list of CC numbers
        for (i = 1; i < 128; i++)
	    {
	        //CC is not reserved
	        if (reservedCc.indexOf(i) == -1)
            {
	             ccNums.push(i);
            }
	    }
	    
	    //Labels
        Content.setPropertiesFromJSON("lblParameter", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
        Content.setPropertiesFromJSON("lblController", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
	    
		const var cmbParam = ui.comboBoxPanel("cmbParam", paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, parameters);
		Content.setPropertiesFromJSON("cmbParam", {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});

		const var cmbCc = []; //Controller number selection combo boxes
		const var tblCc = []; //Controller value tables

		for (i = 0; i < parameters.length; i++)
		{
			//Controller selection
			cmbCc[i] = ui.setupControl("cmbCc"+i, {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
			
			if (i > 0) //Skip velocity
		    {
                ui.comboBoxPanel("cmbCc"+i, paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, ccNums);
		    }
		    else //Velocity
		    {
		        ui.comboBoxPanel("cmbCc"+i, paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, ["Velocity"]);
		    }

			//Response table
			tblCc[i] = Content.getComponent("tblCc"+i);
		}
		
		const var pnlTblBg = Content.getComponent("pnlTblBg"); //Table background colour panel
		pnlTblBg.setPaintRoutine(function(g){g.fillAll(Theme.CONTROL2);});
	}

	inline function onNoteCB()
    {
        Message.setVelocity(Math.max(1, 127/100 * tblCc[0].getTableValue(Message.getVelocity()) * 100)); //Scale velocity using table
    }
	
	inline function onControlCB(number, value)
	{
		if (number == cmbParam)
		{
			for (i = 0; i < parameters.length; i++)
			{
				cmbCc[i].set("visible", false);
				tblCc[i].set("visible", false);
			}
			cmbCc[value-1].set("visible", true);
			tblCc[value-1].set("visible", true);
		}
		else //cmbCc[] or tblCc[]
		{
			for (i = 1; i < parameters.length; i++) //Start at 1 to skip velocity
			{
				if (number == cmbCc[i])
				{
                    ccMods[i].setAttribute(2, cmbCc[i].data.items[value-1]); //Change the mod's CC number
					break; //Exit loop
				}
			}
		}
	}
}