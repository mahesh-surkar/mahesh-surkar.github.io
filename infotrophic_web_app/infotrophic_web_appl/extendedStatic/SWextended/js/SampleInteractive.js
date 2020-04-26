function loasSampleInteractive()
{	
	
	var text4 = document.createElement("pre");
	text4.innerHTML = `
	int addition(int a, int b) 
	{
		return a + b;		
	}
		`;	
	text4.id = "text4";
	text4.name = "text4";
	document.body.appendChild(text4);
	
	var interactiveElemIdArray = [];
	
    interactiveElemIdArray = SW_CovertToHtmlElement("text4");
    linesToMakeInteractive = '{ "2": ["pos", ["int a", 2] ], "3": [""]}';
      
    
	SW_MakeMeInteractive(interactiveElemIdArray, linesToMakeInteractive);
	
}

