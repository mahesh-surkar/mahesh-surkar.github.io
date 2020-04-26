var TOOL_OPENED_MODE = "NONE"; //EDIT, NEW, NEW_SPECIFIC, NONE
var MY_CUST_ELEM_CLIPBOARD = "";
var DRAW_ELEM_STATE = "NONE"; 
var handleGroup;

var SVG_NONE=0
var SVG_CIRCLE=1;
var SVG_RECTANGLE=2;
var SVG_TEXT=3;
var SVG_LINE = 4;
var SVG_CUBIC_CURVE = 5;
var SVG_TABLE=6;
var SVG_ELEM_TO_DRAW=SVG_NONE;

var editor = null;
var editorDisplayObjChangeCallBack = null;
var EditorDataObj = null;

function isJScriptAlreadyAdded(htmlDoc, JScriptName)
{
	var x = htmlDoc.getElementsByTagName("script");	
	
	for (var i=0; i<x.length; i++)
	{		
		
		var src =  x[i].src;
		//alert("Total script tags +" + src);
		
		if (src.indexOf(JScriptName) != -1)
		{
			// ... do not add header again
			return true;
		}
	}
	return false;
}

function addJScript(objHeader, JScriptName)
{
	var JScriptTag = "";

	myHTMLHead = getHeaderTags(objHeader.innerHTML);	
	parser=new DOMParser();	
	htmlDoc=parser.parseFromString(myHTMLHead, "text/html");	
//	objHeader.innerHTML = 
	
	if (!isJScriptAlreadyAdded(htmlDoc, JScriptName))
	{
		JScriptTag = '<script type="text/javascript" src="' + JScriptName + '"></script>';
	}
	
	headerString = document.createTextNode(htmlencode(htmlDoc.head.innerHTML + JScriptTag));
	objHeader.innerHTML = "";
	objHeader.appendChild(headerString);
}

function getHeaderTags(header)
{
	//alert(header);
	var htmlTag = '<HTML xmlns="http://www.w3.org/1999/xhtml">' + '\n';
    	var htmlStartTag = '<HEAD>' + '\n';
	    htmlStartTag += '<meta http-equiv="X-UA-Compatible" content="IE=Edge" />' + '\n';
        htmlStartTag += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + '\n';
        htmlStartTag += '<meta name="createTool" content="InfoTrophic SWCreator">' + '\n';
        htmlStartTag += '<meta name="displaySection" content="BLANK">'  + '\n';
	    htmlStartTag += '<meta name="author" content="BLANK">' + '\n';
        htmlStartTag += '<meta name="keywords" content="BLANK">' + '\n';
        htmlStartTag += '<meta name="description" content="BLANK">' + '\n';       
        htmlStartTag += '<TITLE>\n</TITLE>\n</HEAD>\n<BODY>\n';  
       
        if (header && header != "")
        {
        	htmlStartTag = htmlTag + htmlDecode(header) + "\n<BODY>\n";
        }
	
	return htmlStartTag;
}

function attachHTMLTags(header, content) 
{
	var htmlStartTag = getHeaderTags(header);
	var htmlEndTag = "\n</BODY>\n</HTML>";	
	//alert(htmlStartTag + content + htmlEndTag);
	return htmlStartTag + content + htmlEndTag;
}

function handleFileSelect(evt, fileData, fileHeader, fileName) {
	//alert("file selected");
	var files = evt.target.files; // FileList object
    //Loop through the FileList.
	for (var i = 0, f; f = files[i]; i++) {   
		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = (function(theFile) {    		
			return function(e) {				
				//alert(escape(theFile.name));
				//alert(e.target.result);
				parser=new DOMParser();
				htmlDoc=parser.parseFromString(e.target.result, "text/html");
				
				//alert(htmlDoc.head.outerHTML);							
				headerString = document.createTextNode(htmlencode(htmlDoc.head.outerHTML));
				fileName.innerHTML = " " + theFile.name + " ";
				fileHeader.innerHTML = "";
				fileHeader.appendChild(headerString);
				fileData.innerHTML = htmlDoc.body.outerHTML;
				//fileData.innerHTML = e.target.result;
			};
		})(f);

		// Read in the  file as a data text.
		reader.readAsText(f);
	}
}

function getJSForTool(toolFrame)
{	
	var reqJS = "";
	//try
//	{
		if(toolFrame.contentWindow)
		{
			reqJS = toolFrame.contentWindow.getReqJsForTool();
		}
		else if(toolFrame.contentDocument)
		{
			reqJS = toolFrame.contentDocument.getReqJsForTool();
		}
/*	}
	catch (evt)
	{	
		alert("Tool JS reading Failed" + evt);
	}*/

	//alert("REQjs"+ reqJS);
	return reqJS;

}

function getHTMLCode(toolFrame, toolAPItoGenerateCode)
{
	
	//eval(toolAPItoGenerateCode + '()');
	//var el = document.getElementById('targetFrame');
	var swtoolElemKeepUniqueStr = "";
	var htmlCode = "";
	
	if(toolFrame.contentWindow)
	{
		var tmpStrArry = toolFrame.contentWindow.SWToolCodeGenerator();
		htmlCode = tmpStrArry[0];
		swtoolElemKeepUniqueStr = tmpStrArry [1];
	}
	else if(toolFrame.contentDocument)
	{
		var tmpStrArry = toolFrame.contentWindow.SWToolCodeGenerator();
		htmlCode = tmpStrArry[0];
		swtoolElemKeepUniqueStr = tmpStrArry [1];
	}
	
	//alert(htmlCode + ": "+ swtoolElemKeepUniqueStr);
	return [htmlCode, swtoolElemKeepUniqueStr];
	
}

function attachSWToolEditCode(allowWait, toolFrame, htmlCode)
{
	if (allowWait)
	{
		//to avoid failure due to page load delay
		setTimeout(function(){attachSWToolEditCode(0, toolFrame, htmlCode)},3500);
		return;
	}
	try
	{
		if(toolFrame.contentWindow)
		{
			//alert("ok htmlCode");
			htmlCode = toolFrame.contentWindow.SWToolEditCode(htmlCode);
			return;

		}
		else if(toolFrame.contentDocument)
		{
			//alert("ok htmlCode");
			htmlCode = toolFrame.contentDocument.SWToolEditCode(htmlCode);
			return;
		}	
	}
	catch(evt) {		
		setTimeout(function(){attachSWToolEditCode(0, toolFrame, htmlCode)},350);
		return;
	}
	
	setTimeout(function(){attachSWToolEditCode(0, toolFrame, htmlCode)},350);
	//alert("edit code0");
}

function addHTMLCanvas(CKeditor, objHeader)
{
	 var canvas = '<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;"> </canvas>';
	 addHTMLCodeToEditor(canvas, CKeditor, null,  null);
}

function addSVGShapes(CKeditor, objHeader)
{	
	openTools("NEW_SPECIFIC", "SVG Editor", null, CKeditor, objHeader);
}

function openToolToEdit(editedElement, CKeditor)
{
	var myToolName = editedElement.getAttribute('swtoolname');	
	openTools("EDIT", myToolName, editedElement, CKeditor, null);
}

function moveCursorToElementStart(CKeditor, myElement)
{
	CKeditor.getSelection().selectElement(myElement);
	var sel = CKeditor.getSelection();
	var element = sel.getStartElement();
	sel.selectElement(element);

		
	var ranges = CKeditor.getSelection().getRanges();
	ranges[0].setStart(element.getFirst(), 0);
	ranges[0].setEnd(element.getFirst(), 0); //range
	sel.selectRanges([ranges[0]]);

	var selectedRange = sel.getRanges()[0];
	var node = selectedRange.startContainer;
	var value = node.getText();
	var position = selectedRange.endOffset;
		//alert("position :" + position);
}

function ckElem2DomElem(ckelem)
{
	return ckelem.$;
}


function addCKElemResizer(CKeditor, myCKResizeObj) //js dom native object
{
    if (myCKResizeObj.hasAttribute("swck_resizer"))
	{
		return;
	}
	
	myCKResizeObj.setAttribute("swck_resizer", "1");
	
	
	var resizerMouseDown=false;
	var myResizeObj =  ckElem2DomElem(myCKResizeObj);
	var myResizeObj =  ckElem2DomElem(myCKResizeObj).getElementsByTagName("div")[0]; 
	
    var mySWResizer = document.createElement('div');
    var resizerId = "SWCKresizer" + getUniqueId();
    
    mySWResizer.id = resizerId;
    mySWResizer.style.width = "10px";
    mySWResizer.style.height = "10px";
    mySWResizer.style.background = "blue"; 
    mySWResizer.style.position = "relative";
    mySWResizer.style.cursor = 'se-resize';
    mySWResizer.contentEditable = "false";
    
    mySWResizer.style.left = (parseInt(myResizeObj.style.width.replace("px", ""))-10) + "px";
    mySWResizer.style.top = (parseInt(myResizeObj.style.height.replace("px", ""))-10) + "px";
    
	myCKResizeObj.setStyles({    		
	  'border' : '0.1em solid #E6CCCC',
    });	
    
    console.log(" resizable : x : " +  mySWResizer.style.left  + ", y" + mySWResizer.style.top);
    
    if (myResizeObj)
    {
    	myResizeObj.appendChild(mySWResizer);
    }
    
    var myCKResizer = CKeditor.document.getById(resizerId);	//CKEditor element

    myCKResizeObj.on('mouseleave', function (evt) {
    	myCKResizer.remove();
    	myCKResizeObj.removeAttribute("swck_resizer");
    	
    	myCKResizeObj.setStyles({    			
			'border' : 'none'			
		});		
    }); 
     
     myCKResizer.on('mousedown', function (evt) {		
    	 resizerMouseDown=true;
    	 
    	 var pageOffset = evt.data.getPageOffset();
    	 startX = pageOffset.x;
    	 startY = pageOffset.y;
    	 //alert("appending child : " + startX);
    	 startWidth = parseInt(document.defaultView.getComputedStyle(myResizeObj).width, 10);
    	 startHeight = parseInt(document.defaultView.getComputedStyle(myResizeObj).height, 10);
    	 console.log("native mousedown : x : " + startX + ", y" + startY);
    	 //document.dispatchEvent(d);	
     });
 	
     myCKResizer.on('mouseup', function (evt) {	
    	 resizerMouseDown=false;
 	 });
 	
     myCKResizer.on('mouseleave', function (evt) {	
    	 resizerMouseDown=false;
 	 });
     
     
     myCKResizer.on('mousemove', function (evt) {	
    	 if(resizerMouseDown)
    	 {
    		 myResizeObj = this.getParent().$;
    		 // alert(":"+myResizeObj);
    		 var pageOffset = evt.data.getPageOffset();

    		 console.log("native mousmove : x : " + pageOffset.x + ", y" + pageOffset.y );

    		 myResizeObj.style.width = (startWidth + pageOffset.x - startX) + 'px';
    		 myResizeObj.style.height = (startHeight + pageOffset.y - startY) + 'px';

    		 this.$.style.left = ((parseInt(document.defaultView.getComputedStyle(myResizeObj).width, 10)) -10)+ "px";
    		 this.$.style.top = ((parseInt(document.defaultView.getComputedStyle(myResizeObj).height, 10)) -10)+"px";
        	 
    		 this.$.style.left =  (parseInt(myResizeObj.style.width.replace("px", ""))-10) + "px";
    		 this.$.style.top = (parseInt(myResizeObj.style.height.replace("px", ""))-10) + "px"; 
    	 }
     });

    return mySWResizer;
	
}

