namespace instData
{	
	const var allArticulations = ["sustain", "meta_legato", "meta_glide", "staccato", "flutter", "harmonics"]; //Global articulation list, available to all instruments
	reg programs = [1, 40, 50, 60, 70]; //UACC and Program Change numbers for articulations

	const var database = {
		altoFlute:
		{
		    displayName:"Alto Flute",
			range:[55, 91], //Maximum range of instrument
			keyswitches:[24, 25, 26, 27, 29, 30], //Default keyswitches (unused should be set to -1)
			articulations:
			{
				sustain:{displayName:"Sustain", range:[55, 91], attack:5, release:250},
				meta_legato:{displayName:"Legato", parent:"sustain", range:[55, 91]},
				meta_glide:{displayName:"Glide", parent:"sustain", range:[55, 91]},
				staccato:{displayName:"Staccato", range:[55, 91], attack:5, release:250},
				flutter:{displayName:"Flutter", range:[55, 91], attack:5, release:250},
				harmonics:{displayName:"Harmonics", range:[55, 91], attack:5, release:250}
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
                gain:0.25,
                pitch:0.15,
                eqFreq:650,
                eqGain:6
		    }
		}		
	};
}