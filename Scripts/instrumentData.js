namespace instData
{	
	const var allArticulations = ["sustain", "staccato", "flutter", "harmonics"];
	const var articulationDisplayNames = ["Sustain", "Staccato", "Flutter", "Harmonics"];
	reg programs = [1, 40, 50]; //UACC and Program Change numbers for articulations

	const var database = {
		altoFlute:
		{
		    displayName:"Alto Flute",
			range:[60, 90], //Maximum range of instrument
			keyswitches:[24, 25, 26, 27], //Default keyswitches (unused should be set to -1)
			legatoSettings:
		    {
                bendTime:10,
                minBend:30,
                maxBend:70,
                fadeTime:80
		    },
			articulations:
			{
				sustain:{range:[60, 90]},
				staccato:{range:[60, 90]},
				flutter:{range:[60, 90]},
				harmonics:{range:[60, 90]}
			}
		}		
	};
}