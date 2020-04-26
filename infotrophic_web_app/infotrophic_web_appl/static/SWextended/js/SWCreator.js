//Require SWCommon.js
var ELEM_HIDE_HEIGHT = 20;


function laodSWCreator()
{
	//var introduction = document.getElementById( 'introduction' );
	//attachInlineCKEditor(introduction);
	
	var documentRoot = document.body;
	HTMLPage = document.createElement("div");
	HTMLPage.id = "HTMLPage";
	documentRoot.appendChild(HTMLPage);	
	container = addContainer(HTMLPage);
	//attachInlineCKEditor(container);
}

function htmlDecode(input)
{
	  var e = document.createElement('div');
	  e.innerHTML = input;
	  return e.childNodes[0].nodeValue;
}

function htmlencode(input)
{
	  //alert(input)
	 /* var e = document.createElement('div');
	  e.innerHTML = input;
	  alert( e.innerHTML);*/
	  return  input;
}

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
	if(toolFrame.contentWindow)
	{
		reqJS = toolFrame.contentWindow.getReqJsForTool();
	}
	else if(toolFrame.contentDocument)
	{
		reqJS = toolFrame.contentDocument.getReqJsForTool();
	}
	
	//alert("REQjs"+ reqJS);
	return reqJS;

}

function getHTMLCode(toolFrame, toolAPItoGenerateCode)
{
	
	//eval(toolAPItoGenerateCode + '()');
	//var el = document.getElementById('targetFrame');
	var htmlCode = "";
	if(toolFrame.contentWindow)
	{
		htmlCode = toolFrame.contentWindow.SWToolCodeGenerator();
	}
	else if(toolFrame.contentDocument)
	{
		htmlCode = toolFrame.contentDocument.SWToolCodeGenerator();
	}
	
	//alert(htmlCode);
	return htmlCode;
	
}

function getTools(CKeditor, objHeader, OverlayCloseMe)
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
			var html = getHTMLCode(ifrmTool, toolAPItoGenerateCode);  				
	
			if (!html || html == "")
			{
				return false;
			}
			
			addJScript(objHeader, reqJS);		
			
			var newElement = CKEDITOR.dom.element.createFromHtml(html, CKeditor.document);
			CKeditor.insertElement(newElement);		
			closeOverlay(OverlayCloseMe);
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
		toolsSelect.add(myToolOption);	
	}
	
	myTools.appendChild(document.createTextNode("Select Tool: "));	
	myTools.appendChild(toolsSelect);
	myTools.appendChild(addToolBtn);
	myTools.appendChild(document.createElement("br"));
	myTools.appendChild(document.createElement("br"));
	myTools.appendChild(toolDisplayDiv);
	
	return myTools;
}

function openTools(CKeditor, objHeader)
{
	var toolsDiv = document.createElement("span");
	toolsDiv.id = "Tools";
	toolsDiv.className = "infoLabel italics overlay";
    
	
	ToolsOverlayDiv = createOverlay(toolsDiv, "96%", false, function () { /*noting done*/});	
	setOverlayTitle(ToolsOverlayDiv, "InfoTrophic Tools");

	var myTools = getTools(CKeditor, objHeader, ToolsOverlayDiv);
	toolsDiv.appendChild(myTools);
	
	return ToolsOverlayDiv;
}

function closeTools(CKeditor)
{
	

}

