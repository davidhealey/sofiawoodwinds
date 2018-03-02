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

namespace SettingsJson
{
    const var isPlugin = Engine.isPlugin();

    // Use this function to get the Height for the popup
    inline function getHeight()
    {
        return isPlugin ? 360 : 520;
    };
    
    // Pass this object to the floating tile
    const var settings = {
    "Type": "Tabs",
    "Font": "Open Sans",
    "FontSize": 20,
    "Dynamic": false,
    "ColourData":
        {
            "bgColour": Theme.BG,
            "itemColour1": Theme.ZONE
        },
    "Content": [
        {
        "Type": "CustomSettings",
        "Title": "Engine",
        "StyleData": {
        },
        "ColourData":
            {
                "textColour": "0xFFCCCCCC",
                "bgColour": Theme.ZONE
            },
        "Font": "Open Sans Bold",
        "FontSize": 18,
        "Driver": !isPlugin,
        "Device": !isPlugin,
        "Output": !isPlugin,
        "BufferSize": !isPlugin,
        "SampleRate": !isPlugin,
        "GlobalBPM": true,
        "StreamingMode": false,
        "GraphicRendering": false,
        "ScaleFactor": true,
        "SustainCC": false,
        "ClearMidiCC": true,
        "SampleLocation": true,
        "DebugMode": true,
        "ScaleFactorList": [
            1,
            1.25,
            1.5,
            2
        ]
        }
        
    ],
    "CurrentTab": 4
    };    
    
    if(!isPlugin)
    {
        settings["Content"].push(
        {
        "Type": "MidiSources",
        "Title": "MIDI Input",
        "StyleData": {
        },
        "Font": "Open Sans",
        "FontSize": 18,
        "ColourData": {
                "textColour": "0xFFCCCCCC",
                "bgColour": Theme.ZONE
        }
        });
    }
    
    settings["Content"].push({
        "Type": "MidiChannelList",
        "Title": "MIDI Channel",
        "StyleData": {
        },
        "Font": "Open Sans",
        "FontSize": 18,
        "ColourData": {
                "textColour": "0xFFCCCCCC",
                "bgColour": Theme.ZONE
        }
        });
        
    settings["Content"].push({
    
        "Type": "MidiLearnPanel",
        "Title": "MIDI Automation",
        "Font": "Open Sans",
        "FontSize": 18,
        "ColourData":
        {
            "textColour": "0xFFCCCCCC",
            "itemColour2": "0xFF50ebf8",
            "itemColour1": "0xFF222222",
            "bgColour": Theme.ZONE
        }
    });
};