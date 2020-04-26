function laodSWIndexer()
{
	
	index = getIndexCreator();
	document.body.appendChild(index);
}


function getIndexCreator()
{
	indexDiv =  document.createElement("div");
	//indexDiv.className = "SWCreatorElem";
	//indexNameInput = document.createElement("input");	
	//indexNameInput.type = "text";
	
	var indexRegion = getIndexingRegion();
	var pageDisplayer = getPageDisplayer();
	indexDiv.appendChild(indexRegion);
	indexDiv.appendChild(pageDisplayer);
	return indexDiv;
}


function getIndexingRegion()
{
	indexingRegion = document.createElement("div");
	indexingRegion.className = "SWIndex";
	
	return indexingRegion;

}

function getPageDisplayer()
{
	pageDisplay = document.createElement("div");	
	pageDisplay.className = "SWCreatorElem";
	return pageDisplay;

}
