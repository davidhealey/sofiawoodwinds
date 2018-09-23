
const var preloadBar = Content.getComponent("preloadBar");
preloadBar.setPaintRoutine(function(g)
{
	g.fillAll(0xFF262626);
	
	g.setColour(0x11FFFFFF);
	g.fillRect([0, 0, this.getWidth() * this.data.progress, this.getHeight()]);
	
	g.setColour(Colours.white);
	g.setFont("Oxygen Bold", 14.0);
	g.drawAlignedText("Preloading...", [0, 0, this.getWidth(), this.getHeight()], "centred");
});

preloadBar.setTimerCallback(function()
{
	this.data.progress = Engine.getPreloadProgress();
	this.repaint();
	
});

preloadBar.setLoadingCallback(function(isPreloading)
{
    this.data.progress = 0.0;
    this.set("visible", isPreloading);
    
	if(isPreloading)
        this.startTimer(30);
    else
        this.stopTimer();
});