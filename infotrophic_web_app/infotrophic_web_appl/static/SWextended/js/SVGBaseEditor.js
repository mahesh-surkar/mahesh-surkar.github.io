var SW_TOOL_WINDOW= {
		ARROW_PICK:100,
};

var TOOLBAR_TYPE = {
		LEFT_TOOLBAR:1,
		RIGHT_TOOLBAR:2,
		TOP_TOOLBAR:3,
		BOTTOM_TOOLBAR:4,
}

function loadSimpleCanvas(elem)
{
	var svgCanvasToolbar = document.createElement("div");
	svgCanvasToolbar.id = "svgCanvasToolbar";
	
	var swCanvas = new SW_Canvas(svgCanvasToolbar);
	var swEditableArea = swCanvas.getActiveSvgEditableArea();
	

	var menubarContainer = document.createElement("div");	
	var objectContainer = document.createElement("div");
	var properyContainer = document.createElement("div");
	var canvasContainer = document.createElement("div");
		
	var editor = new SW_CanvasEditor(swCanvas, canvasContainer, menubarContainer, objectContainer);	

	 var controls = new SW_Controls(editor, swCanvas);
	 loadControls(controls);
	
	canvasContainer.appendChild(swEditableArea);
	

	document.body.appendChild(menubarContainer);
	document.body.appendChild(objectContainer);	
	document.body.appendChild(svgCanvasToolbar);
	document.body.appendChild(canvasContainer);
	
	//var editorDisplay = new SW_Display;
	//editorDisplay.appendElement(editorLayout);
}

//
function loadEditor()
{	
	var svgCanvasToolbar = document.createElement("div");
	svgCanvasToolbar.id = "svgCanvasToolbar";
	
	var swCanvas = new SW_Canvas(svgCanvasToolbar);
	var swEditableArea = swCanvas.getActiveSvgEditableArea();
	
	var editor = new SW_Editor(swCanvas);
	var editorLayout = editor.createEditorLayout(svgCanvasToolbar);
	
	var controls = new SW_Controls(editor, swCanvas);	

	loadControls(controls);

	var editorDisplay = new SW_Display;
        editorDisplay.appendElement(editorLayout);

        swCanvas.setViewBox();
        editor.makeEditableAreaScalable();	
}