function addElemEventPropogatorForCKEditor(myCKelem) //input CKeditorelem
{
	myCKelem.on('mousedown', function (evt) {		
		var d = new Event("mousedown");
		evt.data.preventDefault();	
		var pageOffset = evt.data.getPageOffset();
		d.clientX = pageOffset.x;
		d.clientY = pageOffset.y;
		
		console.log("native mousedown : x : " + d.clientX + ", y" + d.clientY);
		document.dispatchEvent(d);	
	});
	
	myCKelem.on('mouseup', function (evt) {	
		//console.log("native mouseup");
		
		var u = new Event("mouseup");
		var pageOffset = evt.data.getPageOffset();
		u.clientX = pageOffset.x;
		u.clientY = pageOffset.y;
		console.log("native mouseup : x : " + u.clientX + ", y" + u.clientY);
		document.dispatchEvent( u );
	});
	
	myCKelem.on('mousemove', function (evt) {	
	//	console.log("native mousemove X:"  + evt.data);
		var m = new Event("mousemove");
        var pageOffset = evt.data.getPageOffset();
		m.clientX = pageOffset.x;
		m.clientY = pageOffset.y;
		
		console.log("native mousmove : x : " + m.clientX + ", y" + m.clientY);
		document.dispatchEvent(m);
	});
}

function addSVGShapeEvents(SWsvgElement, CKeditor)
{	
	//workaround to remove unexpected div 
	//console.log("checking for unexpected Div in svgshapes");
	/*var unexpectedDiv = SWsvgElement.getElementsByTag("div").getItem(0);	//CKEditor element
	if (unexpectedDiv)
	{
		console.log("SW : removing for unexpected Div in svgshapes");
		unexpectedDiv.remove();
	}*/


	if (SWsvgElement.hasListeners("mouseover"))
	{
		return; //already added listeners and properties
	}
	
	//SWsvgElement.$.outerHTML
	//var myTmpSVG =  SWsvgElement.getElementsByTag("svg").getItem(0);	//CKEditor element
	
	
	var svgCanvasToUse = new SW_SVGCanvas(SWsvgElement.$);	
	allocSVGCanvasToDaraw(svgCanvasToUse);
	svgCanvasToUse.processShapes();
	
	if(SWsvgElement)
	{
		//var mytmpSVGCanvas = new SW_SVGCanvas(myTmpSVG.$);	
		//mytmpSVGCanvas.processShapes();
	}
	else
	{
		
		console.log("SVG tag not found in SWSVGshapes");
	}

	/*SWsvgElement.on('mouseleave', function (evt) 
	{
	    	SWsvgElement.setStyles({
				'border' : 'none',				
				'resize' : 'none',
				'overflow': 'hidden',
	    	});
	 });*/

	SWsvgElement.on('mouseover', function (evt)
	{
		SWsvgElement.setStyles({
			//'border' : '0.1em solid #E6CCCC',
			//'display': 'inline-block',
			//'resize' : 'both',
			'overflow': 'auto',
		});
	});


	/*SWsvgElement.on('click', function (evt) 
	{
		var svgCanvas = SWsvgElement.getElementsByTag("svg").getItem(0);	//CKEditor element
		SVG_CANVAS_IN_USE = new SW_SVGCanvas(svgCanvas.$);	
		return;
	});*/
	
	return;
	
}

function addSVGShapeEvents_tmp(SWsvgElement, CKeditor)
{
	//Snap.parse(svg)
	
	SWsvgElement.on('mousedown', function (evt) {
 		domEvent = evt.data;
		domEvent.preventDefault();	//avoid element selection 	
		//alert("svg Data: "+ SWsvgElement.getHtml());
		//alert("svg Data: "+ SWsvgElement.getSize( 'width' ) + ":" + SWsvgElement.getSize( 'height' ));
 		
		alert(SWsvgElement.getClientRect().left + " : " + SWsvgElement.getClientRect().top);

		var elementTag = "svg";
		var elements = SWsvgElement.getElementsByTag(elementTag);	       
		//alert(elements.count());
		var counter = 0;
		for (var i = 0; i < elements.count(); ++i )
		{
			 //alert( elements.getItem(i).getName());
			var svgElm = elements.getItem(i);	
			
			
			//alert("svg Data: "+ svgElm.getId());
			//getId();
			//nodeArray[counter] = svgElm;			
			counter++;	
			var snapFragment = Snap.parse("<svg>" + svgElm.getHtml() + "</svg>");
			//svgElm.remove();
			//var s = Snap("#mySnapsvg"); //not working
			//var s = Snap(100, 100); //not working
				
			var element = snapFragment.select('circle');
			element.attr({
    				fill: "#bada55",
  				stroke: "#000",
  				strokeWidth: 5
			});
			

		//	var mySnapsvg = document.createElement		
			var inbtn = document.createElement("button");
			var inDiv = document.createElement("div");
			
			/*inbtn.onclick = function (){ 
				//alert("hi" + $("#mySnapsvg").height());
				var s = Snap("#mySnapsvg");
				s.append(snapFragment);	
				
			};*/

			
			var myWidth = SWsvgElement.getSize('width');
			var myHeight = SWsvgElement.getSize('height');
		        svgStr = '<svg id="mySnapsvg" width="' + myWidth + '" height="' 
		                                               + myHeight+'"> </svg>';
			inDiv.innerHTML = svgStr;
			//inDiv.appendChild(inbtn);
			//var s = Snap("#mySnapsvg");
			
			var mySVGoverlay = createOverlay(inDiv, myWidth, false, function () { /*Nothing to do*/} , "true", false);
			hideOverlayTitle(mySVGoverlay);
			setOverlayHeight(mySVGoverlay, myHeight+15.6);
			setOverlayPadding(mySVGoverlay, 0);
			$("#" + mySVGoverlay.id).dialog({
			       resize: function(event, ui) { 
			    	   
			    	   var newHeight = $("#" + mySVGoverlay.id).height() - 0.4;
			    	   var newWidth  = $("#" + mySVGoverlay.id).width() - 0.8;
			    	   console.log("ckeditor elem height" +SWsvgElement.getSize('width'));
			    	   console.log("height" + newWidth);
			    	   SWsvgElement.setSize( 'height',  newHeight, false);
			    	   SWsvgElement.setSize( 'width',  newWidth, false);
			    	  
			       }
			    });
			
			var s = Snap("#mySnapsvg");
			s.append(snapFragment);		
			
			
	 	 }
	});
}

function addSVGShapeEvents_tmp3(SWsvgElement /*CKEditor element*/, CKeditor)
{
	if (SWsvgElement.hasListeners("mouseover"))
	{
	
		return; //already added listeners and properties
	}
	
	SWsvgElement.on('mouseover', function (evt) {
		
	});
	
	SWsvgElement.on('click', function (evt) {
		console.log("before open11");
		domEvent = evt.data;
		domEvent.preventDefault();	//avoid element selection 
		
		var inDiv = document.createElement("div");
		inDiv.style.border = '0.1em solid #E6CCCC';
		
		var myWidth = SWsvgElement.getSize('width');
		var myHeight = SWsvgElement.getSize('height');
		
	    //createAlert(SWsvgElement.getClientRect().left + " : " + SWsvgElement.getClientRect().top);
		
		var x = SWsvgElement.getClientRect().left;//jQuery(SWsvgElement).position().left + jQuery(SWsvgElement).outerWidth();
	    var y = SWsvgElement.getClientRect().top;//jQuery(SWsvgElement).position().top - jQuery(document).scrollTop();
	    
	   // $(DomSWsvgElement).position();
	    DomSWsvgElement=ckElem2DomElem(SWsvgElement);
	    
	    //$(DomSWsvgElement).position();
	   // createAlert(x + " : " +y);
	   
	    var myPosition = {};
		myPosition.left = $(DomSWsvgElement).position().left + jQuery(DomSWsvgElement).outerWidth();// - $(window).scrollLeft();
	  //  myPosition.left = $(DomSWsvgElement).parent().position().left;
		myPosition.top = $(DomSWsvgElement).position().top +  jQuery(DomSWsvgElement).outerHeight() - jQuery(document).scrollTop();
	   
		
		;//
	//	alert("pos: "+myPosition.left);
		
		var mySVGoverlay = createOverlay_2(inDiv, myWidth, false, function () { /*Nothing to do*/} , "false", false, 
				                                                                              myPosition);
		
		
		//DRAW_CANVAS
		
		//hideOverlayTitle(mySVGoverlay);
		setOverlayHeight(mySVGoverlay, myHeight+15.6);
		setOverlayPadding(mySVGoverlay, 0);
		//setOverlayDrgable(mySVGoverlay, true);

		$("#" + mySVGoverlay.id).dialog({
		       resize: function(event, ui) { 
		    	   
		    	   var newHeight = $("#" + mySVGoverlay.id).height() - 0.4;
		    	   var newWidth  = $("#" + mySVGoverlay.id).width() - 0.8;
		    	   console.log("ckeditor elem height" +SWsvgElement.getSize('width'));
		    	   console.log("height" + newWidth);
		    	   SWsvgElement.setSize( 'height',  newHeight, false);
		    	   SWsvgElement.setSize( 'width',  newWidth, false);
		    	  
		       }
		 });		
	});

}

