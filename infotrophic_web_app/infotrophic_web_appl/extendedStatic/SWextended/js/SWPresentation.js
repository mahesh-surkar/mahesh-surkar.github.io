//Require SWCommon.js
var PRESENTAION_HEADER = "";
var openedTmpPresetation = document.createElement("div");
var PRESENTATION_NAME_SPAN = "";
var SLIDE_PANEL = "";
var SLIDE_CLIP_BOARD = "";
var MODE = "EDIT"; //"PLAY"

function laodSWPresentation()
{
	createEditorOverlay(function (action) {
		//i_slide.innerHTML = overlayelem.innerHTML;
		//elemSaver.click(); //to display dialog with the Save flash object                  
	});	
	
	
	/*var documentRoot = document.body;
	HTMLPage = document.createElement("div");
	HTMLPage.id = "HTMLPage";
	documentRoot.appendChild(HTMLPage);	
	var presentationMenu = addPresentaionMenu(HTMLPage);
	
	myPresentationHeader = attachDocHeader(presentationMenu);	
	setPresentationHeader(myPresentationHeader);
	var slidePanel = addSlidePanel(myPresentationHeader);
	
	setSlidePanel(slidePanel);
	addSlide(slidePanel);

	presentationOpener = getPresentationOpener();
	presentationMenu.appendChild(presentationOpener);
	presentatonSaver = getPresentationSaver();
	presentationMenu.appendChild(presentatonSaver);   
	presentationPlay = getPresentationPlayer(PRESENTAION_HEADER);
	presentationMenu.appendChild(presentationPlay);   */
}

function setPresentationPrereqisites(mySlidePanel, myPresentationHeader, myPresentationFileInfo)
{
	//alert("setting prerequisrs");
	setSlidePanel(mySlidePanel);
	setPresentationHeader(myPresentationHeader);
	//setFileInfoDisplaySpan(myPresentationFileInfo);
}

function setSlidePanel(mySlidePanel)
{
	SLIDE_PANEL = mySlidePanel;	
}

function getSlidePanel()
{
	return SLIDE_PANEL;
}

function setPresentationHeader(myPresentationHeader)
{
	PRESENTAION_HEADER = myPresentationHeader;
}

function getPresentationHeader()
{
	return PRESENTAION_HEADER;
}

function setFileInfoDisplaySpan(i_presentatinInfoSpan)
{
	PRESENTATION_NAME_SPAN = i_presentatinInfoSpan;
}

function getFileInfoDisplaySpan()
{
	return PRESENTATION_NAME_SPAN;
}


function loadPresentationHeaders(presentationHeaderDoc)
{ 
	var headerString = "<html>" + htmlDecode(presentationHeaderDoc.innerHTML) + "</html>";
	
	parser=new DOMParser();
	var headerObj=parser.parseFromString(headerString, "text/html");
	//alert(headerObj.head.outerHTML);

	var jsFiles = headerObj.getElementsByTagName("script");	
	for (var i=0; i<jsFiles.length; i++)
	{		
		var src = jsFiles[i].src;
	
		if (src != "")
		{			
			checkloadjscssfile(src, "js");		
		}		
	}	
}

function getPresentationPlayer(presentationHeader)
{
	var presentationPlayBtn = document.createElement("button");
	presentationPlayBtn.id = "presentationPlayBtn";
	presentationPlayBtn.className = "btn";
	presentationPlayBtn.innerHTML = "Play";
	presentationPlayBtn.onclick = (function () {
		playPresentation();
	});

	return presentationPlayBtn;	
}

function playPresentation()
{
		var slidesToPresent = [];
		var slideClone = [];		
		var mySlideList = document.getElementsByClassName("slide");

		if (mySlideList.length == 0)
		{
			createAlert("Add slides.");
			return;
		} 		

		for (index=0; index < mySlideList.length; index++)
		{
			slideClone[index] = mySlideList[index].cloneNode(true);

			slidesToPresent[index] = document.createElement("div");
			slidesToPresent[index].innerHTML = mySlideList[index].innerHTML;
			
			mySlideList[index].innerHTML = "";
			
			//slidesToPresent[index].innerHTML = mySlideList[index].innerHTML;
			//alert (slidesToPresent[index].innerHTML);		
		}

		MODE = "PLAY";
		var myPresentationHeader = getPresentationHeader();
		loadPresentationHeaders(myPresentationHeader);
		openSlide(slidesToPresent, function (){ 
			MODE = "EDIT"; 
			/*alert("presentation stopped")*/
			for (index=0; index < mySlideList.length; index++) 
			{
				mySlideList[index].innerHTML = slideClone[index].innerHTML;
			}	
							
		}); 
}

function removeAllSlides()
{
	var slides = document.getElementsByClassName( "slideContainer");

	while(slides.length > 0)
	{
		slides[0].parentNode.removeChild(slides[0]);
	}        
}

