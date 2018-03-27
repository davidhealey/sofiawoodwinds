/*
    Copyright 2018 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

namespace Theme
{
    Engine.loadFontAs("{PROJECT_FOLDER}Fonts/Sarala-Regular.ttf", "Sarala-Regular");
    Engine.loadFontAs("{PROJECT_FOLDER}Fonts/Sarala-Bold.ttf", "Sarala-Bold");

	const var BLACK = 0xFF000000;
	const var WHITE = 0xFFFFFFFF;
	const var HEADER = 0xFF1C2A39;
	const var LOGO = 0xFFEEEEEE;
	const var PRESET = 0xFF5C6A79;
	const var BODY = 0xFFBDBDBD;
	const var ZONE = 0xFFEEEEEE;
	const var ZONE_FONT = "Sarala-Bold";
	const var ZONE_FONT_SIZE = 26;
	const var CONTROL1 = 0xFF9E9E9E;
	const var CONTROL2 = 0xFF5C6A79;
	const var CONTROL_TEXT = 0xFFFFFFFF;
	const var CONTROL_FONT = "Sarala-Regular";
	const var CONTROL_FONT_SIZE = 20;
	const var LABEL_TEXT = 0xFF000000;
	const var LABEL_FONT = "Sarala-Regular";
	const var LABEL_FONT_SIZE = 23;
}