function addCustomHTMLElemEvent(newElement, CKeditor)
{	
    if (typeof newElement === undefined || !newElement || newElement === "")
    {
         return;
    }      
    
    var elemToolName = newElement.getAttribute('swtoolname');
    
    if (elemToolName === "svgshapes") 
	{
		addSVGShapeEvents(newElement, CKeditor);
		return;	
	}
    
    //alert("tool add info: "+ elemToolName);
    
	if (newElement.hasListeners("mouseover"))
	{
	
		return; //already added listeners and properties
	}		
	
	//console.log("Time to add event");
	//newElement.removeAllListeners( );	

	if (elemToolName !== "domnative")
	{	
		newElement.setAttribute('contenteditable','false');
	    newElement.unselectable();
	}
	
	//alert("Adding Event");
  	var alertDisplayed = false;  	
  	var myDecoratorActionExpected = false;
	var cloneElem; 
	var mousedown = false;
	var myLastClickTIme = 0;
	
	if (newElement.hasAttributes("swtoolelemkeepuniqeid"))
	{
      // alert("has swtoolelemkeepuniqeid attribute in element");
	}
	
	newElement.on('mouseover', function (evt) {	
 		/*
 		if (!newElement.hasClass("myDecorator"))
 		{
 			//var br = new CKEDITOR.dom.element('br');	
 			newElement.addClass("myDecorator");
 			var myDecorator = new CKEDITOR.dom.element('div');	
 			var myCopy = CKEDITOR.dom.element.createFromHtml("<button>Copy</button>", CKeditor.document);
 			
 			myCopy.on('click', function (evt) {	
 				myDecoratorActionExpected = true;
 				alert("Copy Btn clicked");
 			});
 			
 			var myDelete = new CKEDITOR.dom.element('button');
 			myDecorator.append(myCopy);
 			myDecorator.append(myDelete);
 			
 			firstElem = newElement.getChild(0);
 			//alert(":"+mychildren); 			
 			firstElem.insertBeforeMe(myDecorator);
 			
 			myDecorator.setAttribute('contenteditable','false');
 			myDecorator.unselectable();
 			
 			
 		}*/
 		
 		console.log("mouse over happened");
		//MY_CUST_ELEM_CLIPBOARD = newElement;
		newElement.setStyles({    			
			'border' : 'none'			
		});

		if (elemToolName == "domnative")
		{
			newElement.setStyles({

				'border' : '0.1em solid #E6CCCC',
				'display': 'inline-block',
				'wordWrap': 'break-word',
				'resize' : 'both',
				'overflow': 'auto',
			});
		}
		else
		{
			newElement.setStyles({    		
				'border' : '0.1em solid #E6CCCC',
			    'display': 'inline-block',		
			});		
		}
	
		//cloneElem = newElement;	
	});
	
	newElement.on('mouseleave', function (evt) {
		
		/*if (newElement.hasClass("myDecorator"))
		{
			newElement.removeClass("myDecorator");
			var decorator = newElement.getChild(0);		
			decorator.remove();
		}*/
		
		mousedown = false;
		//alert(MY_CUST_ELEM_CLIPBOARD);
		newElement.setStyles({    			
			'border' : 'none',
			'background' :'inherit'	
		});	
		
		if (elemToolName === "domnative")
		{
			newElement.setStyles({
		    	'resize' : 'none',
			});
		}
	});
	
	if (elemToolName === "domnative")
	{ 
		return;
	}	
	
 	newElement.on('click', function () { 	
 		
 		if (myDecoratorActionExpected)
 		{
 		   myDecoratorActionExpected = false;
 		   return;
 		}
 		
 		//check if doubleckick
 		var d = new Date();
 		var myClickTIme = d.getTime();
 		if (myClickTIme - myLastClickTIme > 500)
 		{ 
 			
 			//alert("l" + myClickTIme + ":" + myLastClickTIme);
 			myLastClickTIme = myClickTIme;
 			return; 			
 		}
 		/*if (newElement.hasClass("myDecorator"))
		{
			newElement.removeClass("myDecorator");		
 			var decorator = newElement.getChild(0);		
 			decorator.remove();
 			
 			newElement.setStyles({    			
				'border' : 'none'			
			});
			
 		}*/
 		
 		var range = new CKEDITOR.dom.range(CKeditor.document);
 		range.moveToElementEditablePosition(newElement, true);
 		CKeditor.getSelection().selectRanges([range]);
 		
		openToolToEdit(newElement, CKeditor);
	});

 	newElement.on('mousedown', function (evt) {
 		domEvent = evt.data;
	//	domEvent.preventDefault();	//avoid element selection 
		mousedown = true;		
	});
 	

 	newElement.on('mouseup', function (evt) {
 		domEvent = evt.data;
		mousedown = false;		
	});
 	
 	newElement.on('mousemove', function (evt) {
 		domEvent = evt.data;
		//domEvent.preventDefault();	//avoid element selection 
		
		if (mousedown == true)
		{
		   // alert("dragging" + mousedown);	
			MY_CUST_ELEM_CLIPBOARD = newElement.getHtml();		
			newElement.setStyles({    			
				'background' :'#FFFFCC'					
			});	

			CKeditor.getSelection().selectElement(newElement);		
		}
		
	});
		
/*	try
	{
	        newElement.on('drag', function (evt) {			
			//domEvent = evt.data;
			//domEvent.preventDefault();	
	        	//alert("drag started");
			//cloneElem = newElement;	
			//MY_CUST_ELEM_CLIPBOARD = newElement.getHtml();						
		});

		newElement.on('drop', function () {	
			alert("droped");
			//newElement.remove();		
			//CKeditor.insertElement(cloneElem);
			//alert(MY_CUST_ELEM_CLIPBOARD);
			//newElement.setHTML(MY_CUST_ELEM_CLIPBOARD);	
		});
	}
	catch(evt)
	{
		alertDisplayed = false;		
		createAlert("Issues : Dragging not allowed!", "WARN", function () { alertDisplayed=false;} );	

	}*/
}

function notDragableAlert()
{
     createAlert("Dragging not allowed!", "WARN", function () {	});	//callback	
}


function removeToolWrapper(toolData)
{
	//return toolData;
	tmpData = toolData.replace(/<\s*swwrap.*?>/, '').replace(/<\/swwrap>/,"");
	return tmpData;
}

function SWCodeDecorator(REQ_CODE_TYPE, htmlCode, toolName, swtoolElemKeepUniqeId)
{
	var generatedHtmlCode = htmlCode;

	if (REQ_CODE_TYPE == "SWTOOL")
	{ 
		if (typeof swtoolElemKeepUniqeId === undefined) { swtoolElemKeepUniqeId = ""; }
		
		generatedHtmlCode = '<swdiv readonly swtoolname=' + toolName  +' swtoolelemkeepuniqeid=' + swtoolElemKeepUniqeId +' > <swwrap readonly>'  + htmlCode + "</swwrap></swdiv>";
	}
	else if (REQ_CODE_TYPE == "SW_DOM_NATIVE")
	{ 
		generatedHtmlCode = '<div swtoolname=' + toolName + '>' + htmlCode + '</div><span>&nbsp;</span>';
		// generatedHtmlCode = '<swdiv swtoolname=' + toolName + '><swwrap>'+ htmlCode + '</swwrap></swdiv><span>&nbsp;</span>';
	}

	return generatedHtmlCode;
}

function addHTMLCodeToEditor(htmlCode, CKeditor, toolName, swtoolElemKeepUniqeId, dataElemToReplace)
{	

	var generatedHtmlCode = SWCodeDecorator("SWTOOL", htmlCode, toolName, swtoolElemKeepUniqeId);

	//var generatedHtmlCode = '<swdiv readonly swtoolname=' + toolName  +' >'  + decoratedHtmlCode + "</swdiv>";
	//var generatedHtmlCode = '<swdiv readonly swtoolname=' + toolName  +' swtoolelemkeepuniqeid=' + swtoolElemKeepUniqeId +' > <swwrap readonly>'  + decoratedHtmlCode + "</swwrap></swdiv>";
	//alert(generatedHtmlCode);

	var tmpElement = CKEDITOR.dom.element.createFromHtml("<span> &nbsp; </span>", CKeditor.document);
	CKeditor.insertElement(tmpElement);
	
	//var tmpTable = CKEDITOR.dom.element.createFromHtml("<table><tr><td><span> &nbsp; </span></td><td><span> &nbsp; </span>" 
	//		                               + generatedHtmlCode + "<span> &nbsp; </span></td><td><span> &nbsp; </span></td></tr></table>", CKeditor.document);
	//CKeditor.insertElement(tmpTable);
	
	var newElement = CKEDITOR.dom.element.createFromHtml(generatedHtmlCode, CKeditor.document);
	if (TOOL_OPENED_MODE == "EDIT")
	{
		dataElemToReplace.remove();	
		
	}
	
	CKeditor.insertElement(newElement);	
	
	var tmpElement1 = CKEDITOR.dom.element.createFromHtml("<span> &nbsp; </span>", CKeditor.document);
	CKeditor.insertElement(tmpElement1);	
	
	addCustomHTMLElemEvent(newElement, CKeditor);
}

function getCustomElements(editor) 
{
 	var nodeArray = [];

	if (!editor.document)	
	{ 
		return nodeArray;
	}
	
	var elementTags = [ "swdiv", "div", "svg" ];
	//var elementTags = [ "swdiv" ];
	//alert(":  "+elementTags.length);
	for (var index=0; index < elementTags.length; index++)
	{
		var elements = editor.editable().getElementsByTag(elementTags[index]);	       
		//alert(elements.count());
		var counter = 0;
		for (var i = 0; i < elements.count(); ++i )
		{
			//alert( elements.getItem(i).getName());
			var elm = elements.getItem(i);

			var attr = $(elm.$).attr("swtoolname");

			if (typeof attr !== typeof undefined && attr !== false)
			//if (elm.hasAttributes("swtoolname"))
			{			
				nodeArray[counter] = elm;			
				counter++;	
			}		
		}
	}
	return nodeArray;
}

function addOnLoadElementEvtListener(editor)
{	
		var elements = getCustomElements(editor);
		//var elements = $(editor.document.getById(classesToClickListen[index])); 		
		//console.log("MS:"+ elements.length);
		if (elements)
		{
			for(index1=0; index1 < elements.length; index1++)
			{
				addCustomHTMLElemEvent(elements[index1], editor);
			}
        }	
}

