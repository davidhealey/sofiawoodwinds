/*
    Copyright 2018 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

namespace ArticulationHandler
{
    inline function onInitCB()
    {
        const var legato = Synth.getMidiProcessor("legato");
       
        //Glide rates
        const var rates = ["1/1", "1/2D", "1/2", "1/2T", "1/4D", "1/4", "1/4T", "1/8D", "1/8", "1/8T", "1/16D", "1/16", "1/16T", "1/32D", "1/32", "1/32T", "1/64D", "1/64", "1/64T", "Velocity"];

        //Panel
        ui.setupControl("pnlArticulations", {"itemColour":Theme.ZONE, "itemColour2":Theme.ZONE});

        //Title label
        Content.setPropertiesFromJSON("lblArtTitle", {fontName:Theme.ZONE_FONT, fontSize:Theme.ZONE_FONT_SIZE});

        //Release
        const var lblRel = ui.setupControl("lblRel", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
        const var rel = ui.setupControl("sliRel", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});

        //Legato and glide controls
        const var lblOffset = ui.setupControl("lblOffset", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
        const var sliOffset = ui.setupControl("sliOffset", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});       
        const var lblRate = ui.setupControl("lblRate", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
        const var lblMode = ui.setupControl("lblGlideMode", {fontName:Theme.LABEL_FONT, fontSize:Theme.LABEL_FONT_SIZE, textColour:Theme.BLACK});
        const var sliRate = ui.setupControl("sliRate", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
        const var lblRateVal = Content.getComponent("lblRateVal");
        const var btnGlide = ui.buttonPanel("btnGlideMode", paintRoutines.pushButton);
        
        Content.setPropertiesFromJSON("btnGlideMode", {bgColour:Theme.CONTROL1, itemColour:Theme.CONTROL2, textColour:Theme.CONTROL_TEXT});
        sliRate.setControlCallback(sliGlideRateCB);
        btnGlide.setControlCallback(btnGlideModeCB);
    }

  //*** UI CALLBACKS ***
  inline function sliGlideRateCB(control, value)
  {
    legato.setAttribute(10, value);
    lblRateVal.set("text", rates[value]);
  }

  inline function btnGlideModeCB(control, value)
  {
    legato.setAttribute(3, value);
    value == 1 ? btnGlide.set("text", "Whole Step") : btnGlide.set("text", "Half Step");
    
  }
}