function createEditorOverlay(objToShow, objHeader, actionCallBack)
{
	var overlayEditorDiv = document.createElement("div");
	overlayEditorDiv.name = "overlayEditorDiv";
	overlayEditorDiv.id = "overlayEditorDiv";	
	performCallbackAction = false;
	var toolsDiv;
	
	overlayEditorDiv.appendChild(objToShow);	
	objToShow.style.height =  $("#overlayEditorDiv").parent().height();
	top = "{ my: 'top', at: 'top'  }";
	
	document.body.appendChild(overlayEditorDiv);
	//myHeight = $(window).height()-105; //720;	
	myHeight = screen.height;
	var editor = attachInlineCKEditor(objToShow);

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
		title: "InfoTrophic",
		zIndex: 3999,
		//zIndex: -1,
		height : myHeight,
		width : "99%",
		position : top,
		draggable : false,
		//resizable: false,
		autoResize:false,
		//overflow : "hidden",
		closeOnEscape: false,
		stack: true,
		beforeClose : function(event, ui)
		{
			//objToShow.innerHTML = editor.getData();	 
			//$(this).dialog('destroy').remove();
		},

		close: function(event, ui)
		{
			
			if (toolsDiv)
			{
				$("#" + toolsDiv.id).dialog("close");
			}	
			
			objToShow.innerHTML = editor.getData();	 
			actionCallBack("CLOSE");						
			$(this).dialog('destroy').remove();	
		},

		buttons: 
		{	
			"Tools" : {
				//class: "smallbutton",
				id: "toolsButton",
				name: "toolsButton",
				//icons: { primary: 'ui-icon-disk'  },
				text: "Tools",
				title: "Tools",				 
				click: function () { 
				    toolsDiv = openTools(editor, objHeader);
				}     
				
			},
			
			"Save": {   				
				//class: "smallbutton",
				id: "saveButton",
				name: "saveButton",
				//icons: { primary: 'ui-icon-disk'  },
				text: "Save",
				title: "Save",				 
				click: function () {
					objToShow.innerHTML = editor.getData();	
					actionCallBack("SAVE");
				}     
				
			},
			
			"Done": {
				id: "doneButton",
				name: "doneButton",
				//icons: { primary: 'ui-icon-disk'  },
				text: "Done",
				title: "Done",
				click: function () {
					performCallbackAction = true;
					toggleScreeen("ExitFullScreen");
					$(this).dialog("close");
				}
			},
			
		}
	}).fadeIn(300);
	setTimeout(function(){CKEDITOR.replace('ckedt-hiddenForms')},350);;

	$("#overlayEditorDiv").dialog("open");
	editor.config.height = "82%";     
	$(".ui-dialog-titlebar").hide();
	objToShow.focus();	
        
	origDocumentHeight = $(window).height()-105; //720;	
	$(".ui-dialog-titlebar-close").css('visibility','hidden');
	//alert(origDocumentHeight);
	toggleScreeen("BecomeFullScreen");	
    fullScreenChangeDetect(origDocumentHeight, overlayEditorDiv, function (isFullScreen)
    		     	            { if (!isFullScreen) { $("#overlayEditorDiv").dialog("close"); } });
}

function attachInlineCKEditor(i_elem)
{
    //element with "contenteditable" attribute set to "true".
	// Otherwise CKEditor will start in read-only mode.
	i_elem.contentEditable = "true";
	
   var editor = CKEDITOR.replace(i_elem.id , {
		// Allow some non-standard.
		//extraAllowedContent: 'a(documentation);abbr[title];code',
		removePlugins: 'preview, print, save, about, elementspath, newpage, maximize',
		extraPlugins: 'mathjax',
		//extraAllowedContent: 'strong[onclick]',
		//extraPlugins: 'sourcedialog',
		// Show toolbar on startup (optional).
		startupFocus: true
	} );

	CKEDITOR.config.resize_enabled = false;
	CKEDITOR.config.mathJaxLib = '//cdn.mathjax.org/mathjax/2.2-latest/MathJax.js?config=TeX-AMS_HTML';
	CKEDITOR.config.title = false;
	CKEDITOR.config.allowedContent = true;
	CKEDITOR.config.toolbar = 'Full';
    CKEDITOR.config.uiColor = '#E6CCCC';  
    CKEDITOR.config.baseFloatZIndex = 9000;
    
        //CKEDITOR.config.width = '75%';   // CSS unit (percent).        
	CKEDITOR.on('instanceReady',
		      function( evt )
		      {
		         editor = evt.editor;
		         //editor.execCommand('maximize');
		      });
		      
  //  CKEDITOR.config.removePlugins = 'maximize';
		      
    return editor;
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

function getElement()
{
	var d = new Date();
	var time = d.getTime();

	var elementDiv = document.createElement("div");	
	elementDiv.className = "SWCreatorElem";	
	elementDiv.id = "SWC_Element_" + time;
	elementDiv.contentEditable = "true";

	return elementDiv;
}


function getElementHeader()
{
	var d = new Date();
	var time = d.getTime();

	var elementHeaderDiv = document.createElement("div");	
	elementHeaderDiv.className = "SWCreatorElemHeader";	
	elementHeaderDiv.id = "SWC_ElementHeader_" + time;
	elementHeaderDiv.contentEditable = "true";

	return elementHeaderDiv;
}

function getElementDecorator(i_element, i_elementHeader, i_fileName, i_elementContainer, i_elementHelper)
{
	var elemRemover = getElementRemover(i_element, i_elementContainer);
	var elemDispTogger = getDisplaytoggler(i_element, i_elementHeader);
	var elemOpener = getElementOpener(i_element, i_elementHeader, i_fileName);
	var elemSaver = getElementSaver(i_element, i_elementHeader, i_fileName);
	
	//var elemTypeSetter = getElementTypeSetter(i_element);
	//var elemAlignSetter = getElementAlignSetter(i_element);
	
	var elemDecoratorDiv = document.createElement("span");
	elemDecoratorDiv.style.display = "none";
	elemDecoratorDiv.style.float = "right";

	elemDecoratorDiv.appendChild(elemRemover);
	elemDecoratorDiv.appendChild(elemDispTogger);
	elemDecoratorDiv.appendChild(elemOpener);
	elemDecoratorDiv.appendChild(elemSaver);
	
	//elemDecoratorDiv.appendChild(elemTypeSetter);
	//elemDecoratorDiv.appendChild(elemAlignSetter);
	
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
					
		createEditorOverlay(overlayelem, i_elementHeader, function (action) {
			i_element.innerHTML = overlayelem.innerHTML;
			elemSaver.click(); //to display dialog with the Save flash object                  
		});
		
	});

	i_element.onblur = (function (){  	
		i_element.style.height = '20%';			
	});


	return elemDecoratorDiv;
}

