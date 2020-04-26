
var filesadded="" //list of files already added dynamically

var startX, startY, startWidth, startHeight;

function loadjscssfile(filename, filetype)
{
    if (filetype=="js")
    { //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css")
    { //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }

    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

function checkloadjscssfile(filename, filetype)
{
    if (filesadded.indexOf("["+filename+"]")==-1)
    {
        loadjscssfile(filename, filetype);
        filesadded+="["+filename+"]"; //List of files added in the form "[filename1],[filename2],etc"
    }
    else
    {    
	//    alert("file already added!");
    }
}


function getUniqueId()
{
	var d = new Date();
	return d.getTime();
}

function htmlDecode(input)
{
	if (typeof input != undefined && input != "")
	{
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	}
	else 
	{
		return "";
	}
}

function htmlencode(input)
{
	  //alert(input)
	 /* var e = document.createElement('div');
	  e.innerHTML = input;
	  alert( e.innerHTML);*/
	  return input;
}


var createAlert = function (msg, msgType, callBackFunction)
{
	var alertDiv = document.createElement("div");
	alertDiv.id = "alertDiv";
	alertDiv.className = "infoLabel italics";	

	var alertOvelay = createOverlay(alertDiv, "auto", false, function () { alertOvelay = ""; })	 
	$("#" + alertOvelay.id).siblings('div.ui-dialog-titlebar').hide();
	$("#" + alertOvelay.id).css({background: "#FFFFCC"});  
	
	artMsg = document.createElement("h2");
	artMsg.className = "warnLabel italics";
	artMsg.innerHTML = msg;
	
	if (typeof msgType != undefined && msgType == "INFO")
	{
		artMsg.className = "infoLabel italics";
	}
	
	Okbtn = document.createElement("button")
	Okbtn.innerHTML = "Ok";
	Okbtn.className = "btn right";
	
	this.close = function()
	{
		console.log("closing alert");
	
		if (alertOvelay)
		{
			closeOverlay(alertOvelay);	
			alertOvelay = null;
			if (typeof callBackFunction ===  "function")
			{
				callBackFunction();
			}
		}
	}
	
	var meClose = function()
	{ 
		this.close();
	}
	
	var tmpClose = meClose.bind(this);
	
	Okbtn.onclick = function () { console.log("time to close alert"); tmpClose(); }
	
	alertDiv.appendChild(artMsg);
	var hrLine = document.createElement("hr");
	alertDiv.appendChild(hrLine);	
	alertDiv.appendChild(Okbtn);	

	//setTimeOut(100, waitForCloseAlert);
}


function showOnlyMyFrame()
{
	var myHeader = parent.document.getElementsByClassName("completeHeaderDiv");
	
	for (i = 0; i < myHeader.length; ++i)
	{
		myHeader[i].style.display = "none";
	}
	
	//alert(":" + frames.length);
	var frames = parent.document.getElementsByTagName("iframe");
	//alert(":" + frames.length);
	for (i = 0; i < frames.length; ++i)
	{
		if (frames[i].contentWindow !== window)
		{
			frames[i].style.display = "none";
		}
		else
		{
			frames[i].style.width = "100%";
			frames[i].style.height = "97%";
			document.body.style.overflow = "hidden";
		}
	}
}

function showAllFrames(myWidth, myHeight)
{
	var myHeader = parent.document.getElementsByClassName("completeHeaderDiv");
	
	for (i = 0; i < myHeader.length; ++i)
	{
		myHeader[i].style.display = "";
	}
	
	var frames = parent.document.getElementsByTagName("iframe");
	//alert(":" + frames.length);
	for (i = 0; i < frames.length; ++i)
	{
		frames[i].style.display = "";
		
		if (frames[i].contentWindow === window)
		{
			frames[i].style.width = myWidth + "px";
			frames[i].style.height = myHeight + "px";
			document.body.style.overflow = "auto";
		}
	}

}


function adjustForScreenResolution(swEditContainerDiv, swEditorAddLeftDiv)
{
	//Screen resolution
	//alert(":" + window.screen.availHeight + " : " + window.screen.availWidth);

	//Avalilable area 
	//alert(":" + window.innerHeight + " : " + window.innerWidth );

	var reqMinWidth  = 1280;
	var reqMinHeight = 768

	//if (reqMinHeight < window.innerHeight)// || reqMinWidth < window.innerWidth)

	if (window.innerWidth < 1250 ) //scale
	{
		//swEditContainerDiv.className = "swEditContainer scale0_8";
		//swControlsDiv.style.width = "260";
		swEditorAddLeftDiv.style.display = "none";
		swEditContainerDiv.style.overflow="hidden";
	}
	else if (window.innerWidth < 1590 ) //hide inplace slide pannel
	{
		
		//swEditContainerDiv.style.width = reqMinWidthForAdd + "px";		
		swEditorAddLeftDiv.style.display = "none";
	}
	else if (window.innerWidth >= 1590) //expand slide pannel
	{
		swEditorAddLeftDiv.style.display = "";
		swEditContainerDiv.style.width = "1590px";	
	}
}

function waitForCloseAlert()
{
	if(alertOvelay)
	{ setTimeOut(100, waitForCloseAlert); }
	
}

function hideOverlayTitle(overlay)
{
	 $("#" + overlay.id).siblings('.ui-dialog-titlebar').hide();
}

function setOverlayTitle(overlay, myTitle)
{
	 $("#" + overlay.id).dialog('option', 'title', myTitle);
}

function setOverlayHeight(overlay, myHeight)
{
	$("#" + overlay.id).dialog('option', 'height', myHeight);
}

function setOverlayPadding(overlay, mypadding)
{
	$("#" + overlay.id).dialog('option', 'padding', mypadding);
}

function setOverlayDrgable(overlay, boolDragable)
{
	$("#" + overlay.id).dialog('option', 'dragable', boolDragable);
}

function setOverlayPosition(overlay, positionJSON) //As per Dialog 
{
	//alert("setting positon");
	//$(overlay).dialog('option', 'position', { my: "left bottom", at: "left bottom", of: positionJSON });
	//$(overlay).position({ my: positionJSON.my, at: positionJSON.at, of: positionJSON.of });
	//alert("setting positon111 :");
}

function setOverlayWidgetBackround(overlay, color) //for modal view
{
	$('.ui-widget-overlay').css('background', color);
}

function setOverlayWidgetTransparent(overlay) //for modal view
{
	//$('.ui-widget-overlay').css('background', color);
	$('.ui-widget-overlay').css('background', 'rgba(0, 0, 0, 0)');
}

function closeOverlay(overlayToClose)
{
	try
	{
		if (typeof overlayToClose != undefined && overlayToClose && typeof overlayToClose.id != undefined)
		{
			//alert("closing:"+ overlayToClose.id);
			$("#" + overlayToClose.id).dialog("close"); 
		}
	}
	catch (evt)
	{
		console.log("Error while closing overlay: " + evt.message);
	}
}


/*
function createEditorOverlay(objToShow, objHeader, actionCallBack)
{
	myHeight = screen.height;
	myWidth = "95%";
	//alert(":"+ myWidth);
	var myOverlay = createOverlay(objToShow, myWidth, true, actionCallBack);  
	var editor = attachInlineCKEditor(objToShow);	
	setTimeout(function(){CKEDITOR.replace('ckedt-hiddenForms')},350);
	
	//var origDocumentHeight = $(window).height()-105; //720;	
	//toggleScreeen("BecomeFullScreen");	
	//fullScreenChangeDetect(origDocumentHeight, myOverlay, function (isFullScreen)
	//            { if (!isFullScreen) { $("#myOverlay").dialog("close"); } });
    return myOverlay;
}
*/


function createOverlay(objToShow, myWidth, showDefaultButton, closeCallBack, closeOnOutSideClick, disableBackround)
{
	 var myPosition = null;
	 var enableShowHideAnimation = true;
	 return createOverlay_2(objToShow, myWidth, showDefaultButton, closeCallBack, closeOnOutSideClick, disableBackround, myPosition, enableShowHideAnimation);
}


function createOverlay_2(objToShow, myWidth, showDefaultButton, closeCallBack, closeOnOutSideClick, 
		               disableBackround, myPosition, enableShowHideAnimation)
{
	param = {
			width: myWidth,
			showDefaultButtons : showDefaultButton,
			closeCallBack: closeCallBack,
			closeOnOutSideClick: closeOnOutSideClick,
			disableBackround : disableBackround,
			position: myPosition,
			enableShowHideAnimation: enableShowHideAnimation
	};
	return createOverlay_3(objToShow, param);

}

function createOverlay_3(objToShow, param)
{
	var myWidth = param.width || 300,
	showDefaultButton = typeof param.showDefaultButtons !== "boolean" ? false : param.showDefaultButtons, 
	closeCallBack = typeof param.closeCallBack !== "function" ? null: param.closeCallBack, 
	closeOnOutSideClick = typeof param.closeOnOutSideClick !== "boolean" ? true: param.closeOnOutSideClick, 
    disableBackround = typeof param.disableBackround !== "boolean" ? true : param.disableBackround, 
    myPosition  = param.position || null, 
    enableShowHideAnimation = typeof param.disableBackround !== "boolean" ? false : param.enableShowHideAnimation,
    isdragable = typeof param.dragable !== "boolean" ? false : param.dragable;
    		
	//console.log("opening dialog");
	var dialogPosition = { my: "top", at: "top+50" };
	var hideAnimation = "puff";
	var showAnimation = "slide";
	
	if (myPosition != null) 
	{
	//   dialogPosition = { my: "left+" + myPosition.left, at: "left top+" + myPosition.top };
	 //  dialogPosition = { my: "left+" + myPosition.left, at: "left top+" + myPosition.top };
		dialogPosition = myPosition;
	}
	
	if (enableShowHideAnimation != null && typeof enableShowHideAnimation !== undefined && enableShowHideAnimation == false)
	{
		hideAnimation =  { effect: "fade", duration: 0 } //put the fade effect 0
		showAnimation =  { effect: "fade", duration: 0 } //put the fade effect 0
	}
	
	//alert("closeOnOutSideClick11: " + closeOnOutSideClick);
	if (typeof disableBackround === undefined || disableBackround != false)
	{
		disableBackround = true;	
	}

	//alert(myPosition.top +":"+ myPosition.top);
	var d = new Date();
	var time = d.getTime();
	performCallbackAction = false;
	isCloseonEsc = true;

	var overlayIdentifier = "overlayDiv_" + time;
	var overlayDiv = document.createElement("div");		
	//overlayDiv.name = overlayIdentifier;
	overlayDiv.id = overlayIdentifier;	
	overlayDiv.appendChild(objToShow);	

	document.body.appendChild(overlayDiv);
	var closedialog = 0;
	var mouseOnOverlay = 0;
	
	function moveToTop(evt)
	{
		$( "#" + overlayDiv.id ).dialog( "moveToTop" );
	}
	
    function overlayclickclose(event) 
    {

    	if (closedialog && !mouseOnOverlay) 
    	{
    		$(document).unbind('click.'+ overlayIdentifier);
    		$("#" + overlayDiv.id).dialog("close");       
    		var target = $(event.target);
    	}
    	closedialog = 1;   
    }

	$("#" + overlayDiv.id).dialog({
		autoOpen : false,
        dialogClass: 'transparent',
		hide : hideAnimation,
		show : showAnimation,
		//closeText : "hide",
		//dialogClass : 'noTitleStuff',
		modal : disableBackround,
		title: "",
		zIndex: 5999,
		height : "auto",
		minHeight: 'auto',
		width : myWidth,		
		position : dialogPosition,
		draggable : isdragable,
		resizable: false,
		autoResize:true,
		overflow : "hidden",
		closeOnEscape: isCloseonEsc,
		stack: false,	
        open: function() {  
        	
        	if (closeOnOutSideClick)
        	{
        		$(document).bind('click.'+ overlayIdentifier, overlayclickclose);
        	}
        	else
        	{
        		$(document).bind('mousedown.'+ overlayIdentifier, moveToTop);
        	}
        },
        
		beforeClose : function(event, ui)
		{
			//console.log("closing dialog");
			//$(this).dialog('destroy').remove();
		},

		close: function(event, ui)
		{
			
			//alert("Common js time to close");
			
			if (performCallbackAction)
			{
				closeCallBack("OK_CLOSE");
			}
			else
			{
				closeCallBack("CANCEL_CLOSE");				
			}
			
			$(document).unbind('mousedown.'+ overlayIdentifier);
			$(this).dialog('destroy').remove();	
		},

		buttons: 
		{                       
			"Cancel": 
			{      
				id: "Cancel",
				text: "Cancel",
				click: function () 
				{                                  
					performCallbackAction = false;
					$(this).dialog("close");                                  
				}
			},

			"Ok": function () 
			{
				performCallbackAction = true;
				$(this).dialog("close");
			},
		}
             
	});

	if (showDefaultButton == false)  
        { $("#" + overlayDiv.id).dialog("option", "buttons", {}); }

	$("#" + overlayDiv.id).dialog("open");
	$( "#" + overlayDiv.id ).dialog( "moveToTop" );
	//$(".ui-dialog-titlebar").hide(); 
	
	//$(".ui-widget-overlay").css({background: rgba(255,255,255,0.5)});
	
        // $(".ui-widget-overlay").css({background: '#FFF6F6', opacity: 0.2});       
        //$("#overlayDiv").css({background: "#FFF6F6", opacity: 0.9});
	//$("#" + objToShow.id).css({background: "#FFF6F6"});
       // $(".ui-dialog-buttonset").css({background: 'transparent'});  

       $(".ui-dialog-buttonpane").css({background: 'transparent'});  
  
       $("#" + overlayDiv.id).siblings('div.ui-dialog-titlebar').css({background: 'transparent', border: 'none' }); 
      // $(".ui-dialog-titlebar").css({background: 'transparent', border: 'none' }); 
      // $(".ui-dialog-titlebar-close").css('visibility','visible');
      //$(".ui-dialog-titlebar-close").show();
    
      if (typeof closeOnOutSideClick != undefined && (closeOnOutSideClick == "true" || closeOnOutSideClick == true)) 
      {
    	  if (disableBackround) //modal
    	  {
    		  $(".ui-widget-overlay").on("click", function() {  $("#" + overlayDiv.id).dialog("close"); } );
    	  }
    	  else
    	  {
    	      $(overlayDiv).hover(function (e) { mouseOnOverlay = 1; });
    	      $(overlayDiv).bind('mouseleave', function () { mouseOnOverlay = 0; });
    	  }
      }     
    
      objToShow.focus();
    
      return overlayDiv;
	
}

function addSWContainer(i_insertAfterNode, getElementCallback)
{
	var adderContainer = document.createElement("div");	
	insertNodeAfter(adderContainer, i_insertAfterNode);	
	
	var firstContainerAdder = getSWContainorAdder(adderContainer, getElementCallback);
	adderContainer.appendChild(firstContainerAdder);
	
	addMySWContainer(adderContainer, getElementCallback, true)

}

function addMySWContainer(i_insertAfterNode, getElementCallback, addCotainerRemover)
{	
	var container = document.createElement("div");		
	insertNodeAfter(container, i_insertAfterNode);	
	
	var newContainerAdder = getSWContainorAdder(container, getElementCallback);
	var elementDecorator = getSWElementDecorator(getElementCallback(), container, newContainerAdder, addCotainerRemover);

	container.appendChild(elementDecorator);
	container.appendChild(getElementCallback());	
	//attachInlineCKEditor(element);
	container.appendChild(newContainerAdder);	
	return container;

}

function getSWContainorAdder(i_insertAfter, getElementCallback)
{
	var containorAdder = document.createElement("div");
	var addBtn = document.createElement("button");
	addBtn.id = "addSectionBtn";
	addBtn.className = "btn";
	addBtn.innerHTML="+";
	addBtn.onclick =(function (){ addMySWContainer(i_insertAfter, getElementCallback, true); });

	containorAdder.appendChild(document.createElement("hr"));
	containorAdder.appendChild(addBtn);
	
	return containorAdder;	
}


function getSWElementDecorator(i_element, i_elementContainer, i_elementHelper, addCotainerRemover)
{
	
	var elemRemover;
	if (addCotainerRemover != undefined && addCotainerRemover == true)
	{
		elemRemover = getSWElementRemover(i_element, i_elementContainer);
	}
	
	var elemDecoratorDiv = document.createElement("span");
	elemDecoratorDiv.style.display = "none";
	//elemDecoratorDiv.style.float = "right";

	elemDecoratorDiv.appendChild(document.createElement("hr"));
	if (elemRemover)
	{ elemDecoratorDiv.appendChild(elemRemover); }
	
	i_elementContainer.onmouseover = (function (){
		elemDecoratorDiv.style.display = ""; 
		i_elementHelper.style.display = "";
		//i_element.focus();
	});

	i_elementContainer.onmousemove = (function (){
		elemDecoratorDiv.style.display = ""; 
		i_elementHelper.style.display = "";
		//i_element.focus();
	});

	i_elementContainer.onmouseout = (function (){ 
		elemDecoratorDiv.style.display = "none"; 
		i_elementHelper.style.display = "none";
		//i_element.blur();
	});

	i_element.onfocus = (function (){  
		elemDecoratorDiv.style.display = "";
		i_elementHelper.style.display = "";
				   
		var overlayelem = document.createElement("div");
		overlayelem.innerHTML = i_element.innerHTML;
		overlayelem.id = "overlayelem_" + i_element.id;
					
		createEditorOverlay(overlayelem, function (action) {
			i_element.innerHTML = overlayelem.innerHTML;
			elemSaver.click(); //to display dialog with the Save flash object                  
		});
		
	});

	i_element.onblur = (function (){  	
		i_element.style.height = '20%';			
	});


	return elemDecoratorDiv;
}


function getSWElementRemover(i_elemToRemove, i_elemHelperToRemove)
{
	var removeBtn = document.createElement("button");
	removeBtn.className = "btn";
	removeBtn.innerHTML="-";
	removeBtn.onclick = (function ()
		{ 
		    removeConfirm = document.createElement("span");
		    removeConfirm.id = "removeConfirm";
		    removeConfirm.className = "infoLabel italics overlay";
		    removeConfirm.appendChild(document.createTextNode("Do you want to remove this section?"));
		    
		    createOverlay(removeConfirm, "300", true, function () 
		    		{ i_elemToRemove.remove(); i_elemHelperToRemove.remove(); }); 
	    });
	return removeBtn;
}

function insertNodeAfter(newNode, afterReferenceNode)
{
	afterReferenceNode.parentNode.insertBefore(newNode, afterReferenceNode.nextSibling);
}


function generateHTMLDiv(className, data, myId)
{
	var d = new Date();
	var uuid = d.getTime();
	
	return '<div id ="' + myId + "_" + className + "_" + uuid + '" class="' + className + '" >' + data + '</div>';
}

function generateHTMLButton(label, className, onClickAction)
{
	return '<input type="button" class="' + className + '" value = "' + label + '" onClick = "' + onClickAction + '">';
}

function generateNewHTMLCode(myType, classFortemplateProblem, myId)
{
	var d = new Date();
	var uuid = d.getTime();
	
	var HTMLCodeText = '<input type="' + myType +'" class="' + classFortemplateProblem  + '" id="' + tmpId
                              + '" value ="">';
	return HTMLCodeText;
}

function generateHTMLCode(myType, classFortemplateProblem, myId)
{
	var d = new Date();
	var uuid = d.getTime();
	
	var textData = document.getElementsByClassName(classFortemplateProblem);
	
	var HTMLCodeText = "";
	for (var index=0; index < textData.length; index++)
	{
		tmpId = myId + "_" + index+1 + "_" + uuid;
		HTMLCodeText = HTMLCodeText + '<input type="' + myType +'" class="' + classFortemplateProblem  + '" id="' + tmpId
		                   + '" value ="' + textData[index].innerHTML + '">';
	}	
	return HTMLCodeText;
}

var CaretCursor = function (element)
{
	this.getCursorXY = function () 
	{
		var win = win || window;
		var doc = win.document;
		var sel = doc.selection, range, rects, rect;
		var x = 0, y = 0;
		if (sel) {
			if (sel.type != "Control") {
				range = sel.createRange();
				range.collapse(true);
				x = range.boundingLeft;
				y = range.boundingTop;
			}
		} else if (win.getSelection) {
			sel = win.getSelection();
			if (sel.rangeCount) {
				range = sel.getRangeAt(0).cloneRange();
				if (range.getClientRects) {
					range.collapse(true);
					rects = range.getClientRects();
					if (rects.length > 0) {
						rect = rects[0];
					}
					
					if (rect)
					{
						x = rect.left;
						y = rect.top;
					}
				}
				// Fall back to inserting a temporary element
				if (x == 0 && y == 0) {
					var span = doc.createElement("span");
					if (span.getClientRects) {
						// Ensure span has dimensions and position by
						// adding a zero-width space character
						span.appendChild( doc.createTextNode("\u200b") );
						range.insertNode(span);
						rect = span.getClientRects()[0];
						if (rect)
						{
							x = rect.left;
							y = rect.top;
						}
						else
						{
							console.log("Failed to get caret cursor postion");
						}
						var spanParent = span.parentNode;
						spanParent.removeChild(span);

						// Glue any broken text nodes back together
						spanParent.normalize();
					}
				}
			}
		}
		return { x: x, y: y };
	}

	this.getCursorPositionOffset = function () 
	{	
		var caretOffset = 0;
		var doc = element.ownerDocument || element.document;
		var win = doc.defaultView || doc.parentWindow;
		var sel;
		
		//make sure has focus
		if (!$(element).is( ":focus" )) 
		{
			element.focus();
		}
		
		if (typeof win.getSelection != "undefined")
		{
			sel = win.getSelection();
			if (sel.rangeCount > 0) 
			{
				var range = win.getSelection().getRangeAt(0);
				var preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(element);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				caretOffset = preCaretRange.toString().length;
			}
		} 
		else if ((sel = doc.selection) && sel.type != "Control")
		{
			var textRange = sel.createRange();
			var preCaretTextRange = doc.body.createTextRange();
			preCaretTextRange.moveToElementText(element);
			preCaretTextRange.setEndPoint("EndToEnd", textRange);
			caretOffset = preCaretTextRange.text.length;
		}
		
		console.log("caret position "+ caretOffset);
		return parseInt(caretOffset);
	}
	
	this.setCursorPosition = function(offset, scrollTopPos)
	{
		$(element).scrollTop(scrollTopPos);	
		
		var range = document.createRange();
		var sel = window.getSelection();

		//select appropriate node
		var currentNode = null;
		var previousNode = null;

		//make sure has focus
		if (!$(element).is( ":focus" )) 
		{
			element.focus();
		}

		for (var i = 0; i < element.childNodes.length; i++) 
		{
			//save previous node
			previousNode = currentNode;

			//get current node
			currentNode = element.childNodes[i];
			//if we get span or something else then we should get child node
			while(currentNode.childNodes.length > 0)
			{
				currentNode = currentNode.childNodes[0];
			}

			//calc offset in current node
			if (previousNode != null && typeof previousNode != undefined) 
			{
				console.log("caluclated offset  " +offset + ","+ currentNode.textContent +"," + previousNode.length);
				if (previousNode.length)
				{ offset -= previousNode.length; }
				
			}
			//check whether current node has enough length
			if (offset <= currentNode.length) 
			{
				break;
			}
		}
		//move caret to specified offset
		if (currentNode != null) 
		{
			console.log("moving caret to " +offset + "of node" + currentNode.textContent);
			if (currentNode.textContent == "")
			{
				console.log("moving caret to " +offset + "of node" + currentNode.textContent);
				offset = 0;
			}
			else if (currentNode.textContent.length < offset)
			{
				offset = currentNode.textContent.length;
			}
			
			range.setStart(currentNode, offset);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
		}
		
	}
}


var SW_SVGScrollBar = function (swElement, SWSvgCanvas, keepContentBorder)
{
	var ScrollBarSize = 15;
	
	var elementToAttach = null;
	var swScrollBar=null;
	var swScrollThumb = null;
	var swBorder = null;
	
	var enableContentBorder = keepContentBorder || true; 
		
	var mouseMoveFunction = null;
	var mouseWheelFunction = null;
	
	var requireVertScrollBar = function ()
	{
		if(elementToAttach.scrollHeight > elementToAttach.clientHeight)
		{
			//alert("Scroll bar present" + elementToAttach.scrollHeight +","+ elementToAttach.clientHeight);
			return true;			
		}
		
		return false;
	}
	
	var resetBorder = function ()
	{
		if (!enableContentBorder)
		{	
			return false;
		}
		
		if (swBorder)
		{
			swBorder.remove();
			swBorder = null;
		}

		if (swElement.shape)
		{
			var bbox =  swElement.shape.getBBox(1);
			swBorder = SWSvgCanvas.getSvgAsSnap().rect(bbox.x-3, bbox.y-3, 
					bbox.width+6, bbox.height+6, 0, 0).attr({ stroke: '#123456', 'strokeWidth': 4, "stroke-opacity": 0.2,  "fill-opacity": 0 });

			SWSvgCanvas.makeHelper(swBorder);
			swElement.shape.before(swBorder);

			//apply tranformation on border
			swBorder.attr({ transform: swElement.shape.transform().localMatrix.toTransformString() });
		}
	}
	
	var resetVertScrollThumb = function ()
	{
		if (!requireVertScrollBar())
		{
			return;
		}
		
		var thumbSVGPos = calculateTumbPosition();
		
		swScrollThumb.attr({
			x: thumbSVGPos.x,
			y: thumbSVGPos.y,
			height: thumbSVGPos.height,
		});	
	}
	
	var resetScrollBar = function ()
	{	
		resetBorder();
	
		if ((!requireVertScrollBar() && swScrollBar) || (!swElement.shape && swScrollBar))
		{
			
			swScrollBar.remove();
			swScrollThumb.remove();
			swScrollBar = null;
			swScrollThumb = null;
			
			return false;
		}
		else if ((!swScrollBar || !swScrollBar.node.parentNode) && requireVertScrollBar())
		{
			//object present bit onn attach to canvas this is the case when somehow scrollbar is deleted from canvas
			if (swScrollBar && !swScrollBar.node.parentNode)
			{
				swScrollBar.swUndrag();
				swScrollThumb.swUndrag();				
			}
		
			swScrollBar = null;
			swScrollThumb = null;
			
			var scrollBarSVGPos = getVertScrollPosition();
			var thumbSVGPos = calculateTumbPosition();
			
			swScrollBar = SWSvgCanvas.getSvgAsSnap().rect(scrollBarSVGPos.left, scrollBarSVGPos.top,
					scrollBarSVGPos.width, scrollBarSVGPos.height, 0, 0).attr({ stroke: '#123456', 'strokeWidth': 0.05, fill: "gray",  "fill-opacity": 0.1 });

			swScrollThumb = SWSvgCanvas.getSvgAsSnap().rect(thumbSVGPos.x, thumbSVGPos.y, 
					scrollBarSVGPos.width, thumbSVGPos.height, 6, 6).attr({ stroke: '#123456', 'strokeWidth': 0.05, fill: "gray", "fill-opacity": 0.3 });
			
			applyTransformation();
			
			SWSvgCanvas.makeHelper(swScrollBar);
			SWSvgCanvas.makeHelper(swScrollThumb);
			
			swElement.shape.after(swScrollBar);
			swScrollBar.after(swScrollThumb);
			
			//resetScrollBar() set this callback
			var isScrollingStarted = false;
			
			var onScrollStart = function ()
			{
				isScrollingStarted = true;
			}
			
			var onScroll = function (dx, dy, x, y, evt)
			{
				if (isScrollingStarted)
				{
					moveVerticalScrollBar(evt, elementToAttach)
					console.log("Scrolling");
				}
			};
			
			var onSrollStop = function ()
			{
				isScrollingStarted = false;
			}
			
			swScrollBar.swDrag(onScroll,onScrollStart, onSrollStop);
			swScrollThumb.swDrag(onScroll,onScrollStart, onSrollStop);

			$(swScrollBar.node).mouseover(resetVertScrollThumb);

			return true;
		}
		else if (swScrollBar)
		{
			var scrollBarSVGPos = getVertScrollPosition();
						
			swScrollBar.attr({
				x: scrollBarSVGPos.left,
				y: scrollBarSVGPos.top,
				width: scrollBarSVGPos.width,
				height: scrollBarSVGPos.height,    			
			});
			
			resetVertScrollThumb();
			
			applyTransformation();
			
			return true;
		}
		
		return false;			
	}
	
	var getScrollBarSize = function ()
	{
		//return elementToAttach.offsetWidth - elementToAttach.clientWidth;
		return ScrollBarSize;
	}
	
	var getVertScrollPosition = function ()
	{	
		var scrollBarSize = getScrollBarSize();
		var elemBbox =  swElement.shape.getBBox(1);
		
		var scrlTop = elemBbox.y;
		var scrlBottom = elemBbox.y2;	
		var scrlLeft = elemBbox.x2 - scrollBarSize;
		var scrlRight = elemBbox.x2;
		var scrlHight = elemBbox.height;
		var scrlWidth = scrollBarSize;
		
		return { top : scrlTop, bottom: scrlBottom, left : scrlLeft, right : scrlRight, height : scrlHight, width: scrlWidth }
	}
	
	var isEventOnScrollBar = function (event)
	{
		if (!requireVertScrollBar())
		{
			return false;
		}
		
		var vertScrollBarPos = getVertScrollPosition();
		var evtSvgPoint = SWSvgCanvas.convertToSVGPoint(event.pageX, event.pageY, SW_CORD_SYSTEM_TYPE.HTML, swElement.shape);
		//if (event.pageX<(elementToAttach.getBoundingClientRect().right-scrollBarSize))
		//if (evtSvgPoint.x < (swElement.shape.getBBox(1).x2 - scrollBarSize))
		
		if (evtSvgPoint.x < vertScrollBarPos.left && evtSvgPoint.x > vertScrollBarPos.right && 
				evtSvgPoint.y < vertScrollBarPos.top && evtSvgPoint.y > vertScrollBarPos.bottom)
		{
			console.log("Event is not  on scrollbar");
			return false;
		}
		
		return true;
	}
	
	var applyTransformation = function ()
	{
		swScrollBar.attr({ transform: swElement.shape.transform().localMatrix.toTransformString() });
		swScrollThumb.attr({ transform: swElement.shape.transform().localMatrix.toTransformString() });
	}
		
	var calculateTumbPosition = function()
	{
			
		var thumbPosition = $(elementToAttach).scrollTop();
		var elemScrollHeight = elementToAttach.scrollHeight;
		var scrollBarSVGPos = getVertScrollPosition();
		
		var cordX = scrollBarSVGPos.left;// + scrollBarHTMLPos.width/2;
		var cordY = scrollBarSVGPos.top;
			
		//console.log("thumbPosition : x: " + cordX + ", y: " + cordY);
		if (thumbPosition != 0)		
		{
			var elemScrollHeight = elementToAttach.scrollHeight;
			percent =  Math.round(thumbPosition *100/elemScrollHeight);
			cordY =(percent * scrollBarSVGPos.height)/100 + scrollBarSVGPos.top;
		}
		
		var thumbHeight = scrollBarSVGPos.height/(elemScrollHeight/scrollBarSVGPos.height);
		var thumbBottom = cordY + thumbHeight;
		
		return { x: cordX, y: cordY, height: thumbHeight, bottom: thumbBottom };
	}
	
	var moveVerticalScrollBar = function(event, elementToAttach) 
	{	
			if (isEventOnScrollBar(event))
			{ 
				moveVertScrollBar(event.pageX, event.pageY, elementToAttach);
			}
	}
	
	var moveVertScrollBar =  function(x,y, elementToAttach) 
	{
		var elemScrollHeight = elementToAttach.scrollHeight;
		var pos = getVertScrollPosition();
		var evtSvgPoint = SWSvgCanvas.convertToSVGPoint(x,y, SW_CORD_SYSTEM_TYPE.HTML, swElement.shape);

		//var percent = Math.round((event.pageY - pos.top)*100/pos.height);
		var percent = Math.round((evtSvgPoint.y - pos.top)*100/pos.height);
		console.log ("Calculated percentage" + percent + "displayHeight" + pos.height);

		var thumbNewY = 0;


		if (percent > 100)
		{
			return;
		}
		if (percent <= 0) 
		{
			$(elementToAttach).scrollTop(0);
			thumbNewY = pos.top;
		}
		else
		{
			$(elementToAttach).scrollTop((elemScrollHeight * percent)/100);	

			var thumbHeight = parseInt(swScrollThumb.attr('height'));
			var thumbNewBottom = parseInt(evtSvgPoint.y) + thumbHeight;

			thumbNewY = thumbNewBottom < pos.bottom ? evtSvgPoint.y : pos.bottom - thumbHeight;
		}


		swScrollThumb.attr({
			//	x: thumbSVGPosXY.x,
			y: thumbNewY,
		});
        //console.log("thumb bottom" + thumbNewBottom + ", scrollbar bottom" + pos.bottom);

		return true;
	};

	var init = function()
	{
		elementToAttach = swElement.getEditableElement();	
		
		//element.style.overflow = "auto";
		//changing element property
		elementToAttach.style.overflow = "hidden";		

		mouseMoveFunction = function (evt) 
		{
			resetScrollBar();
		}
		
		mouseWheelFunction = function(event)
		{
			event.preventDefault();	
			var delta = parseInt(event.originalEvent.wheelDelta/60 || -event.originalEvent.detail/2);
		
			//console.log("Mouse wheel action:" +delta);
			var currentTop = $(elementToAttach).scrollTop();
			$(elementToAttach).scrollTop(currentTop -(delta * 60));
		
			resetVertScrollThumb();
		
		}
		
		$(elementToAttach).bind('mousemove', mouseMoveFunction);	
		$(elementToAttach).bind('mousewheel DOMMouseScroll', mouseWheelFunction);
	}
	
	this.scrollToBottom = function()
	{	
		elementToAttach.scrollTop = elementToAttach.scrollHeight;
		resetScrollBar();
	}
	
	this.scrollToCaret = function()
	{
		var caretCorsor = new CaretCursor(elementToAttach);
		var cursorXY = caretCorsor.getCursorXY();
		var scrollBarPos = getVertScrollPosition();
		var evtSvgPoint = SWSvgCanvas.convertToSVGPoint(cursorXY.x,cursorXY.y, SW_CORD_SYSTEM_TYPE.HTML, swElement.shape);

		console.log("carset XY" + cursorXY.x+", "+ cursorXY.y+", "+scrollBarPos.bottom);
		console.log("carset XY" + evtSvgPoint.x+", "+ evtSvgPoint.y+", "+scrollBarPos.bottom);
		if(scrollBarPos.bottom <= (evtSvgPoint.y)+40) //tolarance
		{		
			var myScrollTop = $(elementToAttach).scrollTop();
			$(elementToAttach).scrollTop(myScrollTop+30);
			resetScrollBar();
		}
	}

	this.reInit = function() 
	{
		if (mouseMoveFunction) { $(elementToAttach).unbind('mousemove', mouseMoveFunction); }
		if (mouseWheelFunction) { $(elementToAttach).unbind('mousewheel DOMMouseScroll', mouseMoveFunction); }
		init();
		resetScrollBar();		
	}
	
	this.reset = function()
	{
		resetScrollBar();		
		console.log("scrollbar resized");
	}
	
	init();
}

var SW_FileOpener = function()
{
    var handleFileSelect = function(evt, i_fileReadNotifyCallback) 
    {
        var fileInfo = { fileName: "", fileHeader: null, fileData: null };
        
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
                    var fileHeader = document.createElement("div");
                    var fileData = document.createElement("div");
                   
                    fileHeader.innerHTML = "";
                    fileHeader.appendChild(headerString);
                    fileData.innerHTML = htmlDoc.body.outerHTML;
                    
                    fileInfo.fileName = theFile.name;
                    fileInfo.fileHeader = fileHeader;
                    fileInfo.fileData = fileData;
                  //  alert(":"+fileInfo.fileName);
                    if (i_fileReadNotifyCallback)
                    {
                        i_fileReadNotifyCallback(fileInfo);
                    }
                    //fileData.innerHTML = e.target.result;
                };
            })(f);

            // Read in the  file as a data text.
            reader.readAsText(f);
        }
        
        return fileInfo;
    }
    
    this.readFile = function(i_fileReadNotifyCallback)
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
                        i_objToAttachFile.innerHTML = i_objToAttachFile.innerHTML.trim();     //callback fucion for close overlay
                        // alert(i_objToAttachFile.innerHTML);
                    }
                });
        
        fileInput.addEventListener('change', function (evt) { 
                           var fileInfo = handleFileSelect(evt, i_fileReadNotifyCallback); 
                          // alert(":"+fileInfo.fileName);
                            $("#" + myOverlayDiv.id ).dialog("close"); 
                            return;
        }, false);

    }
}