var loadControls = function(controls)
{
	controls.addSlideMenu(TOOLBAR_TYPE.TOP_TOOLBAR, new SW_SVG_ICON(SVG_SLIDES, true), "Slides", null);
	controls.addMenu(TOOLBAR_TYPE.TOP_TOOLBAR, new SW_SVG_ICON(SVG_SOURCE), "Source", SVG_SOURCE);
	controls.addMenu(TOOLBAR_TYPE.TOP_TOOLBAR, new SW_SVG_ICON(SVG_OPEN), "Open", SVG_OPEN);
	controls.addMenu(TOOLBAR_TYPE.TOP_TOOLBAR, new SW_SVG_ICON(SVG_SAVE), "Save", SVG_SAVE);
	controls.addMenu(TOOLBAR_TYPE.TOP_TOOLBAR, new SW_SVG_ICON(SVG_UNDO), "Undo", SVG_UNDO);	
	controls.addMenu(TOOLBAR_TYPE.TOP_TOOLBAR, new SW_SVG_ICON(SVG_REDO), "Redo", SVG_REDO);	
	
	controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_ELLIPSE), "Ellipse",SVG_ELLIPSE);	
	controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_RECTANGLE), "Rectangle",SVG_RECTANGLE);	
	controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_LINE), "Line",SVG_LINE);
	controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_POLYLINE), "Polyline",SVG_POLYLINE);
	controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_CUBIC_CURVE), "Curve Connector", SVG_CUBIC_CURVE);
	controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_ARC), "Arc", SVG_ARC);
	controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_TEXT), "Text", SVG_TEXT);	
	controls.addTableMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_TABLE, true), "Table", { rows:15, cols:15 } );
	
	var arrowMenu = controls.addMenu(TOOLBAR_TYPE.LEFT_TOOLBAR, new SW_SVG_ICON(SVG_RIGHT_ARROW, true), "", SVG_NONE, null,  true);	
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_LEFT_THIN_ARROW), "Left Arrow", SVG_LEFT_THIN_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_RIGHT_THIN_ARROW), "Right Arrow", SVG_RIGHT_THIN_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_LEFT_RIGHT_THIN_ARROW), "Left Right Arrow", SVG_LEFT_RIGHT_THIN_ARROW);
	controls.splitLine(arrowMenu);	
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_LEFT_ARROW), "Left Arrow", SVG_LEFT_ARROW);	
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_RIGHT_ARROW), "Right Arrow", SVG_RIGHT_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_LEFT_RIGHT_ARROW), "Left Right Arrow", SVG_LEFT_RIGHT_ARROW);
	controls.splitLine(arrowMenu);	
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_TOP_CURVE_ARROW), "Top Curve Arrow", SVG_TOP_CURVE_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_DOWN_CURVE_ARROW), "Down Curve Arrow", SVG_DOWN_CURVE_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_TOP_DOWN_CURVE_ARROW), "Top Down Arrow", SVG_TOP_DOWN_CURVE_ARROW);
	controls.splitLine(arrowMenu);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_LEFT_CURVE_ARROW), "Left Curve Arrow", SVG_LEFT_CURVE_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_RIGHT_CURVE_ARROW), "Right Curve Arrow", SVG_RIGHT_CURVE_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_LEFT_RIGHT_CURVE_ARROW), "Left Right Curve Arrow", SVG_LEFT_RIGHT_CURVE_ARROW);
	controls.splitLine(arrowMenu);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_LEFT_DOWN_CURVE_ARROW), "Left Down Arrow", SVG_LEFT_DOWN_CURVE_ARROW);
	controls.addSubMenu(arrowMenu, new SW_SVG_ICON(SVG_TOP_RIGHT_CURVE_ARROW), "Top Right Arrow", SVG_TOP_RIGHT_CURVE_ARROW);
	controls.splitLine(arrowMenu);
	
}
//************************************************************************
var SW_SlideWindow = function (swCanvas, editor)
{
	this.swCanvas = swCanvas;
	this.myEditor = editor;
	var selectedSlide = null;
	
	this.resetSlides = function (slideMenu, activeSlide)
	{
		//this.swCanvas.changeActiveSvgCanvasTo(activeSlide);
		//this.myEditor.changeEditableArea();
		this.createSlides(slideMenu);
	}
	
	var addNewSlide = function (slideMenu, slideNumber)
	{
		this.swCanvas.addNewSWSvgCanvas(slideNumber+1);
		this.resetSlides(slideMenu, slideNumber+1);
		console.log("added slide");
	}
	
	var removeSlide = function (slideMenu, slideNumber)
	{
		this.swCanvas.removeSWSvgCanvas(slideNumber);
		this.resetSlides(slideMenu, slideNumber-1);
	}
	
	var slideEventHandler = function (slideNumber, evt, slideCtrlBtn)
	{
		//return;
		
		if (evt.type == "click")
		{
			if (slideNumber == "addSlide")
			{
				this.swCanvas.appendSWSvgCanvas();
		//		this.swCanvas.changeActiveSvgCanvasTo(1);
		//		this.myEditor.changeEditableArea();
				console.log("added slide");
			}
			else
			{
				this.swCanvas.changeActiveSvgCanvasTo(slideNumber);
				this.myEditor.changeEditableArea("SVG_CANVAS_CHANGE");
				slideCtrlBtn.className = "svgSlideContainer selected";				
				selectedSlide.className = "svgSlideContainer";
				selectedSlide = slideCtrlBtn;
				//alert("11::"+slideCtrlBtn.outerHTML);
				console.log("change slide");
			}
			
		}
	}
	
	this.createSlides = function (slidemenu) //SW_ToolBar
	{
		slidemenu.removeAllTools();
		var selectedSlideId = this.swCanvas.getActiveSvgCanvasId();
		
	//	var localSelectSlide = selectSlide.bind(this, "addSlide");
	//	slidemenu.addSubMenu(slidemenu, new SW_SVG_ICON(SVG_SLIDE), "", SVG_SLIDE, { evtCallback: localSelectSlide } );
		
		for (var slideCounter=0; slideCounter < this.swCanvas.getTotalSvgCanvas(); slideCounter++)
		{		
			var tooltip = "";
			var slideInfo = document.createElement("div");
			slideInfo.className = "sgvSlideInfo";
			slideInfo.innerHTML = slideCounter+1;
			var slide = document.createElement("div");
			slide.className = "sgvSlide";
			
			console.log("slideCounter+1 " + (slideCounter+1));
			slide.innerHTML = this.swCanvas.getSvgCanvas(slideCounter+1).getSvg();
			
			var slideWithInfo = document.createElement("span");
			slideWithInfo.appendChild(slideInfo);			
			slideWithInfo.appendChild(slide);			
			
			slidemenu.splitLine();
			
			var localAddNewSlide = addNewSlide.bind(this, slidemenu, slideCounter+1);
			var localRemoveSlide = removeSlide.bind(this, slidemenu, slideCounter+1);
			var localSlideEventHandler = slideEventHandler.bind(this, slideCounter+1);
			
			var slideClass =  "svgSlideContainer";
			var isSelectedSlide = false;
			if (selectedSlideId ==  this.swCanvas.getSvgCanvas(slideCounter+1).getSvgCanvasId())
			{
				slideClass = "svgSlideContainer selected";
				isSelectedSlide = true;
			}
			
			var myslide = slidemenu.addTool(slideWithInfo, tooltip, localSlideEventHandler, slideClass);
			
			if (isSelectedSlide) 
			{
				//alert("settin slide");
				selectedSlide = myslide;
			}
			
			myslide.id = "slideId_" + slideCounter;
			$.contextMenu({
			    selector: '#'+myslide.id ,
			    items: {
			    	"edit": {name: "Edit", icon: "fa-edit"},
			    	separator1: "-----",
			    	removeSlide : {
			    		name: "Remove Slide",		
			    		icon: "fa-trash-o",
			    		callback: function(key, opt){
			    			localRemoveSlide();
			    		}
			    	},
			    	separator2: "-----",
			    	//  separator2: { "type": "cm_separator" },
			    	addNewSlide : {
			    		name: "Add New Slide",
			    		icon: "fa-object-group",
			    		callback: function(key, opt){
			    			localAddNewSlide();
			    		}
			    	}
			    }
			});
		}
		
		slidemenu.resizeSubToolDialogHeight();
	}
}
//************************************************************************
var SW_Controls = function(editor, swCanvas)
{
	this.myEditor = editor;
	this.elemToDraw = SVG_NONE;
	this.lastButtonClicked = null;
	this.swCanvas = swCanvas;
	this.subMenuToolBarDisplayed = null;
	
	var onEditorEvent = this.onEditorEvent.bind(this);	
	this.swCanvas.registerEventCallBack(onEditorEvent); 
}

