/*
Copyright 2018, 2019 David Healey

This file is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

include("manifest.js");

//Reference to main interface script
const var Interface = Synth.getMidiProcessor("Interface");

//Get array of patch names from manifest
const var patchNames = [];
for (k in Manifest.patches)
{
    patchNames.push(k);
}
    
//Articulation trackers
reg current = -1; //Currently selected articulation
reg last = -1; //The previous articulation
    
//Midi Processors
const var legatoHandler = Synth.getMidiProcessor("legato"); //Legato handler
const var overlayVelocityFilter = Synth.getMidiProcessor("overlayVelocityFilter");
const var releaseHandler = Synth.getMidiProcessor("releaseHandler");

//Muters
const var muter = {};
muter.transition = Synth.getMidiProcessor("transitionMuter");
muter.staccato = Synth.getMidiProcessor("staccatoMuter");
muter.sustain = Synth.getMidiProcessor("sustainMuter");
muter.overlay = Synth.getMidiProcessor("overlayMuter");
muter.flutter = Synth.getMidiProcessor("flutterMidiMuter");
muter.release = Synth.getMidiProcessor("releaseMidiMuter");

//Envelopes
const var envelope = {}
envelope.sustain = Synth.getModulator("sustainEnvelope");
envelope.staccato = Synth.getModulator("staccatoEnvelope");
    
//Modulators
const var liveEnvelopeVelocity = Synth.getModulator("liveEnvelopeVelocity");
    
inline function getKSIndex(note)
{
    local patch = patchNames[Interface.getAttribute(Interface.cmbPatch)];
    return Manifest.patches[patch].ks.indexOf(Message.getNoteNumber());
}
    
//Functions    
inline function changeArticulation(index)
{
    if (index !== Articulations.current && index < Manifest.articulations.names.length)
    {
        local name = Manifest.articulations.names[index];
        local values = Manifest.articulations[name];
                       
        //Set midi muters
        muter.sustain.setAttribute(muter.sustain.ignoreButton, values.muter.sustain);
        muter.transition.setAttribute(muter.transition.ignoreButton, values.muter.transition);
        muter.overlay.setAttribute(muter.overlay.ignoreButton, values.muter.overlay);
        muter.staccato.setAttribute(muter.staccato.ignoreButton, values.muter.staccato);
        muter.flutter.setAttribute(muter.flutter.ignoreButton, values.muter.flutter);
            
        //Update performance handler scripts
        legatoHandler.setAttribute(legatoHandler.btnMute, values.processors.legatoBypass);
        overlayVelocityFilter.setBypassed(values.processors.overlayFilterBypass);
        releaseHandler.setAttribute(releaseHandler.Attenuate, values.releaseAttenuation || false);
            
        //Specific articulation settings
        if (name == "legato")
        {                
            //Live/Sustain envelope
            envelope.sustain.setAttribute(envelope.sustain.Attack, Interface.getAttribute(Interface.knbLegAtk));
            envelope.sustain.setAttribute(envelope.sustain.Release, Interface.getAttribute(Interface.knbLiveRelease));
            liveEnvelopeVelocity.setBypassed(false);
                
            //Overlay/staccato envelope
            envelope.staccato.asTableProcessor().reset(0);
            envelope.staccato.setAttribute(envelope.staccato.Attack, 200);            
            envelope.staccato.asTableProcessor().setTablePoint(0, 0, 0, 0, 0.5);
            envelope.staccato.asTableProcessor().setTablePoint(0, 1, 1, 0, 0.4);
            envelope.staccato.asTableProcessor().addTablePoint(0, 0.03, 1);
                
            //Release trigger
            releaseHandler.setAttribute(releaseHandler.btnLegato, true);
        }
        else
        {
            //Live/Sustain envelope
            liveEnvelopeVelocity.setBypassed(true);
            envelope.sustain.setAttribute(envelope.sustain.Attack, Interface.getAttribute(Interface.knbSusAttack));
            envelope.sustain.setAttribute(envelope.sustain.Release, Interface.getAttribute(Interface.knbSusRelease));
                
            //Overlay/staccato envelope
            envelope.staccato.asTableProcessor().reset(0);
            envelope.staccato.setAttribute(envelope.staccato.Attack, 2);
                
            //Release trigger
            releaseHandler.setAttribute(releaseHandler.btnLegato, false);           
        }
                   
        last = current;
        current = index;
    }
}

//Set initial articulation
changeArticulation(0);function onNoteOn()
{
    local idx = getKSIndex(Message.getNoteNumber());
    
    if (idx != -1)
    {
	    changeArticulation(idx);
	    Message.ignoreEvent(true);
    }
}function onNoteOff()
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
 