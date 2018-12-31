const var staccato = Synth.getChildSynth("staccato");
const var velocityMod0 = Synth.getModulator("sustainVelocityAttackMod0");
const var velocityMod1 = Synth.getModulator("sustainVelocityAttackMod1");

const var Overlay = Content.addButton("Overlay", 0, 0);
Overlay.setControlCallback(overlayCB);

inline function overlayCB(control, value)
{
    staccato.setBypassed(1-value);
    velocityMod0.setBypassed(1-value);
    velocityMod1.setBypassed(value);
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
