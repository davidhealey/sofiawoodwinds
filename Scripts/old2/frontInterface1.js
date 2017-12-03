//Content.makeFrontInterface(650, 275+72);
Content.setHeight(275+72);

include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/HISE-Scripting-Framework/v3/libraries/factoryPreset_v1.0.0.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/HISE-Scripting-Framework/v3/libraries/helpers_v1.0.0.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/HISE-Scripting-Framework/v3/libraries/uiFactory_v2.0.1.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/HISE-Scripting-Framework/v3/libraries/tab_v1.5.0.js");
include("paintRoutines.js"); //Global paint routines for GUI components
include("tab0.js");
include("tab1.js");
include("tab2.js");
include("tab3.js");

//ENUMS
namespace PARAMETERS
{
	const var LABELS = ["Velocity", "Dynamics", "Expression", "Vibrato Depth", "Vibrato Rate", "Glide Rate", "Blend"];
	const var VELOCITY = 0;
	const var DYNAMICS = 1;
	const var EXPRESSION = 2;
	const var VIBRATO_DEPTH = 3;
	const var VIBRATO_RATE = 4;
	const var GLIDE_RATE = 5;
	const var BLEND = 6;
}

namespace ARTICULATIONS
{
	const var SUSTAIN = 0;
	const var LEGATO = 1;
	const var GLIDE = 2;
}

Engine.loadFont("{PROJECT_FOLDER}fabian.ttf"); //Load preset title font
Engine.loadFont("{PROJECT_FOLDER}CoventryGarden.ttf"); //Load preset title font

// Create a storage panel, hide it, and save it in the preset
const var storagePanel = Content.addPanel("storagePanel", 0, 0);
storagePanel.set("visible", false);
storagePanel.set("saveInPreset", true);

// Create object that will hold the preset values for each tab.
var presetData = {};

// Set the storage as widget value for the hidden panel.
// Important: this will not clone the object but share a reference!
storagePanel.setValue(data);

//Get ID lists
const var samplerIds = Synth.getIdList("Sampler");
const var containerIds = Synth.getIdList("Container");
const var samplers = [];
const var releaseSamplers = [];

const var playableRangeScript = Synth.getMidiProcessor("playableRange"); //Get playable range script
const var playableRange = [playableRangeScript.getAttribute(0), playableRangeScript.getAttribute(1)]; //Get playable range from script

//Get samplers
for (id in samplerIds)
{
	samplers.push(Synth.getSampler(id)); //Store all samplers
	
	//Get release samplers
	if (id.indexOf("elease") == -1) continue
	releaseSamplers.push(Synth.getSampler(id));
}

//GUI

//Preset save data button - hidden from user
const var savePresetData = Content.addButton("savePresetData", 675, 50);
savePresetData.set("saveInPreset", false);

//Background Vectors
const var background = ui.panel(0, 0, {width:650, height:275, paintRoutine:backgroundPaint, opaque:true});

//On screen keyboard
const var keyboard = ui.floatingTile(0, 275, {width:650}, {"Type":"Keyboard", "LayoutData":{}, "LowKey":24}); //Floating tile for on screen keyboard

//Create 3 tabs - settings, mixer, performance
const var tabs = [1, 2, 3, 4];
const var tabButtons = [];
tabs[0] = tab.addTab(0, 0, 0, 650, 275); //Settings
tabs[1] = tab.addTab(1, 0, 0, 650, 275); //Mixer
tabs[2] = tab.addTab(2, 0, 0, 650, 275); //Performance (articulations and CCs)

//Button labels - text placed behind invisible buttons to show active tab
const var tabButtonLabels = [];
tabButtonLabels[0] = ui.label(60, 238, {width:150, height:35, text:"Settings", fontName:"Coventry Garden", fontSize:30});
tabButtonLabels[1] = ui.label(268, 238, {width:150, height:35, text:"Mixer", fontName:"Coventry Garden", fontSize:30});
tabButtonLabels[2] = ui.label(440, 238, {width:150, height:35, text:"Performance", fontName:"Coventry Garden", fontSize:30});

