function laodLinearAgebra()
{
	var LinearAlgebra = [];
	LinearAlgebra[0] = slideUnderstandingLinearAlgebra(); 
	              
    LinearAlgebra[1] = document.createElement("div");
	var heading1 = document.createElement("h1");
    var headingText1 = document.createTextNode("Linear Algebra");          // Create a text node
    heading1.appendChild(headingText1);                                   // Append the text to <h1>   
    LinearAlgebra[1].appendChild(heading1);
    
    LinearAlgebra[2] = document.createElement("div");
	var heading2 = document.createElement("h1");
    var headingText2 = document.createTextNode("Linear Algebra");          // Create a text node
    heading2.appendChild(headingText2);                                   // Append the text to <h1>   
    LinearAlgebra[2].appendChild(heading2);
    
	openSlide(LinearAlgebra);
}

function slideUnderstandingLinearAlgebra()
{
	slideElem = document.createElement("div");
	var heading = document.createElement("h5");
    var headingText = document.createTextNode("Understanding Linear Algebra:");     
    heading.appendChild(headingText);
    
    var matrixExample = document.createElement("div");
    var matrixExampleText = document.createTextNode("Example:");
    
    var brline1 = document.createElement("br"); 
    
    
    var answer = document.createElement("textarea");
	answer.id = "Answer";
	answer.placeholder = "my scrach pad";
	    
	var mypara1 = document.createElement("p");
	mypara1.innerHTML = 'When `a != 0`, there are two solutions to `ax^2 + bx + c = 0` and  they are' 
		                                    + '`x = (-b +- sqrt(b^2-4ac))/(2a) .`';
	
    slideElem.appendChild(heading);
    slideElem.appendChild(matrixExampleText);
    slideElem.appendChild(brline1);
    
    slideElem.appendChild(mypara1);
    slideElem.appendChild(answer);
    
    return slideElem;

}


function mathInputBoard()
{
	
	mathInputBoard = document.createElement("div");
	
	 var dispElem = document.createElement("textarea");
	 dispElem.id = "mathInputDispElem";
	 dispElem.placeholder = "my scrach pad";
		    
	 var brline1 = document.createElement("br"); 
	 
    var matrixExample = document.createElement("div");
    var matrixExampleText = document.createTextNode("Example:");
    
   
    
	
}