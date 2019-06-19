const var flutterCC = Synth.getModulator("flutterCC");
const var flutterMidiMuter = Synth.getMidiProcessor("flutterMidiMuter");
const var sustainFlutterGain = Synth.getModulator("sustainFlutterGain");

const var knbFlutter = Content.addKnob("knbFlutter", 0, 0);
knbFlutter.setRange(0, 127, 1);function onNoteOn()
{
	if (knbFlutter.getValue() < 5)
    {
        flutterMidiMuter.setAttribute(flutterMidiMuter.ignoreButton, true);
        sustainFlutterGain.setIntensity(0);
    }
    else
    {
        flutterMidiMuter.setAttribute(flutterMidiMuter.ignoreButton, false);
        sustainFlutterGain.setIntensity(1);
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
    flutterCC.setAttribute(flutterCC.DefaultValue, value);
}