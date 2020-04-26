function laodSimpleWebHome(myContentId, csrfToken)
{
   if (window.location == window.parent.location)
   {
      window.name = homeWindowName; 
      laodHeaderLayout(csrfToken);
      loadHomeLayout(myContentId);
   }
}

function loadCMSContent(conentId, jsonToUse)
{
	if (window.location == window.parent.location)
	{
		window.name = homeWindowName; 
		laodHeaderLayout(csrfToken);
		loadHomeLayout(myContentId);
	}

	var jsonPages = JSON.parse(jsonToUse);
	//alert(jsonPages);
	var myHTML = document.body;
	mainPage = getMainPageFromJSON(jsonPages);	
	buildContentUsingBookTemplate(conentId, mainPage, jsonPages, myHTML);
}

function getMainPageFromJSON(jsonPages)
{
	var jsonPage = "";
	for (var index = 0; index < jsonPages.Pages.length; index++) 
	{
		if (!jsonPages.Pages[index].Type || jsonPages.Pages[index].Type == "" )
		{
			alert("Invalid Json to parse. Page Type is empty.");
			return "";
		}  
		
		if (jsonPages.Pages[index].Type == "MainPage")
		{
			jsonPage = jsonPages.Pages[index];
			break;
		}
	}
 
	if (typeof jsonPage == undefined || !jsonPage || jsonPage == "")
	{
		alert("Invalid Json to parse. main page not found in JSON.");
		return "";
	}

	return jsonPage;
}


function getJsonForPage(pageName, jsonPages)
{
	var jsonPage = "";
	
	for (var index = 0; index < jsonPages.Pages.length; index++) 
	{
		if (!jsonPages.Pages[index].LinkName || jsonPages.Pages[index].LinkName == "" )
		{
			alert("Invalid Json to parse. Page Name is empty.");
			return "";
		}  
		
		if (jsonPages.Pages[index].LinkName == pageName)
		{
			jsonPage = jsonPages.Pages[index];
			break;
		}
	}

	if (!jsonPage || jsonPage == "")
	{
		alert("Invalid Json to parse. Index page not found in JSON, page name :" +  pageName);
		return "";
	}

	return jsonPage;
}

function buildContentUsingBookTemplate(conentId, mainPage, jsonPages, addToNode)
{
	bookIndexDiv = document.createElement("div");
	bookIndexDiv.id = "bookIndexDiv";
	bookIndexDiv.className = "bookIndex";
	
	bookContentDiv = document.createElement("iframe");
	
	bookContentDiv.id = "bookContentDiv";
	bookContentDiv.name = "bookContentDiv";
	
	bookContentDiv.style.height ="100%";
	bookContentDiv.style.width ="75%";
	bookContentDiv.style.border ="0";
	bookContentDiv.setAttribute('allowFullScreen', '1');
	bookContentDiv.setAttribute('mozAllowFullscreen', '');
	
	if ( mainPage.LinkPage && jsonPage.LinkPage.LinkPage != "" )
	{
		bookContentDiv.src = "SWContent?page=" + mainPage.LinkPage + "&newTab=false";
	}
	
	addToNode.style.overflow = "hidden";
	addToNode.appendChild(bookIndexDiv);
	addToNode.appendChild(bookContentDiv);
	
	var list = document.createElement("div");
	list.id = conentId;
	list.className = "bookElement";
	
	bookIndexDiv.appendChild(list);
	buildContent(conentId, mainPage, jsonPages, bookIndexDiv, "bookContentDiv");
}

function buildContent(conentId, jsonPage, jsonPages, nodeToAppendIndex, nodeToShowContent)
{	
	
	var childlist = document.createElement("div");
	childlist.id = conentId + "_child";
	childlist.className = "bookElement";
	
	
	var uid = conentId +"_1";
	
	if (!jsonPage.LinkPage || jsonPage.LinkPage.LinkPage  == "" )
	{
		jsonPage.LinkPage = "#";
	}
	
	appendContent(nodeToShowContent, nodeToAppendIndex, jsonPage.LinkName, jsonPage.LinkPage, uid,
			"ADD_DISP_TOGGLER", childlist);
	nodeToAppendIndex.appendChild(childlist);
	
	//return ;
	jsonPage.SubPages.sort(function(a,b) {
	    //return a.attributes.OBJECTID - B.attributes.OBJECTID;
	    if(a.IndexNumber == b.IndexNumber)
	        return 0;
	    if(a.IndexNumber < b.IndexNumber)
	        return -1;
	    if(a.IndexNumber > b.IndexNumber)
	        return 1;
	});
	
	
	for ( var index = 0; index < jsonPage.SubPages.length; index++) 
	{
		if (!jsonPage.SubPages[index].LinkName || jsonPage.SubPages[index].LinkName  == "" )
		{
			alert("Invalid Json to parse. Link name is empty.");
			return;
		}
		
		if (jsonPage.SubPages[index].Category == "CONTENT" &&
				(!jsonPage.SubPages[index].LinkPage || jsonPage.SubPages[index].LinkPage  == "" ))
		{
			alert("Invalid Json to parse. Link url is empty.");
			return;
		}
		
		if (jsonPage.SubPages[index].Category == "INDEX")
		{
			var newConentId = conentId + "_" + index;
			var uid = newConentId + index;			
			var pageJson = getJsonForPage(jsonPage.SubPages[index].LinkName, jsonPages);
			buildContent(newConentId, pageJson, jsonPages, childlist, nodeToShowContent);
		}
		else if(jsonPage.SubPages[index].Category == "CONTENT")
		{		
			var linkPage = jsonPage.SubPages[index].LinkPage;
			var uid = conentId + index;
			appendContent(nodeToShowContent, childlist, jsonPage.SubPages[index].LinkName, 
					linkPage, uid, "NO_DISP_TOGGLER");
		}
		else
		{
			alert("Invalid Json to parse. Page catagory is unknown.");
			return;
		}
	}
	
}