function presentationReadCallBack()
{

	var slideList = openedTmpPresetation.getElementsByClassName("slide");

	if (slideList.length == 0)
	{
		createAlert("File is corrupted.");
		return;
	}

	var slideContainer = "";
	removeAllSlides();

	while(slideList.length > 0)
	{
		if (slideContainer != "")
		{
			slideContainer = addSlide(slideContainer, slideList[0]);
		}
		else
		{			
			//alert("adding Slide");
			var mySlidePanel = getSlidePanel();
			slideContainer = addSlide(mySlidePanel, slideList[0], true);//attach first slide to editor
		}
	}
}

function readPresentaion()
{
	var myPresentationHeader = getPresentationHeader();
	var myFileInfoSpan = getFileInfoDisplaySpan();
	readFile(openedTmpPresetation, myPresentationHeader, myFileInfoSpan, presentationReadCallBack);	
}

function getPresentationOpener()
{
	var myPresentationHeader = getPresentationHeader();
	var myFileInfoSpan = getFileInfoDisplaySpan();
	return getFileOpener(openedTmpPresetation, myPresentationHeader, myFileInfoSpan, presentationReadCallBack);	
}

function savePresentaion()
{
	var mySlidePanel = getSlidePanel();
	var myPresentationHeader = getPresentationHeader();
	var myFileNameSpan = getFileInfoDisplaySpan();
	//alert(mySlidePanel.innerHTML);
	var allSlides = getSlidesToSave(mySlidePanel);
	//alert(allSlides.innerHTML);
	var saveOverlay = saveHTMLFile(allSlides, myPresentationHeader, myFileNameSpan); 
	return saveOverlay;
}

function getPresentationSaver()
{	
	var mySlidePanel = getSlidePanel();
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
		
		saveOverlay = savePresentaion();		

	});	
	return fileSaveBtn;	
}

function getSlidesToSave(mySlidePanel)
{

	var slideGroup = document.createElement("div");
	var slideList = mySlidePanel.getElementsByClassName("slide");

	//alert("total slides "+ slideList.length);
	for (index=0; index < slideList.length; index++)
	{
		slideGroup.innerHTML += slideList[index].outerHTML;
		//alert(slideList[0].outerHTML);
	}

	slideGroup.innerHTML = slideGroup.innerHTML.replace(/(\r\n|\n|\r)/gm, "")
	return slideGroup;	
}

function addPresentaionMenu(i_insertAfterNode)
{
	var presentationMenu = document.createElement("div");		
	insertNodeAfter(presentationMenu, i_insertAfterNode);

	HTMLContentLabel = document.createElement("div");
	//HTMLContentText = document.createTextNode("Presentaion :  ");
	HTMLFileName = document.createElement("span");
	HTMLFileName.innerHTML = "";
	setFileInfoDisplaySpan(HTMLFileName);

	//HTMLContentLabel.appendChild(HTMLContentText);
	HTMLContentLabel.appendChild(HTMLFileName);	
	HTMLContentLabel.className = "infoLabel italics right";

	presentationMenu.appendChild(HTMLContentLabel);		
	return presentationMenu;
}

function addSlidePanel(i_insertAfterNode)
{
	var slidePanel = document.createElement("div");		
	insertNodeAfter(slidePanel, i_insertAfterNode);

	var d = new Date();
	var time = d.getTime();

	slidePanel.className = "slidePanel";	
	slidePanel.id = "SWC_Element_" + time;
//	slidePanel.contentEditable = "true";
	return slidePanel;
}

function addSlide(i_insertAfterNode, i_content, attachToEditor)
{
	var slideContainer = document.createElement("div");	

	var hasSlide = document.getElementsByClassName( "slideContainer");
	//alert("hasSlide:"+hasSlide.length);
	if (hasSlide.length == 0)
	{
		i_insertAfterNode.appendChild(slideContainer);
	}
	else
	{
		insertNodeAfter(slideContainer, i_insertAfterNode);
	}

	slideContainer.className = "slideContainer";	

	var mySlide = getMySlide();	

	if (i_content)
	{
		//alert(i_content.outerHTML);
		if (i_content.className == "slide")
		{
			mySlide = i_content;
		}
		else
		{
			mySlide.innerHTML = i_content;
		}
	}
	
	var mySlideDecorator = getMySlideDecorator(mySlide, slideContainer);    
	slideContainer.appendChild(mySlideDecorator);
	slideContainer.appendChild(mySlide);
	attachBrowserDependantiSlideTranform(mySlide, slideContainer);
	
	//alert("Attaching slide1");
	if (typeof attachToEditor !== undefined && attachToEditor && attachToEditor == true)
	{
		mySlide.click();
	}

	return slideContainer;
}

function getMySlide()
{

	var d = new Date();
	var time = d.getTime();

	var slideDiv = document.createElement("div");	
	slideDiv.className = "slide";	
	slideDiv.id = "SWC_Element_" + time;
	//slideDiv.contentEditable = "true";
	return slideDiv;
}

