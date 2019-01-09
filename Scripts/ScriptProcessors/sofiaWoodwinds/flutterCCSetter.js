const var flutterCC = Synth.getModulator("flutterCC");
const var flutterHandler = Synth.getMidiProcessor("flutterHandler");

const var knbCC = Content.addKnob("knbCC", 0, 0);
knbCC.set("text", "Flutter CC");
knbCC.setRange(1, 127, 1);
knbCC.setControlCallback(knbCCCB);

inline function knbCCCB(control, value)
{
    flutterCC.setAttribute(flutterCC.ControllerNumber, value);
    flutterHandler.setAttribute(0, value);
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
