/** External Script File paintRoutines */

namespace paintRoutines
{
	const var verticalFader = function(g)
	{					
		//Background
		g.setColour(0xFFBBBBBB); //Light grey
		g.fillRect([0, 0, this.get("width"), this.get("height")]);
		
		//Height of slider based on its current normalized value
		var height = this.get("height") * ui.getNormalizedValue(this);
		
		g.setColour(0xFF333333);  //Dark Grey
		g.fillRect([0, this.get("height"), this.get("width"), -height]);
	};
	
	const var horizontalFader = function(g)
	{
		//Background
		g.setColour(0xFFBBBBBB); //Light grey
		g.fillRect([0, 0, this.get("width"), this.get("height")]);
		
		//Width of slider based on its current normalized value
		reg width = this.get("width") * ui.getNormalizedValue(this);
		
		g.setColour(0xFF333333);  //Dark Grey
		g.fillRect([0, 0, width, this.get("height")]);
	}
	
	const var panFader = function(g)
	{
		//Background
		g.setColour(0xFFBBBBBB); //Light grey
		g.drawLine(0, this.get("width"), this.get("height")/2, this.get("height")/2, 3);

		//X position of slider based on its current normalized value
		var xPos = (this.get("width")-4) * ui.getNormalizedValue(this);
		
		g.setColour(0xFF333333);  //Dark Grey
		g.fillRect([xPos, 1, 4, 8]);
	};
	
	const var textButton = function(g)
	{					
		this.getValue() == 0  ? g.setColour(0x90000000) : g.setColour(0xFF000000);

		g.setFont("Arial", 14);
		g.drawAlignedText(this.get("text"), [0, 0, this.get("width"), this.get("height")], "centred");		
	};
	
	const var dropDown = function(g)
	{
		g.setColour(0xFFBBBBBB); //Light grey
		g.drawRect([0, 0, this.get("width"), this.get("height")], 2);
		
		g.setColour(0xFF333333); //Dark Grey
		g.fillTriangle([this.get("width")-18, 9, 10, 8], Math.toRadians(900));
		
		g.setFont("Arial", 14);
		g.setColour(0xFF000000); //Black
	
		reg text;
		this.getValue()-1 == -1 ? text = this.data.text : text = this.data.items[this.getValue()-1];
		
		g.drawAlignedText(text, [10, 0, 80, 25], "left");
	}
}

const var comboBoxPaint = function(g)
{
	g.setColour(0xFF333333); //Dark Grey
	g.fillRoundedRectangle([77, 0, 24, 20], 3);
		
	g.setColour(0xFFAAA591);
	g.fillRoundedRectangle([0, 0, 80, 20], 3);
		
	this.get("enabled") == true ? g.setColour(0xFF994C46) : g.setColour(0xA0994C46);
	g.fillEllipse([87, 7, 6, 6]);
		
	this.get("enabled") == true ? g.setColour(0xFF000000) : g.setColour(0xA0000000);
	g.setFont("Arial", 14);
	
	if (this.getValue()-1 == -1)
	{
		g.drawAlignedText(this.data.text, [4, 2, 80, 15], "left");
	}
	else
	{
		g.drawAlignedText(this.data.items[this.getValue()-1], [4, 2, 80, 15], "left");
	}
};

const var backgroundPaint = function(g)
{
	//Main background gradient
	g.setGradientFill([0xffd4d2bd, 325, 80, 0xff3d1a13, 325, 250]);
	g.fillRect([0, 0, 650, 275]);
	
	//Fins
	g.setColour(0x80a79e7d);
	g.fillRoundedRectangle([2, 2, 75, 8], 3);
	g.fillRoundedRectangle([2, 12, 65, 8], 3);
	g.fillRoundedRectangle([2, 22, 55, 8], 3);
	g.fillRoundedRectangle([2, 32, 45, 8], 3);

	g.fillRoundedRectangle([650-77, 2, 75, 8], 3);
	g.fillRoundedRectangle([650-67, 12, 65, 8], 3);
	g.fillRoundedRectangle([650-57, 22, 55, 8], 3);
	g.fillRoundedRectangle([650-47, 32, 45, 8], 3);
	
	//Inner panel drop shadow
	g.drawDropShadow([15, 55, 620, 185], 0xFF000000, 15);
	
	//Inner panel
	g.setColour(0xffe7e5d9);
	g.fillRect([15, 50, 620, 185]);
};

const var buttonPaint = function(g)
{	
	if (this.getValue() == 0)
	{
		g.setColour(0xFFAAA591); //Beige
		g.fillRoundedRectangle([0, 0, 40, 20], 2);

		g.setColour(0xff333333); //Dark grey
		g.fillRoundedRectangle([0, 0, 20, 20], 2);
	}
	else 
	{
		g.setColour(0xFF994C46); //Red
		g.fillRoundedRectangle([0, 0, 40, 20], 2);
		
		g.setColour(0xff333333);
		g.fillRoundedRectangle([20, 0, 20, 20], 2);
	}
};

const var pushButtonPaint = function(g)
{	
	if (this.getValue() == 0)
	{
		g.setColour(0xff333333);
		g.fillRoundedRectangle([0, 0, 20, 20], 2);
	}
	else 
	{
		g.setColour(0xFF994C46);
		g.fillRoundedRectangle([0, 0, 20, 20], 2);
	}
};

const var sliderPaint = function(g)
{
	//Background
	g.setColour(0xFFAAA591); //Beige
	g.fillRoundedRectangle([0, 0, 100, 20], 2);
		
	//Get width of slider based on slider's current normalized value
	var width = 2 + (80 * ui.getNormalizedValue(this));
	
	this.get("enabled") == true ? g.setColour(0xFF994C46) : g.setColour(0xA0994C46);  //Red
	g.fillRoundedRectangle([2, 2, width, 16], 2);	
	
	g.setColour(0xFF333333);  //Dark Grey
	g.fillRect([16+Math.min(96-30, width-16), 2, 16, 16]);
			
};

const var knobPaint = function(g)
{
	this.get("enabled") == true ? g.setColour(0xFFAAA591) : g.setColour(0xA0AAA591);
	g.fillEllipse([1, 1, 23, 23]);
	g.setColour(0xFF333333);  //Dark Grey
	g.drawEllipse([1, 1, 23, 23], 2);

	g.rotate(ui.getNormalizedValue(this) * 1.43 * Math.PI, [25/2, 25/2]);
		
    //Dot
	this.get("enabled") == true ? g.setColour(0xFF994C46) : g.setColour(0xA0994C46);  //Red
	g.fillEllipse([5, 15, 4, 4]);
};