var SW_FileSaver = function()
{
	var getHeaderTags = function (header)
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

	var attachHTMLTags = function (header, content) 
	{
		var htmlStartTag = getHeaderTags(header);
		var htmlEndTag = "\n</BODY>\n</HTML>";	
		//alert(htmlStartTag + content + htmlEndTag);
		return htmlStartTag + content + htmlEndTag;
	}

	var saveUsingHTML5 = function (content, header, fileName)
	{

		var tmpContent = content.innerHTML;
		if (typeof content == "string")	
		{
			tmpContent = content;
		}

		var mycontent = attachHTMLTags(header.innerHTML, tmpContent);

		var tmp = document.createElement("div");
		tmp.id = "tmp";

		var fileNameContainor = document.createElement("span");
		fileNameContainor.className = "infoLabel italics overlay";
		fileNameContainor.appendChild(document.createTextNode("File Name : "));

		var myFileName = document.createElement("input");
		myFileName.type = "text";
		myFileName.className = "infoLabel italics overlay enableBackSpace";
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
			else
			{
			    $(saveAsLink).triggerHandler('contextmenu');
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

		var overlayDiv = createOverlay(tmp, "555", false, function(status) { /*on close callback function do nithing*/}, false);	
	}

	var saveUsingDonloadify = function (content, header, fileName) 
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
	
	this.saveHTMLFile = function (content, header, fileName)
	{	
		//saveUsingDonloadify(content, header, fileName);	
		saveUsingHTML5(content, header, fileName)
	}

}