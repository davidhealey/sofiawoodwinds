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
		const var parameters = ["Velocity", "Expression", "Dynamics", "Vibrato Depth", "Vibrato Rate"];
		const var reservedCc = [5, 14, 15, 32, 64, 65]; //CCs used internally, not user selectable

		//Get CC modulators
		const var mods = [];
		mods[1] = Synth.getModulator("expressionCC");
		mods[2] = Synth.getModulator("dynamicsCC");
		mods[3] = Synth.getModulator("vibratoIntensityCC");
		mods[4] = Synth.getModulator("vibratoRateCC");

		const var ccNums = [];
		//Populate list of CC numbers
		for (i = 1; i < 128; i++)
		{
		  if (reservedCc.indexOf(i) == -1) ccNums.push(i); //If CC is not reserved
		}

		//Panel
		ui.setupControl("pnlControllers", {"itemColour":Theme.ZONE, "itemColour2":Theme.ZONE});

		//Labels
		Content.setPropertiesFromJSON("lblControllers", {fontName:Theme.ZONE_FONT, fontSize:Theme.ZONE_FONT_SIZE}); //Title label
		Content.setPropertiesFromJSON("lblParameter", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
		Content.setPropertiesFromJSON("lblController", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});

		const var cmbParam = ui.comboBoxPanel("cmbParam", paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, parameters);
		Content.setPropertiesFromJSON("cmbParam", {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
		cmbParam.setControlCallback(cmbParamCB);

		const var cmbCc = []; //Controller number selection combo boxes
		const var tblCc = []; //Controller value tables

		for (i = 0; i < parameters.length; i++)
		{
			//Parameter menu
			cmbCc[i] = ui.setupControl("cmbCc"+i, {bgColour:Theme.CONTROL2, itemColour:Theme.CONTROL1, textColour:Theme.CONTROL_TEXT});
			cmbCc[i].setControlCallback(cmbCcCB);

			//CC number menu
			if (i > 0) //Skip velocity
			{
				ui.comboBoxPanel("cmbCc"+i, paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, ccNums);
			}
			else //Velocity
			{
				ui.comboBoxPanel("cmbCc"+i, paintRoutines.comboBox, Theme.CONTROL_FONT_SIZE, ["Velocity"]);
			}

			//Response table
			tblCc[i] = ui.setupControl("tblCc"+i, {customColours:true, bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, itemColour2:Theme.HEADER});
		}
	}

	inline function onNoteCB()
  {
      Message.setVelocity(Math.max(1, 127/100 * tblCc[0].getTableValue(Message.getVelocity()) * 100)); //Scale velocity using table
  }

	inline function cmbParamCB(control, value)
	{
		for (i = 0; i < parameters.length; i++)
		{
			cmbCc[i].set("visible", i == (value-1));
			tblCc[i].set("visible", i == (value-1));
		}
	}

	inline function cmbCcCB(control, value)
	{
		local idx = cmbCc.indexOf(control); //Get control's parameter index
		if (idx > 0) //Ignore velocity mod
		{
			mods[idx].setAttribute(2, control.data.items[value-1]);
		}
	}
}
