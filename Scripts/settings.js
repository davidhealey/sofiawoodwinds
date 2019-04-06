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

    // Pass this object to the floating tile
    const var tileData = {
    "Type": "Tabs",
    "Font": "",
    "FontSize": 16,
    "Dynamic": false,
    "ColourData":
        {
            "bgColour": 0x00000000,
            "textColour": 0xFFFFFFFF
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
                "bgColour": 0x00000000,
                "textColour": 0xFFFFFFFF
            },
        "Font": "",
        "FontSize": 16,
        "Driver": !isPlugin,
        "Device": !isPlugin,
        "Output": !isPlugin,
        "BufferSize": !isPlugin,
        "SampleRate": !isPlugin,
        "GlobalBPM": false,
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
            "Font": "",
            "FontSize": 16,
            "ColourData": {
                "bgColour": 0x00000000,
                "textColour": 0xFFFFFFFF
            }
        });
    }

    tileData["Content"].push({
        "Type": "MidiChannelList",
        "Title": "MIDI Channel",
        "StyleData": {
        },
        "Font": "",
        "FontSize": 16,
        "ColourData": {
            "bgColour": 0x00000000,
            "textColour": 0xFFFFFFFF
        }
    });

    tileData["Content"].push({
        "Type": "MidiLearnPanel",
        "Title": "MIDI Automation",
        "Font": "",
        "FontSize": 16,
        "ColourData":
        {
            "bgColour": 0x00000000,
            "textColour": 0xFFFFFFFF,
            "itemColour1": 0xFF735948
        }
    });
    
    tileData["Content"].push({
        "Type": "AboutPagePanel",
        "Title": "About",
        "Font": "",
        "FontSize": 16,
        "ColourData":
        {
            "bgColour": 0x00000000,
            "textColour": 0xFFFFFFFF,
            "itemColour1": 0xFFFFFFFF
        },
        "CopyrightNotice": "\u00a9 2019, David Healey",
        "ShowLicensedEmail": false,
        "WebsiteURL": "https://librewave.com"
    });
    
    Content.getComponent("fltSettings").setContentData(Settings.tileData);
};