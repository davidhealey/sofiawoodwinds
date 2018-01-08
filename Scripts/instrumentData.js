namespace instData
{	
	const var allArticulations = ["sustain", "meta_legato", "meta_glide", "staccato", "flutter", "harmonics"]; //Global articulation list, available to all instruments
	const var articulationDisplayNames = ["Sustain", "Legato", "Glide", "Staccato", "Flutter", "Harmonics"];
	reg programs = [1, 40, 50, 60, 70]; //UACC and Program Change numbers for articulations

	const var database = {
		altoFlute:
		{
		    displayName:"Alto Flute",
			range:[55, 91], //Maximum range of instrument
			keyswitches:[24, 25, 26, 27, 29, 30], //Default keyswitches (unused should be set to -1)
			articulations:
			{
				sustain:{range:[55, 91]},
				meta_legato:{parent:"sustain", range:[55, 91]},
				meta_glide:{parent:"sustain", range:[55, 91]},
				staccato:{range:[55, 91]},
				flutter:{range:[55, 91]},
				harmonics:{range:[55, 91]}
			},
			legatoSettings:
		    {
                bendTime:0,
                minBend:20,
                maxBend:50,
                fadeTime:60
		    },
			vibratoSettings:
		    {
                gain:0.35,
                pitch:0.25
		    }
		}		
	};
}