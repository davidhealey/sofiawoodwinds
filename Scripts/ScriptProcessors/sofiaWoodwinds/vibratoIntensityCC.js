//Helper script to set the CC Number of global LFO intensity CC modulators

const var mods = [];
mods[0] = Synth.getModulator("vibratoLFOIntensityCC");
mods[1] = Synth.getModulator("vibratoIntensity");

const var vibratoIntensity = Synth.getModulator("vibratoIntensity");

const var knbCC = Content.addKnob("knbCC", 0, 0);
knbCC.set("text", "Intensity CC");
knbCC.setRange(1, 127, 1);
knbCC.setControlCallback(knbCCCB);

inline function knbCCCB(control, value)
{
    local i;
    
    for (i = 0; i < mods.length; i++)
    {
        mods[i].setAttribute(mods[i].ControllerNumber, value);
    }
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
