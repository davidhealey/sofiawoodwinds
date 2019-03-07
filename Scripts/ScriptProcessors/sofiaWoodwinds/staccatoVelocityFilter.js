const var knbThreshold = Content.addKnob("knbTheshold", 0, 0);
knbThreshold.setRange(1, 127, 1);function onNoteOn()
{
	if (Message.getVelocity() < knbThreshold.getValue())
    {
        Message.ignoreEvent(true);
    }
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
