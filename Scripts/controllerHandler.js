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

namespace ControllerHandler
{
	inline function onInitCB()
	{
		const var parameters = ["Velocity", "Expression", "Dynamics", "Vibrato", "Vibrato Speed", "Flutter"];
		const var reservedCc = [32, 64]; //CCs used internally, not user selectable
		
		const var flutterCCMods = [];
		flutterCCMods[0] = Synth.getModulator("flutterIntensityCC");
		flutterCCMods[1] =  Synth.getModulator("flutterCC");
        	
		const var ccNums = [];
		//Populate list of CC numbers
		for (i = 1; i < 128; i++)
		{
		  if (reservedCc.indexOf(i) == -1) ccNums.push(i); //If CC is not reserved
		}

		//Background panel
		Content.setPropertiesFromJSON("pnlControllers", {itemColour:Theme.C3, itemColour2:Theme.C3});
		
		//Heading Labels
		Content.setPropertiesFromJSON("lblParameter", {fontName:Theme.BOLD, fontSize:20, textColour:Theme.C6});
		Content.setPropertiesFromJSON("lblController", {fontName:Theme.BOLD, fontSize:20, textColour:Theme.C6});

        //Parameter combo box
		const var cmbParam = ui.setupControl("cmbParam", {itemColour:Theme.C4, itemColour2:Theme.C4, textColour:Theme.C6, items:parameters.join("\n")});
		cmbParam.setControlCallback(cmbParamCB);

		const var cmbCc = []; //Controller number selection combo boxes
		const var tblCc = []; //Controller value tables

		for (i = 0; i < parameters.length; i++)
		{
			//Parameter menu
			cmbCc[i] = ui.setupControl("cmbCc"+i, {itemColour:Theme.C4, itemColour2:Theme.C4, textColour:Theme.C6});
            i > 0 ? cmbCc[i].set("items", ccNums.join("\n")) : cmbCc[i].set("items", "Velocity");

			//Response table
			tblCc[i] = ui.setupControl("tblCc"+i, {customColours:true, bgColour:Theme.C2, itemColour:Theme.C5, itemColour2:0x70000000});
		}
		
		//Flutter CC number selection requires its own callback as the combo box is used for multiple modulators
		cmbCc[5].setControlCallback(cmbFlutterCB);
	}

	inline function cmbParamCB(control, value)
	{
		for (i = 0; i < parameters.length; i++)
		{
			cmbCc[i].set("visible", i == (value-1));
			tblCc[i].set("visible", i == (value-1));
		}
	}
	
	inline function cmbFlutterCB(control, value)
    {
        flutterCCMods[0].setAttribute(2, value);
        flutterCCMods[1].setAttribute(2, value);
    }
}
