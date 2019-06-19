const var btnEnabled = Content.addButton("btnEnabled", 10, 10);
btnEnabled.set("text", "Enabled");

const var btnSputato = Content.addButton("btnSputato", 160, 10);
btnSputato.set("text", "Sputato");function onNoteOn()
{    
	if (btnSputato.getValue() && Message.getVelocity() > 100)
	    Message.setVelocity(11);
	else
    {
        if (btnEnabled.getValue())
            Message.setVelocity(Math.randInt(1, 6));
        else
            Message.setVelocity(1);       
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
 