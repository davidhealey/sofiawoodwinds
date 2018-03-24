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
	const var allArticulations = ["sustain", "staccato", "flutter", "harmonics", "glide"]; //Global articulation list, available to all instruments
	const var programs = [1, 2, 3, 40, 50, 60, 70]; //UACC and Program Change numbers for articulations
    
	const var database = {
		"Alto Flute":
		{
		    sampleMapId:"altoFlute", //Identifier for finding sample maps
		    keyswitches:[24, 25, 26, 27, 28],
			range:[55, 91], //Maximum range of instrument
			articulations:
			{
				sustain:{displayName:"Sustain", range:[55, 91], attack:5, release:350},
				staccato:{displayName:"Staccato", range:[55, 91], attack:5, release:350},
				flutter:{displayName:"Flutter", range:[55, 91], attack:5, release:350},
				harmonics:{displayName:"Harmonics", range:[55, 91], attack:5, release:350},
				glide:{displayName:"Glide", parent:"sustain", range:[55, 91]}
			},
			legatoSettings:
		    {
                bendTime:-15,
                minBend:5,
                maxBend:30,
                fadeTime:60
		    },
			vibratoSettings:
		    {
                gain:0.25,
                pitch:-0.10
		    }
		},
		"Concert Flute I":
		{
		    sampleMapId:"flute1", //Identifier for finding sample maps
		    keyswitches:[24, 25, 26, 28],
			range:[60, 96], //Maximum range of instrument
			articulations:
			{
				sustain:{displayName:"Sustain", range:[60, 96], attack:5, release:350},
				staccato:{displayName:"Staccato", range:[60, 96], attack:5, release:350},
				flutter:{displayName:"Flutter", range:[60, 96], attack:5, release:350},
				glide:{displayName:"Glide", parent:"sustain", range:[60, 96]}
			},
			legatoSettings:
		    {
                bendTime:-15,
                minBend:5,
                maxBend:30,
                fadeTime:60
		    },
			vibratoSettings:
		    {
                gain:0.25,
                pitch:-0.10
		    }
		}
	};
}
