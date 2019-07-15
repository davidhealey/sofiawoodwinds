const var Bypass = Content.addButton("Bypass", 10, 10);

const var mods = [];
mods[0] = Synth.getModulator("randomGain");
mods[1] = Synth.getModulator("randomPitch");
mods[2] = Synth.getEffect("randomFilter");
mods[3] = Synth.getModulator("randomXF");function onNoteOn()
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
	for (i = 0; i < mods.length; i++)
    {
        mods[i].setBypassed(value);
    }
}
 