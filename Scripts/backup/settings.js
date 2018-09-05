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

namespace Settings
{
    const var isPlugin = Engine.isPlugin();

    // Use this function to get the Height for the popup
    inline function getHeight()
    {
        return isPlugin ? 360 : 520;
    };

    // Pass this object to the floating tile
    const var tileData = {
    "Type": "Tabs",
    "Font": Theme.REGULAR,
    "FontSize": 22,
    "Dynamic": false,
    "ColourData":
        {
            "bgColour": Theme.C3,
            "itemColour1": Theme.C5,
            "textColour":Theme.C6
        },
    "Content": [],
    "CurrentTab": 0
    };

    tileData["Content"].push({
        "Type": "CustomSettings",
        "Title": "Engine",
        "StyleData": {
        },
        "ColourData":
            {
                "bgColour": Theme.C3,
                "textColour": Theme.C6,
            },
        "Font": Theme.BOLD,
        "FontSize": 18,
        "Driver": !isPlugin,
        "Device": !isPlugin,
        "Output": !isPlugin,
        "BufferSize": !isPlugin,
        "SampleRate": !isPlugin,
        "GlobalBPM": true,
        "StreamingMode": true,
        "GraphicRendering": false,
        "ScaleFactor": true,
        "SustainCC": false,
        "ClearMidiCC": true,
        "SampleLocation": true,
        "DebugMode": false,
        "ScaleFactorList": [
            1,
            1.25,
            1.5,
            2
        ]
    });
    
    if(!isPlugin)
    {
        tileData["Content"].push(
        {
            "Type": "MidiSources",
            "Title": "MIDI Input",
            "StyleData": {
            },
            "Font": Theme.REGULAR,
            "FontSize": 18,
            "ColourData": {
                "bgColour": Theme.C3,
                "textColour": Theme.C6
            }
        });
    }

    tileData["Content"].push({
        "Type": "MidiChannelList",
        "Title": "MIDI Channel",
        "StyleData": {
        },
        "Font": Theme.REGULAR,
        "FontSize": 18,
        "ColourData": {
            "bgColour": Theme.C3,
            "textColour": Theme.C6
        }
    });

    tileData["Content"].push({
        "Type": "MidiLearnPanel",
        "Title": "MIDI Automation",
        "Font": Theme.REGULAR,
        "FontSize": 18,
        "ColourData":
        {
            "bgColour": Theme.C3,
            "textColour": Theme.C6,
            "itemColour1": Theme.C4
        }
    });
    
	inline function onInitCB()
	{
        //Background panel
		Content.setPropertiesFromJSON("pnlSettings", {itemColour:Theme.C3, itemColour2:Theme.C3});
		
        local fltSettings = Content.getComponent("fltSettings");
        fltSettings.setContentData(Settings.tileData);
	}
};