function getDisplaytoggler(i_elemToToggleDisplay,  i_elemHeaderToToggleDisplay)
{
	var origalHeight = i_elemToToggleDisplay.offsetHeight;
	//alert(":"+origalHeight);
	
	var toggleBtn = document.createElement("button");
	toggleBtn.className = "btn";
	toggleBtn.innerHTML ="Hide";

	toggleBtn.onclick = (function (evt) {
		
	//	alert(":"+origalHeight );
		return (function (evt) {

			if (i_elemToToggleDisplay.offsetHeight != ELEM_HIDE_HEIGHT
					                         && i_elemToToggleDisplay.offsetHeight != 0)	
			{  
				origalHeight = i_elemToToggleDisplay.offsetHeight;

			}


			if (toggleBtn.innerHTML == "Hide")
			{ 		
				i_elemHeaderToToggleDisplay.style.display = "none";	
				i_elemToToggleDisplay.style.height = ELEM_HIDE_HEIGHT;				
				toggleBtn.innerHTML ="Show";
			}
			else
			{			
				i_elemHeaderToToggleDisplay.style.display = "";	
				i_elemToToggleDisplay.style.height = origalHeight;
				toggleBtn.innerHTML ="Hide";
			}
		})(evt, origalHeight);

	});

	return toggleBtn;
}

function getElementRemover(i_elemToRemove, i_elemHelperToRemove)
{
	var removeBtn = document.createElement("button");
	removeBtn.className = "btn";
	removeBtn.innerHTML="-";
	removeBtn.onclick = (function ()
		{ 
		    removeConfirm = document.createElement("span");
		    removeConfirm.id = "removeConfirm";
		    removeConfirm.className = "infoLabel italics overlay";
		    removeConfirm.appendChild(document.createTextNode("Do you want to remove the page?"));
		    
		    createOverlay(removeConfirm, "300", true, function () 
		    		{ i_elemToRemove.remove(); i_elemHelperToRemove.remove(); }); 
	    });
	return removeBtn;
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
	//var filesystem = null;

	//alert(content);
	//var fileName = prompt("Please enter file name to save:");

	/*var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
	saveAs(blob, fileName);*/
    /*var a = document.createElement("a");
	document.body.appendChild(a);
	var file = new Blob([content], {type: "text/html;charset=utf-8"});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();*/

	//////////////////////////////////////////////
	// assumes variable data, which is a homogenous collection of objects

	
	

	// trick browser into downloading file
	/*var uriContent = "data:application/octet-stream," + encodeURIComponent(content);
	var myWindow = window.open(uriContent, "Nutrient CSV");
	myWindow.focus();*/
	
	
	
	////////////
	
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
			
	var overlayDiv = createOverlay(tmp, "355", false, function() { /*on close callback function do nithing*/});
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
	/*
	//var exportButton = $( "#fileSaveBtn");
	var exportButton = $( "#" + downloadElement.id);

	var exportButtonWidth = exportButton.outerWidth();
	var exportButtonHeight = exportButton.outerHeight();

	var flashObject = $( '[name^="downloadElement"]' );

	
	// Set the Flash object to the same size as my button
	flashObject.css( { width: exportButtonWidth, height: exportButtonHeight } );

	var exportButtonPosition = flashObject.position();
	//alert(flashObject.top());
	
	if (exportButtonPosition)
	{
		// Set my button directly underneath the Flash object
		exportButton.css( 
				{ 
					top: exportButtonPosition.top, 
					left: exportButtonPosition.left,					
					position: 'absolute', 'z-index': -1
				});
	}
	*/
}


