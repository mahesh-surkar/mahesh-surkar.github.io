function laodSimpleWebHeader(csrfToken) {
	window.title = headerTitle;
	window.name = headerWindowName;
	laodHeaderLayout(csrfToken);
}

function laodHeaderLayout(csrfToken) {

	if (window.location !== window.parent.location) {
		// header already added
		return;
	}

	if (window.name != headerWindowName) {
		  headerPack = document.createElement("div");
		  headerPack.className = "completeHeaderDiv";
		  
          headerDiv = document.createElement("table");
          headerBackDiv = document.createElement("div"); //as hederdiv is fix so place holder for it on screen
          headerDiv.className = "headerDiv";
          
          headerContainer = document.createElement("div");
          headerContainer.className = "headerContainer";  

          loadMenues(headerContainer);
          loadHeaderBrDiv(headerContainer);	
          loadSearch(csrfToken, headerContainer, "searchform1");
          loadLogin(headerContainer);
          headerCenter = document.createElement("div");      
          headerCenter.className = "headerCenter";
         
          headerDiv.appendChild(headerContainer);
          headerCenter.appendChild(headerDiv);
          headerPack.appendChild(headerCenter);
          document.body.appendChild(headerPack);
          loadHeaderEnd(headerPack);          
		
	}

}


function loadHeaderBrDiv(nodeToAppend)
{
	var headerBrDiv = document.createElement("div");
	headerBrDiv.className ="headerBrDiv";		
	nodeToAppend.appendChild(headerBrDiv);
}

function loadLogin(nodeToAppend) {
	var loginDiv = document.createElement("span");
        loginDiv.className ="loginDiv";
	nodeToAppend.appendChild(loginDiv);
	//alert("login called");	
	
	var myLinkName = "Log In";
	var myLinkURL = moodleLoginURL;
	//var myLinkURL = moodleLogoutURL;
	var myTarget = SWContent;
	var uuid = "324364";
	var newlink1 = createNewLink(myLinkURL, myLinkName, myTarget, uuid);
	newlink1.className = "login";
        loginDiv.appendChild(newlink1);
}

function hideSearchPoppup(content) {
	if ($("#searchResult").length) {
		$("#searchResult").dialog("close");
	}
}

function addSearchPoppup(csrfToken, content) {

	if ($("#searchResult").length) {
		$("#searchResult").prepend(content);
	} else {
		searchDiv = document.createElement("div");
		searchDiv.name = "searchResult";
		searchDiv.id = "searchResult";
		searchDiv.title = "Search Result....";
		// searchDiv.overflow="auto";
		searchDiv.height = "350";

		// loadSearch(csrfToken, searchDiv, "searchForm2");
		searchDiv.appendChild(content);
		document.body.appendChild(searchDiv);
	}

	$("#searchResult").dialog({
		autoOpen : false,
		hide : "puff",
		show : "slide",
		closeText : "hide",
		dialogClass : 'alert',
		modal : true,
		title : "Search Result...",
		// zIndex: 3999,
		minHeight : "75%",
		width : "99%",
		dialogbeforeclose : function(event, ui) {
			$("#searchResult").empty();
		},
	});

	$("#searchResult").dialog("open");

}

function loadHeaderEnd(headerToEnd) {
	var headerEnd = document.createElement("div");
	var headerEnd1 = document.createElement("h1");
	var text = document.createTextNode("I");
	headerEnd1.style.color = "white";
	headerEnd1.appendChild(text);
	headerEnd.appendChild(headerEnd1);
	var headerEnd2 = document.createElement("br");
	headerEnd.appendChild(headerEnd2);
	headerToEnd.appendChild(headerEnd);
}

function loadSearch(csrfToken, nodeToAdd, myFormName) {

	var searchDiv = document.createElement("span");
	searchDiv.className = "searchDiv";
	nodeToAdd.appendChild(searchDiv);
	// loadAjaxSearch(csrfToken, nodeToAdd, myFormName)
	loadSimpleSearch(csrfToken, searchDiv, myFormName, false);

}