function startEditMonitor(editor)
{
	var nextCheckAfter = 350;
	if (TOOL_OPENED_MODE == "NONE")
	{		
		 addOnLoadElementEvtListener(editor);			
	}

	if (!editor.document)
	{
		nextCheckAfter = 35;
	}


	//console.log("adding on click event again ");
	editor.editable().on('click', function (event) {
			editorOnClick();
	});
	
	
	setTimeout(function(){startEditMonitor(editor)}, nextCheckAfter);
}

function generateToolName(toolNameInJason)
{
	return toolNameInJason.replace(/ /g, "_");
}

function getTools(mode, toolNameToOpen, toolDefDataElem, CKeditor, objHeader, OverlayToDisplay)
{
	var toolsJson = JSON.parse(SWcreatorJasonDump);
	
	var myTools = document.createElement("div");	
	var toolsSelect = document.createElement("select"); 
	var toolAPItoGenerateCode = "";
	
	toolsSelect.onchange = (function () {
		var selectedVal = toolsSelect.options[toolsSelect.selectedIndex].value;		
		var selectedPageAndTool = selectedVal.split(":");
		
		if (selectedPageAndTool[0] != "---Select Tool---" && selectedPageAndTool[0] != "")
		{
			ifrmTool.src = SWContent + "?page=" + selectedPageAndTool[0] +"&newTab=false";
			toolAPItoGenerateCode = selectedPageAndTool[1];
			toolDisplaySection.style.display = "";
			//setOverlayHeight(OverlayToDisplay, "auto");
			//toolDisplayDiv.style.height = "800"; read from CSS
		}
		else
		{
			//ifrmTool.src = "#";
			toolAPItoGenerateCode = "";
			toolDisplaySection.style.display = "none";
		}		
	});	
	
	var toolDisplayDiv = document.createElement("div");		
	toolDisplayDiv.className = "SWCreatorToolDisplay";	
	
	var toolDisplaySection = document.createElement("div");		
	toolDisplayDiv.appendChild(toolDisplaySection);
	
	ifrmTool = document.createElement("IFRAME");	
	ifrmTool.id = "ifrmTool";
	ifrmTool.style.height = "99%";
	ifrmTool.style.width = "99%";
	
	toolDisplaySection.appendChild(ifrmTool);
	
	
	var addToolBtn = document.createElement("button");
	addToolBtn.id = "addToolBtn";
	addToolBtn.innerHTML ="Add to page";
	addToolBtn.className = "btn";
	addToolBtn.onclick = (function () {
		
		var selectedVal = toolsSelect.options[toolsSelect.selectedIndex].value;		
		if (selectedVal == "---Select Tool---")
		{
			createAlert("Please Select the tool");
			return false;
		}
		else if (typeof toolAPItoGenerateCode != undefined && toolAPItoGenerateCode != "")
		{			
			var reqJS = getJSForTool(ifrmTool); //exampletool.js
			var tmpArry = getHTMLCode(ifrmTool, toolAPItoGenerateCode); 
			var html = tmpArry[0];
			var swtoolElemKeepUniqueStr = tmpArry[1];	
			
			//alert("html: "+ html + "\n unique" + swtoolElemKeepUniqueStr);
			var toolName = toolsSelect.options[toolsSelect.selectedIndex].text;
			
			toolName = generateToolName(toolName);
			//alert("tooName: "+ toolName);
			
			if (!html || html == "")
			{
				return false;
			}
			
			if (objHeader)
			{
				addJScript(objHeader, reqJS);	
			}				
			//alert(CKeditor);
			addHTMLCodeToEditor(html, CKeditor, toolName, swtoolElemKeepUniqueStr, toolDefDataElem);				
			closeOverlay(OverlayToDisplay);
			TOOL_OPENED_MODE = "NONE";
			return true;
		}		
	});
	
	var defaultToolOption = document.createElement("option");
	defaultToolOption.text = "---Select Tool---";		
	defaultToolOption.value = "---Select Tool---";		
	toolsSelect.add(defaultToolOption);	
	
	for (var index=0; index < toolsJson.Tools.length; index++) 
	{
		var myToolOption = document.createElement("option");		
		
		if (typeof toolsJson.Tools[index].LinkPage  == undefined || toolsJson.Tools[index].LinkPage == "" 
			      || typeof toolsJson.Tools[index].AddPageSectionId  == undefined || toolsJson.Tools[index].AddPageSectionId == "")
		{
			createAlert("Tools Json is Invalid");
			return;
		}
		
		myToolOption.text = toolsJson.Tools[index].Name;
		myToolOption.value = toolsJson.Tools[index].LinkPage + ":" + toolsJson.Tools[index].ToolCodeGeneratorAPI;
		
		if (mode == "EDIT" || mode == "NEW_SPECIFIC") 
		{
			var toolName = generateToolName(myToolOption.text);	
			var elemToolName = "";
			
			if (mode == "EDIT" && toolDefDataElem)
			{
				elemToolName = toolDefDataElem.getAttribute('swtoolname');				
			}
			else (mode == "NEW_SPECIFIC")
			{
				elemToolName = generateToolName(toolNameToOpen);
			}
			
			//alert("elemToolName: " + elemToolName);
			
			if (toolName == elemToolName)
			{
				defaultToolOption.text = toolsJson.Tools[index].Name;	
				defaultToolOption.value = toolsJson.Tools[index].LinkPage + ":" + toolsJson.Tools[index].ToolCodeGeneratorAPI;
			
				ifrmTool.src = SWContent + "?page=" + toolsJson.Tools[index].LinkPage +"&newTab=false";
				toolAPItoGenerateCode = toolsJson.Tools[index].ToolCodeGeneratorAPI;
			}
		}
		
		toolsSelect.add(myToolOption);	
	}

	myTools.appendChild(document.createTextNode("Select Tool: "));	
	myTools.appendChild(toolsSelect);	
	myTools.appendChild(addToolBtn);
	myTools.appendChild(document.createElement("br"));
	myTools.appendChild(document.createElement("br"));
	myTools.appendChild(toolDisplayDiv);
		
	if (mode != "NEW")
	{
		toolsSelect.style.display = "none";

		//alert(mode);
		if (mode == "EDIT" && toolDefDataElem)
		{	
			var toolDefData = toolDefDataElem.getHtml();
			toolDefData = removeToolWrapper(toolDefData);	
			attachSWToolEditCode(1, ifrmTool,toolDefData);//1 to allowWait
		}
	}
	return myTools;
}

function openTools(mode, toolName, toolDefDataElem, CKeditor, objHeader)
{
	if (TOOL_OPENED_MODE != "NONE")
	{
		//createAlert("Tool Already open, Mode : " + TOOL_OPENED_MODE);
		return;
	}
	var toolsDiv = document.createElement("span");
	toolsDiv.id = "Tools";
	toolsDiv.className = "infoLabel italics overlay";
    
	
	var ToolsOverlayDiv = createOverlay(toolsDiv, "96%", false, function (status) { /*alert("closing tools"); */TOOL_OPENED_MODE = "NONE"; });	
	setOverlayTitle(ToolsOverlayDiv, "InfoTrophic Tools");

	
	var myTools = getTools(mode, toolName, toolDefDataElem, CKeditor, objHeader, ToolsOverlayDiv);
	toolsDiv.appendChild(myTools);
	TOOL_OPENED_MODE = mode;
	//alert("change tools mode : " + TOOL_OPENED_MODE);
	return ToolsOverlayDiv;
}

function closeTools(toolsOverlay)
{
	try 
	{
		closeOverlay(toolsOverlay);
	}
	catch (evt)
	{
		console.log("Is tool already closed ? "+ evt);
	}
}

function removeEditorDefaultElements(editorData)
{
	var classesToRemove = ["copyIcon", "pasteIcon", "notifyIcon"];
	for (index=0; index < classesToRemove.length; index++)
	{
		var elements = editorData.getElementsByClassName(classesToRemove[index]);
		while(elements.length > 0)
		{
			//alert("ok" +elements[0].innerHTML)			
			elements[0].parentNode.removeChild(elements[0]);
		}
	}
}

function hideEditorSaveButton()
{
	//$('.ui-dialog-buttonpane button:contains("Save")').button().hide();	
}

function addSWEditorControlPannel(swControlsDiv)
{
	var mainControlDiv = document.createElement("div");
	mainControlDiv.className = "mainControlDiv";
	swControlsDiv.appendChild(mainControlDiv);
	return  mainControlDiv;
}

function addSWEditorControlSubPannel(swControlPanel)
{
	var swControlSubPanel = document.createElement("div");
	swControlSubPanel.className = "controlPanel";

	swControlPanel.appendChild(swControlSubPanel);
	return swControlSubPanel;
}


function addSWEditorControlBtn11(elemToAppend, displayLabel, callBackFunction)
{
	ctrlBtn = addSWEditorControlBtn(elemToAppend, displayLabel, callBackFunction)
	ctrlBtn.className = "SWEditorControlBtn inVerticalpanel";
}


function addSWEditorControlBtn(elemToAppend, displayLabel, callBackFunction)
{
	var controlBtnDiv = document.createElement("div");
	controlBtnDiv.innerHTML = displayLabel;
	controlBtnDiv.className = "SWEditorControlBtn";
	controlBtnDiv.onclick = (function () {
                  callBackFunction("Clicked");
	});

	elemToAppend.appendChild(controlBtnDiv);
	return controlBtnDiv;
}


function attachDocHeader(i_insertAfterNode)
{
	var d = new Date();
	var time = d.getTime();

	var docHeaderDiv = document.createElement("div");	
	docHeaderDiv.className = "SWCreatorElemHeader";	
	docHeaderDiv.id = "SWC_ElementHeader_" + time;
	docHeaderDiv.contentEditable = "true";
	docHeaderDiv.style.display = "none";
	insertNodeAfter(docHeaderDiv, i_insertAfterNode);
	return docHeaderDiv;
}

