namespace instData
{	
	const var allArticulations = ["sustain", "meta_legato", "meta_glide", "staccato", "flutter", "harmonics"];
	const var articulationDisplayNames = ["Sustain", "Legato", "Glide", "Staccato", "Flutter", "Harmonics"];
	reg programs = [1, 40, 50, 60, 70]; //UACC and Program Change numbers for articulations

	const var database = {
		altoFlute:
		{
		    displayName:"Alto Flute",
			range:[60, 90], //Maximum range of instrument
			keyswitches:[24, 25, 26, 27, 29, 30], //Default keyswitches (unused should be set to -1)
			articulations:
			{
				sustain:{range:[60, 90]},
				meta_legato:{parent:"sustain", range:[60, 90]},
				meta_glide:{parent:"sustain", range:[60, 90]},
				staccato:{range:[60, 90]},
				flutter:{range:[60, 90]},
				harmonics:{range:[60, 90]}
			},
			legatoSettings:
		    {
                bendTime:10,
                minBend:30,
                maxBend:70,
                fadeTime:80
		    }
		}		
	};
}