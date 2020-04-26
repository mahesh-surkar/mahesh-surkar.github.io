//document.execCommand('enableObjectResizing', false, 'false');
document.execCommand("enableInlineTableEditing", false, "false");

var SVG_CANVAS_IN_USE = null;

var SVG_NONE=0
var SVG_ELLIPSE=1;
var SVG_RECTANGLE=2;
var SVG_TEXT=3;
var SVG_LINE=4;
var SVG_CUBIC_CURVE = 5;
var SVG_TABLE=6;
var SVG_POLYLINE=7;
var SVG_ARC=8;
var SVG_RIGHT_ARROW=9;
var SVG_LEFT_ARROW=10;
var SVG_LEFT_RIGHT_ARROW=11;
var SVG_RIGHT_THIN_ARROW=12;
var SVG_LEFT_THIN_ARROW=13;
var SVG_LEFT_RIGHT_THIN_ARROW=14;
var SVG_LEFT_CURVE_ARROW=15;
var SVG_RIGHT_CURVE_ARROW=16;
var SVG_LEFT_RIGHT_CURVE_ARROW=17;
var SVG_TOP_DOWN_CURVE_ARROW=18;
var SVG_TOP_RIGHT_CURVE_ARROW=19;
var SVG_TOP_LEFT_CURVE_ARROW=20;
var SVG_RIGHT_DOWN_CURVE_ARROW=21;
var SVG_LEFT_DOWN_CURVE_ARROW=22;
var SVG_DOWN_CURVE_ARROW=23;
var SVG_TOP_CURVE_ARROW=24;
var SVG_UNDO=25;
var SVG_REDO=26;
var SVG_SAVE=27;
var SVG_OPEN=28;
var SVG_SOURCE=29;

var SVG_SLIDE=500;
var SVG_SLIDES=501;
var SVG_ICON_FILL_COLOR=502;

var SW_SHAPE_TYPE = {
		SW_SVG_UNKNOWN:0,
		SW_SVG_BASIC:1,
		SW_SVG_FOREIGN:2,
		SW_SVG_ARROW:3,
};
	
var ARROW_TYPE = {
		UNKNOWN: 0,
		LINE_ARROW: 1,
		CURVE_ARROW: 2,
}

var ARROW_HEAD_DIRECTION = {
		TOWARDS_RANDOM: 0,
		TOWARDS_LEFT: 1,
		TOWARDS_RIGHT: 2,
		TOWARDS_TOP:3,
		TOWARDS_BOTTOM:4,		
}

var ARROW_HEAD_TYPE = { 
		LEFT_HEAD:1,
		RIGHT_HEAD:2,
		TOP_HEAD:3,
		DOWN_HEAD:4,
		LEFT_RIGHT_HEAD:5,
		TOP_DOWN_HEAD:6,
		TOP_RIGHT_HEAD:7,
		TOP_LEFT_HEAD:8,
		LEFT_DOWN_HEAD:9,
		RIGHT_DOWN_HEAD:10,
};

var ARROW_SHAFT_TYPE = { 
		THIN_SHAFT:1,
		THICK_SHAFT:2,
};

var SHAPE_HELPER = 
{
		TOP_DOWN_ARROW:1,
		LEFT_RIGHT_ARROW:2,
		LEFT_UP_RIGHT_ROTATOR:3,
		DRAG:4,
};

var HELPER_CATAGORY = 
{
		MAIN_HELPER: 1,
		SUB_HELPER: 2,
};

var RESIZER_TYPE = {
		ONE_DIRECTIONAL:1,
		TWO_DIRECTIONAL:2,		
		FOUR_DIRCTIONAL:4
};

var SW_PATH_SEGMENT_TYPE = {
		PATH_SEG_CURVE:3,
};

var SW_CORD_SYSTEM_TYPE = {
	HTML:1,
	SVG:2,
}


var ARROW_PATH = function (arrowType)
{
	//local	
	var headWidth = 10;
    var headHeight = 4;
	var adjustFact = 10;//Math.round(headWidth*3.14); //why it is required?
	this.minHeadWidth = 10;
	
	this.arrowShaftWidth = 0;
	this.arrowType = arrowType;
	
	this.oneSideCurveDepth = 50;
	 
	this.rotation = { angle:0, originX: null , originY: null };
	
	this.head1 = new ARROW_HEAD,
	this.head2 = new ARROW_HEAD,
	
	this.topLine = new ARROW_LINE,
	this.bottomLine = new ARROW_LINE,
	this.curve = new Object;
	this.curve2 = new Object;
	
	this.Z='Z',		
	this.arrowHeadSide= ARROW_HEAD_TYPE.RIGHT_HEAD;
	
	this.setMinHeadWidth = function (width)
	{
	    this.minHeadWidth = width;
	}
	
	this.calculateArrowHead = function(headType, headTip)
	{	
	
		var head = new ARROW_HEAD;
		
	      var pt1 = null;
	      var pt2 = null;
	      var pt11 = null;
          var pt12 = null;
	        
		if (headType == "HEAD1")
        {   
		    pt11 = {x:this.curve.csX, y: this.curve.csY };
	        pt12 = {x:this.curve.crX1, y: this.curve.crY1 }; 	
	        pt1 = {x:this.curve2.ceX, y: this.curve2.ceY };
	        pt2 = {x:this.curve2.crX2, y: this.curve2.crY2 }; 
        }
        else
        {
            pt1 = {x:this.curve.ceX, y: this.curve.ceY };
            pt2 = {x:this.curve.crX2, y: this.curve.crY2 };     
            pt11 = {x:this.curve2.csX, y: this.curve2.csY };
            pt12 = {x:this.curve2.crX1, y: this.curve2.crY1 }; 
        }

		var dx1 = Math.abs(pt1.x - pt2.x);
		var dy1 = Math.abs(pt1.y - pt2.y);	
		var dx2 = Math.abs(pt11.x - pt12.x);
        var dy2 = Math.abs(pt11.y - pt12.y);  
		
		if (headType == "HEAD1")
		{	
			if (pt1.y < pt2.y)	{ dx1 *= -1; }	
			//if (pt11.y < pt12.y)   { dx2 *= -1; }  
			
			if (pt11.y <= pt1.y)   { dx2 *= -1; dx1 *= -1; }
			if (pt11.x < pt1.x)   { dy2 *= -1; dy1 *= -1; }
		}
		else
		{
			if (pt1.y > pt2.y)	{ dx1 *= -1; }
			//if (pt1.y > pt11.y) { dx1 *= -1; }
			//if (pt11.y > pt12.y)   { dx1 *= -1; }	
			if (pt11.y < pt1.y && dx2 > 0) { dx2 *= -1; }	
			if (pt11.y < pt1.y && dx1 > 0) { dx1 *= -1; }
			if (pt11.x < pt1.x) { dy2 *= -1; dy1 *= -1; }
		}

		var widthSacle=1000;// dist1/halfHheadHeight; widthSacle = (halfHheadHeight/widthSacle);
		var heightScale=1000;// dist1/headWidth; heightScale = (headWidth/heightScale);

		//console.log("headHeight" + headHeight +"," + widthSacle + "," + heightScale);
		var pt3 = {x: pt11.x+dy2*widthSacle, y:  pt11.y+dx2*widthSacle };
		var pt4 = {x: pt1.x-dy1*widthSacle, y:  pt1.y-dx1*widthSacle };
		
		var pt5 = {x: pt1.x+(pt1.x-pt2.x)*heightScale, y:  pt1.y+(pt1.y-pt2.y)*heightScale };
		var pt6 = {x: pt11.x+(pt11.x-pt12.x)*heightScale, y:  pt11.y+(pt11.y-pt12.y)*heightScale };

		var pt7 = { x:(pt5.x+pt6.x)/2, y:(pt5.y+pt6.y)/2 } ;
		
		var headTop = SW_SVG_UTIL.pointAtDistance(pt1, pt4, headHeight);
		var headBottom = SW_SVG_UTIL.pointAtDistance(pt11, pt3, headHeight);
	
		head.HTX = Math.round(headTop.x);
		head.HTY = Math.round(headTop.y);
		
		head.HBX = Math.round(headBottom.x);
		head.HBY = Math.round(headBottom.y);

		head.HMX = Math.round(pt7.x);
		head.HMY = Math.round(pt7.y);
		
		if (headTip)
		{
			head.HMX = headTip.x;
			head.HMY = headTip.y;

		}
		
		if (head.HMY == head.HBY || head.HMX == head.HBX)
		{
			console.log("Error : why head width is zero"+ ","+ headType + ":" + head.HMX+","+head.HMY + ","+ head.HBX+","+head.HBY);
			//alert("why head width is zero"+ ","+ headType + ":" + head.HMX+","+head.HMY + ","+ head.HBX+","+head.HBY);
		}
		return head;
	}
	
	this.getHeadDirection = function(headStr)
	{
		var head = headStr == "HEAD2" ? this.head2 : this.head1;
		
		if (headStr == "HEAD2")
		{	
			switch (this.arrowHeadSide)
			{

				case ARROW_HEAD_TYPE.LEFT_HEAD:
				case ARROW_HEAD_TYPE.RIGHT_HEAD:
				case ARROW_HEAD_TYPE.TOP_HEAD:
				case ARROW_HEAD_TYPE.DOWN_HEAD:
					console.log("Calculating head2 as not present");
					head = this.calculateArrowHead(headStr, null);
					break;
			}
		}
		
		if (head.HTX == head.HBX && head.HMX > head.HBX)
		{
			//console.log(headStr +": + ARROW_HEAD_DIRECTION.TOWARDS_RIGHT");
			return ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
		}
		else if (head.HTX == head.HBX && head.HMX < head.HBX)
		{
			//console.log(headStr +": + ARROW_HEAD_DIRECTION.TOWARDS_LEFT");
			return ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
		}
		else if (head.HTY == head.HBY && head.HMY < head.HBY)
		{
			//console.log(headStr +": + ARROW_HEAD_DIRECTION.TOWARDS_TOP");
			return ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		}
		else if (head.HTY == head.HBY && head.HMY > head.HBY)
		{
			//console.log(headStr +": + ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM");
			return ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
		}
		else
		{
			console.log(headStr +": + ARROW_HEAD_DIRECTION.TOWARDS_RANDOM ????: HTX = " + head.HTX
					+ "HTY =" + head.HTY + "HBX =" + head.HBX + "HBY =" + head.HBY 
					+ "HMX =" + head.HMX + "HMY =" + head.HMY);
			
			return ARROW_HEAD_DIRECTION.TOWARDS_RANDOM;
		}
	}
	
	
	this.calculateLineArrowCord = function(startCord, endCord, arrowHeadSide, arrowLineType)
	{

	    startCord.x = Math.round(startCord.x);
        startCord.y = Math.round(startCord.y);

        endCord.x = Math.round(endCord.x);
        endCord.y = Math.round(endCord.y);     
      
        this.rotation = { angle:0, originX: startCord.x , originY: startCord.y };
           
        if (arrowLineType == ARROW_SHAFT_TYPE.THIN_SHAFT)
        {
            this.rotation.angle = Math.round(Snap.angle(startCord.x, startCord.y, endCord.x, endCord.y)-180); 
            //console.log("Angle " + rotationAngle +","+ startCord.x + "," + startCord.y + "," +  endCord.x + "," +endCord.y);
            var arrowLen = SW_SVG_UTIL.distanceBetweenPoints(startCord, endCord);
            endCord.x = startCord.x + arrowLen;     
            endCord.y = startCord.y;
        }
        
        if (endCord.y < startCord.y)
        {
            endCord.y = startCord.y;
        }
        
        if (arrowHeadSide == ARROW_HEAD_TYPE.LEFT_HEAD)
        {
            var tmpStartCord = { x: startCord.x, y: startCord.y }
            startCord.x = endCord.x;
            startCord.y = endCord.y;            
            endCord.x = tmpStartCord.x;
            endCord.y = tmpStartCord.y;
        }

	    headHeight = Math.max(Math.abs(endCord.y-startCord.y)/4, 4); //half of arrow head height or 4
	    headWidth = Math.max(Math.abs(endCord.y-startCord.y), this.minHeadWidth);//arrow width or 10
	    headWidth = Math.min(headWidth, 70);
	    
	    this.arrowHeadSide = arrowHeadSide;
	    
	    var spaceForLeftArrowHead = 0;
	    var numberOfArrowHead = (arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD) ? 2 : 1;

	    if (startCord.x <= endCord.x) //Right side head
	    {
	        if (startCord.x >= (endCord.x-headWidth*numberOfArrowHead))
	        {
	            headWidth = (endCord.x-startCord.x)/4;
	            endCord.x = startCord.x + (headWidth*3);
	        }

	        if (arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD)
	        {
	            spaceForLeftArrowHead = headWidth;
	        }

	        this.topLine.X1 = startCord.x+spaceForLeftArrowHead;
	        this.topLine.Y1 = startCord.y;
	        this.topLine.X2 = endCord.x-headWidth;
	        this.topLine.Y2 = startCord.y; 

	        this.bottomLine.X1 = startCord.x + spaceForLeftArrowHead;
	        this.bottomLine.Y1 = endCord.y;
	        this.bottomLine.X2 = endCord.x-headWidth;
	        this.bottomLine.Y2 = endCord.y;        
	    }
	    else   //Left side head
	    {
	        if (startCord.x < (endCord.x+headWidth*numberOfArrowHead))
	        {
	            headWidth = Math.abs(endCord.x-startCord.x)/4;
	            endCord.x = startCord.x - (headWidth*3);
	        }

	        if (arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD)
	        {
	            spaceForLeftArrowHead = headWidth;
	        }

	        this.topLine.X1 = startCord.x-spaceForLeftArrowHead;
	        this.topLine.Y1 = startCord.y;     
	        this.topLine.X2 = endCord.x+headWidth;
	        this.topLine.Y2 = startCord.y; 

	        this.bottomLine.X1 = startCord.x-spaceForLeftArrowHead;
	        this.bottomLine.Y1 = endCord.y;
	        this.bottomLine.X2 = endCord.x+headWidth;
	        this.bottomLine.Y2 = endCord.y;        
	    }

	    if (arrowHeadSide == ARROW_HEAD_TYPE.LEFT_HEAD)
	    {
	        this.head1.HTX = this.topLine.X2;
            this.head1.HTY = this.topLine.Y2+headHeight;  
            this.head1.HMX = endCord.x;
            this.head1.HMY = startCord.y + (endCord.y-startCord.y)/2;
            this.head1.HBX = this.bottomLine.X2;
            this.head1.HBY = this.bottomLine.Y2-headHeight;   
	    }
	    else
	    {
	        this.head1.HTX = this.topLine.X2;
	        this.head1.HTY = this.topLine.Y2-headHeight;  
	        this.head1.HMX = endCord.x;
	        this.head1.HMY = startCord.y + (endCord.y-startCord.y)/2;
	        this.head1.HBX = this.bottomLine.X2;
	        this.head1.HBY = this.bottomLine.Y2+headHeight;   
	    }
	    
	    if (arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD)
	    {
	        this.head2.HTX = this.topLine.X1;
	        this.head2.HTY = this.topLine.Y1-headHeight;
	        this.head2.HMX = startCord.x;
	        this.head2.HMY = startCord.y + (endCord.y-startCord.y)/2;
	        this.head2.HBX = this.bottomLine.X1;
	        this.head2.HBY = this.bottomLine.Y1+headHeight;      
	    }    
	}
	
	this.getHeadHeight = function () //from shaft in one direction //perpendicular to shaft
	{
		var currentHeight = 0;
		var head1Dire= this.getHeadDirection("HEAD1")
		
		switch (head1Dire)
		{ 
			case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
			case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
				currentHeight = Math.abs(this.head1.HBY - this.head1.HTY);
				break;
			case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
			case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
				currentHeight = Math.abs(this.head1.HBX - this.head1.HTX);
				break;
		}
		
		currentHeight = Math.abs(currentHeight - this.getShaftWidth())/2;
		//alert("Calculated Head Height " + currentHeight);
		return currentHeight;
	}
	
	this.getHeadWidth = function () 
	{
		var currentWidth = 0;
		var head1Dire= this.getHeadDirection("HEAD1")
		
		switch (head1Dire)
		{ 
			case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
			case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
				currentWidth = Math.abs(this.head1.HMX - this.head1.HBX)
				break;
			case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
			case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
				currentWidth = Math.abs(this.head1.HMY - this.head1.HBY)
				break;
			default:
				console.log("Error: unexpected head1 direction");
				//alert("unexpected head1 direction");
		}
		
		return currentWidth;
	}
	
	this.getShaftWidth = function ()
	{
		var currentShaftWidth = 0;
		var head1Dire= this.getHeadDirection("HEAD1")
		
		switch (head1Dire)
		{ 
			case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
			case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
				currentShaftWidth = Math.abs(this.curve.csY - this.curve2.ceY)
				break;
			case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
			case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
				currentShaftWidth = Math.abs(this.curve.csX - this.curve2.ceX)
				break;
		}
		
		return currentShaftWidth;
	}
	
	this.setShaftDepth = function (shaftDepth)
	{
		this.oneSideCurveDepth = shaftDepth;
	}
	
	this.setShaftWidth = function (newShaftWidth, head1Tip, head2Tip)
	{ 	 
		newShaftWidth = Math.round(newShaftWidth);
		
		if (newShaftWidth <= 0) 
		{
			return;
		}
		
		console.log("setting arrow shaft width to :"+ newShaftWidth);
		
		this.arrowShaftWidth = newShaftWidth;
		
		var head1Dire=this.getHeadDirection("HEAD1");
		var head2Dire= this.getHeadDirection("HEAD2");

		var currentShaftWidth = 0;
		switch (head2Dire)
		{ 
			case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
			case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
				currentShaftWidth = Math.abs(this.curve.ceY - this.curve2.csY)
				break;
			case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
			case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
				currentShaftWidth = Math.abs(this.curve.ceX - this.curve2.csX)
				break;
		}

		var shaftWidthAdjust = (newShaftWidth-currentShaftWidth)/2;
			
		switch (head2Dire)
	    { 
	            case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
	    	        switch (head1Dire)
	    	        { 
	    	        	case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
	    	        		this.curve.csX = this.curve.csX;
	    	            	this.curve.csY = this.curve.csY < this.curve.ceY ? 
	    	            			this.curve.csY-shaftWidthAdjust : this.curve.csY+shaftWidthAdjust;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.csY < this.curve.ceY ? 
	    	            			    this.curve.ceY+shaftWidthAdjust: this.curve.ceY-shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = Math.max(this.curve.ceX, this.curve.csX)+(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
	    	            	this.curve.crY1 = this.curve.csY;
	    	            	this.curve.crX2 = Math.max(this.curve.ceX, this.curve.csX)+(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
	    	            	this.curve.crY2 = this.curve.ceY;

	    	            	this.curve2.csX = this.curve2.csX
	    	            	this.curve2.csY = this.curve2.csY > this.curve2.ceY ? 
	    	            			this.curve2.csY-shaftWidthAdjust : this.curve2.csY+shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX
	    	                this.curve2.ceY = this.curve2.csY > this.curve2.ceY ? 
	    	                		this.curve2.ceY+shaftWidthAdjust :  this.curve2.ceY-shaftWidthAdjust;              
	    	            
	    	               this.curve2.crX1 =  Math.max(this.curve2.ceX, this.curve2.csX)+this.oneSideCurveDepth;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = Math.max(this.curve2.ceX, this.curve2.csX)+this.oneSideCurveDepth;
	    	                this.curve2.crY2 = this.curve2.ceY;

	    	        		break;
	    	            case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
	    	             	this.curve.csX = this.curve.csX;
	    	            	this.curve.csY = this.curve.csY-shaftWidthAdjust;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.ceY-shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = this.curve.ceX;
	    	            	this.curve.crY1 = this.curve.csY;

	    	            	this.curve.crX2 = this.curve.csX;
	    	            	this.curve.crY2 = this.curve.ceY;
	    	            	
	    	            	this.curve2.csX = this.curve2.csX;
	    	            	this.curve2.csY = this.curve2.csY+shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX;
	    	                this.curve2.ceY = this.curve2.ceY+shaftWidthAdjust;              
	    	            
	    	                this.curve2.crX1 = this.curve2.ceX;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = this.curve2.csX;
	    	                this.curve2.crY2 = this.curve2.ceY;
	    	            
	    	                break;
	    	            case ARROW_HEAD_DIRECTION.TOWARDS_TOP:	
	    	            	this.curve.csX = this.curve.csX+shaftWidthAdjust;
	    	            	this.curve.csY = this.curve.csY;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.ceY+shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = this.curve.csX;
	    	                this.curve.crY1 = this.curve.ceY;	    	               
	    	                this.curve.crX2 = this.curve.csX;
	    	                this.curve.crY2 = this.curve.ceY;

	    	            	this.curve2.csX = this.curve2.csX
	    	            	this.curve2.csY = this.curve2.csY-shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX-shaftWidthAdjust;
	    	                this.curve2.ceY = this.curve2.ceY              
	    	            
	    	                this.curve2.crX1 = this.curve2.ceX;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = this.curve2.ceX;
	    	                this.curve2.crY2 = this.curve2.csY;
	    	                
	    	                break;
	    	            case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:	    	            	
	    	               	this.curve.csX = this.curve.csX+shaftWidthAdjust;
	    	            	this.curve.csY = this.curve.csY;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.ceY-shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = this.curve.csX;
	    	                this.curve.crY1 = this.curve.ceY;
	    	               
	    	                this.curve.crX2 = this.curve.csX;
	    	                this.curve.crY2 = this.curve.ceY;

	    	            	this.curve2.csX = this.curve2.csX
	    	            	this.curve2.csY = this.curve2.csY+shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX-shaftWidthAdjust;
	    	                this.curve2.ceY = this.curve2.ceY              
	    	            
	    	                this.curve2.crX1 = this.curve2.ceX;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = this.curve2.ceX;
	    	                this.curve2.crY2 = this.curve2.csY;
	    	                
	    	                break;                   
	    	        }
	    		  
	                break;
	            case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
	                
	            	//console.log("curve arrow before : "+ this.curve.csX + "," + this.curve.csY + "," +
	            	//		this.curve.ceX + "," + this.curve.ceY);
	                switch (head1Dire)
	    	        { 
	    	            case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:  	  
	    	            	this.curve.csX = this.curve.csX;
	    	            	this.curve.csY = this.curve.csY-shaftWidthAdjust;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.ceY-shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = this.curve.ceX;
	    	            	this.curve.crY1 = this.curve.csY;

	    	            	this.curve.crX2 = this.curve.csX;//+shaftWidthAdjust;
	    	            	this.curve.crY2 = this.curve.ceY;//+shaftWidthAdjust;;

	    	            	this.curve2.csX = this.curve2.csX;
	    	            	this.curve2.csY = this.curve2.csY+shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX;
	    	                this.curve2.ceY = this.curve2.ceY+shaftWidthAdjust;              
	    	            
	    	                this.curve2.crX1 = this.curve2.ceX;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = this.curve2.csX;
	    	                this.curve2.crY2 = this.curve2.ceY;
	    	                break;
	    	            case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
	    	            	this.curve.csX = this.curve.csX;
	    	            	this.curve.csY = this.curve.csY < this.curve.ceY ? 
	    	            			this.curve.csY-shaftWidthAdjust : this.curve.csY+shaftWidthAdjust;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.csY < this.curve.ceY ? 
	    	            			    this.curve.ceY+shaftWidthAdjust: this.curve.ceY-shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = Math.min(this.curve.ceX, this.curve.csX)-(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
	    	            	this.curve.crY1 = this.curve.csY;
	    	            	this.curve.crX2 = Math.min(this.curve.ceX, this.curve.csX)-(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
	    	            	this.curve.crY2 = this.curve.ceY;

	    	            	this.curve2.csX = this.curve2.csX
	    	            	this.curve2.csY = this.curve2.csY > this.curve2.ceY ? 
	    	            			this.curve2.csY-shaftWidthAdjust : this.curve2.csY+shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX
	    	                this.curve2.ceY = this.curve2.csY > this.curve2.ceY ? 
	    	                		this.curve2.ceY+shaftWidthAdjust :  this.curve2.ceY-shaftWidthAdjust;              
	    	            
	    	                this.curve2.crX1 =  Math.min(this.curve2.ceX, this.curve2.csX)-this.oneSideCurveDepth;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = Math.min(this.curve2.ceX, this.curve2.csX)-this.oneSideCurveDepth;
	    	                this.curve2.crY2 = this.curve2.ceY;
	    	                
	    	                break;
	    	            case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
	    	             
	    	            	this.curve.csX = this.curve.csX+shaftWidthAdjust;
	    	            	this.curve.csY = this.curve.csY;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.ceY-shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = this.curve.csX;
	    	                this.curve.crY1 = this.curve.ceY;	    	               
	    	                this.curve.crX2 = this.curve.csX;
	    	                this.curve.crY2 = this.curve.ceY;

	    	            	this.curve2.csX = this.curve2.csX
	    	            	this.curve2.csY = this.curve2.csY+shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX-shaftWidthAdjust;
	    	                this.curve2.ceY = this.curve2.ceY              
	    	            
	    	                this.curve2.crX1 = this.curve2.ceX;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = this.curve2.ceX;
	    	                this.curve2.crY2 = this.curve2.csY;
	    	                
	    	            //	console.log("curve arrow after : "+ this.curve.csX + "," + this.curve.csY + "," +
	    	            //			this.curve.ceX + "," + this.curve.ceY);
	    	                
	    	                break;
	    	            case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
	    	            	this.curve.csX = this.curve.csX+shaftWidthAdjust;
	    	            	this.curve.csY = this.curve.csY;    
	    	            	this.curve.ceX = this.curve.ceX;
	    	            	this.curve.ceY = this.curve.ceY+shaftWidthAdjust;  
	    	            	
	    	            	this.curve.crX1 = this.curve.csX;
	    	                this.curve.crY1 = this.curve.ceY;
	    	               
	    	                this.curve.crX2 = this.curve.csX;
	    	                this.curve.crY2 = this.curve.ceY;

	    	            	this.curve2.csX = this.curve2.csX
	    	            	this.curve2.csY = this.curve2.csY-shaftWidthAdjust;    
	    	                this.curve2.ceX = this.curve2.ceX-shaftWidthAdjust;
	    	                this.curve2.ceY = this.curve2.ceY              
	    	            
	    	                this.curve2.crX1 = this.curve2.ceX;
	    	                this.curve2.crY1 = this.curve2.csY;
	    	               
	    	                this.curve2.crX2 = this.curve2.ceX;
	    	                this.curve2.crY2 = this.curve2.csY;
	    	              
	    	                break;                   
	    	        }
	    		
	                
	                break;
	            case ARROW_HEAD_DIRECTION.TOWARDS_TOP:          
	            	 switch (head1Dire)
		    	        { 
		    	            case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:  
		    	            	this.curve.csX = this.curve.csX;
		    	            	this.curve.csY = this.curve.csY-shaftWidthAdjust;    
		    	            	this.curve.ceX = this.curve.ceX-shaftWidthAdjust;
		    	            	this.curve.ceY = this.curve.ceY;  
		    	            	
		    	            	this.curve.crX1 = this.curve.ceX;
		    	                this.curve.crY1 = this.curve.csY;
		    	               
		    	                this.curve.crX2 = this.curve.ceX;
		    	                this.curve.crY2 = this.curve.csY;
		    	                
		    	            	this.curve2.csX = this.curve2.csX+shaftWidthAdjust;
		    	            	this.curve2.csY = this.curve2.csY;    
		    	            	this.curve2.ceX = this.curve2.ceX;
		    	            	this.curve2.ceY = this.curve2.ceY+shaftWidthAdjust;

		    	            	this.curve2.crX1 = this.curve2.csX;
		    	            	this.curve2.crY1 = this.curve2.ceY;
		    	            	this.curve2.crX2 = this.curve2.csX;
		    	            	this.curve2.crY2 = this.curve2.ceY;

		    	                break;
		    	            case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
		    	            	console.log("This is not implemeted yet!");
		    	            	this.curve.csX = this.curve.csX;
		    	            	this.curve.csY = this.curve.csY-shaftWidthAdjust;    
		    	            	this.curve.ceX = this.curve.ceX+shaftWidthAdjust;
		    	            	this.curve.ceY = this.curve.ceY;  
		    	            	
		    	            	this.curve.crX1 = this.curve.ceX;
		    	                this.curve.crY1 = this.curve.csY;
		    	               
		    	                this.curve.crX2 = this.curve.ceX;
		    	                this.curve.crY2 = this.curve.csY;
		    	                
		    	            	this.curve2.csX = this.curve2.csX-shaftWidthAdjust;
		    	            	this.curve2.csY = this.curve2.csY;    
		    	            	this.curve2.ceX = this.curve2.ceX;
		    	            	this.curve2.ceY = this.curve2.ceY+shaftWidthAdjust;

		    	            	this.curve2.crX1 = this.curve2.csX;
		    	            	this.curve2.crY1 = this.curve2.ceY;
		    	            	this.curve2.crX2 = this.curve2.csX;
		    	            	this.curve2.crY2 = this.curve2.ceY;
		    	                
		    	                break;
		    	            case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
		    	             
		    	            	this.curve.csX = this.curve.csX < this.curve.ceX ? 
		    	            			     this.curve.csX+shaftWidthAdjust: this.curve.csX-shaftWidthAdjust;
		    	            	this.curve.csY = this.curve.csY;    
		    	            	this.curve.ceX = this.curve.csX < this.curve.ceX ?  
		    	            			   this.curve.ceX-shaftWidthAdjust : this.curve.ceX+shaftWidthAdjust;
		    	            	this.curve.ceY = this.curve.ceY;  
		    	            	
		    	            	this.curve.crY1 = Math.max(this.curve.ceY, this.curve.csY)+this.oneSideCurveDepth;
		    	            	this.curve.crX1 = this.curve.csX;
		    	            	this.curve.crY2 = Math.max(this.curve.ceY, this.curve.csY)+this.oneSideCurveDepth;
		    	            	this.curve.crX2 = this.curve.ceX;
		    	            	
		    	            	this.curve2.csX = this.curve2.csX > this.curve.ceX ?  
		    	            			   this.curve2.csX+shaftWidthAdjust : this.curve2.csX-shaftWidthAdjust;
		    	            	this.curve2.csY = this.curve2.csY;    
		    	                this.curve2.ceX = this.curve2.csX > this.curve.ceX ? 
		    	                		this.curve2.ceX-shaftWidthAdjust : this.curve2.ceX+shaftWidthAdjust;
		    	                this.curve2.ceY = this.curve2.ceY;              
		    	            
		    	                this.curve2.crY1 = Math.max(this.curve2.ceY, this.curve2.csY)+(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
		    	            	this.curve2.crX1 = this.curve2.csX;
		    	            	this.curve2.crY2 = Math.max(this.curve2.ceY, this.curve2.csY)+(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
		    	            	this.curve2.crX2 = this.curve2.ceX;    
		    	            	
		    	                break;
		    	            case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
		    	            	this.curve.csX = this.curve.csX+shaftWidthAdjust;
		    	            	this.curve.csY = this.curve.csY;    
		    	            	this.curve.ceX = this.curve.ceX+shaftWidthAdjust;
		    	            	this.curve.ceY = this.curve.ceY;  
		    	            	
		    	            	this.curve.crX1 = this.curve.csX;
		    	                this.curve.crY1 = this.curve.ceY;
		    	               
		    	                this.curve.crX2 = this.curve.ceX;
		    	                this.curve.crY2 = this.curve.csY;

		    	            	this.curve2.csX = this.curve2.csX-shaftWidthAdjust;
		    	            	this.curve2.csY = this.curve2.csY;
		    	                this.curve2.ceX = this.curve2.ceX-shaftWidthAdjust;
		    	                this.curve2.ceY = this.curve2.ceY;              
		    	            
		    	            	this.curve2.crX1 = this.curve2.csX;
		    	                this.curve2.crY1 = this.curve2.ceY;
		    	               
		    	                this.curve2.crX2 = this.curve2.ceX;
		    	                this.curve2.crY2 = this.curve2.csY;
		    	              
		    	                break;                   
		    	        }
		    		
	                break;
	            case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:  
	            	 switch (head1Dire)
		    	     { 
		    	     	case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:  
		    	     		this.curve.csX = this.curve.csX;
	    	            	this.curve.csY = this.curve.csY-shaftWidthAdjust;    
	    	            	this.curve.ceX = this.curve.ceX+shaftWidthAdjust;
	    	            	this.curve.ceY = this.curve.ceY;  
	    	            	
	    	            	this.curve.crX1 = this.curve.ceX;
	    	                this.curve.crY1 = this.curve.csY;	    	               
	    	                this.curve.crX2 = this.curve.ceX;
	    	                this.curve.crY2 = this.curve.csY;

	    	            	this.curve2.csX = this.curve2.csX-shaftWidthAdjust;
	    	            	this.curve2.csY = this.curve2.csY;
	    	                this.curve2.ceX = this.curve2.ceX
	    	                this.curve2.ceY = this.curve2.ceY+shaftWidthAdjust;;              
	    	            
	    	            	this.curve2.crX1 = this.curve2.csX;
	    	                this.curve2.crY1 = this.curve2.ceY;	    	               
	    	                this.curve2.crX2 = this.curve2.csX;
	    	                this.curve2.crY2 = this.curve2.ceY;
	    	                
		    	     		break;
		    	     	case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:  
		    	     		this.curve.csX = this.curve.csX;
	    	            	this.curve.csY = this.curve.csY-shaftWidthAdjust;    
	    	            	this.curve.ceX = this.curve.ceX-shaftWidthAdjust;
	    	            	this.curve.ceY = this.curve.ceY;  
	    	            	
	    	            	this.curve.crX1 = this.curve.ceX;
	    	                this.curve.crY1 = this.curve.csY;	    	               
	    	                this.curve.crX2 = this.curve.ceX;
	    	                this.curve.crY2 = this.curve.csY;

	    	            	this.curve2.csX = this.curve2.csX+shaftWidthAdjust;
	    	            	this.curve2.csY = this.curve2.csY;
	    	                this.curve2.ceX = this.curve2.ceX
	    	                this.curve2.ceY = this.curve2.ceY+shaftWidthAdjust;;              
	    	            
	    	            	this.curve2.crX1 = this.curve2.csX;
	    	                this.curve2.crY1 = this.curve2.ceY;	    	               
	    	                this.curve2.crX2 = this.curve2.csX;
	    	                this.curve2.crY2 = this.curve2.ceY;
	    	                
		    	     		break;
		    	     	case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
		    	     		this.curve.csX = this.curve.csX+shaftWidthAdjust;
	    	            	this.curve.csY = this.curve.csY;    
	    	            	this.curve.ceX = this.curve.ceX+shaftWidthAdjust;
	    	            	this.curve.ceY = this.curve.ceY;  
	    	            	
	    	            	this.curve.crX1 = this.curve.csX;
	    	                this.curve.crY1 = this.curve.ceY;
	    	               
	    	                this.curve.crX2 = this.curve.ceX;
	    	                this.curve.crY2 = this.curve.csY;

	    	            	this.curve2.csX = this.curve2.csX-shaftWidthAdjust;
	    	            	this.curve2.csY = this.curve2.csY;
	    	                this.curve2.ceX = this.curve2.ceX-shaftWidthAdjust;
	    	                this.curve2.ceY = this.curve2.ceY;              
	    	            
	    	            	this.curve2.crX1 = this.curve2.csX;
	    	                this.curve2.crY1 = this.curve2.ceY;
	    	               
	    	                this.curve2.crX2 = this.curve2.ceX;
	    	                this.curve2.crY2 = this.curve2.csY;
		    	     		break;
		    	     	case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:

	    	            	this.curve.csX = this.curve.csX < this.curve.ceX ? 
	    	            			     this.curve.csX+shaftWidthAdjust: this.curve.csX-shaftWidthAdjust;
	    	            	this.curve.csY = this.curve.csY;    
	    	            	this.curve.ceX = this.curve.csX < this.curve.ceX ?  
	    	            			   this.curve.ceX-shaftWidthAdjust : this.curve.ceX+shaftWidthAdjust;
	    	            	this.curve.ceY = this.curve.ceY;  
	    	            	
	    	            	this.curve.crY1 = Math.min(this.curve.ceY, this.curve.csY)-this.oneSideCurveDepth;
	    	            	this.curve.crX1 = this.curve.csX;
	    	            	this.curve.crY2 = Math.min(this.curve.ceY, this.curve.csY)-this.oneSideCurveDepth;
	    	            	this.curve.crX2 = this.curve.ceX;
	    	            	
	    	            	this.curve2.csX = this.curve2.csX > this.curve.ceX ?  
	    	            			   this.curve2.csX+shaftWidthAdjust : this.curve2.csX-shaftWidthAdjust;
	    	            	this.curve2.csY = this.curve2.csY;    
	    	                this.curve2.ceX = this.curve2.csX > this.curve.ceX ? 
	    	                		this.curve2.ceX-shaftWidthAdjust : this.curve2.ceX+shaftWidthAdjust;
	    	                this.curve2.ceY = this.curve2.ceY;              
	    	            
	    	                this.curve2.crY1 = Math.min(this.curve2.ceY, this.curve2.csY)-(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
	    	            	this.curve2.crX1 = this.curve2.csX;
	    	            	this.curve2.crY2 = Math.min(this.curve2.ceY, this.curve2.csY)-(this.oneSideCurveDepth+this.oneSideCurveDepth/2);
	    	            	this.curve2.crX2 = this.curve2.ceX;
		    	     		break; 
		    	     }
	            	break;
	        } 

		if (head1Dire == head2Dire)
		{
			switch(head1Dire)
			{
				case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
				case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
					if (this.head1.HMX >= Math.min(this.curve.ceX,this.curve2.csX) 
							&& this.head1.HMX <= Math.max(this.curve.ceX,this.curve2.csX))
					{
						var tmp = this.curve.csX;
						this.curve.csX = this.curve2.ceX;
						this.curve2.ceX = tmp;						
						this.curve.crX1 = this.curve.csX;
						this.curve.crY1 = this.curve.csY;
					}
					
					break;
			
				case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
				case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
					if (this.head1.HMY <= Math.max(this.curve.ceY,this.curve2.csY) 
							&& this.head1.HMY >= Math.min(this.curve.ceY,this.curve2.csY))
					{
						var tmp = this.curve.csY;
						this.curve.csY = this.curve2.ceY;
						this.curve2.ceY = tmp;
						this.curve2.crY2 = this.curve2.ceY;
						this.curve2.crX2 = this.curve2.ceX;
					}
					
					break;
			}
		}
		
		this.head1 = this.calculateArrowHead("HEAD1", head1Tip); 
		this.head2 = this.calculateArrowHead("HEAD2", head2Tip);  
		
		this.printArrowPoints();
	}

	this.calculateCurveArrowCord = function(myStartCord, myEndCord, arrowHeadSide, preferedHead, preferedHeadDirection, otherHeadDirection,
			arrowHeadHeight, arrowHeadWidth, arrowShaftWidth)
	{
		
		var endCord = { x: Math.round(myEndCord.x), y: Math.round(myEndCord.y) };	
		var startCord = { x: Math.round(myStartCord.x), y: Math.round(myStartCord.y) };
		
	    //console.log("preferedHead : "+ preferedHead + ", preferedHeadDirection = "+ preferedHeadDirection + ", otherHeadDirection" + otherHeadDirection + ", end cord X"+endCord.x);
	    
		//console.log("startCord = " + startCord.x +", "+ startCord.y  + ", endCord" +endCord.x+ "," + endCord.y);
		
		//console.log("arrowHeadWidth = " + arrowHeadWidth +", arrowShaftWidth "+ arrowShaftWidth + 
		//		", arrowHeadHeight "+ arrowHeadHeight );
				
		this.arrowHeadSide = arrowHeadSide;
		  
		this.rotation = { angle:0, originX: null , originY: null };
		
		if (arrowHeadHeight == 0)
		{
			headHeight = Math.min(arrowShaftWidth/4, 70);		
			headHeight = Math.max(headHeight, 4); //half of arrow head height or 4
			console.log("headHeight" + headHeight);
		}
		else
		{
			headHeight = arrowHeadHeight;
		}
		
		if (arrowHeadWidth == 0)
		{
			headWidth = Math.max(arrowShaftWidth, this.minHeadWidth);//arrow width or 10
			headWidth = Math.min(headWidth, 70);
			adjustFact = headWidth;//Math.round(headWidth*3.14); //why it is required for curve arrow?*/
		}
		else
		{
			headWidth = Math.max(arrowHeadWidth, this.minHeadWidth);
			adjustFact = headWidth;
		}
	
		var expHead2Dire = preferedHead == "HEAD2" ? preferedHeadDirection : otherHeadDirection;
		var numberOfHeads = 2;
		
		switch (arrowHeadSide)
		{
			case ARROW_HEAD_TYPE.LEFT_HEAD:
			case ARROW_HEAD_TYPE.RIGHT_HEAD:
			case ARROW_HEAD_TYPE.TOP_HEAD:
			case ARROW_HEAD_TYPE.DOWN_HEAD:
				//numberOfHeads = 1;
				switch (expHead2Dire)
				{ //adjust for head2
					case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
						console.log("head ARROW_HEAD_TYPE.LEFT_HEAD:");
						endCord.x += adjustFact;
						break;
					case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
						console.log("head ARROW_HEAD_TYPE.RIGHT_HEAD:");
						endCord.x -= adjustFact;
						break;
					case ARROW_HEAD_DIRECTION.TOWARDS_BTTOM:
						console.log("head ARROW_HEAD_TYPE.TOP_HEAD:");
						endCord.y += adjustFact;
						break;
					case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
						console.log("head ARROW_HEAD_TYPE.DOWN_HEAD:");
						endCord.y -= adjustFact;
						break;
				}
		}

		//console.log("calculated curve end= " + this.curve.ceX +", "+ this.curve.ceY  + ", endCord" +endCord.x+ "," + endCord.y);
		
		this.curve.type = "C";	

		this.curve.csX = startCord.x;
		this.curve.csY = startCord.y	
		this.curve.ceX = endCord.x;
		this.curve.ceY = endCord.y;
	
		this.curve.crX1 = this.curve.csX; 
		this.curve.crY1 = this.curve.ceY;
		this.curve.crX2 = this.curve.ceX;
		this.curve.crY2 = this.curve.csY;

		var otherHeadCalcDirection = otherHeadDirection;

		if (preferedHead == "HEAD1")
		{
		    switch(preferedHeadDirection)
		    {
		        case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
		            this.curve.csY = startCord.y+adjustFact;					

		            if (endCord.y > startCord.y+(numberOfHeads * adjustFact))
		            {//head2 toward bottom
		                this.curve.ceY = endCord.y-adjustFact;	
		                this.curve.crY1 = this.curve.ceY;
		                this.curve.crY2 = this.curve.csY;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
		            }
		            else
		            {//head2 toward top
		                this.curve.ceY = endCord.y+adjustFact;
		                
		                if (this.curve.csY > this.curve.ceY)
	                	{
		                	this.curve.crY1 = this.curve.csY+this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.csY+this.oneSideCurveDepth;
	                	}
		                else
		                {
		                	this.curve.crY1 = this.curve.ceY+this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.ceY+this.oneSideCurveDepth;
		                }
		                
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		            }

		            this.curve.crX1 = this.curve.csX; 
		            this.curve.crX2 = this.curve.ceX;

		            break;

		        case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
		            this.curve.csY = startCord.y-adjustFact;

		            if (endCord.y < startCord.y-(numberOfHeads * adjustFact))
		            {//head2 toward top
		                this.curve.ceY = endCord.y+adjustFact;	
		                this.curve.crY1 = this.curve.ceY;
		                this.curve.crY2 = this.curve.csY;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		            }
		            else
		            {//head2 toward bottom
		                this.curve.ceY = endCord.y-adjustFact;	
		                if (this.curve.csY < this.curve.ceY)
	                	{
		                	this.curve.crY1 = this.curve.csY-this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.csY-this.oneSideCurveDepth;
	                	}
		                else
		                {
		                	this.curve.crY1 = this.curve.ceY-this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.ceY-this.oneSideCurveDepth;
		                }
		                
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
		            }

		            this.curve.crX1 = this.curve.csX; 
		            this.curve.crX2 = this.curve.ceX;

		            break;

		        case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:

		            this.curve.csX = startCord.x-adjustFact;

		            if (endCord.x < startCord.x-(numberOfHeads * adjustFact))
		            {//head2 toward left
		                this.curve.ceX = endCord.x+adjustFact;	
		                this.curve.crX1 = this.curve.ceX;
		                this.curve.crX2 = this.curve.csX;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
		            }
		            else
		            {//head2 toward right
		                this.curve.ceX = endCord.x-adjustFact;	
		                if (this.curve.csX < this.curve.ceX)
		                {
		                	this.curve.crX1 = this.curve.csX-this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.csX-this.oneSideCurveDepth;
		                }
		                else
		                {
		                	this.curve.crX1 = this.curve.ceX-this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.ceX-this.oneSideCurveDepth;
		                }
		                
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
		            }

		            this.curve.crY1 = this.curve.csY;						
		            this.curve.crY2 = this.curve.ceY;

		            break;

		        case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
		            this.curve.csX = startCord.x+adjustFact;						

		            if (endCord.x > startCord.x+(numberOfHeads * adjustFact))
		            {//head2 toward right
		                this.curve.ceX = endCord.x-adjustFact;	
		                this.curve.crX1 = this.curve.ceX;
		                this.curve.crX2 = this.curve.csX;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
		            }
		            else
		            {//head2 toward left
		                this.curve.ceX = endCord.x+adjustFact;	
		              
		                if (this.curve.csX > this.curve.ceX)
		                {
		                	this.curve.crX1 = this.curve.csX+this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.csX+this.oneSideCurveDepth;
		                }
		                else
		                {
		                	this.curve.crX1 = this.curve.ceX+this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.ceX+this.oneSideCurveDepth;
		                }
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
		            }

		            this.curve.crY1 = this.curve.csY;						
		            this.curve.crY2 = this.curve.ceY;

		            break;
		    }
		}
		else if (preferedHead == "HEAD2")
		{	
		   // console.log("came here999" + this.curve.ceY +","+ preferedHead);

		    switch(preferedHeadDirection)
		    {
		        case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
		           // console.log("came here66 " + this.curve.ceY +","+ preferedHead);
		            this.curve.ceY = endCord.y+adjustFact;

		            if (startCord.y > endCord.y+(numberOfHeads*adjustFact))
		            {
		                //console.log("setting head1 to bottom");
		                this.curve.csY = startCord.y-adjustFact;
		                this.curve.crY1 = this.curve.ceY;
		                this.curve.crY2 = this.curve.csY;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
		            }
		            else
		            {
		                //console.log("setting head1 top");
		                this.curve.csY = startCord.y+adjustFact;
		                if (this.curve.csY > this.curve.ceY)
	                	{
		                	this.curve.crY1 = this.curve.csY+this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.csY+this.oneSideCurveDepth;
	                	}
		                else
		                {
		                	this.curve.crY1 = this.curve.ceY+this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.ceY+this.oneSideCurveDepth;
		                }
		                
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		            }

		            this.curve.crX1 = this.curve.csX; 
		            this.curve.crX2 = this.curve.ceX;

		            break;

		        case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:	
		           
		            this.curve.ceY = endCord.y-adjustFact;

		            if (startCord.y < endCord.y-(numberOfHeads*adjustFact))
		            {
		                //console.log("setting head1 to top");
		                this.curve.csY = startCord.y+adjustFact;
		                this.curve.crY1 = this.curve.ceY;
		                this.curve.crY2 = this.curve.csY;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		            }
		            else
		            {
		                this.curve.csY = startCord.y-adjustFact;
		                if (this.curve.csY < this.curve.ceY)
	                	{
		                	this.curve.crY1 = this.curve.csY-this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.csY-this.oneSideCurveDepth;
	                	}
		                else
		                {
		                	this.curve.crY1 = this.curve.ceY-this.oneSideCurveDepth;
		                	this.curve.crY2 = this.curve.ceY-this.oneSideCurveDepth;
		                }
		                
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;

		            }	

		            this.curve.crX1 = this.curve.csX; 
		            this.curve.crX2 = this.curve.ceX;

		            break;

		        case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
		            this.curve.ceX = endCord.x-adjustFact;

		            if (startCord.x < endCord.x-(numberOfHeads * adjustFact))
		            {//head2 toward left
		                this.curve.csX = startCord.x+adjustFact;	
		                this.curve.crX1 = this.curve.ceX;
		                this.curve.crX2 = this.curve.csX;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
		            }
		            else
		            {//head2 toward right
		                this.curve.csX = startCord.x-adjustFact;	
		                if (this.curve.csX < this.curve.ceX)
		                {
		                	this.curve.crX1 = this.curve.csX-this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.csX-this.oneSideCurveDepth;
		                }
		                else
		                {
		                	this.curve.crX1 = this.curve.ceX-this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.ceX-this.oneSideCurveDepth;
		                }
		               
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
		            }

		            this.curve.crY1 = this.curve.csY;						
		            this.curve.crY2 = this.curve.ceY;

		            break;

		        case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
		            this.curve.ceX = endCord.x+adjustFact;						

		           // console.log("Commehere first" + endCord.x);
		            if (startCord.x > endCord.x+(numberOfHeads * adjustFact))
		            {//head1 toward right
		                this.curve.csX = startCord.x-adjustFact;	
		                this.curve.crX1 = this.curve.ceX;
		                this.curve.crX2 = this.curve.csX;
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
		            }
		            else
		            {//head2 toward left
		                this.curve.csX = startCord.x+adjustFact;	
		                if (this.curve.csX > this.curve.ceX)
		                {
		                	this.curve.crX1 = this.curve.csX+this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.csX+this.oneSideCurveDepth;
		                }
		                else
		                {
		                	this.curve.crX1 = this.curve.ceX+this.oneSideCurveDepth;
		                	this.curve.crX2 = this.curve.ceX+this.oneSideCurveDepth;
		                }
		               
		                otherHeadCalcDirection = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
		            }

		            this.curve.crY1 = this.curve.csY;						
		            this.curve.crY2 = this.curve.ceY;

		            break;
		    }
		}

		if (otherHeadCalcDirection != preferedHeadDirection && otherHeadCalcDirection != otherHeadDirection)
		{
		    switch(otherHeadDirection)
		    {
		        case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
		        case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
		        	
		        	//alert("came here");
		            switch (preferedHeadDirection)
		            {
		                case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
		                case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
		                    //not needed as properly handled
		                    break;
		                case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
		                case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:  
		                    if (preferedHead == "HEAD1")
                            {
		                        this.curve.ceY = endCord.y > startCord.y ?  endCord.y-adjustFact : endCord.y+adjustFact;                        
                                this.curve.ceX = endCord.x;
                                
                                this.curve.crX2 = endCord.x;                       
                                this.curve.crY2 = startCord.y; 
                                this.curve.crX1 = this.curve.crX2;              
                                this.curve.crY1 = this.curve.crY2;
                            }
                            else
                            {
                               // console.log("commig here");
                                this.curve.csY = startCord.y > endCord.y ?  startCord.y-adjustFact : startCord.y+adjustFact;                        
                                this.curve.csX = startCord.x;                                
                                this.curve.crX1 = startCord.x;                       
                                this.curve.crY1 = endCord.y;
                                
                                this.curve.crX2 = this.curve.crX1;              
                                this.curve.crY2 = this.curve.crY1;
                            }                           
                           
		                    otherHeadCalcDirection = endCord.y >= startCord.y ? ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM: ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		                    
		                    break;	          
		            }
		            break;		    
		        case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
		        case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
		            switch (preferedHeadDirection)
                    {
                        case ARROW_HEAD_DIRECTION.TOWARDS_TOP:  
                        case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
                            if (preferedHead == "HEAD1")
                            {
                                this.curve.ceX = endCord.x > startCord.x ?  endCord.x-adjustFact : endCord.x+adjustFact;                        
                                this.curve.ceY = endCord.y;                                
                                this.curve.crX2 = startCord.x;                       
                                this.curve.crY2 = endCord.y;
                                
                                this.curve.crX1 = this.curve.crX2;              
                                this.curve.crY1 = this.curve.crY2;
                            }
                            else
                            {
                                this.curve.csX = startCord.x > endCord.x ?  startCord.x-adjustFact : startCord.x+adjustFact;                        
                                this.curve.csY = startCord.y;                                
                                this.curve.crX1 = endCord.x;                       
                                this.curve.crY1 = startCord.y;
                                
                                this.curve.crX2 = this.curve.crX1;              
                                this.curve.crY2 = this.curve.crY1;
                                
                            }                           
                           
                            otherHeadCalcDirection = endCord.x >= startCord.x ? ARROW_HEAD_DIRECTION.TOWARDS_RIGHT: ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
                            break;                     
                           
                        case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:  
                        case ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
                            //not needed as properly handled
                            break; 
                    }
		            break;      
		    }
		}
		
		switch (arrowHeadSide)
		{
			case ARROW_HEAD_TYPE.LEFT_HEAD:
			case ARROW_HEAD_TYPE.RIGHT_HEAD:
			case ARROW_HEAD_TYPE.TOP_HEAD:
			case ARROW_HEAD_TYPE.DOWN_HEAD:
				console.log("calculated curve end= " + this.curve.ceX +", "+ this.curve.ceY  + ", endCord" +endCord.x+ "," + endCord.y);
				this.curve.ceX = myEndCord.x;
				this.curve.ceY = myEndCord.y;	
				break;
		}
		
		this.curve2.csX = this.curve.ceX;
		this.curve2.csY = this.curve.ceY;
		this.curve2.ceX = this.curve.csX;
		this.curve2.ceY = this.curve.csY;

		this.curve2.crX1 = this.curve.crX2;
		this.curve2.crY1 = this.curve.crY2;
		this.curve2.crX2 = this.curve.crX1;
		this.curve2.crY2 = this.curve.crY1;
		
	    this.curve.Z = " ";
	      	
		this.head1 = this.calculateArrowHead("HEAD1", startCord); 
		//console.log("crurve arrow22:"+ "," + this.curve.csX + "," + this.curve.csY + "," + this.curve.ceX + "," +this.curve.ceY);
		this.head2 = this.calculateArrowHead("HEAD2", endCord);  
		//console.log("crurve arrow:"+ "," + this.curve.csX + "," + this.curve.csY + "," + this.curve.ceX + "," +this.curve.ceY);
		
		this.setShaftWidth(arrowShaftWidth, startCord, endCord);
		
		this.curve.csX = Math.round(this.curve.csX);
		this.curve.csY = Math.round(this.curve.csY);
		this.curve.ceX = Math.round(this.curve.ceX);
		this.curve.ceY = Math.round(this.curve.ceY);
		
		this.curve2.csX = Math.round(this.curve2.csX);
		this.curve2.csY = Math.round(this.curve2.csY);
		this.curve2.ceX = Math.round(this.curve2.ceX);
		this.curve2.ceY = Math.round(this.curve2.ceY);

	}
	
	this.mergeArrowTail= function(headToMearge)
	{
		
		
		if (headToMearge == "HEAD2")
		{
			this.curve.ceX = this.curve2.csX;
			this.curve.ceY = this.curve2.csY;
		}
		else if (headToMearge == "HEAD1")
		{
			this.curve.csX = this.curve2.ceX;
			this.curve.ceY = this.curve2.ceY;
		}
	}
	
	this.getArrowEnd = function()
	{
		var endCord = { x: this.head2.HMX, y: this.head2.HMY };

		switch (this.arrowHeadSide)
		{
			case ARROW_HEAD_TYPE.LEFT_HEAD:
			case ARROW_HEAD_TYPE.RIGHT_HEAD:
			case ARROW_HEAD_TYPE.TOP_HEAD:
			case ARROW_HEAD_TYPE.DOWN_HEAD:
				var p1 = {x:this.curve.ceX, y: this.curve.ceY};
				var p2 = {x:this.curve2.csX, y: this.curve2.csY};
				endCord = SW_SVG_UTIL.midPointBetweenPoints(p1, p2);
				break;
		}

		endCord.x =  Math.round(endCord.x);
		endCord.y =  Math.round(endCord.y);
		
		//console.log("Printing Arrow Path :" + this.getArrowPathStr().dString);
		
		return endCord;
	}
	
	this.printArrowPoints = function ()
	{
		console.log("Printing Arrow Path :" + this.getArrowPathStr().dString);
	}
	
	this.getArrowPathStr = function ()
	{
	    var d1 = null;	
	    
	    if (this.arrowType == ARROW_TYPE.CURVE_ARROW)
	    { 
	        
	    	
	    	d1 = "M"+Math.round(this.curve2.csX)+","+Math.round(this.curve2.csY)+ " "; 
	    	
	    	d1 += this.curve.type + Math.round(this.curve2.crX1)+","+Math.round(this.curve2.crY1)+" "+
	    	Math.round(this.curve2.crX2)+","+Math.round(this.curve2.crY2)+" " +
	    	Math.round(this.curve2.ceX)+","+Math.round(this.curve2.ceY);
	    	
	    	d1 += " L"+Math.round(this.head1.HTX)+","+Math.round(this.head1.HTY)+ 
	    	" L"+Math.round(this.head1.HMX)+","+Math.round(this.head1.HMY)+ 
	    	" L"+Math.round(this.head1.HBX)+","+Math.round(this.head1.HBY)+ 
	    	" L"+Math.round(this.curve.csX) +","+Math.round(this.curve.csY)+" ";
	    	
	    	d1+= this.curve.type+ Math.round(this.curve.crX1)+","+Math.round(this.curve.crY1)+" "+
            Math.round(this.curve.crX2)+","+Math.round(this.curve.crY2)+" " +
            Math.round(this.curve.ceX)+","+Math.round(this.curve.ceY);
            
           if (this.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD || this.arrowHeadSide == ARROW_HEAD_TYPE.TOP_DOWN_HEAD
        	   || this.arrowHeadSide == ARROW_HEAD_TYPE.TOP_RIGHT_HEAD || this.arrowHeadSide == ARROW_HEAD_TYPE.TOP_LEFT_HEAD
        	   || this.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_DOWN_HEAD || this.arrowHeadSide == ARROW_HEAD_TYPE.RIGHT_DOWN_HEAD) 
           { 
        	   d1 += " L"+Math.round(this.head2.HTX)+","+Math.round(this.head2.HTY) + 
        	   " L"+Math.round(this.head2.HMX)+","+Math.round(this.head2.HMY) + 
        	   " L"+Math.round(this.head2.HBX)+","+Math.round(this.head2.HBY) + " ";
           }

           d1 += this.Z;

	    }
	    else if (this.arrowType ==  ARROW_TYPE.LINE_ARROW)
	    {
	        d1 = 
	            "M"+Math.round(this.topLine.X1)+" "+Math.round(this.topLine.Y1)+" L"+Math.round(this.topLine.X2)+","+Math.round(this.topLine.Y2) +
	            " L" + Math.round(this.head1.HTX)+","+Math.round(this.head1.HTY)+" L"+Math.round(this.head1.HMX)+","+Math.round(this.head1.HMY) +
	            " L"+ Math.round(this.head1.HBX)+","+Math.round(this.head1.HBY) +
	            " L" + Math.round(this.bottomLine.X2)+","+Math.round(this.bottomLine.Y2)+" L"+Math.round(this.bottomLine.X1)+","+Math.round(this.bottomLine.Y1);


	        if (this.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD)
	        {
	            d1 += " L" + Math.round(this.head2.HBX)+","+ Math.round(this.head2.HBY) + " L" + Math.round(this.head2.HMX)+","+Math.round(this.head2.HMY) + 
	            " L" + Math.round(this.head2.HTX)+","+ Math.round(this.head2.HTY);
	        }

	        d1 += "Z";
	    }

	   //console.log("d1:  " + d1);
	   return { dString: d1, rAngle: this.rotation.angle, rOriginX: this.rotation.originX , rOriginY: this.rotation.originY }; 
	}
	
	this.getArrowCurveStr = function ()
	{
	    if (this.arrowType == ARROW_TYPE.CURVE_ARROW)
	    {
	        var d1 = 
	            "M"+this.curve.csX+","+this.curve.csY+" "+this.curve.type+
	            this.curve.crX1+","+this.curve.crY1+" "+
	            (this.curve.crX2 ? this.curve.crX2+","+this.curve.crY2+" " : "")+
	            this.curve.ceX+","+this.curve.ceY + " " + this.curve.Z;

	        return d1;
	    }
	    else
	    {
	        return null;
	    }
	}
}

var ARROW_HEAD = function ()
{
    arrowHead  = {
            HTX:0,
            HTY:0,
            HMX:0,
            HMY:0,
            HBX:0,
            HBY:0,	
    };

	return arrowHead;
}

var ARROW_LINE = function ()
{
    arrowLine =  {
            X1:0, // X1 Y1---X2 Y2
            Y1:0,
            X2:0,
            Y2:0,
    }

    return arrowLine;

}

//Chrome adding SVGElement method getTransformToElement
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
	return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

SVGElement.prototype.isSWSVGElement = function () {

    if (this.SWSVGShape !== undefined)
    {
        return true;
	}
	
	return false;
}

SVGElement.prototype.getSWSVGElement = function () {
	
	if (this.SWSVGShape !== undefined)
	{
		return this.SWSVGShape;
	}
	
	return null;
}

//snap.svg multitext plugin
Snap.plugin(function (Snap, Element, Paper, glob) 
{
    Paper.prototype.createFOText = function (x1, y1, width, height, isInnerText) 
    {
        //console.log("trying to create object text");
        var myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var textdiv = document.createElement("div");   
      
        textdiv.style.width = "99.8%";
        textdiv.style.height = "99.8%";
        textdiv.style.wordWrap = "break-word";
        textdiv.style.overflow = "auto";
        
        //textdiv.style.display = "table";
        if (!isInnerText)
        {
            textdiv.style.boxsizing = "border-box";
            textdiv.style.MozBoxSizing = "border-box"; /* Code for Firefox to work prpperly */
            textdiv.style.border ="0.1px solid #ff0000";
            textdiv.style.MozBorder ="0.1px solid #ff0000";  /* Code for Firefox to work prpperly  */
            textdiv.style.background = "#fcefa1";
           // var textnode = document.createTextNode("Click to edit Text"); 
           // var textnode = document.createTextNode(""); 
           // textdiv.appendChild(textnode);
            textdiv.classList.add("insideforeign"); //to make div fit text
            textdiv.id="swforeign_" + getUniqueId();
            textdiv.contentEditable = "true";
        }
        else
        {
            var textdiv1 = document.createElement("div");
            textdiv.appendChild(textdiv1);     
            textdiv.style.textAlign = "center";
            textdiv.style.display = "table";
            textdiv1.style.verticalAlign  = "middle";
            textdiv1.style.display = "table-cell" ;  
            textdiv1.style.overflow = "auto";  
            textdiv1.style.wordWrap = "break-word";
            textdiv1.contentEditable = "true";
            textdiv.style.tableLayout ="fixed";
            //textdiv1.className = "enableBackSpace";
            textdiv1.classList.add("insideforeign"); //to make div fit text
            textdiv1.id="swforeign_" + getUniqueId();
        }
       
        //var elementMousedown = this.setTextMouseDown.bind(this, textdiv);
        //$(textdiv).mouseup(function () { textdiv.addEventListener("mousedown", elementMousedown, false) });

        myforeign.setAttribute("x", x1);
        myforeign.setAttribute("y", y1);
        myforeign.setAttribute("width", width);
        myforeign.setAttribute("height", height);
        
        //myforeign.style.border ="0.1px solid #ff0000";
        //myforeign.style.background = "#fcefa1";
        
        //if (!isInnerText) { myforeign.style.borderColor = "red"; }


        myforeign.appendChild(textdiv);

        //this.SVGAsDom.appendChild(myforeign);
        //var p = Snap.parse( "<svg>" + myforeign.outerHTML + "/svg" );
        //var tmp = createSVGForeignObject(this.svgCanvas);
        //var p = Snap.parse(tmp);  
        //console.log("tmp:  "+ tmp);
        
        
        var p = Snap.parse(myforeign.outerHTML);    
        var g = this.group().append(p);

        g.addClass("SWSVGForeignObj");

        g.attr({
            width: width,
            height: height,     
        });

        return g;
    };

	Paper.prototype.multitext = function (x, y, txt) 
	{
		txt = txt.split("\n");
		var t = this.text(x, y, txt);
		t.selectAll("tspan:nth-child(n+2)").attr({
			dy: "1.2em",
			x: x
		});
		return t;
	};
	
	Paper.prototype.linearrow = function (startX, startY, endCordX, endCordY, arrowHeadSide, arrowLineType, optionalParam)
	{
		var minHeadWidth = null;
		var mergeArrowTail = false; 
		var shaftDepth = 0;
		
		if ( optionalParam)
		{
			if (optionalParam.minHeadWidth)
			{	minHeadWidth = optionalParam.minHeadWidth; }
			
			if (typeof optionalParam.mergeArrowTail !== undefined && optionalParam.mergeArrowTail)
			{ mergeArrowTail = true;	}
			
			if (optionalParam.shaftDepth)
			{
				shaftDepth = optionalParam.shaftDepth;
			}
		}
		
		var startCord = { x: startX, y: startY };
		var endCord = { x:endCordX, y: endCordY };
		
		var arrowPath = new ARROW_PATH(ARROW_TYPE.LINE_ARROW);
		
		if (!minHeadWidth || typeof minHeadWidth == undefined)
        { 
            minHeadWidth = 10;
        } 
 
		arrowPath.setMinHeadWidth(minHeadWidth);       
        
		arrowPath.calculateLineArrowCord(startCord, endCord, arrowHeadSide, arrowLineType);
		
		var aPath = arrowPath.getArrowPathStr();	
			   
		var lineArrow = this.path(aPath.dString);
		if (aPath.rAngle != 0) { lineArrow.rotate(aPath.rAngle, aPath.rOriginX, aPath.rOriginY);	} 
		return lineArrow;
	}
	
	Paper.prototype.curvearrow = function (startX, startY, endCordX, endCordY, arrowHeadSide, arrowLineType, optionalParam)		 
	{
		var minHeadWidth = null;
		var mergeArrowTail = false;
		
		var arrowShaftDepth = 0;
		
		var arrowShaftWidth = 0; //default
		var arrowHeadWidth = 0; //default
		var arrowHeadHeight = 0; //default

		if ( optionalParam)
		{
			if (optionalParam.minHeadWidth)
			{	minHeadWidth = optionalParam.minHeadWidth; }
			
			if (typeof optionalParam.mergeArrowTail !== undefined && optionalParam.mergeArrowTail)
			{ mergeArrowTail = true;	}
			
			if (optionalParam.shaftWidth)
			{ arrowShaftWidth = optionalParam.shaftWidth; }
			
			if (optionalParam.shaftDepth)
			{ arrowShaftDepth = optionalParam.shaftDepth; }
			
		}
		var startCord = { x: startX, y: startY };
		var endCord = { x:endCordX, y: endCordY };
		
		var curveArrow = new ARROW_PATH(ARROW_TYPE.CURVE_ARROW);
		
		var arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
		var arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
//		 alert(arrowHeadSide);
		 
		switch (arrowHeadSide)
		{
		    case ARROW_HEAD_TYPE.TOP_DOWN_HEAD:
		        arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		        arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
		        break;

		    case ARROW_HEAD_TYPE.TOP_RIGHT_HEAD:	       
		        arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		        arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
		        break;
		        
		    case ARROW_HEAD_TYPE.TOP_LEFT_HEAD:	           
	            arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
	            arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
	            break;
	            
		    case ARROW_HEAD_TYPE.LEFT_DOWN_HEAD:	           
	            arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
	            arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
	            break;
	            
		    case ARROW_HEAD_TYPE.RIGHT_HEAD:
		    	arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_RIGHT;
				arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_LEFT;
				var tmp = {x: startCord.x, y: startCord.y };
				startCord = {x: endCord.x, y: endCord.y };
				endCord = tmp;
				break;
		    case ARROW_HEAD_TYPE.TOP_HEAD:
		    	 arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		    	 arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
		    	 break;
		    case ARROW_HEAD_TYPE.DOWN_HEAD:
		    	 arrowHead1Direction = ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM;
		    	 arrowHead2Direction = ARROW_HEAD_DIRECTION.TOWARDS_TOP;
		    	 var tmp = {x: startCord.x, y: startCord.y };
		    	 startCord = {x: endCord.x, y: endCord.y };
		    	 endCord = tmp;
		    	 break;
		    	
	            
		}

		if (!minHeadWidth || typeof minHeadWidth == undefined)
		{ 
		    minHeadWidth = 10;
		} 
		
		curveArrow.setMinHeadWidth(minHeadWidth);
		if (arrowShaftDepth != 0 ) 
		{ curveArrow.setShaftDepth(arrowShaftDepth); }
		
		curveArrow.calculateCurveArrowCord(startCord, endCord, arrowHeadSide, "HEAD1", 
				arrowHead1Direction, arrowHead2Direction, arrowHeadHeight, arrowHeadWidth, arrowShaftWidth);
		if (mergeArrowTail)
		{ curveArrow.mergeArrowTail("HEAD2"); }
		
		var aPath = curveArrow.getArrowPathStr();
		var cArrow = this.path(aPath.dString);
		return cArrow;
	}
	
	Paper.prototype.cubicurve = function (x1, y1, x2, y2, crX1, crY1, crX2, crY2) 
	{
		var curvePath = new Object;	
		curvePath.type = "C"; curvePath.Z = " ";
		curvePath.csX = x1; curvePath.csY = y1;	curvePath.ceX = x2;	curvePath.ceY = y2;
		curvePath.crX1 = crX1;	curvePath.crY1 = crY1;
		curvePath.crX2 = crX2;	curvePath.crY2 = crY2;

		var d1 = 
			"M"+curvePath.csX+","+curvePath.csY+" "+curvePath.type+
			curvePath.crX1+","+curvePath.crY1+" "+
			(curvePath.crX2 ? curvePath.crX2+","+curvePath.crY2+" " : "")+
			curvePath.ceX+","+curvePath.ceY + " " + curvePath.Z;

		var cubicCurve = this.path(d1);
		return cubicCurve;
		
	}
	
	Paper.prototype.arcUsingCenter = function (x, y, radiusX, radiusY, startAngle, endAngle, largeArcFlag)
	{
		function polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) 
		{
			var angleInRadians = (angleInDegrees) * Math.PI / 180.0;

			return {
				x: centerX + (radiusX * Math.cos(angleInRadians)),
				y: centerY + (radiusY * Math.sin(angleInRadians))
			};
		}

		var start = polarToCartesian(x, y, radiusX, radiusY, endAngle);
		var end = polarToCartesian(x, y, radiusX, radiusY, startAngle);

		//var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

		var d1 = [
		         "M", start.x, start.y, 
		         "A", radiusX, radiusY, 0, largeArcFlag, 0, end.x, end.y
		         ].join(" ");

		var arc = this.path(d1);
		
		//var arc = this.circle(10,10,3);		
		return arc;  
	}
	
	Paper.prototype.arc = function (x1, y1, x2, y2, largFalg, sweepFalg, arX, arY) 
	{
		var curvePath = new Object;			
		
		var startCord = {x: x1, y:y1};
		var endCord = {x: x2, y: y2};
		
		curvePath.csX = startCord.x;
		curvePath.csY = startCord.y;
		curvePath.ceX = endCord.x;
		curvePath.ceY = endCord.y;

		curvePath.type="A";
		
		//alert(typeof arX);
		if (!arX || !arY || typeof arX === undefined || typeof arY === undefined)
		{
			//alert("here" +typeof arX);
			curvePath.arX = Math.abs(SW_SVG_UTIL.distanceBetweenPoints(startCord, endCord))/2; //arc redius X
			curvePath.arY = curvePath.arX; //arc redius Y
		}
		else
		{
			curvePath.arX = arX;
			curvePath.arY = arY;
		}
		curvePath.axR = 0; //arc x axis rotation
		curvePath.alf = largFalg; //arc large flag
		curvePath.asf = sweepFalg; //arc sweep flag
		
		var d1 = 
			"M"+parseInt(curvePath.csX)+","+parseInt(curvePath.csY)+" "+curvePath.type+
			curvePath.arX+","+curvePath.arY+" "+curvePath.axR+" "+ parseInt(curvePath.alf) + " "+ 
			parseInt(curvePath.asf) +" "+
			parseInt(curvePath.ceX)+","+parseInt(curvePath.ceY);
		
		var arc = this.path(d1);
		return arc;
	};
	
	Paper.prototype.getSVGScaleFactor = function() 
	{
		var scaleX = this.node.getBoundingClientRect().width/$(this.node).width();
		var scaleY = this.node.getBoundingClientRect().height/$(this.node).height();
		//console.log("SVG Width and heigth " + $(this.SVGAsDom).width() +"," + $(this.SVGAsDom).height());
		//console.log("SVG Width and heigth after scalling:: " + this.SV bbbbbGAsDom.getBoundingClientRect().width +"," + this.SVGAsDom.getBoundingClientRect().height);	
		//console.log("SVG scale factor : " + scaleX + "," + scaleY);
		return {x: scaleX, y: scaleY};
	}
	
	Paper.prototype.convertToSVGPoint = function (xCord, yCord, inCordSystem, shapeElement)
	{
		var pt1 = this.node.createSVGPoint();
		pt1.x = xCord;//Math.min(scaleX,scaleY); //evt.clientX;
		pt1.y = yCord;//Math.min(scaleX,scaleY); //evt.clientY;
		var scaleFactor = this.getSVGScaleFactor();
		
		//console.log("SVG scale factor222  :"+ scaleFactor.x +"," + scaleFactor.y +","+
		//		 this.SVGAsDom.getBoundingClientRect().x);
		if (inCordSystem == SW_CORD_SYSTEM_TYPE.HTML)
		{
			//console.log("Cord system : HTML for XY :" + xCord +"," + yCord);
			//console.log("SVG point for SVGAsDom pt1 : "+ pt1.x +"," + pt1.y);
			var pt2 = pt1.matrixTransform(this.node.getScreenCTM().inverse());	
			//console.log("SVG point for SVGAsDom  : "+ pt2.x +"," + pt2.y);
			
			//getScreenCTM has bug in firefox, when container has css tranformation it does not apply that transfomation so 
			//svg pt x, y cordinate is wrong
			//so commented above code add added line below for lines
			
			/*var pt2 = this.SVGAsDom.createSVGPoint();
			pt2.x = pt1.x - this.SVGAsDom.getBoundingClientRect().left;//Math.min(scaleX,scaleY); //evt.clientX;
			pt2.y = pt1.y- this.SVGAsDom.getBoundingClientRect().top;*/
			
			//console.log("shapeElement"+ shapeElement + this.SVGAsDom.getBoundingClientRect().left);
			
			pt2.x /= scaleFactor.x;
			pt2.y /= scaleFactor.y;	
			
			//Apply Svg Scale Factor
			//console.log("shapeElement"+ shapeElement);
			
			
			
			if (shapeElement)
			{
				var ptXY = pt2.matrixTransform(shapeElement.node.getTransformToElement(this.node).inverse());
				//console.log("SVG point : "+ ptXY.x +"," + ptXY.y);
				return ptXY;
			}
			else
			{
				//console.log("SVG point for SVGAsDom pt2 : "+ pt2.x +"," + pt2.y);
				var ptXY = pt2.matrixTransform(this.node.getTransformToElement(this.node).inverse());
				//console.log("SVG point for SVGAsDom  : "+ ptXY.x +"," + ptXY.y);
				return ptXY;
			}		
		}
		else //SVG
		{
			//console.log("Cord system: SVG");
			var pt1 = shapeElement.parent().node.createSVGPoint();

			pt1.x /= scaleFactor.x;
			pt1.y /= scaleFactor.y;
			if (shapeElement)
			{
				var ptXY = pt1.matrixTransform(shapeElement.node.getTransformToElement(shapeElement.parent().node).inverse());
				return ptXY;
			}
			else
			{
				//console.log("SVG point for SVGAsDom pt1 : "+ pt1.x +"," + pt1.y);
				var ptXY = pt1.matrixTransform(this.node.getTransformToElement(this.node).inverse());
				//console.log("SVG point for SVGAsDom  : "+ ptXY.x +"," + ptXY.y);
				return ptXY;
			}
		}

	}
});

//snap.svg skew plugin
Snap.plugin(function(Snap, Element, Paper, global) 
{
	Element.prototype.swSingleDrag = function(onMove, onStart, onStop, myEvent) {
		
		var startDrag=false;
		var draggingStarted=false;
		
		var moveX=0, moveY=0; // keeps track of overall transformation
		var clickX, clickY; // stores cursor location upon first click
		var lastMoveX=0, lastMoveY=0; // stores previous transformation (move)
		
		var myElem = this.node;
		var myPaper = this.paper.node;
		var myIdentifier = "swElemDragId_" + getUniqueId();	

		var myElMouseDown = null;
		var myElMouseUp = null;
		var myElMouseMove = null;
		
		var elStartDrag = function (evt)
		{	
			console.log("MS..................swDrag elStartDrag....");
			//console.log("mousedown event: "+evt.type+ ","+evt.target)
			console.log("drag starting x,y: " + evt.clientX + ","+ evt.clientY);
			//var target = evt.target || evt.srcElement;
			
			moveX=0, moveY=0; // keeps track of overall transformation
			lastMoveX=0, lastMoveY=0; // stores previous transformation (move)
		
		    startDrag = false;
		    draggingStarted = true;
		    
			clickX = evt.clientX;
			clickY = evt.clientY;

			if (typeof onStart === 'function')
			{					 
				onStart(clickX, clickY, evt);
			}			
			
			console.log("MS..................swDrag elStartDrag Done....");
		}
		
		var elMouseMove = function (evt)
		{ 
			
			//console.log("draging element id : " + myIdentifier);	

			if (startDrag)
			{
				elStartDrag(evt);
			}

			console.log("MS..................swDrag elStartDrag Move....");
			if (draggingStarted)
			{
				moveX = lastMoveX + ( evt.clientX - clickX );
				moveY = lastMoveY + ( evt.clientY - clickY );

				if (typeof onMove === 'function')
				{
					console.log("draging drag dx:"+ moveX+  ", dy:" +moveY);
					onMove(moveX, moveY, evt.clientX, evt.clientY, evt);
				}
				else
				{
					console.log("draging element on move is not a function ");
				}
			}
			
			console.log("MS..................swDrag elStartDrag Move Done....");
		}
		
		var elMouseDown = function (evt)
		{
			console.log("MS..................swDrag elMouseDown....");
			startDrag = true;
		}
	
		var elMouseUp = function (evt)
		{ 
			console.log("MS..................swDrag elMouseUp....");
			//alert("paper" + myPaper);
			if (document)
			{
				//$(document).unbind('mousemove.' + myIdentifier);
				//$(document).unbind('mousedown.' + myIdentifier);
				//$(document).unbind('mouseup.' + myIdentifier);	
				$(document).unbind('mouseup', myElMouseUp);
				$(document).unbind('mousemove', elMouseMove);			
				$(document).unbind('mousedown', myElMouseDown);		
				
				document.removeEventListener('mouseup', myElMouseUp);
				document.removeEventListener('mousemove', elMouseMove);
				document.removeEventListener('mousedown', myElMouseDown);
				
			}
			
			console.log("draging stop : " + myIdentifier);
			
			var wasDraggingStarted = draggingStarted;
			
			startDrag=false;
			draggingStarted=false;
			
			lastMoveX = moveX;
			lastMoveY = moveY;
			
			if (typeof onStop === 'function' && wasDraggingStarted)
			{	
				onStop(lastMoveX,lastMoveY, evt);
			}			

			moveX=0, moveY=0; // keeps track of overall transformation
			lastMoveX=0, lastMoveY=0; // stores previous transformation (move)*/
		}
			
		myElMouseDown = elMouseDown.bind(this);
		myElMouseUp = elMouseUp.bind(this);
		myElMouseMove = elMouseMove.bind(this);
		
		console.log("MS..................Adding swDrag ");
		//$(document).bind('mouseup.' + myIdentifier, myElMouseUp);
		//$(document).bind('mousemove.' + myIdentifier, elMouseMove);			
		//$(document).bind('mousedown.' + myIdentifier, myElMouseDown);	
		
		//$(document).bind('mouseup', myElMouseUp);
		//$(document).bind('mousemove', elMouseMove);			
		//$(document).bind('mousedown', myElMouseDown);		
		
		document.addEventListener('mouseup', myElMouseUp);
		document.addEventListener('mousemove', elMouseMove);
		document.addEventListener('mousedown', myElMouseDown);
		
		//var tmmousemove = function () { console.log("SNAP svg mouse moving");}
		//this.parent().mousemove(tmmousemove);
		
		console.log("added mouse move");
	};
	

	
	

	
	Element.prototype.swDrag = function(onMove, onStart, onStop) 
	{ 
	    if (!this.swmyDragFn)
	    {
	        this.swUndrag();
	        //alert("Paper"+this.paper);
	        var swmyDrag = new SWSnapDrag(this.paper, onMove, onStart, onStop);  
	        //this.drag(swmyDrag.myMove, swmyDrag.myStart, swmyDrag.myStop);
	        this.swmyDragFn = swmyDrag.dragMouseDown.bind(swmyDrag);
	        this.node.addEventListener('mousedown', this.swmyDragFn);
	    }
	    else
	    {
	        console.log("swDrag: already added.");
	    }
	    
	    return;

	    //this.mySwSingleDrag = this.swSingleDrag.bind(this, onMove, onStart, onStop);
	   // $(this.node).bind('mousedown', this.mySwSingleDrag);
	}

	Element.prototype.swUndrag = function() 
	{	
	    if (this.swmyDragFn && typeof this.swmyDragFn === 'function')
	    {    
	        this.node.removeEventListener('mousedown', this.swmyDragFn);
	        this.swmyDragFn = null;
	        console.log("MS.................swUndrag: passes remove swdrag.");
	    }
	    else
	    {
	       // console.log("swUndrag: failed to remove drag, drag is not added.");
	    }
	    
	    return;

	  //  console.log("MS..................swUndrag ");
	  //  if (typeof this.mySwSingleDrag === 'function')
	   // {
	        //alert ("swUnDrag"+ this.mySwSingleDrag);
	  //      $(this.node).unbind('mousedown', this.mySwSingleDrag);
	  //  }
	};


	Element.prototype.skew = function(angleX,angleY) 
	{
		var bbox = this.getBBox();
		var m = new Snap.Matrix(1,Snap.rad(angleY),Snap.rad(angleX),1,0,0);
		var dx = m.x(bbox.cx, bbox.cy) - bbox.cx;
		var dy = m.y(bbox.cx, bbox.cy) - bbox.cy;
		m.translate(-dx, -dy)
		this.transform(m);
	};
	
	Element.prototype.rotate = function (AngleInDegree, rotateOriginX, rotateOriginY)
	{
		var myMatrix = this.transform().localMatrix;
		myMatrix.rotate(AngleInDegree, rotateOriginX, rotateOriginY);		
		this.attr({ transform: myMatrix.toTransformString() });
	}

	//return in degree;
	Element.prototype.getRotationAngle = function ()
	{
		var splitedMatrix = this.transform().localMatrix.split();
		if (splitedMatrix.rotate < 0) { splitedMatrix.rotate+=360; } 
		console.log("rotation angle : " + splitedMatrix.rotate);
		
		return splitedMatrix.rotate;
	}

	/*
	How to use example
var s = Snap("#svg");
var block = s.rect(100, 100, 100, 100);
block.skew(90,0); // try (0,90 for skewY)
	 */
	
	
	Element.prototype.parseCurvePath = function (ignoreCurveArrow)
	{
		var curvePath = new Array;
		
		if (this.type != "path")
		{
			curvePath.type = "U";  //unknown
			return curvePath;
		}
		
//		alert("ignoreCurveArrow222"+ignoreCurveArrow + ","+ typeof ignoreCurveArrow)
		if (typeof ignoreCurveArrow === undefined) { ignoreCurveArrow = true; } 
		
		
		curvePath.Z = null;
		
		var isOnlyCurve = true;
		
		//console.log("svg Data length: " +this.shape.node.getPathData().length);

		var segments = this.node.getPathData();	
		for (var counter=0; counter<segments.length; counter++)
		{
			var seg = segments[counter];
			if (seg.type === "M") 
			{
				curvePath.csX = seg.values[0];
				curvePath.csY = seg.values[1];			
				//console.log(`M curvePath.csX curvePath.csY`);

			}
			else if (seg.type === "L" || seg.type === "l") //Not expected in cubic/quadratic/arc curve
			{
				isOnlyCurve = false;		
				
				if (ignoreCurveArrow)
				{
					curvePath.type = "P"; // caan be cureArrow
					return curvePath;
				}
				
				curvePath.type=seg.type;
				
				var x = seg.values[0];
				var y = seg.values[1];			
				//console.log(`L ${x} ${y}`);
			}
			else if (seg.type === "C") 
			{	
				curvePath.type=seg.type;
				curvePath.crX1 = seg.values[0];
				curvePath.crY1 = seg.values[1];
				curvePath.crX2 = seg.values[2];
				curvePath.crY2 = seg.values[3];
				curvePath.ceX = seg.values[4];
				curvePath.ceY = seg.values[5];	

				//console.log(`C curvePath.crX1 curvePath.crY1 curvePath.crX2, curvePath.crX2, curvePath.ceX  curvePath.ceY`);			
			} 
			else if (seg.type === "A") 
			{
				console.log("Processing arc");
				curvePath.type=seg.type;
				curvePath.arX = seg.values[0]; //arc redius X
				curvePath.arY = seg.values[1]; //arc redius Y
				curvePath.axR = seg.values[2]; //arc x axis rotation
				curvePath.alf = seg.values[3]; //arc large flag
				curvePath.asf = seg.values[4]; //arc sweep flag
				curvePath.ceX = seg.values[5];
				curvePath.ceY = seg.values[6];
				
				console.log(curvePath.type + ","+curvePath.arX  + ","+curvePath.arY  + ","+ curvePath.axR  + ","+curvePath.alf  + ","+
						    curvePath.asf + ","+ curvePath.ceX  + ","+ curvePath.ceY);		
			}
			else if (seg.type === "Z" || seg.type === "z") 
			{
				curvePath.Z=seg.type;
			}
			else 
			{
				isOnlyCurve = false;
			}
		}	

		/*console.log("Curve path: " + curvePath.csX + ", "+ curvePath.csY +", "+ curvePath.crX1 +", "
				+  curvePath.crY1+", "+ curvePath.crX2 +", "+ curvePath.crY2 +", "+
				curvePath.ceX+", "+ curvePath.ceY +  "," + curvePath.Z);*/

		
		if (!isOnlyCurve)
		{
			if (seg.type == "L" || seg.type == "l")
			{
				curvePath.type = "CA"; /*cureArrow */
			}
			else
			{
				curvePath.type = "P"; /*other path */
			}
		}
		
		return curvePath;
	}
});

//Snap svg prepend/append plugin(brint to front/send back)
Snap.plugin(function (Snap, Element, Paper, glob) 
{
    var elproto = Element.prototype;
   
    Paper.prototype.hasTemplate = function()
    {
        var templElem = this.node.getElementsByClassName("SWTemplate");

        if (templElem.length > 0)
        {
           // console.log("template is present");
            return true;
        }
        
        console.log("template is absent");
        return false;
    }
    
    elproto.makeTemplate = function()
    {    
        this.addClass("SWTemplate");
        this.toBack();
    }
    
    elproto.isTemplate = function(element)
    {
        return (this.hasClass("SWTemplate") ||
                this.parent().hasClass("SWTemplate")) ? true : false;
    }
    
    elproto.toFront = function () {
        this.appendTo(this.paper);
    };
    
    elproto.toBack = function () {
    	console.log("this paper is : " + this.paper);
        this.prependTo(this.paper);
        
        //keep defs and desc as first elements        
        for (var i=0; i<3; i++)
        {
        	var elem = this.getNext();        	
        	if (elem && (elem.type == "defs" || elem.type == "desc" || elem.hasClass("SWTemplate")))
        	{	
        		console.log("toBack:" + elem.type);
        		elem.prependTo(this.paper);      
        	}
        }	    
    };
    
    elproto.getPrevious = function () {
    	var elem = this.node.previousSibling;    	
    	if (elem)
    	{
    		elem = Snap._.wrap(elem);
    		
    		if (elem.type == "defs" || elem.type == "desc")
    		{
    			return null;
    		}
    		
    		return elem;
    	}
    	else 
    	{	return null;   	}
    };
    
    elproto.getNext = function () 
    {
    	var elem = this.node.nextSibling;   
    	
    	if (elem)
    	{  
    		//alert("Next element is " + elem.outerHTML);
    		return Snap._.wrap(elem);
    	}
    	else 
    	{	return null; }
    };
    
});

Snap.plugin( function( Snap, Element, Paper, global ) {
	Paper.prototype.circlePath = function(cx,cy,r) {
		var p = "M" + cx + "," + cy;
		p += "m" + -r + ",0";
		p += "a" + r + "," + r + " 0 1,0 " + (r*2) +",0";
		p += "a" + r + "," + r + " 0 1,0 " + -(r*2) + ",0";
		return this.path(p, cx, cy );

	};
});

Snap.plugin( function( Snap, Element, Paper, global ) {
	Paper.prototype.ellipsePath = function(cx, cy, rx, ry) {
		var p = "M" + (cx-rx)+ "," + cy;
		p += "a" + rx + "," + ry + " 0 1,0 " + (rx*2) +",0";
		p += "a" + rx + "," + ry + " 0 1,0 " + -(rx*2) + ",0"; 	
		return this.path(p, cx, cy );

	};
});

Snap.plugin( function( Snap, Element, Paper, global ) {
	Paper.prototype.linePath = function(x1, y1, x2, y2) {
		var p = "M "+ x1+" "+ y1 +"L " + x2 + " " + y2;
		var newPath = this.path(p);
		
		newPath.setLinePathLength = function (x1, y1, x2, y2) { 
			newPath.attr({ d: "M "+ x1+" "+ y1 +"L " + x2 + " " + y2 }); 
			return newPath; 
		};
		
		return newPath;
	};
	
});

Snap.plugin( function( Snap, Element, Paper, global ) {	
	
	Paper.prototype.startKeyEvents = function(onKeyEvent) {
		//alert("adding event" +this);
		$(this.node).keydown(onKeyEvent);
		$(this.node).keyup(onKeyEvent);
		//$(this.node).bind('keydown', onKeyEvent);
		//$(this.node).bind('keyup', onKeyEvent);
	};
	
	Paper.prototype.stopKeyEvents = function(handler) {
		//alert("adding stop event");
		$(this.node).unbind('keydown', handler);
		$(this.node).unbind('keyup', handler);
	};
});

Snap.plugin( function( Snap, Element, Paper, glob ) {	
	
    Snap.getSnapElement = function (domElem, className) {
        var target1 = $(domElem).parents("." + className)[0];

        if (typeof target1 === undefined || target1 == null)
        {               
            target1 = domElem;
        }
        
        return Snap._.wrap(target1);
    }
    
    //depricated as result is not expected
	Snap.getElementOfClassByPoint = function (x, y, className) {
		
		var target = Snap.getElementByPoint(x,y);
		
		if (!target) {	return null; }				
		
		var target1 = $(target.node).parents("." + className)[0];
		
		if (typeof target1 === undefined || target1 == null)
		{   			
			target1 = target.node;
		}
		
		//alert(target1.outerHTML);
		
		return Snap._.wrap(target1);
	}
	
});

//******************************************************************************************************

//****************************************************************************************
function loadSVGEdit()
{
	alert("Starting SVG Editor Here.");

	//mySVGToolBar = new SVGToolBar();

	svgObject = createSVGCanvas(document.body);
	mySVGCanvas = new SW_SVGCanvas(svgObject);
	mySVGCanvas.drawCircle();

	mySVGCanvas.drawCircle();
}

function createSVGForeignObject(s)
{
	var fobjectSVG = '<foreignObject width="80" height="20">';
		fobjectSVG +='<div contentEditable=true style="width:100%;height:100%;background-color: #fcefa1;border:10px solid #ff0000; -moz-box-sizing: border-box; box-sizing: border-box;">'
		fobjectSVG +='just text..';
			
		fobjectSVG +='</div>';
		fobjectSVG +='</foreignObject>';
	
	//  var fobjectSVG = '<foreignObject width="80" height="20"><p contentEditable=true>Text Here...</p></foreignObject>';	
	//var p = Snap.parse(fobjectSVG);
	//var g = s.group().append(p);
	return fobjectSVG;
}

function createSVGCanvas(elemToAppend)
{
	//console.log("SW SVG: creating new svg Canvas");
	var d = new Date();  
	svgCanvasId = "svgCanvas_" + d.getTime();

	var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	e.setAttribute('width', '100%');
	e.setAttribute('height', '100%');
	//e.setAttribute('width', '731');
	//e.setAttribute('height', '548');

	//e.setAttribute("viewBox", "0 0 733 550"); 
	//e.setAttribute("preserveAspectRatio", "xMidYMid meet"); 

	e.setAttribute('swtoolname', 'svgshapes');
	e.id=svgCanvasId;

	if (typeof elemToAppend !== typeof undefined)
	{
		e.setAttribute('style', 'border: 1px solid black');
		elemToAppend.appendChild(e);
		//setSVGCanvasViewBox(e);
	}

	//return e.outerHTML;
	return e;
}

function setSVGCanvasViewBox(e)
{
	var vw = $(e).width();
	var vh = $(e).height();
	//alert("vw "+ vw + vh +"," +  e.getBoundingClientRect().width);

	vbStr="0 0 " + vw + " " + vh ;
	e.setAttribute("viewBox", vbStr); 
	e.setAttribute("preserveAspectRatio", "xMidYMid meet"); 

}

function getAllocatedSVGCanvasToDaraw()
{
	return SVG_CANVAS_IN_USE;
}

function allocSVGCanvasToDaraw(svgCanvasToUse)
{
	//console.log("Allocating canvas to draw");
	SVG_CANVAS_IN_USE = svgCanvasToUse;
}

function isSVGCanvasAllocated()
{
	if (SVG_CANVAS_IN_USE)
	{
		return true;
	}
	else
	{
		return false;
	}	
}

function freeSVGCanvasToDaraw()
{
	SVG_CANVAS_IN_USE = null;
}

/////////////*********************
//class declered for swdrag
var SWSnapDrag = function(canvas, onMove, onStart, onStop)
{
    SWSnapDrag.isMousePressed = false;
    this.isFirstMove = true;
    this.moveX=0, this.moveY=0; // keeps track of overall transformation
    this.clickX=0, this.clickY=0; // stores cursor location upon first click
    this.myIdentifier = "swElemDragId_" + getUniqueId();
    this.paper = canvas;
    
    this.myElMouseDown = null;
    this.myElMouseUp = null;
    this.myElMouseMove = null;
    
    this.elMouseUp = function(evt)
    {
        console.log("MS11111111111111::::::::::mouse up happend, id:" + this.myIdentifier+"fn:"+
                this.myElMouseMove);                
       // SWSnapDrag.isMousePressed = false;
       // startDrag=false;
      //  draggingStarted=false;
        this.isFirstMove = true;           

        document.removeEventListener('mousemove', this.myElMouseMove);
        //either snap svg or document mouse up unregister
        //document.removeEventListener('mouseup', this.myElMouseUp);
        //this.paper.unmouseup(this.myElMouseUp);
        var dx=this.moveX, dy=this.moveY;
        this.clickX=0; this.clickY=0; 
        this.moveX=0, this.moveY=0; // keeps track of overall transformation  
        onStop(dx,dy, evt);    
    }

    this.elMouseMove = function(evt)
    {
        console.log("MS11111111111111::::::::::mouse move happened, id:" + this.myIdentifier +"mouse pressed:" +
                + SWSnapDrag.isMousePressed);         
        if (this.isFirstMove && SWSnapDrag.isMousePressed)
        {
            //console.log("first move....");                   
            this.isFirstMove = false;
            this.moveX=0, this.moveY=0; // keeps track of overall transformation   
            this.clickX = evt.clientX;
            this.clickY = evt.clientY;
            
            onStart(this.clickX,this.clickY, evt);
            //alert("first move");
        }
        
        if (SWSnapDrag.isMousePressed)
        {
           //console.log("moving evt.clientX "+ evt.clientX +", clickX"+ this.clickX);
      
            this.moveX = evt.clientX - this.clickX;
            this.moveY = evt.clientY - this.clickY;
            //   console.log("MS22: dx "+ this.moveX);
            onMove(this.moveX, this.moveY, evt.clientX, evt.clientY, evt);  
        }
        else
        {
          //  console.log("MS.....Tryig to handle erronomus condit where mouse move up is missed for this instance so event listenrs are not unregistered");
          //  document.removeEventListener('mousemove', arguments.callee);
            this.elMouseUp(evt);
        }
    }
    
    this.dragMouseDown = function(evt)//(dx, dy, X,Y, evt) 
    {
        // console.log("moving it now");
     //   SWSnapDrag.isMousePressed = true;

        if(evt.which != 1)
        {
            return; //not left button
        }
        
        this.moveX=0, this.moveY=0; // keeps track of overall transformation   
        this.clickX = evt.clientX;
        this.clickY = evt.clientY;
        
        this.isFirstMove = true; 
        if (!this.myElMouseMove)
        {
            this.myElMouseMove = this.elMouseMove.bind(this);
        }
        document.addEventListener('mousemove', this.myElMouseMove);
        // this.myElMouseUp = this.elMouseUp.bind(this);//function() { alert("mouse up"); }
        //   alert("Moue pressed");
        //aaded seperate mouse move listener as sometimes snap svg drag move does not provide any signal
        
        //  document.addEventListener('mouseup', this.myElMouseUp);
        //alert(this.paper);
        //  this.paper.mouseup(this.myElMouseUp);
    }
}

SWSnapDrag.mousePressed = function()
{
    SWSnapDrag.isMousePressed = true;
}

SWSnapDrag.mouseReleased = function()
{
    //this is also set by ckeditor drop event reisterd on ckedotor instance ready
    //a ckedito drop blocks mouse up
    SWSnapDrag.isMousePressed = false;
}
//******************************************************************************************************
var SW_SVG_UTIL = function () {}

SW_SVG_UTIL.distanceBetweenPoints = function(p1, p2) 
{
	//console.log("distnce point"+ p1.x+","+p1.y+ ","+ p2.x+","+p2.y);
	return Math.sqrt( Math.pow( p2.y - p1.y, 2 ) + Math.pow( p2.x - p1.x, 2 ) );
}

SW_SVG_UTIL.pointAtDistance = function(p1, p2, atDist)
{
	var len = SW_SVG_UTIL.distanceBetweenPoints(p1, p2);
	var ratio = atDist/len;
	
	if (ratio < 0 || ratio > 1)
	{
		console.log("distance is not on line ");
		return null;
	}
	
//	console.log("distance is on line : Line length :"+ len +", ratio "+ratio);
	var pt = {x: (1-ratio)*p1.x+ratio*p2.x, y: (1-ratio)*p1.y+ratio*p2.y};
	
	return pt;
}

SW_SVG_UTIL.midPointBetweenPoints = function(p1, p2)
{
	var len = SW_SVG_UTIL.distanceBetweenPoints(p1, p2);
	var ratio = 0.5//len/2/len;
	
	if (ratio < 0 || ratio > 1)
	{
		console.log("distance is not on line ");
		return null;
	}
	
//	console.log("distance is on line : Line length :"+ len +", ratio "+ratio);
	var pt = {x: (1-ratio)*p1.x+ratio*p2.x, y: (1-ratio)*p1.y+ratio*p2.y};
	
	return pt;
}

SW_SVG_UTIL.pathDistanceBetweenTwoPoints  = function(path, x1, x2)
{
    var pathLength = path.getTotalLength();
    var distance = 0, distance1;
    while (distance < pathLength && x1 > path.getPointAtLength(distance))
        distance1 = distance++;
    while (distance < pathLength && x2 > path.getPointAtLength(distance))
        distance++;
    return distance - distance1;
}

//Converts from degrees to radians.
SW_SVG_UTIL.angleToRadians = function(degrees) 
{
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
SW_SVG_UTIL.angleToDegrees = function(radians) 
{
  return radians * 180 / Math.PI;
};

//angle between line AB and line BC 
SW_SVG_UTIL.angleBetweenTwoLines = function (A,B,C)
{
	 var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
	 var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
	 var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
	 return SW_SVG_UTIL.angleToDegrees(Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)));
}

//angle between two points wrto x axis of pt1
SW_SVG_UTIL.angleBetweenTwoPoints = function (pt1, pt2)
{
	var dY = pt1.y - pt2.y;
	var dX = pt1.x - pt2.x;
	return 180+(Math.atan2(dY,dX) / Math.PI * 180.0);
}


SW_SVG_UTIL.closestPoint = function (pathNode, point) 
{
	var pathLength = pathNode.getTotalLength(),
	precision = 8,
	best,
	bestLength,
	bestDistance = Infinity;
	// linear scan for coarse approximation
	for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
		if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
			best = scan, bestLength = scanLength, bestDistance = scanDistance;
		}
	}
	// binary search for precise estimate
	precision /= 2;
	while (precision > 0.5) {
		var before,
		after,
		beforeLength,
		afterLength,
		beforeDistance,
		afterDistance;
		if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
			best = before, bestLength = beforeLength, bestDistance = beforeDistance;
		} else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
			best = after, bestLength = afterLength, bestDistance = afterDistance;
		} else {
			precision /= 2;
		}
	}
	//best = [best.x, best.y];
	best.distance = Math.sqrt(bestDistance);
	return best;
	function distance2(p) {
		var dx = p.x - point.x,
		dy = p.y - point.y;
		return dx * dx + dy * dy;
	}
}

SW_SVG_UTIL.getRediusOfEllipseAtAngle = function(radiusX, radiusY, angleAngleWithX)
{
	//console.log("radiusX"+ radiusX+ "radiusY"+ radiusY+ "angleAngleWithX" + angleAngleWithX + "Math.sin(angleAngleWithX)"+Math.sin(angleAngleWithX));
	
	var s = Math.sin(angleAngleWithX);
	var c = Math.cos(angleAngleWithX);
	var redusAtAngle = (radiusX * radiusY) / Math.sqrt((radiusX*radiusX)*(s*s)+(radiusY*radiusY)*(c*c))

	return redusAtAngle;
}

SW_SVG_UTIL.getArcCenter = function(curvePth)
{
	//alert("curvePth11" + curvePth.type);
	var ps = new Array;  
	ps.x = curvePth.csX;
	ps.y = curvePth.csY;

	var pe = new Array;
	pe.x = curvePth.ceX;
	pe.y = curvePth.ceY;

	var rh = curvePth.arX;
	var rv = curvePth.arY;
	var rot = curvePth.axR;
	var fa = curvePth.alf;
	var fs = curvePth.asf;

	// function for calculating angle between two vectors
	var angle = function(u, v) {
		var sign = ((u.x * v.y - u.y * v.x) > 0) ? 1 : -1;
		return sign * Math.acos(
				(u.x * v.x + u.y * v.y) /
				(Math.sqrt(u.x*u.x + u.y*u.y) * Math.sqrt(u.x*u.x + u.y*u.y))
		);
	}
	// sanitize input
	rot = rot % 360;
	rh = Math.abs(rh);
	rv = Math.abs(rv);

	// do calculation
	var cosRot = Math.cos(rot);
	var sinRot = Math.sin(rot);

	var x = cosRot * (ps.x - pe.x) / 2 + sinRot * (ps.y - pe.y) / 2;
	var y = -1 * sinRot * (ps.x - pe.x) / 2 + cosRot * (ps.y - pe.y) / 2;

	var rh2 = rh * rh; 
	var rv2 = rv * rv; 
	var x2 = x * x; 
	var y2 = y * y;

	var tmp = Math.sqrt((rh2 * (rv2 - y2) - rv2 * x2) /(rh2 * y2 + rv2 * x2));               

	var fr = ((fa == fs) ? -1 : 1) * ((tmp) ? tmp: 0);                 

	var xt = fr * rh * y / rv;
	var yt = -1 * fr * rv * x / rh;


	var cx = cosRot * xt - sinRot * yt + (ps.x + pe.x) / 2;
	var cy = sinRot * xt + cosRot * yt + (ps.y + pe.y) / 2;
	var vt = { x:(x-xt)/rh, y:(y-yt)/rv };
	var phi1 = angle({ x:1, y:0 }, vt);
	var phiD = angle(vt, { x:(-x-xt)/rh, y:(-y-yt)/rv }) % 360;
	var phi2 = phi1 + phiD;

	return [{ x: cx, y: cy }, { x:phi1, y:phi2 }];
}
//***********************************************************************************************
var SW_SVG_ICON = function (iconType, addSubIconExtender)
{
	var iconCanvas = new SW_SVG_SNAP();
	var icon = null;
	vw = 26;
	vh = 26;
	vbStr="0 0 " + vw + " " + vh ;
	iconCanvas.attr({"viewBox": vbStr, "preserveAspectRatio": "xMidYMid meet"}); 
	
	headWidth=5;
	
	switch (iconType)
	{
	    case SVG_ICON_FILL_COLOR:  	   
	        var csX = 13, csY = 11, ceX = 14, ceY = 20;         
            icon = iconCanvas.polyline(14,4,2,8,2,16,14,12).attr({ stroke: '#123456', 'strokeWidth': 1, fill: 'gray' });
            icon  = iconCanvas.ellipse(14, 8, 2,4).attr({ stroke: '#123456', 'strokeWidth': 1, fill: 'gray' , "fill-opacity": "1"});
            icon = iconCanvas.cubicurve(csX, csY, ceX, ceY, csX+6, csY, ceX+6, ceY).attr({ stroke: 'red', 'strokeWidth': 3, fill: 'gray' , "fill-opacity": "0.0", "stroke-opacity": "1"});
            icon  = iconCanvas.arc(14, 18, 19, 18, 1, 0,8,4).attr({ stroke: '#123456', 'strokeWidth': 0, fill: 'red' , "fill-opacity": "1"});
            icon  = iconCanvas.arc(10, 8, 12, 6, 1, 1,0.4,2).attr({ stroke: '#123456', 'strokeWidth': .5, fill: 'red' , "fill-opacity": "0.0"});

            break
		case SVG_SLIDE:
			icon = iconCanvas.rect(2,3, 20, 20).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			break;
		case SVG_SLIDES:
			icon = iconCanvas.rect(2,3, 5, 5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(10,3, 5, 5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(18,3, 5,5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(2,11, 5, 5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(10,11, 5, 5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(18,11, 5,5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(2,19, 5, 5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(10,19, 5, 5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(18,19, 5,5).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'white' , "fill-opacity": "0.5"});
			break;
		case SVG_OPEN:
            icon = iconCanvas.polyline(3,24,3,12, 8,12).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.3"});

            icon = iconCanvas.polyline(9,13,9,4,15,4,20,8,20,13).attr({ stroke: '#123456', 'strokeWidth': 1, fill: 'white' , "fill-opacity": "0.9"});
            icon = iconCanvas.polyline(5,22,5,22,5,7,9,7).attr({ stroke: '#123456', 'strokeWidth': 0.5, fill: 'white' , "fill-opacity": "0.9"});
            icon = iconCanvas.polyline(15,4,15,8,20,8).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.5"});
            var iconRect = iconCanvas.rect(5,13,18,11,2,2).attr({ stroke: '#123456', 'strokeWidth': 0.8, fill: '#123456' , "fill-opacity": "0.8"});
            iconRect.skew(-25, 0);
		    break;
		case SVG_SAVE:
			icon  = iconCanvas.polygon(1,3, 1,24, 23,24, 23,10, 18,3).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0"});
			icon  = iconCanvas.polyline(5,24, 5,16, 19,16, 19,24 ).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.3"});
			icon  = iconCanvas.polyline(5,3, 5,12, 10,12, 10,3).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.7"});
			icon  = iconCanvas.polyline(16,3, 16,12, 8,12).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0"});
			break;
		case SVG_SOURCE:
			icon  = iconCanvas.polygon(1,3, 1,24, 23,24, 23,10, 18,3).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0"});
			icon  = iconCanvas.polyline(16,2, 16,10, 23,10 ).attr({ stroke: '#123456', 'strokeWidth': 0, fill: '#123456' , "fill-opacity": "0.7"});
			icon = iconCanvas.text(1,20, "Source").attr({textpath: "M2,10L24,24",  'font-size':6, stroke: '#123456', 'strokeWidth': 0.8, fill: '#123456' , "fill-opacity": "0.9"});
			icon = iconCanvas.line(3,8, 14, 8).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "1"});
			icon = iconCanvas.line(3,14, 20, 14).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "1"});
			icon = iconCanvas.line(3,19, 20, 19).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "1"});

			break;
		case SVG_UNDO:
			icon  = iconCanvas.curvearrow(4, 6, 9, 25, ARROW_HEAD_TYPE.LEFT_HEAD,
					ARROW_SHAFT_TYPE.THICK_SHAFT, { minHeadWidth: 7/*headWidth*/,shaftWidth: 5,
													mergeArrowTail: true, shaftDepth: 10,
			}).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_REDO:
			icon  = iconCanvas.curvearrow(17,25,22, 6, ARROW_HEAD_TYPE.RIGHT_HEAD,
					ARROW_SHAFT_TYPE.THICK_SHAFT, { minHeadWidth: 7/*headWidth*/, shaftWidth: 5,
													mergeArrowTail: true, shaftDepth: 10,
			}).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_ELLIPSE:
			icon = iconCanvas.circle(12,14, 11).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0.5"});
			break;
		case SVG_RECTANGLE:
			icon = iconCanvas.rect(2,3, 20, 20).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0.5"});	
			break;
		case SVG_LINE:
			icon = iconCanvas.line(2,3,20,20).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' });
			break;
		case SVG_POLYLINE:
			icon = iconCanvas.polyline(2,3,20,10,20,15, 2,20).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0.0"});;	
			break;
		case SVG_CUBIC_CURVE:			
			var csX = 2, csY = 10, ceX = 20, ceY = 10;
			icon = iconCanvas.cubicurve(csX, csY, ceX, ceX, csX+30, csY-30, ceX-30, ceY+30).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' , "fill-opacity": "0.0"});
			break;	
		case SVG_ARC:			
			icon  = iconCanvas.arc(2, 10, 20, 20, 1, 1).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' , "fill-opacity": "0.0"});
			break;
		case SVG_LEFT_THIN_ARROW:
			icon  = iconCanvas.linearrow(4, 3, 30, 30, ARROW_HEAD_TYPE.LEFT_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_RIGHT_THIN_ARROW:
			icon  = iconCanvas.linearrow(4, 3, 24, 24, ARROW_HEAD_TYPE.RIGHT_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_LEFT_RIGHT_THIN_ARROW:
			icon  = iconCanvas.linearrow(4, 3, 24, 24, ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_LEFT_ARROW:
			icon  = iconCanvas.linearrow(2, 10, 25, 20, ARROW_HEAD_TYPE.LEFT_HEAD,
					ARROW_SHAFT_TYPE.THICK_SHAFT, {minHeadWidth :headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0.5"});
			break;
		case SVG_RIGHT_ARROW:
			icon  = iconCanvas.linearrow(2, 10, 25, 20, ARROW_HEAD_TYPE.RIGHT_HEAD,
					ARROW_SHAFT_TYPE.THICK_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0.5"});
			break;
		case SVG_LEFT_RIGHT_ARROW:
			icon  = iconCanvas.linearrow(1, 10, 25, 20, ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD,
					ARROW_SHAFT_TYPE.THICK_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "0.5"});
			break;
			
		case SVG_LEFT_CURVE_ARROW:			
			icon  = iconCanvas.curvearrow(2, 6, 24, 22, ARROW_HEAD_TYPE.LEFT_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_RIGHT_CURVE_ARROW:				
			icon  = iconCanvas.curvearrow(2, 6, 24, 20, ARROW_HEAD_TYPE.RIGHT_HEAD,
						ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth : headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_LEFT_RIGHT_CURVE_ARROW:
			icon  = iconCanvas.curvearrow(2, 6, 24, 20, ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_TOP_CURVE_ARROW:			
			icon  = iconCanvas.curvearrow(8, 4, 24, 26, ARROW_HEAD_TYPE.TOP_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth : headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_DOWN_CURVE_ARROW:				
			icon  = iconCanvas.curvearrow(1, 2, 18, 24, ARROW_HEAD_TYPE.DOWN_HEAD,
						ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth : headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
			
		case SVG_TOP_DOWN_CURVE_ARROW:			
			icon  = iconCanvas.curvearrow(8, 2, 18, 24, ARROW_HEAD_TYPE.TOP_DOWN_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		
		case SVG_TOP_RIGHT_CURVE_ARROW:
			icon  = iconCanvas.curvearrow(8, 2, 24, 20, ARROW_HEAD_TYPE.TOP_RIGHT_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
		case SVG_LEFT_DOWN_CURVE_ARROW:
			icon  = iconCanvas.curvearrow(2, 6, 18, 24, ARROW_HEAD_TYPE.LEFT_DOWN_HEAD,
					ARROW_SHAFT_TYPE.THIN_SHAFT, {minHeadWidth: headWidth }).attr({ stroke: '#123456', 'strokeWidth': 2, fill: '#123456' , "fill-opacity": "1"});
			break;
			
		case SVG_TABLE:
			icon = iconCanvas.rect(2,4, 20, 6).attr({ stroke: '#123456', 'strokeWidth': 0.1, fill: '#123456' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(2,4, 20, 20).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.0"});
			icon = iconCanvas.line(2,10, 22, 10).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.5"});
			icon = iconCanvas.line(2,17,22, 17).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.5"});
			icon = iconCanvas.line(8,4,8, 24).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.5"});
			icon = iconCanvas.line(16,4,16, 24).attr({ stroke: '#123456', 'strokeWidth': 1, fill: '#123456' , "fill-opacity": "0.5"});
			break;
			
		case SVG_TEXT:
			icon = iconCanvas.rect(2, 4, 20, 6).attr({ stroke: '#123456', 'strokeWidth': 0.1, fill: '#123456' , "fill-opacity": "0.5"});
			icon = iconCanvas.rect(7.9,10, 7.9, 26).attr({ stroke: '#123456', 'strokeWidth': 0.1, fill: '#123456' , "fill-opacity": "0.5" });
			icon = iconCanvas.text(1,20, "Text").attr({ stroke: '#123456', 'strokeWidth': 0.8, fill: '#123456' , "fill-opacity": "0.9"});
			break;
	}
	
   
	if (addSubIconExtender)
	{
		icon = iconCanvas.polyline(20, 18, 24, 22, 20,26).attr({ stroke: '#123456', 'strokeWidth': 0.0, fill: 'maroon' , "fill-opacity": "1"});
	}
	//alert(":"+iconCanvas);
	return iconCanvas;
}
//***********************************************************************************************
var SW_SVG_SNAP = function (height, width, elemToAppend)
{
	
	if (typeof height === typeof undefined || !height)
	{
		height = "100%";
	}
	
	if (typeof width === typeof undefined || !width)
	{
		width = "100%";
	}
	
	function createSVGCanvas()
	{
		//console.log("SW SVG: creating new svg Canvas");
		var d = new Date();  
		svgCanvasId = "svgCanvas_" + d.getTime();

		var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		e.setAttribute('width', width);
		e.setAttribute('height', height);
		//e.setAttribute('swtoolname', 'svgshapes');
		e.id=svgCanvasId;

		if (typeof elemToAppend !== typeof undefined)
		{
			//e.setAttribute('style', 'border: 1px solid black');
			elemToAppend.appendChild(e);
		}
		
		return e;
	}
	
	var svgCanvas = createSVGCanvas();
	
	return Snap(svgCanvas);
}
//******************************************************************************************************
var SW_ToolBar = function (toolBarContainer)
{
	this.subToolDialog = null;
	this.toolBarContainer = null;
	this.controlBtnCSS = "SWEditorControlBtn svgTool";
	this.mouseInSubToolDialog = false;
	
	if (toolBarContainer) 
	{
		this.toolBarContainer = toolBarContainer;
	}

	this.setToolCSS = function(myControlBtnCSS)
	{
		this.controlBtnCSS = myControlBtnCSS;
	}
	 
	this.splitLine = function()
	{	
		var controlBtnDiv = document.createElement("div");
		this.toolBarContainer.appendChild(controlBtnDiv);
	}
	
	this.removeAllTools = function()
	{
		this.toolBarContainer.innerHTML = "";
	}
	
	this.addTool = function(displayLabel, tooltip, callbackFunction, toolCSS)
	{
		if (!this.toolBarContainer)
		{
			console.log("this.toolBarContainer is invalid " + this.toolBarContainer);
			return this;
		}	
		
		var controlBtnDiv = document.createElement("div");
		
		if (displayLabel)
		{
			console.log("type of dialpay label" +typeof displayLabel);
			try 
			{
				controlBtnDiv.appendChild(displayLabel);
			}
			catch (evt)
			{
				controlBtnDiv.innerHTML = displayLabel;
			}
		}
		
		
		
		this.toolBarContainer.appendChild(controlBtnDiv);	
		
		if (toolCSS)
		{
			controlBtnDiv.className = toolCSS;
		}
		else
		{
			controlBtnDiv.className = this.controlBtnCSS;
		}
	
		//callbackFunction("INIT", controlBtnDiv);
		
		if (tooltip && tooltip != "")
		{
			//console.log("adding tooltip1 for: "+ tooltip);
			//debugger;
			$(controlBtnDiv).attr('title', tooltip);
			$(controlBtnDiv).tooltip({
				content: tooltip,
				//tooltipClass: "tooltipStyling",
				track:true,
				show: false, //remove effect
				hide: false,  //remove effect
				open: function( event, ui ) {}
			});
		}
		
		$(controlBtnDiv).mouseleave(function (evt) {
			if (typeof callbackFunction === "function")
			{
				callbackFunction(evt)
			}
		});	
		
		$(controlBtnDiv).mouseenter(function (evt) {
			if (typeof callbackFunction === "function")
			{
				callbackFunction(evt)
			}
		});	
		
		controlBtnDiv.onclick = function (evt) 
		{
			if ($(controlBtnDiv).tooltip && tooltip != "")
			{
				$(controlBtnDiv).tooltip( "close");
			}
			
			if (typeof callbackFunction === "function")
			{
				callbackFunction(evt, controlBtnDiv)
			}
			else 
			{
				console.log("callback function for ["+ displayLabel +"] in invalid" );
			}
		}
		
		return controlBtnDiv;
	} 
	
	//for submenu if want to display
	this.createSubToolDialog = function(elementDivToDisplay, onCloseCallback, positionJSON,
			                               canAutoDestroySubMenu, canCloseOnOutsideClick, canDragSubMenu,
			                               optionalParam)
	{
		this.destroySubToolDialog();
		
		var title = "";
		if( optionalParam)
		{
			if(optionalParam.title)
			{
				title=optionalParam.title;
			}
		}
		
		var localCallbackClose = function ()
		{
			if (typeof onCloseCallback === 'function')
			{
				onCloseCallback();
			}
			
			elementDivToDisplay.remove();
			this.subToolDialog = null;
		}

		var callbackClose = localCallbackClose.bind(this);
		
		param = {
				width: "auto",
				showDefaultButtons : false,
				closeCallBack: callbackClose,
				closeOnOutSideClick: canCloseOnOutsideClick,
				disableBackround : false,
				position: positionJSON,
				enableShowHideAnimation: false,
				dragable: canDragSubMenu,
		};
		
		this.subToolDialog = createOverlay_3(elementDivToDisplay, param); 
		
		if (!canDragSubMenu)
		{
			hideOverlayTitle(this.subToolDialog);
		}
		else
		{
			setOverlayTitle(this.subToolDialog, title);
		}
		setOverlayWidgetTransparent(this.subToolDialog);
		
		if (canAutoDestroySubMenu)
		{
			var localOnMouseOut = function ()
			{
				if (this.mouseInSubToolDialog)
				{
					this.mouseInSubToolDialog = false;
					
					var localCloseMe = function()
					{
						if (this.subToolDialog)
						{
							closeOverlay(this.subToolDialog);
							this.subToolDialog = null;
							this.mouseInSubToolDialog = false;
						}
					}

					var closeMe = localCloseMe.bind(this);
					setTimeout(closeMe, 0);

				}
			}

			var localOnMouseIn = function ()
			{
				console.log("mouse in subtool dialog");
				this.mouseInSubToolDialog = true;
			}

			var onMouseOut = localOnMouseOut.bind(this);		
			var onMouseIn = localOnMouseIn.bind(this);	

			$(this.subToolDialog).mouseleave(onMouseOut);		 
			$(this.subToolDialog).mouseenter(onMouseIn);
		}
	}

	this.destroySubToolDialog = function()
	{
		if (this.subToolDialog)
		{
			closeOverlay(this.subToolDialog);
			this.subToolDialog = null;
			this.mouseInSubToolDialog = false;
		}		
	}
	
	this.subTooDrgable = function(boolCanDrag)
	{
		if (this.subToolDialog)
		{
			setOverlayDrgable(this.subToolDialog, boolCanDrag);
		}
	}
	
	this.isSubToolDialogActive = function()
	{
		return this.mouseInSubToolDialog;
	}
	
	this.resizeSubToolDialogHeight = function()
	{
	    if (this.subToolDialog)
	    {
	        setOverlayHeight(this.subToolDialog, "auto");
	    }
	}
	//return this;
}

//******************************************************************************************************


var SW_SVGDocumentToolBar = function (SWCanvas, toolBarContainer)
{	
    //depricated but code kept
	this.SWCanvas = SWCanvas;
	this.toolBarContainer = toolBarContainer;	
	
	
	this.addDocumentTools = function (SWCanvas)
	{
		SVGHistoryObj = SWCanvas.canvasHistory;
		
		var getSource = function (evt) { 		
			if (evt.type != "click")
			{
				return;
			}
			
			var source = SWCanvas.getSource();
			alert("Source:\n" + source); 
		};
		
		
		var saveSVG = function (evt) {
			
			if (evt.type != "click")
			{
				return;
			}
			
			var source = SWCanvas.getSource();
			//alert(":"+source)
			var fileName = "";
			var header = "";
			var fileSaver = new SW_FileSaver;
			fileSaver.saveHTMLFile(source, header, fileName)
		};
			
		this.addTool("Undo", "Undo", function (evt, controlBtnDiv) { 
			if (evt.type != "click")
			{
				return;
			}
			
			SWCanvas.unselectAllElements(true); //do not record
			SVGHistoryObj.undo() 
		});
		
		this.addTool("Redo", "Redo", function (evt, controlBtnDiv) { 
			if (evt.type != "click")
			{
				return;
			}
			
			SWCanvas.unselectAllElements(true); //do not record
			SVGHistoryObj.redo() 
		});	
	
		var myGetSource = getSource.bind(SWCanvas);
		var mySaveSVG = saveSVG.bind(SWCanvas);
		
		this.addTool("Save", "Save", mySaveSVG);
		this.addTool("Source", "Source", myGetSource);
	}
	
	return this;
}

//Inherit from SW_ToolBar
SW_SVGDocumentToolBar.prototype = new SW_ToolBar(); 

//******************************************************************************************************

var SW_SVGToolBar = function (SWElementToAttach, SWSvgCanvas,extToolBarContainer)
{
	this.attachedShape = SWElementToAttach;
	this.SWSvgCanvas = SWSvgCanvas;
	
	
	//this.toobarName;
	//alert("Created SVG Toolbar");
	this.svgToolContainer = document.createElement("div");
	this.svgToolContainer.className = "menuBarContainer";
	
	this.toolBarContainer = this.svgToolContainer;	
	
	extToolBarContainer.appendChild(this.svgToolContainer);
	

	var myColorTool = this.fillColorTool.bind(this);
	//this.addTool("Fill-Color", "Fill-Color", myColorTool);
	this.addTool(new SW_SVG_ICON(SVG_ICON_FILL_COLOR), "Fill-Color", myColorTool, "SWEditorControlBtn inHorizontalpanel");

	var myBorderColorTool = this.borderColorTool.bind(this);
	this.addTool("Border-Color", "Border-Color", myBorderColorTool);

	var myBirngToFrontTool = this.birngToFrontTool.bind(this);
	this.addTool("Bring-Front", "Bring-Front", myBirngToFrontTool);
	
	var mySendToBackTool = this.sendToBackTool.bind(this);
	this.addTool("Send-Back", "Send-Back", mySendToBackTool);
	
	var myDeleteTool = this.deleteTool.bind(this);
	this.addTool("Delete", "Delete", myDeleteTool);
}

//Inherit from SW_ToolBar
SW_SVGToolBar.prototype = new SW_ToolBar(); 

SW_SVGToolBar.prototype.destroy = function()
{
	this.svgToolContainer.remove();	
}

SW_SVGToolBar.prototype.showColorTool = function(toolType, currentColor, currentOpacity, buttonDisplayed)
{
	var myshape = this.attachedShape;
	var newColor  = currentColor;	
	var newOpacity = currentOpacity;
	
	var colorPicker = document.createElement("text");
	colorPicker.id= "fillcol";
	colorPicker.height = "100px";
	
	$(colorPicker).attr('data-opacity', currentOpacity);
	$(colorPicker).val(currentColor);
	
	var colorOverlayDiv = document.createElement("div");
	
	var opacityLabel = document.createElement("text");
	//opacityLabel.innerHTML =  "1 &ensp; OPACITY &ensp; 0";
	opacityLabel.className = "makeLabel verticalsvg";
	var mysvg = new SW_SVG_SNAP(150, 20, opacityLabel);
	
	var textBlock = mysvg.text(3, 13, "1");
	textBlock.attr("style", "fill: white;")
    textBlock = mysvg.text(10,20, "Opacity");
	textBlock.attr({textpath: "M4,50L4,120",  'font-size':13 }); 
	textBlock.attr("style", "fill: white;")
    textBlock = mysvg.text(3, 147, "0");
	textBlock.attr("style", "fill: white;");
	
	var colorBrLabel = document.createElement("br");
	var colorHexLabel = document.createElement("span");
	colorHexLabel.innerHTML = "Color: ";
	var colorHexVal = document.createElement("text");
	colorHexVal.innerHTML = newColor;
//	colorHexVal.style.minWidth = "00px";
	colorHexVal.style.display = "inline-flex";
	colorHexVal.contentEditable = true;
	colorHexVal.onblur = function()
	{
		var isHexaColor = function (sNum) {
			  return  /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(sNum);
		}
		
		if (!isHexaColor(colorHexVal.innerHTML))
		{
			colorHexVal.innerHTML = newColor; 
		}
		else
		{
			$(colorPicker).minicolors('value', colorHexVal.innerHTML);
			if (toolType == "FILL-COLOR")
			{ 
				myshape.setFillColor(hex, newOpacity, false); //nor record  
			}
			else
			{		
				myshape.setBorderColor(hex, newOpacity, false);
			}
		}
	}; 
	
	colorHexVal.onkeyup = function()
	{
		//alert("on change");
		var isHexaColor = function (sNum) {
			  return  /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(sNum);
		}
		
		if (isHexaColor(colorHexVal.innerHTML))
		{
			$(colorPicker).minicolors('value', colorHexVal.innerHTML);
			if (toolType == "FILL-COLOR")
			{ 
				myshape.setFillColor(hex, newOpacity, false); //nor record  
			}
			else
			{		
				myshape.setBorderColor(hex, newOpacity, false);
			}
		}
	}; 
	
	var colorOpacityVal = document.createElement("span");
	colorOpacityVal.innerHTML = currentOpacity;
	
	var colorHexDiv = document.createElement("div");
	colorHexDiv.className = "makeLabel";
	colorHexDiv.style.width = "170px";
	colorHexDiv.appendChild(colorHexLabel);
	colorHexDiv.appendChild(colorHexVal);
	
	var opcacityDiv = document.createElement("div");
	opcacityDiv.className = "makeLabel";
	opcacityDiv.style.width = "50px";
	opcacityDiv.appendChild(colorOpacityVal);
	
	
	colorOverlayDiv.appendChild(colorPicker);
	colorOverlayDiv.appendChild(opacityLabel);
	colorOverlayDiv.appendChild(colorBrLabel);
	colorOverlayDiv.appendChild(colorHexDiv);
	colorOverlayDiv.appendChild(opcacityDiv);
	
	
	
	var finallyChangeColor = function()
	{		
		if (toolType == "FILL-COLOR")
		{ 
			myshape.setFillColor(currentColor, currentOpacity, false); //not record
			myshape.setFillColor(newColor, newOpacity, true); //record			
		}
		else
		{		
			myshape.setBorderColor(currentColor, currentOpacity, false);
			myshape.setBorderColor(newColor, newOpacity, true); //record		
		}		
	}
	
	var positionJSON = null;
	
	if (buttonDisplayed)
	{
		positionJSON = { my: "right top", at: "right bottom", of: buttonDisplayed };
	}
	
	var bSubToolAutoDestroy = false;
	var bSubToolDrag = false;
	this.createSubToolDialog(colorOverlayDiv, finallyChangeColor, positionJSON, 
			              bSubToolAutoDestroy, true, bSubToolDrag); ////close on outsize click

	$(colorPicker).minicolors({
		letterCase: 'uppercase',		
		format: 'hex',
		defaultValue: currentColor,	
		opacity : true,
		inline: true,	
		position: 'bottom left',
		change: function(hex, opacity) {
			 console.log("change" + hex + ": "+ newOpacity);
			newColor = hex;
			newOpacity = null;
			if(opacity)	{ newOpacity = Number(Math.round(opacity+'e'+1)+'e-'+1); }
			
			colorHexVal.innerHTML = hex;
			colorOpacityVal.innerHTML = newOpacity;
			if (toolType == "FILL-COLOR")
			{ 
				myshape.setFillColor(hex, newOpacity, false); //nor record  
			}
			else
			{		
				myshape.setBorderColor(hex, newOpacity, false);
			}
		}
	});
}

SW_SVGToolBar.prototype.fillColorTool = function(evt, buttonDisplayed)
{
	if (evt.type == "click")
	{
		var currentColor = this.attachedShape.getFillColor();
		var currentOpacity = this.attachedShape.getFillOpacity();
		this.showColorTool( "FILL-COLOR", currentColor, currentOpacity, buttonDisplayed);
	}
}


SW_SVGToolBar.prototype.borderColorTool = function(evt, buttonDisplayed)
{
	
	if (evt.type == "click")
	{
		var currentColor = this.attachedShape.getBorderColor();
		var currentOpacity = this.attachedShape.getBorderOpacity();
		this.showColorTool( "BODER-COLOR", currentColor, currentOpacity, buttonDisplayed);
	}
}

SW_SVGToolBar.prototype.birngToFrontTool = function(evt, buttonDisplayed)
{
	if (evt.type == "click")
	{
		this.attachedShape.birngToFront();
	}
}

SW_SVGToolBar.prototype.sendToBackTool = function(evt, buttonDisplayed)
{
	if (evt.type == "click")
	{
		this.attachedShape.sendToBack();
	}
}

SW_SVGToolBar.prototype.deleteTool = function(evt, buttonDisplayed)
{
	if (evt.type == "click")
	{
		this.SWSvgCanvas.deleteElement(this.attachedShape, true);
	}
}
//******************************************************************************************************
var SW_Recorder = function ()
{
	var myUndoFunction = null;
	var myRedoFunction = null;	
	
	this.recordUndoFunction = function (undoFunction)
	{
		if (typeof undoFunction === "function")
		{
			myUndoFunction = function () { undoFunction(); }
		}
		else
		{
			console.log ("undoFunction supplied is not function");					
		}
		
	}
	
	this.recordRedoFunction = function (redoFunction)
	{
		if (typeof redoFunction === "function")
		{
			myRedoFunction = function () { redoFunction(); }
		}		
		else
		{
			console.log ("redoFunction supplyed is not function");					
		}		
	}
	
	this.getUndoFunction = function () { return myUndoFunction; }
	this.getRedoFunction = function () { return myRedoFunction; }
	this.reset = function () {  myUndoFunction = null;  myRedoFunction = null; }
	
	return this;
}

/*
//Test Code
myRec = new SW_Recorder;
myRec.recordUndoFunction( function () { alert(" Undo Record"); })
myRec.recordRedoFunction( function () { alert(" Redo Record"); })
	
myRec.getUndoFunction()();	
myRec.getRedoFunction()();
*/
//*****************************************************************************************************
var SW_SVGHistoryManager = function ()
{
	var lockId = null;
	var undoManager = new UndoManager();

	this.addToHistory = function (undoFunction, redoFunction)
	{
		undoManager.add({
			
			undo: function() 
			{  
				//alert("Undo Called");
				if (typeof undoFunction === "function")
				{
					undoFunction(); 
				}
				else
				{
					console.log ("undoFunction supplyed is not function");					
				}
			},

			redo: function()
			{
				//alert("Redo Called");
				if (typeof redoFunction === "function")
				{
					redoFunction();
				}		
				else
				{
					console.log ("redoFunction supplyed is not function");					
				}
			}
		});
		
		
		console.log("Added to history");
		//undoManager.undo();
	}

	this.recordHistory = function (SW_Recorder)
	{
		this.addToHistory(SW_Recorder.getUndoFunction(), SW_Recorder.getRedoFunction() );			
	}
	
	this.undo = function (myLockId) 
	{ 
	    try
	    {
	        if (!lockId) 
	        {
	            undoManager.undo(); 
	        }
	        else if (myLockId && myLockId == lockId)
	        {
	            undoManager.undo(); 
	        }
	        else
	        {
	            console.log("UndoManager is locked, can not undo");
	        }
	    }
	    catch (evt)
	    {
	        console.log("SW_SVGHistoryManager : Caught exception during undo" +evt);
	    }
	};
	
	this.redo = function (myLockId)
	{ 
	    try
	    {
	        if (!lockId)
	        {
	            undoManager.redo(); 
	        }
	        else if (myLockId && myLockId == lockId)
	        {
	            undoManager.redo(); 
	        }
	        else
	        {
	            console.log("UndoManager is locked, can not redo");
	        }
	    }
	    catch (evt)
	    {
	        console.log("SW_SVGHistoryManager : Caught exception during redo" +evt);
	    }
	};
	
	this.lock = function ()
	{ 
		if (!lockId) 
		{
			lockId = "SW_HistoryManager" + getUniqueId();
			return lockId;
		}
		
		return null;
	} 
	
	this.unlock = function (myLockId)
	{ 
		if (myLockId && myLockId == lockId)
		{
			lockId = null;			
		}
	}
	
	this.clear = function ()
	{
		
		lockId = null;
		undoManager.clear()
	}	
	
	return this;
	
}
/*
//Testcode
var SW_SVGHistory = new SW_SVGHistoryManager

myRec = new SW_Recorder;
myRec.recordUndoFunction( function () { alert(" Undo Record"); })
myRec.recordRedoFunction( function () { alert(" Redo Record"); })

SW_SVGHistory.recordHistory(myRec);
SW_SVGHistory.undo();
SW_SVGHistory.redo();*/
//******************************************************************************************************

var SW_SVGSelectedArea = function (SW_SVGCanvas, selectedRectArea, swCanvasHistoryManager)
{
	this.svgCanvas = SW_SVGCanvas;	
	this.selectionRect = selectedRectArea;
	this.swHistoryManager = swCanvasHistoryManager;

	this.canUndo = false;
	this.canRedo = false;
	
	var insideShapeList = new Array;

	var shapeList = this.svgCanvas.svgCanvas.selectAll('*');			
	var selectionBBox = this.selectionRect.getBBox();
		
	
	
	for(var i=0 ; i < shapeList.length; i++)
	{
		try
		{
			if (!this.svgCanvas.isHelper(shapeList[i]) &&
					 shapeList[i].type != "desc" && shapeList[i].type != "defs"	
						&& shapeList[i].type != "foreignObject")  //foreign object is always in group
			{	
				//alert("type"+ shapeList[i].type);
				var elemBBox = shapeList[i].getBBox();			
				if (selectionBBox.x <= elemBBox.x && selectionBBox.x2 >=  elemBBox.x2 &&
								selectionBBox.y <= elemBBox.y && selectionBBox.y2 >= elemBBox.y2)
				{	
					//alert("type"+ shapeList[i].type);
					insideShapeList.push(shapeList[i]);
				}
			}			
		}
		catch(evt)
		{
			//alert("SVG : "+ typeof (shapeList[i].node) + ":"+ shapeList[i].node.outerHTML);
			console.log("Exception wile get inside list " + ", error:" + evt);			
		}	

	}

	this.autoUndo = function (setTimeOut)
	{

		this.canUndo = true;
		if (setTimeOut && setTimeOut == 1)
		{
			var timeOutCall = this.autoUndo.bind(this, 0);
			console.log("start Undo in loop");
			setTimeout(timeOutCall, 0);
		}
		else
		{	
			var lockID = this.swHistoryManager.lock();
			var counterLimit = 10000; //
			var counter=0;
			
			while (this.canUndo && counter < counterLimit)//in case faild to add marker avoid unlimited while
 			{
			    counter++;
				this.swHistoryManager.undo(lockID); //has try catch			
				//console.log("Undoing");
			}		
			
			this.swHistoryManager.unlock(lockID)
		}
	}
	
	this.autoRedo = function (setTimeOut)
	{

		this.canRedo = true;
		if (setTimeOut && setTimeOut == 1)
		{
			var timeOutCall = this.autoRedo.bind(this, 0);
			console.log("start Redo in loop");
			setTimeout(timeOutCall, 0);
		}
		else
		{	
			var lockID = this.swHistoryManager.lock();
			
			var counterLimit = 10000; //
            var counter=0;
			while (this.canRedo && counter < counterLimit)//in case faild to add marker avoid unlimited while
			{
			    counter++;
				this.swHistoryManager.redo(lockID); //has try catch	
				//console.log("redoing");
			}		
			
			this.swHistoryManager.unlock(lockID)
		}
	}
	
	this.stopUndo = function ()
	{
		console.log("stop Undo in loop");
		this.canUndo = false;
	}
	
	this.stopRedo = function ()
	{
		console.log("stop Redo in loop");
		this.canRedo = false;
	}
	
	this.recordStartMarker = function ()
	{	
		var undoFunction = this.stopUndo.bind(this);
		var redoFunction = this.autoRedo.bind(this, 1);
		
		var swRecorder = new SW_Recorder;
		
		swRecorder.recordUndoFunction(undoFunction);
		swRecorder.recordRedoFunction(redoFunction);
		
		this.svgCanvas.recordCanvasHistory(swRecorder);
	}
	
	this.recordStopMarker = function ()
	{	
		//alert("stop marker");
		var undoFunction = this.autoUndo.bind(this, 1);
		var redoFunction = this.stopRedo.bind(this);
		
		var swRecorder = new SW_Recorder;
		
		swRecorder.recordUndoFunction(undoFunction);
		swRecorder.recordRedoFunction(redoFunction);
		
		this.svgCanvas.recordCanvasHistory(swRecorder);
	}
	
	this.selectionRectDragStart = function() 
	{				
		if (this.svgCanvas.isShapesDraggigDisabled())
		{ 
			return;
		} 
		//alert("Total inside element is " + insideShapeList.length);
	//	selectionRect.ox = parseInt(selectionRect.attr('x'));
	//	selectionRect.oy = parseInt(selectionRect.attr('y'));
		
		this.recordStartMarker();
		
		this.selectionRect.data('origTransform', this.selectionRect.transform().local);
		
		for (var i=0; i < insideShapeList.length; i++)
		{
			var SWShape = insideShapeList[i].node.getSWSVGElement();
			SWShape.shapeDragStart();
		}
		
		
	}

	this.selectionRectDrag = function (dx,dy,x,y,evt) 
	{	
		//console.log("isShapesDraggigDisabled:" + this.isShapesDraggigDisabled());		
		if (this.svgCanvas.isShapesDraggigDisabled())
		{ 
			return;
		} 

		var tdx, tdy;
		var snapInvMatrix = this.selectionRect.transform().diffMatrix.invert();
		snapInvMatrix.e = snapInvMatrix.f = 0;
		tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
		this.selectionRect.transform( "t" + [ tdx, tdy ] + this.selectionRect.data('origTransform')  );

	      //  selectionRect.attr({x: selectionRect.ox+dx, y: selectionRect.oy+dy });	

		for (var i=0 ; i < insideShapeList.length; i++)
		{				
			var SWShape = insideShapeList[i].node.getSWSVGElement();
			SWShape.shapeDrag(dx,dy);
		}
		
	}
	
	this.selectionRectDragStop = function () 
	{
		if (this.svgCanvas.isShapesDraggigDisabled())
		{ 
			return;
		} 
		
		
		for (var i=0 ; i < insideShapeList.length; i++)
		{
			var SWShape = insideShapeList[i].node.getSWSVGElement();
			SWShape.shapeDragStop();
		}
		
		this.recordStopMarker();
	}
		
	this.removeElements = function ()
	{
		if (insideShapeList.length == 0)
		{
			return;
		}
		
		this.recordStartMarker();
		
		for (var i=0; i < insideShapeList.length; i++)
		{
			var SWShape = insideShapeList[i].node.getSWSVGElement();
			
			if (SWShape)	
			{
				console.log("selection removing swshape");
				SWShape.remove(true);
			}
			else
			{
				console.log("selection removing snap shape");
				insideShapeList[i].remove();
			}
		}
		
		this.recordStopMarker();
	}
	
	var isEmpty = function ()
	{
		return (insideShapeList.length == 0) ? true : false;
	}

	var destroy = function ()
	{
		selectedRectArea.remove();
	}

	//var onSelectionRectDragStart = selectionRectDragStart.bind(this.svgCanvas, this.selectionRect);
	//var onSelectionRectDrag = selectionRectDrag.bind(this.svgCanvas, this.selectionRect);
	//var onSelectionRectDragStop = selectionRectDragStop.bind(this.svgCanvas, this.selectionRect);
	
	var onSelectionRectDragStart = this.selectionRectDragStart.bind(this);
	var onSelectionRectDrag = this.selectionRectDrag.bind(this);
	var onSelectionRectDragStop = this.selectionRectDragStop.bind(this);
	
	this.selectionRect.swDrag(onSelectionRectDrag, onSelectionRectDragStart, onSelectionRectDragStop);

	return { 
		"removeElements" : this.removeElements.bind(this), 
		"isEmpty" : isEmpty,
		"destroy": destroy, 
	};
}

//******************************************************************************************************
var SW_SnapShot = function (SWElement, options) 
{
    
	console.log ("creating snapshot");
	this.content = SWElement.getHTML();
	this.position = null;
	this.prev = SWElement.getPrevious();
	this.hasInnerTextChange = options.hasTextChange;
	this.swInnerText = "";
	//properly cerating bject in smae object is recursion
	//so conditional break is important
	if (this.hasInnerTextChange && SWElement.swInnerText)
	{
	    this.swInnerText = SWElement.swInnerText.getHTML();
	}	
	
	this.equals = function(otherSnapShot)
	{
		if (this.content === otherSnapShot.content)
		{
			return true;
		}
		
		return false;
	}
}

//**********************************************************************************************************
var SW_Canvas = function(domSVGPropertyToolsContainer)
{
	this.swSvgCanvasArray = new Array;
	this.canvasEvtCallbackFunct = null;
	this.canvasHistory = new SW_SVGHistoryManager; 
	this.activeSvgCanvas = null;
	this.activeCanvasChangeCallbackArray = new Array;
	this.recordingDisabled = false;
	this.ctrlKeyPressed = false;
	this.canvasChangedFlag = false;
	
	var createSVGCanvas = function ()
	{
		//console.log("SW SVG: creating new svg Canvas");
		var d = new Date();  
		svgCanvasId = "svgCanvas_" + d.getTime();

		var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		e.setAttribute('width', '100%');
		e.setAttribute('height', '100%');
		//e.id=svgCanvasId;
		e.setAttribute('style', 'border: 1px solid black');
		return e;
	}

	var svgChangeTemplate = function (svgCanvas )
	{
	    
	}
	
	this.setViewBox = function()
	{
		var myEditableArea = this.activeSvgCanvas.getSvgAsDom();
		var vw = $(myEditableArea).width();
		var vh = $(myEditableArea).height();

		vw = 800;
		vh = 600;
		vbStr="0 0 " + vw + " " + vh ;
		myEditableArea.setAttribute("viewBox", vbStr); 
		myEditableArea.setAttribute("preserveAspectRatio", "xMidYMid meet"); 
	//	alert(":"+this.activeSvgCanvas.getSvgAsSnap());
		console.log("adding tempate");
		//this.activeSvgCanvas.getSvgAsSnap().rect(0,0, vw, vh, 0, 0).attr( { class: "SWTemplate", fill: 'yellow' } );
	}

	this.getSvgCanvas = function(position)
	{
		if (position < 1 || position > this.swSvgCanvasArray.length)
		{
			return null;
		}
		
		return this.swSvgCanvasArray[position-1];
	}
	
	this.getActiveSvgCanvas = function()
	{
		return this.activeSvgCanvas;
	}
	
	this.getActiveSvgCanvasId = function()
	{
		return this.activeSvgCanvas.getSvgCanvasId();
	}
	
	this.unselectAllElements = function(canRecord)
	{
		this.activeSvgCanvas.unselectAllElements(canRecord); //do not record
	}
	
	this.getSource = function() 
	{
		return this.activeSvgCanvas.getSvg();
	}
	
	this.getSourceOf = function(position) 
	{
	    if(position > 0  && position <= this.swSvgCanvasArray.length)
	    {
	        return this.swSvgCanvasArray[position-1].getSvg(); 
	    }
	    else
	    {
	       return null;
	    }
	}
	
	this.undo = function()
	{
		this.unselectAllElements(true); //do not record
		this.canvasHistory.undo() 
	}
	
	this.redo = function()
	{
		this.unselectAllElements(true); //do not record
		this.canvasHistory.redo();
	}
	
	this.getActiveSvgEditableArea = function()
	{
		var myEditableArea = this.activeSvgCanvas.getSvgAsDom();
		return myEditableArea ;
	}
	
	this.registerEventCallBack = function(eventCallBackFunct)
	{
		this.canvasEvtCallbackFunct = eventCallBackFunct;
	}
	
	this.notifyActiveCanvasAutoChange = function(callBackFunct)
	{
		this.activeCanvasChangeCallbackArray.push(callBackFunct);
	}
	
	this.canvasEvtCallback = function (evt)
    {
        //alert("canvas callback " + evt.type +","+ this.canvasEvtCallbackFunct);
        if (this.canvasEvtCallbackFunct && typeof this.canvasEvtCallbackFunct === "function")
        {
            this.canvasEvtCallbackFunct(evt);
        }
    }
	
	this.loadSWSvgCanvas = function(svgToLoad)
	{
        var swSvgCanvasToAdd = new SW_SVGCanvas(svgToLoad, this, domSVGPropertyToolsContainer);
        swSvgCanvasToAdd.processShapes();
        
        var localcanvasEvtCallback = this.canvasEvtCallback.bind(this); 
        swSvgCanvasToAdd.registerEventCallBack(localcanvasEvtCallback);

        this.swSvgCanvasArray.push(swSvgCanvasToAdd);
	}
	
	this.loadNew = function(mySvg)
	{
		this.swSvgCanvasArray.splice(0,this.swSvgCanvasArray.length);
		this.canvasHistory.clear();	
		this.loadSWSvgCanvas(mySvg);
		this.changeActiveSvgCanvasTo(1);
	}
	
	this.addNewSWSvgCanvas = function(position)
	{
		if (position == 0)
		{
			return null;
		}
			
		var myEditableArea = createSVGCanvas();	
		var swSvgCanvasToAdd = new SW_SVGCanvas(myEditableArea, this, domSVGPropertyToolsContainer);

		var localcanvasEvtCallback = this.canvasEvtCallback.bind(this);
		swSvgCanvasToAdd.registerEventCallBack(localcanvasEvtCallback);
		
		//console.log("add at " + position + "len"+this.swSvgCanvasArray.length);
		if (position > this.swSvgCanvasArray.length)
		{
			this.swSvgCanvasArray.push(swSvgCanvasToAdd);
			position = this.swSvgCanvasArray.length;
		}
		else
		{
			//console.log("adding  at " + position-1 + "len"+this.swSvgCanvasArray.length);
			this.swSvgCanvasArray.splice(position-1, 0, swSvgCanvasToAdd);
		}
		
		this.changeActiveSvgCanvasTo(position);
		this.canvasChangedFlag = true;
		
		if ( this.swSvgCanvasArray.length == 1)
		{
			return; //no need to record this
		}
		var addCanvasUndo = function(position, swSvgCanvasToAdd)
		{
			console.log("adding canvas");
			this.swSvgCanvasArray.splice(position-1, 1);
			
			if( this.swSvgCanvasArray.length == 0)
			{
				this.swSvgCanvasArray.push(swSvgCanvasToAdd);
				this.changeActiveSvgCanvasTo(1);
			}	
			else
			{
				this.changeActiveSvgCanvasTo(position-1);
			}
		}
		
		var addCanvasRedo = function(position, swSvgCanvasToAdd)
		{
			if (position > this.swSvgCanvasArray.length)
			{
				this.swSvgCanvasArray.push(swSvgCanvasToAdd);
				position = this.swSvgCanvasArray.length;
			}
			else
			{
				//console.log("adding  at " + position-1 + "len"+this.swSvgCanvasArray.length);
				this.swSvgCanvasArray.splice(position-1, 0, swSvgCanvasToAdd);
			}
			
			this.changeActiveSvgCanvasTo(position);
		}
		
		var localaddCanvasUndo = addCanvasUndo.bind(this, position, swSvgCanvasToAdd);
		var localaddCanvasRedo = addCanvasRedo.bind(this, position, swSvgCanvasToAdd);
		
		var swRecorder = new SW_Recorder;
		swRecorder.recordUndoFunction(localaddCanvasUndo);
		swRecorder.recordRedoFunction(localaddCanvasRedo);
		
		this.recordSWCanvasHistory(swRecorder);
	}
	
	this.removeSWSvgCanvas = function(position)
	{
		
		if (position < 0 && position > this.swSvgCanvasArray.length)
		{
			return;
		}
			
		if (this.swSvgCanvasArray.length == 1)
		{
			return;
		}
		
		var canvasRemoved = this.swSvgCanvasArray[position-1];
		var addedBlankCanvas = false;
		//remove fromm array
		this.swSvgCanvasArray.splice(position-1, 1);
		this.changeActiveSvgCanvasTo(position-1);
		this.canvasChangedFlag = true;
		
		var remCanvasUndo = function(position, svgCanvasToAdd)
		{
			console.log("adding canvas");		
			this.swSvgCanvasArray.splice(position-1, 0, svgCanvasToAdd);
			this.changeActiveSvgCanvasTo(position);
		}
		
		var remCanvasRedo = function(position, canvasRemoved)
		{
			//this.activeSvgCanvas = svgCanvas;
			this.swSvgCanvasArray.splice(position-1, 1);
			this.changeActiveSvgCanvasTo(position-1);
		}
		
		var localCanvasUndo = remCanvasUndo.bind(this, position, canvasRemoved);
		var localCanvasRedo = remCanvasRedo.bind(this, position, canvasRemoved);
		
		var swRecorder = new SW_Recorder;
		swRecorder.recordUndoFunction(localCanvasUndo);
		swRecorder.recordRedoFunction(localCanvasRedo);
		
		this.recordSWCanvasHistory(swRecorder);
	}
	
	this.onCanvasKeyEvent = function(evt)
	{
		var preventBackNevigation = function(evt)
		{
			var elid = $(document.activeElement).is("input, textarea, text");
			
			//alert("elid" + elid)
			if (!evt.target.classList.contains("insideforeign") && 
			        !evt.target.classList.contains("enableBackSpace") && !elid)
			{
				evt.preventDefault();
			}
			else if (evt.target.innerHTML == "")
			{
			//	evt.preventDefault();
			}
			
			return;
			
			/*var rx = /INPUT|SELECT|TEXTAREA|DIV/i;
			if(!rx.test(evt.target.tagName) || evt.target.disabled || evt.target.readOnly || evt.target.innerHTML == "")
			{
				//console.log("tag name" + evt.target.tagName);
		        evt.preventDefault();
		    }
			else
			{
				var rx = /INPUT|SELECT|TEXTAREA|DIV/i;
				
				//console.log("bksp default action" + evt.target.tagName + "," + evt.target.outerHTML	);
				//alert("ok")
				if  (!evt.target.classList.contains("insideforeign"))
				{
					evt.preventDefault();
				}
			}*/
		}

		try
		{
			//console.log("Key Event type :" + evt.type + ", which :" + evt.which);
			if (evt.type == "keydown")
			{
				switch(evt.which) 
				{
				case 17: // ctrl
					console.log("CTRL key pressed");
					this.ctrlKeyPressed=true;
					break;
				case 8: // backspace
					preventBackNevigation(evt);
					break;
				case 116: // F5 page refresh
					evt.preventDefault();
					break;
				case 89: // y
					if (this.ctrlKeyPressed)
					{
						this.recordingDisabled = true;
						this.activeSvgCanvas.unselectAllElements(true); //do not record
						this.canvasHistory.redo();
						evt.preventDefault();
					}
					break;
				case 90: // z
					if (this.ctrlKeyPressed)
					{
						this.recordingDisabled = true;
						this.activeSvgCanvas.unselectAllElements(true); //do not record
						this.canvasHistory.undo();
						evt.preventDefault();
					}
					break;
				default:
				}
			}
			else if (evt.type == "keyup")
			{
				switch(evt.which) 
				{
				case 17: // ctrl
					console.log("CTRL key released");
					this.recordingDisabled = false;
					this.ctrlKeyPressed=false;
					break;
				default:
				}
			}
			else if (evt.type == "keypress")
			{
				switch(evt.which) 
				{
				case 8: // backspace
					preventBackNevigation(evt);
					break;
				default:
				}
			}
			
			this.activeSvgCanvas.onSvgCanvasKeyEvent(evt);
		}
		catch(err)
		{

			console.log("key event exception: type:"+ evt.type + "key: "+ evt.which +"error:"+ err.message);
		}
	}
	

	this.sendActiveCanvasChangeNotification = function(prevActiveSvgCanvasID)
	{	
		var newActiveSvgCanvasID = this.activeSvgCanvas.getSvgCanvasId();
		var changeType = "SVG_DATA_CHANGE";
		
		if (newActiveSvgCanvasID != prevActiveSvgCanvasID || this.canvasChangedFlag)
		{
			changeType = "SVG_CANVAS_CHANGE";
			this.canvasChangedFlag = false;
		
			//alert("canvas changed pre: "+ prevActiveSvgCanvasID +", new : "+ newActiveSvgCanvasID);
		}
		
		for(var functCounter = 0; functCounter < this.activeCanvasChangeCallbackArray.length; functCounter++)
		{
			var funct = this.activeCanvasChangeCallbackArray[functCounter];
			funct(changeType);
		}
	}
	
	
	this.recordSWCanvasHistory = function(swRecorder)
	{
		//console.log("Recording");
		//undo redo operation in progress
		if (this.recordingDisabled == true)
		{
			console.log("Recording disabled, so will no record it.");
			return;
		}
		
		var localsendActiveCanvasChangeNotification = this.sendActiveCanvasChangeNotification.bind(this);

		var timeOutSendActiveCanvasChangeNotification = function(prevActiveSvgCanvasID)
		{
			//alert("canvas changed:  "+ prevActiveSvgCanvasID );
			localsendActiveCanvasChangeNotification(prevActiveSvgCanvasID);
			//var tmpCall = localsendActiveCanvasChangeNotification.bind(prevActiveSvgCanvasID);
			//setTimeout(tmpCall, 0);
		}
		
		//localsendActiveCanvasChangeNotification();
		var prevActiveSvgCanvasID = this.activeSvgCanvas.getSvgCanvasId();
		timeOutSendActiveCanvasChangeNotification(prevActiveSvgCanvasID);
		 
		var canvasUndo = function(svgCanvas, undoFunct)
		{
			var prevActiveSvgCanvasID = this.activeSvgCanvas.getSvgCanvasId();
			this.activeSvgCanvas = svgCanvas;
			undoFunct();
		
			timeOutSendActiveCanvasChangeNotification(prevActiveSvgCanvasID);
		}
		
		var canvasRedo = function(svgCanvas, redoFunct)
		{
			var prevActiveSvgCanvasID = this.activeSvgCanvas.getSvgCanvasId();
			this.activeSvgCanvas = svgCanvas;
			redoFunct();
			
			timeOutSendActiveCanvasChangeNotification(prevActiveSvgCanvasID);
		}
		
		var undoFunct = swRecorder.getUndoFunction();
		var redoFunct = swRecorder.getRedoFunction();
		
		var localCanvasUndo = canvasUndo.bind(this, this.activeSvgCanvas, undoFunct);
		var localCanvasRedo = canvasRedo.bind(this, this.activeSvgCanvas, redoFunct);
		
		var newSWRecorder = new SW_Recorder;
		newSWRecorder.recordUndoFunction(localCanvasUndo);
		newSWRecorder.recordRedoFunction(localCanvasRedo);
		
		this.canvasHistory.recordHistory(newSWRecorder);
	}

	this.appendSWSvgCanvas = function()
	{
		this.addNewSWSvgCanvas(this.swSvgCanvasArray.length+1);
	}
	
	this.changeActiveSvgCanvasTo = function(position)
	{
		//console.log("preActive svg canvas changes to" + position+", "+ this.swSvgCanvasArray.length);
		if (position < 1 || position > this.swSvgCanvasArray.length)
		{
			return;
		}
	
		console.log("Active svg canvas changes to" + position);
		//this.activeSvgCanvas.disableKeyEvents();
		
		if (this.activeSvgCanvas) 
		{
			this.activeSvgCanvas.unselectAllElements();			
		}
		
		this.activeSvgCanvas = this.swSvgCanvasArray[position-1];
		this.setViewBox();
		
		//this.activeSvgCanvas.enableKeyEvents();
		//console.log("Active svg canvas changes to" + this.swSvgCanvasArray[0].getSvgAsDom().outerHTML);
		//console.log("Active svg canvas changes to" + this.swSvgCanvasArray[1].getSvgAsDom().outerHTML);
		
		//console.log("Active svg canvas changes to111" + this.swSvgCanvasArray[position-1].getSvgAsDom().outerHTML);
		//console.log("Active svg canvas changes to2222" + this.activeSvgCanvas.getSvgAsDom().outerHTML);
		
	}
	
	this.getTotalSvgCanvas = function()
	{
		return this.swSvgCanvasArray.length;
	}
	
	this.getSWTextCanvas = function()
	{
		return null;
	}	

	this.init = function()
	{	
		var startDocumentKeyEvents = function(onKeyEvent) {		
			$(document).keydown(onKeyEvent);
			$(document).keyup(onKeyEvent);
		};
		
		var stopDocumentKeyEvents = function(handler) {		
			$(document).unbind('keydown', handler);
			$(document).unbind('keyup', handler);
		};
		
		var onKeyEvent = this.onCanvasKeyEvent.bind(this);
		startDocumentKeyEvents(onKeyEvent);
		
		this.addNewSWSvgCanvas(1);
	}

	this.init();
	//alert(myEditableArea.outerHTML);
}

//**************************************************************************************
var SW_TextCanvas = function(domSVG, domSVGPropertyToolsContainer)
{
	



}
//*******************************************************************************************************
var SW_ShapeHelper = function (svgCanvas)
{
	this.svgCanvas = svgCanvas;
	var helperSize = 3;
	
	this.size =  function (size)
	{
		helperSize = size;
	}

	var replaceCursor1 = function (currHelper, x,y, heleprCatagory, helperType, isFloatingCursor, evt)
	{
		if (isFloatingCursor)
		{
			var cursorXY = svgCanvas.convertToSVGPoint(evt.clientX, evt.clientY, SW_CORD_SYSTEM_TYPE.HTML, currHelper);
			x = cursorXY.x;     // Get the horizontal coordinate
			y = cursorXY.y;     // Get the vertical coordinate
			//console.log();
		}
		
		if (!helperType)
		{
			//console.log("noheleper");
			if (currHelper)	{ currHelper.attr('cursor', 'crosshair'); }
			return;
		}	

		var d1 = null;
		var helperAttr = {'cursor': 'none', fill: "white", "fill-opacity": "1", "stroke-opacity": "1" };

		switch (helperType)
		{
		case SHAPE_HELPER.DRAG:
		    if (currHelper) 
		    { 
		        currHelper.attr('cursor', 'move');
		        return;
		    }
		    break;
		case SHAPE_HELPER.LEFT_UP_RIGHT_ROTATOR:
			var curvePath = new Object;	

			curvePath.csX = x;
			curvePath.csY = y+6;

			curvePath.type="A";

			curvePath.arX = 5//arc redius X
			curvePath.arY = 5; //arc redius Y
			curvePath.axR = 0; //arc x axis rotation
			curvePath.alf = 1; //arc large flag
			curvePath.asf = 1; //arc sweep flag

			curvePath.ceX =x+10;
			curvePath.ceY = y;

			var sweep2 = curvePath.asf == 1 ? 0:1;

			var d1 = 
				/*"M"+curvePath.csX+","+(curvePath.csY+2.5)+ " " +
						" L" + (curvePath.csX)+"," + (curvePath.csY+5) + 
						" L" + (curvePath.csX+5) + ","+(curvePath.csY+2.5-4) +  //Arrow tip
						" L" + (curvePath.csX) + ","+(curvePath.csY-2.5) +
						" L" + (curvePath.csX) + ","+curvePath.csY +*/
				"M"+curvePath.csX+","+(curvePath.csY+2.5)+ " " +
				curvePath.type+
				(curvePath.arX+4)+","+(curvePath.arY+3)+" "+curvePath.axR+" "+ curvePath.alf + " "+ curvePath.asf +" "+
				(curvePath.ceX)+","+curvePath.ceY+  //inner
				" L" + (curvePath.ceX-5)+"," + (curvePath.ceY-2) +
				" L" + (curvePath.ceX-2) + ","+(curvePath.ceY+7) + //Arrow tip
				" L" + (curvePath.ceX+5) + ","+(curvePath.ceY+3)+  
				" L" + (curvePath.ceX+2.5) + ","+(curvePath.ceY) + " " + 
				curvePath.type+
				(curvePath.arX+7)+","+(curvePath.arY+5)+" "+curvePath.axR+" "+ curvePath.alf + " "+ sweep2 +" "+
				(curvePath.csX)+","+(curvePath.csY+2.5); //outer

			var helperAttr = {'cursor': 'none', fill: "white", "fill-opacity": "1", 
					"stroke": "black", "stroke-width" : 1, "stroke-opacity": "1" };


			break;
		case SHAPE_HELPER.TOP_DOWN_ARROW:
		case SHAPE_HELPER.LEFT_RIGHT_ARROW:
		{
			var arrowPath = new ARROW_PATH(ARROW_TYPE.LINE_ARROW);	

			if (helperType == SHAPE_HELPER.TOP_DOWN_ARROW)
			{
				arrowPath.topLine.X1 = x-2;
				arrowPath.topLine.Y1 = y-5;
				arrowPath.topLine.X2 = x-2;
				arrowPath.topLine.Y2 = y+5;	

				arrowPath.bottomLine.X1 = x+2;
				arrowPath.bottomLine.Y1 = arrowPath.topLine.Y1;
				arrowPath.bottomLine.X2 = x+2;
				arrowPath.bottomLine.Y2 = arrowPath.topLine.Y2;

				arrowPath.head1.HTX = x-4;
				arrowPath.head1.HTY = arrowPath.topLine.Y2;	
				arrowPath.head1.HMX = x
				arrowPath.head1.HMY = arrowPath.topLine.Y2 + 6;
				arrowPath.head1.HBX = x+4;
				arrowPath.head1.HBY = arrowPath.topLine.Y2;	

				arrowPath.head2.HBX = x+4;
				arrowPath.head2.HBY = arrowPath.bottomLine.Y1;	
				arrowPath.head2.HMX = x
				arrowPath.head2.HMY = arrowPath.bottomLine.Y1 - 6;
				arrowPath.head2.HTX = x-4;
				arrowPath.head2.HTY = arrowPath.topLine.Y1;
			}
			else
			{
				arrowPath.topLine.X1 = x-5;
				arrowPath.topLine.Y1 = y-2;
				arrowPath.topLine.X2 = x+5;
				arrowPath.topLine.Y2 = y-2;	

				arrowPath.bottomLine.X1 = x-5;
				arrowPath.bottomLine.Y1 = y+2;
				arrowPath.bottomLine.X2 = x+5;
				arrowPath.bottomLine.Y2 = y+2;

				arrowPath.head1.HTX = arrowPath.topLine.X2;
				arrowPath.head1.HTY = arrowPath.topLine.Y2-4;	
				arrowPath.head1.HMX = arrowPath.topLine.X2+6
				arrowPath.head1.HMY = y;
				arrowPath.head1.HBX = arrowPath.bottomLine.X2;
				arrowPath.head1.HBY = arrowPath.bottomLine.Y2+4;	

				arrowPath.head2.HBX = arrowPath.bottomLine.X1;
				arrowPath.head2.HBY = arrowPath.bottomLine.Y1+4;	
				arrowPath.head2.HMX = arrowPath.bottomLine.X1-6
				arrowPath.head2.HMY = y
				arrowPath.head2.HTX = arrowPath.topLine.X1;
				arrowPath.head2.HTY = arrowPath.topLine.Y1-4;
			}

			d1 = 
				"M"+arrowPath.topLine.X1+" "+arrowPath.topLine.Y1+","+arrowPath.topLine.X2+","+arrowPath.topLine.Y2+
				" L" + arrowPath.head1.HTX+","+arrowPath.head1.HTY + " L"+arrowPath.head1.HMX+","+arrowPath.head1.HMY +
				" L"+arrowPath.head1.HBX+","+arrowPath.head1.HBY +
				" L" + arrowPath.bottomLine.X2+","+arrowPath.bottomLine.Y2 +" L"+arrowPath.bottomLine.X1+","+arrowPath.bottomLine.Y1 +
				" L" + arrowPath.head2.HBX+","+arrowPath.head2.HBY + " L"+arrowPath.head2.HMX+","+arrowPath.head2.HMY + 
				" L"+arrowPath.head2.HTX + ","+arrowPath.head2.HTY + " " + "Z";

		}
		break;
		}

		if (currHelper && d1)
		{
			currHelper.attr({ d: d1 });
			currHelper.attr(helperAttr);
		}
	}
	
	addHelperEvents = function(innerHelper, outerHelper, cursorHelper, x, y, heleprCatagory,helperType, isFloatingCursor)
	{
		var helperFillColor =  heleprCatagory == HELPER_CATAGORY.MAIN_HELPER ? "yellow" : "pink";
	
		innerHelper.attr({ class: 'SWShapeHelper', "fill-opacity": "1", fill: helperFillColor, stroke: "#000" });
		cursorHelper.attr({ class: 'SWShapeHelper', "fill-opacity": "0.0", fill: "red", stroke: "#000", "stroke-opacity": "0.0"});	
		outerHelper.attr({ class: 'SWShapeHelper', "fill-opacity": "0.0", fill: "white", stroke: "#000", "stroke-opacity": "0.0"});	
		
		var helper = svgCanvas.group(innerHelper, outerHelper, cursorHelper);
		
		helper.attr({ class: 'SWShapeHelper'});
		helper.attr({'cursor': 'none'});
		var replaceCursor = replaceCursor1.bind(this, cursorHelper, x,y, heleprCatagory, helperType, isFloatingCursor);
		
		helper.mouseover(function (evt) { 	
			replaceCursor(evt);	
		});
		
		helper.mouseout(function (evt) { 				
			cursorHelper.attr({'cursor': 'auto', fill: "red", "fill-opacity": "0.0", "stroke-opacity": "0.0" });
		});
		
		//alert("helper"+helper);
		return helper;
	}

	var localAddHelperEvents = addHelperEvents.bind(this);
	
	this.drawHelper = function(x,y, heleprCatagory,helperType)
	{
		var innerHelper = svgCanvas.ellipsePath(x, y, helperSize, helperSize);		
		var cursorHelper = svgCanvas.ellipsePath(x, y, 6, 6);		
		var outerHelper = svgCanvas.ellipsePath(x, y, 6, 6);
		
		var helper = localAddHelperEvents(innerHelper, outerHelper, cursorHelper, x, y, heleprCatagory, helperType, false);
		
		return helper;
	}
	
	this.drawLineHelper = function(x1,y1, x2, y2, heleprCatagory,helperType)
	{
		var innerHelper = svgCanvas.line(x1, y1, x2, y2);		
		var cursorHelper = svgCanvas.ellipsePath(x1, y1, 2, 2);		
		var outerHelper = svgCanvas.line(x1, y1, x2, y2);	//svgCanvas.line(x, y, width, height, helperSize, helperSize);
		
		var helper = localAddHelperEvents(innerHelper, outerHelper, cursorHelper, x1, y1, heleprCatagory, helperType, true);
		innerHelper.attr({ class: 'SWShapeHelper', "stroke-opacity": "0.2", "stroke-width" : 5 , stroke: "#000" });
		
		return helper;
	}
	
	this.drawRectHelper = function(x,y, width, height, rx,ry, heleprCatagory,helperType)
    {
        var innerHelper = svgCanvas.rect(x, y, width, height, rx, ry);      
        var cursorHelper = svgCanvas.rect(x, y, width, height, rx, ry);    
        var outerHelper = svgCanvas.rect(x, y, width, height, rx, ry);  //svgCanvas.line(x, y, width, height, helperSize, helperSize);
        
        var helper = localAddHelperEvents(innerHelper, outerHelper, cursorHelper, x, y, heleprCatagory, helperType, true);
        innerHelper.attr({ class: 'SWShapeHelper', "fill-opacity": "0.2", "stroke-width" : 0 , fill: "#000" });
        
        return helper;
    }
}

//*******************************************************************************************************
var SW_SVGCanvas = function(domSVG, swCanvas, domSVGPropertyToolsContainer)//, domDocumentToolsContainer)
{
	this.SVGAsDom=domSVG;
	this.domSVGToolsContainer=domSVGPropertyToolsContainer;	
	this.svgCanvas = Snap(domSVG);
	this.isTextMouseDown = false;	
	this.isMouseDown = false;
	this.ctrlKeyPressed=false;
	this.mouseDownElment = null;
	this.mouseUpElment = null;

	this.mouseClickCorditates = new Array();	
	this.mouseMoveCorditates = new Array();
	this.mouseDownCorditates = new Array();
	this.mouseUpCorditates = new Array();	
	this.eventCallBack = null;
	this.selectedElements = new Array();
	this.CKeditor = null;
	this.toolBar = null;
	this.isDrawingStarted = false;
	this.tmpDrawing = null;
	this.drawingCallBack = null;
	this.tmpDrawingCorditates = new Array();
	this.selectedArea = null;
	
	this.swCanvas = swCanvas; 
	
	//console.log("Adding Canvas click event listener");
	var onClick = this.onSvgCanvasClick.bind(this);
	this.svgCanvas.click(onClick);	

	var onMouseMove = this.onSvgCanvasMouseMove.bind(this);
	this.svgCanvas.mousemove(onMouseMove);

	var onMouseDown = this.onSvgCanvasMouseDown.bind(this);
	this.svgCanvas.mousedown(onMouseDown);

	var onMouseUp = this.onSvgCanvasMouseUp.bind(this);
	this.svgCanvas.mouseup(onMouseUp);
	
	var onDblClick = this.onSvgCanvasDbClick.bind(this);
	this.svgCanvas.dblclick(onDblClick);	

	this.mouseClickCorditates.x = 20;
	this.mouseClickCorditates.y = 20;

	this.identifier = "SWSVGCanvas_" + getUniqueId();
	
	if (!this.svgCanvas.hasTemplate())
	{
	    var myTemplate = this.svgCanvas.group();
	    var tmplateRect = this.svgCanvas.rect(0,0, 800,600, 0, 0).attr( {fill: 'yellow' } );

	    myTemplate.makeTemplate();
	    myTemplate.append(tmplateRect);
	}
    
	//this.onKeyEvent = this.onSvgCanvasKeyEvent.bind(this);
	
	//this.svgCanvas.startDocumentKeyEvents(onKeyEvent);
}
/*
SW_SVGCanvas.prototype.enableKeyEvents = function(eventCallBackFunct) 
{
	this.svgCanvas.startDocumentKeyEvents(this.onKeyEvent);
}

SW_SVGCanvas.prototype.disableKeyEvents = function(eventCallBackFunct) 
{
	this.svgCanvas.stopDocumentKeyEvents(this.onKeyEvent);
}*/

SW_SVGCanvas.prototype.getSvgCanvasId = function()
{
	return this.identifier;
}

SW_SVGCanvas.prototype.registerEventCallBack = function(eventCallBackFunct) 
{
	this.eventCallBack = eventCallBackFunct;
}

SW_SVGCanvas.prototype.recordCanvasHistory = function(swRecorder)
{	
	this.swCanvas.recordSWCanvasHistory(swRecorder)
}

SW_SVGCanvas.prototype.addElementAndRecord = function(SWelement)
{
	this.addElement(SWelement, null);
	
	//var undoFunction = this.deleteElement.bind(this, SWelement, false); //do not record	
	
	var undoFunction = SWelement.setSnapShot.bind(SWelement, null);    
	var mySnapShot = SWelement.getSnapShot({ hasTextChange : true});
	
	//var redoFunction = this.addElement.bind(this, SWelement, mySnapShot);	
	var redoFunction = SWelement.setSnapShot.bind(SWelement, mySnapShot);  
	
	var swRecorder = new SW_Recorder;	
	swRecorder.recordUndoFunction(undoFunction);
	swRecorder.recordRedoFunction(redoFunction);
	
	this.recordCanvasHistory(swRecorder);
}

SW_SVGCanvas.prototype.addElement = function(SWelement, mySnapShot)
{
	if (mySnapShot) //for recorded do not select element
	{
		SWelement.setSnapShot(mySnapShot);		
	}
	else
	{
		this.selectElement(SWelement);	
	}
	//this.SVGHistory.undo();
}

SW_SVGCanvas.prototype.deleteElement = function(SWelement, canRecord)
{
	this.unselectElement();
	SWelement.remove(canRecord);  //to do fornow SWelement same as selected element //remove false means donot record the event
}

SW_SVGCanvas.prototype.selectElement = function(SWelement)	
{
	this.unselectAllElements();
	this.selectedElements.push(SWelement);	
	SWelement.select();
	this.attachToolbar(SWelement);
	//console.log("element selected , Total selected elements:" + this.selectedElements.length);
	//alert("selected");
}

SW_SVGCanvas.prototype.unselectElement = function(canRecord)	
{
	//alert("Unselecting emment");
	this.unselectAllElements(canRecord);
}

SW_SVGCanvas.prototype.unselectAllElements = function(canRecord)	
{
	if (canRecord == null || typeof canRecord === undefined)
	{
		canRecord = true;
	}
	//alert("selected element clicked : "+ evt.target + "number selected elements: " + this.selectedElements.length);
	while (this.selectedElements.length) 
	{ 
		
		var lastIndex1 = this.selectedElements.length-1;
		//alert("number selected elements: " + this.selectedElements.length + ":"+ lastIndex1);
		this.selectedElements[lastIndex1].unselect();
		this.selectedElements[lastIndex1].removeEventListener();
		this.selectedElements.pop();
		console.log("Unselected Element, total selected elements" +  this.selectedElements.length);
		
		//alert("unselecting element");
	}	

	this.dettachToolbar(canRecord);
	//remove helper shapes if any
	this.removeShapeHelper();
}

SW_SVGCanvas.prototype.isElementSelected = function()
{
//	console.log("selected element length : " + this.selectedElements.length);
	return (this.selectedElements.length != 0) ? true : false;
}

SW_SVGCanvas.prototype.getSvgSize = function() 
{
   // alert("bounding width"+ this.svgCanvas.node.getBoundingClientRect().width+"node w,"+ $(this.svgCanvas.node).width());
    //alert("bounding height"+ this.svgCanvas.node.getBoundingClientRect().height+"node w,"+ $(this.svgCanvas.node).height());

    return { width : $(this.svgCanvas.node).width(), height: $(this.svgCanvas.node).height() };
}

SW_SVGCanvas.prototype.getSvg = function() 
{
	/*if (bUnselectAll)
	{
		this.unselectAllElements();
	}*/
	
	var tmp = document.createElement("div");
	
	
	tmp.innerHTML = this.SVGAsDom.outerHTML;
	//alert(" svg with helper" + tmp.innerHTML );
	tmpsvg = Snap(tmp.firstChild);
	this.removeAllHelper(tmpsvg);
	//alert("svg"+ tmp.innerHTML);
	//return this.SVGAsDom.outerHTML;
	//alert(" svg" + tmp.innerHTML );
	return tmp.innerHTML;
}

SW_SVGCanvas.prototype.getSvgAsDom = function() 
{
	return this.SVGAsDom;
}

SW_SVGCanvas.prototype.getSvgAsSnap = function() 
{
	return this.svgCanvas;
}



SW_SVGCanvas.prototype.convertToSVGPoint = function (xCord, yCord, inCordSystem, shapeElement)
{
	
	return this.svgCanvas.convertToSVGPoint(xCord, yCord, inCordSystem, shapeElement)
	
	////////////////////////
	
	var pt1 = this.SVGAsDom.createSVGPoint();
	pt1.x = xCord;//Math.min(scaleX,scaleY); //evt.clientX;
	pt1.y = yCord;//Math.min(scaleX,scaleY); //evt.clientY;
	var scaleFactor = this.getSVGScaleFactor();
	
	//console.log("SVG scale factor222  :"+ scaleFactor.x +"," + scaleFactor.y +","+
	//		 this.SVGAsDom.getBoundingClientRect().x);
	if (inCordSystem == SW_CORD_SYSTEM_TYPE.HTML)
	{
		//console.log("Cord system : HTML for XY :" + xCord +"," + yCord);
		//console.log("SVG point for SVGAsDom pt1 : "+ pt1.x +"," + pt1.y);
		var pt2 = pt1.matrixTransform(this.SVGAsDom.getScreenCTM().inverse());	
		//console.log("SVG point for SVGAsDom  : "+ pt2.x +"," + pt2.y);
		
		//getScreenCTM has bug in firefox, when container has css tranformation it does not apply that transfomation so 
		//svg pt x, y cordinate is wrong
		//so commented above code add added line below for lines
		
		/*var pt2 = this.SVGAsDom.createSVGPoint();
		pt2.x = pt1.x - this.SVGAsDom.getBoundingClientRect().left;//Math.min(scaleX,scaleY); //evt.clientX;
		pt2.y = pt1.y- this.SVGAsDom.getBoundingClientRect().top;*/
		
		//console.log("shapeElement"+ shapeElement + this.SVGAsDom.getBoundingClientRect().left);
		
		pt2.x /= scaleFactor.x;
		pt2.y /= scaleFactor.y;	
		
		//Apply Svg Scale Factor
		//console.log("shapeElement"+ shapeElement);
		
		
		
		if (shapeElement)
		{
			var ptXY = pt2.matrixTransform(shapeElement.node.getTransformToElement(this.SVGAsDom).inverse());
			//console.log("SVG point : "+ ptXY.x +"," + ptXY.y);
			return ptXY;
		}
		else
		{
			//console.log("SVG point for SVGAsDom pt2 : "+ pt2.x +"," + pt2.y);
			var ptXY = pt2.matrixTransform(this.SVGAsDom.getTransformToElement(this.SVGAsDom).inverse());
			//console.log("SVG point for SVGAsDom  : "+ ptXY.x +"," + ptXY.y);
			return ptXY;
		}		
	}
	else //SVG
	{
		//console.log("Cord system: SVG");
		var pt1 = shapeElement.parent().node.createSVGPoint();

		pt1.x /= scaleFactor.x;
		pt1.y /= scaleFactor.y;
		if (shapeElement)
		{
			var ptXY = pt1.matrixTransform(shapeElement.node.getTransformToElement(shapeElement.parent().node).inverse());
			return ptXY;
		}
		else
		{
			//console.log("SVG point for SVGAsDom pt1 : "+ pt1.x +"," + pt1.y);
			var ptXY = pt1.matrixTransform(this.SVGAsDom.getTransformToElement(this.SVGAsDom).inverse());
			//console.log("SVG point for SVGAsDom  : "+ ptXY.x +"," + ptXY.y);
			return ptXY;
		}
	}

}


SW_SVGCanvas.prototype.setTextMouseDown = function(textDiv) 
{
	this.isTextMouseDown  = true;
	this.shape.attr('cursor', 'auto');
	textdiv.setAttribute("contentEditable", "true");
	console.log("Svg Canvas Text mouse down set to :" + mousedownonelement);
}

SW_SVGCanvas.prototype.attachToolbar = function (SWelement) 
{
	this.toolBar = new SW_SVGToolBar(SWelement, this, this.domSVGToolsContainer);
	
	var contextMenu = new SW_SVGContextMenu(SWelement, this);
	
	var elementToAttach = SWelement.getEditableTextElement();	
	//alert("::"+elementToAttach.id +",,"+ elementToAttach);	
	if (elementToAttach && (SWelement.isForeignObject() || !SWelement.isInnerTextHidden()))
	{
		//alert("::This is foreigh object");;	
		var onToolbarEvent = function (commandName)
		{
			SWelement.textChanged(commandName);
		//	$(elementToAttach).customScrollbar("resize", true);
			//alert ("command Executed" + elementToAttach.innerHTML);
		}
		
		this.CKeditor = new SW_CKEditor(elementToAttach, onToolbarEvent);
		this.CKeditor.attachCKEditor(this.domSVGToolsContainer);
		
		//alert(elementToAttach.outerHTML);
	}
}

SW_SVGCanvas.prototype.dettachToolbar = function (canRecord) 
{	
	console.log("detching toolbar");
	if (this.CKeditor)
	{
		this.CKeditor.dettachCKEditor(canRecord);	
		this.CKeditor =  null;
	}

	if (this.toolBar)
	{
		this.toolBar.destroy();
		this.toolBar = null;
	}
	
	console.log("toolbar dettached");
}

SW_SVGCanvas.prototype.createText = function (x1, y1, width, height, isInnerText) 
{
    var groupText = this.svgCanvas.createFOText(x1, y1, width, height, isInnerText);
   
//    console.log("myforeign.outerHTML:  "+ myforeign.outerHTML);
    var swText = new SVGShape(groupText, SW_SHAPE_TYPE.SW_SVG_FOREIGN, this); 
    this.addElementAndRecord(swText);   
    return swText;
};

SW_SVGCanvas.prototype.createTable = function (x1, y1, width, height, cols, rows)
{
	
	console.log("Table creatiron " + cols +","+ rows);
	
	var myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')

	//var mytable = $('<table></table>').attr({ /*id: "basicTable"*/ width: "auto" });
	var mytable = document.createElement("table");
	var tablediv = document.createElement("div");
	tablediv.id="swforeign_" + getUniqueId();
	//mytable.id="swtable_" + getUniqueId();

	var tr = [];
	for (var i = 0; i < rows; i++) 
	{		
		var row = $('<tr></tr>').appendTo(mytable);				
		for (var j = 0; j < cols; j++) 
		{
			$('<td></td>').text("").appendTo(row); 
		}

	}

	mytable.setAttribute("width", "100%");
	mytable.setAttribute("height", "100%");
	mytable.style.tableLayout ="fixed";

	tablediv.setAttribute("width", "99%");
	tablediv.setAttribute("height", "99%");
	tablediv.setAttribute("contentEditable", "true");
	
	tablediv.style.wordWrap = "break-word";
	tablediv.style.overflow = "hidden";
   
	mytable.setAttribute("cellpadding", "0");
	mytable.setAttribute("cellspacing", "0");
	myforeign.setAttribute("width", width);
	myforeign.setAttribute("height", height);	
	mytable.setAttribute("border", "1");	
	tablediv.classList.add("insideforeign");

	/*$(mytable).click = (function () 
			{
		alert("Table changed");
			}
	);*/

	//var tmpCord = this.getStartCoordinates();

	myforeign.setAttribute("x", x1);
	myforeign.setAttribute("y", y1);
	tablediv.appendChild(mytable);
	myforeign.appendChild(tablediv);


	var p = Snap.parse(myforeign.outerHTML);	
	var g = this.svgCanvas.group().append(p);
	g.addClass("SWSVGForeignObj");

	g.attr({
		width: width,
		height: height,		    			
	});

	var myTable = new SVGShape(g, SW_SHAPE_TYPE.SW_SVG_FOREIGN, this); 
	this.addElementAndRecord(myTable);
	
	return myTable;
}


SW_SVGCanvas.prototype.isShapesDraggigDisabled = function()
{
	//console.log ("this.ctrlKeyPressed :" + this.ctrlKeyPressed);
	if (this.isDrawingStarted || this.ctrlKeyPressed)
	{	return true; }
	else
	{	return false; }
} 

SW_SVGCanvas.prototype.preventShapeDeletion = function(evt)
{
	var elid = $(document.activeElement).is("input, textarea, text, div");
	
	if (!elid)
	{
		return false;
	}
	
	return true;
}

SW_SVGCanvas.prototype.onSvgCanvasKeyEvent = function(evt)
{
	try
	{
		console.log("Key Event type :" + evt.type + ", which :" + evt.which);
		if (evt.type == "keydown")
		{
			switch(evt.which) 
			{
			case 17: // ctrl
				console.log("CTRL key pressed");
				this.ctrlKeyPressed=true;
				break;			
			default:
			}
		}
		else if (evt.type == "keyup")
		{
			switch(evt.which) 
			{
			case 17: // ctrl
				console.log("CTRL key released");				
				this.ctrlKeyPressed=false;
				break;
			case 46: // delete
				//console.log("delete tag:"+evt.target.tagName);
				if (!this.ctrlKeyPressed  && this.preventShapeDeletion(evt))
				{
					return;
				}

				for (var i=0; i< this.selectedElements.length; i++)
				{
					var isDestroyed = this.selectedElements[i].destroy(1);
					if (isDestroyed) { this.unselectAllElements(false); }
				}
				
				if (this.selectedArea)	
				{
					this.selectedArea.removeElements();
					this.selectedArea.destroy();
					this.selectedArea = null;
				}
				break;
			default:
			}
		}
		else if (evt.type == "keypress")
		{
			switch(evt.which) 
			{
				default:
			}
		}
	}
	catch(err)
	{

		console.log("key event exception: type:"+ evt.type + "key: "+ evt.which +"error:"+ err.message);
	}
}

SW_SVGCanvas.prototype.isMousePressed = function() 
{
	return this.isMouseDown;
}

SW_SVGCanvas.prototype.onSvgCanvasMouseUp = function(evt) 
{
	console.log("Mouse is Up type " + evt.type);	
	this.isMouseDown = false;	
	SWSnapDrag.mouseReleased();
	this.mouseUpElment = evt.target;
	this.mouseUpCorditates = this.convertToSVGPoint(evt.clientX, evt.clientY, SW_CORD_SYSTEM_TYPE.HTML, null);

	if (this.drawingCallBack)
	{
		console.log("Caling drawing callback");
		this.drawingCallBack(evt);
		
	}
	else
	{
		console.log("No drawing callback");
	}
}

SW_SVGCanvas.prototype.onSvgCanvasMouseDown  = function(evt) 
{
	
	console.log("svg canvas mouse down on" + evt.target.tagName);
	SWSnapDrag.mousePressed();
	
	if(this.isMouseDown)
	{
	    return; //might be last mouse up outsie canvas
	}
	
	this.isMouseDown = true;	
	
	this.mouseDownCorditates = this.convertToSVGPoint(evt.clientX, evt.clientY, SW_CORD_SYSTEM_TYPE.HTML, null);

	this.mouseDownElment = evt.target;
	/*if (this.drawingCallBack)
	{
		this.drawingCallBack(evt);
	}*/

	//console.log("Mouse is down type : " + evt.type);	
	if (!this.isDrawingStarted && this.eventCallBack)
	{
		this.eventCallBack(evt);
	}

	if (!this.drawingCallBack)
	{
	
	    var mouseDownSnapShape =  Snap.getSnapElement(evt.target,"SWSVGForeignObj");    
	    
		var isHelperShape = 0
		
		if (mouseDownSnapShape && mouseDownSnapShape.hasClass("SWShapeHelper"))
		{
			isHelperShape=1;
		}
		
		if (evt.target === this.SVGAsDom || this.isTemplate(mouseDownSnapShape) ||
				(this.ctrlKeyPressed && !isHelperShape))	//clicked outside of shape or ctrl key pressed and not helper shape 
		{	
			console.log("svg canvas mouse down on target/template " + evt.target + ", this.SVGAsDom " + 
			        this.SVGAsDom +"mouseDownSnapShape:"+mouseDownSnapShape + "ctrl key pressed :" + this.ctrlKeyPressed);
			
			this.unselectAllElements();			
			this.drawSelectionRectangle();
		}
	}
}

SW_SVGCanvas.prototype.onSvgCanvasMouseMove = function(evt) 
{
	this.mouseMoveCorditates = this.convertToSVGPoint(evt.clientX, evt.clientY, SW_CORD_SYSTEM_TYPE.HTML, null);

	if (this.isMousePressed())
	{
		if (evt.target !== this.SVGAsDom && !this.isDrawingStarted)	
		{
			var newSnapShape = Snap.getSnapElement(evt.target,"SWSVGForeignObj");  
			//console.log("newSnapShape" + evt.target + "," + newSnapShape);
			if (!newSnapShape.node.isSWSVGElement())
			{
				//console.log("moved Shape is not SWSVGElement. might be helper shape");	
			}
			else if (!this.isElementSelected())
			{			
				var SWShape = new SVGShape(newSnapShape, SVG_NONE, this); 
				console.log("Element not selected selecting");			
				this.selectElement(SWShape);
			}			
		}
	}
	
	if (this.drawingCallBack)
	{
		this.drawingCallBack(evt);
	}	
}

SW_SVGCanvas.prototype.onSvgCanvasClick = function(evt) 
{
	console.log("svg canvas clicked : " + evt.target.tagName + " mouse down on:"+this.mouseDownElment +  " mouse up on: "+ this.mouseUpElment);

	if (this.mouseDownElment != this.mouseUpElment) //not treat is as click
	{
		evt.preventDefault(); 
		return;
	}
	
	if (this.isDrawingStarted) 
	{
		console.log("svg canvas clicked : drawing in progress so ignore click");
		return;
	}
	//this.mouseDownElment = null;
	//this.mouseUpElment = null;

	allocSVGCanvasToDaraw(this);	

	this.mouseClickCorditates = this.convertToSVGPoint(evt.clientX, evt.clientY, SW_CORD_SYSTEM_TYPE.HTML, null);

	//this.svgCanvas.circle(this.mouseClickCorditates.x, this.mouseClickCorditates.y, 3).attr({ class: 'SWShapeHelper1', fill: "yellow", stroke: "#000", name: "selectionBox" });; 
    var newSnapShape = Snap.getSnapElement(evt.target,"SWSVGForeignObj");  
	if (evt.target === this.SVGAsDom || newSnapShape.isTemplate())	//clicked outside of shape 
	{		
		this.unselectAllElements();	
		console.log("svg canvas clicked unselected element, evt tatget" + evt.target.tagName);
	}
	else
	{
		if (this.isHelper(newSnapShape))
		{
			console.log("Cliked Shape is SWShapeHelper/SWTemplate.");		
		}
		else if (!this.isElementSelected())
		{			
			var SWShape = new SVGShape(newSnapShape, SVG_NONE, this); 
			console.log("Element not selected selecting");			
			this.selectElement(SWShape);
		}
		else
		{		
			if (!this.selectedElements[0].isIdenticalSnapElement(newSnapShape))
			{
				console.log("Creating shape object");
				var SWShape = new SVGShape(newSnapShape, SVG_NONE, this); 
				this.selectElement(SWShape);				
			}	
			else
			{
				console.log("Shapes are Identical.");				
			}
		}

		//alert("Creating Shape11" + newSnapShape + "ms11"+evt.target.outerHTML);
		
		/*alert("Creating Shape" + selectedShape);*/
	}
	

	if (this.eventCallBack)
	{
		this.eventCallBack ("CLICKED");
	}	
}

SW_SVGCanvas.prototype.onSvgCanvasDbClick = function(evt) 
{
	console.log("svg canvas double clicked");

	if (this.drawingCallBack)
	{
		this.drawingCallBack(evt);
	}
}

SW_SVGCanvas.prototype.getMouseClickCoordinates = function()
{
	return { x: this.mouseClickCorditates.x, y: this.mouseClickCorditates.y };
}

SW_SVGCanvas.prototype.getStartCoordinates = function()
{
	//console.log("get mouse cordinate x:" + this.mouseDownCorditates[0].x + ", y : " + this.mouseDownCorditates[0].y);
	return { x: this.mouseDownCorditates.x, y: this.mouseDownCorditates.y };
}

SW_SVGCanvas.prototype.getStopCoordinates = function()
{
	//console.log("get mouse cordinate x:" + this.mouseMoveCorditates[0].x + ", y : " + this.mouseMoveCorditates[0].y);
	return { x: this.mouseMoveCorditates.x, y: this.mouseMoveCorditates.y };
}

SW_SVGCanvas.prototype.drawSelectionRectangle = function() {
	// console.log("I am Drawing Rectangle");
	if (!this.isDrawingStarted)
	{	
		this.stopDrawing();
		this.startDrawing(this.drawSelectionRectangle.bind(this));		
	}

	var tmpCord = this.getStartCoordinates();
	var tmpCord2 = this.getStopCoordinates();  
	
	if (tmpCord.x > tmpCord2.x || tmpCord.y > tmpCord2.y)
	{
		return;
	}

	if (this.tmpDrawing) 
	{ 
		try 
		{
			this.tmpDrawing.remove(); this.tmpDrawing = null;
		}
		catch (err) 
		{
			console.log("error" + err.message);
		}
	}

	this.tmpDrawing = this.svgCanvas.rect(tmpCord.x, tmpCord.y, (tmpCord2.x-tmpCord.x), (tmpCord2.y-tmpCord.y), 0, 0).attr({
				  class: 'SWCanvasShapeSelector', stroke: '#123456', 'fill-opacity': "0.0", 'strokeDasharray': "5,5", 'strokeWidth': 1 });

	if (!this.isMouseDown)	
	{ 	
		this.selectedArea = new SW_SVGSelectedArea(this, this.tmpDrawing, this.swCanvas.canvasHistory);
		if (this.selectedArea.isEmpty())
		{
			this.selectedArea.destroy();
			this.selectedArea = null;		
		}	
			
		//alert("selection rect" + this.getSvg());
		this.stopDrawing();		
		
	}
}

SW_SVGCanvas.prototype.makeHelper = function(snapElement)
{
	snapElement.addClass("SWShapeHelper");
	return snapElement;
}

SW_SVGCanvas.prototype.isTemplate = function(element)
{
    return element && (element.hasClass("SWTemplate") ||
            element.parent().hasClass("SWTemplate")) ? true : false;
}

SW_SVGCanvas.prototype.isHelper = function(element, excludeSelector)
{
	var isPossibleSvgHelperElement  = function (elem)
	{
		//console.log("MS111: " + (elem instanceof SVGElement) + ",,,,"+  elem);
		if (elem.type.toUpperCase() == "CIRCLE" || elem.type.toUpperCase() == "ELLIPSE" 
			|| elem.type.toUpperCase() == "PATH"
			|| elem.type.toUpperCase() == "RECTANGLE" || elem.type.toUpperCase() == "RECT" 
			|| elem.type.toUpperCase() == "LINE" || elem.type.toUpperCase() == "POLYLINE"
			|| elem.type.toUpperCase() == "POLYGON" || elem.type.toUpperCase() == "G")
		{
			return true;
		}

		return false;
	}
	
	if (isPossibleSvgHelperElement(element))
	{
		if (excludeSelector && element.hasClass("SWCanvasShapeSelector"))
		{
			return false;
		}
		
		if (element.hasClass("SWShapeHelper") || element.hasClass("SWCanvasShapeSelector"))
		{
		   return true;
	    }
	}
	
	return false;
}

SW_SVGCanvas.prototype.removeShapeHelper = function()
{
	this.removeAllHelper(this.svgCanvas);
}

SW_SVGCanvas.prototype.removeAllHelper = function(svg)
{	
	var shapeList = svg.selectAll('*');
	//console.log("shape list length : " + shapeList.length);
	for(var i=0 ; i < shapeList.length; i++)
	{
		try
		{
			if (this.isHelper(shapeList[i], 1)) //remove helper shapes exclude Selector
			{
				//console.log("Removig helper Shape");
				shapeList[i].remove();
				shapeList[i] = null;
			}
		}
		catch(evt)
		{
			console.log("Not removing shep helper index i " + i +", for "+ shapeList[i].type + ", error:" + evt);			
		}	

	}
}

SW_SVGCanvas.prototype.removeCanvasShapeSelector = function()
{
	var shapeList = this.svgCanvas.selectAll('*');

	for(var i=0 ; i < shapeList.length; i++)
	{
		try
		{
			if (shapeList[i].hasClass("SWCanvasShapeSelector")) //remove Canvas ShapeSelector
			{
				//console.log("Removig helper Shape");
				shapeList[i].remove();
				shapeList[i] = null;
			}
		}
		catch(evt)
		{
			console.log("Not removing Canvas Shape Selector for " + shapeList[i].type + ", error:" + evt);			
		}	

	}
}

SW_SVGCanvas.prototype.processShapes = function()
{

	var shapeList = this.svgCanvas.selectAll('*');

	//console.log(list);
	for(var i=0 ; i < shapeList.length; i++)
	{
		try 
		{    	 
			if (shapeList[i].type  != "foreignObject" && shapeList[i].type != "desc" && shapeList[i].type != "defs")
			{
				if (this.isHelper(shapeList[i])) //remove helper shapes
				{
					//console.log("Removig helper Shape for " + shapeList[i].type);
					shapeList[i].remove();
					shapeList[i] = null;
				}
				else
				{
				    if(!shapeList[i].hasClass("SWInnerText") && !this.isTemplate(shapeList[i]))
				    {
				        //console.log("creating shape object for ");
				        myShape = new SVGShape(shapeList[i], SW_SHAPE_TYPE.SW_SVG_BASIC,this);	    	
				    }
				}
			}
			else
			{
				//console.log("No need to process foreignObject as it is embeeded in group");
			}


		}
		catch (evt)
		{
			console.log(evt + shapeList[i] );
		}
	}
}

SW_SVGCanvas.prototype.stopDrawing = function() 
{
	this.isDrawingStarted = false;
	this.drawingCallBack = null;
	this.tmpDrawing = null;

	while (this.tmpDrawingCorditates.length) 
	{ 			
		this.tmpDrawingCorditates.pop();
	}	
}

SW_SVGCanvas.prototype.startDrawing = function(myDrawingCallBackFunct) 
{
	this.isDrawingStarted = true;
	this.drawingCallBack = myDrawingCallBackFunct;
	
	if (this.selectedArea)
	{
		this.selectedArea.destroy();
		this.selectedArea = null;
	}
	
	//this.removeCanvasShapeSelector();
}


SW_SVGCanvas.prototype.setDrwaingCordinates = function(xVal, yVal)
{
	// console.log("tmp drawing cordinate set to x:" + xVal + ", y : " + yVal); 
	 this.tmpDrawingCorditates.push({x: xVal, y: yVal});
}

SW_SVGCanvas.prototype.drawCircle = function() {
	// console.log("I am Drawing Circle");
	
	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawCircle.bind(this));		
	}
	
	var tmpCord = this.getStartCoordinates();
	var tmpCord2 = this.getStopCoordinates();
	
	if (tmpCord.x > tmpCord2.x || tmpCord.y > tmpCord2.y)
	{
		return;
	}

	if (this.tmpDrawing)
	{ 
		try
		{
			this.tmpDrawing.remove(); 
			this.tmpDrawing = null;
		}
		catch (err)
		{
				console.log("Error: " + err.message);
			
		}
	}	

	this.tmpDrawing = this.svgCanvas.ellipse(tmpCord.x+(tmpCord2.x-tmpCord.x)/2, tmpCord.y+(tmpCord2.y-tmpCord.y)/2, (tmpCord2.x-tmpCord.x)/2, (tmpCord2.y-tmpCord.y)/2).attr({ stroke: '#123456', 'strokeWidth': 2,  fill: "gray",});	
	
	if (!this.isMouseDown)	
	{    
		var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_BASIC, this); 		
		this.stopDrawing();	
		this.addElementAndRecord(SWshape);
	}
}


SW_SVGCanvas.prototype.drawRectangle = function() {
	// console.log("I am Drawing Rectangle");
	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawRectangle.bind(this));		
	}

	var tmpCord = this.getStartCoordinates();
	var tmpCord2 = this.getStopCoordinates();  
	
	if (tmpCord.x > tmpCord2.x || tmpCord.y > tmpCord2.y)
	{
		return;
	}

	
	if (this.tmpDrawing) 
	{ 	
		this.tmpDrawing.remove(); 
		this.tmpDrawing = null;	
	}

	this.tmpDrawing = this.svgCanvas.rect(tmpCord.x, tmpCord.y, (tmpCord2.x-tmpCord.x), (tmpCord2.y-tmpCord.y), 0, 0).attr({ stroke: '#123456', 'strokeWidth': 2, fill: "gray" });
	
	if (!this.isMouseDown)	
	{ 
		var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_BASIC, this); 		
		this.stopDrawing();
		this.addElementAndRecord(SWshape);
	}
}

SW_SVGCanvas.prototype.drawLine = function() {

	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawLine.bind(this));			
		//console.log("Started Drawing line");
	}
	
	var tmpCord = this.getStartCoordinates();
	var tmpCord2 = this.getStopCoordinates();

	if (this.tmpDrawing)
	{ 
		this.tmpDrawing.remove(); 
		this.tmpDrawing = null;	
	}

	this.tmpDrawing = this.svgCanvas.polyline(tmpCord.x, tmpCord.y, 
			tmpCord2.x, tmpCord2.y).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' });
	
	if (!this.isMouseDown)	
	{ 
		var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_BASIC, this);	
		this.stopDrawing();	
		this.addElementAndRecord(SWshape);			
	}
}

SW_SVGCanvas.prototype.drawPolyline = function(evt) {
	//console.log("drawing plyline");
	var tmpCord = this.getStartCoordinates();
	var tmpCord2 = this.getStopCoordinates();

	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawPolyline.bind(this));
		//console.log("first drawing cordinate x : " + tmpCord.x + ", y :" + tmpCord.y);
		this.setDrwaingCordinates(tmpCord.x, tmpCord.y);		
	}

	//if (this.tmpDrawing) { this.tmpDrawing.destroy(); this.tmpDrawing = null; }	
	if (this.tmpDrawing) 
	{ 
		this.tmpDrawing.remove();
		this.tmpDrawing = null;	
	}		

	var stopCordDiff = 5;		
	var ignorePtCordDiff = 15;
	var stopMyDrawing = false;	
	var ignorePt=false;
	var isSameAsBegin=false;
	
	if (Math.abs(this.tmpDrawingCorditates[0].x-tmpCord2.x) < stopCordDiff && Math.abs(this.tmpDrawingCorditates[0].y-tmpCord2.y) < stopCordDiff)
	{	tmpCord2.x = this.tmpDrawingCorditates[0].x;
		tmpCord2.y = this.tmpDrawingCorditates[0].y;	
		isSameAsBegin = true;
	}	
	
	if (evt && evt.type == 'mouseup')
	{ 
		var drawingLastCord = this.tmpDrawingCorditates[this.tmpDrawingCorditates.length-1];

		if (Math.abs(drawingLastCord.x-tmpCord2.x) < stopCordDiff && Math.abs(drawingLastCord.y-tmpCord2.y) < stopCordDiff)
		//if (drawingLastCord.x == tmpCord2.x && drawingLastCord.y == tmpCord2.y)
		{
			stopMyDrawing = true;
			ignorePt = true;
		}
		else
		{
			console.log("Not stopping " + drawingLastCord.x+ "," + tmpCord2.x + "," + drawingLastCord.y +","+tmpCord2.y);
		}
				
		if (Math.abs(drawingLastCord.x-tmpCord2.x) < ignorePtCordDiff 
				&& Math.abs(drawingLastCord.y-tmpCord2.y) < ignorePtCordDiff && !isSameAsBegin)
		{	
			console.log("Polyine draw ignoring this point ");
			ignorePt = true;	
		}
	}
	
	var drwingCordinates = "";
	
	for (var i=0; i<this.tmpDrawingCorditates.length; i++)
	{
		//console.log("Total cordinate length :"+ this.tmpDrawingCorditates.length);
		drwingCordinates = drwingCordinates + this.tmpDrawingCorditates[i].x + ", " + this.tmpDrawingCorditates[i].y;

		if (i < this.tmpDrawingCorditates.length-1 || !ignorePt) { drwingCordinates += ", "; }
		////console.log("drawing cordinate: " + drwingCordinates);
	}

	if (!ignorePt) { drwingCordinates += tmpCord2.x + ", " + tmpCord2.y; }

	//console.log("drawing cordinate111: " + drwingCordinates);

	this.tmpDrawing = this.svgCanvas.polyline([drwingCordinates]).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' });
	//this.tmpDrawing = new SVGShape(pl, SVG_LINE, this); 	

	//console.log("drawing cordinate11122222: " + drwingCordinates);
	//console.log("drawing evt.type: " +  evt.type);

	if (evt && evt.type == 'mouseup')
	{ 	
		if (!ignorePt)
		{	
			//console.log("Adding drawing cordinate: " + tmpCord2.x  +":" +tmpCord2.y );		
			this.setDrwaingCordinates(tmpCord2.x, tmpCord2.y);
		}
		
		if (stopMyDrawing)
		{
			{ 
				var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_BASIC, this); 				
				this.stopDrawing();		
				this.addElementAndRecord(SWshape);
			}
		}		
	}	
}

SW_SVGCanvas.prototype.drawText = function()
{	

	if (this.isTextMouseDown) 
	{
		return;
	}

	this.isTextMouseDown = false;

	// console.log("I am Drawing Rectangle");
	if (!this.isDrawingStarted)
	{	
		this.stopDrawing();
		this.startDrawing(this.drawText.bind(this));		
	}

	var tmpCord = this.getStartCoordinates();
	var tmpCord2 = this.getStopCoordinates();  
	
	if (tmpCord.x > tmpCord2.x || tmpCord.y > tmpCord2.y)
	{
		return;
	}

	if (this.tmpDrawing) { this.tmpDrawing.remove();  this.tmpDrawing = null;}

	this.tmpDrawing = this.svgCanvas.rect(tmpCord.x, tmpCord.y, (tmpCord2.x-tmpCord.x), (tmpCord2.y-tmpCord.y), 0, 0).attr({
				  class: 'SWShapeHelper', stroke: '#123456', 'fill-opacity': "0.0", 'strokeDasharray': "5,5", 'strokeWidth': 1 });

	if (!this.isMouseDown)	
	{ 		
		this.tmpDrawing.remove(); 	
		this.tmpDrawing = null;
		this.stopDrawing();		
		this.createText(tmpCord.x, tmpCord.y, (tmpCord2.x-tmpCord.x), (tmpCord2.y-tmpCord.y));									
	}

	//console.log("isTextMouseDown : " +this.isTextMouseDown);	
}

SW_SVGCanvas.prototype.drawTable = function(cols,rows) 
{
	if (!this.isDrawingStarted)
	{	
		this.stopDrawing();
		this.startDrawing(this.drawTable.bind(this, cols,rows));		
	}

	var tmpCord = this.getStartCoordinates();
	var tmpCord2 = this.getStopCoordinates();  
	
	if (tmpCord.x > tmpCord2.x || tmpCord.y > tmpCord2.y)
	{
		return;
	}

	if (this.tmpDrawing) { this.tmpDrawing.remove(); this.tmpDrawing = null; }

	this.tmpDrawing = this.svgCanvas.rect(tmpCord.x, tmpCord.y, (tmpCord2.x-tmpCord.x), (tmpCord2.y-tmpCord.y), 0, 0).attr({
				  class: 'SWShapeHelper', stroke: '#123456', 'fill-opacity': "0.0", 'strokeDasharray': "5,5", 'strokeWidth': 1 });

	if (!this.isMouseDown)	
	{ 		
		this.tmpDrawing.remove(); 	
		this.tmpDrawing = null;
		this.stopDrawing();		
		var mytable = this.createTable(tmpCord.x, tmpCord.y, (tmpCord2.x-tmpCord.x), (tmpCord2.y-tmpCord.y), cols,rows);
	}
	//console.log("cols:" + cols +", rows" + rows);	
}

SW_SVGCanvas.prototype.drawCubicCurve = function() 
{

	//var cubicCurvePath = this.svgCanvas.path("M50,50 C75,80 125,20 150,50").attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' });
	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawCubicCurve.bind(this));		
	}

	if (this.tmpDrawing) 
	{ 
		this.tmpDrawing.remove();
		this.tmpDrawing = null;	
	}

	var startCord = this.getStartCoordinates();
	var endCord = this.getStopCoordinates();
	var crX1 = startCord.x+50, crY1 = endCord.y-50;
	var crX2 = endCord.x-50, crY2 = startCord.y+50;

	this.tmpDrawing = this.svgCanvas.cubicurve(startCord.x, startCord.y, endCord.x, endCord.y,
			crX1, crY1, crX2, crY2).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' , "fill-opacity": "0.0"});

	if (!this.isMouseDown)	
	{ 
		var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_BASIC, this); 		
		this.stopDrawing(); 
		this.addElementAndRecord(SWshape);
	}

}

SW_SVGCanvas.prototype.drawArc = function() 
{
	
	//alert("Drawing Arc");
	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawArc.bind(this));		
	}

	if (this.tmpDrawing)
	{ 
		this.tmpDrawing.remove();
		this.tmpDrawing = null;	
	}
	
	var startCord = this.getStartCoordinates();
	var endCord = this.getStopCoordinates();
	
	this.tmpDrawing = this.svgCanvas.arc(startCord.x ,startCord.y, endCord.x, endCord.y, 1, 1).attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' , "fill-opacity": "0.0"});
	
	if (!this.isMouseDown)	
	{ 
		var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_BASIC, this); 
		this.stopDrawing(); 
		this.addElementAndRecord(SWshape);
	}
}

SW_SVGCanvas.prototype.drawCurveArrow = function(arrowHeadSide, arrowLineType)
{
	//alert("drawCurveArrow");

	//var cubicCurvePath = this.svgCanvas.path("M50,50 C75,80 125,20 150,50").attr({ stroke: '#123456', 'strokeWidth': 2, fill: 'gray' });
	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawCurveArrow.bind(this, arrowHeadSide, arrowLineType));	
	}

	if (this.tmpDrawing) 
	{ 
		this.tmpDrawing.remove();
		this.tmpDrawing = null;	
		
	}

	var startCord = this.getStartCoordinates();
	var endCord = this.getStopCoordinates();
	
	this.tmpDrawing = this.svgCanvas.curvearrow(startCord.x, startCord.y, endCord.x, endCord.y, 
			arrowHeadSide, arrowLineType).attr({ stroke: '#123456', 'strokeWidth': 1, fill: 'gray' , "fill-opacity": "0.0"});

	if (!this.isMouseDown)	
	{ 
		var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_BASIC, this); 		
		this.stopDrawing(); 
		this.addElementAndRecord(SWshape);
	}
}

SW_SVGCanvas.prototype.drawLineArrow = function(arrowHeadSide, arrowLineType)
{

	if (!this.isDrawingStarted)
	{
		this.stopDrawing();
		this.startDrawing(this.drawLineArrow.bind(this, arrowHeadSide, arrowLineType));		
	}
	
	var startCord = this.getStartCoordinates();
	var endCord = this.getStopCoordinates();	
	
	if (this.tmpDrawing)
	{ 
		this.tmpDrawing.remove();
		this.tmpDrawing = null;	
	}
		   
	this.tmpDrawing = this.svgCanvas.linearrow(startCord.x, startCord.y, endCord.x, endCord.y, 
			arrowHeadSide, arrowLineType).attr({ stroke: '#123456', 'strokeWidth': 1, fill: 'gray' , "fill-opacity": "0.0"});
	
	if (!this.isMouseDown)	
	{ 
		var SWshape = new SVGShape(this.tmpDrawing, SW_SHAPE_TYPE.SW_SVG_ARROW, this); 
		this.stopDrawing(); 
		this.addElementAndRecord(SWshape);
	}
}
//*******************************************************************************************

var SVGShape = function(myShape, type, SWsvgCanvas) 
{
	if (myShape.node.SWSVGShape !== undefined)
	{
	    console.log("returning already created SVGShape object. only removing and adding EventListener"); //like singloton
	  
	    myShape.node.SWSVGShape.addEventListener();
	    
	    if (myShape.hasClass("SWInnerText"))
	    {
	        if(myShape.node.SWSVGShape.swAssociatedShape)
	        {   
	            return myShape.node.SWSVGShape.swAssociatedShape;
	        }
	        else
	        {
	            this.attachAssociatedShape();
	            return myShape.node.SWSVGShape.swAssociatedShape;
	        }
	    }

	    return myShape.node.SWSVGShape;
	}	

	//alert("creating SW shape" + myShape.node.SWSVGShape + "\n:" +  myShape);
	console.log("Creating SW shape");
	
	
	//console.log("SW SVG: log shape construction callled.");
	this.SWsvgCanvas = SWsvgCanvas;
	this.shape = myShape;	
	
	var swUid = 0;
	
	if (this.shape.node.id == "")
	{
	    var swUid = getUniqueId();
	    this.shape.node.id = "SW_Shape_"+  swUid;
	}
	else
	{
	    var tmpID = this.shape.node.id;
	    swUid = tmpID.substring("SW_Shape_".length, tmpID.length);
	  //  alert("id"+tmpID +"uid:"+swUid);
	}
	
	this.shapeType = this.setShapeType(); //not using type provided to detect
	this.adjustFactor = this.calculateAdjustFactor();
	this.myStrokeWidth = 2;


	this.actionToPerforrm = "ADD_ACTION_TOOLS"; 
	this.actionHandleGroup = null;
	this.ShapeSpecificHelperGroup = null;
	this.shapeCenter=null;
	//this.shapeRotator = null;
	this.shapeResizer = null;
	this.shapeResizerTL = null;
	this.shapeResizerTR = null;
	this.shapeResizerBL = null;
	this.shapeContainerBox = null;

	this.isSelected = false;
	this.dragClick = false;
	this.swRecorder = new SW_Recorder;
	this.textMonitor = null;	
	this.svgScrollBar = null;
	
	if (this.isForeignObject()) 
	{ 
	    this.resetTableAttr(true);		//add mode
		this.textMonitor = new SW_TextEditMonitor(this);
		//this.svgScrollBar = new SW_SVGScrollBar(this, this.SWsvgCanvas);
	}
	
	

	//this.shape.drag(this.moveMe, this.start, this.stop);
	//this.shape.drag(move,start,stop);	
	this.onMouseUp = this.shapeOnMouseUp.bind(this);	
	this.onMouseDown = this.shapeOnMouseDown.bind(this);	
	this.onMouseMove = this.shapeOnMouseMove.bind(this);	
	this.onHover = this.shapeOnHover.bind(this);
	this.onUnhover = this.shapeOnUnhover.bind(this);
	this.onClick = this.shapeOnClick.bind(this);	
	this.onDblClick = this.shapeOnDblClick.bind(this);
	this.onKeyEvent = this.shapeOnKeyEvent.bind(this);
	
	//this.shape.hover(this.onHover, this.onUnhover);
	//this.shape.unhover(this.onHover, this.onUnhover);
	this.addEventListener();
	
	this.shape.node.SWSVGShape = this;
	this.swInnerText = null;
	this.swAssociatedShape = null;
	
	this.swInnerText = null;
	
	//attach its inner Text for shape
	if (!this.shape.hasClass("SWInnerText"))//not inner Text
	{
	    //not needed for foreign object
	    //alert("processing shape for inner class " + this.shape);
	    if (!this.isForeignObject() && !this.swInnerText)
	    {
	        var groupText = null;
	        
	        var existingInnerTextElemOnCanvas = this.shape.parent().node.getElementById("SW_InnerText_"+ swUid);
	       
	        if (!existingInnerTextElemOnCanvas)
	        {   
	            var myBox = this.getInnerTextCord();//this.shape.getBBox(); 
	            groupText = this.shape.parent().createFOText(myBox.x, myBox.y, myBox.w, myBox.h, true);    
	        }
	        else
	        {
	            groupText = Snap._.wrap(existingInnerTextElemOnCanvas);
	            groupText.paper = this.shape.parent().paper; 
	        }

	        groupText.addClass("SWInnerText");
	        
            this.swInnerText = new SVGShape(groupText, SW_SHAPE_TYPE.SW_SVG_FOREIGN, this.SWsvgCanvas);
	        this.swInnerText.swAssociatedShape = this;	  
	        this.swInnerText.shape.node.id = "SW_InnerText_"+ swUid;
	        this.resetInnerTextAttr();
	        
	        if (!existingInnerTextElemOnCanvas)
	        {
	            this.hideInnerText();
	        }
	    }
	}
	
	return this;

	//var myangle = this.shape.transform().localMatrix.split().rotate;
	//var tstring = newMatrix.toTransformString();

	//console.log("Added shape with angle: : " + myangle);
}

SVGShape.prototype.resetTableAttr = function(isAddMode)
{
    if (this.isForeignObject()) 
    { 
        
        if (this.isTable())
        {
            
            var myTable = this.getEditableElement().firstChild;
            
            for (var rowIndex=0; rowIndex < myTable.rows.length; rowIndex++)
            {                   
                var row = myTable.rows[rowIndex];
                for (var cellIndex=0; cellIndex < row.cells.length; cellIndex++)
                {
                    var cell = row.cells[cellIndex];
                  /*  if(isAddMode)
                    {
                        var cellDiv =document.createElement("div");
                        cellDiv.style.overflowY = "auto";
                        cellDiv.style.overflowX = "hidden";
                        cellDiv.style.height = "100%";
                        cellDiv.style.width = "100%";
           
                        cell.appendChild(cellDiv);
                    }*/
                    var tdWidth = $(cell).width();
                    var tdHeight = $(cell).height();    
                    $(cell).width(tdWidth);
                    $(cell).height(tdHeight);
                    
                    //$(cell).css("width", tdWidth);
                    //$(cell).css("hight", tdHeight);
                }
            }
        }

    }
}


SVGShape.prototype.getInnerTextCord = function()
{
    var myBox = this.shape.getBBox(1); 
   // var tmpshape = this.shape.parent().circle(myBox.cx, myBox.cy, myBox.r1).attr({class : "SWShapeHelper",'fill-opacity' : 0.1, 'stroke-width' : 2});   
   // var innerbox =  tmpshape.getBBox(1); 
   // this.shape.parent().rect(innerbox.x, innerbox.y, innerbox.w, innerbox.h).attr({class : "SWShapeHelper", 'fill-opacity' : 0.1, 'stroke-width' : 2});
    return myBox; 
}

SVGShape.prototype.resetInnerTextAttr = function()
{
    if (this.swInnerText)
    {
        console.log("setting inner text attrib");
        var myBox = this.getInnerTextCord(); 
        this.swInnerText.shape.attr({x: Math.round(myBox.x), y: Math.round(myBox.y), 
            width: Math.round(myBox.w), height: Math.round(myBox.h)});   
        
        var element =  this.swInnerText.shape.node.getElementsByTagName("foreignObject")[0];

        //console.log("orignal elsement is:" +element.outerHTML);

        element.setAttribute("x", Math.round(myBox.x));
        element.setAttribute("y", Math.round(myBox.y));
        element.setAttribute("width", Math.round(myBox.w));
        element.setAttribute("height", Math.round(myBox.h));
        this.swInnerText.shape.attr({ transform: ""/*tmpMatrix.toTransformString()*/ });
       // var rotationAngle = this.shape.getRotationAngle()
        this.swInnerText.shape.attr({ transform: this.shape.transform().localMatrix.toTransformString() });
    }
}

SVGShape.prototype.destroy = function(ifPossbile) 
{
	var canDestory=true;
	if (typeof ifPossbile !== undefined && ifPossbile == 1) 
	{
		if (this.isForeignObject() && !this.shapeContainerBox)
		{
			//alert("shape type:" + this.shape.type);
			canDestory = false;
		}
	}

	if (canDestory)
	{	
		this.remove(true);
		return true;
	}
	
	return false;
}

SVGShape.prototype.remove = function (canRecord)
{
	if (this.shape)
	{
		if (canRecord == undefined || canRecord == null)
		{
			canRecord = true;
		}

		//this.SWsvgCanvas.unselectElement(this);
		this.unselect();
		this.removeEventListener();

		if (canRecord) { this.startRecording(true); } //inDeleteMode true 

		this.shape.remove();
		this.shape = null;
		//remove inner text also
		if (this.swInnerText) 
		{ this.swInnerText.shape.remove();
		}
		
		if (this.svgScrollBar) { this.svgScrollBar.reset(); }
		
		if (canRecord) { this.stopRecording(true); }
	}

}

SVGShape.prototype.getHTML = function ()
{
	if (this.shape)
	{ 
		//console.log("getHTML" + this.shape);
		return this.shape.node.outerHTML;	
	}
	else
	{
		return null;
	}

}

SVGShape.prototype.getNext = function()
{
	if (!this.shape)
	{
		console.log("getNext :no SWSVGShape is null."); 
		return null;
	}

	var next = null;
	tmpShape = this.shape;
	
	while (true)
	{
		next = tmpShape.getNext();

		if (!next)
		{
			console.log("no next element found.");
			return null;
		}


		if (next.node.SWSVGShape === undefined) //SWSVGShape not attached to helpers/template so this element is template/helper 
		{
			console.log("getNext :no SWSVGShape attached. finding next to this ");
			tmpShape = next;
			continue;
		}
		
		break;
	}

	console.log("next SW shape is:  " + next.node.SWSVGShape.shape);
	return next.node.SWSVGShape;
}

SVGShape.prototype.getPrevious = function()
{
	if (!this.shape)
	{
		console.log("getPrevious :no SWSVGShape is null."); 
		return null;
	}
	
	var prev = null;
	tmpShape = this.shape;
	
	while (true)
	{
		prev = tmpShape.getPrevious();

		if (!prev)
		{
			console.log("no previous element found.");
			return null;
		}
		
		if (prev.node.SWSVGShape === undefined) //SWSVGShape not attached to helpers/templates so this element is template/helper 
		{
			console.log("getPrevious :no SWSVGShape attached. finding  prevoious to this ");
			tmpShape = prev;
			continue;
		}
		
		break;
	}

	console.log("previous SW shape is:  " + prev.node.SWSVGShape);
	return prev.node.SWSVGShape;
}

SVGShape.prototype.getSnapShot = function (options)
{
	var mySnapShot = new SW_SnapShot(this, options);
	return mySnapShot;
}

//this function must not record 
SVGShape.prototype.setSnapShot = function (SWSnapShot)
{
	//alert("start reseting dom object\n" + this.shape + "\n"+ domObject.outerHTML);
	//console.log("setting snap shot");
    
    var setShapeContent = function(swElemnt, myContent)
    {
        console.log("myContent"+myContent);
        var fragment = Snap.parse(myContent);
        swElemnt.shape = fragment.selectAll('*')[0];    
        swElemnt.shape.paper = swElemnt.SWsvgCanvas.getSvgAsSnap().paper;   
        swElemnt.shape.node.SWSVGShape  = swElemnt;
    }
    
	if (SWSnapShot && SWSnapShot.content)
	{
		var currPrev = null;
		var tmpHelperClone = null; 
		
		if (this.shape)
		{
		//	alert("setSnapShot called" + this.shape.type);
			this.removeEventListener();
			this.unselect();
			currPrev = this.shape.getPrevious();				
			tmpHelperClone = this.shape;
			var cloneId = "swTmpClone_" + getUniqueId();
			tmpHelperClone.attr({ class: 'SWShapeHelper', id: cloneId });
			this.shape = null;
		}
		else
		{
			console.log("setSnapShot: shape is not present on canvas, might be deleted");
		}
		//alert("setSnapShot HTML");
		// var setShapeSnapShotContent = setShapeContent.bind(this);
		//setShapeContent(this, SWSnapShot.content);
		
		 var fragment = Snap.parse(SWSnapShot.content);
	     this.shape = fragment.selectAll('*')[0];    
	     this.shape.paper = this.SWsvgCanvas.getSvgAsSnap().paper;   
	     this.shape.node.SWSVGShape = this;
	     
		if (tmpHelperClone)
		{
			console.log("setSnapShot: adding after self tmp clone");
			tmpHelperClone.after(this.shape);
			tmpHelperClone.remove();
			tmpHelperClone = null; 
		}
		
		if (SWSnapShot.prev && SWSnapShot.prev.shape &&
				 SWSnapShot.prev.shape.node.parentNode) 
			//issue case if preves element is present but that is not preesnt on canvas this is code bug
			//can be observed if previous element delete is not recorded
		{
				//prev.after(this.shape);
				var prevSWShape = SWSnapShot.prev;
				prevSWShape.shape.after(this.shape);
		}
		else
		{
		    console.log("setSnapShot: No previous element found in snap shot so this was last element");
		    this.SWsvgCanvas.getSvgAsSnap().append(fragment);
		    this.shape.toBack();
		    //this.SWsvgCanvas.getSvgAsSnap().prepend(this.shape);
		}

		if (SWSnapShot.hasInnerTextChange)
		{
		    if (this.swInnerText)
		    {
		        if (this.swInnerText.shape) { this.swInnerText.shape.remove(); }          
		        setShapeContent(this.swInnerText, SWSnapShot.swInnerText);

		        this.shape.after(this.swInnerText.shape);
		    }
		    else
		    {
		        console.log("setSnapShot: swInnerText is not attached");
		    }
		}
		
		
		this.resetInnerTextAttr();
		//alert ("::"+this.swInnerText.swAssociatedShape);
		
	//	this.addEventListener();
	    //alert ("::"+this.swInnerText.swAssociatedShape);

		if (this.svgScrollBar) { this.svgScrollBar.reInit(); }
		
		//alert(this.shape);
	}
	else
	{
		console.log("setSnapShot : myHtml is null, so removing shape...");
		if (this.shape)
		{
		//	alert("setSnapShot called" + this.shape.type);
			this.removeEventListener();
			this.unselect();
			this.shape.remove();
			this.shape = null;
			this.swInnerText.remove(false);
			if (this.svgScrollBar) { this.svgScrollBar.reset(); }
		}
	}
    
	return this;
}

SVGShape.prototype.startRecording = function (inDeleteMode)
{
    
    var textChanged = inDeleteMode ?  true: false;
	var myShapSnapShot = this.getSnapShot({ "hasTextChange" : textChanged});
	var undoFunction = this.setSnapShot.bind(this, myShapSnapShot);		
	
	this.swRecorder.recordUndoFunction(undoFunction);
	
	console.log("startRecording: recorded");
}

SVGShape.prototype.stopRecording = function (recordOnStop)
{
	var myShapSnapShot = this.getSnapShot({ hasTextChange : false});
	var redoFunction = this.setSnapShot.bind(this, myShapSnapShot);		
	this.swRecorder.recordRedoFunction(redoFunction);
	
	if (recordOnStop)
	{	
		//make sure object passed is indepenant object of recorder
		var newSWRecorder = new SW_Recorder;
		
		var undoFunct = this.swRecorder.getUndoFunction();
		var redoFunct = this.swRecorder.getRedoFunction();
		
		newSWRecorder.recordUndoFunction(undoFunct);
		newSWRecorder.recordRedoFunction(redoFunct);
		
		this.SWsvgCanvas.recordCanvasHistory(newSWRecorder);
		console.log("stopRecording: recorded");
	}
	else
	{
		console.log("Not recording");
	}
	
	//console.log("stopRecording\n" + this.shape + "\n"+ myShapSnapShot.content);
	//this.swRecorder.reset();
}

SVGShape.prototype.recordTextChange = function (swRecorder)
{
	console.log("Recoding text change");
	this.SWsvgCanvas.recordCanvasHistory(swRecorder);
}

SVGShape.prototype.getTextMonitor = function()
{
	return this.textMonitor; //null if not Foreign object
}

SVGShape.prototype.textChanged = function (commandName)
{
		console.log("text changed command: "+ commandName);
		
		var swElem = this;
	
		if (this.swInnerText)
		{
		    swElem = this.swInnerText;
		}
		
		if (!swElem.textMonitor)
		{	return; }
		
		var swRecord = swElem.textMonitor.getRecordInfo();
		if (swRecord)
		{
			this.recordTextChange(swRecord);
		}
}
SVGShape.prototype.addEventListener = function ()
{
	if (this.shape)
	{
		this.removeEventListener();
		
		var actionPertform = this.shapeDrag.bind(this);	
		var actionStop = this.shapeDragStop.bind(this);	
		var actionStart = this.shapeDragStart.bind(this);	

		console.log("adding event listener");

		try
		{
			if (this.isForeignObject()) 
			{
				this.shape.startKeyEvents(this.onKeyEvent);	
			}
			else
			{
				//this.shape.drag(actionPertform, actionStart, actionStop);
				this.shape.swDrag(actionPertform, actionStart, actionStop);
			}

			this.shape.dblclick(this.onDblClick);
			this.shape.click(this.onClick);
			this.shape.mousedown(this.onMouseDown);
			this.shape.mouseup(this.onMouseUp);
			this.shape.mousemove(this.onMouseMove);
			this.shape.unhover(this.onHover, this.onUnhover); //remove hover event handler
			this.shape.hover(this.onHover, this.onUnhover);
			console.log("added event listener ");
		}
		catch (evt)
		{
			console.log("Failed to add drag event listener: " + evt);
			//alert("::"+this.shape.type);
		}
	}
	else
	{
		 console.log("shape is not attached");
	}

}

SVGShape.prototype.removeEventListener = function ()
{
	
	if (this.shape)
	{
		console.log("Removing event listener" + this.shape.node);
		this.shape.undblclick(this.onDblClick);
		this.shape.unclick(this.onClick);
		this.shape.unmousedown(this.onMouseDown);
		this.shape.unmouseup(this.onMouseUp);
		this.shape.unmousemove(this.onMouseMove);
		//this.shape.unhover(this.onHover, this.onUnhover); 
		//this.shape.undrag();
		this.shape.swUndrag();
		if (this.shape.type  == "g" && this.shape.hasClass("SWSVGForeignObj"))
		{
			this.shape.stopKeyEvents(this.onKeyEvent);
		}
		console.log("Removed event listener");
	}
}

SVGShape.prototype.isIdenticalSnapElement = function(element)
{
	
	/*$(this.shape.node).is($(element.node))
	{
		return true;
	}*/
    var isSWElement = function(swElem)
    {
        if (swElem.shape.type != element.type)
        {
            return false;
        }

        var selectedBBox = swElem.shape.getBBox();
        var elemBbox =  element.getBBox();

        if (selectedBBox.x ==  elemBbox.x && selectedBBox.y ==  elemBbox.y
                && selectedBBox.x2 ==  elemBbox.x2 && selectedBBox.y2 ==  elemBbox.y2)
        {
            return true;
        } 
    }
    
    if (isSWElement(this))
    {  
        return true;   
    }
    
    if (this.swInnerText && isSWElement(this.swInnerText))
    {
        return true;
    } 	
	
	return false;
}
//Checks if a string is a valid RGB(A) string
SVGShape.prototype.isRgb = function(string) 
{
    var rgb = string.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? true : false;
}

SVGShape.prototype.rgbString2hex =  function(rgb)
{
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
    ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

SVGShape.prototype.rgb2Rgba =  function(rgb, newAlpha)
{
	 if (newAlpha == null || typeof newAlpha == undefined)
	 {
		 newAlpha = 1;
	}
	 
	var newRGBA = rgb.replace(')', ', ' + newAlpha+')').replace('rgb', 'rgba');
	console.log("rgb::" + rgb + ", rgb::" + newRGBA);
	return newRGBA;
}

SVGShape.prototype.getColorValues = function(color) //hex, rgb. rgba
{
	var values = { red:null, green:null, blue:null, alpha:null };
	if( typeof color === 'string' ){
		/* hex */
		if( color.indexOf('#') === 0 ){
			color = color.substr(1)
			if( color.length == 3 )
				values = {
					red:   parseInt( color[0]+color[0], 16 ),
					green: parseInt( color[1]+color[1], 16 ),
					blue:  parseInt( color[2]+color[2], 16 ),
					alpha: 1
				}
			else
				values = {
					red:   parseInt( color.substr(0,2), 16 ),
					green: parseInt( color.substr(2,2), 16 ),
					blue:  parseInt( color.substr(4,2), 16 ),
					alpha: 1
				}
		/* rgb */
		}else if( color.indexOf('rgb(') === 0 ){
			var pars = color.indexOf(',');
			values = {
				red:   parseInt(color.substr(4,pars)),
				green: parseInt(color.substr(pars+1,color.indexOf(',',pars))),
				blue:  parseInt(color.substr(color.indexOf(',',pars+1)+1,color.indexOf(')'))),
				alpha: 1
			}
		/* rgba */
		}else if( color.indexOf('rgba(') === 0 ){
			var pars = color.indexOf(','),
				repars = color.indexOf(',',pars+1);
			values = {
				red:   parseInt(color.substr(5,pars)),
				green: parseInt(color.substr(pars+1,repars)),
				blue:  parseInt(color.substr(color.indexOf(',',pars+1)+1,color.indexOf(',',repars))),
				alpha: parseFloat(color.substr(color.indexOf(',',repars+1)+1,color.indexOf(')')))
			}
		/* verbous */
		}else{
			var stdCol = { acqua:'#0ff',   teal:'#008080',   blue:'#00f',      navy:'#000080',
						   yellow:'#ff0',  olive:'#808000',  lime:'#0f0',      green:'#008000',
						   fuchsia:'#f0f', purple:'#800080', red:'#f00',       maroon:'#800000',
						   white:'#fff',   gray:'#808080',   silver:'#c0c0c0', black:'#000' };
			if( stdCol[color]!=undefined )
				values = getColorValues(stdCol[color]);
		}
	}
	return values
}

SVGShape.prototype.setFillColor = function(newColor, newOpacity, canRecord)
{
	if (this.getFillColor() == newColor && this.getFillOpacity() == newOpacity)
	{
		return;
	}
	
	if (canRecord) { this.startRecording(); }
	
	if (this.isForeignObject()) 
	{	
		var editableElem = this.getEditableElement();
		editableElem.style.background = newColor;
		//alert("foreign object" + editableElem.style.background);
	}
	else
	{
		this.shape.attr({ fill: newColor });
	}
	
	this.setFillOpacity(newOpacity);
	
	if (canRecord) { this.stopRecording(true); }
	//console.log("Fill Color:" + newColor);
}

SVGShape.prototype.getFillColor = function()
{
	var myColor;
	
	if (this.isForeignObject()) 
	{
		var editableElem = this.getEditableElement();
		myColor = editableElem.style.background;
		//alert("foreign object" + fo.type);
	}
	else
	{
		myColor = this.shape.attr('fill');
	}
	
	if (this.isRgb(myColor))
	{ 
		return this.rgbString2hex(myColor);
	}	
	
	return myColor;
}

SVGShape.prototype.setFillRadialGradient = function()
{
	var g = paper.gradient("r(0.5, 0.5, 0.5)#000-#fff");
	this.shape.attr({ fill: g });
}

SVGShape.prototype.setFillLinearGradient = function(hexTopColor, hexBottomColor)
{
	var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
	this.shape.attr({ fill: g });
}

SVGShape.prototype.setFillOpacity  = function(newOpacity)
{
	if (newOpacity == null) { return; } //zero is possible
	
	if (this.isForeignObject()) 
	{
		var editableElem = this.getEditableElement();
		
		myColor = editableElem.style.background;
		
		//editableElem.style.opacity = newOpacity;
		if (this.isRgb(myColor))
		{
			var newColor = this.rgb2Rgba(myColor, newOpacity);
			editableElem.style.background = newColor;
		}
		else
		{
			console.log("fill color is not RGB, not setting alpha opacity");
		}
	}
	else
	{
		this.shape.attr({ 'fill-opacity': newOpacity });
		//alert("setFillOpacity11" + newOpacity);
	}
	
	console.log("Fill-Opacity :" + newOpacity);	
}

SVGShape.prototype.getFillOpacity  = function ()
{
	if (this.isForeignObject()) 
	{
		var editableElem = this.getEditableElement();
		var myColor = editableElem.style.background;		
		var colorVal = this.getColorValues(myColor);
		return colorVal.alpha;
	}
	else
	{
		return this.shape.attr('fill-opacity');
	}
}

SVGShape.prototype.getBorderColor = function()
{
	var myColor;
	
	if (this.isForeignObject()) 
	{
		var editableElem = this.getEditableElement();
		myColor = editableElem.style.borderColor;
	}
	else
	{
		myColor = this.shape.attr('stroke');
	}
	
	if (this.isRgb(myColor))
	{ 
		return this.rgbString2hex(myColor);
	}	
	
	return myColor;
}

SVGShape.prototype.setBorderColor = function(newColor, newOpacity, canRecord)
{
	
	if (this.getBorderColor() == newColor && this.getBorderOpacity() == newOpacity)
	{
		return;
	}
	
	if (canRecord) { this.startRecording(); }
	
	if (this.isForeignObject()) 
	{
		
		//var fo = this.shape.node.getElementsByTagName('foreignObject')[0];
		var editableElem = this.getEditableElement();
		editableElem.style.borderColor = newColor; 
		//console.log(editableElem.outerHTML);
		
		//fo.style.background = "green";		
	}
	else
	{
		this.shape.attr({ stroke: newColor });
	}

	this.setBorderOpacity(newOpacity); 
	
	if (canRecord) { this.stopRecording(true); }
}

SVGShape.prototype.getBorderOpacity  = function ()
{
	if (this.isForeignObject()) 
	{
		var editableElem = this.getEditableElement();
		var myColor = editableElem.style.borderColor;		
		var colorVal = this.getColorValues(myColor);
		return colorVal.alpha;
	}
	else
	{
		return this.shape.attr('stroke-opacity');
	}
}

SVGShape.prototype.setBorderOpacity  = function(newOpacity)
{

	if (newOpacity == null) { return; }  //zero is possible
	
	if (this.isForeignObject()) 
	{
		var editableElem = this.getEditableElement();
		myColor = editableElem.style.borderColor;
		//editableElem.style.opacity = newOpacity;
		if (this.isRgb(myColor))
		{
			var newColor = this.rgb2Rgba(myColor, newOpacity);
			editableElem.style.borderColor = newColor;
		}
		else
		{
			console.log("Border color is not RGB, not setting alpha opacity");
		}
	}
	else
	{
		this.shape.attr({ 'stroke-opacity': newOpacity });
	}
	//console.log("stroke-Opacity Color:" + newOpacity);
}

SVGShape.prototype.isInnerTextHidden = function()
{
    if (this.swInnerText)
    {
        return this.swInnerText.shape.node.style.display == "none" ? true : false;
    }
    
    return true;
}

SVGShape.prototype.hideInnerText = function()
{
    if (this.swInnerText)
    {
        this.swInnerText.shape.node.style.display = "none";
    }
    else
    {
       // alert(this.shape.node);
      //  this.shape.node.style.display = "none";     
    }
}

SVGShape.prototype.showInnerText = function()
{
    if (this.swInnerText)
    {
        this.swInnerText.shape.node.style.display = "";
        this.swInnerText.shape.node.getElementsByClassName("insideforeign")[0].setAttribute("contentEditable", "true");
    }
    else
    {
       // alert(this.shape.node);
      //  this.shape.node.style.display = "none";     
    }
}

SVGShape.prototype.birngToFront = function()
{
   
	if (this.getNext() == null)
	{
		console.log("Not birngToFront");
		return;
	}
	
	this.startRecording();
	this.shape.parent().append(this.shape);
	if(this.swInnerText) {  this.shape.after(this.swInnerText.shape); }
	if (this.svgScrollBar) { this.svgScrollBar.reset(); }
	this.stopRecording(true);
}

SVGShape.prototype.sendToBack = function()
{
	if (this.getPrevious() == null)
	{
		console.log("Not send sendToBack");
		return;
	}
	
	console.log("Previous" + this.shape.getPrevious());
	
	this.startRecording();
	this.shape.toBack();
	if(this.swInnerText) {  this.shape.after(this.swInnerText.shape); }
	if (this.svgScrollBar) { this.svgScrollBar.reset(); }
	this.stopRecording(true);
}

SVGShape.prototype.unselect = function ()
{
	//alert("Unselecting Element");
	if (this.actionToPerforrm == "REMOVE_ACTION_TOOLS")	
	{
		this.actionToPerforrm = "ADD_ACTION_TOOLS";	
		//this.removeActionDecorator();
		//this.removeCurveDecorator();
		//this.removePolyLineDecorator();
		//this.removeShapeContainer();
		//this.removeShapeRotator();	
		this.removeShapeEditHelper();
		this.shape.attr('cursor', 'auto');		
	}
	
	this.isSelected = false;
}

SVGShape.prototype.select = function()
{
	this.shapeOnClick();
}

SVGShape.prototype.isForeignObject = function() 
{
	//alert("isForeignObject called:" + this.shape);
	return (this.shape.type  == "g" && this.shape.hasClass("SWSVGForeignObj")) ? true : false;	
}

SVGShape.prototype.getUpperElement = function()
{
    if (this.isForeignObject())
    {
        return this.shape.node.getElementsByClassName("insideforeign")[0];
    }   
    else if (this.swInnerText)
    {
        //alert("ghj"+this.swInnerText.shape.node.style.display);
        if (this.swInnerText.shape.node.style.display == "" )
        {
            return this.swInnerText.shape.node.getElementsByClassName("insideforeign")[0];
        }
        else
        {
            return this.shape.node;
        }
    }
    
    return this.shape.node;
}

SVGShape.prototype.getEditableTextElement = function() 
{
    if (this.isForeignObject())
    {
        return this.shape.node.getElementsByClassName("insideforeign")[0];
    }   
    else if (this.swInnerText)
    {
        return this.swInnerText.shape.node.getElementsByClassName("insideforeign")[0];
    }
     
    return null;
}

SVGShape.prototype.getEditableElement = function() 
{
	if (this.isForeignObject())
	{
		return this.shape.node.getElementsByClassName("insideforeign")[0];
	}	
	
	return this.shape.node;		
}

SVGShape.prototype.getForeignObjectSize = function() 
{
	if (this.isForeignObject())
	{
		 var fo = this.shape.node.getElementsByClassName("insideforeign")[0];
		 return { height: $(fo).outerHeight(), width: $(fo).outerWidth() };
	}	
	
	return {height: 0, width: 0 };		
}

SVGShape.prototype.rectObjFromBB = function(bb, adjustFact) 
{
	return { x: bb.x-adjustFact, y: bb.y-adjustFact, width: bb.width+adjustFact+adjustFact, height: bb.height+adjustFact+adjustFact } 
}

//Returns radians
function angleBetweenPoints(p1, p2)
{
	if (p1.x == p2.x && p1.y == p2.y)
	{	return Math.PI/2;	}
	else
	{	return Math.atan2(p2.y - p1.y, p2.x - p1.x ); }
}

SVGShape.prototype.addShapeContainer = function()
{
    this.removeShapeContainer();
	try
	{	

		var bBox = this.shape.getBBox(1);
		var shapeContainerAttr = { fill: "none", "stroke-opacity":0, stroke: "red", strokeDasharray: "5,5" };
		//console.log("adding container" + this.shape+ bBox.x + ", "+ bBox.w);
		this.shapeContainerBox = this.shape.parent().rect(this.rectObjFromBB(bBox, this.adjustFactor))
		   .attr({ class: 'SWShapeHelper'}).attr(shapeContainerAttr);
		this.shapeContainerBox.attr({class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });
	}
	catch(evt)
	{
		console.log("add SVG shape container failed : "+evt);
	}
}

SVGShape.prototype.removeShapeContainer = function()
{
	if (this.shapeContainerBox)
	{

		//alert("Remving Contener box");
		this.shapeContainerBox.remove();
		this.shapeContainerBox = null;
		console.log("Remved Contener box");
	}
}

SVGShape.prototype.addShapeRotator = function()
{
	if (!this.isShapeRotatorRequired())
	{
		return false;
	}
	
	this.removeShapeRotator();
	
	//console.log("Adding Shape rotator");
	var bBox = this.shape.getBBox(1);
	var outsideFactor = 0;
	
//	alert(this.shape.parent().node + ""+this.shape.parent().getBBox().height + ", " + this.shape.parent().getBBox().width) ;
	
	var distAdjt = this.adjustFactor;
    
	var rotateHelper = new SW_ShapeHelper(this.shape.parent());
	
	//var startHandle = arcHelper.drawHelper(curvePth.csX, curvePth.csY, HELPER_CATAGORY.SUB_HELPER);
	
	var rotatorTop = rotateHelper.drawHelper(bBox.x + bBox.width/2,  bBox.y-distAdjt, 
			         HELPER_CATAGORY.MAIN_HELPER, SHAPE_HELPER.LEFT_UP_RIGHT_ROTATOR);	
	var rotatorBottom = rotateHelper.drawHelper(bBox.x + bBox.width/2, bBox.y+bBox.height+distAdjt,
			         HELPER_CATAGORY.MAIN_HELPER, SHAPE_HELPER.LEFT_UP_RIGHT_ROTATOR);	
	//.attr({ class: 'SWShapeHelper', fill: "red", "fill-opacity": "0.2", stroke: "#000", name: "selectionBox" });;	

	this.shapeRotator = this.shape.parent().group(rotatorTop, rotatorBottom);
	this.shapeRotator.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });

	var dragHandleRotateStart = function() 
	{
		var bBox = this.shape.getBBox();
		this.shapeCenter = this.shape.parent().circle(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2, 3).attr({ class: 'SWShapeHelper', fill: "blue", stroke: "#000", name: "selectionBox" });

		console.log("Rotation started");
		this.shape.fo  = this.shape.attr('fill-opacity');		
		this.removeShapeEditHelper();	
		this.startRecording();
		this.shape.recordOnStop = false;
	}

	var dragHandleRotateEnd = function()
	{	
		this.shape.attr({'fill-opacity': this.shape.fo});	
		this.shapeCenter.remove();
		this.shapeCenter = null;	
		this.addShapeEditHelper();
		this.shapeRotator.parent().append(this.shapeRotator);
		this.stopRecording(this.shape.recordOnStop);
		this.shape.recordOnStop = false;
		console.log("Rotation end");
	}
	var dragHandleRotateMove = function(myRoator, rotatorType, dx, dy, x, y, evt)
	{
		this.shape.recordOnStop = true;
		//console.log("Rotation moved");
		this.shape.attr({'fill-opacity': "0.3"});

		var resizerXY = this.SWsvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, this.shape);

		var mainBB = this.shape.getBBox(1);	
		
		var angle = Math.round(Snap.angle(mainBB.cx, mainBB.cy, resizerXY.x, resizerXY.y));
		angle -= rotatorType == "TOP" ? 90 : 270;
			
		console.log("Angle :" +angle);
		this.shape.rotate(angle, mainBB.cx, mainBB.cy);
	
		this.shapeCenter.parent().append(this.shapeCenter);

		this.resetInnerTextAttr();
		
		if (this.svgScrollBar) 	{
			console.log("rotating scrollbar");
			this.svgScrollBar.reset();
		}
		
		return 0;
	}

	var topRotateMove = dragHandleRotateMove.bind(this, rotatorTop, "TOP");
	var bottomRotateMove = dragHandleRotateMove.bind(this, rotatorBottom, "BOTTOM");
	
	var rotateStart = dragHandleRotateStart.bind(this);
	var rotateStop = dragHandleRotateEnd.bind(this)

	rotatorTop.swDrag(topRotateMove, rotateStart, rotateStop);	
	rotatorBottom.swDrag(bottomRotateMove, rotateStart, rotateStop);	
	
	this.shape.data('initialTransformMatrix', this.shape.transform().localMatrix);

}

SVGShape.prototype.removeShapeRotator = function()
{
	//console.log("remove Shape rotator");
	if(this.shapeRotator)
	{
		this.shapeRotator.remove();
		this.shapeRotator = null;
	}
}

SVGShape.prototype.addArcModifier = function()
{
	if (this.ShapeSpecificHelperGroup)
	{
		return; //already present
	}
	
	var curvePth = this.shape.parseCurvePath();

	var bBox = this.shape.getBBox(1);
	//alert("curvePth" + curvePth.type);
	var arcCenter = SW_SVG_UTIL.getArcCenter(curvePth)[0];	

	var origRediusX = Math.abs(curvePth.arX);
	var origRediusY = Math.abs(curvePth.arY);
	var origStartPtAngle = 0;
	var origEndPtAngle = 0;
	var newStartPtAngleWRTCenterXAxis = 1;
	var newEndPtAngleWRTCenterXAxis = 1;
	
	var tmpArc = null;
	
	//var centerTMp = this.shape.parent().ellipse(arcCenter.x, arcCenter.y, 1, 1).attr({ class: 'SWShapeHelper', "fill-opacity": "1",  "stroke-opacity": "0.2", stroke: "gray", strokeDasharray: "5,5" }); 

	//var arcRefCircle = this.shape.parent().ellipse(arcCenter.x, arcCenter.y, origRediusX, origRediusY).attr({ class: 'SWShapeHelper', "fill-opacity": "0.0",  "stroke-opacity": "0.2", stroke: "gray", strokeDasharray: "5,5" }); 
	
	var arcRefCircle =  this.shape.parent().arcUsingCenter(arcCenter.x, arcCenter.y, origRediusX, origRediusY, 360, 359.99, 1).attr({ class: 'SWShapeHelper', "fill-opacity": "0.0",  "stroke-opacity": "0.2", stroke: "gray", strokeDasharray: "5,5" }); 
	
	var arcRefLine1 = this.shape.parent().linePath(arcCenter.x, arcCenter.y, curvePth.csX, curvePth.csY).attr({class: 'SWShapeHelper', stroke: "blue",  "stroke-opacity": "0.2", strokeDasharray: "5,5"});
	var arcRefLine2 = this.shape.parent().linePath(arcCenter.x, arcCenter.y, curvePth.ceX, curvePth.ceY).attr({class: 'SWShapeHelper', stroke: "blue",  "stroke-opacity": "0.2", strokeDasharray: "5,5"});

	//var arcHelper = new SW_ShapeHelper(this.shape.parent());
	
	//var startHandle = arcHelper.drawHelper(curvePth.csX, curvePth.csY, HELPER_CATAGORY.SUB_HELPER);
	//var endHandle = arcHelper.drawHelper(curvePth.ceX, curvePth.ceY, HELPER_CATAGORY.SUB_HELPER);
	//var rediusHandle = arcHelper.drawHelper(arcCenter.x, arcCenter.y, HELPER_CATAGORY.SUB_HELPER);
	
    var startHandle = this.shape.parent().circle(curvePth.csX, curvePth.csY, 10).attr({ class: 'SWShapeHelper', "fill-opacity": "0.2", fill: "pink", stroke: "#000", id: "p1" }); 
	var endHandle = this.shape.parent().circle(curvePth.ceX, curvePth.ceY, 10).attr({ class: 'SWShapeHelper', "fill-opacity": "0.2", fill: "pink", stroke: "#000", id: "p2" }); 
	var rediusHandle = this.shape.parent().ellipse(arcCenter.x, arcCenter.y, 10, 10).attr({ class: 'SWShapeHelper', "fill-opacity": "0.2",  fill: "green", stroke: "#000", id: "p3" }); 	
	
	
	this.ShapeSpecificHelperGroup = this.shape.parent().group(arcRefCircle,arcRefLine1, arcRefLine2, startHandle, endHandle, rediusHandle);
	this.ShapeSpecificHelperGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });
	
		
	var adjustLinePathLength = function(linePath, linePathNewSecCord, circleRadius, arcCenter)
	{
		var totalLength = linePath.getTotalLength();
		if (totalLength < circleRadius) 
		{ // smaller, extend line
			var ratio = circleRadius/totalLength;
			var x_len = linePathNewSecCord.x + (linePathNewSecCord.x - arcCenter.x)*ratio*2;
			var y_len = linePathNewSecCord.y + (linePathNewSecCord.y - arcCenter.y)*ratio*2;
			linePath.attr({ d: "M "+arcCenter.x+" "+arcCenter.y +"L "+x_len+" "+y_len });                         
		}
	}

	var arcResizeStart = function (mystartResizer, myendResizer, resizerType)
	{
		var curvePth = this.shape.parseCurvePath();
		arcCenter = SW_SVG_UTIL.getArcCenter(curvePth)[0];
		
		var mystartResizerXY = new Array;
		mystartResizerXY.x = parseInt(mystartResizer.attr('cx'));
		mystartResizerXY.y = parseInt(mystartResizer.attr('cy'));		
		
		var myendResizerXY = new Array;
		myendResizerXY.x = parseInt(myendResizer.attr('cx'));
		myendResizerXY.y = parseInt(myendResizer.attr('cy'));

		origRediusX = Math.abs(curvePth.arX);
		origRediusY = Math.abs(curvePth.arY);
	
		origStartPtAngle = SW_SVG_UTIL.angleBetweenTwoPoints(arcCenter, mystartResizerXY);
		origEndPtAngle = SW_SVG_UTIL.angleBetweenTwoPoints(arcCenter, myendResizerXY);
		
		arcRefLine1.attr({ "stroke-opacity": "0.2"});
		arcRefLine2.attr({ "stroke-opacity": "0.2"});
		
		var len = Snap.path.getTotalLength(arcRefCircle);

		var lastAngleBetOldAndNewStartPt = 360;
		var lastAngleBetOldAndNewEndPt = 360;
	
		for (var counter=0; counter<len; counter++)
		{
			var pt = Snap.path.getPointAtLength(arcRefCircle, counter);
			//this.shape.parent().circle(pt.x, pt.y, 1).attr({ class: 'SWShapeHelper', "fill-opacity": "0.0",  "stroke-opacity": "1", stroke: "red", strokeDasharray: "5,5" });

			var ptXY = { x: pt.x, y: pt.y };

			var tmpPtAngleWRTCenterXAxis = SW_SVG_UTIL.angleBetweenTwoPoints(arcCenter, ptXY);	

			var csX= arcCenter.x +(origRediusX * Math.cos((tmpPtAngleWRTCenterXAxis)* Math.PI / 180));
			var csY= arcCenter.y +(origRediusY * Math.sin((tmpPtAngleWRTCenterXAxis) * Math.PI / 180));

			var newTmpPt = {x: csX, y: csY };
			var angleBetOldAndNewStartPt = SW_SVG_UTIL.angleBetweenTwoLines(mystartResizerXY, arcCenter, newTmpPt);
			var angleBetOldAndNewEndPt = SW_SVG_UTIL.angleBetweenTwoLines(myendResizerXY, arcCenter, newTmpPt);

			//console.log("angle is zero" + angleBetOldAndNewEndPt);
			if (angleBetOldAndNewStartPt < lastAngleBetOldAndNewStartPt && angleBetOldAndNewStartPt < 1)
			{
				//	alert("angle is zero" + angleBetOldAndNewEndPt);
				//console.log("Now angle is newStartPtAngleWRTCenterXAxis" + tmpPtAngleWRTCenterXAxis);
				newStartPtAngleWRTCenterXAxis = tmpPtAngleWRTCenterXAxis;
			}
			//console.log("angle is zero" + angleBetOldAndNewEndPt);
			if (angleBetOldAndNewEndPt < lastAngleBetOldAndNewEndPt && angleBetOldAndNewEndPt < 1)
			{
				//	alert("angle is zero" + angleBetOldAndNewEndPt);
				//console.log("Now angle is newEndPtAngleWRTCenterXAxis" + tmpPtAngleWRTCenterXAxis);
				newEndPtAngleWRTCenterXAxis = tmpPtAngleWRTCenterXAxis;
			}

			lastAngleBetOldAndNewStartPt = angleBetOldAndNewStartPt;
			lastAngleBetOldAndNewEndPt = angleBetOldAndNewEndPt;
		}
		
		this.startRecording();
		this.shape.recordOnStop = false;	
	}
	
	var arcResizeEnd = function (arcRefCircle, myresizer, resizerType)
	{
		var curvePth = this.shape.parseCurvePath();
		arcCenter = SW_SVG_UTIL.getArcCenter(curvePth)[0];

		if (resizerType == "CS")
		{
			myresizer.attr({cx: curvePth.csX, cy: curvePth.csY });
		}
		else if (resizerType == "CE")
		{
			myresizer.attr({cx: curvePth.ceX, cy: curvePth.ceY });			
		}
		else if (resizerType == "RD")
		{				
			myresizer.attr({cx: arcCenter.x, cy: arcCenter.y });			
		}
		
		arcRefLine1.setLinePathLength(arcCenter.x, arcCenter.y, curvePth.csX, curvePth.csY);
	 	arcRefLine2.setLinePathLength(arcCenter.x, arcCenter.y, curvePth.ceX, curvePth.ceY);
	 	
	 	this.stopRecording(this.shape.recordOnStop);
	 	this.shape.recordOnStop = false;

	}	

	var arcResize = function (curvePath, arcCenter, L1, L2, mystartResizer, myendResizer, myrediusResizer, resizerType, dx, dy, x, y, evt)
	{
		
		this.shape.recordOnStop = true;
		
		arcRefCircle.attr({ "stroke-opacity": "0.3"});
		var mystartResizerXY = new Object;
		mystartResizerXY.x = parseInt(mystartResizer.attr('cx'));
		mystartResizerXY.y = parseInt(mystartResizer.attr('cy'));
		
		
		var myendResizerXY = new Object;
		myendResizerXY.x = parseInt(endHandle.attr('cx'));
		myendResizerXY.y = parseInt(endHandle.attr('cy'));
	
		var resizerXY = this.SWsvgCanvas.convertToSVGPoint(x, y, SW_CORD_SYSTEM_TYPE.HTML, this.shape);
		//resizerXY.x = Math.round(parseInt(resizerXY.x));
		//resizerXY.y = Math.round(parseInt(resizerXY.y));	
		
		resizerXY.x = resizerXY.x;
		resizerXY.y = resizerXY.y;

		var newCurvePath = curvePath;
		
		if (resizerType == "CE")
		{
			endHandle.attr({cx: resizerXY.x, cy: resizerXY.y });
			L2.setLinePathLength(arcCenter.x, arcCenter.y, resizerXY.x, resizerXY.y);			
		
			adjustLinePathLength(L2, resizerXY, Math.abs(Math.max(curvePath.arX, curvePath.arY)), arcCenter);
			
			var interSectionPoints = Snap.path.intersection(arcRefCircle, L2);
			newCurvePath.ceX=Math.abs(interSectionPoints[0].x);
			newCurvePath.ceY=Math.abs(interSectionPoints[0].y);		
			
			
			//newStartPtAngleWRTCenterXAxis = SW_SVG_UTIL.angleBetweenTwoPoints(arcCenter, mystartResizerXY);
			newEndPtAngleWRTCenterXAxis = SW_SVG_UTIL.angleBetweenTwoPoints(arcCenter, interSectionPoints[0]);			
			
			newCurvePath.csX= arcCenter.x +(origRediusX * Math.cos((newStartPtAngleWRTCenterXAxis) * Math.PI / 180));
			newCurvePath.csY= arcCenter.y +(origRediusY * Math.sin((newStartPtAngleWRTCenterXAxis) * Math.PI / 180));
			
			newCurvePath.ceX= arcCenter.x +(origRediusX * Math.cos(newEndPtAngleWRTCenterXAxis * Math.PI / 180));
			newCurvePath.ceY= arcCenter.y +(origRediusY * Math.sin(newEndPtAngleWRTCenterXAxis * Math.PI / 180));
		
			L2.setLinePathLength(arcCenter.x, arcCenter.y, newCurvePath.ceX, newCurvePath.ceY);	
		}
		else if (resizerType == "CS")
		{
			var oldCE = { x: curvePath.ceX, y: curvePath.ceY };
			
			mystartResizer.attr({cx: resizerXY.x, cy: resizerXY.y });
			L1.setLinePathLength(arcCenter.x, arcCenter.y, resizerXY.x, resizerXY.y);
		
			adjustLinePathLength(L1, resizerXY, Math.abs(Math.max(curvePath.arX, curvePath.arY)), arcCenter);
						
			var interSectionPoints = Snap.path.intersection(arcRefCircle, L1);
			newCurvePath.csX=Math.abs(interSectionPoints[0].x);
			newCurvePath.csY=Math.abs(interSectionPoints[0].y);				

			newStartPtAngleWRTCenterXAxis = SW_SVG_UTIL.angleBetweenTwoPoints(arcCenter, interSectionPoints[0]);
			//var newEndPtAngleWRTCenterXAxis = SW_SVG_UTIL.angleBetweenTwoPoints(arcCenter, myendResizerXY);	

			newCurvePath.csX= arcCenter.x +(origRediusX * Math.cos((newStartPtAngleWRTCenterXAxis) * Math.PI / 180));
			newCurvePath.csY= arcCenter.y +(origRediusY * Math.sin((newStartPtAngleWRTCenterXAxis) * Math.PI / 180));

			newCurvePath.ceX= arcCenter.x +(origRediusX * Math.cos((newEndPtAngleWRTCenterXAxis)* Math.PI / 180));
			newCurvePath.ceY= arcCenter.y +(origRediusY * Math.sin((newEndPtAngleWRTCenterXAxis) * Math.PI / 180));			
				
			L1.setLinePathLength(arcCenter.x, arcCenter.y, newCurvePath.csX, newCurvePath.csY);

		}
		else if (resizerType == "RD")
		{					
			//console.log("Angle :" + origStartPtAngle + ", " + origEndPtAngle);

			myrediusResizer.attr({cx: resizerXY.x, cy: resizerXY.y });

			var newRediusX =  parseInt(origRediusX+dx);
			var newRediusY =  parseInt(origRediusY-dy);			

			if (newRediusX > 1)
			{
				//arcRefCircle.attr({ "rx": newRediusX });
				newCurvePath.arX= newRediusX;
			}

			if (newRediusY > 1)
			{
				//arcRefCircle.attr({ "ry": newRediusY });
				newCurvePath.arY= newRediusY;
			}
			
			var tmpArcRefCircle =  this.shape.parent().arcUsingCenter(arcCenter.x, arcCenter.y, newCurvePath.arX, newCurvePath.arY, 360, 359.99, 1).attr({ class: 'SWShapeHelper', "fill-opacity": "0.0",  "stroke-opacity": "0.2", stroke: "gray", strokeDasharray: "5,5" }); 	
			arcRefCircle.attr({ d: tmpArcRefCircle.attr('d') });
			tmpArcRefCircle.remove();
			
			
			adjustLinePathLength(L1, mystartResizerXY, Math.abs(Math.max(newCurvePath.arX, newCurvePath.arY)), arcCenter);
			adjustLinePathLength(L2, myendResizerXY, Math.abs(Math.max(newCurvePath.arX, newCurvePath.arY)), arcCenter);
			
			var interSectionPoints2 = Snap.path.intersection(arcRefCircle, L2);
			var interSectionPoints1 = Snap.path.intersection(arcRefCircle, L1);
	
			newCurvePath.csX= interSectionPoints1[0].x;
			newCurvePath.csY= interSectionPoints1[0].y;
			newCurvePath.ceX= interSectionPoints2[0].x;
			newCurvePath.ceY= interSectionPoints2[0].y;
			
			mystartResizer.attr({ cx:newCurvePath.csX, cy: newCurvePath.csY });
			endHandle.attr({ cx: newCurvePath.ceX, cy: newCurvePath.ceY });			
		}			
		
		var dY = arcCenter.y - newCurvePath.csY;
		var dX = arcCenter.x - newCurvePath.csX;
		var startPtAngleInDegrees = (Math.atan2(dY,dX) / Math.PI * 180.0);

		dY = arcCenter.y - newCurvePath.ceY; 
		dX = arcCenter.x - newCurvePath.ceX;			
		var endPtAngleInDegrees = (Math.atan2(dY,dX) / Math.PI * 180.0);
		
		
		var angleBetweenArcPts = startPtAngleInDegrees < endPtAngleInDegrees ? endPtAngleInDegrees - startPtAngleInDegrees
										: 360+endPtAngleInDegrees - startPtAngleInDegrees;
	
		//console.log("angleBetweenPoints before :"+ startPtAngleInDegrees +","+endPtAngleInDegrees +","+angleBetweenArcPts);
		
		
		if (angleBetweenArcPts > 0 && angleBetweenArcPts <= 180)
		{
			newCurvePath.alf = 0;
		}
		else
		{
			newCurvePath.alf = 1;
		}
		
		//console.log("angleBetweenPoints"+ startPtAngleInDegrees +","+endPtAngleInDegrees +","+angleBetweenArcPts);
		
		this.resetCurvePathCord(newCurvePath);
		this.resetInnerTextAttr();
		return;
	}
 
	var onArcResizeCS = arcResize.bind(this, curvePth, arcCenter, arcRefLine1, arcRefLine2, startHandle, endHandle, rediusHandle, "CS");
	var onArcResizeCE = arcResize.bind(this, curvePth, arcCenter, arcRefLine1, arcRefLine2, startHandle, endHandle, rediusHandle, "CE");
	var onArcResizeRD = arcResize.bind(this, curvePth, arcCenter, arcRefLine1, arcRefLine2, startHandle, endHandle, rediusHandle, "RD");
	
	var arcResizeEndCS = arcResizeEnd.bind(this, arcRefCircle, startHandle, "CS")
	var arcResizeEndCE = arcResizeEnd.bind(this, arcRefCircle, endHandle, "CE");
	var arcResizeEndRD = arcResizeEnd.bind(this, arcRefCircle, rediusHandle, "RD");

	var arcResizeStartCS = arcResizeStart.bind(this, startHandle, endHandle, "CS");
	var arcResizeStartCE = arcResizeStart.bind(this, startHandle, endHandle, "CE");
	var arcResizeStartRD = arcResizeStart.bind(this, startHandle, endHandle, "RD");

	startHandle.swDrag(onArcResizeCS, arcResizeStartCS, arcResizeEndCS);
	endHandle.swDrag(onArcResizeCE, arcResizeStartCE, arcResizeEndCE);
	rediusHandle.swDrag(onArcResizeRD, arcResizeStartRD, arcResizeEndRD);
	
	var arcRefCircleStart = function () 
	{
		this.shape.data('origTransform', this.shape.transform().local);
		this.removeArcModifier();
	}
	
	var arcRefCircleMov = function (dx,dy) 
	{
		console.log("time to drag");
		 var tdx, tdy;
	     var snapInvMatrix = this.shape.transform().diffMatrix.invert();
	     snapInvMatrix.e = snapInvMatrix.f = 0;
	     tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
	     this.shape.transform( "t" + [ tdx, tdy ] + this.shape.data('origTransform')  );
	     this.resetInnerTextAttr();
	        
	}

	var arcRefCircleStop = function () 
	{
		this.addArcModifier();
	}
	
	var onArcRefCircleStart = arcRefCircleStart.bind(this);
	var onArcRefCircleMov = arcRefCircleMov.bind(this);
	var onArcRefCircleStop = arcRefCircleStop.bind(this);

	arcRefCircle.swDrag(onArcRefCircleMov, onArcRefCircleStart, onArcRefCircleStop);
	
}


SVGShape.prototype.removeArcModifier = function()
{
	//alert("call for remove Arc dec");
	if (this.ShapeSpecificHelperGroup)
	{
		this.ShapeSpecificHelperGroup.selectAll('SWShapeHelper').remove();
		this.ShapeSpecificHelperGroup.remove();
		this.ShapeSpecificHelperGroup = null;
		//console.log("removing Arc group");
	}
}

SVGShape.prototype.addCurveDecorator = function()
{

	if (this.shape.type == "path")
	{

		var curvePth = this.shape.parseCurvePath();

		if (curvePth.type == "A" || curvePth.type == "a") //arc
		{
			this.addArcModifier();
			return;
		}

		var len = Snap.path.getTotalLength(this.shape);
		
		if (curvePth.Z)
		{
			var startCord = { x:curvePth.csX, y: curvePth.csY };
			var endCord = { x:curvePth.ceX, y: curvePth.ceY };
		
			len -= Math.abs(SW_SVG_UTIL.distanceBetweenPoints(startCord, endCord));
			//console.log("has z path" + len);
		}
		
		var startCR = Snap.path.getPointAtLength(this.shape, len/4);
		var endCR = Snap.path.getPointAtLength(this.shape, len/2+len/4);
		var middleCR = Snap.path.getPointAtLength(this.shape, len/2);
		
		
		
		//console.log("shape length:" + len);
		if (len == 0)
		{ 
			console.log("shape seems to be deleted. not adding curve decorator");
			return;
		}

		if (this.ShapeSpecificHelperGroup) 
		{
			return; //already added
		}
		
		if (curvePth.type == "C" || curvePth.type == "c") //cubic curve
		{
			if (curvePth.csX === undefined || curvePth.csY === undefined ||
					curvePth.crX1 === undefined || curvePth.crY1 === undefined || 
					curvePth.crX2 === undefined || curvePth.crY2 === undefined ||
					curvePth.ceX === undefined  || curvePth.ceY === undefined)
			{
				console.log("Not setting cubic curve path");
				return;
			}
		}		
		else
		{
			console.log("Not setting curve path" + curvePth.type);
			return;			
		}

		//var pathHandle = new Array();
		//var locMatrix = this.shape.transform().localMatrix;
		//var pathMoveToCord = swPath.getSvgPathSegment(/*SVGPathSeg.PATHSEG_MOVETO_ABS*/);

		var curveHelper = new SW_ShapeHelper(this.shape.parent());
		
		//var startHandle = curveHelper.drawHelper(curvePth.csX, curvePth.csY, HELPER_CATAGORY.SUB_HELPER);
		//var endHandle = arcHelper.drawHelper(curvePth.ceX, curvePth.ceY, HELPER_CATAGORY.SUB_HELPER);
		//var rediusHandle = arcHelper.drawHelper(arcCenter.x, arcCenter.y, HELPER_CATAGORY.SUB_HELPER);
		
		var startHandle = curveHelper.drawHelper(curvePth.csX, curvePth.csY, HELPER_CATAGORY.MAIN_HELPER);
		var endHandle = curveHelper.drawHelper(curvePth.ceX, curvePth.ceY, HELPER_CATAGORY.MAIN_HELPER); 

		//var curvRotator1 = this.shape.parent().circle(curvePth.crX1, curvePth.crY1, 6).attr({ class: 'SWShapeHelper', "fill-opacity": "0.2", fill: "pink", stroke: "#000", id: "c1" }); 
		//var curvRotator2 = this.shape.parent().circle(curvePth.crX2, curvePth.crY2, 6).attr({ class: 'SWShapeHelper', "fill-opacity": "0.2", fill: "pink", stroke: "#000", id: "c2" }); 	

		var curvRotator1 = curveHelper.drawHelper(startCR.x, startCR.y, HELPER_CATAGORY.SUB_HELPER);
		var curvRotator2 = curveHelper.drawHelper(endCR.x, endCR.y, HELPER_CATAGORY.SUB_HELPER);
		var midCurvRotator = curveHelper.drawHelper(middleCR.x, middleCR.y, HELPER_CATAGORY.SUB_HELPER); 	


	}

	this.ShapeSpecificHelperGroup = this.shape.parent().group(curvRotator1, curvRotator2, midCurvRotator,
			                                                  /* curvRotator3, curvRotator4, */startHandle, endHandle);


	//console.log("shape transformation :" + this.shape.transform().localMatrix.toTransformString());
	this.ShapeSpecificHelperGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });	


	var resizeStart = this.curveBResizeStart.bind(this);
	var resizeStop = this.curveBResizeStop.bind(this);
	var resizeMoveCS = this.curveBResizeMoveCS.bind(this);
	var resizeMoveCE = this.curveBResizeMoveCE.bind(this);

	var resizeMoveCR1 = this.curveBResizeMoveCR1.bind(this);
	var resizeMoveCR2 = this.curveBResizeMoveCR2.bind(this);
	var resizeMoveMidCR = this.curveBResizeMoveMidCR.bind(this);

	var curveResizeDClick = this.curveBDClick.bind(this);


	startHandle.swDrag(resizeMoveCS, resizeStart, resizeStop);
	endHandle.swDrag(resizeMoveCE, resizeStart, resizeStop);
	curvRotator1.swDrag(resizeMoveCR1, resizeStart, resizeStop);
	curvRotator2.swDrag(resizeMoveCR2, resizeStart, resizeStop);
	midCurvRotator.swDrag(resizeMoveMidCR, resizeStart, resizeStop);

	startHandle.mouseover(function(){
		this.attr('cursor', 'move');
	});

	endHandle.mouseover(function(){
		this.attr('cursor', 'move');
	});

	startHandle.dblclick(curveResizeDClick);
	endHandle.dblclick(curveResizeDClick);	
	
	console.log("Adding curv group");

}

SVGShape.prototype.removeCurveDecorator = function()
{

	//alert("call for remove Cureve dec");
	if (this.ShapeSpecificHelperGroup)
	{
		this.ShapeSpecificHelperGroup.selectAll('SWShapeHelper').remove();
		this.ShapeSpecificHelperGroup.remove();
		this.ShapeSpecificHelperGroup = null;
		//console.log("removing curv group");
	}
}

SVGShape.prototype.addPolyLineDecorator = function()
{

	if(this.ShapeSpecificHelperGroup)
	{
		//Due to repeated events;
		console.log("********Already Handler set ignoring...");
		return;
	}

	var points = this.shape.node.points;
	var meshLineHR = null;
	var meshLineVR = null;

	var dragStopFunct = function() 
	{

		if (meshLineHR) { meshLineHR.remove(); meshLineHR = null; }
		if (meshLineVR) { meshLineVR.remove(); meshLineVR = null; }
	
		this.addShapeEditHelper();
		this.stopRecording(this.shape.recordOnStop);
		this.shape.recordOnStop = false;
	}

	var dragStartFunct = function() 
	{
		this.startRecording();
		this.shape.recordOnStop = false;
		this.removeShapeEditHelper();
	}


	var dragFunct = function(shapeResizer, point, dx, dy, x, y,evt) 
	{		
		
		this.shape.recordOnStop = true;
		if (meshLineHR) { meshLineHR.remove(); meshLineHR = null; }
		if (meshLineVR) { meshLineVR.remove(); meshLineVR = null; }		

		var pt1 = this.shape.parent().node.createSVGPoint();

		pt1.x = x;
		pt1.y = y;
		var svgpt = this.SWsvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, null); 	
		//var resizerXY = svgpt.matrixTransform(this.shape.node.getTransformToElement(this.shape.parent().node).inverse());
		
		var resizerXY = this.SWsvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, this.shape);

		shapeResizer.attr({
			cx:  resizerXY.x,
			cy:  resizerXY.y,			
		});

		point.x = resizerXY.x;
		point.y = resizerXY.y;

		meshLineHR = this.shape.parent().line(0, svgpt.y, 1600, svgpt.y).attr({ stroke: '#123456', 'strokeWidth': 1, fill: 'gray', strokeDasharray: "5,5" });	
		meshLineVR = this.shape.parent().line(svgpt.x, 0, svgpt.x, 1600).attr({ stroke: '#123456', 'strokeWidth': 1, fill: 'gray', strokeDasharray: "5,5" });
		this.resetInnerTextAttr();
	};	

	var removePoint = function (myPpoints, index)
	{
			
			myPpoints.removeItem(index);
			this.calculateAdjustFactor();
			this.removeShapeEditHelper();
			
			if (points.numberOfItems != 1)
			{
				this.addShapeEditHelper();
			}
			else
			{
					//nothig to do
			}
	}
		
	var polylineHelper = new SW_ShapeHelper(this.shape.parent());

	for (var i = 0; i < points.numberOfItems; i++)
	{
		var point = points.getItem(i);
		var shapeResizer = polylineHelper.drawHelper(point.x, point.y, HELPER_CATAGORY.SUB_HELPER);

		var myDragFunct = dragFunct.bind(this, shapeResizer, point);
		var myDragStartFunct = dragStartFunct.bind(this);
		var myDragStopFunct = dragStopFunct.bind(this);
		shapeResizer.swDrag(myDragFunct, myDragStartFunct, myDragStopFunct);

		var remPoint = removePoint.bind(this, points, i);
		shapeResizer.dblclick(remPoint);

		if (i == 0)
		{
			this.ShapeSpecificHelperGroup = this.shape.parent().group(shapeResizer);
		}
		else		
		{
			
			this.ShapeSpecificHelperGroup.append(shapeResizer); 
		}
	}  

	this.ShapeSpecificHelperGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });	
}

SVGShape.prototype.removePolyLineDecorator = function()
{
	//alert("call for remove Cureve dec");
	if (this.ShapeSpecificHelperGroup)
	{
		this.ShapeSpecificHelperGroup.selectAll('SWShapeHelper').remove();
		this.ShapeSpecificHelperGroup.remove();
		this.ShapeSpecificHelperGroup = null;
		console.log("removing PolyLine group");
	}
}

SVGShape.prototype.isBetweenPoints = function(a,b,c, tolerance)
{
    //test if the point c is inside a pre-defined distance (tolerance) from the line
    var distance = Math.abs((c.y - b.y)*a.x - (c.x - b.x)*a.y + c.x*b.y - c.y*b.x) / Math.sqrt(Math.pow((c.y-b.y),2) + Math.pow((c.x-b.x),2));
    if (distance > tolerance){ return false; }

    //test if the point c is between a and b
    var dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y)*(b.y - a.y)
    if(dotproduct < 0){ return false; }

    var squaredlengthba = (b.x - a.x)*(b.x - a.x) + (b.y - a.y)*(b.y - a.y);
    if(dotproduct > squaredlengthba){ return false; }

    return true;

}

SVGShape.prototype.insertPoint = function(cordXY)
{
	console.log ("Insert point called");
	if (this.shape.type == "polyline")
	{
		var points = this.shape.node.points;
			
		var pt1 = this.shape.parent().node.createSVGPoint();

		pt1.x = cordXY.x;
		pt1.y = cordXY.y;
		var ptXY = pt1.matrixTransform(this.shape.node.getTransformToElement(this.shape.parent().node).inverse());		
		
		//this.shape.parent().circle(ptXY.x, ptXY.y, 3).attr({ class: 'SWShapeHelper1', fill: "red", stroke: "#000", name: "selectionBox" });; 
		//var myPoints = this.shape.node.points;	

		//myPoints.appendItem(ptXY);
	
		tolerance=15;

		pointsArray= new Array;

		var totalPoints = points.numberOfItems;
		var addNewSegment=false;

		var lastPoint = points.getItem(totalPoints-1);

		for (var i=0; i+1 < totalPoints; i++)
		{	

			var point1 = points.getItem(i);	
			//this.shape.parent().circle(point1.x, point1.y, 3).attr({ class: 'SWShapeHelper1', fill: "yellow", stroke: "#000", name: "selectionBox" });; 

			var point2 = points.getItem(i+1);
			//this.shape.parent().circle(point2.x, point2.y, 3).attr({ class: 'SWShapeHelper1', fill: "yellow", stroke: "#000", name: "selectionBox" });; 


			pointsArray.push(points.getItem(i));

			if (this.isBetweenPoints(point1, point2, ptXY, tolerance) 
                                           && !(ptXY.x == lastPoint.x && ptXY.y == lastPoint.y))//on last point
			{
				pointsArray.push(ptXY);
				addNewSegment=true;				 
				console.log("Insert Point on segment at: " + i + ":"+ totalPoints);				
			}	
			else
			{
				console.log("Not on polyline segment");
			}
		}

		pointsArray.push(points.getItem(totalPoints-1));

		if (addNewSegment)
		{
			
			for (var i=totalPoints; i>1; i--)
			{		
				if (i-1>0) { points.removeItem(i-1); }				
			}
			
			for (var i=1; i<pointsArray.length; i++)
			{
				points.appendItem(pointsArray[i]);
			}
			
			this.calculateAdjustFactor();
			this.removeShapeEditHelper();
			this.addShapeEditHelper();
		}
	}
}

SVGShape.prototype.addCurveArrowHelper = function ()
{
	console.log("Time to add curve arrow helper");
	
	var arrowPath = this.parseArrowPath();

	if (!arrowPath)
	{
		return;
	}
	
	var arrowShaftWidth = arrowPath.getShaftWidth();
	var arrowHeadWidth = arrowPath.getHeadWidth();
	var arrowHeadHeight = arrowPath.getHeadHeight();
	
	var arrowHead1Resizer = null;
	var arrowHead2Resizer = null;
	var midCARotator = null;
	var headWidthResizer = null;
	var headHeightResizer = null;
	var shaftWidthResizer = null;
	
	var head1Direction = arrowPath.getHeadDirection("HEAD1");
    var head2Direction = arrowPath.getHeadDirection("HEAD2");
    
    var startCord = { x: arrowPath.head1.HMX, y: arrowPath.head1.HMY };
	var endCord = arrowPath.getArrowEnd();
    
	var localResetCurveArrowHelper = function()
	{
		//bbox = this.shape.getBBox(1);
		//arrowCenter = { x: bbox.cx, y: bbox.cy };

		//arrowTailMiddleX = arrowPath.topLine.X1 + (arrowPath.topLine.X2 - arrowPath.topLine.X1)/2;
		//arrowRHWResizerY= arrowPath.head1.HTY + (arrowPath.topLine.Y2 - arrowPath.head1.HTY)/2
		
		var arrowHelper = new SW_ShapeHelper(this.shape.parent());
		
		arrowHead2Resizer = arrowHelper.drawHelper(endCord.x/*-this.adjustFactor*/, endCord.y, HELPER_CATAGORY.SUB_HELPER);
		arrowHead1Resizer = arrowHelper.drawHelper(startCord.x/*+this.adjustFactor*/, startCord.y, HELPER_CATAGORY.SUB_HELPER);
			
		arrowHelper.size(2);
		
		headWidthResizer = arrowHelper.drawHelper(arrowPath.head1.HBX, arrowPath.head1.HBY, HELPER_CATAGORY.SUB_HELPER,
					(head1Direction==ARROW_HEAD_DIRECTION.TOWARDS_TOP || head1Direction == ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM)? 
								SHAPE_HELPER.TOP_DOWN_ARROW : SHAPE_HELPER.LEFT_RIGHT_ARROW);
		
		headHeightResizer = arrowHelper.drawHelper(arrowPath.head1.HTX, arrowPath.head1.HTY, HELPER_CATAGORY.SUB_HELPER,
				(head1Direction==ARROW_HEAD_DIRECTION.TOWARDS_TOP || head1Direction == ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM)? 
							 SHAPE_HELPER.LEFT_RIGHT_ARROW : SHAPE_HELPER.TOP_DOWN_ARROW);
				 	
		//console.log("Added Curve arrow helpers11");
		var strD = arrowPath.getArrowCurveStr();
		//console.log("Added Curve arrow helpers22" + strD);
		var tmpShape = this.shape.parent().path(strD);
		//console.log("Added Curve arrow helpers33" + tmpShape);
		var len = Snap.path.getTotalLength(tmpShape);
		
		var middleCR = Snap.path.getPointAtLength(tmpShape, len/2);
		var csCR = Snap.path.getPointAtLength(tmpShape, len/4);
		var ceCR = Snap.path.getPointAtLength(tmpShape, len/2+len/4);
		var shaftR  = Snap.path.getPointAtLength(tmpShape, len/12);
		tmpShape.remove();
		
		midCARotator = arrowHelper.drawHelper(middleCR.x, middleCR.y, HELPER_CATAGORY.SUB_HELPER); 
		cr1CARotator = arrowHelper.drawHelper(csCR.x, csCR.y, HELPER_CATAGORY.SUB_HELPER); 
		cr2CARotator = arrowHelper.drawHelper(ceCR.x, ceCR.y, HELPER_CATAGORY.SUB_HELPER); 
		
		//console.log("Added Curve arrow helpers44");
		shaftWidthResizer = arrowHelper.drawHelper(shaftR.x, shaftR.y, HELPER_CATAGORY.SUB_HELPER,
			 	(head1Direction==ARROW_HEAD_DIRECTION.TOWARDS_TOP || head1Direction == ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM)? 
			 			SHAPE_HELPER.LEFT_RIGHT_ARROW: SHAPE_HELPER.TOP_DOWN_ARROW);
		
		//console.log("Added Curve arrow helpers55");
		
		this.ShapeSpecificHelperGroup = this.shape.parent().group(arrowHead1Resizer, arrowHead2Resizer, 
				midCARotator, cr1CARotator, cr2CARotator, headWidthResizer, headHeightResizer, shaftWidthResizer);
		//console.log("Added Curve arrow helpers66");
		this.ShapeSpecificHelperGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });
		
		
	}
	
	var resizeStart = function ()
	{
		this.startRecording();
		this.shape.recordOnStop = false;
		this.removeShapeEditHelper();
		
		this.shape.origCurveArrowPath = this.parseArrowPath();
		arrowShaftWidth = arrowPath.getShaftWidth();
		arrowHeadWidth = arrowPath.getHeadWidth();
		arrowHeadHeight = arrowPath.getHeadHeight();
		
		head1Direction = arrowPath.getHeadDirection("HEAD1");
        head2Direction = arrowPath.getHeadDirection("HEAD2");
        
	}
	var resizestop = function ()
	{
		this.stopRecording(this.shape.recordOnStop);
		this.shape.recordOnStop = false;
		this.addShapeEditHelper();
	}
	
	var resizeMove = function (shapeResizer, resizerType, dx, dy, x, y,evt)
	{
		this.shape.recordOnStop = true;
			
		var resizerXY = this.SWsvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, this.shape);

		resizerXY.x = Math.round(resizerXY.x);
		resizerXY.y = Math.round(resizerXY.y);
		
		/*arrowPath = this.parseArrowPath();
	
        startCord = { x: arrowPath.head1.HMX, y: arrowPath.head1.HMY };
		endCord = arrowPath.getArrowEnd();*/
		
		//console.log("crurve arrow222:" + arrowPath.curve.csX + "," + arrowPath.curve.csY + ","
		//		+ arrowPath.curve.ceX + "," +arrowPath.curve.ceY);
		
		//console.log("crurve start cord :" + startCord.x + "," + startCord.x + ","
		//		+ endCord.x + "," +endCord.y);
		
		//var arrowShaftWidth = 0; //default
		//var arrowHeadWidth = 0; //default
		
		try
		{
			if (resizerType == "AH1")
			{	
				//var head2Direction = arrowPath.getHeadDirection("HEAD2");
				startCord = { x: resizerXY.x, y: resizerXY.y };			
				arrowPath.calculateCurveArrowCord(startCord, endCord, arrowPath.arrowHeadSide, 
						"HEAD2", head2Direction, head1Direction, arrowHeadHeight,  arrowHeadWidth, arrowShaftWidth);
			}
			else if(resizerType == "AH2")
			{	
				endCord = { x: resizerXY.x, y: resizerXY.y };
				arrowPath.calculateCurveArrowCord(startCord, endCord, arrowPath.arrowHeadSide, 
						"HEAD1", head1Direction, head2Direction, arrowHeadHeight, arrowHeadWidth, arrowShaftWidth);
			}
			else if(resizerType == "MCR")
			{
				arrowPath.curve.crX1 = this.shape.origCurveArrowPath.curve.crX1+dx;
				arrowPath.curve.crY1 = this.shape.origCurveArrowPath.curve.crY1+dy;
				arrowPath.curve.crX2 = this.shape.origCurveArrowPath.curve.crX2+dx;
				arrowPath.curve.crY2 = this.shape.origCurveArrowPath.curve.crY2+dy;

				arrowPath.curve2.crX1 = this.shape.origCurveArrowPath.curve2.crX1+dx;
				arrowPath.curve2.crY1 = this.shape.origCurveArrowPath.curve2.crY1+dy;
				arrowPath.curve2.crX2 = this.shape.origCurveArrowPath.curve2.crX2+dx;
				arrowPath.curve2.crY2 = this.shape.origCurveArrowPath.curve2.crY2+dy;

				/*arrowPath.calculateCurveArrowCord(startCord, endCord, arrowPath.arrowHeadSide, 
						"HEAD1", head1Direction, head2Direction, arrowHeadHeight, arrowHeadWidth, arrowShaftWidth+dx);*/
			}
			else if(resizerType == "SWR")
			{
				var delta = dy;
				
				switch (head1Direction)
				{
					case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
					case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
						delta =	dx;
						if (this.shape.origCurveArrowPath.curve2.ceX > this.shape.origCurveArrowPath.curve.csX)
						{
							delta *= -1;
						}
						break;
					default:
						delta =	dy;
						if (this.shape.origCurveArrowPath.curve2.ceY > this.shape.origCurveArrowPath.curve.csY)
						{
							delta *= -1;
						}
						break;
				}
				
				arrowPath.calculateCurveArrowCord(startCord, endCord, arrowPath.arrowHeadSide, 
						"HEAD1", head1Direction, head2Direction, arrowHeadHeight, arrowHeadWidth, arrowShaftWidth+delta);
			}
			else if(resizerType == "HWR" || resizerType == "HHR")
			{
				
				var deltaW = dx;
				var deltaH = dy;
				
			/*	var currentRoration = this.shape.getRotationAngle();
				if ((currentRoration >= 45 && currentRoration <= 135) ||
						(currentRoration >= 225 && currentRoration <= 315))
				{
					var tmp = deltaW;
					deltaH = deltaW;
					deltaW = tmp;
				}*/
		
				switch (head1Direction)
				{
					
					case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
					case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
						console.log("comming here22 " + deltaH);
						deltaW = dy;
						deltaH = dx;
						if (this.shape.origCurveArrowPath.head1.HMY > this.shape.origCurveArrowPath.head1.HBY)
						{
							deltaW *= -1;
							deltaH *= -1;
							
							console.log("comming here " + deltaH);
						}
						
						if (this.shape.origCurveArrowPath.head1.HMY < this.shape.origCurveArrowPath.head1.HBY ||
								this.shape.origCurveArrowPath.head1.HBX < this.shape.origCurveArrowPath.head1.HTX)
						{
							deltaH *= -1;
						}
						
						break;
					default:
						deltaW = dx;
						deltaH = dy;
						if (this.shape.origCurveArrowPath.head1.HMX > this.shape.origCurveArrowPath.head1.HBX)
						{
							deltaW *= -1;
						}
						
						if (this.shape.origCurveArrowPath.head1.HTY < this.shape.origCurveArrowPath.head1.HTY)
						{
							deltaH *= -1;
						}
						break;
				}
				
				if (resizerType == "HWR")	
				{
					arrowPath.calculateCurveArrowCord(startCord, endCord, arrowPath.arrowHeadSide, 
							"HEAD1", head1Direction, head2Direction, arrowHeadHeight, arrowHeadWidth+deltaW, arrowShaftWidth);
				}
				else
				{
					arrowPath.calculateCurveArrowCord(startCord, endCord, arrowPath.arrowHeadSide, 
							"HEAD1", head1Direction, head2Direction, arrowHeadHeight+deltaH, arrowHeadWidth, arrowShaftWidth);
				}
				
			}
			else if(resizerType == "CR1")
			{
				arrowPath.curve.crX1 = this.shape.origCurveArrowPath.curve.crX1+dx;
				arrowPath.curve.crY1 = this.shape.origCurveArrowPath.curve.crY1+dy;
				//arrowPath.head1 = arrowPath.calculateArrowHead("HEAD1"); 
			}
			else if(resizerType == "CR2")
			{
				arrowPath.curve.crX2 = this.shape.origCurveArrowPath.curve.crX2+dx;
				arrowPath.curve.crY2 = this.shape.origCurveArrowPath.curve.crY2+dy;
				//arrowPath.head2 = arrowPath.calculateArrowHead("HEAD2");	
			}

			console.log("crurve arrow111:"+ arrowPath.curve.csX + "," + arrowPath.curve.csY + ","
					+ arrowPath.curve.ceX + "," +arrowPath.curve.ceY);

		}
		catch (evt)
		{
			console.log("Exception : Failed to calulate arrow path ignoring, error" + evt);
			return;
			
		}
		var rotation = null;
		this.resetArrowPathCord(arrowPath, rotation);	
		this.resetInnerTextAttr();
	}
	
	var resetCurveArrowHelper = localResetCurveArrowHelper.bind(this);
	resetCurveArrowHelper();
	
	
	var myArrowResizeStart = resizeStart.bind(this);
	var myArrowResizeStop = resizestop.bind(this);
	var myArrowH1Resize = resizeMove.bind(this, arrowHead1Resizer, "AH1"); //arrow head1
	var myArrowH2Resize = resizeMove.bind(this, arrowHead2Resizer, "AH2"); //arrow head2
	var midCARotate = resizeMove.bind(this, midCARotator, "MCR"); //arrow midal
	var cr1CARotate = resizeMove.bind(this, cr1CARotator, "CR1"); //arrow CR1
	var cr2CARotate = resizeMove.bind(this, cr2CARotator, "CR2"); //arrow CR2
	var headWidthResize = resizeMove.bind(this, headWidthResizer, "HWR"); //Head width Resizer
	var headHeightResize = resizeMove.bind(this, headHeightResizer, "HHR"); //Head Height Resizer
	var shaftWidthResize = resizeMove.bind(this, shaftWidthResizer, "SWR"); //Shaft width Resizer
		
	arrowHead1Resizer.swDrag(myArrowH1Resize, myArrowResizeStart, myArrowResizeStop);
	arrowHead2Resizer.swDrag(myArrowH2Resize, myArrowResizeStart, myArrowResizeStop);
	midCARotator.swDrag(midCARotate, myArrowResizeStart, myArrowResizeStop);
	cr1CARotator.swDrag(cr1CARotate, myArrowResizeStart, myArrowResizeStop);
	cr2CARotator.swDrag(cr2CARotate, myArrowResizeStart, myArrowResizeStop);
	headWidthResizer.swDrag(headWidthResize, myArrowResizeStart, myArrowResizeStop);
	headHeightResizer.swDrag(headHeightResize, myArrowResizeStart, myArrowResizeStop);
	shaftWidthResizer.swDrag(shaftWidthResize, myArrowResizeStart, myArrowResizeStop);
	
}

SVGShape.prototype.addArrowHelper = function ()
{
	if (this.shapeType == "curveArrow")
	{
		this.addCurveArrowHelper();
		return;
	}
	
	var arrowPath = this.parseArrowPath();

	if (!arrowPath)
	{
		return;
	}
	
	this.removeArrowHelper();
	
	var bbox = this.shape.getBBox(1);
	var arrowCenter = { x: bbox.cx, y: bbox.cy };
	var headWidth = Math.round(Math.abs(arrowPath.head1.HMX-arrowPath.topLine.X2));
	
	var arrowTailMiddleX = null;
	var arrowRHWResizerY = null;
	var arrowEndResizer = null;
	var arrowRightFrontResizer = null;
	var arrowAHWResizer = null;
	var arrowWidthResizer = null;
	
	var localResetArrowHelper = function()
	{
		bbox = this.shape.getBBox(1);
		arrowCenter = { x: bbox.cx, y: bbox.cy };

		arrowTailMiddleX = arrowPath.topLine.X1 + (arrowPath.topLine.X2 - arrowPath.topLine.X1)/2;
		arrowRHWResizerY= arrowPath.head1.HTY + (arrowPath.topLine.Y2 - arrowPath.head1.HTY)/2
		
		
		var arrowHelper = new SW_ShapeHelper(this.shape.parent());

		//alert("Arrow Head type:" + arrowPath.arrowHeadSide);
		if (arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD)
		{
			arrowEndResizer = arrowHelper.drawHelper(arrowPath.head2.HMX-this.adjustFactor, arrowPath.head2.HMY, HELPER_CATAGORY.SUB_HELPER);
			arrowRightFrontResizer = arrowHelper.drawHelper(arrowPath.head1.HMX+this.adjustFactor, arrowPath.head1.HMY, HELPER_CATAGORY.SUB_HELPER);
		}
		else if(arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_HEAD)
		{
		    arrowEndResizer = arrowHelper.drawHelper(arrowPath.topLine.X1+this.adjustFactor, arrowPath.head1.HMY, HELPER_CATAGORY.SUB_HELPER);
		    arrowRightFrontResizer = arrowHelper.drawHelper(arrowPath.head1.HMX-this.adjustFactor, arrowPath.head1.HMY, HELPER_CATAGORY.SUB_HELPER);
		}
		else
		{
			arrowEndResizer = arrowHelper.drawHelper(arrowPath.topLine.X1-this.adjustFactor, arrowPath.head1.HMY, HELPER_CATAGORY.SUB_HELPER);
			arrowRightFrontResizer = arrowHelper.drawHelper(arrowPath.head1.HMX+this.adjustFactor, arrowPath.head1.HMY, HELPER_CATAGORY.SUB_HELPER);
		}
		
		arrowHelper.size(2);
		arrowAHWResizer = arrowHelper.drawHelper(arrowPath.head1.HTX, arrowRHWResizerY, HELPER_CATAGORY.SUB_HELPER, SHAPE_HELPER.LEFT_RIGHT_ARROW);
		arrowWidthResizer = arrowHelper.drawHelper(arrowTailMiddleX, arrowPath.topLine.Y1, HELPER_CATAGORY.SUB_HELPER, SHAPE_HELPER.TOP_DOWN_ARROW);

		this.ShapeSpecificHelperGroup = this.shape.parent().group(arrowEndResizer, arrowRightFrontResizer, arrowAHWResizer, arrowWidthResizer);
		this.ShapeSpecificHelperGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });
	}
	
	var resetArrowHelper = localResetArrowHelper.bind(this);

	var arrowResizeStart = function ()
	{
		this.startRecording();
		this.shape.recordOnStop = false;
		
		var bbox = this.shape.getBBox(1);
		arrowCenter = { x: bbox.cx, y: bbox.cy };
		
		headWidth = Math.round(Math.abs(arrowPath.head1.HMX-arrowPath.topLine.X2));
		
		this.removeShapeEditHelper();
	}
	
	var arrowResizeStop = function ()
	{
		this.stopRecording(this.shape.recordOnStop);
		this.shape.recordOnStop = false;
		this.addShapeEditHelper();
	}
	
	var arrowResize = function (shapeResizer, resizerType, dx, dy, x, y,evt)
	{	
			this.shape.recordOnStop = true;
			
			var resizerXY = this.SWsvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, this.shape);

			resizerXY.x = Math.round(resizerXY.x);
			resizerXY.y = Math.round(resizerXY.y);
			
			var arrowPath = this.parseArrowPath();
			
			var angle = null;
			var rotationOrigin = new Object;		
		
			if (resizerType =="AE")
			{
			    if(arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_HEAD)
			    {    resizerXY.x -= this.adjustFactor; }
			    else
			    {    resizerXY.x += this.adjustFactor; }
			    
				if (arrowPath.topLine.X2 <= arrowPath.head1.HMX)
				{//right arrow ahead at right direction when no rotation applied
					if (resizerXY.x >= 	arrowPath.topLine.X2) {	resizerXY.x = arrowPath.topLine.X2;	}
					angle = Snap.angle(resizerXY.x, resizerXY.y, arrowPath.head1.HMX, arrowPath.head1.HMY) - 180;	
				}
				else
				{//right arrow ahead at left direction  when no rotation applied	
					var  arrowRightHeadWidth = arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD ? headWidth : 0;					
					
					if (resizerXY.x - arrowRightHeadWidth <= arrowPath.topLine.X2) { resizerXY.x = arrowPath.topLine.X2 + arrowRightHeadWidth; }
					angle = Snap.angle(resizerXY.x, resizerXY.y, arrowPath.head1.HMX, arrowPath.head1.HMY);
				}

				rotationOrigin.x = arrowPath.head1.HMX;
				rotationOrigin.y = arrowPath.head1.HMY;

				if (arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD)
				{

					var oldH2MX = arrowPath.head2.HMX;
					
					if (arrowPath.topLine.X1 >= arrowPath.head2.HMX)
					{				
						arrowPath.head2.HMX = resizerXY.x;
						arrowPath.topLine.X1 = resizerXY.x + headWidth;
						arrowPath.bottomLine.X1 = resizerXY.x + headWidth;
						arrowPath.head2.HTX = resizerXY.x + headWidth;
						arrowPath.head2.HBX = resizerXY.x + headWidth;	
						
						if (arrowPath.topLine.X2 <= arrowPath.topLine.X1)
						{
							arrowPath.topLine.X1 = arrowPath.topLine.X2;
							arrowPath.bottomLine.X1 = arrowPath.topLine.X2;
							arrowPath.head2.HTX = arrowPath.topLine.X2;
							arrowPath.head2.HBX = arrowPath.topLine.X2;
							arrowPath.head2.HMX = oldH2MX;
						}
					}
					else
					{
						arrowPath.head2.HMX = resizerXY.x;
						arrowPath.topLine.X1 = resizerXY.x - headWidth;
						arrowPath.bottomLine.X1 = resizerXY.x - headWidth;
						arrowPath.head2.HTX = resizerXY.x - headWidth;
						arrowPath.head2.HBX = resizerXY.x - headWidth;	
					}					
				}
				else
				{
					arrowPath.topLine.X1 = resizerXY.x;
					arrowPath.bottomLine.X1 = resizerXY.x;
				}

				console.log("angle between point" +  angle);
			}
			else if (resizerType =="ARF")
			{
			    if(arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_HEAD)
                {    resizerXY.x += this.adjustFactor; }
                else
                {    resizerXY.x -= this.adjustFactor; }
                
				rotationOrigin.x = arrowPath.topLine.X1;
				rotationOrigin.y = arrowPath.topLine.Y1 + (arrowPath.bottomLine.Y1 - arrowPath.topLine.Y1)/2;
				
				if (arrowPath.topLine.X2 <= arrowPath.head1.HMX)
				{//right arrow head at right direction when no rotation applied
					angle = Snap.angle(resizerXY.x, resizerXY.y, rotationOrigin.x, rotationOrigin.y);	
				}
				else
				{//right arrow head at left direction  when no rotation applied		
					if (resizerXY.x + headWidth >= arrowPath.topLine.X1) { resizerXY.x = arrowPath.topLine.X1 - headWidth; }					
					angle = Snap.angle(resizerXY.x, resizerXY.y, rotationOrigin.x, rotationOrigin.y)-180;	
				}
				//console.log("angle between point" +  angle);
			
				var oldHMX = arrowPath.head1.HMX;
				
				if (arrowPath.topLine.X2 <= arrowPath.head1.HMX)
				{//arrow ahead at right direction when no rotation applied
					arrowPath.head1.HMX = resizerXY.x;
					arrowPath.topLine.X2 = resizerXY.x-headWidth;
					arrowPath.bottomLine.X2 = resizerXY.x-headWidth;
					arrowPath.head1.HTX = resizerXY.x-headWidth;
					arrowPath.head1.HBX = resizerXY.x-headWidth;

					if (arrowPath.topLine.X2 <= arrowPath.topLine.X1)
					{
						arrowPath.topLine.X2 = arrowPath.topLine.X1;
						arrowPath.bottomLine.X2 = arrowPath.topLine.X1;
						arrowPath.head1.HTX = arrowPath.topLine.X1;
						arrowPath.head1.HBX = arrowPath.topLine.X1;
						arrowPath.head1.HMX = oldHMX;
					}
				}
				else
				{
					arrowPath.head1.HMX = resizerXY.x;
					arrowPath.topLine.X2 = resizerXY.x + headWidth;
					arrowPath.bottomLine.X2 = resizerXY.x + headWidth;
					arrowPath.head1.HTX = resizerXY.x + headWidth;
					arrowPath.head1.HBX = resizerXY.x + headWidth;					
				}
			}
			else if (resizerType == "AHW")
			{
				var minArowHeadWidh = 10; 
				
				if (Math.round(arrowPath.topLine.X2) <= Math.round(arrowPath.head1.HMX) && Math.round(arrowPath.topLine.X2) >= Math.round(arrowPath.topLine.X1))
				{//arrow ahead at right direction when no rotation applied					
					if (resizerXY.x+minArowHeadWidh >= arrowPath.head1.HMX) { resizerXY.x = arrowPath.head1.HMX-minArowHeadWidh; }
					if (resizerXY.x <= arrowPath.topLine.X1) { resizerXY.x = arrowPath.topLine.X1 + (arrowPath.topLine.X2 -arrowPath.topLine.X1)/2; }
				}
				else
				{//arrow ahead at left direction when no rotation applied
					
					if (resizerXY.x-minArowHeadWidh <= arrowPath.head1.HMX) { resizerXY.x = arrowPath.head1.HMX+minArowHeadWidh; }
					if (resizerXY.x >= arrowPath.topLine.X1) { resizerXY.x = arrowPath.topLine.X1 + (arrowPath.topLine.X2 -arrowPath.topLine.X1)/2; }
				}
				
				arrowPath.topLine.X2 = resizerXY.x;
				arrowPath.bottomLine.X2 = resizerXY.x;				
				arrowPath.head1.HTX = resizerXY.x;
				arrowPath.head1.HBX = resizerXY.x;	

				if (arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD)
				{
					var newArrowRightHeadWidth = arrowPath.head1.HMX-arrowPath.topLine.X2; 
					arrowPath.topLine.X1 = arrowPath.head2.HMX + newArrowRightHeadWidth;
					arrowPath.bottomLine.X1 = arrowPath.topLine.X1;			
					arrowPath.head2.HTX = arrowPath.topLine.X1;
					arrowPath.head2.HBX = arrowPath.topLine.X1;
				}
			}
			else if (resizerType =="AW")
			{
				//consoloe.log( "arrowPath.topLine.Y2 , arrowPath.bottomLine.Y2 " +arrowPath.topLine.Y2 + ","+ arrowPath.bottomLine.Y2)
				if (resizerXY.y >=  arrowPath.head1.HBY && arrowPath.arrowHeadSide != ARROW_HEAD_TYPE.LEFT_HEAD)
				{
					resizerXY.y = arrowPath.head1.HBY;
				}
				
				if (resizerXY.y <=  arrowPath.head1.HTY && arrowPath.arrowHeadSide != ARROW_HEAD_TYPE.LEFT_HEAD)
				{
					resizerXY.y =  arrowPath.head1.HTY;
				}
				
				if (resizerXY.y <=  arrowPath.head1.HBY && arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_HEAD)
                {
                    resizerXY.y = arrowPath.head1.HBY;
                }
                
                if (resizerXY.y >=  arrowPath.head1.HTY && arrowPath.arrowHeadSide == ARROW_HEAD_TYPE.LEFT_HEAD)
                {
                    resizerXY.y =  arrowPath.head1.HTY;
                }
                
				
				arrowPath.topLine.Y1 = resizerXY.y;
				arrowPath.topLine.Y2 = resizerXY.y;
				
				var newheadWidth = arrowPath.topLine.Y2 - arrowPath.head1.HTY;

				arrowPath.bottomLine.Y1 = arrowPath.head1.HBY - newheadWidth;
				arrowPath.bottomLine.Y2 = arrowPath.head1.HBY - newheadWidth;	

			}
			
			//console.log("angle of rotation :" + angle);
			var rotation = {angle: angle, originX: rotationOrigin.x, originY: rotationOrigin.y};
			this.resetArrowPathCord(arrowPath, rotation);
			this.resetInnerTextAttr();
	}
	
	
	resetArrowHelper();
	
	var myArrowResizeStart = arrowResizeStart.bind(this);
	var myArrowResizeStop = arrowResizeStop.bind(this);
	var myArrowEndResize = arrowResize.bind(this, arrowEndResizer, "AE"); //arrow end
	var myArrowRFrontResize = arrowResize.bind(this, arrowRightFrontResizer, "ARF"); //arrow right front
	var myArrowHeadWidthResize = arrowResize.bind(this, arrowAHWResizer, "AHW"); //arrow head width
	var myArrowWidthResize = arrowResize.bind(this, arrowWidthResizer, "AW"); //arrow  width
	
	arrowEndResizer.swDrag(myArrowEndResize, myArrowResizeStart, myArrowResizeStop);
	arrowRightFrontResizer.swDrag(myArrowRFrontResize, myArrowResizeStart, myArrowResizeStop);
	arrowAHWResizer.swDrag(myArrowHeadWidthResize, myArrowResizeStart, myArrowResizeStop);
	arrowWidthResizer.swDrag(myArrowWidthResize, myArrowResizeStart, myArrowResizeStop);
	
	
}

SVGShape.prototype.removeArrowHelper = function ()
{
	//alert("call for remove Cureve dec");
	if (this.ShapeSpecificHelperGroup)
	{
		this.ShapeSpecificHelperGroup.selectAll('SWShapeHelper').remove();
		this.ShapeSpecificHelperGroup.remove();
		this.ShapeSpecificHelperGroup = null;
		//console.log("removing curv group");
	}
}

SVGShape.prototype.addRectangleHelper = function()
{
	
    this.removeRectangleHelper();
	var rectAttrib = { x: parseInt(this.shape.attr('x')), y: parseInt(this.shape.attr('y')), w: parseInt(this.shape.attr('width')),
			       h: parseInt(this.shape.attr('height')), rx: parseInt(this.shape.attr('rx')), ry: parseInt(this.shape.attr('ry')) };
	
	var rectHelper = new SW_ShapeHelper(this.shape.parent());
	var rectEdgeResizer = rectHelper.drawHelper(rectAttrib.x, rectAttrib.y+rectAttrib.ry+10, HELPER_CATAGORY.SUB_HELPER, SHAPE_HELPER.TOP_DOWN_ARROW);

	this.ShapeSpecificHelperGroup = this.shape.parent().group(rectEdgeResizer);
	this.ShapeSpecificHelperGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });
	
	var rectEdgeResizeStart = function()
	{
		this.startRecording();
		this.shape.recordOnStop = false;			
		this.removeShapeEditHelper();
		rectAttrib = { x: parseInt(this.shape.attr('x')), y: parseInt(this.shape.attr('y')), w: parseInt(this.shape.attr('width')),
			       h: parseInt(this.shape.attr('height')), rx: parseInt(this.shape.attr('rx')), ry: parseInt(this.shape.attr('ry')) };
	}
	
	var rectEdgeResizeStop = function()
	{
		this.stopRecording(this.shape.recordOnStop);
		this.shape.recordOnStop = false;
		this.addShapeEditHelper();		
	}
	
	var rectEdgeResizeMove = function(dx, dy, x, y,evt)
	{
		this.shape.recordOnStop = true;
		
		if ((rectAttrib.rx+dy) >= 0 && (rectAttrib.ry+dy) >= 0)
		{
			if ((rectAttrib.x+rectAttrib.rx+dy) < (rectAttrib.x+rectAttrib.h/2 +10) &&
					(rectAttrib.x+rectAttrib.rx+dy) < (rectAttrib.x+rectAttrib.w/2 +10))
			{
				this.shape.attr({ 'rx': rectAttrib.rx+dy, 'ry': rectAttrib.ry+dy });
			}
		}
	}
	
	var myRectEdgeResizeStart = rectEdgeResizeStart.bind(this);
	var myRectEdgeResizeStop = rectEdgeResizeStop.bind(this);
	var myRectEdgeResizeMove = rectEdgeResizeMove.bind(this);
	
	rectEdgeResizer.swDrag(myRectEdgeResizeMove, myRectEdgeResizeStart, myRectEdgeResizeStop);
}

SVGShape.prototype.removeRectangleHelper = function()
{
	//alert("call for remove Cureve dec");
	if (this.ShapeSpecificHelperGroup)
	{
		this.ShapeSpecificHelperGroup.selectAll('SWShapeHelper').remove();
		this.ShapeSpecificHelperGroup.remove();
		this.ShapeSpecificHelperGroup = null;
		//console.log("removing curv group");
	}	
}


SVGShape.prototype.addTableHelper = function()
{ 
    this.removeTableHelper()
	var myTable = this.getEditableTextElement().firstChild;
	//alert("myTable" + myTable.innerHTML)	
	
	var bBox = this.shape.getBBox(1);
	var startCord = { x: bBox.x, y: bBox.y };
	var myTableSize = {height: bBox.height,  width: bBox.width };
	
	var tableColResizer = new Array;
	var tableRowResizer = new Array;
	
	this.ShapeSpecificHelperGroup = this.shape.parent().group();
	var tableHelper = new SW_ShapeHelper(this.shape.parent());
	
	
	
	var addTableDrager = function (tableResizer, rowOrCol, resizerDistanceFromStart)
	{
		
		var origHeightOrWidth = 0;
		var listOfCellsToResize = new Array;
		
		var tableResizeStart = function(tableResizer)
		{
			this.startRecording();
			this.shape.recordOnStop = false;
			
			this.removeShapeEditHelper();
			
			listOfCellsToResize.splice(0, listOfCellsToResize.length);
			
			if (rowOrCol == "ROW" )
			{			
				var tmpTotalRowHeight=0;
				$(myTable).find('tr').each(function (key, val)
				{
					var origHeightOrWidth = $(this).height();					
					tmpTotalRowHeight += $(this).outerHeight();
					
					if (tmpTotalRowHeight == resizerDistanceFromStart)
					{
						var elmAndWidth = { elem : this, origHeight: origHeightOrWidth }
						listOfCellsToResize.push(elmAndWidth);	
					}
				});


			}
			else if (rowOrCol == "COL" )
			{			
				var rowNumber = 1;
				$(myTable).find('tr').each(function (key, val)
				{
					var tmpTotalColWidth=0;
					var colNumber = 1;
					
			        $(this).find('td, th').each(function (key, val)
			        {
			        	tmpTotalColWidth += $(this).outerWidth();			
			        	colNumber++;
			        	if (tmpTotalColWidth == resizerDistanceFromStart)
			        	{
			        		var origHeightOrWidth = $(this).width();
			        		
			        		var row = myTable.rows[rowNumber-1];
		                    var nextCell = row.cells[colNumber-1];
		                    var nextOrigHeightOrWidth = $(nextCell).width();
		                    var myOrigtableWidth = $(myTable).width();
			        		var elmAndWidth = { elem : this, origWidth: origHeightOrWidth, nextElem : nextCell, 
			        		        nextOrigWidth : nextOrigHeightOrWidth, origtableWidth:myOrigtableWidth,
			        		           rowNumber: rowNumber, colNumber: colNumber }
			        		listOfCellsToResize.push(elmAndWidth);
			        	//for testing	this.style.background ="green";
			        	} 
			        	
			        	
			        });  
			        
			        rowNumber++;
			        
			    });
			}
			
			
		}
		
		var tableResizeStop = function(tableResizer)
		{
			this.stopRecording(this.shape.recordOnStop);
			this.shape.recordOnStop = false;
			this.addShapeEditHelper();
		}
		
		var tableResizeMove = function(tableResizer, dx, dy, x, y,evt)
		{	
			this.shape.recordOnStop = true;
			//console.log("Table rotated with agle: "+this.shape.getRotationAngle());
			var tableRotationAngle = this.shape.getRotationAngle()
			var bBox1 = this.shape.getBBox(1);
			if(tableRotationAngle > 90 && tableRotationAngle <= 270)
			{
				dx*=-1;
				dy*=-1;
			}
			
			if(tableRotationAngle > 45 && tableRotationAngle <= 135)
			{
				var tmp = dx;
				dx=dy;
				dy=tmp;
				if (tableRotationAngle > 45 && tableRotationAngle <= 90)
				{ 
					dy*=-1; 
				}
				else
				{
					dx*=-1; 
				}
			}
			
			if(tableRotationAngle > 225 && tableRotationAngle <= 315)
			{
				var tmp = dx;
				dx=dy;
				dy=tmp;
				if (tableRotationAngle > 225 && tableRotationAngle <= 270)
				{
					dy*=-1; 
				}
				else
				{
					dx*=-1; 
				}
			}

			if (rowOrCol =="ROW" )
			{
				for (var index=0; index < listOfCellsToResize.length; index++)
				{
					var newHeight = listOfCellsToResize[index].origHeight + dy;
					$(listOfCellsToResize[index].elem).css("height", newHeight);					
				}
			}
			else if(rowOrCol =="COL" )
			{
			   
                
				for (var index=0; index < listOfCellsToResize.length; index++)
				{		
				    var cellToResize = listOfCellsToResize[index];
				//	console.log("orig cell width: " +  cellToResize.origWidth);
					var newWidth = Math.max(cellToResize.origWidth + dx, 1);
					var nextElemNewWidth = Math.max(cellToResize.nextOrigWidth-dx, 1);
					//console.log("orig cell width: " +  cellToResize.origWidth + "new cell width: " + newWidth);
					
				//	console.log("table width set to" + (cellToResize.origtableWidth + dx));
                    
					
					if (newWidth != 1 && nextElemNewWidth != 1)
					{
					    
					    if (cellToResize.nextElem)
					    {
					        $(cellToResize.elem).width(newWidth);
					        $(cellToResize.nextElem).width(nextElemNewWidth);
					    }
					}
					
				    if (!cellToResize.nextElem) //last coloumn cell 
                    {   $(cellToResize.elem).width(newWidth);
				        $(myTable).width(cellToResize.origtableWidth + dx); 
				    }
                
				}
			}
			
			var tableWidth = $(myTable).width();
			var borderWidth =($(myTable).outerWidth() - $(myTable).width()) / 2;
			
			var element =  this.shape.node.getElementsByTagName("foreignObject")[0]; 
				element.setAttribute("width", tableWidth+borderWidth*2);
	   //     element.setAttribute("height",  mysize.height);
			
			var mysize = this.getForeignObjectSize();
			
			
			element.setAttribute("width", mysize.width);
			element.setAttribute("height",  mysize.height);		
			//table parent div height
			var edElem = this.getEditableTextElement();
			edElem.setAttribute("height",  mysize.height);
			
			this.shape.attr({			
				width: mysize.width,
				height: mysize.height
			});	
			
		}
		
		
		var myTableResizeStart = tableResizeStart.bind(this, tableResizer);
		var myTableResizeStop = tableResizeStop.bind(this, tableResizer);
		var myTableResizeMove = tableResizeMove.bind(this, tableResizer);
		
		tableResizer.swDrag(myTableResizeMove, myTableResizeStart, myTableResizeStop);
		
	}
	
	var localAddDrager =  addTableDrager.bind(this)
	
	var tableRotationAngle = this.shape.getRotationAngle();
	var mainBB = this.shape.getBBox(1);		
	//this.shape.rotate(360-tableRotationAngle, mainBB.cx, mainBB.cy);
	
	var myMatrix = this.shape.transform().localMatrix;
	
	//myMatrix.rotate(AngleInDegree, rotateOriginX, rotateOriginY);		
	//var tmpMatrix = Snap.Matrix();
	this.shape.attr({ transform: ""/*tmpMatrix.toTransformString()*/ });
		
	var totalColWidth=0;
	var totalRowHeight=0;
	var lastRowNumber=0;
	var lastColNumber=0;
	var rowHeight=0;
	var lastCellHeight=0;
	var currRowYDistFromStart=0;
	var nextRowYDistFromStart=0;
	var minCellHeightInRow = 0;
	//var colResizerStartY = tblStartCord.y;	
	var colsNotAvilableInTable = new Array;	
	
	var tableResizer = function (tblStartCord, rowNumber, colNumber, rowSpan, tdHeight, tdWidth, isLastRow, isLastColOfRow, cell)
	{
		//console.log("cell postition" +cell.offsetLeft, cell.offsetTop);
		//var bRect = cell.getBoundingClientRect();		
		//var xy =this.SWsvgCanvas.convertToSVGPoint(bRect.left, bRect.top, SW_CORD_SYSTEM_TYPE.HTML, null);
		
		var xy = {x : tblStartCord.x+cell.offsetLeft, y: tblStartCord.y+cell.offsetTop};				
		
		var borderWidth =($(myTable).outerWidth() - $(myTable).width()) / 2;
		console.log("table border width" + borderWidth);
		
		if (navigator.userAgent.indexOf("Firefox") > 0) { borderWidth=0; }
		var tableVertBorderSize = borderWidth;
		var tableHoriBorderSize = borderWidth;
		
		var cellXY = {x: xy.x+tableHoriBorderSize, y: xy.y+tableVertBorderSize};
			
		if (lastRowNumber < rowNumber)
		{
			totalColWidth = 0;
			lastRowNumber = rowNumber;
			currRowYDistFromStart = nextRowYDistFromStart;
			nextRowYDistFromStart += tdHeight;	
			minCellHeightInRow=tdHeight;
		}
		else if (minCellHeightInRow > tdHeight)
		{
			nextRowYDistFromStart -=minCellHeightInRow;
			nextRowYDistFromStart+=tdHeight;
			minCellHeightInRow = tdHeight;
		}
		
		var tmpTableColResizer = tableHelper.drawLineHelper(cellXY.x+tdWidth, cellXY.y, cellXY.x+tdWidth, cellXY.y+tdHeight, HELPER_CATAGORY.MAIN_HELPER, SHAPE_HELPER.LEFT_RIGHT_ARROW);	

		this.ShapeSpecificHelperGroup.append(tmpTableColResizer);				
		localAddDrager(tmpTableColResizer, "COL", totalColWidth+tdWidth);


		var tmpTableRowResizer = tableHelper.drawLineHelper(cellXY.x, cellXY.y+tdHeight, cellXY.x+tdWidth, cellXY.y+tdHeight, HELPER_CATAGORY.MAIN_HELPER, SHAPE_HELPER.TOP_DOWN_ARROW);	
		this.ShapeSpecificHelperGroup.append(tmpTableRowResizer);
		localAddDrager(tmpTableRowResizer, "ROW", currRowYDistFromStart+tdHeight);

		totalColWidth += tdWidth;
	}
	
	
	var mytableResizer =  tableResizer.bind(this, startCord) ;
	
	for (var rowIndex=0; rowIndex < myTable.rows.length; rowIndex++)
	{
		var isLastRow = false;
		if (rowIndex == myTable.rows.length-1)
		{
			isLastRow = true;
		}
		
		var row = myTable.rows[rowIndex];
		
		for (var cellIndex=0; cellIndex < row.cells.length; cellIndex++)
		{
			var cell = row.cells[cellIndex];
				
			var tdWidth = $(cell).outerWidth();
			var tdHeight = $(cell).outerHeight();

			var position = $(cell).offset();
			var isLastColOfRow = false;
			
			if (cellIndex== row.cells.length-1)
			{
				isLastColOfRow = true;
			}
			
			var colSpan = cell.rowSpan;	
			
			mytableResizer(rowIndex+1, cellIndex+1, colSpan, tdHeight, tdWidth, isLastRow, isLastColOfRow, cell); 
			
		}
	}
	
	this.shape.attr({ transform: myMatrix.toTransformString() });
	this.ShapeSpecificHelperGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });

}

SVGShape.prototype.removeTableHelper = function()
{
	//alert("call for remove Cureve dec");
	if (this.ShapeSpecificHelperGroup)
	{
		this.ShapeSpecificHelperGroup.selectAll('SWShapeHelper').remove();
		this.ShapeSpecificHelperGroup.remove();
		this.ShapeSpecificHelperGroup = null;
		//console.log("removing curv group");
	}
}

SVGShape.prototype.addActionDecorator = function()
{

	if(this.actionHandleGroup)
	{
		//Due to repeated events;
	    
		//console.log("********Already Handler set ignoring...");
		//return;
		this.removeActionDecorator();
	}

	var alpplyDecoratoredOnScalledShape= false; 
	var bBox = new Array;
	
	if (alpplyDecoratoredOnScalledShape) 
	{
		var bBox1 = this.shape.getBBox(0);
		bBox2 = this.shape.parent().rect(this.rectObjFromBB(bBox1, 0)).attr({ class: 'SWShapeHelper', fill: "none", stroke: "black", strokeDasharray: "5,5" });
		//bBox2.attr({ transform: this.shape.transform().localMatrix.toTransformString() });
		
		bBox.x = bBox2.node.x.animVal.value;
		bBox.y = bBox2.node.y.animVal.value;
		
		bBox.height = parseInt(bBox2.attr('height'));
		bBox.width = parseInt(bBox2.attr('width'));
		
		bBox2.remove();

	}
	else
	{
		var bBox1 = this.shape.getBBox(1);		
		bBox.x = bBox1.x;
		bBox.y = bBox1.y;
		
		bBox.height = bBox1.height;
		bBox.width = bBox1.width;
	}
	
	/*var bBox = new Array();
	bBox.x = parseInt(this.shape.attr('x'));
	bBox.y = parseInt(this.shape.attr('y'));
	bBox.height = parseInt(this.shape.attr('height'));
	bBox.width = parseInt(this.shape.attr('width'));

	bBox.cx = parseInt(this.shape.attr('x')) +  parseInt(this.shape.attr('width'))/2;
	bBox.cy	= parseInt(this.shape.attr('y')) + parseInt(this.shape.attr('height'))/2;

	if (isNaN(bBox.cx))
	{
		bBox.cx = parseInt(this.shape.attr('cx'));
		bBox.cy	= parseInt(this.shape.attr('cy'));
	}*/



	var handle = new Array();
	var distAdjt = this.adjustFactor;

	
	
	handle[0] = this.shape.parent().circle(bBox.x-distAdjt,bBox.y-distAdjt, 3).attr({class: 'SWShapeHelper', fill: "orange", stroke: "#000", name: "selectionBox"});
	handle[1] = this.shape.parent().circle(bBox.x+bBox.width+distAdjt, bBox.y-distAdjt, 3).attr({class: 'SWShapeHelper', fill: "orange", stroke: "#000", name: "selectionBox"});
	handle[2] = this.shape.parent().circle(bBox.x + bBox.width / 2, bBox.y-distAdjt, 3).attr({ class: 'SWShapeHelper', fill: "yellow", stroke: "#000", name: "selectionBox" });
	handle[3] = this.shape.parent().circle(bBox.x-distAdjt, bBox.y + bBox.height+distAdjt, 3).attr({ class: 'SWShapeHelper', fill: "blue", stroke: "#000", name: "selectionBox" });
	handle[4] = this.shape.parent().circle(bBox.x + bBox.width / 2, bBox.y + bBox.height+distAdjt, 3).attr({ class: 'SWShapeHelper', fill: "yellow", stroke: "#000", name: "selectionBox" });
	handle[5] = this.shape.parent().circle(bBox.x + bBox.width +distAdjt, bBox.y + bBox.height+distAdjt, 3).attr({ class: 'SWShapeHelper', fill: "orange", stroke: "#000", name: "selectionBox" });; 
	//handle[6] = this.shape.parent().circle(bBox.x + bBox.width +distAdjt, bBox.y + bBox.height/2, 3).attr({ class: 'SWShapeHelper', fill: "orange", stroke: "#000", name: "selectionBox" });
	//handle[7] = this.shape.parent().circle(bBox.x-distAdjt, bBox.y + bBox.height / 2, 3).attr({ class: 'SWShapeHelper', fill: "orange", stroke: "#000", name: "selectionBox" }); 

	var shapeHelper = new SW_ShapeHelper(this.shape.parent());

	if (this.shape.type == "line")
	{
		this.shapeResizer = shapeHelper.drawHelper( parseInt(this.shape.attr('x2')) + distAdjt, 
				parseInt(this.shape.attr('y2'))+ distAdjt, HELPER_CATAGORY.MAIN_HELPER);

		this.shapeResizerTL  = shapeHelper.drawHelper( parseInt(this.shape.attr('x1')) - distAdjt, 
						parseInt(this.shape.attr('y1')) - distAdjt, HELPER_CATAGORY.MAIN_HELPER);
		this.actionHandleGroup = this.shape.parent().group(handle[0], handle[1], handle[2], handle[3],handle[4],
						handle[5], /*handle[6], handle[7], */this.shapeResizer, this.shapeResizerTL);

	}	
	else
	{

		this.shapeResizer = shapeHelper.drawHelper(bBox.x + bBox.width +distAdjt, bBox.y + bBox.height+distAdjt, HELPER_CATAGORY.MAIN_HELPER);
		this.shapeResizerTL = shapeHelper.drawHelper(bBox.x-distAdjt, bBox.y-distAdjt, HELPER_CATAGORY.MAIN_HELPER);
		this.shapeResizerTR = shapeHelper.drawHelper(bBox.x+bBox.width + distAdjt, bBox.y-distAdjt, HELPER_CATAGORY.MAIN_HELPER);
		
		this.shapeResizerBL = shapeHelper.drawHelper(bBox.x-distAdjt, bBox.y+bBox.height+distAdjt, HELPER_CATAGORY.MAIN_HELPER);
		
		this.actionHandleGroup = this.shape.parent().group(handle[0], handle[1], handle[2], handle[3],handle[4],
				handle[5],/* handle[6], handle[7], */this.shapeResizer, this.shapeResizerTL,this.shapeResizerTR,
				this.shapeResizerBL);

	}

	

	console.log("shape transformation :" + this.shape.transform().localMatrix.toTransformString());

	//console.log("shape transformation dx :" + splitedMatrix.dx + ", dy : " + splitedMatrix.dy  + "orig: " + this.shape.transform().localMatrix.toTransformString() );
	if (!alpplyDecoratoredOnScalledShape)
	{
		this.actionHandleGroup.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });
	}

	/*var splitedMatrix = this.shape.transform().localMatrix.split();
	var myMatrix = new Snap.Matrix();
	myMatrix.translate(splitedMatrix.dx, splitedMatrix.dy);
	myMatrix.rotate(splitedMatrix.rotate);
	myMatrix.scale(splitedMatrix.scalex, splitedMatrix.scaley);  

       console.log("tranforString : " + myMatrix.toTransformString());
	
       this.actionHandleGroup.attr({ transform: myMatrix.toTransformString()  });*/

	console.log("actionHandleGroup transformation :" + this.actionHandleGroup.transform().localMatrix.toTransformString());

/*	

		this.shape.attr({
			transform: this.shape.data('origTransform') + (this.shape.data('origTransform') ? "T" : "t") + [dx, dy]
		});

        var scale = 1;
        this.actionHandleGroup.attr({
              	  transform: this.shape.data('origTransform') + (this.shape.data('origTransform') ? "S" : "s") + scale,
               	// strokeWidth: this.myStrokeWidth,
        	});*/

	var resizeStart = this.shapeResizeStart.bind(this);
	var resizeMoveBR = this.shapeResizeMoveBR.bind(this);
	var resizeMoveTL = this.shapeResizeMoveTL.bind(this);
	

	var resizeStop = this.shapeResizeStop.bind(this);
	this.shapeResizer.swDrag(resizeMoveBR, resizeStart, resizeStop);
	this.shapeResizerTL.swDrag(resizeMoveTL, resizeStart, resizeStop);
	
	if (this.shapeResizerTR)
	{ 
		var resizeMoveTR = this.shapeResizeMoveTR.bind(this);
		this.shapeResizerTR.swDrag(resizeMoveTR, resizeStart, resizeStop);
		this.shapeResizerTR.mouseover(function(){
			this.attr('cursor', 'move');
		});
	}
	
	if (this.shapeResizerBL)
	{ 
		var resizeMoveBL = this.shapeResizeMoveBL.bind(this);
		this.shapeResizerBL.swDrag(resizeMoveBL, resizeStart, resizeStop);
		this.shapeResizerBL.mouseover(function(){
			this.attr('cursor', 'move');
		});
	}
	
	
	//swDrag

	this.shapeResizer.mouseover(function(){
		this.attr('cursor', 'move');
	});

	this.shapeResizerTL.mouseover(function(){
		this.attr('cursor', 'move');
	});
	


	if (this.shapeContainerBox)
	{ 

		this.shapeContainerBox.parent().append(this.shapeContainerBox);
		if (this.shapeRotator)
        {
            //bring to front
            this.shapeRotator.parent().append(this.shapeRotator);
        }
		this.actionHandleGroup.parent().append(this.actionHandleGroup);		
	}

	/*this.shapeResizer.mousemove(function(evt){
		var pt = new Array();
		 pt.x = evt.clientX;
		 pt.y = evt.clientY;
		// return pt.matrixTransform(this.parent().node.getScreenCTM().inverse());
	});*/
}

SVGShape.prototype.removeActionDecorator = function()
{
	if (this.actionHandleGroup)
	{
		this.actionHandleGroup.selectAll('SWShapeHelper').remove();
		this.actionHandleGroup.remove();
		this.actionHandleGroup = null;		
		//this.shape.parent().append(this.shape); //bring to front
	}
}

SVGShape.prototype.shapeOnMouseDown = function()
{
	this.shape.attr('cursor', 'move');
}

SVGShape.prototype.shapeOnMouseUp = function()
{	
		this.shape.attr('cursor', 'pointer');
}

SVGShape.prototype.shapeOnMouseMove = function(e, mouseX, mouseY)
{

	if (this.shape.type  == "g" && this.shape.hasClass("SWSVGForeignObj")) 
	{
		if (this.SWsvgCanvas.isMousePressed() && !this.isSelected)
		{
			//console.log("Add Toolbar");
			//this.SWsvgCanvas.selectElement(this);
			this.isSelected = true;
		}
	}
	//this.changeCursor(e, mouseX, mouseY);
}

SVGShape.prototype.shapeOnDblClick = function()
{
	console.log("Shape double clicked ");	

	if (this.shape.type  == "g" && this.shape.hasClass("SWSVGForeignObj")) 
	{
	    if(this.swAssociatedShape && this.swAssociatedShape.shape.type == "polyline")
        {       
            cordinate = this.SWsvgCanvas.getMouseClickCoordinates();
            //console.log ("polyline double click " + cordinate.x);
            this.swAssociatedShape.insertPoint(cordinate);    
        }
	    
	    if (this.actionToPerforrm == "REMOVE_ACTION_TOOLS")	
	    {
	        //this.actionToPerforrm = "ADD_ACTION_TOOLS";	
	        //this.removeActionDecorator();
	        //this.removeShapeContainer();
	        //this.removeShapeRotator();	
	        //this.shape.undrag();   
	        //this.shape.attr('cursor', 'auto');
	    }
	    else if (this.actionToPerforrm == "ADD_ACTION_TOOLS")
	    {
	        this.addShapeEditHelper();	

	        var actionPertform = this.shapeDrag.bind(this);       
	        var actionStop = this.shapeDragStop.bind(this);       
	        var actionStart = this.shapeDragStart.bind(this);	
	        console.log("Adding Text box drag event");
	        this.shape.swDrag(actionPertform, actionStart, actionStop);  
	        this.shape.attr('cursor', 'move');
	        //this.SWsvgCanvas.selectElement(this);
	        this.actionToPerforrm = "REMOVE_ACTION_TOOLS";			
	    }	
	}
	else if (this.shape.type == "polyline")
	{		
		cordinate = this.SWsvgCanvas.getMouseClickCoordinates();
		//console.log ("polyline double click " + cordinate.x);
		this.insertPoint(cordinate);	
	}
	else
	{
	    console.log("shape double click not doing any thing");
	}
}

SVGShape.prototype.addShapeEditHelper = function()
{
    if (this.shape.hasClass("SWInnerText"))
    {
        this.swAssociatedShape.addShapeEditHelper();
        return;
    }
    
    if (this.isCurvePath())
    {
        this.addShapeDrager();
        this.addCurveDecorator();
    }		
    else
    {	
        this.addShapeContainer();
        this.addShapeDrager();
        this.addShapeRotator();
        this.addActionDecorator();	

        if (this.shape.type  == "polyline" )
        {
            this.addPolyLineDecorator();	
        }
        else if (this.shape.type  == "rect")
        {
            this.addRectangleHelper();
        }
        else if (this.isArrow())
        {
            this.addArrowHelper();
        }	
        else if (this.isTable())
        {
            this.addTableHelper();
        }
    }	
}

SVGShape.prototype.removeShapeEditHelper = function(keepContainer)
{
    if (this.shape.hasClass("SWInnerText"))
    {
        this.swAssociatedShape.removeShapeEditHelper(keepContainer);
        return;
    }
    
	if (this.isCurvePath())
	{
		this.removeCurveDecorator();
		this.removeShapeDrager();
	}	
	else
	{	
		if (this.shape.type  == "polyline" )
		{
			this.removePolyLineDecorator();	
		}
		else if (this.shape.type  == "rect")
		{
			this.removeRectangleHelper();
		}
		else if (this.isArrow())
		{
			this.removeArrowHelper();
		}
		else if (this.isTable())
		{
			this.removeTableHelper()
		}
		
		this.removeActionDecorator();
		if (!keepContainer) this.removeShapeContainer();
		this.removeShapeRotator();
		this.removeShapeDrager();
	}
}

SVGShape.prototype.shapeOnClick = function()
{
	console.log("Shape: " +  this.shape.type +" clicked, actionToPerforrm to perform is: " + this.actionToPerforrm);		

	if (this.shape.type  == "g" && this.shape.hasClass("SWSVGForeignObj")) 
	{
		if (this.dragClick == true)
		{
			this.addShapeEditHelper();
			this.actionToPerforrm = "REMOVE_ACTION_TOOLS";	
			this.dragClick = false;
		}
		else if (this.actionToPerforrm == "REMOVE_ACTION_TOOLS")
		{
			this.actionToPerforrm = "ADD_ACTION_TOOLS";	
			this.removeShapeEditHelper();
			console.log("remove Text box drag event");
			this.shape.swUndrag();
			this.shape.attr('cursor', 'auto');					
		}
		
		if (!this.isSelected)
		{
			//console.log("Add Toolbar");
			//this.SWsvgCanvas.selectElement(this);
			this.isSelected = true;
		}

		return;    
	}
	
	console.log("shape clicked");
	
	if (this.actionToPerforrm == "REMOVE_ACTION_TOOLS")
	{	
		this.actionToPerforrm = "ADD_ACTION_TOOLS";			
		this.removeShapeEditHelper();
		this.isSelected = false;
	}
	else if (this.actionToPerforrm == "ADD_ACTION_TOOLS")
	{
		this.isSelected = true;
		this.actionToPerforrm = "REMOVE_ACTION_TOOLS";	
		this.addShapeEditHelper();	
	
	}
	
	return;	
}

SVGShape.prototype.shapeOnHover = function()
{
	console.log("mouse over the shape" + this.actionToPerforrm);
	
	if (!this.isSelected && this.SWsvgCanvas.isElementSelected() && this.SWsvgCanvas.isMousePressed())
	{
		return;
	}
	
	if (this.isForeignObject() && this.actionToPerforrm == "ADD_ACTION_TOOLS")
	{
		this.shape.attr('cursor', 'auto');  
	}
	else 
	{
		this.shape.attr('cursor', 'pointer');  
	}
}

SVGShape.prototype.shapeOnUnhover = function()
{
	if (!this.isSelected && this.SWsvgCanvas.isElementSelected() && this.SWsvgCanvas.isMousePressed())
	{
		return;
	}
	//console.log("mouse unhover shape");
	this.shape.attr('cursor', 'auto');
}


SVGShape.prototype.shapeOnKeyEvent = function(evt)
{	
	var handleTextChange = function(SWShape, evt)
	{
		if (SWShape.shape.type  == "g" && SWShape.shape.hasClass("SWSVGForeignObj")) 
		{
			var myTextMonitor = SWShape.textMonitor;
			console.log("text key down" + evt.type + ","+ myTextMonitor);//myTextMonitor.canRecord(evt));
			if (myTextMonitor.canRecord(evt))
			{
				var swRecord = myTextMonitor.getRecordInfo();
				if (swRecord)
				{
					SWShape.recordTextChange(swRecord);
				}
				//alert("time to record");
			}
			
		}
	}	
	
	if (evt.type == "keydown")
	{
		if (this.svgScrollBar) { this.svgScrollBar.scrollToCaret(); } 
		handleTextChange(this, evt);	
	}
	else if (evt.type == "keyup")
	{
		console.log("shape key up" + evt.type);
		
	}
}

SVGShape.prototype.addShapeDrager = function()
{
    this.removeShapeDrager();
    var bBox = this.shape.getBBox(1);
    var dragHelper = new SW_ShapeHelper(this.shape.parent());
    var shapeDaraggerTop = dragHelper.drawRectHelper(bBox.x, bBox.y-4, 
          bBox.w, 7, 0,0, HELPER_CATAGORY.MAIN_HELPER, SHAPE_HELPER.DRAG);
    var shapeDaraggerBottom = dragHelper.drawRectHelper(bBox.x, bBox.y+bBox.h-3, 
            bBox.w, 7, 0,0, HELPER_CATAGORY.MAIN_HELPER, SHAPE_HELPER.DRAG);
    this.shapeDaragger = this.shape.parent().group(shapeDaraggerTop, shapeDaraggerBottom);
    this.shapeDaragger.attr({ class: 'SWShapeHelper', transform: this.shape.transform().localMatrix.toTransformString() });

    var myDragStop = function()
    {
        this.shapeDragStop();
        this.addShapeEditHelper();
    }
    
    var dragMove = this.shapeDrag.bind(this);       
    var dragStart = this.shapeDragStart.bind(this);  
    var dragStop = myDragStop.bind(this);
     
     
   // console.log("Adding shape box drag event");
   shapeDaraggerTop.swDrag(dragMove, dragStart, dragStop);
   shapeDaraggerBottom.swDrag(dragMove, dragStart, dragStop);
 
}

SVGShape.prototype.removeShapeDrager = function()
{
    if(this.shapeDaragger)
    {
        this.shapeDaragger.remove();
        this.shapeDaragger = null;
    }
}


SVGShape.prototype.shapeDragStart = function() 
{
	if (this.SWsvgCanvas.isShapesDraggigDisabled())
	{
		return;
	}
	
	if (this.shape.hasClass("SWInnerText"))//not inner Text
	{
	    this.swAssociatedShape.startRecording();
        this.swAssociatedShape.shape.recordOnStop = false;
	}
	else
	{
	    this.startRecording();
	    this.shape.recordOnStop = false;
	}

	this.shape.data('origTransform', this.shape.transform().local);
	this.shape.ox = parseInt(this.shape.attr('x'));
	this.shape.oy = parseInt(this.shape.attr('y'));
	this.shape.ow = parseInt(this.shape.attr('width'));
	this.shape.oh = parseInt(this.shape.attr('height'));
	this.shape.fo  = this.shape.attr('fill-opacity');

	this.shape.attr('cursor', 'move');    	

	//console.log("SW shape action perform started.");
}

SVGShape.prototype.shapeDrag = function(dx,dy) 
{
	//console.log("SW shape action performing. action to perform : "  + this.actionToPerforrm);

	console.log("performing action");
	if (this.SWsvgCanvas.isShapesDraggigDisabled())
	{
		return;
	}
	
	if (this.shape.hasClass("SWInnerText"))//not inner Text
    {
	    this.swAssociatedShape.shape.recordOnStop = true;
    }
	else
	{
	    this.shape.recordOnStop = true;
	}

	this.dragClick = true;
	
	this.removeShapeEditHelper();	
		
	this.actionToPerforrm = "ADD_ACTION_TOOLS";	
	
	this.shape.attr({'fill-opacity': "0.3"});
	
	var isScalingEnabled=false;
	
	 //console.log("is innerText avilable111::" +this.innerText );
	if (!isScalingEnabled)
	{
		
	    var tdx, tdy;
        var snapInvMatrix = this.shape.transform().diffMatrix.invert();
        snapInvMatrix.e = snapInvMatrix.f = 0;
        tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
        this.shape.transform( "t" + [ tdx, tdy ] + this.shape.data('origTransform')  );
        
        //console.log("is innerText avilable::" +this.innerText );
        if (this.shape.hasClass("SWInnerText")) //this.shape.hasClass("SWInnerText")
        {
            this.swAssociatedShape.shape.transform( "t" + [ tdx, tdy ] + this.shape.data('origTransform')  );
        }
        
        //	console.log("SW shape draging");
		/*this.shape.attr({
			transform: this.shape.data('origTransform') + (this.shape.data('origTransform') ? "T" : "t") + [dx, dy]
		});*/
	}
	else
	{
		//"SCALE"
	
		var scale = 1 + dx / 50;
        	this.shape.attr({
              	  transform: this.shape.data('origTransform') + (this.shape.data('origTransform') ? "S" : "s") + scale,
               	 strokeWidth: this.myStrokeWidth,
        	});
	}
	
	this.resetInnerTextAttr();
	if (this.svgScrollBar) { this.svgScrollBar.reset();	}
	
	return;
}

SVGShape.prototype.shapeDragStop = function() 
{
	if (this.SWsvgCanvas.isShapesDraggigDisabled())
	{
		return;
	}

	//console.log("SW shape action to perform stopped." );
	this.shape.parent().attr('cursor', 'default'); 	
	this.shape.attr({'fill-opacity': this.shape.fo});

	if (this.shape.hasClass("SWInnerText"))
	{
	    this.swAssociatedShape.stopRecording(this.swAssociatedShape.shape.recordOnStop);
	    this.swAssociatedShape.shape.recordOnStop = false;
	}
	else
	{
	    this.stopRecording(this.shape.recordOnStop);
	    this.shape.recordOnStop = false;
	}
}

SVGShape.prototype.changeCursor = function(e, mouseX, mouseY) 
{
	// Don't change cursor during a drag operation


	// X,Y Coordinates relative to shape's orgin
	var relativeX = mouseX - $(this.shape.parent().node).offset().left - parseInt(this.shape.attr('x'));
	var relativeY = mouseY - $(this.shape.parent().node).offset().top - parseInt(this.shape.attr('y'));

	var shapeWidth = parseInt(this.shape.attr('width'));
	var shapeHeight = parseInt(this.shape.attr('height'));

	var resizeBorder = 10;

	// Change cursor
	if (relativeX < resizeBorder && relativeY < resizeBorder) { 
		this.shape.attr('cursor', 'nw-resize');
	} else if (relativeX > shapeWidth-resizeBorder && relativeY < resizeBorder) { 
		this.shape.attr('cursor', 'ne-resize');
	} else if (relativeX > shapeWidth-resizeBorder && relativeY > shapeHeight-resizeBorder) { 
		this.shape.attr('cursor', 'se-resize');
	} else if (relativeX < resizeBorder && relativeY > shapeHeight-resizeBorder) { 
		this.shape.attr('cursor', 'sw-resize');
	} else { 
		this.shape.attr('cursor', 'move');
	}
};


SVGShape.prototype.shapeResizeStart = function()
{
	this.startRecording();
	this.shape.recordOnStop = false;
	//console.log("SW shape rezie start1");
	this.removeShapeEditHelper(true /*keep shape container*/);
	
	this.shape.fo  = this.shape.attr('fill-opacity');
	this.shape.om = this.shape.transform().localMatrix;

	this.shape.parent().attr('cursor', 'move');
	
	this.shape.ocx = parseInt(this.shape.attr('cx'));
	this.shape.ocy = parseInt(this.shape.attr('cy'));
	//this.shape.or = parseInt(this.shape.attr('cy'));

	//this.shapeResizer.data('origTransform', this.shapeResizer.transform().local);
	
	console.log("aaaaa:"  + this.shape + "\n" + this.shapeContainerBox);
	this.shapeContainerBox.ox = parseInt(this.shapeContainerBox.attr('x'));
	this.shapeContainerBox.oy = parseInt(this.shapeContainerBox.attr('y'));
	this.shapeContainerBox.ow = parseInt(this.shapeContainerBox.attr('width'));
	this.shapeContainerBox.oh = parseInt(this.shapeContainerBox.attr('height'));
	
	if (!this.isForeignObject()) //Not needed for proccessing 
	{
		this.shape.myClone = this.shape.clone();
		this.shape.myClone.attr({'stroke-opacity': "0.0"});
		this.shape.myClone.attr({'fill-opacity': "0.0"});
		this.shape.myClone.addClass("SWShapeHelper");
	}
}


SVGShape.prototype.shapeResizeMoveTL = function(dx, dy, x, y, evt)
{
	this.shapeResizeMove(dx, dy, x, y, evt, "TL");
}

SVGShape.prototype.shapeResizeMoveTR = function(dx, dy, x, y, evt)
{
	this.shapeResizeMove(dx, dy, x, y, evt, "TR");
}

SVGShape.prototype.shapeResizeMoveBR = function(dx, dy, x, y, evt)
{
	this.shapeResizeMove(dx, dy, x, y, evt, "BR");
}

SVGShape.prototype.shapeResizeMoveBL = function(dx, dy, x, y, evt)
{
	this.shapeResizeMove(dx, dy, x, y, evt, "BL");
}

SVGShape.prototype.shapeResizeMove = function(dx, dy, x, y, evt, resizerType)
{	
	this.shape.recordOnStop = true;
	this.shape.attr({'fill-opacity': "0.3"});
	
	var resizerXY = this.SWsvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, this.shapeContainerBox);

	//console.log("ResizerXY" + ""+);
	
	var containerCordNewX1;
	var containerCordNewY1;
	var containerCordNewX2;
	var containerCordNewY2;
	var containerCordNewWidth;
	var containerCordNewHeight;
	var containerCordNewCX;
	var containerCordNewCY;
	var deltaX;
	var deltaY;

	if (resizerType == "BL")
	{
	//	alert("called BL")
		deltaX = resizerXY.x - this.shapeContainerBox.ox; 
		deltaY = resizerXY.y-(this.shapeContainerBox.oy+this.shapeContainerBox.oh);

		containerCordNewWidth = Math.max(this.shapeContainerBox.ow-deltaX, 1);		   
		containerCordNewHeight = Math.max(resizerXY.y - this.shapeContainerBox.node.y.animVal.value, 1);

		containerCordNewX1 = containerCordNewWidth == 1 ? parseInt(this.shapeContainerBox.attr('x')) : resizerXY.x;
		containerCordNewY1 = parseInt(this.shapeContainerBox.attr('y'));	
		containerCordNewX2 = resizerXY.x+containerCordNewWidth;
		containerCordNewY2 = resizerXY.y;		
		containerCordNewCX = resizerXY.x+containerCordNewWidth/2;
		containerCordNewCY = resizerXY.y-containerCordNewHeight/2;
		
	//	return;
	}
	else if (resizerType == "TR")
	{
		
		deltaX = resizerXY.x-(this.shapeContainerBox.ox+this.shapeContainerBox.ow);
		deltaY = resizerXY.y-this.shapeContainerBox.oy;
		
		containerCordNewWidth = Math.max(resizerXY.x - this.shapeContainerBox.node.x.animVal.value, 1);
		containerCordNewHeight = Math.max(this.shapeContainerBox.oh-deltaY, 1);
		
		containerCordNewX1 = parseInt(this.shapeContainerBox.attr('x'));		
		containerCordNewY1 = containerCordNewHeight == 1 ? parseInt(this.shapeContainerBox.attr('y')) : resizerXY.y;	
		containerCordNewX2 = resizerXY.x;
		containerCordNewY2 = resizerXY.y+containerCordNewHeight;
		containerCordNewCX = resizerXY.x-containerCordNewWidth/2;
		containerCordNewCY = resizerXY.y+containerCordNewHeight/2;
	}
	else if (resizerType == "TL")
	{
		deltaX = resizerXY.x-this.shapeContainerBox.ox;
		deltaY = resizerXY.y-this.shapeContainerBox.oy;

		console.log("orignal width height:" + this.shapeContainerBox.ow + ","+this.shapeContainerBox.oh );
		containerCordNewWidth = Math.max(this.shapeContainerBox.ow-deltaX, 1);		   
		containerCordNewHeight = Math.max(this.shapeContainerBox.oh-deltaY, 1);

		containerCordNewX1 = containerCordNewWidth == 1 ? parseInt(this.shapeContainerBox.attr('x')) : resizerXY.x;
		containerCordNewY1 = containerCordNewHeight == 1 ? parseInt(this.shapeContainerBox.attr('y')) : resizerXY.y;	
		containerCordNewX2 = resizerXY.x+containerCordNewWidth;
		containerCordNewY2 = resizerXY.y+containerCordNewHeight;
		containerCordNewCX = resizerXY.x+containerCordNewWidth/2;
		containerCordNewCY = resizerXY.y+containerCordNewHeight/2;

	}
	else if (resizerType == "BR")
	{
		deltaX = resizerXY.x-(this.shapeContainerBox.ox+this.shapeContainerBox.ow);
		deltaY = resizerXY.y-(this.shapeContainerBox.oy+this.shapeContainerBox.oh);

		containerCordNewWidth = Math.max(resizerXY.x - this.shapeContainerBox.node.x.animVal.value, 1);
		containerCordNewHeight = Math.max(resizerXY.y - this.shapeContainerBox.node.y.animVal.value, 1);

		containerCordNewX1 = parseInt(this.shapeContainerBox.attr('x'));		
		containerCordNewY1 = parseInt(this.shapeContainerBox.attr('y'));	
		containerCordNewX2 = resizerXY.x;
		containerCordNewY2 = resizerXY.y;
		containerCordNewCX = resizerXY.x-containerCordNewWidth/2;
		containerCordNewCY = resizerXY.y-containerCordNewHeight/2;
		
		/*this.shapeResizer.attr({ 
			cx: resizerXY.x,
			cy: resizerXY.y
		}); */
	}

	this.shapeContainerBox.attr({
		x: containerCordNewX1,
		y: containerCordNewY1,
		width: containerCordNewWidth,
		height: containerCordNewHeight
	});

	//alert("resize");
	console.log("Resizng shape of type " + this.shape.type);

	if (this.isForeignObject())
	{
		var element =  this.shape.node.getElementsByTagName("foreignObject")[0];

		//console.log("orignal elsement is:" +element.outerHTML);

		element.setAttribute("x", Math.round(containerCordNewX1));
		element.setAttribute("y", Math.round(containerCordNewY1));
		element.setAttribute("width", Math.round(containerCordNewWidth));
		element.setAttribute("height", Math.round(containerCordNewHeight));

		//if table width is no changed set elemt width to same
		if (this.isTable())
		{
		    var myTable = this.getEditableTextElement().firstChild;
		    var borderWidth =($(myTable).outerWidth() - $(myTable).width()) / 2;
		    var tableWidth = $(myTable).width();
		    element.setAttribute("width", tableWidth+borderWidth*2);
		}
        
		//	console.log("modified elsement is:" +element.outerHTML);
		var mysize = this.getForeignObjectSize();
		
		console.log("modified element height to set: " + Math.round(containerCordNewHeight) + "heightSet: " + mysize.height);
		
		containerCordNewHeight = mysize.height; 
		containerCordNewWidth = mysize.width; 
		
		element.setAttribute("width", containerCordNewWidth);
		element.setAttribute("height",  containerCordNewHeight);
		  //table parent div height
        var edElem = this.getEditableTextElement();
        edElem.setAttribute("height",  containerCordNewHeight);
        
		
		this.shape.attr({
			x: containerCordNewX1,
			y: containerCordNewY1,
			width: containerCordNewWidth,
			height: containerCordNewHeight
		});	
		
	  
		this.shapeContainerBox.attr({
			x: containerCordNewX1,
			y: containerCordNewY1,
			width: containerCordNewWidth,
			height: containerCordNewHeight
		});
	}
	else if (this.shape.type == "ellipse")
	{	
		var cntrX = (containerCordNewWidth == 1) ?  parseInt(this.shape.attr('cx')) : containerCordNewCX;
		var cntrY = (containerCordNewHeight == 1) ?  parseInt(this.shape.attr('cy')): containerCordNewCY;

		this.shape.attr({
			cx: cntrX,
			cy: cntrY,
			rx: Math.max(containerCordNewWidth/2,1),
			ry: Math.max(containerCordNewHeight/2,1) 
		});	
	}	
	else if (this.shape.type == "path")
	{
		var origSegments = this.shape.myClone.node.getPathData();		
		var segments = this.shape.node.getPathData();	
		
		var shapeOrigX=this.shapeContainerBox.ox + this.adjustFactor;
		var shapeOrigY=this.shapeContainerBox.oy + this.adjustFactor;
		var shapeOrigW=this.shapeContainerBox.ow -(2*this.adjustFactor);
		var shapeOrigH=this.shapeContainerBox.oh -(2*this.adjustFactor);
		
		var shapeOrigPosition = {x: shapeOrigX, y: shapeOrigY , w: shapeOrigW, h: shapeOrigH }; 
		var delta = {x : deltaX, y : deltaY };
	/*	var d1 = 
			"M"+arrowPath.topLine.X1+" "+arrowPath.topLine.Y1+","+arrowPath.topLine.X2+","+arrowPath.topLine.Y2+" " +
			"L" + arrowPath.head1.HTX+","+arrowPath.head1.HTY+" L"+arrowPath.head1.HMX+","+arrowPath.head1.HMY + " L"+arrowPath.head1.HBX+","+arrowPath.head1.HBY + " " + 
		    "L" + arrowPath.bottomLine.X2+","+arrowPath.bottomLine.Y2+" L"+arrowPath.bottomLine.X1+","+arrowPath.bottomLine.Y1 + "Z";*/
		
		var d1 =  "";
		for (var counter=0; counter<segments.length; counter++)
		{
			var seg = segments[counter];
			var origSeg = origSegments[counter];
			
			if (seg.type === "M" || seg.type === "m") 
			{
				
				//TL
				var origPoint = {x : origSeg.values[0], y : origSeg.values[1] };			
				var ptNewPosition = this.getNewPointPosition(shapeOrigPosition, origPoint, resizerType, delta);
				
				d1 += seg.type+ptNewPosition.x+" "+ptNewPosition.y;

			}
			else if (seg.type === "L" || seg.type === "l") 
			{
				var origPoint = {x : origSeg.values[0], y : origSeg.values[1] };	
				var ptNewPosition = this.getNewPointPosition(shapeOrigPosition, origPoint, resizerType, delta);
				
				d1 += seg.type+ptNewPosition.x+" "+ptNewPosition.y;
			}
			else if (seg.type === "C" || seg.type === "c")
			{
				d1 += seg.type;
				var curvePath = new Object;
				
				var origPoint = {x : origSeg.values[0], y : origSeg.values[1] };	
				var ptNewPosition = this.getNewPointPosition(shapeOrigPosition, origPoint, resizerType, delta);							
				curvePath.crX1 = ptNewPosition.x;
				curvePath.crY1 = ptNewPosition.y;
				
				origPoint = {x : origSeg.values[2], y : origSeg.values[3] };	
				ptNewPosition = this.getNewPointPosition(shapeOrigPosition, origPoint, resizerType, delta);			
				curvePath.crX2 = ptNewPosition.x;
				curvePath.crY2 = ptNewPosition.y;
				
				origPoint = {x : origSeg.values[4], y : origSeg.values[5] };	
				ptNewPosition = this.getNewPointPosition(shapeOrigPosition, origPoint, resizerType, delta);			
				curvePath.ceX = ptNewPosition.x;
				curvePath.ceY = ptNewPosition.y;	
				
				d1 += curvePath.crX1+","+curvePath.crY1 +" "+
					(curvePath.crX2 ? curvePath.crX2+","+curvePath.crY2+" " : "") +
					curvePath.ceX+","+curvePath.ceY + " " ;

			}
			else if (seg.type === "Z" || seg.type === "z")
			{
				d1 += seg.type;
			}
			else 
			{
				console.log("ignoring for now path resize type : [" + seg.type + "]" );
			}
		}
		
		console.log("New  Path d: " + d1);
		
		this.shape.attr({
			d: d1,
		});
		
		var bBox = this.shape.getBBox(1);
		this.shapeContainerBox.attr({
			x: bBox.x,
			y: bBox.y,
			width: bBox.width,
			height:bBox.height
		});
	}
	else if (this.shape.type == "line")
	{    	   
		/*this.shape.attr({
			x2: resizerXY.x,
			y2: resizerXY.y
		});*/

		if (resizerType == "TL")
		{
			this.shape.attr({
				x1: resizerXY.x,
				y1: resizerXY.y,
			});
		}
		else
		{
			this.shape.attr({
				x2: containerCordNewX2,
				y2: containerCordNewY2,
			});			
		}

		var bBox = this.shape.getBBox(1);
		this.shapeContainerBox.attr({
			x: Math.min(this.shape.attr('x1'), this.shape.attr('x2')),
			y: Math.min(this.shape.attr('y1'), this.shape.attr('y2')),
			width: bBox.width,
			height:bBox.height
		});

	}
	else if (this.shape.type == "polyline" )
	{

		var points = this.shape.node.points;
		var origPoints = this.shape.myClone.node.points;

		var shapeOrigX=this.shapeContainerBox.ox + this.adjustFactor;
		var shapeOrigY=this.shapeContainerBox.oy + this.adjustFactor;
		var shapeOrigW=this.shapeContainerBox.ow -(2*this.adjustFactor);
		var shapeOrigH=this.shapeContainerBox.oh -(2*this.adjustFactor);

		var shapeOrigPosition = {x: shapeOrigX, y: shapeOrigY , w: shapeOrigW, h: shapeOrigH }; 
		var delta = {x : deltaX, y : deltaY };
		
		for (var i = 0; i < points.numberOfItems; i++)
		{

			var point = points.getItem(i);
			var origPoint = origPoints.getItem(i);				
			var ptNewPosition = this.getNewPointPosition(shapeOrigPosition, origPoint, resizerType, delta);
			point.x= ptNewPosition.x;
			point.y= ptNewPosition.y;
			
			var bBox = this.shape.getBBox(1);
			this.shapeContainerBox.attr({
				x: bBox.x,
				y: bBox.y,
				width: bBox.width,
				height:bBox.height
			});
		} 
	}	
	else if (this.shape.type == "rect" )
	{
		var myclone = this.shape.myClone;
		var rectAttrib = { x: parseFloat(myclone.attr('x')), y: parseFloat(myclone.attr('y')), w: parseFloat(myclone.attr('width')),
			       h: parseFloat(myclone.attr('height')), rx: parseFloat(myclone.attr('rx')), ry: parseFloat(myclone.attr('ry')) };
		
		var newRx = containerCordNewWidth * rectAttrib.rx / rectAttrib.w;
		var newRy = containerCordNewHeight * rectAttrib.ry / rectAttrib.h;		
		var newR = parseInt(Math.min(newRx, newRy));        
        if(isNaN(newR)) { newR=0; }
        
		this.shape.attr({
			x: containerCordNewX1,
			y: containerCordNewY1,
			width: containerCordNewWidth,
			height: containerCordNewHeight,  
			rx: newR,
			ry: newR
		});	
	}
	else
	{
		this.shape.attr({
			x: containerCordNewX1,
			y: containerCordNewY1,
			width: containerCordNewWidth,
			height: containerCordNewHeight,    			
		});	
	}
	
	//console.log("Resting scrollBar1");
	this.resetInnerTextAttr();
	if (this.svgScrollBar) { this.svgScrollBar.reset(); }
}

SVGShape.prototype.shapeResizeStop = function()
{
	//console.log("SW shape resize stop");
	this.shape.attr({'fill-opacity': this.shape.fo});	
	this.shape.parent().attr('cursor', 'default');
	//this.resetTableAttr(false);//no add mode
	
	this.removeShapeContainer(); // shep contaer bor not removed	
	this.addShapeEditHelper();

	if (this.shape.myClone) this.shape.myClone.remove();
	
	this.stopRecording(this.shape.recordOnStop);
	this.shape.recordOnStop = false;
}


SVGShape.prototype.curveBResizeStart = function()
{
	//console.log("SW curve bezier resize stop");
	//this.removeCurveDecorator();
	this.shape.fo = this.shape.attr('fill-opacity');
	
	/*var curvePath = this.shape.parseCurvePath();
	this.shape.ocrX1 = curvePath.crX1;
	this.shape.ocrY1 = curvePath.crY1;
	this.shape.ocrX2 = curvePath.crX2;
	this.shape.ocrY2 = curvePath.crY2;*/

	this.shape.origCurvePath = this.shape.parseCurvePath();
	this.removeShapeEditHelper();
	this.startRecording();
	this.shape.recordOnStop = false;
}

SVGShape.prototype.curveBResizeStop = function()
{
	//console.log("SW curve bezier resize stop, opacity : " + this.shape.fo);
	this.shape.attr({'fill-opacity': this.shape.fo});		
	this.addShapeEditHelper();
	this.stopRecording(this.shape.recordOnStop);
	this.shape.recordOnStop = false;

}

SVGShape.prototype.curveBResizeMoveCS = function(dx, dy, x, y, evt) //CS "CURVE START"
{
	this.curveBResizeMove(dx, dy, x, y, evt, "CS");
}

SVGShape.prototype.curveBResizeMoveCE = function(dx, dy, x, y, evt) //CE "CURVE END"
{
	this.curveBResizeMove(dx, dy, x, y, evt, "CE");
}

SVGShape.prototype.curveBResizeMoveCR1 = function(dx, dy, x, y, evt) //CS "CURVE Rotator1"
{
	this.curveBResizeMove(dx, dy, x, y, evt, "CR1");
}

SVGShape.prototype.curveBResizeMoveCR2 = function(dx, dy, x, y, evt) //CE "CURVE Rotator2"
{
	this.curveBResizeMove(dx, dy, x, y, evt, "CR2");
}

SVGShape.prototype.curveBResizeMoveMidCR = function(dx, dy, x, y, evt) //CE "CURVE middle Rotator"
{
	this.curveBResizeMove(dx, dy, x, y, evt, "MCR");
}

SVGShape.prototype.curveBDClick = function(evt) //CE "CURVE Closer 
{
	var curvePath = this.shape.parseCurvePath();
	curvePath.Z  = (curvePath.Z == "Z" ||  curvePath.Z == "z") ? "" : "Z";
	this.resetCurvePathCord(curvePath);
}

SVGShape.prototype.curveBResizeMove = function(dx, dy, x, y, evt, type)
{
	//console.log("SW curve bezier resize Move");	
	this.shape.recordOnStop = true;

	//this.shape.attr({'fill-opacity': "0.3"});
	
	var resizerXY = this.SWsvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, this.shape);
	var curvePath = this.shape.parseCurvePath();

	resizerXY.x = Math.round(parseInt(resizerXY.x));
	resizerXY.y = Math.round(parseInt(resizerXY.y));

	if (type == "CS")
	{
		curvePath.csX = resizerXY.x;
		curvePath.csY = resizerXY.y;
	}	
	else if (type == "CE")
	{
		curvePath.ceX = resizerXY.x;
		curvePath.ceY = resizerXY.y;		
	}
	else if (type == "MCR")
	{
		if (curvePath.type == "C" ||  curvePath.type == "c" )
		{
			curvePath.crX1 = this.shape.origCurvePath.crX1+dx;
			curvePath.crY1 = this.shape.origCurvePath.crY1+dy;
			curvePath.crX2 = this.shape.origCurvePath.crX2+dx;
			curvePath.crY2 = this.shape.origCurvePath.crY2+dy;
		}
		else if (curvePath.type == "A" ||  curvePath.type == "a" )
		{
			var newRadY = this.shape.origCurvePath.arY-dy/3.14;
			console.log("arc new redius y " + newRadY + " last redius" + curvePath.arY);			
			curvePath.arY = newRadY > 1 ? newRadY : curvePath.arY;

			var newRadX = this.shape.origCurvePath.arX+dx/3.14;
			console.log("arc new redius x " + newRadX + " last redius" + curvePath.arX);			
			curvePath.arX = newRadX > 1 ?  newRadX : curvePath.arX;
		}
	}
	else if (type == "CR1")
	{
		if (curvePath.type == "C" ||  curvePath.type == "c" )
		{	
			curvePath.crX1 = this.shape.origCurvePath.crX1+dx;
			curvePath.crY1 = this.shape.origCurvePath.crY1+dy;
		}
		else if (curvePath.type == "A" ||  curvePath.type == "a" )
		{
			
			var newRadY = this.shape.origCurvePath.arY-dy/3.14;
			console.log("arc new redius y " + newRadY + " last redius" + curvePath.arY);			
			curvePath.arY = newRadY > 1 ? newRadY : curvePath.arY;
		}
	}	
	else if (type == "CR2")
	{
		if (curvePath.type == "C" ||  curvePath.type == "c" )
		{
			curvePath.crX2 = this.shape.origCurvePath.crX2+dx;
			curvePath.crY2 = this.shape.origCurvePath.crY2+dy;
		}
		else if (curvePath.type == "A" ||  curvePath.type == "a" )
		{
			var newRadX = this.shape.origCurvePath.arX+dx/3.14;
			console.log("arc new redius x " + newRadX + " last redius" + curvePath.arX);			
			curvePath.arX = newRadX > 1 ?  newRadX : curvePath.arX;
		}
	}
	else if (type == "CC")
	{	

		curvePath.Z  = (curvePath.Z == "Z" ||  curvePath.Z == "z") ? "" : "Z";
	}	

	this.resetCurvePathCord(curvePath);
	this.resetInnerTextAttr();
	//this.removeCurveDecorator();
	//this.addCurveDecorator();
	//console.log("d="+d1);
}

SVGShape.prototype.resetArrowPathCord = function (arrowPath, rotation)
{
	var aPath = arrowPath.getArrowPathStr();
   // { dString: d1, rAngle: this.rotation.angle, rOriginX: this.rotation.originX , rOriginY: this.rotation.originY }; 
	
	if (aPath && aPath.dString)
	{
		this.shape.attr({ d: aPath.dString,	});
		
		if (rotation && rotation.angle != null)
		{ 
			this.shape.rotate(rotation.angle, rotation.originX, rotation.originY);
		}
	}
	else
	{
	    console.log("aPath.dString is null");
	}
}

SVGShape.prototype.resetCurvePathCord = function (curvePath)
{

	if (curvePath.type == "C" ||  curvePath.type == "c" )
	{		
			/*console.log("new Curve path: " + curvePath.csX + ", "+ curvePath.csY +", "+ curvePath.crX1 +", "
			+  curvePath.crY1+", "+ curvePath.crX2 +", "+ curvePath.crY2 +", "+
			curvePath.ceX+", "+ curvePath.ceY);*/
		
		//console.log("Editing cubi5f..2m ed
		if (curvePath.csX === undefined || curvePath.csY === undefined ||
				curvePath.crX1 === undefined || curvePath.crY1 === undefined || 
				curvePath.crX2 === undefined || curvePath.crY2 === undefined ||
				curvePath.ceX === undefined  || curvePath.ceY === undefined)
		{
			console.log("Error: Not setting cubic curve path");
		}
		else
		{

			var d1 = 
				"M"+curvePath.csX+","+curvePath.csY+" "+curvePath.type+
				curvePath.crX1+","+curvePath.crY1+" "+
				(curvePath.crX2 ? curvePath.crX2+","+curvePath.crY2+" " : "")+
				curvePath.ceX+","+curvePath.ceY + " " + curvePath.Z;

			this.shape.attr({
				d: d1,
			});
		}
	}
	else if (curvePath.type == "A" ||  curvePath.type == "a" )
	{
			
		var d1 = 
			"M"+curvePath.csX+","+curvePath.csY+" "+curvePath.type+
			curvePath.arX+","+curvePath.arY+" "+curvePath.axR+" "+ curvePath.alf + " "+ curvePath.asf +" "+
			curvePath.ceX+","+curvePath.ceY;
		
		this.shape.attr({
			d: d1,
		});
	}
	else
	{
			console.log("Error: Not setting path" + curvePath.type);
	}
	
}

SVGShape.prototype.parseArrowPath = function ()
{
   // console.log("parsing  arrow path");
	if (this.shape.type != "path")
	{
		return null;
	}
	
	var arrowPath = null;
	var segments = this.shape.node.getPathData();
 
	// console.log("parsing  arrow path111");
	if (segments[1].type == "C" || segments[1].type == "c")
	{
	   // console.log("parsing  arrow pat222:" + segments.length);
	    
		var singleHeadArrowSegLen = 8;
		var doubleHeadArrowSegLen = 11;
		
		if (singleHeadArrowSegLen != segments.length && doubleHeadArrowSegLen != segments.length)
		{
			//not arrow
		    //alert("seg length = : "+ segments.length);
			return null;
		}
		
		arrowPath = new ARROW_PATH(ARROW_TYPE.CURVE_ARROW);	
		//console.log("parseArrowPath : Curve Arrow detected. Not implemented yet..");
				
		//Head1
		var seg = segments[0];			
		arrowPath.curve2.csX = seg.values[0];
		arrowPath.curve2.csY = seg.values[1];			

		seg = segments[1];
		arrowPath.curve2.type=seg.type;
		arrowPath.curve2.crX1 = seg.values[0];
		arrowPath.curve2.crY1 = seg.values[1];
		arrowPath.curve2.crX2 = seg.values[2];
		arrowPath.curve2.crY2 = seg.values[3];
		arrowPath.curve2.ceX = seg.values[4];
		arrowPath.curve2.ceY = seg.values[5];
		
		seg = segments[2];			
		arrowPath.head1.HTX = seg.values[0];
		arrowPath.head1.HTY = seg.values[1];			

		seg = segments[3];
		arrowPath.head1.HMX = seg.values[0];
		arrowPath.head1.HMY = seg.values[1];	

		seg = segments[4];
		arrowPath.head1.HBX = seg.values[0];
		arrowPath.head1.HBY = seg.values[1];
		
		seg = segments[5]; 
		arrowPath.curve.csX = seg.values[0];
		arrowPath.curve.csY = seg.values[1];	
		
		seg = segments[6];
		
		if (seg.type != "C" && seg.type != "c")
		{
			console.log("parseArrowPath : Expectec curve, but found ["+ seg.type+"]");
			return null; //expected cureve start here but not so issue
		}
		
		arrowPath.curve.type=seg.type;
		arrowPath.curve.crX1 = seg.values[0];
		arrowPath.curve.crY1 = seg.values[1];
		arrowPath.curve.crX2 = seg.values[2];
		arrowPath.curve.crY2 = seg.values[3];
		arrowPath.curve.ceX = seg.values[4];
		arrowPath.curve.ceY = seg.values[5];	

		
		if (segments.length == 8)
		{
			console.log("One side curve arrow");
			seg = segments[7]; 
			arrowPath.Z = seg.type;
			
			//head1 is populated so get direction
			switch (arrowPath.getHeadDirection("HEAD1"))
			{
				case ARROW_HEAD_DIRECTION.TOWARDS_TOP:
					arrowPath.arrowHeadSide = ARROW_HEAD_TYPE.TOP_HEAD;
					break;
				case ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM:
					arrowPath.arrowHeadSide = ARROW_HEAD_TYPE.DOWN_HEAD;
					break;
				case ARROW_HEAD_DIRECTION.TOWARDS_LEFT:
					arrowPath.arrowHeadSide = ARROW_HEAD_TYPE.LEFT_HEAD;
					break;
				case  ARROW_HEAD_DIRECTION.TOWARDS_RIGHT:
					arrowPath.arrowHeadSide = ARROW_HEAD_TYPE.RIGHT_HEAD;
					break;
			}
			return arrowPath;
		}
		
		seg = segments[7];  //curve arrow curve is always cubic curve
		arrowPath.head2.HTX = seg.values[0];
		arrowPath.head2.HTY = seg.values[1];

		//console.log("parseArrowPath : 7 HTX found: ["+seg.type+"], " + arrowPath.head2.HTX +","+ arrowPath.head2.HTY  ); 
		
		seg = segments[8];  //curve arrow curve is always cubic curve
		arrowPath.head2.HMX = seg.values[0];
		arrowPath.head2.HMY = seg.values[1];
		
		//console.log("parseArrowPath : 8 HMX found: ["+seg.type+"], " + arrowPath.head2.HMX +","+ arrowPath.head2.HMY  ); 
		
		seg = segments[9];  //curve arrow curve is always cubic curve
		arrowPath.head2.HBX= seg.values[0];
		arrowPath.head2.HBY = seg.values[1];
		
		//console.log("parseArrowPath : 8 HBX found: ["+seg.type+"], " + arrowPath.head2.HBX +","+ arrowPath.head2.HBY  ); 
		
		seg = segments[10]; 
		arrowPath.Z = seg.type;
		  
		//console.log("parsing Curve Arrow path4");
		
		if (arrowPath.getHeadDirection("HEAD1") == ARROW_HEAD_DIRECTION.TOWARDS_TOP ||
				arrowPath.getHeadDirection("HEAD1") == ARROW_HEAD_DIRECTION.TOWARDS_BOTTOM)
		{
			arrowPath.arrowHeadSide = ARROW_HEAD_TYPE.TOP_DOWN_HEAD;
		}
		else
		{
			arrowPath.arrowHeadSide = ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD;
		}
		
		console.log("Detected curve arrow");

		return arrowPath;
	}
	else 
	{
		arrowPath = new ARROW_PATH(ARROW_TYPE.LINE_ARROW);	

		var singleHeadArrowSegLen = 8;
		var doubleHeadArrowSegLen = 11;

		if (singleHeadArrowSegLen != segments.length && doubleHeadArrowSegLen != segments.length)
		{
			//not arrow
			return null;
		}

		var seg = segments[0];			
		arrowPath.topLine.X1 = seg.values[0];
		arrowPath.topLine.Y1 = seg.values[1];			

		var seg = segments[1];	
		arrowPath.topLine.X2 = seg.values[0];
		arrowPath.topLine.Y2 = seg.values[1];

		var seg = segments[2];	
		arrowPath.head1.HTX = seg.values[0];
		arrowPath.head1.HTY = seg.values[1];

		var seg = segments[3];	
		arrowPath.head1.HMX = seg.values[0];
		arrowPath.head1.HMY = seg.values[1];

		var seg = segments[4];	
		arrowPath.head1.HBX = seg.values[0];
		arrowPath.head1.HBY = seg.values[1];

		var seg = segments[5];	
		arrowPath.bottomLine.X2 = seg.values[0];
		arrowPath.bottomLine.Y2 = seg.values[1];

		var seg = segments[6];	
		arrowPath.bottomLine.X1 = seg.values[0];
		arrowPath.bottomLine.Y1 = seg.values[1];

		var seg = segments[7];	

		//read enough Info to decide if arrow or not
		if (arrowPath.topLine.Y2 != arrowPath.topLine.Y1 || arrowPath.bottomLine.Y2 != arrowPath.bottomLine.Y1 ||
				arrowPath.topLine.X1 != arrowPath.bottomLine.X1 || arrowPath.topLine.X2 != arrowPath.bottomLine.X2)
		{
			return null;
		}

		if (seg.type == "Z" || seg.type == "z")
		{
			//One directioal arrow
			arrowPath.Z = seg.type;
			
            
			arrowPath.arrowHeadSide = arrowPath.getHeadDirection() == ARROW_HEAD_DIRECTION.TOWARDS_LEFT 
			                                      ? ARROW_HEAD_TYPE.LEFT_HEAD: ARROW_HEAD_TYPE.RIGHT_HEAD;

			arrowPath.head2.HTX = null;
			arrowPath.head2.HTY = null;
			arrowPath.head2.HMX = null;
			arrowPath.head2.HMY = null; 
			arrowPath.head2.HBX = null;
			arrowPath.head2.HBY = null;
			return arrowPath;
		}
		else
		{
			arrowPath.head2.HBX = seg.values[0];
			arrowPath.head2.HBY = seg.values[1];
		}

		var seg = segments[8];
		arrowPath.head2.HMX = seg.values[0]; 
		arrowPath.head2.HMY = seg.values[1];

		var seg = segments[9];
		arrowPath.head2.HTX = seg.values[0]; 
		arrowPath.head2.HTY = seg.values[1];

		var seg = segments[10];
		arrowPath.Z = seg.type;

		arrowPath.arrowHeadSide = ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD;

		return arrowPath;
	}

}

SVGShape.prototype.setShapeType = function ()
{
	
	this.shapeType = this.shape.type; //can be basic shape	
		
	//Extended shape
	
	var curvePath = this.shape.parseCurvePath()
	
	if (curvePath.type == "A" || curvePath.type == "a")
	{
		this.shapeType = "arcCurve";

	}
	else if (curvePath.type == "C" || curvePath.type == "c")
	{
		this.shapeType = "cubicCurve";
	}
	else
	{
		var arrowPath = this.parseArrowPath();
		
		if (arrowPath && arrowPath.arrowType == ARROW_TYPE.LINE_ARROW)
		{
			this.shapeType = "lineArrow";
		}
		else if (arrowPath && arrowPath.arrowType == ARROW_TYPE.CURVE_ARROW)
		{
			this.shapeType = "curveArrow";
		}
	}
		
	return this.shapeType;
}

SVGShape.prototype.isCurvePath = function ()
{

	if (this.shapeType == "arcCurve" || this.shapeType == "cubicCurve")
	{
		return true;
	}
	
	return false;
}

SVGShape.prototype.isArrow = function ()
{
	if (this.shapeType == "lineArrow"  || this.shapeType == "curveArrow")	
	{
		return true;
	}
	
	return false;
}

SVGShape.prototype.isTable = function ()
{
	if (this.isForeignObject())
	{
		
		var editableElem = this.getEditableElement();
		if(editableElem.firstChild &&  editableElem.firstChild.tagName && editableElem.firstChild.tagName.toLowerCase() == "table")
		{
			return true;
		}
	}
	
	return false;
}

SVGShape.prototype.calculateAdjustFactor = function()
{

	if (this.shape.type  == "polyline" && this.shape.node.points.numberOfItems != 2)
	{
		//alert("items"+this.shape.node.points.numberOfItems);
		this.adjustFactor = 10;
		return this.adjustFactor;
	}
	else if(this.isArrow())
	{
		this.adjustFactor = 10;
		return this.adjustFactor;
	}

	this.adjustFactor = 0;
	return this.adjustFactor;
}

SVGShape.prototype.isShapeRotatorRequired = function()
{
	
	if (/*this.isArrow() || */this.isCurvePath())
	{
		return false;
	}
	
	return true;
	
}

SVGShape.prototype.getNewPointPosition = function(orignalPosition, origPoint, resizerType, delta)
{
	
	var ptNewPosition= new Object;

	if (resizerType == "TL")
	{
		var ptDistFromEnd = new Object;
		ptDistFromEnd.X=(orignalPosition.x+orignalPosition.w)-origPoint.x;
		ptDistFromEnd.Y=(orignalPosition.y+orignalPosition.h)-origPoint.y;
		ptNewPosition.x = origPoint.x+(ptDistFromEnd.X*delta.x)/orignalPosition.w;
		ptNewPosition.y = origPoint.y+(ptDistFromEnd.Y*delta.y)/orignalPosition.h;


		//console.log("shape start :X:" +  shapeOrigX + ",Y " + shapeOrigY);
		//console.log("point dist from shape end[" + i + "] X: " + ptDistFromEnd.X + " Y:" + ptDistFromEnd.Y);

	}
	else if (resizerType == "BR")
	{
		var ptDistFromStart = new Object;
		ptDistFromStart.X=origPoint.x-orignalPosition.x;
		ptDistFromStart.Y=origPoint.y-orignalPosition.y;
		ptNewPosition.x = origPoint.x+(ptDistFromStart.X*delta.x)/orignalPosition.w;
		ptNewPosition.y = origPoint.y+(ptDistFromStart.Y*delta.y)/orignalPosition.h;
		
		//console.log("shape start :X:" +  shapeOrigX + ",Y " + shapeOrigY);
		//console.log("point dist from shape start[" + i + "] X: " + ptDistFromStart.X + " Y:" + ptDistFromStart.Y);

	}
	else if (resizerType == "BL")
	{
		var ptDistFromEnd = new Object;
		ptDistFromEnd.X=(orignalPosition.x+orignalPosition.w)-origPoint.x;
		ptDistFromEnd.Y= origPoint.y-orignalPosition.y;		
		ptNewPosition.x = origPoint.x+(ptDistFromEnd.X*delta.x)/orignalPosition.w;
		ptNewPosition.y = origPoint.y+(ptDistFromEnd.Y*delta.y)/orignalPosition.h;
	
		//console.log(" dx, dy" + deltaX +"," + deltaY);
	}
	else if (resizerType == "TR") 
	{	
		var ptDistFromStart = new Object;
		ptDistFromStart.X=origPoint.x-orignalPosition.x;
		ptDistFromStart.Y=(orignalPosition.y+orignalPosition.h)-origPoint.y;
		ptNewPosition.x = origPoint.x+(ptDistFromStart.X*delta.x)/orignalPosition.w;
		ptNewPosition.y = origPoint.y+(ptDistFromStart.Y*delta.y)/orignalPosition.h;
	}
	else
	{
		console.log("getNewPointPosition: resizerType Invaid : " + resizerType);
		ptNewPosition = null;
	}
	
	return ptNewPosition;
}