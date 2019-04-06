const var knbLow = Content.addKnob("knbLow", 0, 0);
knbLow.setRange(0, 127, 1);
knbLow.set("text", "Low Note");

const var knbHigh = Content.addKnob("knbHigh", 150, 0);
knbHigh.setRange(0, 127, 1);
knbHigh.set("text", "High Note");function onNoteOn()
{
	if (Message.getNoteNumber() < knbLow.getValue() || Message.getNoteNumber() > knbHigh.getValue())
	    Message.ignoreEvent(true);
}
function onNoteOff()
{
    if (Message.getNoteNumber() < knbLow.getValue() || Message.getNoteNumber() > knbHigh.getValue())
	    Message.ignoreEvent(true);
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
