const var vibratoPitch = Synth.getModulator("vibratoPitch");
const var vibratoPitchOffset = Synth.getModulator("vibratoPitchOffset");

const var knbPitch = Content.addKnob("knbPitch", 0, 0);
knbPitch.setRange(-0.5, 0.5, 0.01);function onNoteOn()
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
    vibratoPitch.setIntensity(value);
    vibratoPitchOffset.setIntensity(-value);
}
