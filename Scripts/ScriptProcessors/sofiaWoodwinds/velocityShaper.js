Content.setWidth(600);
Content.setHeight(100);

const var dynamicsCC = Synth.getModulator("dynamicsCC");

const var btnDynamics = Content.addButton("btnDynamics", 0, 10);
btnDynamics.set("text", "Vel = Dynamics");

const tblVel = Content.addTable("tblVel", 150, 0);
tblVel.set("height", 95);
tblVel.set("width", 200);
tblVel.connectToOtherTable("Velocity Modulator", 0);function onNoteOn()
{
	Message.setVelocity(Math.max(1, 127 * tblVel.getTableValue(Message.getVelocity()))); //Scale velocity using table
	
	//Send velocity to dynamics CC if button enabled
	if (btnDynamics.getValue())
    {
        dynamicsCC.setAttribute(dynamicsCC.DefaultValue, Message.getVelocity());
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
 