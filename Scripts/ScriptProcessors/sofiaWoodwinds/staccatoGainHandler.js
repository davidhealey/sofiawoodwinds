const var release = Synth.getChildSynth("staccato");

const var knbGain = Content.addKnob("knbGain", 0, 0);
knbGain.set("text", "Gain");
knbGain.set("mode", "Decibel");
knbGain.setControlCallback(knbGainCB);

inline function knbGainCB(control, value)
{
    release.setAttribute(release.Gain, Engine.getGainFactorForDecibels(value));
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
