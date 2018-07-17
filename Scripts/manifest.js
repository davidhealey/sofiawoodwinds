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
	        range: [74, 105],
	        gain: 
            {
                noise:-37.0
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
            sampleMapId:"flute1",
            range:[60, 96],
            gain: 
            {
                noise:-38.0
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
		"Concert Flute II":
		{
            sampleMapId:"flute2",
            range:[60, 96],
	        gain: 
            {
                noise:-38.0
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
		"Alto Flute":
		{
            sampleMapId: "altoFlute",
			range: [55, 91],
			gain: 
            {
                release:-6.0,
                noise:-40.0
            },
			legatoSettings:
		    {
                bendTime:-15,
                minBend:10,
                maxBend:30,
                fadeTime:60
		    },
			vibratoSettings:
		    {
                gain:0.25,
                pitch:-0.10
		    }
		},
        "Oboe I":
        {
            sampleMapId: "oboe1", //Identifier for finding sample maps
	        range: [58, 91],
	        gain: 
            {
                release:-3.0,
                noise:-40.0
            },
            legatoSettings:
		    {
                bendTime:0,
                minBend:30,
                maxBend:60,
                fadeTime:40
		    },
			vibratoSettings:
		    {
                gain:0.35,
                pitch:-0.07
		    }
	    },
        "Oboe II":
        {
            sampleMapId: "oboe2", //Identifier for finding sample maps
	        range: [58, 91],
	        gain: 
            {
                release:-3.0,
                noise:-40.0
            },
            legatoSettings:
		    {
                bendTime:0,
                minBend:30,
                maxBend:60,
                fadeTime:40
		    },
			vibratoSettings:
		    {
                gain:0.35,
                pitch:-0.07
		    }
	    },
        "Cor Anglais":
        {
            sampleMapId: "englishHorn", //Identifier for finding sample maps
	        range: [52, 83],
	        gain: 
            {
                release:-3.0,
                noise:-35.0
            },
            legatoSettings:
		    {
                bendTime:0,
                minBend:30,
                maxBend:60,
                fadeTime:40
		    },
			vibratoSettings:
		    {
                gain:0.35,
                pitch:-0.07
		    }
	    },
        "Clarinet I":
        {
            sampleMapId: "clarinet1", //Identifier for finding sample maps
	        range: [50, 91],
	        gain: 
            {
                release:-6.0,
                noise:-45.0
            },
            legatoSettings:
		    {
                bendTime:-15,
                minBend:20,
                maxBend:40,
                fadeTime:50
		    },
			vibratoSettings:
		    {
                gain:0.30,
                pitch:-0.07
		    }
	    },
        "Clarinet II":
        {
            sampleMapId: "clarinet2", //Identifier for finding sample maps
	        range: [50, 91],
	        gain: 
            {
                release:-6.0,
                noise:-45.0
            },
            legatoSettings:
		    {
                bendTime:-15,
                minBend:20,
                maxBend:40,
                fadeTime:50
		    },
			vibratoSettings:
		    {
                gain:0.30,
                pitch:-0.07
		    }
	    },
        "Bass Clarinet":
        {
            sampleMapId: "bassClarinet", //Identifier for finding sample maps
	        range: [34, 75],
	        gain: 
            {
                release:-6.0,
                noise:-45.0
            },
            legatoSettings:
		    {
                bendTime:-15,
                minBend:20,
                maxBend:40,
                fadeTime:30
		    },
			vibratoSettings:
		    {
                gain:0.30,
                pitch:-0.07
		    }
	    },
        "Bassoon I":
        {
            sampleMapId: "bassoon1", //Identifier for finding sample maps
	        range: [34, 74],
	        gain: 
            {
                noise:-50.0
            },
            legatoSettings:
		    {
                bendTime:-15,
                minBend:25,
                maxBend:50,
                fadeTime:70
		    },
			vibratoSettings:
		    {
                gain:0.35,
                pitch:-0.08
		    }
	    },
        "Bassoon II":
        {
            sampleMapId: "bassoon2", //Identifier for finding sample maps
	        range: [34, 74],
	        gain: 
            {
                noise:-52.0
            },
            legatoSettings:
		    {
                bendTime:-15,
                minBend:25,
                maxBend:50,
                fadeTime:80
		    },
			vibratoSettings:
		    {
                gain:0.35,
                pitch:-0.08
		    }
	    },
        "Contrabassoon":
        {
            sampleMapId: "contrabassoon", //Identifier for finding sample maps
	        range: [22, 55],
	        gain:
            {
                noise:-52.0
            },
            legatoSettings:
		    {
                bendTime:-15,
                minBend:25,
                maxBend:50,
                fadeTime:80
		    },
			vibratoSettings:
		    {
                gain:0.35,
                pitch:-0.10
		    }
	    },
	};
}
