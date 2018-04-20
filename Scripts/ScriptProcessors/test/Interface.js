Content.makeFrontInterface(600, 500);

const var p = Content.getComponent("Panel1");

p.setPaintRoutine(function(g){
    
    g.fillAll(0xFF333333);
    
    g.setColour(0xFF003300);
    
    g.fillRect([0, 0, this.getWidth()-this.get("max"), this.getHeight()]);
    
});function onNoteOn()
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
