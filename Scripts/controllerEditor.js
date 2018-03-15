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
        const var reservedCc = [5, 32, 64, 65, 72, 73]; //CCs used internally, not user selectable

        const var ccMods = [];
        ccMods[1] = Synth.getModulator("expressionCC");
        ccMods[2] = Synth.getAllModulators("dynamicsCC"); //All dynamics CC modulators
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

		const var cmbParam = ui.comboBoxPanel("cmbParam", paintRoutines.comboBox, parameters);
		Content.setPropertiesFromJSON("cmbParam", {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});

		const var cmbCc = []; //Controller number selection combo boxes
		const var tblCc = []; //Controller value tables

		for (i = 0; i < parameters.length; i++)
		{
			//Controller selection
			cmbCc[i] = Content.addPanel("cmbCc"+i, 90, 80);
			Content.setPropertiesFromJSON("cmbCc"+i, {width:100, height:25, bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT, parentComponent:"pnlRightZone"});
			ui.comboBoxPanel("cmbCc"+i, paintRoutines.comboBox, ccNums);

			//Response table
			tblCc[i] = Content.addTable("tblCc"+i, 10, 115);
			Content.setPropertiesFromJSON("tblCc"+i, {width:180, height:95, parentComponent:"pnlRightZone"});
		}

		const var pnlTblBg = Content.getComponent("pnlTblBg"); //Table background colour panel
		pnlTblBg.setPaintRoutine(function(g){g.fillAll(Theme.CONTROL2);});
	}

	inline function onNoteCB()
	{
		Message.setVelocity(Math.max(1, 127 * tblCc[0].getTableValue(Message.getVelocity()))); //Scale velocity according to table
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
                    if (!Array.isArray(ccMods[i])) //Single modulator
                    {
                        ccMods[i].setAttribute(2, cmbCc[i].data.items[value-1]); //Change the mod's CC number
                    }
				    else //Multiple modulators for this parameter
				    {
				        for (m in ccMods[i])
				        {
				            m.setAttribute(2, cmbCc[i].data.items[value-1]); //Change the mod's CC number
				        }
				    }
					break; //Exit loop
				}
			}
		}
	}
}
