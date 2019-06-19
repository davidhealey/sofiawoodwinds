const var knbThreshold = Content.addKnob("knbTheshold", 0, 0);
knbThreshold.setRange(1, 127, 1);function onNoteOn()
{
	if (Message.getVelocity() < knbThreshold.getValue() || (Synth.isSustainPedalDown() && Synth.isLegatoInterval()))
    {
        Message.ignoreEvent(true);
    }
}
function onNoteOff()
{
	if (Message.getVelocity() < knbThreshold.getValue())
    {
        Message.ignoreEvent(true);
    }
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
 