function loadSimpleSearch(csrfToken, nodeToAdd, myFormName, usePost) {	
	
	var searchForm = document.createElement("form");
	searchForm.method = usePost == true ? "post" : "get";
	searchForm.action = "Search";
	searchForm.target = SWContent;
	searchForm.id = myFormName;
	searchForm.name = myFormName;

	searchForm.className = "headerForm";

	var searchBox = document.createElement("input");
	searchBox.type = "search";
	// searchBox.id = "searchBox";
	// searchBox.name = "searchBox";
	searchBox.id = "q";
	searchBox.name = "q";
	searchBox.className = "searchInput";
	searchBox.placeholder = headerSearchDefaulMsg;

	var searchSubmit = document.createElement("input");

	searchSubmit.type = "submit";
	searchSubmit.id = "searchSubmit";
	searchSubmit.name = "searchsubmit";
	searchSubmit.value = "Search";
	searchSubmit.className = "headerButton";

	searchForm.appendChild(searchBox);
	searchForm.appendChild(searchSubmit);
	nodeToAdd.appendChild(searchForm);
}

function loadAjaxSearch(csrfToken, nodeToAdd, myFormName) {

	loadSimpleSearch(csrfToken, nodeToAdd, myFormName, true);

	$("#" + myFormName).submit(
			function(event) {
				// alert("Search submit alert");
				// Stop form from submitting normally
				event.preventDefault();

				// Get some values from elements on the page:
				var $form = $(this), searchFor = $form.find(
						"input[id='searchBox']").val().trim(), url = $form
						.attr("action");

				if (searchFor == "") {
					data = "";
					processSearchResult(csrfToken, searchFor, data);
					return;
				}
				// var csrfToken =
				// document.getElementsById("csrfmiddlewaretoken")[0].value;
				// alert(csrfToken)
				// Send the data using post
				var posting = $.post(url, {
					page : "SimpleWebSearch",
					searchBox : searchFor,
					csrfmiddlewaretoken : csrfToken
				});

				// Put the results in a div
				posting.done(function(data) {
					processSearchResult(csrfToken, searchFor, data);
				});

				posting.fail(function(jsonData) {
					alert("Failed to search the content." + jsonData);
				});

				posting.always(function() {
					// alert ("Always called for search the content.");
				});

			});

}

function processSearchResult(csrfToken, searchFor, jsonSearchResult) {

	var resultDiv = document.createElement("div");
	var h1Tag = document.createElement("H4");
	var searchedFor = document.createTextNode("Search Result for : "
			+ searchFor);
	h1Tag.appendChild(searchedFor);

	var searchResults = "";

	if (jsonSearchResult != "") {
		searchResults = jsonSearchResult.SearchResult;
	}

	resultDiv.appendChild(h1Tag);

	for ( var index = 0; index < searchResults.length; index++) {
		/*
		 * var resultLink = document.createElement("a"); resultLink.innerHTML =
		 * searchResults[index].Title; resultLink.title =
		 * searchResults[index].Title; //resultLink.id =
		 * searchResults[index].Title; resultLink.href = "SimpleWebHome?page=" +
		 * searchResults[index].Link; resultLink.target = "SimpleWebContent";
		 */

		var resultLink = '<a href="SimpleWebHome?page='
				+ searchResults[index].Link
				+ '" target="SimpleWebContent" onclick="hideSearchPoppup();">'
				+ searchResults[index].Title + '</a>';
		var resultDescription = document
				.createTextNode(searchResults[index].Description);

		var brLine = document.createElement("br");
		var brLine1 = document.createElement("br");
		var brLine2 = document.createElement("br");
		// resultDiv.appendChild(resultLink);
		resultDiv.innerHTML = resultDiv.innerHTML + resultLink;
		resultDiv.appendChild(brLine);
		resultDiv.appendChild(resultDescription);
		resultDiv.appendChild(brLine1);
		resultDiv.appendChild(brLine2);
	}

	if (searchResults.length == 0) {
		var content = document.createTextNode("Search Result is empty....");
		resultDiv.appendChild(content);
	}

	addSearchPoppup(csrfToken, resultDiv);

}
function loadBanner() {
	var h1Tag = document.createElement("H1"); // Create a <h1> element	
	h1Tag.id = headerBanner;

	var text = document.createTextNode(headerBanner); // Create a text node
	h1Tag.appendChild(text); // Append the text to <h1>
	h1Tag.className = "banner";
	
	return (h1Tag);
}

