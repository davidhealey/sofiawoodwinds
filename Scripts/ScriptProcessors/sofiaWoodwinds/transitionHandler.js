reg currentNote; //The note that is currently pressed
reg lastNote = -1; //The last note that was pressed
reg retriggerNote = -1;
reg eventId;

//Gain contant modulator
const var transitionGain = Synth.getModulator("transitionGain");

const var knbGain = Content.addKnob("knbGain", 0, 0);
knbGain.set("text", "Gain");
knbGain.set("mode", "Decibel");
knbGain.setControlCallback(knbGainCB);

inline function knbGainCB(control, value)
{
    transitionGain.setIntensity(1-Engine.getGainFactorForDecibels(value));
}function onNoteOn()
{    
    currentNote = Message.getNoteNumber();
    
	if (Synth.isLegatoInterval() && !Synth.isSustainPedalDown())
    {
        Message.setNoteNumber(lastNote);
        Message.setVelocity(90);
        retriggerNote = lastNote;
    }
    else
    {
        Message.ignoreEvent(true);
        retriggerNote = -1;
    }
    
    lastNote = currentNote;
}
function onNoteOff()
{    
    if (Message.getNoteNumber() == retriggerNote)
    {
        retriggerNote = -1;
    }
    
    if (Message.getNoteNumber() == lastNote && retriggerNote != -1)
    {
        eventId = Synth.playNote(lastNote, 90);
        Synth.addPitchFade(eventId, 0, Message.getCoarseDetune(), Message.getFineDetune());
        
        lastNote = retriggerNote;
    }
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
