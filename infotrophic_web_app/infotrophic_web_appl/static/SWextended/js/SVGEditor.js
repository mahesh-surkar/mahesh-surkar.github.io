
//alert("loded");
//API for Tool framework
function getReqJsForTool()
{
	//var host = window.location.host;
	//var myJS = "http://" + host + "/static/SWMaths/js/QuestionGeneratorTool.js";
	return "";//myJS;	
}

//API for Tool framework
function SWToolCodeGenerator()
{	
	var HTMLcode = generateSVGSource();
	//	alert("Code to add : " + HTMLcode);
	return [HTMLcode, ""];
}

//API for Tool framework
function SWToolEditCode(HTMLCode)
{
	try
	{
		//alert("edit code1: "+ HTMLCode);
		var SVGData = document.getElementById("svg_source_textarea");
		var srcBtn = document.getElementById("tool_source");
		srcBtn.click();
	
		HTMLCode = HTMLCode.replace(/<br>/gi,"").replace(/&nbsp;/gi, "");	
		
		if (HTMLCode.indexOf("</svg>") == -1)
		{	
			//alert("adding svg tag : "+ HTMLCode + ":" + HTMLCode.indexOf("<svg>"));
			SVGData.value = '<svg width="320" height="240" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">'
			SVGData.value +=  HTMLCode;
			SVGData.value +=  '</svg>';
		}
		else
		{
			SVGData.value =  HTMLCode;
		}
	}
	catch(evt)
	{
		alert("Loading Please Wait.....");
		var srcSaveBtn = document.getElementById("tool_source_save");
		srcSaveBtn.click(); 
		setTimeout(function(){SWToolEditCode(HTMLCode)},350);
		return;
	}
	
	var srcSaveBtn = document.getElementById("tool_source_save");
	srcSaveBtn.click(); 

}

function generateSVGSource()
{
	try
	{
		//mySVGEditor = window.svgEditor;
		var w ="fit";
		var h ="fit";
		if (!svgCanvas.setResolution(w, h))
		{
			createAlert("Canvas resize to fit : "+ evt);
		}		
	}
	catch(evt)
	{
	   createAlert("Canvas resize to fit : "+ evt);
	}

	
	var srcBtn = document.getElementById("tool_source");
	srcBtn.click();
	var SVGData = document.getElementById("svg_source_textarea");
	htmlCode = SVGData.value;
	htmlCode = htmlCode.replace(/<g>/,"").replace(/<\/g>/,"");
	htmlCode = htmlCode.replace(/<title>.*<\/title>/,"");
	htmlCode = htmlCode.replace(/<!--.*-->/,"");
	
	var tmpHTML = htmlCode.replace(/<\/svg>/,"").trim().replace(/<svg.*>/,"").replace(/<g>/,"").replace(/<\/g>/,"").trim();
	
	//check if svg is blank
	if (tmpHTML == "")
	{
		htmlCode="";
	}
	
	//alert("Gata : !" + htmlCode + "!!!!");
	var srcSaveBtn = document.getElementById("tool_source_save");
	srcSaveBtn.click(); 
	
	return htmlCode;
}


