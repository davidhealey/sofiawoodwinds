//INCLUDES
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v1.0/libraries/articulation_v1.0.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v1.0/libraries/core_v1.0.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v1.0/libraries/userInterface_v1.1.js");
include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v1.0/libraries/uiScroll_v1.0.js");

//INIT
Content.makeFrontInterface(770, 250);

var initOver = 0;

const var sustainControlPanel = Synth.getMidiProcessor("sustainControlPanel"); //Control panel in sustain articulation container

const var UACC = 32; //The controller number for universal articulation control
const var keySwitches = []; //All keyswitches assigned, each index refers to same index in arts array
const var controllers = []; //All UACC settings that are assigned as articulation triggers, indexes the same as arts array

const var arts = [];
const var sustainGroup = [0, 1, 2]; //All of these articulations use the sustain articulation's samples (sustain, glide, trill)
const var subArticulations = {"sustain":["Glide", "Trill"]}; //Scripted sub-articulation parent and children
const var containerNames = Synth.getIdList("Container"); //Names of all containers - assume that one container per artiulation excluding master

const var gui = [[], [], [], [], [], [], [], []]; //GUI controls
const var menuItems = {ks:[], velMin:[], velMax:[], Uacc:[]}; //GUI menu items

reg lastVelocity;
reg artActive; //Idicates that at least one artiulation is active

//Index of gui[] sub-arrays that hold the various types of control
namespace controls
{
	const var STATE = 0;
	const var KEYSWITCH = 1;
	const var UACC = 2;
	const var VEL_MIN = 3;
	const var VEL_MAX = 4;
	const var PURGE = 5;
	const var ATTACK = 6;
	const var RELEASE = 7;
}

//AUTOGENERATE ARTICULATION LIST BASED ON CONTAINER AND MIDI PROCESSOR NAMES
for (containerName in containerNames)
{
	if (containerName.indexOf("Master") != -1) continue; //Ignore master chain
	arts.push(Articulation.define(containerName, false)); //Create articulation
	
	//Sub articulations
	if (keyExists(subArticulations, containerName))
	{
		for (subArticulation in subArticulations[containerName])
		{
			if (Synth.getMidiProcessor(subArticulation) !== undefined)
			{
				arts.push(Articulation.define(subArticulation, true)); //Create scripted sub-articulation
			}
		}
	}
}

//GUI

//Populate menu item arrays
for (i = 0; i < 128; i++)
{
	menuItems.ks[i] = Engine.getMidiNoteName(i);
	if (i > 0) menuItems.velMin[i-1] = i;
	if (i > 1) menuItems.velMax[i-2] = i;
	if (i > 0) menuItems.Uacc[i-1] = i;
}

menuItems.ks.push("None");
menuItems.Uacc.push("None");

for (i = 0; i < arts.length; i++)
{
	gui[controls.STATE][i] = ui.button("btnState" + i, 0, 10+40*i, {width:100, text:Articulation.getId(arts[i])});
	gui[controls.KEYSWITCH][i] = ui.comboBox("cmbKs" + i, 110, 10+40*i, {text:"Key Switch", items:menuItems.ks, width:100});
	gui[controls.UACC][i] = ui.comboBox("cmbUacc" + i, 220, 10+40*i, {text:"UACC", items:menuItems.Uacc, width:100});
	gui[controls.VEL_MIN][i] = ui.comboBox("cmbVelMin" + i, 330, 10+40*i, {text:"Min Velocity", items:menuItems.velMin, width:100});
	gui[controls.VEL_MAX][i] = ui.comboBox("cmbVelMax" + i, 440, 10+40*i, {text:"Max Velocity", items:menuItems.velMax, width:100});
	
	//Real articulations have envelope and purge controls, scripted articulations don't
	if (Articulation.getIsScripted(arts[i]) == false)
	{
		gui[controls.PURGE][i] = ui.button("btnPurge"+i, 550, 10+40*i, {text:"Purge", width:100});
		gui[controls.ATTACK][i] = ui.knob("knbAttack" + i, 660, 40*i, {text:"Attack", mode:"Time", defaultValue:5});
		gui[controls.RELEASE][i] = ui.knob("knbRelease" + i, 700, 50+40*i, {text:"Release", mode:"Time", defaultValue:250});
	}
}

