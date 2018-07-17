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

namespace Manifest
{
    //Articulations available to all patches - but not all patches have to use them
	const var allArticulations = ["sustain", "staccato", "harmonics", "glide"];

	//UACC and Program Change numbers for articulations
	const var programs = [1, 2, 3, 40, 50, 60, 70];

    const var patches = {
        "Piccolo":
        {
            sampleMapId: "piccolo", //Identifier for finding sample maps
	        range: [74, 103],
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
            sampleMapId:"flute1",
            range:[60, 96],
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
		"Alto Flute":
		{
            sampleMapId: "altoFlute",
			range: [55, 91],
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
	};
}
