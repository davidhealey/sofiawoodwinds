reg ccValue = 0;

const var knbCC = Content.addKnob("knbCC", 0, 0);
knbCC.set("text", "CC");
knbCC.setRange(1, 127, 1);function onNoteOn()
{
    if (ccValue < 2)
    {
        Message.ignoreEvent(true);
    }
}
function onNoteOff()
{
	
}
function onController()
{
	if (Message.getControllerNumber() == knbCC.getValue())
    {
        ccValue = Message.getControllerValue();
    }
}
function onTimer()
{
	
}
function onControl(number, value)
{
	
}