function loadMenues(nodeToAdd) {
	var list = document.createElement("ul");
	list.id = "menu";

	var jsonMenu = JSON.parse(InfowealthJson);

	for ( var index = 0; index < jsonMenu.Menu.length; index++) {
		if (jsonMenu.Menu[index].Display == "signleColoumnMenu") {
			signleColoumnMenu(list, "drop", jsonMenu.Menu[index]);
		} else {
			multiColoumnMenu(list, "drop", jsonMenu.Menu[index]);
		}
	}

	list.appendChild(loadBanner());
	nodeToAdd.appendChild(list);
}

function addHomeMenu(node) {

}

function makeNewTabOrWindowTrue(linkId, url){
	var obj = document.getElementById(linkId);
	//alert("makeNewTabOrWindowTrue :" + linkId + "::" + url);
	obj.href = url;
	obj.href = url + "&newTab=true";
	window.history.pushState("object or string", "Title", obj.href);
	return true;
}

function adjustLinkForSameTabOrWindow(event, linkId, url) {
	var obj = document.getElementById(linkId);
	obj.href = url;
	
	if (event.which == 1) // left mouse button
	{
		obj.href = url + "&newTab=false";
	}
	window.history.pushState("object or string", "Title", obj.href); 
	return true;
}

function signleColoumnMenu(node, CSSClassName, jsonMenu) {
	var colDiv = [];
	var counter = 0;
	dataStr = "<h2>" + jsonMenu.MenuDesc + "</h2>";
	colDiv[counter] = createDiv("col_2", dataStr, 0);
	counter++;
	for ( var index = 0; index < jsonMenu.SubMenu.length; index++) {
		if (jsonMenu.SubMenu[index].SubMenuHeading
				&& jsonMenu.SubMenu[index].SubMenuHeading != " ") {
			dataStr = "<h2>" + jsonMenu.SubMenu[index].SubMenuHeading + "</h2>";

			colDiv[counter] = createDiv("col_1", dataStr, 0);
			counter++;
		}

		if (jsonMenu.SubMenu[index].Description
				&& jsonMenu.SubMenu[index].Description != " ") {
			colDiv[counter] = createDiv("col_2",
					jsonMenu.SubMenu[index].Description, 0);
			counter++;
		}

		var linksList = document.createElement("ul");
		var addLinksList = false;
		for (linkIndex = 0; linkIndex < jsonMenu.SubMenu[index].Links.length; linkIndex++) {

			var myLinkName = jsonMenu.SubMenu[index].Links[linkIndex].LinkName;
			var myLinkURL = jsonMenu.SubMenu[index].Links[linkIndex].LinkURL;

			if (myLinkName && myLinkURL) {

				addLinksList = true;
			}

			var newlink = document.createElement('a');
			newlink.innerHTML = myLinkName;
			newlink.setAttribute('title', myLinkName);
			newlink.setAttribute('href', myLinkURL);
			newlink.setAttribute('target', "SimpleWebContent");

			var elem = document.createElement("li");
			elem.appendChild(newlink);
			linksList.appendChild(elem);
		}

		if (addLinksList) {
			colDiv[counter] = document.createElement('div');
			colDiv[counter].className = "col_1";
			colDiv[counter].appendChild(linksList);
			counter++;
		}

	}

	var infoDiv = appendDiv("dropdown_2columns", colDiv);

	addDropdown(jsonMenu.MenuName, node, infoDiv, CSSClassName);

}

