function SW_CovertToHtmlElement(codeToConvertID)
{
	codeToConvert = document.getElementById(codeToConvertID);
//	codeToConvert = document.querySelector('pre');
	
	var rows = [];
	var elemIdArray = [];
	rows = codeToConvert.innerHTML.split("\n");
	
	for (index=0; index<rows.length; index++)
	{
		var elem = document.createElement("div");		
		elem.className = codeToConvert.className;
		elem.innerHTML = rows[index].replace(/ /g, '&nbsp;');
		elem.innerHTML = rows[index].replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
		//alert(elem.innerHTML);
		if (rows[index] && rows[index].trim().length !== 0)
		{
			elem.id = codeToConvertID + "_"+ index;
			elem.name = codeToConvertID +  "_" + index;
			elemIdArray[index] = codeToConvertID +  "_" + index;
		}
		
		codeToConvert.parentNode.appendChild(elem);		
		codeToConvert.parentNode.insertBefore(elem, codeToConvert || null);
	}
	
	codeToConvert.style.display = "none";
	
	return elemIdArray;
}

function SW_MakeMeInteractive(elemIdArray, JSONToMakeInteractive, isComputerLanguage) 
{
	isComputerLanguage = typeof isComputerLanguage === 'undefined' ? true : false; //default ignore comments
	
	if (typeof linesToMakeInteractive !== 'undefined' ) 		
	{			
	 	linesToMakeInteractive = JSON.parse(JSONToMakeInteractive);
		//linesToMakeInteractive.sort(); //need to write			
	}
	
	var makeInteractive = false;
	var interactiveLine = 0;
	
	
	for (var lineIndex=1; lineIndex <= elemIdArray.length; lineIndex++)
	{
		var myLineNumber = Object.keys(linesToMakeInteractive)[interactiveLine];
		var interactiveContent= [];
		if (typeof linesToMakeInteractive != 'undefined' && lineIndex == myLineNumber)
		{
			interactiveContent = linesToMakeInteractive[myLineNumber];
			makeInteractive = true;
			interactiveLine++;
		}
		else
		{
			makeInteractive = false;
		}
		
		//alert (makeInteractive + "");
		var interactiveElement = document.getElementById(elemIdArray[lineIndex-1]); //array index starts from 0
		
		if (makeInteractive && interactiveElement)
		{
			interActiveDiv = document.createElement("div");			

			answer = document.createElement("textarea");
			answer.id = interactiveElement.id + "Answer";
			answer.placeholder = "---[Solve]---";
			var elemDisplay = "";

			//alert("Keys: "+ interactiveContent[0]);

			elemDisplay =  interactiveElement.innerHTML.replace(/(&nbsp;)*/g, '');	
			for (hideInfoKeys in interactiveContent)
			{				 
				var toHide = "";
				var position = [];

				if (Array.isArray(interactiveContent[hideInfoKeys]))
				{	
					toHide = interactiveContent[hideInfoKeys][0];
					for (var counter = 1; counter < interactiveContent[hideInfoKeys].length; counter++)
					{
						position[counter-1]=interactiveContent[hideInfoKeys][counter];
						//alert("pos:"+ counter);
					}
				}
				else
				{
					toHide = interactiveContent[hideInfoKeys];
					position[0]=1;
				}	
				
				//alert ("pos: "+ position.length );
				
				if (toHide.trim().length != 0)
				{
					position.sort(function(a, b){return b-a});
					for (index = 0; index<position.length; index++)
					{
					//	alert(toHide +":"+ position[index]);
						//elemDisplay =elemDisplay;
						elemDisplay = CustomReplace(elemDisplay, toHide, answer.placeholder, position[index]);
						//alert(":"+elemDisplay);
						//elemDisplay = elemDisplay.replace(toHide, "--------");
					}	
				}
				else
				{
					elemDisplay = "";
				}


			}	
			answer.innerHTML = elemDisplay;


			mySize = elemDisplay.length > answer.placeholder.length 
			? elemDisplay.length : answer.placeholder.length;		

			answer.rows = interactiveElement.innerHTML.split("\n").length;
			answer.cols = Math.min(mySize, 120);

			checkButton = document.createElement("button");			
			checkButton.innerHTML = "Check";
			checkButton.id = interactiveElement.id + "Check";
			checkButton.className = "btn",

			showButton = document.createElement("button");			
			showButton.innerHTML = "Show";
			showButton.id = interactiveElement.id + "Show";
			showButton.className = "btn",

			showButton.onclick  = (function (interActiveDiv, interactiveElement) { 
				return function () {					
					interActiveDiv.style.display = "none";
					interactiveElement.style.display = "";	
					interactiveElement.className = "warnLabel";
				}

			})(interActiveDiv, interactiveElement);

			checkButton.onclick  = (function (answer, interActiveDiv, interactiveElement) {
				return function () {
					var myAnswer = answer.value.trim().replace(/(&nbsp;)+/g, '');
					var exptAns = interactiveElement.innerHTML.trim().replace(/(&nbsp;)+/g, '');

					if (isAnswerCorrect(myAnswer, exptAns, isComputerLanguage))
					{
						interActiveDiv.style.display = "none"; 
						interactiveElement.style.display = "";	
						interactiveElement.className = "infoLabel";
					}
					else
					{
						alert("Oops, You are wrong this time! Try again."); 
					}
				}
			})(answer, interActiveDiv, interactiveElement); 

			interActiveDiv.appendChild(answer);
			interActiveDiv.appendChild(checkButton);
			interActiveDiv.appendChild(showButton);	
			interactiveElement.parentNode.appendChild(interActiveDiv);				
			interactiveElement.parentNode.insertBefore(interActiveDiv, interactiveElement || null);
			interactiveElement.style.display  = "none";

		}		      
	}

}

