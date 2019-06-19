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

namespace Articulations
{    
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
    
    //Synths/Samplers
    const var release = Synth.getChildSynth("release");
    
    //GUI
    
    //Articulation envelope controls
    const var knbLiveRelease = Content.getComponent("knbLiveRelease");
    const var knbSusRelease = Content.getComponent("knbSusRelease");
    const var knbSusAttack = Content.getComponent("knbSusAttack");
    const var knbLegAtk = Content.getComponent("knbLegAtk");
    
    //Articulations panel
    const var pnlArticulations = Content.getComponent("pnlArticulations");
    pnlArticulations.setPaintRoutine(function(g)
    {
        reg text = ["Live", "Sustain", "Staccato", "Releases"];
          
        for (i = 0; i < text.length; i++) 
        {
            //Paint background
            if (i == Articulations.current)
                g.setColour(0xFFDED7CA);
            else
                g.setColour(0xFFCEC9BD);
            
            g.fillRoundedRectangle([0, i*55, 316, 50], 5.0);
        
            //Draw text
            g.setColour(0xFF000000);
            g.setFont("Asap-SemiBold", 18);
            g.drawAlignedText(text[i], [10, i*55, 316, 50], "left");
        }
    
        //Set panel height
        this.set("height", i*55);
        this.data.numRows = i;
    });
    
    pnlArticulations.setMouseCallback(function(event)
    {
        if (event.clicked)
        {
            var value = parseInt(event.y / this.getHeight() * this.data.numRows);
            Articulations.changeArticulation(value);
        }
    });
    
    //Release sampler purge button
    inline function onbtnRelPurgeControl(component, value)
    {
        release.setAttribute(release.Purged, 1-value);
    };

    Content.getComponent("btnRelPurge").setControlCallback(onbtnRelPurgeControl);
    
    
    //Functions
    inline function getKSIndex(patchName, note)
    {
        local ks = Manifest.patches[patchName].ks;
        return ks.indexOf(note);
    }
    
    inline function changeArticulation(index)
    {
        if (index !== Articulations.current && index < Manifest.articulations.names.length)
        {
            local name = Manifest.articulations.names[index];
            local values = Manifest.articulations[name];           
            
            muter.sustain.setAttribute(muter.sustain.ignoreButton, values.muter.sustain);
            muter.transition.setAttribute(muter.transition.ignoreButton, values.muter.transition);
            muter.overlay.setAttribute(muter.overlay.ignoreButton, values.muter.overlay);
            muter.staccato.setAttribute(muter.staccato.ignoreButton, values.muter.staccato);
            muter.flutter.setAttribute(muter.flutter.ignoreButton, values.muter.flutter);
            legatoHandler.setAttribute(legatoHandler.btnMute, values.processors.legatoBypass);
            overlayVelocityFilter.setBypassed(values.processors.overlayFilterBypass);
            releaseHandler.setAttribute(releaseHandler.Attenuate, values.releaseAttenuation || false);
            
            //Specific articulation settings
            /*if (name == "legato")
            {                
                //Live/Sustain envelope
                envelope.sustain.setAttribute(envelope.sustain.Attack, knbLegAtk.getValue());
                envelope.sustain.setAttribute(envelope.sustain.Release, knbLiveRelease.getValue());
                knbLiveRelease.set("enabled", true);
                knbSusRelease.set("enabled", false);
                knbSusAttack.set("enabled", false);
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
                envelope.sustain.setAttribute(envelope.sustain.Attack, knbSusAttack.getValue());
                envelope.sustain.setAttribute(envelope.sustain.Release, knbSusRelease.getValue());
                knbLiveRelease.set("enabled", false);
                knbSusRelease.set("enabled", true);
                knbSusAttack.set("enabled", true);
                
                //Overlay/staccato envelope
                envelope.staccato.asTableProcessor().reset(0);
                envelope.staccato.setAttribute(envelope.staccato.Attack, 2);
                
                //Release trigger
                releaseHandler.setAttribute(releaseHandler.btnLegato, false);                
            }*/
                   
            Articulations.last = Articulations.current;
            Articulations.current = index;
            pnlArticulations.repaint();
        }
    }

    Articulations.changeArticulation(0);
}