function multiColoumnMenu(node, CSSClassName, jsonMenu) {
	dataStr = "<h2>" + jsonMenu.MenuDesc + "</h2>";
	var colDiv = [];

	colDiv[0] = createDiv("col_5", dataStr, 0);

	for (index = 0; index < jsonMenu.SubMenu.length; index++) {
		infoSectionName = "<h3>" + jsonMenu.SubMenu[index].SubMenuHeading + "</h3>";
		var linksList = document.createElement("ul");

		var addLinksList = false;
		for (linkIndex = 0; linkIndex < jsonMenu.SubMenu[index].Links.length; linkIndex++) {

			var myLinkName = jsonMenu.SubMenu[index].Links[linkIndex].LinkName;
			var myLinkURL = jsonMenu.SubMenu[index].Links[linkIndex].LinkURL;

			if (myLinkName && myLinkURL) 
			{
				addLinksList = true;
				var newlink1 = createNewLink(myLinkURL, myLinkName, SWContent, index);			
			    linksList.appendChild(newlink1);
		   }
		}

		colDiv[index + 1] = document.createElement('div');
		colDiv[index + 1].className = "col_1_noScroll";
		colDiv[index + 1].innerHTML = colDiv[index + 1].innerHTML + infoSectionName;
		
		if (addLinksList) {
			sectDiv = document.createElement('div');
			sectDiv.className = "col_1";
			sectDiv.appendChild(linksList);
			colDiv[index + 1].appendChild(sectDiv);
			// alert ("appended link " + myLinkURL+index);
		}
		
	/*	if (addLinksList) {
			colDiv[index + 1].appendChild(linksList);
			// alert ("appened link " + myLinkURL+index);

		}*/
	}

	var infoDiv = appendDiv("dropdown_5columns", colDiv);
	addDropdown(jsonMenu.MenuName, node, infoDiv, CSSClassName);
}

function checkIframeLoaded(myTarget) {
    // Get a handle to the iframe element
    iframe = document.getElementById(myTarget);
    alert("iframe:"+myTarget);
    try
    {
    	var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    	// Check if loading is complete
    	alert(":"+iframeDoc.readyState);
    	if ( iframeDoc.readyState  == 'complete' ) {

    		//iframe.contentWindow.alert("Hello");

    		iframe.contentWindow.onload = function(){
    			alert("Content page loaded ");
    		};

    		// The loading is complete, call the function we want executed once the iframe is loaded
    		afterLoading();
    		return;
    	} 
    }
    catch(err)
    {
    	alert(":"+ err.message);
    }
    // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
    
    setTimeout(function() {
		checkIframeLoaded(myTarget);
	}, 100);
    //window.setTimeout('checkIframeLoaded();', 100);
}

function afterLoading(){
    alert("After content loading");
}
function createNewLink(myLinkURL, myLinkName, myTarget, uuid)
{
	var d = new Date();
	var myTime = d.getTime();	
	var myId = myLinkURL + "_" + myTime + "_" + uuid;
	var newlink1 = document.createElement('a');
	newlink1.name = myId; //index
	newlink1.id = myId;
	newlink1.innerHTML = myLinkName;
	newlink1.setAttribute('title', myLinkName);
	newlink1.setAttribute('href', myLinkURL + "&newTab=true");
	newlink1.setAttribute('target', myTarget);
	newlink1.className = "CMSLink";
	event = 1; //left button click
	newlink1.onclick= (function(event, myId, myLinkURL, myTarget) {
		 return function(event){
		   adjustLinkForSameTabOrWindow(event, myId, myLinkURL); 
		   var obj = document.getElementById(myId);
		  // checkIframeLoaded(myTarget);
		   // alert(":"+ obj.href);
		  };
	})(event, myId, myLinkURL, myTarget);

	newlink1.addEventListener('click', function(event){
		setTimeout(function() {
			makeNewTabOrWindowTrue(myId, myLinkURL);
		//	checkIframeLoaded(myTarget);
		}, 300);		
	
	});
	
	return newlink1;
}

function appendDiv(divCSSClassName, divArray) {
	iDiv = document.createElement('div');
	// iDiv.id = 'block';
	iDiv.className = divCSSClassName;
	for (index = 0; index < divArray.length; index++) {
		iDiv.appendChild(divArray[index]);
	}
	return iDiv
}

function createDiv(divCSSClassName, data, isDataDiv) {
	iDiv = document.createElement('div');
	// iDiv.id = 'block';
	iDiv.className = divCSSClassName;

	if (!isDataDiv) {
		iDiv.innerHTML = iDiv.innerHTML + data;
	} else {
		iDiv.appendChild(data);
	}
	return iDiv
}

function addDropdown(linkName, node, displayDiv, CSSClassName) {

	var newlink = document.createElement('a');
	newlink.innerHTML = linkName;
	newlink.setAttribute('title', linkName);
	newlink.setAttribute('href', '#');
	newlink.className = CSSClassName;

	var elem = document.createElement("li");
	elem.appendChild(newlink);
	elem.appendChild(displayDiv);
	node.appendChild(elem);
}
