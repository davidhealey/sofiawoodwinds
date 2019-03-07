const var transitions = Synth.getChildSynth("transitions");

const var knbGain = Content.addKnob("knbGain", 0, 0);
knbGain.set("mode", "Decibel");
knbGain.setControlCallback(onknbGainControl);

inline function onknbGainControl(control, value)
{
    transitions.setAttribute(transitions.Gain, Engine.getGainFactorForDecibels(value));
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