function createVerticalPanelControl(editor, toolname, HTMLCodeForControl)
{

	/*var tbl     = document.createElement("table");
	var tblBody = document.createElement("tbody");
	var row = document.createElement("tr");
	var cell = document.createElement("td");    
	cell.style.verticalAlign = "top";
	cell.style.verticalAlign = "left";
	// cell.appendChild(cellText);
	row.appendChild(cell);
	tblBody.appendChild(row);
	tbl.appendChild(tblBody);
	//tbl.style.width = 50;
	//tbl.style.height = 50;	

	if (HTMLCodeForControl !== "")
	{
		cell.innerHTML = HTMLCodeForControl;
	}

	var divToadd1 = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>");
	editor.insertElement(divToadd1);//CKEditor

	var generatedHtmlCode = SWCodeDecorator("SW_DOM_NATIVE", tbl.outerHTML, toolname, "");*/

	
	// alert(divToadd2.getHtml());

	var divToadd1 = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>");
	editor.insertElement(divToadd1);//CKEditor
	
	tbl  = document.createElement("div");
	var generatedHtmlCode = SWCodeDecorator("SW_DOM_NATIVE", tbl.outerHTML, toolname, "");
	
	var divToadd2 = CKEDITOR.dom.element.createFromHtml(generatedHtmlCode);
	editor.insertElement(divToadd2);//CKEditor

	divToadd1 = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>");
	editor.insertElement(divToadd1);//CKEditor
	
	divToadd2.setStyles({    		
		'border' : '0.1em solid #E6CCCC',
		'display': 'inline-block',
		'wordWrap': 'break-word',
		'resize' : 'both',
		'overflow': 'auto',
		'padding' : '0',
		'display' : 'flex',
	});	

	divToadd2.setSize( 'width', 100, false);
	divToadd2.setSize( 'height', 100, false);

	if (HTMLCodeForControl !== "")
	{
		var divToadd3 = CKEDITOR.dom.element.createFromHtml(HTMLCodeForControl);
		divToadd3.appendTo(divToadd2);
		//return divToadd3;
	}
	else
	{
		divToadd2.$.innerHTML = "<span>&nbsp;</span>";
		divToadd2.focus();
	}
 	 
	
	//alert("added svg elem11: "+svgElemAdded.getHtml());
 	return divToadd2;
}

function blockControl(editor)
{
	createVerticalPanelControl(editor, "domnative","");
}

function getSVGCanvasToDaraw(editor){
	
	
	if (typeof editor.document === undefined)
	{
		console.log("editor is not defined yet");
		return;
	}

	if (!isSVGCanvasAllocated())
	{
		//allocate svg canvas first
	//	var svgHTMLCanvas = createSVGCanvas();    
	//	console.log("created SVG canvas: " +  svgHTMLCanvas);
	//	svgElemAdded = createVerticalPanelControl(editor, "svgshapes", svgHTMLCanvas);    
		//addCustomHTMLElemEvent(svgElemAdded, editor);		
		
		var myTmpSVG =  editor.editable().getElementsByTag("svg").getItem(0);	//CKEditor element
		var svgCanvasToUse = new SW_SVGCanvas(myTmpSVG.$);	
		allocSVGCanvasToDaraw(svgCanvasToUse);
	    svgCanvasToUse.processShapes();
		
		console.log(" SVG canvas: " +  myTmpSVG.$);
	}
	
	var mySVGCanvas = getAllocatedSVGCanvasToDaraw();
	return mySVGCanvas;
}

function svgCircle(editor)
{
	console.log("svgCircle : Draw circle called");
	var mySVGCanvas = getSVGCanvasToDaraw(editor);
	mySVGCanvas.drawCircle();
	//freeSVGCanvasToDaraw();
}

function svgRect(editor)
{
	var mySVGCanvas = getSVGCanvasToDaraw(editor);
	mySVGCanvas.drawRectangle();
	//freeSVGCanvasToDaraw();
	
	//var mysvg = ckElem2DomElem(SVG_CANVAS_IN_USE);
	//var s = Snap(mysvg);	
	//var r = s.rect(100,100,100,100,20,20).attr({ stroke: '#123456', 'strokeWidth': 20, fill: 'red' });

	/*var rectHtmlCode = '<rect width="200" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />';
	//SVG_CANVAS_IN_USE =  editor.document.getById("mySnapsvg");	
	
	 var divToadd2 = CKEDITOR.dom.element.createFromHtml(rectHtmlCode);

	 //editor.insertElement(divToadd2);//CKEditor
	SVG_CANVAS_IN_USE.appendHtml(rectHtmlCode);
	
	//alert("hi:"+SVG_CANVAS_IN_USE.getHtml());*/
}

function svgLine(editor)
{
	var mySVGCanvas = getSVGCanvasToDaraw(editor);
	mySVGCanvas.drawLine();
	//freeSVGCanvasToDaraw();
}

function svgText(editor)
{
	var mySVGCanvas = getSVGCanvasToDaraw(editor);
	mySVGCanvas.drawText();
	//freeSVGCanvasToDaraw();
}

function svgTable(editor, cols, rows)
{
	var mySVGCanvas = getSVGCanvasToDaraw(editor);
	mySVGCanvas.drawTable(cols, rows);
	//freeSVGCanvasToDaraw();
}

function svgCubicCurve(editor)
{
	var mySVGCanvas = getSVGCanvasToDaraw(editor);
	mySVGCanvas.drawCubicCurve();
	//freeSVGCanvasToDaraw();
}

function verticalPanelControls(verticalControlPannel, editor)
{
	/*var editorLeftVerticalControlBtn = document.createElement("div");
	editorLeftVerticalControlBtn.className = "editorLeftVerticalControlBtn";
	//verticalControlPannel.appendChild(editorLeftVerticalControlBtn);
	editorLeftVerticalControlBtn.innerHTML = "Text";*/
	
	objToShow = document.createElement("div");
	objToShow.innerHTML = "";
	objToShow.id = "objToShow11";
	//objToShow.className = "test_resize";
	verticalControlPannel.appendChild(objToShow);
	
	  $( "#objToShow11" ).resizable({
          ghost: true
      });
	


	addSWEditorControlBtn11(verticalControlPannel, "Add Block", function (action) {
		blockControl(editor);
			
	});	

	/*addSWEditorControlBtn11(verticalControlPannel, "Draw bord", function (action) {
		svgDrawCanvas(editor);
			
	});	*/
	
	addSWEditorControlBtn11(verticalControlPannel, "Circle", function (action) {
		//SVG_CANVAS_IN_USE = null;
		SVG_ELEM_TO_DRAW = SVG_CIRCLE;
		//svgCircle(editor);
			
	});	
	
	addSWEditorControlBtn11(verticalControlPannel, "Rect angle", function (action) {
		//SVG_CANVAS_IN_USE = null;
		SVG_ELEM_TO_DRAW = SVG_RECTANGLE;
		// svgRect(editor);
			
	});	
	
	addSWEditorControlBtn11(verticalControlPannel, "Line", function (action) {
		//SVG_CANVAS_IN_USE = null;
		SVG_ELEM_TO_DRAW = SVG_LINE;
		// svgRect(editor);
			
	});	
	
	addSWEditorControlBtn11(verticalControlPannel, "Text", function (action) {
		//SVG_CANVAS_IN_USE = null;
		SVG_ELEM_TO_DRAW = SVG_TEXT;
	});
	
	addSWEditorControlBtn11(verticalControlPannel, "Table", function (action) {
		//SVG_CANVAS_IN_USE = null;
		SVG_ELEM_TO_DRAW = SVG_TABLE;
	});
	
	addSWEditorControlBtn11(verticalControlPannel, "Cubic Curve", function (action) {
		//SVG_CANVAS_IN_USE = null;
		SVG_ELEM_TO_DRAW = SVG_CUBIC_CURVE;
	});
}

function addAddtionalControls(myObjHeader, editor, swControlDiv)
{
	var editorLeftVerticalControlPanel = document.createElement("div");	
	editorLeftVerticalControlPanel.id = "editorLeftVerticalControlPanel";
	editorLeftVerticalControlPanel.className = "controlPanel.vertical ";
	editorLeftVerticalControlPanel.className = "editorLeftVerticalControlPanel";
	swControlDiv.appendChild(editorLeftVerticalControlPanel);
	
	verticalPanelControls(editorLeftVerticalControlPanel, editor);
	return editorLeftVerticalControlPanel;
}

function addSlideDisplayPannelContainer(myObjHeader, swControlDiv)
{
	var editorSlidePanelSpan = document.createElement("div");	
	//editorSlidePanelSpan.className = "editorSlidePanelContainer";
	//swControlDiv.appendChild(editorSlidePanelSpan);
	
	var editorSlidePanelContainer = document.createElement("div");	
	editorSlidePanelContainer.id = "editorSlidePanelContainer";
	editorSlidePanelContainer.className = "editorSlidePanelContainer default-skin";

	editorSlidePanelContainer.onclick = (function () { 		
		$(".editorSlidePanelContainer").customScrollbar("resize", true);
	});	

	swControlDiv.appendChild(editorSlidePanelContainer);
	
	var mySlidePanel = document.createElement("div");	
	mySlidePanel.id = "mySlidePanel";
	mySlidePanel.className = "mySlidePanel";
	editorSlidePanelContainer.appendChild(mySlidePanel);
	
	setPresentationPrereqisites(mySlidePanel, myObjHeader, "");
	
	
	addSlide(mySlidePanel, null, true);
	return editorSlidePanelContainer;
}


function showSlideAndLeftVerticalControlls(objHeader, editor, swControlsDiv)
{
	var slidePannelWithVerticalControlls = document.createElement("div");
	slidePannelWithVerticalControlls.className = "inlineBlock";
	swControlsDiv.appendChild(slidePannelWithVerticalControlls);
	
	var slidePannelWithVerticalControlls1 = document.createElement("div");
	slidePannelWithVerticalControlls1.className = "inlineBlock broad";	
	slidePannelWithVerticalControlls.appendChild(slidePannelWithVerticalControlls1);
	
	
	var slidePannelWithVerticalControlls2 = document.createElement("div");
	slidePannelWithVerticalControlls2.className = "inlineBlock narrow";
	slidePannelWithVerticalControlls.appendChild(slidePannelWithVerticalControlls2);
	
	
	var slidePanel = addSlideDisplayPannelContainer(objHeader, slidePannelWithVerticalControlls1);
	var addtionalControls = addAddtionalControls(objHeader, editor, slidePannelWithVerticalControlls2);
	return showSlideAndLeftVerticalControlls;
}

function setPresentationPostAttach()
{
	
	$(".editorSlidePanelContainer").customScrollbar();
}

function useExistingCKEditior()
{

}

