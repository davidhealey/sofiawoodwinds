/** External Script File settingsPanelJson */

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
    "Font": "Comic Sans MS",
    "FontSize": 18,
    "Dynamic": false,
    "ColourData":
        {
            "bgColour": "0",
            "itemColour1": "0xFF222222"
        },
    "Content": [
        {
        "Type": "CustomSettings",
        "Title": "Settings",
        "StyleData": {
        },
        "ColourData":
            {
                "textColour": "0xFFCCCCCC"
            },
        "Font": "Comic Sans MS",
        "FontSize": 16,
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
    "CurrentTab": 0
    };
    
    
    if(!isPlugin)
    {
        settings["Content"].push(
        {
        "Type": "MidiSources",
        "Title": "MIDI Input",
        "StyleData": {
        },
        "Font": "Comic Sans MS",
        "FontSize": 15,
        "ColourData": {
                "textColour": "0xFFCCCCCC"
        }
        });
    }
    
    settings["Content"].push({
        "Type": "MidiChannelList",
        "Title": "MIDI Channel Filter",
        "StyleData": {
        },
        "Font": "Comic Sans MS",
        "FontSize": 15,
        "ColourData": {
                "textColour": "0xFFCCCCCC"
        }
        });
        
    settings["Content"].push({
    
        "Type": "MidiLearnPanel",
        "Title": "MIDI Automation",
        "Font": "Comic Sans MS",
        "FontSize": 15,
        "ColourData":
        {
            "textColour": "0xFFCCCCCC",
            "itemColour2": "0xFF50ebf8",
            "itemColour1": "0xFF111111",
            "bgColour": "0xFF000000"
        }
    });
};