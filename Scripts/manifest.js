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
    //Articulation program change/UACC numbers
    const var programs = [1, 2, 40];

    //Patch data
    const var patches = {
        "piccolo": //Sample map identifier
        {
	        range: [74, 105], //Playable range
	        hasFlutter: true, //Does this patch have a flutter sample map?
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:0,
                minBend:10,
                maxBend:40,
                minFade:10,
                maxFade:30
		    }
	    },
		"flute1":
		{
            range:[59, 96],
            hasFlutter: true,
            ks:[24, 25, 26],
            legatoSettings:
            {
                bendTime:-5,
                minBend:10,
                maxBend:40,
                minFade:30,
                maxFade:60
            }
		},
		"flute2":
		{
            range:[59, 96],
            hasFlutter: true,
            hasSputato: true,
            ks:[24, 25, 26],
            legatoSettings:
            {
                bendTime:-5,
                minBend:10,
                maxBend:40,
                minFade:30,
                maxFade:60
            }
		},
		"altoFlute":
		{
			range: [55, 91],
			hasFlutter: true,
			hasSputato: true,
			ks:[24, 25, 26],
			legatoSettings:
		    {
                bendTime:0,
                minBend:10,
                maxBend:50,
                minFade:40,
                maxFade:80
		    }
		},
        "oboe1":
        {
	        range: [58, 91],
	        hasFlutter: false,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:-15,
                minBend:10,
                maxBend:50,
                minFade:25,
                maxFade:50
		    }
	    },
        "oboe2":
        {
	        range: [58, 91],
	        hasFlutter: false,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:-15,
                minBend:10,
                maxBend:50,
                minFade:25,
                maxFade:50
		    }
	    },
        "englishHorn":
        {
	        range: [52, 83],
	        hasFlutter: false,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:-15,
                minBend:20,
                maxBend:60,
                minFade:25,
                maxFade:50
		    }
	    },
        "clarinet1":
        {
	        range: [50, 91],
	        hasFlutter: true,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:0,
                minBend:20,
                maxBend:50,
                minFade:40,
                maxFade:80
		    }
	    },
        "clarinet2":
        {
	        range: [50, 91],
	        hasFlutter: true,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:0,
                minBend:20,
                maxBend:50,
                minFade:40,
                maxFade:80
		    }
	    },
        "bassClarinet":
        {
	        range: [34, 75],
	        hasFlutter: true,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:-10,
                minBend:20,
                maxBend:50,
                minFade:40,
                maxFade:80
		    }
	    },
        "bassoon1":
        {
	        range: [34, 74],
	        hasFlutter: true,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:0,
                minBend:20,
                maxBend:50,
                minFade:30,
                maxFade:60
		    }
	    },
        "bassoon2":
        {
	        range: [34, 74],
	        hasFlutter: true,
	        ks:[24, 25, 26],
            legatoSettings:
		    {
                bendTime:0,
                minBend:20,
                maxBend:50,
                minFade:30,
                maxFade:60
		    }
	    },
        "contrabassoon":
        {
	        range: [22, 55],
	        hasFlutter: false,
	        ks:[96, 97, 98],
            legatoSettings:
		    {
                bendTime:-10,
                minBend:25,
                maxBend:50,
                minFade:35,
                maxFade:70
		    }
	    },
	};
	
    const var articulations = {
        "names":["legato", "sustain", "staccato"],
        "legato":{
            "muter":
            {
                "sustain":false,
                "transition":false,
                "overlay":false,
                "staccato":false,
                "flutter":false,
                "release":false
            },
            "envelope":
            {
                "live":true,
                "overlay":true
            },
            "processors":{
                "legatoBypass":false,
                "overlayFilterBypass":false,
                "releaseLegato":true
            }
        },
        "sustain":{
            "muter":
            {
                "sustain":false,
                "transition":true,
                "overlay":true,
                "staccato":true,
                "flutter":false,
                "release":false
            },
            "envelope":
            {
                "live":false,
                "overlay":false
            },
            "processors":{
                "legatoBypass":true,
                "overlayFilterBypass":true,
                "releaseLegato":false
            }
        },
        "staccato":{
            "muter":
            {
                "sustain":true,
                "transition":true,
                "overlay":false,
                "staccato":false,
                "flutter":false,
                "release":true
            },
            "envelope":
            {
                "live":false,
                "overlay":false
            },
            "processors":{
                "legatoBypass":true,
                "overlayFilterBypass":true,
                "releaseLegato":false
            },
            "releaseAttenuation":true
        }
    };
}
