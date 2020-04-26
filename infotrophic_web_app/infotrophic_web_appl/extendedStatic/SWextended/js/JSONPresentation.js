function laodJsonPresentation()
{
	var JSONSlide = [];
    JSONSlide[0] = document.createElement("div");
	var heading = document.createElement("h1");
    var headingText = document.createTextNode("JSON");     
    heading.appendChild(headingText);                               
    JSONSlide[0].appendChild(heading);
      
    JSONSlide[1] = document.createElement("div");
	var heading1 = document.createElement("h1");
    var headingText1 = document.createTextNode("JSON1");     // Create a text node
    heading1.appendChild(headingText1);                                   // Append the text to <h1>   
    JSONSlide[1].appendChild(heading1);
    
    JSONSlide[2] = document.createElement("div");
	var heading2 = document.createElement("h1");
    var headingText2 = document.createTextNode("JSON2");     // Create a text node
    heading2.appendChild(headingText2);                                   // Append the text to <h1>   
    JSONSlide[2].appendChild(heading2);
    
	openSlide(JSONSlide);
}