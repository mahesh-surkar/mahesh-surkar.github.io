var jsonPages;

function loadCMSContent(conentId, jsonToUse)
{
	jsonPages = JSON.parse(jsonToUse);
	myHTML = document.body;
	mainPage  = getMainPageFromJSON();
	alert (":"+ mainPage.Name);
	buildContent(conentId, mainPage, myHTML);
}


function getMainPageFromJSON()
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

	if (!jsonPage || jsonPage == "")
	{
		alert("Invalid Json to parse. main page not found in JSON.");
		return "";
	}

	return jsonPage;
}


function getPageJsonByName(pageName)
{
	var jsonPage = "";
	
	for (var index = 0; index < jsonPages.Pages.length; index++) 
	{
		if (!jsonPages.Pages[index].Name || jsonPages.Pages[index].Name == "" )
		{
			alert("Invalid Json to parse. Page Name is empty.");
			return "";
		}  
		
		if (jsonPages.Pages[index].Name == pageName)
		{
			jsonPage = jsonPages.Pages[index];
			break;
		}
	}

	if (!jsonPage || jsonPage == "")
	{
		alert("Invalid Json to parse. main page not found in JSON.");
		return "";
	}

	return jsonPage;
}

function buildContent(conentId, jsonPage, nodeToAppend)
{
	var list = document.createElement("ol");
	list.id = conentId;

	alert(":  " + jsonPage);
	//var jsonPage = JSON.parse(jsonToUse);
	
	//subpages = jsonPage.Page.SubPages;
	
	jsonPage.SubPages.sort(function(a,b){
	    //return a.attributes.OBJECTID - B.attributes.OBJECTID;
	    if(a.IndexNumber== b.IndexNumber)
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
		
		if (!jsonPage.SubPages[index].LinkURLorJSON || jsonPage.SubPages[index].LinkURLorJSON  == "" )
		{
			alert("Invalid Json to parse. Link url is empty.");
			return;
		}
		
		if (jsonPage.SubPages[index].Category == "INDEX")
		{
			var newConentId = conentId + "_" + index;
			appendContent(list, jsonPage.SubPages[index].LinkName);
			var pageJson = getPageJsonByName(jsonPage.SubPages[index].LinkURLorJSON);
			buildContent(newConentId, pageJson, list);
		}
		else 
		{		
			appendContent(list, jsonPage.SubPages[index].LinkName);
		}
	}
	
	nodeToAppend.appendChild(list);
}

function appendContent(node, linkName)
{
	var newlink = document.createElement('a');
	newlink.innerHTML = linkName;
	newlink.setAttribute('title', linkName);
	newlink.setAttribute('href', '#');
	//newlink.className = ;

	var elem = document.createElement("li");
	elem.appendChild(newlink);	
	node.appendChild(elem);
}