//Tab buttons - for switching between tabs
for (i = 0; i < tabs.length; i++)
{
	//if (i != tabs.length-1) tab.addImage(tabs[i], "tab" + i + ".png");
	tabButtons[i] = Content.addButton("btnTab"+i, 52+(202*i)-(5*i), 240);
	tabButtons[i].set("filmstripImage", "{PROJECT_FOLDER}empty.png");
	tabButtons[i].set("width", 100);
	tabButtons[i].set("height", 35);
	tabButtons[i].set("radioGroup", 1);
}

tabButtons[2].set("width", 140); //Performance button needs to be wider

//Add 4th tab Preset browser - full height, covers keyboard
tabs[3] = tab.addTab(3, 0, 50, 650, 230+72);
tabButtons[3].setPosition(200, 5, 235, 35); //Preset button position and dimensions

//Instrument title - uses ID of second container as text
const var title = ui.label(112, 4, {width:400, height:40, text:containerIds[1], fontSize:38, textColour:0xFF333333, fontName:"fabian", alignment:"centred"});

//Tab init callbacks
tab0.initCB();
tab1.initCB();
tab2.initCB();
tab3.initCB();

//Last control, hidden. Only exists to retrigger the on control callback after init has completed so post init tasks can be done
const var postInit = Content.addButton("postInit", 0, 0);
postInit.set("visible", false);

//FUNCTIONS
inline function toggleTabButtonLabel()
{
	tab.getIsVisible(tabs[0]) == 0 ? tabButtonLabels[0].set("textColour", 0x80FBE9B4) : tabButtonLabels[0].set("textColour", 0xFFFBE9B4);
	tab.getIsVisible(tabs[1]) == 0 ? tabButtonLabels[1].set("textColour", 0x80FBE9B4) : tabButtonLabels[1].set("textColour", 0xFFFBE9B4);
	tab.getIsVisible(tabs[2]) == 0 ? tabButtonLabels[2].set("textColour", 0x80FBE9B4) : tabButtonLabels[2].set("textColour", 0xFFFBE9B4);
}function onNoteOn()
{
	tab2.onNoteCB(Message.getNoteNumber(), Message.getVelocity());
}
function onNoteOff()
{
	
}
function onController()
{
	tab2.onControllerCB(Message.getControllerNumber(), Message.getControllerValue());
}
function onTimer()
{
	
}
function onControl(number, value)
{	
	switch (number)
	{		
		case storagePanel: 
			if (typeof storagePanel.getValue() == "object") //If the data object has been stored
			{
				presetData = storagePanel.getValue(); //Restore data from panel	
			}
		break;
		
		case savePresetData:
			factoryPreset.storePresetData();
			savePresetData.setValue(0);
		break;
		
		//Change tab buttons
		case tabButtons[0]:
			tab.solo(tabs[0], tabs);
			toggleTabButtonLabel();
		break;
		
		case tabButtons[1]:
			tab.solo(tabs[1], tabs);
			toggleTabButtonLabel();
		break;
		
		case tabButtons[2]:
			tab.solo(tabs[2], tabs);
			toggleTabButtonLabel();
		break;

		case tabButtons[3]:
			tab.getIsVisible(tabs[3]) == false ? tab.show(tabs[3]) : tab.hide(tabs[3]); //Toggle visibility of presetBrowser tab
		break;
		
		case postInit:
			tab.solo(tabs[1], tabs); //Set default tab
			tabButtons[1].setValue(1);
			toggleTabButtonLabel();
		break;
	}
	
	tab0.onControlCB(number, value);
	tab1.onControlCB(number, value);
	tab2.onControlCB(number, value);
	tab3.onControlCB(number, value);
	
	//factoryPreset.restorePresetData(number);
}
