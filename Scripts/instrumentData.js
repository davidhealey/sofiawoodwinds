namespace instData
{	
	const var allArticulations = ["sustain", "legato", "staccato", "flutter", "harmonics"];
	const var articulationDisplayNames = ["Normal", "Staccato", "Fingernail", "Prés de la table", "Harmonics"];
	reg programs = [1, 40, 9, 17, 10]; //UACC and Program Change numbers for articulations

	const var database = {
		altoFlute:
		{
		    displayName:"Alto Flute",
			range:[60, 96], //Maximum range of instrument
			keyswitches:[24, 25, 26, 27, 28], //Default keyswitches (unused should be set to -1)
			articulations:
			{
				normal:{range:[60, 96]},
				staccato:{range:[60, 96]},
				fingernail:{range:[60, 96]},
				table:{range:[60, 96]},
				harmonics:{range:[60, 88]}
			}
		}		
	};
}