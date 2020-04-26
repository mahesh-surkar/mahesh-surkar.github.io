//Simple Slide uses the jquery.

function maxWindow()
{
	window.moveTo(0, 0);
	window.height(screen.height);

	if (document.all)
	{
		top.window.resizeTo(screen.availWidth, screen.availHeight);
	}

	else if (document.layers || document.getElementById) 
	{
		if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth)
		{
			top.window.outerHeight = screen.availHeight;
			top.window.outerWidth = screen.availWidth;
		}
	}
}


//returns for full-screen 1, exited full-screen 2, 0 if nochange 
function toggleScreeen(expctedNewState)
{
	//alert("toogleScren"+ expctedNewState);
    var retVal = 0;
	if (!document.fullscreenElement &&    // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement 
			       && !document.msFullscreenElement 
			               && (expctedNewState == "BecomeFullScreen" || expctedNewState == "ToggleScreen"))
	{  // current working methods
		try
		{
			if (document.documentElement.requestFullscreen) 
			{
				document.documentElement.requestFullscreen();
				retVal = 1;
			}
			else if (document.documentElement.msRequestFullscreen) 
			{  
				document.documentElement.msRequestFullscreen();
				retVal = 1;
			}
			else if (document.documentElement.mozRequestFullScreen) 
			{
				document.documentElement.mozRequestFullScreen();
				retVal = 1;
			}
			else if (document.documentElement.webkitRequestFullscreen) 
			{
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				retVal = 1;
			}  

			if (document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen)
			{
				//alert (":"+ document.fullscreen  + ":" +document.mozFullScreen + ":"+ document.webkitIsFullScreen);
				$(".ui-dialog-titlebar").show();
				window.scrollTo(0, 0);
				
				//maxWindow();
			}
		}
		catch (e)
		{
			console.log(e);
		}
	} 
	else if(expctedNewState == "ExitFullScreen" || expctedNewState == "ToggleScreen")
	{
		if (document.exitFullscreen) 
		{
			document.exitFullscreen();
			retVal = 2;
		}
		else if (document.msExitFullscreen) 
		{
			document.msExitFullscreen();
			retVal = 2;
		}
		else if (document.mozCancelFullScreen)
		{
			document.mozCancelFullScreen();
			retVal = 2;
		}
		else if (document.webkitExitFullscreen)
		{
			document.webkitExitFullscreen();
			retVal = 2;
		}
		
		$(".ui-dialog-titlebar").hide();
	}
	
	return retVal;
}

function scaleElement(elemToScale, scaleBy)
{
	//alert ("scaleing By : " + scaleBy);
	
	if (scaleBy > 1.2 && scaleBy < 1.37)
	{
		elemToScale.className = "slideShow scale1_1";
	}	
	else if (scaleBy >= 1.37 && scaleBy < 1.45)
	{	
		elemToScale.className = "slideShow scale1_2";
	}
	else if (scaleBy >= 1.45 && scaleBy < 1.66)
	{
		elemToScale.className = "slideShow scale1_4";
	}
	else if (scaleBy >= 1.66 && scaleBy < 1.7)
	{
		elemToScale.className = "slideShow scale1_5";
	}
	else if (scaleBy >= 1.7 && scaleBy < 2.20)
	{
		elemToScale.className = "slideShow scale2_0";
	}
}

function scaleContentForFullScreen(elemIdToScale)
{	
	var elemToScale = document.getElementById(elemIdToScale);
	//alert("scalling content" + $(window).width()+ ":" + $("#"+elemIdToScale).width());
	//aspect = origWidth / origHeight;

	displaySectionWidth = screen.width;
	var scaleBy = displaySectionWidth/$("#"+elemIdToScale).width();
	//alert ("scaleBy : " + scaleBy);
	scaleElement(elemToScale, scaleBy);	
}

function scaleSlideShow(elemIdToScale, displaySectionHeight, displaySectionWidth, scaleBy)
{
	var elemToScale = document.getElementById(elemIdToScale);
	
	//alert("scalling content" + displaySectionHeight+ ":" + $("#"+elemIdToScale).height());
	
	var scaleByWidth = displaySectionWidth/$("#"+elemIdToScale).width();
	var scaleByheight = displaySectionHeight/$("#"+elemIdToScale).height();

	if(scaleBy === "HEIGHT")
	{
		scaleElement(elemToScale, scaleByheight);
	}
	else
	{
		scaleElement(elemToScale, scaleByWidth);		
	}
}

function scaleContentToFit(containerIdToScaleIn, contentIdToScale)
{
	$("#" + containerIdToScaleIn).addClass('zoomContainer');
	$("#" + contentIdToScale).zoomTarget(); //using zoomoz jquery pluging to zoom the page
	$("#" + contentIdToScale).trigger("click");

}

