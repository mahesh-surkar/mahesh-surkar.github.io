function loadQuestionGeneratorTool()
{
	var toolHolder  = document.createElement("div");
	toolHolder.id = "toolHolder";
	document.body.appendChild(toolHolder);	
	var templateGenrator = addQuestionGenerator(toolHolder);		
}

//API for Tool framework
function getReqJsForTool()
{
	var host = window.location.host;
	var myJS = "http://" + host + "/static/SWMaths/js/QuestionGeneratorTool.js";
	return myJS;
	
}

//API for Tool framework
function SWToolCodeGenerator()
{	
	var HTMLcode = generateQuestionTemplate();
	return HTMLcode;
}

function generateQuestionTemplate()
{
	var d = new Date();
	var uuid = d.getTime();
	var question = document.getElementsByClassName("QuestonDiv");
	var HTMLQuestion = generateHTMLDiv("QuestonDiv", question[0].value, uuid);
	var HTMLAnsChoice = generateAnswerChoice(uuid);
	HTMLcode = '<div>' + HTMLQuestion + HTMLAnsChoice + '</div>';	
    return HTMLcode;
}

function generateAnswerChoice(myId)
{
	var ansChoice = document.getElementsByClassName("AnsChoice");
	
	var d = new Date();
	var uuid = d.getTime();
	var myType = "radio"
	var HTMLCodeText = "";
	
	for (var index=0; index < ansChoice.length; index++)
	{
		tmpId = myId + "_" + index+1 + "_" + uuid;
		
		HTMLCodeText = HTMLCodeText + '<input type="' + myType +'" class="AnsChoice" id="' + tmpId
		                   + '" value ="' + ansChoice[index].value + '">';
	}	
	
	return HTMLCodeText;
}

function makeRadioButton(id, value, text) 
{
    var label = document.createElement("label");
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.id = id;
    radio.value = value;

    label.appendChild(radio);

    label.appendChild(document.createTextNode(text));
    return label;
 }

function addMultipleChoiceQuestionTemplate(appendToElem)
{
	
	myQuestion = document.createElement("textarea");
	myQuestion.className = "QuestonDiv";
	myQuestion.placeholder = "Add question to ask...";
	myQuestion.cols = "150";
	myQuestion.rows = "2";
	ansAdder = document.createTextNode("Add answer choices : ");
  
	var ansAdderBtn = document.createElement("div");
	ansAdderBtn = document.createElement("button");
	ansAdderBtn.innerHTML = "+";
	ansAdderBtn.onclick = (function () {
		var myAnsChoice = document.createElement("input");
		myAnsChoice.type = "text";
		myAnsChoice.className = "AnsChoice";
		myAnsChoice.placeholder = "Add answer choice...";
		myAnsChoice.style.width = "70%";	
		var ansBr = document.createElement("br");
		appendToElem.appendChild(myAnsChoice);			

		var ansType = document.createElement("select");
		ansType.onchange = (function () {
			if (ansType.options[ansType.selectedIndex].value == "Right")
			{
				myAnsChoice.style.background = "green";				
			}
			else
			{
				myAnsChoice.style.background = "#FFFFCC";				
			}
			
		});

		var incorrectOption = document.createElement("option");	
		incorrectOption.value = "Wrong";
		incorrectOption.text = "Wrong";
		incorrectOption.selected = "true";
		var correctOption = document.createElement("option");
		correctOption.value = "Right";
		correctOption.text = "Right";
		ansType.add(correctOption);	
		ansType.add(incorrectOption);

		var ansRmvBtn = document.createElement("button");
		ansRmvBtn.innerHTML = "-";		
		ansRmvBtn.onclick = (function () {
			myAnsChoice.remove();
			ansBr.remove();
			ansRmvBtn.remove(); 
			ansType.remove(); 			
		});
	
		appendToElem.appendChild(ansRmvBtn);
		appendToElem.appendChild(ansType);
		appendToElem.appendChild(ansBr);
					
	});

	showAnsBtn = document.createElement("button");
	showAnsBtn.innerHTML = "show Answer";
	appendToElem.appendChild(document.createElement("br"));
	appendToElem.appendChild(myQuestion);
	appendToElem.appendChild(document.createElement("br"));
	appendToElem.appendChild(ansAdder);
	appendToElem.appendChild(ansAdderBtn);
	appendToElem.appendChild(document.createElement("br"));
	
	
	//appendToElem.appendChild(showAnsBtn);

	//alert("HTML is: " + $('#'+appendToElem.id).get(0).outerHTML);	
}

function addQuestionGenerator(toolHolder)
{
	questionType = ["Multiple choice question", "Multiple questions"];

	var questionDiv = document.createElement("div");
	questionDiv.id = "questionDiv";	

	var questionTypeSelect = document.createElement("select"); 
	questionTypeSelect.onchange = (function () {
		var selectedQuestionType = questionTypeSelect.options[questionTypeSelect.selectedIndex].value;	
			
		questionDiv.innerHTML = "";

		if (selectedQuestionType == "---Select Question Type---" || selectedQuestionType == "")
		{
			
		}
		else if (selectedQuestionType == "Multiple choice question")
		{
			addMultipleChoiceQuestionTemplate(questionDiv);	
		}
		else if (selectedQuestionType == "Multiple questions")
		{

		}		
	});	

	
	var defaultOption = document.createElement("option");
	defaultOption.text = "---Select Question Type---";		
	defaultOption.value = "---Select Question Type---";		
	questionTypeSelect.add(defaultOption);	
	
	for (var index=0; index < questionType.length; index++) 
	{
		var myToolOption = document.createElement("option");				
		myToolOption.text = questionType[index];
		myToolOption.value = questionType[index]	
		questionTypeSelect.add(myToolOption);	
	}

	toolHolder.appendChild(questionTypeSelect);
	toolHolder.appendChild(document.createElement("br"));
        toolHolder.appendChild(questionDiv);
}