function appendContent(nodeToShowContent, nodeToAppend, linkName, myContentId, uid, dispToggler,
	       	elementToToggle)
{
	var newLink = "";
	if(myContentId != "#")
	{  
		linkURL = "SWContent?page=" + myContentId; 
		//function from header js	
		newLink = createNewLink(linkURL, linkName, nodeToShowContent, uid);  		
	}
	else
	{
		newLink = document.createElement('span');
		newLink.className = "CMSLinkHeading";
		newLink.innerHTML = linkName;
	}
    
    
    if (dispToggler == "ADD_DISP_TOGGLER")
	{ 
    	var newbutton = document.createElement("button");
        newbutton.innerHTML = "-";
        newbutton.className = "CMSdispToggler";
        newbutton.onclick = (function () {
        	if (newbutton.innerHTML == "-")  
        	{
        		newbutton.innerHTML ="+"; 
        		elementToToggle.style.display = "none";
        	}
        	else
        	{
        		newbutton.innerHTML ="-"; 
        		elementToToggle.style.display = "";
        	}
        });
    	nodeToAppend.appendChild(newbutton);
    }
    else
    {
    	var newbutton = document.createElement("button");
        newbutton.innerHTML = "";
        newbutton.className = "CMSdispToggler";
        nodeToAppend.appendChild(newbutton);
    }
	nodeToAppend.appendChild(newLink);
	nodeToAppend.appendChild(document.createElement("br"));
}

function isValidURL(str) 
{
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str))
  {
    return false;
  }
   else
  {
    return true;
  }
}

function loadHomeLayout(myContentId)
{
   var jsonHome=JSON.parse(HomeJson);
   for (index=0; index < jsonHome.page.length; index++)
   {  
	   //alert("adding iframe " + index);
	   if (typeof jsonHome.page[index].showPage != undefined 
			            && (jsonHome.page[index].showPage == "true" || jsonHome.page[index].showPage == true))
	   {		   
		   ifrm = document.createElement("IFRAME");
		   ifrm.src = webPageLayout + "?page=" + jsonHome.page[index].source +"&newTab=false";		  

		   if (jsonHome.page[index].addPageIdentifier == "true" && myContentId != "None")   
		   {			   
			   if (isValidURL(myContentId))
			   {
				   ifrm.src = myContentId;
			   }	
			   else 
			   {	
				   ifrm.src =  SWHome + "?page=" + myContentId +"&newTab=false";
			   }
		   }

		   /*if (typeof jsonHome.page[index].showPage != undefined  
				                            && jsonHome.page[index].position == "fixed")
		   {
			   alert ("pos fixed");  
			   ifrm.style.position == "absolute";
		   }*/

		   
		   var docHeight =  jsonHome.page[index].pageHeight.trim();
		   //Remove Header size from percetage first
		   if (docHeight.charAt(docHeight.length-1) == '%')
		   {
			   var headerHeight = 110;			   
			 //  alert(document.height);
			   if (typeof document.height !== 'undefined')
			   {
				   docHeight = document.height //For webkit browsers.
			   } 
			   else 
			   {			    	
				   var B = document.body;
				   H = document.documentElement;				    
				   docHeight = Math.max(B.scrollHeight, B.offsetHeight, H.clientHeight,
						                                     H.scrollHeight, H.offsetHeight);
			   }			   

			   docHeight = docHeight - headerHeight;
			   heightPersent = jsonHome.page[index].pageHeight.replace('%', '');
			   docHeight = (docHeight * heightPersent/100)
		   }
		   
		   if (docHeight == "freeScale")
		   {
			   ifrm.style.height = "87%";
		   }
		   else
		   {
			   ifrm.style.height = docHeight;
		   }
				   
		   ifrm.style.width = jsonHome.page[index].pageWidth;
		   ifrm.overflow = "hidden";
		   ifrm.align = "top";
//		   ifrm.scrolling = "jsonHome.page[index].scrolling";
		   ifrm.frameBorder = "0";
		   ifrm.setAttribute('allowFullScreen', '1');
		   ifrm.setAttribute('mozAllowFullscreen', '');
		   ifrm.name = jsonHome.page[index].pageName;
		   ifrm.id = jsonHome.page[index].pageName;
		   document.body.appendChild(ifrm);		   
		   //alert("added iframe " + index);
	   }
   }
}