function fullScreenChangeAction(isfullscreen, elemToChange, callBackFunction, noFSDcumentHeight)
{	
	//alert("FullScreenChange");
	if (!isfullscreen) //F11 pressed 
	{
		$(".ui-dialog-titlebar").show();
		$(".ui-dialog-titlebar").hide();
		$("#" + elemToChange.id).height(noFSDcumentHeight); 
		//$("#" + elemToChange.id).height(screen.height-100);
	}  	
	else
	{
		$(".ui-dialog-titlebar").show();
		//scaleContentForFullScreen(elemToChange);
	}
	
	if (callBackFunction)
	{
		callBackFunction(isfullscreen);
	}	
}

function fullScreenChangeDetect(noFSDcumentHeight, elemToChange, callBackFunction)
{
	document.addEventListener("fullscreenchange", function () {
	    var isfullscreen = (document.fullscreen)? true : false;
	    fullScreenChangeAction(isfullscreen, elemToChange, callBackFunction);
	//   alert();
	}, false);

	document.addEventListener("mozfullscreenchange", function () {
		var isfullscreen = (document.mozFullScreen)? true : false;
		fullScreenChangeAction(isfullscreen, elemToChange, callBackFunction, noFSDcumentHeight);
	  
	}, false);

	document.addEventListener("webkitfullscreenchange", function () {
		var isfullscreen = (document.webkitIsFullScreen)? true : false;
		fullScreenChangeAction(isfullscreen, elemToChange, callBackFunction, noFSDcumentHeight);
	//	alert("fullscreen :" +isfullscreen);	   
	}, false);

	document.addEventListener("msfullscreenchange", function () {
		var isfullscreen = (document.msFullscreenElement)? true : false;
		fullScreenChangeAction(isfullscreen, elemToChange, callBackFunction, noFSDcumentHeight);
	}, false);       
		
}

