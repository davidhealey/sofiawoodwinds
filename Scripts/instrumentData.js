/*
    Copyright 2018 David Healey

    This file is part of Libre Winds.

    Libre Winds is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Libre Winds is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Libre Winds. If not, see <http://www.gnu.org/licenses/>.
*/

namespace instData
{	
	const var allArticulations = ["sustain", "meta_legato", "meta_glide", "staccato", "sputato", "flutter", "harmonics"]; //Global articulation list, available to all instruments
	reg programs = [1, 2, 3, 40, 50, 60, 70]; //UACC and Program Change numbers for articulations
    reg keyswitches = [];
	
	const var database = {
		altoFlute:
		{
		    displayName:"Alto Flute",
			range:[55, 91], //Maximum range of instrument
			articulations:
			{
				sustain:{displayName:"Sustain", range:[55, 91], attack:5, release:250},
				meta_legato:{displayName:"Legato", parent:"sustain", range:[55, 91]},
				meta_glide:{displayName:"Glide", parent:"sustain", range:[55, 91]},
				staccato:{displayName:"Staccato", range:[55, 91], attack:5, release:250},
				sputato:{displayName:"Sputato", range:[55, 91], attack:5, release:250},
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