function attachDisplayToEditorArea(objToDisplayonEditor, actionCallBack)
{
	//DETACH EXISTING AREA IF ANY

	
	if (EditorDataObj && objToDisplayonEditor.id === EditorDataObj.id)
	{
		EditorDataObj.innerHTML = getSWEditorData(editor);
		//EditorDataObj.innerHTML = editor.getData();
		//alert(EditorDataObj.innerHTML);
		removeEditorDefaultElements(EditorDataObj);
		//alert ("already Attached same");
		return;
	}

	detachObjFromEditorArea();
	//alert("Attaching Data" + objToDisplayonEditor.innerHTML);	

	//editor.setData(objToDisplayonEditor.innerHTML);
	setSWEditorData(editor, objToDisplayonEditor);

	editorDisplayObjChangeCallBack = actionCallBack;
	EditorDataObj = objToDisplayonEditor;
	
	//alert(":" + objToDisplayonEditor.id +":" + EditorDataObj.id);
	//console.log("Attaching object from Editor." + editorDisplayObjChangeCallBack);

}

function detachObjFromEditorArea()
{

	//alert("Detaching object from Editor." + editorDisplayObjChangeCallBack);
	if (editorDisplayObjChangeCallBack)
	{
		if (editor)
		{		
			EditorDataObj.innerHTML = getSWEditorData(editor);
			//alert(EditorDataObj.innerHTML);
			removeEditorDefaultElements(EditorDataObj);
		}

		//alert("sending Data" + EditorDataObj.innerHTML);
		editorDisplayObjChangeCallBack("EDITOR_DETACHED");
	}
}

//function createEditorOverlay(objToShow, objHeader, actionCallBack)
function createEditorOverlay(actionCallBack)
{
	if (editor !== null)
	{	
		//detachObjFromEditorArea();
		//alert("Editor Alreay Created.");
		return;	
	}
	
       var objHeader = attachDocHeader(document.body);
	 
	//var objToShow = document.createElement("div");
	objToShow = document.createElement("div");
	objToShow.innerHTML = "";
	objToShow.id = "objToShow";
	
	var goFullScreen = false;
	
	//alert("creating Editor overlay with svg area" + objToShow.outerHTML);
	
	var overlayEditorDiv = document.createElement("div");
	overlayEditorDiv.name = "overlayEditorDiv";
	overlayEditorDiv.id = "overlayEditorDiv";	
	
	var toolsDiv;
	
	var editorOrigWidth = $(document).width();
	var editorOrigHeight = $(document).height();

	var swEditorAddLeftDiv = document.createElement("div");
	swEditorAddLeftDiv.id = "swEditorAddLeftDiv";
	swEditorAddLeftDiv.className = "swEditorAddLeft";
	
	var swEditContainerDiv = document.createElement("div");
	swEditContainerDiv.id = "swEditContainerDiv";	
	swEditContainerDiv.className = "swEditContainer";	
	
	var swEditorTitleDiv = document.createElement("div");
	swEditorTitleDiv.id = "swEditorTitleDiv";
	swEditorTitleDiv.className = "swEditorTitle";

	var swControlsDiv = document.createElement("div");
	swControlsDiv.id = "swControlsDiv";
	swControlsDiv.className = "swControlsDiv";
	
	var swRightControlsDiv = document.createElement("div");
	swRightControlsDiv.id = "swRightControlsDiv";
	swRightControlsDiv.className = "swRightControlsDiv";
	
	

	var controPannel = addSWEditorControlPannel(swControlsDiv);
	//var slidePanel = addSlideDisplayPannelContainer(objHeader, swControlsDiv);
	
	var controSubPanel1 = addSWEditorControlSubPannel(controPannel);
	var controSubPanel2 = addSWEditorControlSubPannel(controPannel);	
	
	var swEditorDiv = document.createElement("div");
	swEditorDiv.id = "swEditorDiv";
	swEditorDiv.className = "swEditorDiv";
	swEditorDiv.appendChild(objToShow);
	
	swEditContainerDiv.appendChild(swEditorTitleDiv);	
	swEditContainerDiv.appendChild(swEditorAddLeftDiv);
	swEditContainerDiv.appendChild(swControlsDiv);		
	swEditContainerDiv.appendChild(swEditorDiv);	
	swEditContainerDiv.appendChild(swRightControlsDiv);

	overlayEditorDiv.appendChild(swEditContainerDiv);	
	
	
	objToShow.style.height =  $("#overlayEditorDiv").parent().height();
	top = "{ my: 'top', at: 'top'  }";
	
	document.body.appendChild(overlayEditorDiv);
	//myHeight = $(window).height()-105; //720;	

	//alert(parseInt($("#swEditContainerDiv").height()));
	var showOverlayTitlebar =  (parseInt($(window).height())+50) > (parseInt($("#swEditContainerDiv").height())) ? true : false;	

	myHeight = goFullScreen ? screen.height : (!showOverlayTitlebar ? editorOrigHeight+100 : editorOrigHeight+80);

	myHeight = "99vh";
	//alert($(document).width());
	var myWidth = parseInt($(window).width()) > 1050 ? "99.5%" : "99.3%";
	
	editor = attachInlineCKEditor(objToShow);
	
	var slidePannelPlusVertControl = showSlideAndLeftVerticalControlls(objHeader, editor, swControlsDiv);
	
	$.widget("ui.dialog", $.ui.dialog, {
	    _allowInteraction: function(event) {
	        return !!$(event.target).closest(".cke_dialog").length || this._super(event);
	    }
	});
	
	$("#overlayEditorDiv").dialog({
		autoOpen : false,
		hide : "puff",
		closeText : "hide",
		//dialogClass : 'noTitleStuff',
		modal : true,
		title: headerBanner,
		zIndex: 3999,
		//zIndex: -1,
		//height : myHeight,
		width : myWidth,
		position : top,
		draggable : false,
		resizable: false,
		autoResize:false,
		closeOnEscape: false,
		stack: true,
		open: function (event, ui) 
		{
		    $('#overlayEditorDiv').css('overflow', 'auto'); //this line does the actual hiding
		    $('#overlayEditorDiv').css('padding', '0'); 
		    $('#overlayEditorDiv').css('margin', '0'); 
		    $('#overlayEditorDiv').css('height', '98.5vh'); 
		   // $('#overlayEditorDiv').css('border', '0.1em solid red'); 
		},
		beforeClose : function(event, ui)
		{
			try
			{

				if (toolsDiv)
				{
					closeTools(toolsDiv);
				}

				/*objToShow.innerHTML = editor.getData();
				//alert(objToShow.innerHTML);
				removeEditorDefaultElements(objToShow);*/
				detachObjFromEditorArea();
			}
			catch(evt)
			{
				createAlert("Failed to close tool, donot use ESC : " + evt);
			}
			
			objToShow = null;
			editor = null;
		},

		close: function(event, ui)
		{
			
			actionCallBack("CLOSE");			
			$(this).dialog('destroy').remove();	
		},


	}).fadeIn(300);

	$("#overlayEditorDiv").dialog("open");
	//editor.config.height = "84%";     
	
	if (!showOverlayTitlebar)
	{
		$("#overlayEditorDiv").siblings('.ui-dialog-titlebar').hide();
	}

	objToShow.focus();	
        
	
	controSubPanel1.innerHTML = headerBanner;
	controSubPanel1.className = "controlPanel editorTitle";
	
	addSWEditorControlBtn(controSubPanel2, "Save", function (action) {
		savePresentaion();
	});
	
    addSWEditorControlBtn(controSubPanel2, "Open", function (action) {
    	readPresentaion();
	});
    
   addSWEditorControlBtn(controSubPanel2, "Play", function (action) {
	   playPresentation();
	});
   
	addSWEditorControlBtn(controSubPanel2, "Done", function (action) {
		toggleScreeen("ExitFullScreen");
		$(overlayEditorDiv).dialog("close");
		showAllFrames(editorOrigWidth, editorOrigHeight);
	});

	addSWEditorControlBtn(controSubPanel2, "Shapes", function (action) {
                  var mySVGShapes = addSVGShapes(editor, objHeader);
	});
	

	addSWEditorControlBtn(controSubPanel2, "Tools", function (action) {
                  toolsDiv = openTools("NEW", "ALL", null, editor, objHeader);
	});

	origDocumentHeight = $(window).height()-105; //720;	
	$("#overlayEditorDiv").siblings('.ui-dialog-titlebar').hide();
//	$(".ui-dialog-titlebar-close").css('visibility','hidden');
	//alert(origDocumentHeight);
	
	setPresentationPostAttach();

	showOnlyMyFrame();

	//adjustForScreenResolution(swEditContainerDiv, swEditorAddLeftDiv, swControlsDiv);
	
	if (goFullScreen)
	{
		if (toggleScreeen("BecomeFullScreen") == 0) 
		{
			$("#overlayEditorDiv").dialog("close"); //no change
		}
		else
		{
			fullScreenChangeDetect(origDocumentHeight, overlayEditorDiv, function (isFullScreen)
					{ if (!isFullScreen) { $("#overlayEditorDiv").dialog("close"); } });
		}
	}
}


function setSWEditorData(editor, objToSet)
{
	//alert("setting editor data "+ objToSet.outerHTML);
	addSWEditorBaseElement(editor, objToSet);
}

function getSWEditorData(editor)
{
	//alert("data : " + editor.getData());	
	
	try
	{
		getAllocatedSVGCanvasToDaraw().removeShapeHelper();
	}
	catch(evt) 
	{
		console.log("Failed to remove svg shape Helper" + evt);
	}	
	
	try 
	{
		return editor.getData();
	}
	catch(evt) 
	{
		console.log ("SW error : data transfer to slide failed : " + evt);
		return "";  
	}
	
	try 
	{
		return editor.document.getById("SWeditorBaseElem").getHtml();
	}
	catch (evt)
	{	
		console.log("failed to get data" + evt);
	}	
	return "";   
}

function addSWEditorBaseElement(editor, objToSet)
{
		if (objToSet)
		{
			editor.setData(objToSet.innerHTML);
			if (objToSet.innerHTML == "")
			{
			
				var svgHTMLCanvas = createSVGCanvas(); 
				//svgID = svgHTMLCanvas.id;
				editor.setData(svgHTMLCanvas.outerHTML);
			}
		}
		
		freeSVGCanvasToDaraw();
		return;

		var swEditorBaseElem = document.createElement("div");
		swEditorBaseElem.id = "SWeditorBaseElem";
		swEditorBaseElem.className = "swEditorBaseElem";		
		swEditorBaseElem.style.display = "inline-block";
		//SWeditorBaseElem.style.resize = "both";
		swEditorBaseElem.contentEditable = true;
		swEditorBaseElem.style.padding = "0px";
		swEditorBaseElem.style.margin = "0px";
		swEditorBaseElem.style.height = "447px";
		swEditorBaseElem.style.width = "100%";
		swEditorBaseElem.style.border = "thin solid gray";
		swEditorBaseElem.style.overflow = "auto";

		//alert(divToadd.outerHTML);
                //var baseElemHTML = SWeditorBaseElem.outerHTML;

		if (objToSet)
		{
			swEditorBaseElem.innerHTML = objToSet.innerHTML;
		}	

		
		var divToadd = CKEDITOR.dom.element.createFromHtml(swEditorBaseElem.outerHTML, editor.document);
		
		try 
		{
			editor.document.getById("SWeditorBaseElem").remove();
			//alert(editor.document.getById("SWeditorBaseElem").getParent);
		}
		catch(evt)
		{
		}
		editor.insertElement(divToadd);//CKEditor
}

