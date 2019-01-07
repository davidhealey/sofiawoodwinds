//License - public domain

const var vibratoPitch = Synth.getModulator("vibratoPitch");
const var vibratoIntensity = Synth.getModulator("vibratoIntensity");

const var knbPitch = Content.addKnob("knbPitch", 0, 0);
knbPitch.set("text", "Vibrato Pitch");
knbPitch.setRange(-0.5, 0.5, 0.01);
knbPitch.setControlCallback(knbPitchCB);

inline function knbPitchCB(control, value)
{
    vibratoPitch.setIntensity(value);
    vibratoIntensity.setIntensity(-value);
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
