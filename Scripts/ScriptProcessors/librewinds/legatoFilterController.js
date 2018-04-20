Content.setWidth(600);
Content.setHeight(50);

const var env = Synth.getModulator("legatoFilterEnvelope");
const var intensity = Content.addKnob("Intensity", 0, 0);function onNoteOn()
{
	if (Synth.isLegatoInterval())
    {
        env.setIntensity(intensity.getValue());
    }
    else
    {
        env.setIntensity(0);
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