const var scroller = uiScroll.verticalScroller(gui, 4);
const var btnDn = ui.button("btnDn", 790, 75, {width:25, text:"Dn"});
const var btnUp = ui.button("btnUp", 790, 35, {width:25, text:"UP"});

const var postInit = ui.button("postInit", 0, 0, {visible:false}); //Hidden button to trigger last control callback on init

//FUNCTIONS
inline function allStateButtonsOff()
{
	for (button in gui[controls.STATE])
	{
		button.setValue(0);
	}
}

inline function changeArticulation(velocity)
{
	local i;

	//Disable all articulations - not articulation buttons but the actual containers	
	for (art in arts)
	{	
		Articulation.disable(art);
	}

	//Enable those articulations whose articulation buttons are enabled
	for (i = 0; i < arts.length; i++)
	{
		if (gui[controls.STATE][i].getValue() == 1) //Articulation button is active
		{
			//If a velocity greater than 0 was passed, check that it's within the range for the articulation before enabling the articulation
			if (inRange(velocity, gui[controls.VEL_MIN][i].getValue(), gui[controls.VEL_MAX][i].getValue()) || velocity < 0)
			{
				if (sustainGroup.indexOf(i) != -1) //Sustain group articulation
				{
					Articulation.enable(arts[0]); //Enable sustain articulation
					sustainControlPanel.setAttribute(i, 1); //Activate the button on sustain container's control panel
				}
				else
				{
					Articulation.enable(arts[i]); //Enable articulation
				}
			}
		}
	}
}

//Callbacks
function onNoteOn()
{
	if (keySwitches.indexOf(Message.getNoteNumber()) != -1) //A keyswitch triggered the callback
	{
		allStateButtonsOff(); //Turn off all articulation buttons

		for (i = 0; i < arts.length; i++) //Each articulation
		{
			if (Synth.isKeyDown(Articulation.getKs(arts[i]))) //Each Ks that is held down
			{
				if (sustainGroup.indexOf(i) != -1) //Sustain group articulation
				{
					//Turn off each sustain group button - only one such button can be active at a time
					for (susGroup in sustainGroup)
					{
						gui[controls.STATE][susGroup].setValue(0);
					}
				}

				gui[controls.STATE][i].setValue(1); //Turn on the articulation button
			}
		}

		//changeArticulation(-1);
		Message.ignoreEvent(Message.getEventId()); //Don't allow any further processing from this event
	}
	else 
	{
		//Glide is activated when sustan is active and a legato interval is played and the sustain pedal is down
		if (Synth.isLegatoInterval() && Synth.isSustainPedalDown() && gui[controls.STATE][0].getValue() == 1)
		{
			gui[controls.STATE][0].setValue(0); //Turn off sustain
			gui[controls.STATE][2].setValue(0); //Turn off trill
			gui[controls.STATE][1].setValue(1); //Turn on glide articulation button
		}

		changeArticulation(Message.getVelocity());
		lastVelocity = Message.getVelocity();
	}
}

function onNoteOff()
{
	//If glide is active but there is not a legato interval currently playing
	if (gui[controls.STATE][1].getValue() && Synth.getNumPressedKeys() == 0)
	{
		gui[controls.STATE][1].setValue(0); //Turn off glide
		gui[controls.STATE][0].setValue(1); //Go back to sustain
		changeArticulation(lastVelocity); //Activate the sustain articulation
	}

	//Ignore key switches
	if (keySwitches.indexOf(Message.getNoteNumber()) != -1)
	{
		Message.ignoreEvent(Message.getEventId());
	}
}

