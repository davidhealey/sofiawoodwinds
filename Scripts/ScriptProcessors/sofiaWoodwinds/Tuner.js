const var knbFine = Content.addKnob("knbFine", 0, 0);
knbFine.set("text", "Fine Tune");
knbFine.setRange(-100, 100, 1);

const var knbCoarse = Content.addKnob("knbCoarse", 150, 0);
knbCoarse.set("text", "Coarse Tune");
knbCoarse.setRange(-12, 12, 1);
function onNoteOn()
{
	Message.setFineDetune(knbFine.getValue());
	Message.setCoarseDetune(knbCoarse.getValue());
}
function onNoteOff()
{
    Message.setFineDetune(knbFine.getValue());
	Message.setCoarseDetune(knbCoarse.getValue());
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
