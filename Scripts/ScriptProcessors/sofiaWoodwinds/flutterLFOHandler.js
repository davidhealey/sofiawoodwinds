Content.setWidth(600);
Content.setHeight(50);

Synth.deferCallbacks(true);

const var LFO = Synth.getModulator("flutterLFO");
const var mod = Synth.getModulator("flutterPitch");

const var knbPitch = Content.addKnob("knbPitch", 0, 0);
knbPitch.set("text", "Pitch");
knbPitch.set("middlePosition", 0);
knbPitch.setRange(-12, 12, 0.01);

const var knbIntensity = Content.addKnob("knbIntensity", 150, 0);
knbIntensity.set("text", "Intensity");
knbIntensity.setControlCallback(knbIntensityCB);

const var knbCC = Content.addKnob("knbCC", 300, 0);
knbCC.set("text", "CC");
knbCC.setRange(0, 127, 1);

const var tblCurve = Content.addTable("tblCurve", 450, 0);

inline function knbIntensityCB(control, value)
{
    LFO.setIntensity(value);
    mod.setIntensity(knbPitch.getValue()*value);
}function onNoteOn()
{
	
}
function onNoteOff()
{
	
}
function onController()
{
	if (Message.getControllerNumber() == knbCC.getValue())
    {
        knbIntensity.setValue(tblCurve.getTableValue(Message.getControllerValue()));
        knbIntensity.changed();
    }
}
function onTimer()
{
	
}
function onControl(number, value)
{
	
}
