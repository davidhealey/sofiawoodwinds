const mod = Synth.getModulator("Constant");function onNoteOn()
{
	if (Synth.isLegatoInterval())
    {
        mod.setBypassed(true);
    }
    else
    {
        mod.setBypassed(false);
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