function openSlide(contentArray, closeCallBack)
{	
//	openSlideWithZoomMooz(contentArray, closeCallBack);
//	return;

	var origWindowWidth = $(window).width();
	var origWindowHeight = $(window).height();
	
	var origDocumentWidth = $(document).width();
	var origDocumentHeight = $(document).height();
	origDocumentHeight = $(document).height()-1;
	
	//alert(screen.height);
	//alert( $(document).width());
	var slideDiv = document.createElement("div");
	slideDiv.name = "slide";
	slideDiv.id = "slide";	
	
	var slideContainer = document.createElement("div");
	slideContainer.name = "slideContainer";
	slideContainer.id = "slideContainer";

	var slideContent = document.createElement("div");	
	slideContent.id = "slideContent";
	slideContent.className = "slideShow";
	var index = 0;

	slideContent.appendChild(contentArray[index]);
        slideContainer.appendChild(slideContent);
	slideDiv.appendChild(slideContainer);
	document.body.appendChild(slideDiv);

	//scaleSlideShow(slideContent.id, origDocumentHeight-30, origDocumentWidth, "HEIGHT");
	//scaleContentToFit(slideContent.id);

	var fullScreenByButton = false;
	var top = "{ my: 'top', at: 'top' }";
	var myWidth = $(document).width() > 1050? "99.3%" : "99.1%";
	var myHeight = $(document).height()-30;
	
	$("#slide").dialog({
		autoOpen : false,
		hide : "puff",
		show : "slide",
		closeText : "hide",
		dialogClass : 'noTitleStuff',
		modal : true,
		title: "InfoTrophic",
		zIndex: 3999,
		height : origDocumentHeight,
		position : top,
		width : myWidth,
		draggable : false,
		resizable: false,
		overflow : false,
		closeOnEscape: false,
		dialogbeforeclose : function(event, ui) {
			$("#slide").empty();
		},

				
		buttons: {				
			"stop": { 
				class: "smallbutton",
				icons: { primary: 'ui-icon-stop'  },
				id: "stopButton",				
				name: "stopButton",
				//text: "stop",
				title: "Stop slide show",
				click: function () {
					$(document).off('keydown'); //remove listener
					$(document).off('keyup'); //remove listener
					toggleScreeen("ExitFullScreen");	
					$(this).dialog('destroy').remove();
					
					if(closeCallBack)
					{
						closeCallBack();						
					}
				}
			},
			
			"Prev": {
				class: "smallbutton",
				id: "prevButton",
				name: "prevButton",
				icons: { primary: 'ui-icon-seek-prev'  },
				//text: "<",
				title: "Previous",
				click: function () {
					//alert("prev clicked" + index + ":"+  (contentArray.length-1));
					if (index <= 0)
					{  
						return;
					}
					
					index--;								
					$("#slideContent").empty();	
					$("#slideContent").append(contentArray[index]);
					$('#nextButton').prop('disabled', false);
					$('#nextButton').show();
					
					if (index == 0)
					{  
						$('#prevButton').prop('disabled', true);
						//$('#prevButton').hide();
					}
					
					var pageInfo = (index+1) + "/" + contentArray.length;
					$("#pageNumber").text(pageInfo);
				}
			},	
			
			"Page" : 
			{
				class: "disabledsmallbutton",
				id: "pageNumber",
				name: "pageNumber",
				title: "Page",	
			},	
			
			"Next": {
				class: "smallbutton",
				id: "nextButton",
				name: "nextButton",
				label: "",
				title: "Next",
				//text: ">",
				icons: { primary: 'ui-icon-seek-next' },
				click: function () {
				//	alert("Next clicked" + index + ":"+  (contentArray.length-1));
					if (index >= (contentArray.length-1))
					{
						return;
					}
					index++;				
					//nextSlide()
					$("#slideContent").empty();
					$("#slideContent").append(contentArray[index]);
					$('#prevButton').prop('disabled', false);
					$('#prevButton').show();
					if (index == contentArray.length-1)
					{  						
						$('#nextButton').prop('disabled', true);						
						//$('#nextButton').hide();
					}
					var pageInfo = (index+1) + "/" + contentArray.length;
					$("#pageNumber").text(pageInfo);
				}
			},
					
			"ToggleScreen": { 
				class: "smallbutton",
				icons: { primary: 'ui-icon-arrow-4-diag'  },
				id: "sreenToggleButton",				
				name: "sreenToggleButton",
				//text: "Full Screen",
				title: "Enter/Exit Full Screen",
				click: function () {					
					var retVal = toggleScreeen("ToggleScreen");
					if (retVal == 1)
					{  					
						myHeight=$(document).height();
						//alert("ms1"+myHeight);
						$("#slide").height(screen.height-140);
						fullScreenByButton = true;						
						scaleContentToFit(slideContainer.id, slideContent.id);
						
						
					}
					else if (retVal == 2)
				        { 					
						slideContent.className = "slideShow";
						fullScreenByButton = false;
						//$("#slide").dialog('option', 'dialogClass', 'noTitleStuff');
						$("#slide").siblings('.ui-dialog-titlebar').show();
						
						//scaleSlideShow(slideContent.id, origDocumentHeight-30, origDocumentWidth, "HEIGHT");						
						$("#slide").height(origDocumentHeight-140);
						scaleContentToFit(slideContainer.id, slideContent.id);
					}
					
					
					
					//alert ( "ORIG DOC size : " + origDocumentHeight);
					//alert ( "window size : " +  $(window).height());
					//alert ( "document size : " + $(document).height());
				}
			},
			
		}
		
		
	});

	//$("#slide").siblings('.ui-dialog-titlebar').hide();
	$(".ui-dialog-titlebar-close").css('visibility','hidden');
	$("#slide").dialog("open");
	scaleContentToFit(slideContainer.id, slideContent.id);

	//alert($(".ui-dialog-titlebar").height());
	//alert("ms2:"+ $("#slide").height());
	//origDocumentHeight = $("#slide").height();//+ $(".ui-dialog-titlebar").height() + 10;
	//origDocumentWidth = $("#slide").width();
 //   $("#slide").height(origDocumentHeight);
	
    var pageInfo = (index+1) + "/" + contentArray.length;
    $("#pageNumber").text(pageInfo);
    $('#pageNumber').prop('disabled', true);
    
	//$('#nextButton').text(">");
    
	
	//$("#sreenToggleButton").text("^");
	//$('#prevButton').text("<");
	$('#prevButton').prop('disabled', true)
	//$('#prevButton').hide();
	if (contentArray.length <= 1) 
	{ 
		$('#nextButton').prop('disabled', true);
		$('#nextButton').hide();
	}
	
	var keyDownDone = false;
	
	$(document).keydown(function(event) 
	{
		//alert("keydown");
		keyDownDone = true;
	});

	$(document).keyup(function(event) 
	{	
		if (keyDownDone == false)
		{
			console.log("key down not pressed.");
		//	return;
		}
		
		keyDownDone = false;
		
		var keycode=(event.keyCode?event.keyCode:event.which);
		if(keycode == 37)
		{
			$('#prevButton').click();
		}
		else if (keycode == 39)
		{
			$('#nextButton').click();
		}
		else if (keycode == 122 || keycode == 27) //F11 pressed 
		{			    
			//	$(".ui-dialog-titlebar").hide();
		//	$("#slide").height(origDocumentHeight); 
			//$("#sreenToggleButton").text("Full Screen"); 
		}       
		//alert("changed");
		//event.defaultPrevented;
		
	});
	
	//document.focus();
	//toggleScreeen("BecomeFullScreen");	
	/*fullScreenChangeDetect(origDocumentHeight, slide, function (isFullScreen)
	            { if (!isFullScreen) { $("#slide").dialog("close"); } });*/
	
	
	fullScreenChangeDetect(origDocumentHeight-140, slide, function (fullScreenStatus) {
		$("#slide").siblings('.ui-dialog-titlebar').show();
		scaleContentToFit(slideContainer.id, slideContent.id);
	});	
}