function getFileOpener(i_elemToOpenIn, i_elemHeaderToOpenIn, i_fileName)
{
	var fileOpenBtn = document.createElement("button");
	fileOpenBtn.id = "fileOpenBtn";
	fileOpenBtn.innerHTML = "Open";
	fileOpenBtn.onclick = (function () { readFile(i_elemToOpenIn, i_elemHeaderToOpenIn, i_fileName); });
	
	return fileOpenBtn;
}


function readFile(i_objToAttachFile, i_elemHeaderToOpenIn, i_fileName)
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
	

	var myOverlayDiv = createOverlay(fileInputDiv, "420", false, function (evt)
			{ 
	        	i_objToAttachFile.innerHTML = i_objToAttachFile.innerHTML.trim();	  //callback fucion for close overlay
		// alert(i_objToAttachFile.innerHTML);
			});
	
	fileInput.addEventListener('change', function (evt) { 
		                handleFileSelect(evt, i_objToAttachFile, i_elemHeaderToOpenIn, i_fileName); 
		                $("#" + myOverlayDiv.id ).dialog("close"); 
		                }, false);

}

function getElementTypeSetter(i_elemToTypeSet)
{
	var optionAarray = ["Heading", "Content", "Table", "Tool"];

	var elemTypeSetter = document.createElement("select");

	elemTypeSetter.onchange = (function () {

		if (i_elemToTypeSet.className.trim() == "SWCratorTag_Table")
		{			
			i_elemToTypeSet.innerHTML = "";
		}

		var index = elemTypeSetter.selectedIndex;
		if (elemTypeSetter[index].value.match(/heading/i))
		{
			i_elemToTypeSet.className = "SWCratorTag_Heading";		
		}
		else if (elemTypeSetter[index].value.match(/table/i))
		{
			i_elemToTypeSet.className = "SWCratorTag_Table";
			i_elemToTypeSet.innerHTML = "";
			var myTable = getTable();
			i_elemToTypeSet.appendChild(myTable);
		}
		else if (elemTypeSetter[index].value.match(/tool/i))
		{

		}
		else
		{
			i_elemToTypeSet.className = "SWCratorTag_Content";

		}

		i_elemToTypeSet.focus();

	});

	//Create and append the options
	for (var i = 0; i < optionAarray.length; i++) 
	{
		var option = document.createElement("option");
		option.value = optionAarray[i];
		option.text = optionAarray[i];
		elemTypeSetter.appendChild(option);
	}

	return elemTypeSetter;
}

function getElementAlignSetter(i_elemToSetAlign)
{
	var optionAarray = ["Left", "Center", "Right"];
	var elemAlignSetter = document.createElement("select");

	elemAlignSetter.onchange = (function () {
		var index = elemAlignSetter.selectedIndex;
		if (elemAlignSetter[index].value.match(/Center/i))
		{
			i_elemToSetAlign.align = "center";
			//addHeading(i_nodeToappend, i_SWCP_nodeToappend, i_elemAdder[index].value);
		}
		else if (elemAlignSetter[index].value.match(/Right/i))
		{
			i_elemToSetAlign.align = "right";
			//addContent(i_nodeToappend, i_SWCP_nodeToappend, i_elemAdder[index].value);
		}
		else
		{
			i_elemToSetAlign.align = "left";
		}

		i_elemToSetAlign.focus();
	});
	//Create and append the options
	for (var i = 0; i < optionAarray.length; i++) 
	{
		var option = document.createElement("option");
		option.value = optionAarray[i];
		option.text = optionAarray[i];
		elemAlignSetter.appendChild(option);
	}

	return elemAlignSetter;
}

function getContainorAdder(i_insertAfter)
{
	var containorAdder = document.createElement("div");
	var addBtn = document.createElement("button");
	addBtn.id = "addSectionBtn";
	addBtn.className = "btn";
	addBtn.innerHTML="+";
	addBtn.onclick =(function (){ addContainer(i_insertAfter); });

	containorAdder.appendChild(addBtn);
	return containorAdder;	
}