function CustomReplace(strData, strTextToReplace, strReplaceWith, replaceAt) {
    var index = strData.indexOf(strTextToReplace);
    for (var i = 1; i < replaceAt; i++)
        index = strData.indexOf(strTextToReplace, index + 1);
    if (index >= 0)
        return strData.substr(0, index) + strReplaceWith + strData.substr(index + strTextToReplace.length, strData.length);
    return strData;
}

function isAnswerCorrect(myAnswer, exptAns, isComputerLanguage)
{

	//alert(""+ myAnswer);
    //alert(""+ exptAns);
	
	//remove single line comments multiple statement terminator
	if (isComputerLanguage)
	{
		myAnswer = myAnswer.replace(/\/\/.*/g, ''); //remove //*
		exptAns = exptAns.replace(/\/\/.*/g, ''); //remove //*
		
		
		myAnswer = myAnswer.replace(/\#.*/g, ''); //remove # *
		exptAns = exptAns.replace(/\#.*/g, ''); //remove # *
		
		myAnswer = myAnswer.replace(/\/\*.*\*\//g, ''); //remove  /* */
		exptAns = exptAns.replace(/\/\*.*\*\//g, ''); //remove /* */
		
		myAnswer = myAnswer.replace(/\/\*.*/g, ''); //remove  /* 
		exptAns = exptAns.replace(/\/\*.*/g, ''); //remove /* 
		
		myAnswer = myAnswer.replace(/\'\'\'.*\'\'\'/g, ''); //remove  '''* ''' 
		exptAns = exptAns.replace(/\'\'\'.*\'\'\'/g, ''); //remove  '''* ''' 					
		
							
		myAnswer = myAnswer.replace(/\;+/g, ';'); //remove multiple statement terminator
		exptAns = exptAns.replace(/\;+/g, ';'); //remove multiple statement terminator
		myAnswer = myAnswer.replace(/\s+/g, ' ');  //remove multiple white spaces
		exptAns = exptAns.replace(/\s+/g, ' '); //remove multiple white spaces
						
		myAnswer = myAnswer.replace(/\*/g, ' \* ');
		exptAns = exptAns.replace(/\*/g, ' \* ');
		myAnswer = myAnswer.replace(/\//g, ' \/ ');
		exptAns = exptAns.replace(/\//g, ' \/ ');
		myAnswer = myAnswer.replace(/\'/g, ' \' ');
		exptAns = exptAns.replace(/\'/g, ' \' ');
		myAnswer = myAnswer.replace(/\[/g, ' \[ ');
		exptAns = exptAns.replace(/\[/g, ' \[ ');
		myAnswer = myAnswer.replace(/\]/g, ' \] ');
		exptAns = exptAns.replace(/\]/g, ' \] ');
		myAnswer = myAnswer.replace(/\{/g, ' \{ ');
		exptAns = exptAns.replace(/\{/g, ' \{ ');
		myAnswer = myAnswer.replace(/\}/g, ' \} ');
		exptAns = exptAns.replace(/\}/g, ' \} ');
		
		myAnswer = myAnswer.replace(/\"/g, ' \" ');
		exptAns = exptAns.replace(/\"/g, ' \" ');
		myAnswer = myAnswer.replace(/\(/g, ' \( ');
		exptAns = exptAns.replace(/\(/g, ' \( ');
		myAnswer = myAnswer.replace(/\)/g, ' \) ');
		exptAns = exptAns.replace(/\)/g, ' \) ');
		myAnswer = myAnswer.replace(/\;/g, ' \; ');
		exptAns = exptAns.replace(/\;/g, ' \; ');
		myAnswer = myAnswer.replace(/!/g, ' ! ');
		exptAns = exptAns.replace(/!/g, ' ! ');
		
		myAnswer = myAnswer.replace(/\+/g, ' \+ ');
		exptAns = exptAns.replace(/\+/g, ' \+ ');
		myAnswer = myAnswer.replace(/\-/g, ' \- ');
		exptAns = exptAns.replace(/\-/g, ' \- ');						

		myAnswer = myAnswer.replace(/\s+/g, ' ');  //remove multiple white spaces
		exptAns = exptAns.replace(/\s+/g, ' '); //remove multiple white spaces	
		
	} 

	//alert(""+ myAnswer);
	//alert(""+ exptAns);

	return (myAnswer == exptAns) ? true : false;	
}

function displayInteractivePage(contentArray)
{
	var interactiveDiv = document.createElement("div");
	
	for (var index=0;  index < contentArray.length; index++)
	{
		interactiveDiv.appendChild(contentArray[index]);
	}
	
	document.body.appendChild(interactiveDiv);
}
