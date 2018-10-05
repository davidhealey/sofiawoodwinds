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

namespace PageHandler
{
    const var pageCount = 3;
    const var pages = [];
    const var buttons = [];

	inline function onInitCB()
	{
	    for (i = 0; i < PageHandler.pageCount; i++)
	    {
	        PageHandler.pages[i] = Content.getComponent("page"+i);	        
	        PageHandler.buttons[i] = ui.buttonPanel("btnPage"+i, buttonPaintRoutine);
	        PageHandler.buttons[i].setControlCallback(btnPageCB);
	    }	    
	    changePage(1);
	}
	
	inline function btnPageCB(control, value)
    {
        local idx = PageHandler.buttons.indexOf(control);
        PageHandler.changePage(idx);
    }
	
	inline function changePage(n)
    {
        local i;
        
        for (i = 0; i < PageHandler.pageCount; i++)
        {
            PageHandler.pages[i].showControl(false);
            PageHandler.buttons[i].setValue(0);
            PageHandler.pages[i].repaint();
            PageHandler.buttons[i].repaint();
        }
        PageHandler.pages[n].showControl(true);
        PageHandler.buttons[n].setValue(1);
    }
    
    function buttonPaintRoutine(g)
	{
	    this.getValue() == 1 ? g.setColour(Theme.C6) : g.setColour(Theme.C5);
	    
		g.setFont(Theme.REGULAR, 23);
		g.drawAlignedText(this.get("text"), [0, 0, this.get("width"), this.get("height")], "centred");
	};
}