function getMySlideDecorator(i_slide, i_elementContainer)
{
	var elemPaster = getSlidePaster(i_slide);
	var elemCoppier = getSlideCopier(i_slide);	
	var elemRemover = getSlideRemover(i_elementContainer);
	var newSlideAdder = getSlideAdder(i_elementContainer);
	var elemDecoratorDiv = document.createElement("span");
	elemDecoratorDiv.style.display = "none";
	elemDecoratorDiv.style.float = "right";

	elemDecoratorDiv.appendChild(elemPaster);
	elemDecoratorDiv.appendChild(elemCoppier);  
	elemDecoratorDiv.appendChild(elemRemover);
	elemDecoratorDiv.appendChild(newSlideAdder);	

	i_elementContainer.onmouseover = (function (){
		elemDecoratorDiv.style.display = ""; 	
		newSlideAdder.style.display = ""; 		
		i_slide.style.height = i_slide.style.height;
		//i_element.focus();
	});

	i_elementContainer.onmousemove = (function (){
		elemDecoratorDiv.style.display = ""; 	
		newSlideAdder.style.display = ""; 		

		//i_element.focus();
	});

	i_elementContainer.onmouseout = (function (){ 
		elemDecoratorDiv.style.display = "none"; 	
		newSlideAdder.style.display = "none"; 		
		i_slide.style.height = i_slide.style.height;
		//i_element.blur();
	});


	i_slide.onclick = (function ()
	{ 
		i_slide.blur();
		//alert("got focus");
		if (MODE != "EDIT") 
		{
				return;
		}
		
		//elemDecoratorDiv.style.display = "";		

		/*var overlayelem = document.createElement("div");
		overlayelem.innerHTML = i_slide.innerHTML;                
		overlayelem.id = "overlayelem_" + i_slide.id;*/ 

		/*createOverlay(overlayelem, "300", true,function (action) {
			i_slide.innerHTML = overlayelem.innerHTML;
			elemSaver.click(); //to display dialog with the Save flash object       
	    });*/

		//alert(overlayelem.innerHTML);
		
		/*createEditorOverlay(function (action) {
			//i_slide.innerHTML = overlayelem.innerHTML;
			//elemSaver.click(); //to display dialog with the Save flash object                  
		});	*/

		//alert("ching new object" + i_slide.id);	
	    attachDisplayToEditorArea(i_slide, function (action) {//detach callback
			//alert("Editor Action calledbacked" + i_slide.innerHTML);
			//i_slide.innerHTML = i_slide.innerHTML;
			//alert("Detach called");
			//elemSaver.click(); //to display dialog with the Save flash object                  
		});		
	});

	
	return elemDecoratorDiv;


}

function getSlidePaster(i_elemToPasteIn)
{
	var pasteBtn = document.createElement("button");
	pasteBtn.className = "btn inline";
	pasteBtn.innerHTML="Paste";
	pasteBtn.onclick = (function ()
			{                   
				if (SLIDE_CLIP_BOARD != "")
				{
					i_elemToPasteIn.innerHTML = SLIDE_CLIP_BOARD;
				}
			});
	
	return pasteBtn;

}

function getSlideCopier(i_elemToCopy)
{
	var copyBtn = document.createElement("button");
	copyBtn.className = "btn inline";
	copyBtn.innerHTML="Copy";
	copyBtn.onclick = (function ()
			{                   
				SLIDE_CLIP_BOARD = i_elemToCopy.innerHTML;
			});
	
	return copyBtn;
}

function getSlideRemover(i_elemToRemove)
{
	var removeBtn = document.createElement("button");
	removeBtn.className = "btn inline";
	removeBtn.innerHTML="Delete";
	removeBtn.onclick = (function ()
			{                   
		removeConfirm = document.createElement("span");
		removeConfirm.id = "removeConfirm";
		removeConfirm.className = "infoLabel italics overlay";
		removeConfirm.appendChild(document.createTextNode("Do you want to remove this slide?"));
		createOverlay(removeConfirm, "300", true, function (action) 
		{ 
			
			if (action == "CANCEL_CLOSE") 
			{ 
				return;
			}

			var slide = document.getElementsByClassName( "slide");
			if(slide.length == 1)
			{                               
				slide[0].innerHTML = "";			                
			}
			else
			{
				i_elemToRemove.remove();
			}

		}); 

	});
	return removeBtn;
}




function getSlideAdder(i_insertAfter)
{
	//alert("get adder");
	var addBtn = document.createElement("button");
	addBtn.id = "addSectionBtn";
	addBtn.className = "btn inline";
	addBtn.innerHTML="Add Slide";
	addBtn.onclick =(function (){ addSlide(i_insertAfter); });
	return addBtn;
}

function attachBrowserDependantiSlideTranform(slideToTranform, slideContainerToTranform)
{
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
    {
        //alert('Opera');
        //keepDefault
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
	//slideToTranform.style.height()
	//        alert('Chrome');
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        //alert('Safari');
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
    {

	//slideContainerToTranform.style.height = "175px";
	//slideContainerToTranform.style.width = "344px";
//	$("#" + slideContainerToTranform.id).hover(slideContainerToTranform.style.height = 200);


         //alert('Firefox');
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
      //alert('IE'); 
    }  
    else 
    {
       //alert('unknown');
    }
}

