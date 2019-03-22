const var sustainRoundRobin = Synth.getMidiProcessor("sustainRoundRobin");
const var overlayRoundRobin = Synth.getMidiProcessor("overlayRoundRobin");

const var btnBypass = Content.addButton("btnBypass", 0, 0);
btnBypass.set("text", "Enabled");
btnBypass.setControlCallback(onbtnBypassControl);

inline function onbtnBypassControl(control, value)
{
    sustainRoundRobin.setBypassed(1-value);
    overlayRoundRobin.setBypassed(1-value);
}

const var knbLow = Content.addKnob("knbLow", 150, 0);
knbLow.setRange(0, 127, 1);
knbLow.set("text", "Low Note");
knbLow.setControlCallback(onknbLowControl);

inline function onknbLowControl(control, value)
{
    sustainRoundRobin.setAttribute(sustainRoundRobin.knbLowNote, value);
    overlayRoundRobin.setAttribute(overlayRoundRobin.knbLowNote, value);
}

const var knbHigh = Content.addKnob("knbHigh", 300, 0);
knbHigh.setRange(0, 127, 1);
knbHigh.set("text", "High Note");
knbHigh.setControlCallback(onknbHighControl);

inline function onknbHighControl(control, value)
{
    sustainRoundRobin.setAttribute(sustainRoundRobin.knbHighNote, value);
    overlayRoundRobin.setAttribute(overlayRoundRobin.knbHighNote, value);
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