function onController()
{
	switch (Message.getControllerNumber())
	{
		case UACC:
			if (controllers.indexOf(Message.getControllerValue()) != -1)
			{
				allStateButtonsOff();

				for (i = 0; i < arts.length; i++)
				{
					if (Message.getControllerValue() == Articulation.getUacc(arts[i]))
					{
						gui[controls.STATE][i].setValue(1); //Turn on the articulation button
					}
				}
			}
		break;

		case 64: //Sustain pedal
			
			Message.setControllerNumber(102); //Change sustain pedal to undefined CC number so it gets ignored by later scripts

			if (Synth.isSustainPedalDown() == 0) //Sustain pedal lifted
			{
				sustainControlPanel.setAttribute(3, 0); //Turn off same note legato	
				
				if (gui[controls.STATE][1].getValue() == 1) //Glide active
				{
					gui[controls.STATE][1].setValue(0); //Turn off glide
					gui[controls.STATE][0].setValue(1); //Turn on sustain articulation button
				}				
			}
			else 
			{
				if (gui[controls.STATE][0].getValue() == 1) //Sustain articulation active
				{
					sustainControlPanel.setAttribute(3, 1); //Turn on same note legato	
				}
			}
		break;
	}
}

function onTimer()
{	
}

function onControl(number, value)
{
	for (i = 0; i < arts.length; i++) //Each articulation
	{
		if (number == gui[controls.STATE][i] && initOver == 1)
		{
			//The sustain group act as a radioGroup but it has to be custom scripted so that
			// we have the option to have all of the sustain group buttons off
			if (sustainGroup.indexOf(i) != -1)
			{
				//Turn off all sustain articulation state buttons - except the one that triggered the callback
				for (j = 0; j < sustainGroup.length; j++)
				{
					if (j != i) gui[controls.STATE][j].setValue(0);
				}
			}

			//Make sure at least one articulation button is always active
			artActive = -1;
			for (j = 0; j < gui[controls.STATE].length; j++) //Each control row
			{
				if (gui[controls.STATE][j].getValue() == 1) //A state button is active, exit the loop
				{
					artActive = j;
				}
			}

			if (artActive == -1)
			{
				gui[controls.STATE][i].setValue(1);	
				artActive = i;
			}
		}

		//Key switch menus
		if (number == gui[controls.KEYSWITCH][i])
		{
			//Reset the key switch colour before assigning a new KS
			if (Articulation.getKs(arts[i]) != undefined) resetKeyColour(Articulation.getKs(arts[i]));

			if (value < gui[controls.KEYSWITCH][i].get("max"))
			{
				Articulation.setKs(arts[i], value-1);
				Engine.setKeyColour(value-1, Colours.withAlpha(Colours.red, 0.3)); //Key switches are red
				keySwitches[i] = value-1; //Store KS in array
			}
			else 
			{
				gui[controls.KEYSWITCH][i].setValue(undefined);
			}

			break;
		}

		//UACC menus
		if (number == gui[controls.UACC][i])
		{
			value < gui[controls.UACC][i].get("max") ? Articulation.setUacc(arts[i], value) : gui[controls.UACC][i].setValue(undefined);
			controllers[i] = value; //Store UACC value in array
			break;
		}

		//Min velocity menus
		if (number == gui[controls.VEL_MIN][i])
		{
			Articulation.setVelMin(arts[i], value);
			break;
		}

		//Max velocity menus
		if (number == gui[controls.VEL_MAX][i])
		{
			Articulation.setVelMax(arts[i], value);
			break;
		}

		//Purge button
		if (number == gui[controls.PURGE][i])
		{
			Articulation.purge(arts[i], value);
		}

		//Attack knob
		if ((Articulation.getIsScripted(arts[i]) == false) && number == gui[controls.ATTACK][i])
		{
			Articulation.setAttack(arts[i], value);
			break;
		}

		//Release knob
		if ((Articulation.getIsScripted(arts[i]) == false) && number == gui[controls.RELEASE][i])
		{
			Articulation.setRelease(arts[i], value);
			break;
		}
	}

	if (number == btnDn)
	{
		uiScroll.scrollUpDown(scroller, 1);
		btnDn.setValue(0);
	}

	if (number == btnUp)
	{
		uiScroll.scrollUpDown(scroller, -1);
	}

	if (number == postInit)
	{
		initOver = 1;
	}
}