//*****inheritance*************************
SW_Controls.prototype = new SW_ToolBar();

//**********
SW_Controls.prototype.onEditorEvent = function(eventAction)
{
	if (eventAction.type != "mousedown")
	{
		return;
	}

	var drawElem = this.elemToDraw;
	this.elemToDraw = SVG_NONE;	
	var controlUsed = this.lastButtonClicked;
	this.lastButtonClicked = null;
	
	var editableArea = this.swCanvas.getActiveSvgCanvas();
	
	switch(drawElem)
	{
		case SVG_ELLIPSE:
			editableArea.drawCircle();
			break;
		case SVG_RECTANGLE:
			editableArea.drawRectangle();
			break;
		case SVG_LINE:
			editableArea.drawLine();
			break;
		case SVG_CUBIC_CURVE:
			editableArea.drawCubicCurve();
			break;
		case SVG_ARC:
			editableArea.drawArc();
			break;
		case SVG_TEXT:
			editableArea.drawText();
			break;
		case SVG_TABLE:
			if (this.additionalParam.col > 0 && this.additionalParam.row > 0)
			{
				editableArea.drawTable(this.additionalParam.col,this.additionalParam.row);
			}
			break;
		case SVG_POLYLINE:			
			editableArea.drawPolyline();
			break;
		case SVG_RIGHT_ARROW:			
			editableArea.drawLineArrow(ARROW_HEAD_TYPE.RIGHT_HEAD, ARROW_SHAFT_TYPE.THICK_SHAFT);	
			break;
		case SVG_LEFT_ARROW:	
			editableArea.drawLineArrow(ARROW_HEAD_TYPE.LEFT_HEAD, ARROW_SHAFT_TYPE.THICK_SHAFT);	
			break;
		case SVG_LEFT_RIGHT_ARROW:
			editableArea.drawLineArrow(ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD, ARROW_SHAFT_TYPE.THICK_SHAFT);
			break;
		case SVG_RIGHT_THIN_ARROW:			
			editableArea.drawLineArrow(ARROW_HEAD_TYPE.RIGHT_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);	
			break;
		case SVG_LEFT_THIN_ARROW:	
			editableArea.drawLineArrow(ARROW_HEAD_TYPE.LEFT_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);	
			break;
		case SVG_LEFT_RIGHT_THIN_ARROW:
			editableArea.drawLineArrow(ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
			break;
		case SVG_LEFT_CURVE_ARROW:
			editableArea.drawCurveArrow(ARROW_HEAD_TYPE.LEFT_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
			break;
		case SVG_RIGHT_CURVE_ARROW:
			editableArea.drawCurveArrow(ARROW_HEAD_TYPE.RIGHT_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
			break;
		case SVG_TOP_CURVE_ARROW:
			editableArea.drawCurveArrow(ARROW_HEAD_TYPE.TOP_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
			break;
		case SVG_DOWN_CURVE_ARROW:
			editableArea.drawCurveArrow(ARROW_HEAD_TYPE.DOWN_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
			break;
		case SVG_TOP_DOWN_CURVE_ARROW:
			editableArea.drawCurveArrow(ARROW_HEAD_TYPE.TOP_DOWN_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
			break;
		case SVG_LEFT_RIGHT_CURVE_ARROW:
			editableArea.drawCurveArrow(ARROW_HEAD_TYPE.LEFT_RIGHT_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
			break;
		case SVG_TOP_RIGHT_CURVE_ARROW:
		    editableArea.drawCurveArrow(ARROW_HEAD_TYPE.TOP_RIGHT_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
		    break;
		case SVG_LEFT_DOWN_CURVE_ARROW:
            editableArea.drawCurveArrow(ARROW_HEAD_TYPE.LEFT_DOWN_HEAD, ARROW_SHAFT_TYPE.THIN_SHAFT);
            break;
        
		default:
			this.elemToDraw = SVG_NONE;	
			this.lastButtonClicked = null;
	}
}

SW_Controls.prototype.documentEvent = function (objType)
{
    //document level controls
    switch(objType)
    {
        case SVG_UNDO:
            //	alert("undo");
            this.swCanvas.undo();
            this.elemToDraw = SVG_NONE;	
            break;
        case SVG_REDO:
            //	alert("undo");
            this.swCanvas.redo();
            this.elemToDraw = SVG_NONE;	
            break;
        case SVG_OPEN:
            
            var openFileProcessCallback=function(fileInfo)
            {
               // alert("opened File is: " + fileInfo.fileData.innerHTML);

                var slideList = fileInfo.fileData.getElementsByClassName("slide");

                if (slideList.length == 0)
                {
                    createAlert("File is corrupted : "+ fileInfo.fileName);
                    return;
                }
                
                for(var index = 0; index < slideList.length; index++)
                {
                	var mySvg = slideList[index].getElementsByTagName("svg")[0];
                	if (index == 0)
                	{               
                    	this.swCanvas.loadNew(mySvg);
                	}
                	else
                	{
                		//alert("slide svg: "+ mySvg);
                		this.swCanvas.loadSWSvgCanvas(mySvg);
                	}
                }                
             
				this.myEditor.changeEditableArea("SVG_CANVAS_CHANGE");					
            }
           
            var fileOpener = new SW_FileOpener;
            var localOpenFileProcessCallback = openFileProcessCallback.bind(this);
            fileOpener.readFile(localOpenFileProcessCallback); 
            break;
            
        case SVG_SAVE:
            var source = "";//this.swCanvas.getSource();
            
            for (var slideCounter=0; slideCounter < this.swCanvas.getTotalSvgCanvas(); slideCounter++)
            { 
                var elem = document.createElement("div");
             //   elem.border = "1px solid black";
                elem.style.display = "block";
               // elem.style.width = "100%";
                elem.style.height = "15px";
            //    elem.style.border = "1px solid black";
                
                //alert(elem.outerHTML);
                source += '<div class="slide" style="background: gray; display: block; width: 99.8%; height: 99.5%; border: 1px solid black;">'
                source += this.swCanvas.getSvgCanvas(slideCounter+1).getSvg();
                source += '</div>';
                if (slideCounter != this.swCanvas.getTotalSvgCanvas()-1)
                {
                    source += elem.outerHTML;
                }
               // this.swCanvas.getSvgCanvas(slideCounter+1).getSvgSize();
            }
            //alert(":"+source)
            var fileName = "";
            var header = "";
            var fileSaver = new SW_FileSaver;
            fileSaver.saveHTMLFile(source, header, fileName)
            break;
        case SVG_SOURCE: 
            var source = this.swCanvas.getSource();
            alert("Source:\n" + source); 
            break;
	}
}

SW_Controls.prototype.onControlEvent = function(canHideSubmenu, actionEvt, objType, additionalParam, controlButton)
{
	if (actionEvt.type == "click")
	{	
		this.elemToDraw = objType;
		this.lastButtonClicked = controlButton;
		this.additionalParam = additionalParam;
		this.documentEvent(objType);
	}
	else if (actionEvt.type == "mouseenter" && canHideSubmenu)
	{
		if (this.subMenuToolBarDisplayed)
		{
		    this.subMenuToolBarDisplayed.destroySubToolDialog();	  
	        this.subMenuToolBarDisplayed = null;       
		}
	}
	
	if (additionalParam && additionalParam.evtCallback && typeof additionalParam.evtCallback === "function")
	{
		additionalParam.evtCallback(actionEvt);
	}
}

SW_Controls.prototype.splitLine = function(swToolbar)
{
	swToolbar.splitLine();
}

SW_Controls.prototype.addSlideMenu = function(toolbarToUse, menuName, tooltip, additionalParam)
{
	var swSlideWindow = new SW_SlideWindow(this.swCanvas, this.myEditor);
	
	var localcreateSlides = swSlideWindow.createSlides.bind(swSlideWindow);
	
	var slideMenu = this.addMenu(toolbarToUse, new SW_SVG_ICON(SVG_SLIDES, true), tooltip, SVG_NONE, 
			{ submenuCreate :  localcreateSlides, submenuAutoDestroy: false, submenuDragable : true, title: "Slides"},  true);	
	
	var localcreateSlidesNotify = swSlideWindow.createSlides.bind(swSlideWindow, slideMenu);
	
	this.swCanvas.notifyActiveCanvasAutoChange(localcreateSlidesNotify);	
}

SW_Controls.prototype.addTableMenu = function(toolbarToUse, menuName, tooltip, additionalParam)
{
	var tableInfo = null;
	var tableRowBtnArray = new Array;
	
	var tableSubMenuClose = function ()
	{
		if (tableInfo)
		{
			tableInfo.innerHTML= "Coloumns: "+0 +", Rows: "+0;
		}

		for (var rowCounter=0; rowCounter <tableRowBtnArray.length; rowCounter++)
		{
			var rowArray = tableRowBtnArray[rowCounter];
			for (var colCounter=0; colCounter <rowArray.length; colCounter++)
			{
				rowArray[colCounter].className = "SWEditorControlBtn tableIcon";
			}
		}

		return;		
	}
	
	var tableMenu = this.addMenu(toolbarToUse, menuName, tooltip, SVG_NONE,  { onClose: tableSubMenuClose }, true);

	var numberOfRows=10;
	var numberOfCols=10;
	
	if (additionalParam && additionalParam.rows) { numberOfRows = additionalParam.rows; } 
	if (additionalParam && additionalParam.cols) { numberOfCols = additionalParam.cols; } 
		

	tableInfo = this.addSubMenu(tableMenu, "Coloumns: 0, Rows: 0", "", SVG_TABLE, { toolCSS: "SWEditorControlBtn tableIconInfo", row: 0, col: 0 }  );
	this.splitLine(tableMenu);

	var tableShowFunction = function(tableInfo, cols, rows, tableRowBtnArray, evt)
	{


		if (evt.type == "click" /*|| evt.type == "mouseleave"*/)
		{
			//console.log("evt.type = :"+evt.type);
			tableInfo.innerHTML= "Coloumns: "+0 +", Rows: "+0;

			for (var rowCounter=0; rowCounter <tableRowBtnArray.length; rowCounter++)
			{
				var rowArray = tableRowBtnArray[rowCounter];
				for (var colCounter=0; colCounter <rowArray.length; colCounter++)
				{
					rowArray[colCounter].className = "SWEditorControlBtn tableIcon";
				}
			}

			return;
		}

		tableInfo.innerHTML= "Coloumns: "+cols +", Rows: "+rows;
		var totalSelectedButons=cols*rows;

		for (var rowCounter=0; rowCounter <tableRowBtnArray.length; rowCounter++)
		{
			var rowArray = tableRowBtnArray[rowCounter];

			if (rowCounter < rows)
			{
				for (var colCounter=0; colCounter <rowArray.length; colCounter++)
				{
					if (colCounter < cols)
					{
						rowArray[colCounter].className = "SWEditorControlBtn tableIcon selected";
					}
					else
					{	
						rowArray[colCounter].className = "SWEditorControlBtn tableIcon";
					}
				}
			}
			else
			{
				for (var colCounter=0; colCounter <rowArray.length; colCounter++)
				{
					rowArray[colCounter].className = "SWEditorControlBtn tableIcon";
				}
			}
		}
	}

	var tableRowBtnArrayIndex = 0;
	for (var rowCounter=0; rowCounter<numberOfRows; rowCounter++)
	{	
		var colBtnArray = new Array;
		var colBtnArrayIndex=0;
		for (var colCounter=0; colCounter<numberOfCols; colCounter++)
		{
			var tooltip = ""; //"Cols: " + (colCounter+1) + ", Rows: " + (rowCounter+1);

			var mytableShowFunction = tableShowFunction.bind(this, tableInfo, colCounter+1, rowCounter+1, tableRowBtnArray);
			colBtnArray[colBtnArrayIndex] = this.addSubMenu(tableMenu, "", tooltip, SVG_TABLE, { evtCallback: mytableShowFunction, toolCSS: "SWEditorControlBtn tableIcon", row: rowCounter+1, col: colCounter+1 }  );
			colBtnArrayIndex++;
		}

		tableRowBtnArray[tableRowBtnArrayIndex]=colBtnArray;
		tableRowBtnArrayIndex++;

		this.splitLine(tableMenu);
		this.splitLine(tableMenu);
	}
	
	return tableMenu;
}

SW_Controls.prototype.addMenu = function(toolbarToUse, menuName, tooltip, objType, additionalParam, enableSubMenu) 
{
	if (typeof enableSubMenu === undefined || !enableSubMenu)
	{
		enableSubMenu = false;
	}
	
	var onControlEvent = null;
	
	if (!enableSubMenu)
	{
		onControlEvent = this.onControlEvent.bind(this, true); //true hide submenu 
		var controlButton = this.addControlToToolBar(toolbarToUse, menuName, tooltip, objType, additionalParam, onControlEvent);	
		return null;
	}
	else
	{
		var positionJSON = null;
		
		if (controlButton)
		{
			positionJSON = { my: "left top", at: "right top", of: controlButton };
		}
		
		//here subMenuOverlayDiv created as main menu but displayed as sub menu
		var subMenuOverlayDiv = document.createElement("div");
		subMenuOverlayDiv.className = "SWEditorToolBarSubmenu";
		
		var subMenuToolBar = new SW_ToolBar(subMenuOverlayDiv);
		subMenuToolBar.setToolCSS("SWEditorControlBtn inVerticalpanel keepLeft");
		
		onControlEvent = this.openSubMenuWindow.bind(this, subMenuToolBar, subMenuOverlayDiv);
		var controlButton = this.addControlToToolBar(toolbarToUse, menuName, tooltip, objType, additionalParam, onControlEvent);		
		
		return subMenuToolBar;
	}
}

SW_Controls.prototype.addSubMenu = function (subMenuToolBar, menuName, tooltip, objType, additionalParam)
{
	var localOnControlEvent = function (objType, additionalParam, actionEvt, controlButton)
	{
		
		this.onControlEvent(false, actionEvt, objType, additionalParam, controlButton); // false donot hide submenu
	
		if (actionEvt.type == "click")
		{
			if (!additionalParam || typeof additionalParam.submenuAutoDestroy !== "boolean"
								||  additionalParam.submenuAutoDestroy == true)
			{
				//console.log("destroying now :" + additionalParam.submenuAutoDestroy)
				subMenuToolBar.destroySubToolDialog();
				this.subMenuToolBarDisplayed = null;
			}
		}
	}

	var subMenuContrlEvent = localOnControlEvent.bind(this, objType, additionalParam);
	
	if (additionalParam && additionalParam.toolCSS)
	{ 
		return subMenuToolBar.addTool(menuName, tooltip, subMenuContrlEvent, additionalParam.toolCSS);
	}
	else
	{
		return subMenuToolBar.addTool(menuName, tooltip, subMenuContrlEvent, null);
	}
	
	//alert("adiing subtool");
}

SW_Controls.prototype.removeAllSubmenues = function(subMenuToolBar)
{
	subMenuToolBar.removeAllTools();
}

SW_Controls.prototype.openSubMenuWindow = function(subMenuToolBar, subMenuOverlayDiv,
		                                                 actionEvt, objType, additionalParam, controlButton) 
{
	var triggerClose = false;
	//console.log("tool bar" + actionEvt.type);
	/*if (actionEvt.type == "mouseleave")
    {
		var localCloseSunMenuIfRequired = function()
		{
			//console.log("tool bar control mouse out");

			if(triggerClose && !subMenuToolBar.isSubToolDialogActive())
			{
				console.log("Triggered submenu close");
				subMenuToolBar.destroySubToolDialog();	  
				this.subMenuToolBarDisplayed = null;     
			}
		}
		
		var myCloseSunMenuIfRequired = localCloseSunMenuIfRequired.bind(this);
		
		triggerClose = true;	
		setTimeout(myCloseSunMenuIfRequired, 40);
		
		return;
    }
	else*/ if (actionEvt.type != "mouseenter" && actionEvt.type != "click")
	{
		return;
	}
	
	triggerClose = false;
	
	var positionJSON = null;
	
	if($(subMenuOverlayDiv).is(":visible"))
	{
		return;
	}

	if (controlButton)
	{
		positionJSON = { my: "left top", at: "right-5 top-5", of: controlButton };
	}
	
	if (this.subMenuToolBarDisplayed)
	{
	    this.subMenuToolBarDisplayed.destroySubToolDialog();	  
        this.subMenuToolBarDisplayed = null;       
	}
	
	var onCloseCallBack = null;
	
	if (additionalParam && additionalParam.onClose)
	{
		onCloseCallBack = additionalParam.onClose;
	}
	
	var bSubToolAutoDestroy = true;
	var bSubmenuDragable = false;
	var myTitle = "";
	
	if (additionalParam && typeof additionalParam.submenuAutoDestroy  === "boolean")
	{
		bSubToolAutoDestroy = additionalParam.submenuAutoDestroy
	}
	
	if (additionalParam && typeof additionalParam.submenuDragable === "boolean")
	{
		bSubmenuDragable = additionalParam.submenuDragable;
	}
	
	if (additionalParam && additionalParam.submenuCreate)
	{
		additionalParam.submenuCreate(subMenuToolBar); 
	}
	
	if (additionalParam && additionalParam.title)
	{
		myTitle =  additionalParam.title;
	}
	
    subMenuToolBar.createSubToolDialog(subMenuOverlayDiv, onCloseCallBack, positionJSON, 
    		                            bSubToolAutoDestroy, false, bSubmenuDragable, {title : myTitle}); //donot close on outside click
   
   
    if (bSubToolAutoDestroy)
    {
    	this.subMenuToolBarDisplayed = subMenuToolBar;
    }
	
}

SW_Controls.prototype.DrawElement = function() 
{
	alert("Canvas Clicked");
}


SW_Controls.prototype.addControlToToolBar = function(toolbarType, displayLabel, tooltip, objectType, additionalParam, evtCallBackFunction)
{
	var controlBtnDiv = document.createElement("div");
	controlBtnDiv.innerHTML = displayLabel;

	controlBtnDiv.onclick = (function (evt) {
		
		if ($(controlBtnDiv).tooltip && tooltip != "")
		{
			$(this).tooltip( "close");
		}
		
		if (typeof evtCallBackFunction === "function")
		{
			evtCallBackFunction(evt, objectType, additionalParam, controlBtnDiv);
		}
	});

	$(controlBtnDiv).mouseenter(function (evt) {
		if (typeof evtCallBackFunction === "function")
		{
			evtCallBackFunction(evt, objectType, additionalParam, controlBtnDiv);
		}
	});
	
	
	//console.log("event happend" + $(controlBtnDiv).html);
	$(controlBtnDiv).mouseleave(function (evt) {		
		if (typeof evtCallBackFunction === "function")
		{
			evtCallBackFunction(evt, objectType, additionalParam, controlBtnDiv);
		}
	});
	
	if (tooltip)
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
			open: function( event, ui ) { 			}
		});
	}
	
	this.myEditor.addToolbarControl(toolbarType, controlBtnDiv);

	//var themeClass = $(controlBtnDiv).tooltip( "option", "classes.ui-tooltip" );
	//console.log("tool tip theme"+themeClass);
	return controlBtnDiv;
}


//****************************************************************************************

var SW_Display = function()
{
	this.displayArea = null;
	this.show();
}

SW_Display.prototype.appendElement = function(elemToAttach) 
{
	this.displayArea.appendChild(elemToAttach);
}

SW_Display.prototype.show = function() 
{
	var overlayDisplayDiv = document.createElement("div");
	overlayDisplayDiv.name = "overlayDisplayDiv";
	overlayDisplayDiv.id = "overlayDisplayDiv";	
	
	this.displayArea = document.createElement("div");
	//this.displayArea.innerHTML = "Hi there";
	this.displayArea.id = "displayArea";
	
	overlayDisplayDiv.appendChild(this.displayArea);
	
	
	this.displayArea.style.height =  $("#overlayEditorDiv").parent().height();
	top = "{ my: 'top', at: 'top'  }";
	
	var myWidth = parseInt($(window).width()) > 1050 ? "99.5%" : "99.3%";	
	
	var showOverlayTitlebar = false;
	
	document.body.appendChild(overlayDisplayDiv);

	//Work around to enable ckeditor ui dialog widget events.
	$.widget("ui.dialog", $.ui.dialog, {
	    _allowInteraction: function(event) {
	        return !!$(event.target).closest(".cke_dialog").length || this._super(event);
	    }
	});
	
	$("#overlayDisplayDiv").dialog({
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
			$('#overlayDisplayDiv').css('overflow', 'auto'); //this line does the actual hiding
			$('#overlayDisplayDiv').css('padding', '0'); 
			$('#overlayDisplayDiv').css('margin', '0'); 
			$('#overlayDisplayDiv').css('height', '98.5vh'); 
			$('#overlayDisplayDiv').css('border', '0.1em solid red'); 
		},
		
		beforeClose : function(event, ui)
		{
			
		},

		close: function(event, ui)
		{
		
			$(this).dialog('destroy').remove();	
		},


	}).fadeIn(300);

	$("#overlayDisplayDiv").dialog("open");
	//alert("Creating SVG Editor 111.");


	if (!showOverlayTitlebar)
	{
		$("#overlayDisplayDiv").siblings('.ui-dialog-titlebar').hide();
	}

	showOnlyMyFrame();	
}

var SW_Editor = function(canvas)
{
	this.swCanvas = canvas;
	this.editor = null;
	this.editorTopMenuContainer = null;
	this.editorBottomMenuContainer = null;
	this.editorLeftMenuContainer = null;
	this.editorRightMenuContainer = null;	
	this.sizedEditableAreaContainer = null;
	
	var localChangeEditableArea = this.changeEditableArea.bind(this);
	this.swCanvas.notifyActiveCanvasAutoChange(localChangeEditableArea);
}


SW_Editor.prototype.makeEditableAreaScalable = function ()
{
	$(this.sizedEditableAreaContainer).keepRatio({
		ratio: 4/3,
		calculate: 'auto' // height or width or auto
	});	
}


SW_Editor.prototype.createEditorLayout = function(editableAreaToolbar) 
{
	var editorLayout = document.createElement("div");
	editorLayout.name = "editorLayout";
	editorLayout.id = "editorLayout";
	editorLayout.className = "editorLayout";
	
	//var myEditableArea = this.swCanvas.getActiveSvgEditableArea();
	
	this.editorTopMenuContainer = document.createElement("div");
	this.editorTopMenuContainer.className = "menuBarContainer horizontal";
	//this.editorTopMenuContainer.innerHTML = "<B>Infotrophic</B> (Under Development)";
	
	this.editorBottomMenuContainer = document.createElement("div");
	this.editorBottomMenuContainer.className = "menuBarContainer horizontal";	
	
	this.editorLeftMenuContainer = document.createElement("div");
	this.editorRightMenuContainer = document.createElement("div");	

	var editableAreaContainer = document.createElement("div");
	editableAreaContainer.className = "editableAreaContainer";
	
	var vertMenuAndEditAreaContainer = document.createElement("div");
	vertMenuAndEditAreaContainer.className = "menuBarContainer vertMenuAndEditAreaContainer";

	var editorLeftMenuContainerDiv = document.createElement("div");
	editorLeftMenuContainerDiv.className = "menuBarContainer vertical left";
	editorLeftMenuContainerDiv.appendChild(this.editorLeftMenuContainer);

	var editorRightMenuContainerDiv = document.createElement("div");
	editorRightMenuContainerDiv.className = "menuBarContainer vertical right";
	editorRightMenuContainerDiv.appendChild(this.editorRightMenuContainer);

	var editableAreaContainerDiv = document.createElement("div");
	editableAreaContainerDiv.className = "menuBarContainer vertical middle";
	editableAreaContainerDiv.appendChild(editableAreaContainer);

	vertMenuAndEditAreaContainer.appendChild(editorLeftMenuContainerDiv);
	vertMenuAndEditAreaContainer.appendChild(editableAreaContainerDiv);
	vertMenuAndEditAreaContainer.appendChild(editorRightMenuContainerDiv);

	editorLayout.appendChild(this.editorTopMenuContainer);
	editorLayout.appendChild(vertMenuAndEditAreaContainer);
	editorLayout.appendChild(this.editorBottomMenuContainer);
	
	this.sizedEditableAreaContainer = document.createElement("div");
	this.sizedEditableAreaContainer.className = "sizedEditableAreaContainer";
	//this.sizedEditableAreaContainer.appendChild(myEditableArea);
	this.changeEditableArea("SVG_CANVAS_CHANGE");
	
	editableAreaContainer.appendChild(this.sizedEditableAreaContainer);
	this.editorRightMenuContainer.appendChild(editableAreaToolbar);
	
	return editorLayout;
}

SW_Editor.prototype.addToolbarControl = function(toolbarType, controlBtnDiv)
{

	switch (toolbarType)
	{
		case TOOLBAR_TYPE.LEFT_TOOLBAR:
			this.editorLeftMenuContainer.appendChild(controlBtnDiv);	
			controlBtnDiv.className = "SWEditorControlBtn inVerticalpanel";
			break;
		case TOOLBAR_TYPE.TOP_TOOLBAR:
			this.editorTopMenuContainer.appendChild(controlBtnDiv);	
			controlBtnDiv.className = "SWEditorControlBtn inHorizontalpanel";
			break;
	}
}

SW_Editor.prototype.changeEditableArea = function(changeType)
{
	if ("SVG_CANVAS_CHANGE" == changeType)
	{
		var myEditableArea = this.swCanvas.getActiveSvgEditableArea();
		//console.log("active slide" + myEditableArea.outerHTML);	
		this.sizedEditableAreaContainer.innerHTML="";
		this.sizedEditableAreaContainer.appendChild(myEditableArea);
	}
}

/********************************************************************************************/

var SW_CanvasEditor = function (swCanvas, canvasContainer, menuBar, objectBar)
{
	this.swCanvas = swCanvas;
	this.swCanvasContainer = canvasContainer;
	this.menuBar = menuBar;
	this.objectBar = objectBar;	
//	this.propertyBar = propertyBar;

}

SW_CanvasEditor.prototype.addToolbarControl = function(toolbarType, controlBtnDiv)
{

        switch (toolbarType)
        {
                case TOOLBAR_TYPE.LEFT_TOOLBAR:
                        this.objectBar.appendChild(controlBtnDiv);
                        controlBtnDiv.className = "SWEditorControlBtn inVerticalpanel";
                        break;
                case TOOLBAR_TYPE.TOP_TOOLBAR:
                        this.menuBar.appendChild(controlBtnDiv);
                        controlBtnDiv.className = "SWEditorControlBtn inHorizontalpanel";
                        break;
        }
}


SW_CanvasEditor.prototype.changeEditableArea = function(changeType)
{
	if ("SVG_CANVAS_CHANGE" == changeType)
	{
		var myEditableArea = this.swCanvas.getActiveSvgEditableArea();
                //console.log("active slide" + myEditableArea.outerHTML);       
		this.swCanvasContainer.innerHTML="";
		this.swCanvasContainer.appendChild(myEditableArea);
	}
}

