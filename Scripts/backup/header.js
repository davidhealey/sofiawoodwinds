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

namespace Header
{
  inline function onInitCB()
  {
    //Header background
    Content.setPropertiesFromJSON("pnlHeader", {itemColour:Theme.C2, itemColour2:Theme.C2});

    //Logo
    const var pnlLogo = ui.setupControl("pnlLogo", {textColour:Theme.LOGO});
    pnlLogo.setPaintRoutine(paintRoutines.logo);
    pnlLogo.setControlCallback(pnlLogoCB);
  }

  //UI Callbacks
  inline function pnlLogoCB(control, value)
  {
    Engine.openWebsite("https://www.librewave.com");
  }
}
