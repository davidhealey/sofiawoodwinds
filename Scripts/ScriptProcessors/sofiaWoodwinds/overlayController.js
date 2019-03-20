//Modulators
const var overlayVelocityFilter = Synth.getMidiProcessor("overlayVelocityFilter");
const var liveEnvelopeVelocity = Synth.getModulator("liveEnvelopeVelocity");

const var knbThreshold = Content.addKnob("knbTheshold", 0, 0);
knbThreshold.setRange(25, 127, 1);
knbThreshold.setControlCallback(onknbThresholdControl);

inline function onknbThresholdControl(control, value)
{
    overlayVelocityFilter.setAttribute(0, value);
    liveEnvelopeVelocity.asTableProcessor().setTablePoint(0, 2, (value-1)/127, 0.01, 0);
    liveEnvelopeVelocity.asTableProcessor().setTablePoint(0, 3, value/127, 1, 0);
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
