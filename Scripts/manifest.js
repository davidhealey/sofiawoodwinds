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
	const var allArticulations = ["sustain", "staccato", "sputato", "flutter", "harmonics", "glide"];

	//UACC and Program Change numbers for articulations
	const var programs = [1, 2, 3, 40, 50, 60, 70];

	const var patches = {
		"Alto Flute":
		{
		  sampleMapId: "altoFlute", //Identifier for finding sample maps
		  keyswitches: [24, 25, 26, 27, 28, 29],
			maxRange: [55, 91], //Maximum range of instrument
			articulations: ["sustain", "staccato", "sputato", "flutter", "harmonics", "glide"], //Articulations used by the instrument
			displayNames: ["Sustain", "Staccato", "Sputato", "Flutter", "Harmonics", "Glide"], //Articulations display names
			ranges: {sustain:[55, 91], staccato:[55, 91], sputato:[55, 91], flutter:[55, 91], harmonics:[55, 91], glide:[55, 91]},
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
	    keyswitches:[24, 25, 26],
			maxRange:[60, 96], //Maximum range of instrument
			articulations: ["sustain", "staccato", "flutter", "glide"],
			displayNames: ["Sustain", "Staccato", "Flutter", "Glide"],
			ranges: {sustain:[60, 96], staccato:[60, 96], flutter:[60, 96], glide:[60, 96]},
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
