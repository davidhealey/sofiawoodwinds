Synth.deferCallbacks(true);

const var flutterCC = Synth.getModulator("flutterCC"); //Global modulator
const var flutterMuter = Synth.getMidiProcessor("flutterMidiMuter"); //Midi muterfunction onNoteOn()
{
	
}
function onNoteOff()
{
	
}
function onController()
{
    //If the flutter CC is less than 5 mute the flutter sampler.
	if (Message.getControllerNumber() == flutterCC.getAttribute(2))
    {
        flutterMuter.setAttribute(0, Message.getControllerValue() < 5);
    }
}
function onTimer()
{
	
}
function onControl(number, value)
{
	
}
