//Modulators
const var staccatoVelocityFilter = Synth.getMidiProcessor("staccatoVelocityFilter");
const var sustainEnvelopeVelocity = Synth.getModulator("sustainEnvelopeVelocity");

const var knbThreshold = Content.addKnob("knbTheshold", 0, 0);
knbThreshold.setRange(25, 127, 1);
knbThreshold.setControlCallback(onknbThresholdControl);

inline function onknbThresholdControl(control, value)
{
    staccatoVelocityFilter.setAttribute(0, value);
    sustainEnvelopeVelocity.asTableProcessor().setTablePoint(0, 2, (value-1)/127, 0.01, 0);
    sustainEnvelopeVelocity.asTableProcessor().setTablePoint(0, 3, value/127, 1, 0);
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
