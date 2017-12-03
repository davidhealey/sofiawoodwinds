//INCLUDES
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v2.0/libraries/articulation_v1.0.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v2.0/libraries/channel_v1.5.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v1.0/libraries/core_v1.0.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v2.0/libraries/scrollBox_v1.1.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v2.0/libraries/userInterface_v2.0.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v2.0/libraries/uiTab_v1.0.js");

include("tab0.js");
include("tab1.js");
include("tab2.js");
include("tab3.js");

//INIT
const var UI_WIDTH = 633;
const var UI_HEIGHT = 275;
const var NUM_TABS = 4;
const var tabButtons = [];
const var containerIds = Synth.getIdList("Container");
reg currentTab = 0;

Engine.loadFont("{PROJECT_FOLDER}" + "JosefinSans-Bold.ttf");
Engine.loadFont("{PROJECT_FOLDER}" + "fabian.ttf");

//ALL GUI
Content.makeFrontInterface(UI_WIDTH, UI_HEIGHT);
Engine.setLowestKeyToDisplay(24);

const var tabs = [];
for (i = 0; i < NUM_TABS; i++)
{
	tabs[i] = uiTab.addTab(i, 0, 0, UI_WIDTH, UI_HEIGHT, "wallpaper" + i + ".png");
}

uiTab.addTabButton(tabs[0], {x:67, y:234, width:91, height:35, text:"", filmstripImage:"empty.png"});
uiTab.addTabButton(tabs[2], {x:340, y:234, width:147, height:35, text:"", filmstripImage:"empty.png"});
uiTab.addTabButton(tabs[3], {x:501, y:234, width:64, height:35, text:"", filmstripImage:"empty.png"});
uiTab.addTabButton(tabs[1], {x:173, y:234, width:152, height:35, text:"", filmstripImage:"empty.png"}); //Declare last so active by default

for (i = 0; i < NUM_TABS; i++)
{
	tabButtons[i] = uiTab.getButton(tabs[i]);
}

tab0.initCallback();
tab1.initCallback();
tab2.initCallback();
tab3.initCallback();

//Instrument name label - text taken from ID of second container
const var lblInstName = ui.label(0, 8, {width:UI_WIDTH, height:25, text:containerIds[1], textColour:4281545523, fontName:"fabian", fontSize:38, alignment:"centred"});

//FUNCTIONS

//CALLBACKS
function onNoteOn()
{
	tab0.onNoteOnCallback();
	tab1.onNoteOnCallback();
	tab2.onNoteOnCallback();
	tab3.onNoteOnCallback();
}

function onNoteOff()
{
	tab0.onNoteOffCallback();
	tab1.onNoteOffCallback();
	tab2.onNoteOffCallback();
	tab3.onNoteOffCallback();
}

function onController()
{
	tab0.onControllerCallback();
	tab1.onControllerCallback();
	tab2.onControllerCallback();
	tab3.onControllerCallback();
}

function onTimer()
{
	tab0.onTimerCallback();
	tab1.onTimerCallback();
	tab2.onTimerCallback();
	tab3.onTimerCallback();
}

function onControl(number, value)
{
	if (tabButtons.contains(number)) //Tab button triggered callback
	{
		currentTab = tabButtons.indexOf(number);
		uiTab.showTab(tabs, tabs[currentTab]);
	}

	tab0.onControlCallback(number, value);
	tab1.onControlCallback(number, value);
	tab2.onControlCallback(number, value);
	tab3.onControlCallback(number, value);
}