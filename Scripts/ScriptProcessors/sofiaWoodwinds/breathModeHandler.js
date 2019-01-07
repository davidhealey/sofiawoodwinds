reg ccValue = 0;

const var legato = Synth.getMidiProcessor("legato"); //Legato handler
const var transitionBreathControl = Synth.getMidiProcessor("transitionBreathControl");

const var btnEnable = Content.addButton("btnEnable", 0, 10);
btnEnable.set("text", "Enable");
btnEnable.setControlCallback(btnEnableCB);

const var knbCC = Content.addKnob("knbCC", 150, 0);
knbCC.set("text", "CC");
knbCC.setRange(1, 127, 1);
knbCC.setControlCallback(knbCCCB);

//UI Callbacks
inline function btnEnableCB(control, value)
{
    legato.setAttribute(14, value);
    transitionBreathControl.setBypassed(1-value);
}

inline function knbCCCB(control, value)
{
    legato.setAttribute(3, value);
    transitionBreathControl.setAttribute(0, value);
}function onNoteOn()
{
	
}
function onNoteOff()
{
	
}
function onController()
{
	
}
function onTimer()
{
	
}
function onControl(number, value)
{
	
}