function attachInlineCKEditor(i_elem)
{
	
	/*for(var instanceName in CKEDITOR.instances) {
		   alert("instance detacher : " + instanceName);
		   var editor1 = CKEDITOR.instances[instanceName];
		   editor1.destroy();
		   editor1 = null;
	}*/

	i_elem.contentEditable = "true";
	var editor;
	
	CKEDITOR.config.toolbar_Full =
		[
            { name: 'clipboard', items : [ 'SelectAll','Cut','Copy','Paste','PasteText','PasteFromWord','-','Find','-','Undo','Redo' ] },
			{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
			{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent',
			                   			'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
			
		       //{ name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 
		      //  'HiddenField' ] },
			'/',			
			
			'/',
			
			{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
			{ name: 'colors', items : [ 'TextColor','BGColor' ] },
			//{ name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
			{ name: 'insert', items : [ 'Image', 'HorizontalRule','Smiley','SpecialChar','PageBreak'] },
			{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
			{ name: 'editing', items : ['SpellChecker', 'Scayt' ] },
			{ name: 'document', items : [ 'Source', 'CreateDiv','Textarea'] },
		];


   	editor = CKEDITOR.replace(i_elem.id , {
		// Allow some non-standard.
		//extraAllowedContent: 'a(documentation);abbr[title];code',
		//removePlugins: 'preview, print, save, about, elementspath, newpage, maximize, forms',
		//extraPlugins: 'mathjax,simplebox',
		//extraPlugins: 'divarea,mathjax,colordialog,tableresize,image2',
		extraPlugins: 'divarea,mathjax,colordialog,image2',
		extraAllowedContent: 'svg,rect*, g*, swdiv, swwrap, svg, rect, path, ellipse, circle, foreignobject',
		removePlugins: 'elementspath, wsc, magicline, htmldataprocessor',
		scayt_autoStartup: true,
		//extraAllowedContent: 'strong[onclick]',
		//extraPlugins: 'sourcedialog',
		// Show toolbar on startup (optional).
		startupFocus: true
	 });
	
   	//Orignal full cconfiguration
   	/*CKEDITOR.config.toolbar_Full =
   		[
   			{ name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
   			{ name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
   			{ name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
   			{ name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 
   		        'HiddenField' ] },
   			'/',
   			{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
   			{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
   			'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
   			{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
   			{ name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
   			'/',
   			{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
   			{ name: 'colors', items : [ 'TextColor','BGColor' ] },
   			{ name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
   		];*/

   	
   //CKEDITOR.config.removeFormatTags = 'swdiv, div';
   //CKEDITOR.config.protectedSource.push( /<swdiv[\s\S]*?\/swdiv>/g );   // custom tag

   //swdiv custm tag
   CKEDITOR.dtd.swdiv = {em:1};        // List of tag names it can contain.
   CKEDITOR.dtd.$removeEmpty.swdiv = 1;
   CKEDITOR.dtd.$inline.swdiv = 1;        // Choose $block or $inline.
   CKEDITOR.dtd.body.swdiv = 1;          // Body may contain customtag.
   CKEDITOR.dtd.$nonEditable.swdiv = 1;
   CKEDITOR.dtd.$object.swdiv = 1;

   CKEDITOR.dtd.svg = {em:1};       
  // CKEDITOR.dtd.$removeEmpty.svg = 1;
   CKEDITOR.dtd.$inline.svg = 1;        // Choose $block or $inline.
   CKEDITOR.dtd.body.svg = 1;          // Body may contain customtag.
   CKEDITOR.dtd.$nonEditable.svg = 1;
   CKEDITOR.dtd.$object.svg = 1;
   
   CKEDITOR.dtd.g = {em:1};       
   CKEDITOR.dtd.$removeEmpty.g = 1;
   CKEDITOR.dtd.$inline.g = 1;        // Choose $block or $inline.
   CKEDITOR.dtd.body.g = 1;          // Body may contain customtag.
   CKEDITOR.dtd.$nonEditable.g = 1;
   CKEDITOR.dtd.$object.g = 1;
   
  /* CKEDITOR.dtd.circle = {em:1};
   CKEDITOR.dtd.$inline.circle = 1;        // Choose $block or $inline.
   CKEDITOR.dtd.body.circle = 1;          // Body may contain customtag.
  // CKEDITOR.dtd.$nonEditable.circle = 1;
   CKEDITOR.dtd.$object.circle = 1;*/
   
   
 //  CKEDITOR.dtd.$inline.textarea = 1;
  // CKEDITOR.dtd.$editable.textarea = 1;
 //  CKEDITOR.dtd.$inline.table = 1;
 

   CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR; // inserts `<br>`
   //CKEDITOR.config.enterMode = CKEDITOR.ENTER_DIV; // inserts `<div></div>`
   CKEDITOR.config.autoParagraph = false;
   CKEDITOR.config.autoUpdateElement = false;
   CKEDITOR.config.allowedContent = true;
   CKEDITOR.config.resize_enabled = false;
   //CKEDITOR.plugins.addExternal( 'simplebox', 'http://sdk.ckeditor.com/samples/assets/plugins/simplebox/', 'plugin.js' );
   CKEDITOR.config.mathJaxLib = '//cdn.mathjax.org/mathjax/2.2-latest/MathJax.js?config=TeX-AMS_HTML';
   CKEDITOR.config.title = false;
   CKEDITOR.config.allowedContent = true;
   CKEDITOR.config.toolbar = 'Full';
   CKEDITOR.config.uiColor = '#E6CCCC';  
   CKEDITOR.config.baseFloatZIndex = 9000;
   CKEDITOR.config.disableObjectResizing = false; 
   CKEDITOR.config.disableNativeSpellChecker = false;
 //  CKEDITOR.config.width = '799';   // CSS unit (percent).  
//   CKEDITOR.config.height = '86.8%';  
	 CKEDITOR.config.height = '503';  
 //  CKEDITOR.config.font_defaultLabel = 'Arial';
 //  CKEDITOR.config.fontSize_defaultLabel = '14px';
   CKEDITOR.config.contentsCss  = '/static/simpleWeb/css/SimpleWebContent.css';

    editor.on('instanceReady',  function(evt)
		      {
                         var editorID = "cke_"+ i_elem.id;    
                         document.getElementById("cke_"+ i_elem.id).style.border = "none";//hide border
                         document.getElementById("cke_"+ i_elem.id).style.wordWrap = "break-word";
			 document.getElementById("cke_"+ i_elem.id).style.whiteSpace = "wrap";

		         var editor = evt.editor;
		         //editor.execCommand('maximize');
		         // alert("event created");
			 addSWEditorBaseElement(editor, null);	
		     addOnLoadElementEvtListener(editor);
		     startEditMonitor(editor);
	
		    /* editor.editable().on('click', function (event) {
		         editorOnClick();
		     });*/
    });
    
    editor.on('paste', function (evt) {
        //ev.data.html = ev.data.html.replace(/<img( [^>]*)?>/gi, '');
   	   //alert("Element pasted1"+ evt.data.dataValue); 
   	   
   	   var strToPaste = evt.data.dataValue;
   	   var swtoolelemkeepuniqeidList= strToPaste.match(/swtoolelemkeepuniqeid=".*?"/gi);
   	   
   	   if (!swtoolelemkeepuniqeidList)
   	   { 
   		   return;
   	   }
   		   
   	  //alert (swtoolelemkeepuniqeidList.length);
   	  var uuidStr = "";
   	  for(index=0; index < swtoolelemkeepuniqeidList.length; index++)
   	  {
   		  var uniqueStr = swtoolelemkeepuniqeidList[index].split("=");   		
   		  if (typeof uniqueStr[1] != undefined && uniqueStr[1] != "" && uniqueStr[1] != "\"\"")
   		  {
   			  
   			  //alert(":"+ uniqueStr[1]);

   			  uniqueStr[1] = uniqueStr[1].replace(/\"/gi, "");
   			  if (uuidStr == "")
   			  {
   				  var d = new Date();
   				  var uuidStr = d.getTime();
   			  }
   			  else
   			  {
   				uuidStr++;
   			  }
   			  //alert(":"+ uniqueStr[1] + ":"+ uuidStr);

   			  var replaceRegExp = new RegExp(uniqueStr[1], 'gi');
   			  strToPaste = strToPaste.replace(replaceRegExp, uuidStr);
   			 // alert(strToPaste);
   		  }
   	  }
   	  
   	 //alert(strToPaste);
   	 evt.data.dataValue = strToPaste;
    });
    
   /* editor.on('blur',
		      function( evt )
		      {
		         var editor = evt.editor;
		         //editor.execCommand('maximize');
		         // alert("event created");
		         alert("Edior drstroy");
		      });*/

  //  CKEDITOR.config.removePlugins = 'maximize';	

  
  var element = CKEDITOR.document.getById(i_elem.id);
  
 
 /* CKEDITOR.document.on('mouseup', function (e) {
    	//console.log("doc click");
	 
   });*/
	
    return editor;
}

function editorOnClick()
{
	console.log("editorOnClick event occured " + SVG_ELEM_TO_DRAW);
 	if (SVG_ELEM_TO_DRAW != SVG_NONE)
 	{
 		drawSVGShapes(SVG_ELEM_TO_DRAW);
 		SVG_ELEM_TO_DRAW = SVG_NONE;
 	}
}


function drawSVGShapes(svgShapeToDraw)
{
	console.log("drwa shape click called");
	switch (svgShapeToDraw)
	{
	   case SVG_CIRCLE:
		    svgCircle(editor);
	   		//alert ("drawing circle");
	    	break;
	   case SVG_RECTANGLE:
		    svgRect(editor);
	        //\\\alert ("drawing rectangle");
	        break;
	   case SVG_LINE:
	   		svgLine(editor);
	   		break;
	   case SVG_TEXT:
	   		svgText(editor);
	   		break;
	   case SVG_TABLE:
	   		svgTable(editor, 3, 2);
	   		break;
	   		
	   case SVG_CUBIC_CURVE:
	   		svgCubicCurve(editor);
	   		break;
	   default : 
		console.log("No action on editor click event");
	}

}
function addContainer(i_insertAfterNode)
{
	var container = document.createElement("div");		
	insertNodeAfter(container, i_insertAfterNode);

	var element = getElement();	
	var elementHeader = getElementHeader();	
	
	HTMLContentLabel = document.createElement("div");
	HTMLContentText = document.createTextNode("Add/Edit contents below: ");
	HTMLFileName = document.createElement("span");
	HTMLFileName.innerHTML = "";
	
	HTMLContentLabel.appendChild(HTMLContentText);
	HTMLContentLabel.appendChild(HTMLFileName);
	
	HTMLContentLabel.className = "infoLabel italics";	
	
	
	var newContainerAdder = getContainorAdder(container);
	var elementDecorator = getElementDecorator(element, elementHeader, HTMLFileName, container, newContainerAdder);

	HTMLContentLabel.appendChild(elementDecorator);
	container.appendChild(HTMLContentLabel);
	container.appendChild(elementHeader);
	
	
	
	//container.appendChild(document.createElement("hr"));
	container.appendChild(element);
	container.appendChild(document.createElement("hr"));
	//attachInlineCKEditor(element);
	container.appendChild(newContainerAdder);	
	return container;
}


function getElementOpener(i_elemToOpenIn, i_elemHeaderToOpenIn, i_fileName)
{
	return getFileOpener(i_elemToOpenIn, i_elemHeaderToOpenIn, i_fileName);
}

function getElementSaver(i_element, i_header, i_fileName)
{	
	var fileSaveBtn = document.createElement("button");
	var saveOverlay = "";
	fileSaveBtn.id = "fileSaveBtn";
	fileSaveBtn.className = "btn";
	fileSaveBtn.innerHTML = "Save";
	fileSaveBtn.onclick = (function () { 
		if (saveOverlay != "" )
		{
			closeOverlay(saveOverlay);
			saveOverlay = "";
		}
		saveOverlay = saveHTMLFile(i_element, i_header, i_fileName); 

	});	
	return fileSaveBtn;	
}

function saveHTMLFile(content, header, fileName)
{	
	//saveUsingDonloadify(content, header, fileName);	
	saveUsingHTML5(content, header, fileName)
}

function saveUsingHTML5(content, header, fileName)
{
////////////
	var mycontent = attachHTMLTags(header.innerHTML, content.innerHTML);
	var tmp = document.createElement("div");
    tmp.id = "tmp";

	var fileNameContainor = document.createElement("span");
	fileNameContainor.className = "infoLabel italics overlay";
	fileNameContainor.appendChild(document.createTextNode("File Name : "));
	
	var myFileName = document.createElement("input");
	myFileName.type = "text";
	myFileName.className = "infoLabel italics overlay";
	myFileName.placeholder = "Type file name (.html)";
	
	if (fileName) 
	{ 
		myFileName.value = fileName.innerHTML; 
	}
	
	fileNameContainor.appendChild(myFileName);
	
	var saveAsLink = document.createElement('a');
	saveAsLink.id = "saveAsLink";
	var saveText = document.createTextNode('Save');
	saveText.id = "saveText";
	saveAsLink.appendChild(saveText);
	 
	saveAsLink.title = 'Save';
	saveAsLink.className = "savelink"
	saveAsLink.href = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(mycontent);
	
	
	saveAsLink.onmouseover = (function (evt) {
		if (myFileName.value.trim() == "")
		{
			createAlert("Specify File Name.");
		}

		saveAsLink.innerHTML = "Right click to save";
		saveAsLink.setAttribute('download', myFileName.value.trim());
		fileName.innerHTML = myFileName.value;
		myFileName.blur();
	});
	
	saveAsLink.onmouseleave = (function (evt) {
		saveAsLink.innerHTML = "Save";		
	});
	
	saveAsLink.onclick = (function (evt)
			{ 
		       evt.preventDefault();
		       $('#saveAsLink').triggerHandler('contextmenu');

		       if (saveAsLink.innerHTML == "Right click to save")
		       {
		    	   saveAsLink.innerHTML = "Right click to save...";
		       }
		       else
		       {
		    	   saveAsLink.innerHTML = "Right click to save";
		       }

		        //alert("save clicked");			   
			});
	
	 
	infoMessage = document.createElement("span");
	infoMessage.innerHTML = 'Right click on Save button and press "Save link / target as..." to save.';
	infoMessage.id ="infoMessage";
	infoMessage.className = "infoLabel italics overlay";
	
	tmp.appendChild(fileNameContainor);	
	tmp.appendChild(document.createElement('br'));
	tmp.appendChild(document.createElement('br'));
	tmp.appendChild(saveAsLink);
	tmp.appendChild(document.createElement('br'));
	tmp.appendChild(document.createElement('br'));
	tmp.appendChild(infoMessage);
			
	var overlayDiv = createOverlay(tmp, "555", false, function(status) { /*on close callback function do nithing*/});	
}

function saveUsingDonloadify(content, header, fileName) 
{
	
	var tmp = document.createElement("div");
        tmp.id = "tmp";

	var fileNameContainor = document.createElement("span");
	fileNameContainor.className = "infoLabel italics overlay";
	fileNameContainor.appendChild(document.createTextNode("File Name : "));
	
	var myFileName = document.createElement("input");
	myFileName.type = "text";
	myFileName.className = "infoLabel italics overlay";
	myFileName.placeholder = "Type file name (.html)";
	myFileName.value = fileName.innerHTML;
	fileNameContainor.appendChild(myFileName);
	
	var saveButton = document.createElement("p");
	saveButton.id = "saveButton";
	
	saveButton.innerHTML = "You must have Flash 10 installed to save file.";	
	infoMessage = document.createElement("span");
	infoMessage.innerHTML = "Click above button to save the file.";
	infoMessage.id ="infoMessage";
	infoMessage.className = "infoLabel italics overlay";
	
	tmp.appendChild(fileNameContainor);	
	tmp.appendChild(saveButton);
	tmp.appendChild(infoMessage);
			
	var overlayDiv = createOverlay(tmp, "355", false, function(status) { /*on close callback function do nithing*/});
	Downloadify.create(saveButton, {
	   filename: function(){
		   //return document.getElementById('filename').value;
		   return myFileName.value.trim();//fileName;
	    },
	    
	    data: function(){ 		
		  var mycontent = attachHTMLTags(header.innerHTML, content.innerHTML);
		  return mycontent;
	   },
	
       onComplete: function(){ 
    	       return function(infoMessage, fileame, myFileName, overlayDiv){
    	    	   infoMessage.className = "infoLabel italics overlay";
    	    	   infoMessage.innerHTML = "File Saved!";
    	    	   fileName.innerHTML = myFileName.value;
    	    	   
    	    	}(infoMessage, fileName, myFileName, overlayDiv);
    	  
       },	
	   onCancel: function(){  
		        return function(infoMessage){
		        	infoMessage.className = "warnLabel italics overlay";
		        	infoMessage.innerHTML = "File save canceled."; 
		         }(infoMessage);
	   },
		  
	   onError: function(){ 
		      return function(infoMessage){
		    	    infoMessage.className = "warnLabel italics overlay";
			        infoMessage.innerHTML = "Cannot save empty file!";
		      }(infoMessage);	   
	   },
	
	   transparent: false,
	   swf: 'static/Downloadify/media/downloadify.swf',
	   downloadImage: 'static/Downloadify/images/download.png',
	
	   width: 110,//45,
	   height: 30,//15,
	
	   transparent: true,
	   append: false
    });
	
	return overlayDiv;
}


function getFileOpener(i_elemToOpenIn, i_elemHeaderToOpenIn, i_fileName, i_fileReadNotifyCallback)
{
	var fileOpenBtn = document.createElement("button");
	fileOpenBtn.id = "fileOpenBtn";
	fileOpenBtn.innerHTML = "Open";
	fileOpenBtn.className = "btn";
	fileOpenBtn.onclick = (function () { readFile(i_elemToOpenIn, i_elemHeaderToOpenIn, i_fileName, i_fileReadNotifyCallback); });
	
	return fileOpenBtn;
}


function readFile(i_objToAttachFile, i_elemHeaderToOpenIn, i_fileName, i_fileReadNotifyCallback)
{
	//alert(":reading file");
	var fileInputDiv = document.createElement("div");
	fileInputDiv.id = "fileInputDiv";	

	fileLabelSpan = document.createElement("span");
	fileLabelSpan.appendChild(document.createTextNode("Select the File: "));
	fileLabelSpan.className = "infoLabel italics overlay";
	
	fileInputDiv.appendChild(fileLabelSpan);
	fileInputDiv.appendChild(document.createElement("br"));
	fileInputDiv.appendChild(document.createElement("br"));
	
	var fileInput = document.createElement("input");        
	fileInput.type = "file";
	fileInput.id = "files";
	fileInput.className = "overlay";
	fileInputDiv.appendChild(fileInput);
	
	
	//
	//var fileAddBtn = document.createElement("button");
	//fileAddBtn.id = "fileAddBtn";
	//fileAddBtn.innerHTML = "Add";
	//fileInputDiv.appendChild(fileAddBtn);
	
	var fileData = document.createElement("span");
	

	var myOverlayDiv = createOverlay(fileInputDiv, "420", false, function (status)
	{ 
	    if (status == "OK_CLOSE") 
	    {
	        i_objToAttachFile.innerHTML = i_objToAttachFile.innerHTML.trim();	  //callback fucion for close overlay
	        // alert(i_objToAttachFile.innerHTML);
	    }
	});

	fileInput.addEventListener('change', function (evt) { 
		                handleFileSelect(evt, i_objToAttachFile, i_elemHeaderToOpenIn, i_fileName); 
		                $("#" + myOverlayDiv.id ).dialog("close"); 
		                if (i_fileReadNotifyCallback)
		                {
		                	waitSleepFileRead(1000, i_fileReadNotifyCallback);
		                }
	}, false);

}

function waitSleepFileRead(waitTime, i_fileReadNotifyCallback)
{
	setTimeout(i_fileReadNotifyCallback, waitTime); 
}
