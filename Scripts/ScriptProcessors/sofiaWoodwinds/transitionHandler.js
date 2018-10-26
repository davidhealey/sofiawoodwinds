reg currentNote; //The note that is currently pressed
reg lastNote = -1; //The last note that was pressed
reg retriggerNote = -1;function onNoteOn()
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
        Synth.playNote(lastNote, 90);
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
