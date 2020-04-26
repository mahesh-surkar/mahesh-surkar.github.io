function loadInteractiveSimpleMath()
{
	var toolHolder  = document.createElement("div");
	toolHolder.id = "toolHolder";
	document.body.appendChild(toolHolder);	
	var templateGenrator = addTemplateGenerator(toolHolder);		
}

//API for Tool framework
function getReqJsForTool()
{
	var host = window.location.host;
	var myJS = "http://" + host + "/static/SWMaths/js/InteractiveSimpleMath.js";
	return myJS;
	
}

//API for Tool framework
function SWToolCodeGenerator()
{	
	
	var HTMLcodeWthKeepUniqueString = generateTemplate();
	//alert("MS:" + HTMLcodeWthKeepUniqueString[0] + ": "+ HTMLcodeWthKeepUniqueString[1]);
	return HTMLcodeWthKeepUniqueString;
}

function getCotainerElemments()
{

	var template = document.createElement("div");
	template.contentEditable = "true";
	template.className = "templateProblem";	
	
	
	var templateWordProblem = document.createElement("div");
	templateWordProblem.appendChild(document.createElement("br"));

	templateWordProblem.appendChild(template);	
	
	var btn = document.createElement("button");
	btn.innerHTML = "Validate";
	btn.onclick = function () {		
		  var templateData = template.innerHTML;
		  var equation = document.getElementById("templateEquation").innerHTML;
		  var equationRangeVal = document.getElementById("templateEqnVarMaxVal").innerHTML;
		  var varSet = document.getElementById("templateVarSet").innerHTML;
		  
		  if (validateTemplate(templateData, equation, equationRangeVal, varSet) == true)
		  {
			  createAlert("SUCCESS", "INFO");
			  return true;
		  }
		  return false;
	};
	
	templateWordProblem.appendChild(btn);	
	return templateWordProblem;
}

function removeUnwantedTags(code)
{
	//alert("code : "+code);
	if (typeof code === undefined || !code || code === "") { return ""; }
	
	code = code.replace(/<br>/gi, "").replace(/&nbsp;/gi, "").replace(/&amp;/gi, "").replace(/&gt;/gi, "").replace(/&lt;/gi, "").replace(/&quot;/gi,"");	
	code = code.replace(/<div>/gi, "").replace(/<\/div>/gi, "").replace(/<span>/gi, "").replace(/<\/span>/gi, "");
	code = code.replace(/<table>/gi, "").replace(/<\/table>/gi, "").replace(/<tr>/gi, "").replace(/<\/tr>/gi, "");
    return code.trim();
}

function addTemplateGenerator(tmplateHolder)
{
	var templateGenerator = document.createElement("div");	
	tmplateHolder.className = "overlay";
	tmplateHolder.appendChild(templateGenerator);
	
	templateEquation = document.createElement("div");
	templateEquation.id = "templateEquation";
	templateEquation.contentEditable = "true";
	templateEquation.className = "templateEquation";
	
	templateEqnVarMaxVal = document.createElement("div");
	templateEqnVarMaxVal.id = "templateEqnVarMaxVal";
	templateEqnVarMaxVal.contentEditable = "true";
	templateEqnVarMaxVal.className = "templateEqnVarMaxVal";
	
	templateVarSet = document.createElement("div");
	templateVarSet.id = "templateVarSet";
	templateVarSet.contentEditable = "true";
	templateVarSet.className = "templateVarSet";
	
	templateGenerator.appendChild(document.createTextNode("Equation to use: "));	
	templateGenerator.appendChild(templateEquation);	
	templateGenerator.appendChild(document.createElement("br"));
	templateGenerator.appendChild(document.createTextNode("Equation variable value range: "));		
	templateGenerator.appendChild(templateEqnVarMaxVal);
	templateGenerator.appendChild(document.createElement("br"));
	templateGenerator.appendChild(document.createElement("br"));
	templateGenerator.appendChild(document.createTextNode("Variable sets in templates: "));
	templateGenerator.appendChild(templateVarSet);
	templateGenerator.appendChild(document.createElement("br"));
	templateGenerator.appendChild(document.createElement("br"));	
	templateGenerator.appendChild(document.createTextNode("Templates: "));
	templateGenerator.appendChild(document.createElement("br"));
	
	addSWContainer(templateGenerator, getCotainerElemments); //second arg callback function	

	return templateGenerator;	
}

function parseSets(wordProblemTemplateWithSet, varSet)
{

	var wordProblemTemplate = wordProblemTemplateWithSet;
	
	if (!varSet || varSet.length == 0)
	{
		var idx1 = wordProblemTemplate.search(/{\[/g);
		var idx2 = wordProblemTemplate.search(/]}/g);
        if (idx1 >= 0 && idx2 >= 0)
		{
        	var nameSet = wordProblemTemplate.substring(idx1, idx2+2);
			alert("Unresolved variable set: " + nameSet);
			return "";
		}
		
		return wordProblemTemplate;
	}
	
	var vSets = varSet.split(",");
	for(var index=0; index < vSets.length;index++)   
	{
		
		var setNameAndValues = vSets[index].split(":");
		if (!setNameAndValues || setNameAndValues.length == 0 
				|| !setNameAndValues[0] || setNameAndValues[0].length == 0 ||
				                !setNameAndValues[1]|| setNameAndValues[1].length == 0) 
		{
			createAlert("Invalid Verialbe set : " + vSets[index]);
			return "";
		}
		
		var setName = setNameAndValues[0];		
		var setValues = setNameAndValues[1].split("|");
		
		var rendomIndex = (Math.floor(Math.random() * setValues.length));
		var valueToUse =  setValues[rendomIndex];
		var valToReplace = "\{\\["+ setName.trim() + "\]\}";
		var regexToReplace = new RegExp(valToReplace, 'g');
		wordProblemTemplate = wordProblemTemplate.replace(regexToReplace, valueToUse);	
	}
	
	var idx1 = wordProblemTemplate.search(/{\[/g);
	var idx2 = wordProblemTemplate.search(/]}/g);
    if (idx1 >= 0 && idx2 >= 0)
	{
    	var nameSet = wordProblemTemplate.substring(idx1, idx2+2);
		alert("Unresolved variable set: " + nameSet);
		return "";
	}
    
	return wordProblemTemplate;
}


function generateVariablesVals(eqnVarValRanges)
{
	eqnVarValRanges = removeUnwantedTags(eqnVarValRanges); 
	
	var vSets = eqnVarValRanges.split(",");
	var varWithVal = "";
	for(var index=0; index < vSets.length;index++)   
	{
		var varNameAndValRange = vSets[index].split(":");
		if (!varNameAndValRange || varNameAndValRange.length == 0 
				|| !varNameAndValRange[0] || varNameAndValRange[0].length == 0 ||
				                !varNameAndValRange[1]|| varNameAndValRange[1].length == 0) 
		{
			createAlert("Invalid variable value range : " + vSets[index]);
			return "";
		}
		
		var minMaxValue = varNameAndValRange[1].split("|");
		if (!minMaxValue || minMaxValue.length == 0 || !minMaxValue[0] || minMaxValue[0].length == 0
				                    || !minMaxValue[1] || minMaxValue[1].length == 0)
		{
			createAlert("Invalid variable value range : " + vSets[index]);
			return "";
		}
	
		if (isEquation(minMaxValue[0]) == true) { minMaxValue[0] = getEqnValue(minMaxValue[0], varWithVal); } 
		if (isNaN(minMaxValue[0]) == true) {  minMaxValue[0] = getVarValue(minMaxValue[0], varWithVal); }
		
		if (isEquation(minMaxValue[1]) == true) { minMaxValue[1] = getEqnValue(minMaxValue[1], varWithVal); } 		
		if (isNaN(minMaxValue[1]) == true) {  minMaxValue[1] = getVarValue(minMaxValue[1], varWithVal); }
		
		if (minMaxValue[0].length == 0 || isNaN(minMaxValue[0]) == true 
				            || minMaxValue[1].length == 0 || isNaN(minMaxValue[1]) == true)
		{
			createAlert("Min or Max value must be number or already declered variable or equation of these variables: " + vSets[index]);
			return "";
		}
		
		if (parseInt(minMaxValue[0], 10) > parseInt(minMaxValue[1], 10))
		{
			createAlert("In " + vSets[index]  + ", Min value " + minMaxValue[0] 
			                              + " must be less than or equal to max value " + minMaxValue[1]);
			return "";
		}
		
		//rendomNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
		//createAlert("minMaxValue[0] : "+ minMaxValue[0] + ", minMaxValue[1] : " + minMaxValue[1]);
	
		var rendomNumber = Math.floor(Math.random() * (minMaxValue[1] - minMaxValue[0] + 1));
		rendomNumber = eval(rendomNumber + "+" + minMaxValue[0]);
		
		if (varWithVal.length != 0) { varWithVal = varWithVal + ","; }
		varWithVal = varWithVal + varNameAndValRange[0] + ":" +  rendomNumber;
	}
	return varWithVal;
}

function isEquation(eqnOrVar)
{ 
	var idx = eqnOrVar.trim().search(/\+|-|\*|\//g);   
	if (idx < 0) 
	{
		return false;
	}
	
	return true;
}

function getEqnValue(eqn, varWithValues)
{
	eqn = removeUnwantedTags(eqn); 
	var equnVar = extractEquationVariables(eqn);
	var myEqnVariables = equnVar.split(",");
	
	for (var index=0; index < myEqnVariables.length; index++)
	{		
		if (myEqnVariables[index] != "" && myEqnVariables[index].trim() != "")
		{
			var rendomNumber = getVarValue(myEqnVariables[index].trim(), varWithValues)
			eqn = eqn.replace(myEqnVariables[index], rendomNumber);			
		}
	}
	
	var answer = eval(eqn);
	return answer;
}

function getVarValue(variable, extractFrom)
{
	var vSets = extractFrom.split(",");
	for(var index=0; index < vSets.length;index++)   
	{
		var varNameAndVal = vSets[index].trim().split(":");	
		if (varNameAndVal[0].trim() == variable.trim())
		{
			return varNameAndVal[1];
		}
	}
	
	return "";
}

function parseTemplate(wordProblemTemplateWithSet, equation, eqnVarValranges, varSet, generateProblem)
{

	var wordProblemTemplate = parseSets(wordProblemTemplateWithSet, varSet);
	
	if (wordProblemTemplate.length == 0)
	{
		alert("Word problem template Invalid");
		return "FAIL";
	}
	
	var variableInTempate = 0;	
	
	var staticData = [];
	var eqnVariables = [];	
	
	for(var index=0; wordProblemTemplate.length;index++)   
	{
		var idx = wordProblemTemplate.search(/{{/g);

		//alert("wordProblemTemplate idx :" + idx);	
		if (idx < 0) 
		{
			staticData[index] = wordProblemTemplate;          
			eqnVariables[index] = "";
			//alert("static data :" + staticData[index]);		
			break;
		}

		staticData[index] = wordProblemTemplate.substring(0, idx);
		//alert("static data :" + staticData[index]);		
		wordProblemTemplate = wordProblemTemplate.substring(idx, wordProblemTemplate.length);

		idx = wordProblemTemplate.search(/}}/g);

		if (idx < 0) 
		{
			staticData[index] = staticData[index]  + wordProblemTemplate;
			eqnVariables[index] = "";
			//alert("static data :" + staticData[index]);	
			break;
		}

		eqnVariables[index] = wordProblemTemplate.substring(2, idx);    
		variableInTempate++;
		wordProblemTemplate = wordProblemTemplate.substring(idx+2, wordProblemTemplate.length);	

		//alert("static data :" + staticData[index]);	
		//alert("variable data:" + eqnVariables[index]);
	}
	
	//alert(": equation :" +equation);
	equation = removeUnwantedTags(equation); 
	var equnVar = extractEquationVariables(equation);
	var myEqnVariables = equnVar.split(",");
	//alert("Equn variables : " + myEqnVariables);

	
	var varWithValues = generateVariablesVals(eqnVarValranges);	
	if (varWithValues == "")
	{
		return "FAIL";
	}
	
	for (var index=0; index < myEqnVariables.length; index++)
	{
		var number = getVarValue(myEqnVariables[index], varWithValues)
		if (number.length == 0)
		{
			return("Value range is missing for variable : " + myEqnVariables[index] + ":"+ number);	
		}		
	}

	if (variableInTempate <= 1)
	{
		return "Equation template for word problem must have more than one variable. currently : " + variableInTempate;			
	}


	if (myEqnVariables.length != variableInTempate)
	{
		return "Number of variables in equation template must be same as variables in equation.";
	}
	
	var finalWordProblem = "";
	var eqnWithVal = "";
	
	for (var index=0; index < staticData.length; index++)
	{		
		finalWordProblem += staticData[index] + " ";
		if (eqnVariables[index] != "")
		{
			var rendomNumber = getVarValue(eqnVariables[index], varWithValues)
			//alert(equation + ":" +rendomNumber);
			//rendomNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
			//rendomNumber= (Math.floor(Math.random() * eqnVarValranges));
			finalWordProblem += rendomNumber + " ";			
			equation = equation.replace(eqnVariables[index], rendomNumber);			
		}
		
		// staticData = [];
		// eqnVariables = [];			
	}
	
	try
	{
		var answer = eval(equation);
	}
	catch (evt)
	{
		return "Equation Solve failed, In template :" + evt;
	}
	
	if (generateProblem != true)
	{
		return "SUCCESS";
	}
	else
	{
		//alert(answer);
		return [finalWordProblem, answer];
	}
}

function generateWordProblem(wordProblemTemplate, equation, eqnVarValRange, varSet)
{
	return parseTemplate(wordProblemTemplate, equation, eqnVarValRange, varSet, true);
}

function validateTemplate(wordProblemTemplate, equation, equationVarValRange, varSet)
{
	wordProblemTemplate = removeUnwantedTags(wordProblemTemplate);
	equation = removeUnwantedTags(equation);
	equationVarValRange = removeUnwantedTags(equationVarValRange);
	varSet = removeUnwantedTags(varSet);
		
	var variableInTempate = 0;
	if (!equation || equation.trim().length == 0 || equation == "")
	{ 
		createAlert("Please provide equation.");
		return false;
	}
	
	if (!equationVarValRange.length || equationVarValRange == 0)
	{
		createAlert("Please provide equation variable range.");
		return false;
	}
	
	if (!wordProblemTemplate.length)
	{
		createAlert("Please provide equation template for word problem.");
		return false;
	}
	
	var retVal = parseTemplate(wordProblemTemplate, equation, equationVarValRange, varSet, false);	
	if (retVal == "SUCCESS") 
	{		
		return true;	
	}
	else
	{		
		createAlert(retVal);
		return false;	
	}
	
}

function extractEquationVariables(equation)
{
	return equation.trim().replace(/\+|-|\*|\//g, ",").replace(/\s/g, "");       
} 

function checkAnswer(uuid)
{
	var exptAnsDiv = document.getElementsByClassName("templateExptAnswer");		
	var usrAnsDiv = document.getElementsByClassName("templateAnswer");	
	var myExptAns;
	var usrAns;

	for (var index=0; index < exptAnsDiv.length; index++)
	{
		uid = exptAnsDiv[index].id.split("_");
		if (uid[0] == uuid)
		{
			myExptAns = exptAnsDiv[index].value;	
			//alert("Ans: " + myExptAns);
			break;
		}
	}
	
	for (var index=0; index < usrAnsDiv.length; index++)
	{
		uid = usrAnsDiv[index].id.split("_");
		if (uid[0] == uuid)
		{
			usrAns = usrAnsDiv[index].value;		
			break;
		}
	}

	if(usrAns.trim() == "")
	{
		alert("Give your answer.");	
		return;
	}
	
	//alert("is Number: " + usrAns +  ":" +isNaN(usrAns));
	if(isNaN(usrAns.trim()) === false && parseInt(usrAns, 10) == parseInt(myExptAns, 10))
	{
		alert("Your answer is correct!");		
	}
	else
	{
		alert("Your answer is wrong!");		
	}

}

function generateProblem(uuid)
{
		
	var wordProblemDivs = document.getElementsByClassName("problemDiv");
	var wordProblem;
	for (var index=0; index < wordProblemDivs.length; index++)
	{
		uid = wordProblemDivs[index].id.split("_");
		if (uid[0] == uuid)
		{
			wordProblem = wordProblemDivs[index];	
			break;
		}
	}
	
	var equations = document.getElementsByClassName("templateEquation");	
	//alert("generateProblem :" + equations.length);	
	var myEquation = "";

	for (var index=0; index < equations.length; index++)
	{
		uid = equations[index].id.split("_");
		if (uid[0] == uuid)
		{
			myEquation = removeUnwantedTags(equations[index].value);			
		}
	}
	
    var equationVarValRange = document.getElementsByClassName("templateEqnVarMaxVal");	
	
	var myEquationVarValRange = "";

	for (var index=0; index < equationVarValRange.length; index++)
	{
		uid = equationVarValRange[index].id.split("_");
		if (uid[0] == uuid)
		{
			myEquationVarValRange = removeUnwantedTags(equationVarValRange[index].value);			
		}
	}
	
    var varSet = document.getElementsByClassName("templateVarSet");	
	
	var myVarSet= "";

	for (var index=0; index < varSet.length; index++)
	{
		uid = varSet[index].id.split("_");
		if (uid[0] == uuid)
		{
			myVarSet = removeUnwantedTags(varSet[index].value);			
		}
	}
	
    var exptAnsDiv = document.getElementsByClassName("templateExptAnswer");		
	var myExptAns;

	for (var index=0; index < exptAnsDiv.length; index++)
	{
		uid = exptAnsDiv[index].id.split("_");
		if (uid[0] == uuid)
		{
			myExptAns = exptAnsDiv[index];		
			break;
		}
	}
	
	var wordProblemTmpls = document.getElementsByClassName("templateProblem");		
	var templTouse = [];
	
	for (var index=0, useIndex=0; index < wordProblemTmpls.length; index++)
	{
		uid = wordProblemTmpls[index].id.split("_");
		if (uid[0] == uuid)
		{
			templTouse[useIndex] = removeUnwantedTags(wordProblemTmpls[index].value);		
			//alert(";" +templTouse[useIndex]);
			useIndex++;
		}		
	}
	
	rendomIndex = (Math.floor(Math.random() * templTouse.length));	
	var newProblemWithAns = generateWordProblem(templTouse[rendomIndex], myEquation, myEquationVarValRange, myVarSet);
	wordProblem.innerHTML = newProblemWithAns[0];	
	
	myExptAns.value = newProblemWithAns[1];
	//alert(myExptAns.value);
}

function generateTemplate()
{
	var d = new Date();
	var uuid = d.getTime();
	   
	if (validateInput() == false)
	{
	    return "";	
	}
	var HTMLcode = "";
	
	var HTMLProblemDiv = generateHTMLDiv("problemDiv", "Press New Problem button to generate problem.", uuid);	
	var HTMLEquationText = generateHTMLCode("hidden", "templateEquation", uuid);
	var HTMLEquationValRangeText = generateHTMLCode("hidden", "templateEqnVarMaxVal", uuid); 
	var HTMLVarSetText = generateHTMLCode("hidden", "templateVarSet", uuid);
	var HTMLTemplateText = generateHTMLCode("hidden", "templateProblem", uuid);
	var HTMLExptAnswerText = generateNewHTMLCode("hidden", "templateExptAnswer", uuid);
	var HTMLAnswerText = generateNewHTMLCode("text", "templateAnswer", uuid);
	
	
	var funToCall = "checkAnswer(" + uuid +");"
	var checkAnswerBtn = generateHTMLButton("Check Answer", "", funToCall);
	
	funToCall = "generateProblem(" + uuid +");"	
	var generateWordProblemBtn = generateHTMLButton("New Problem",  "", funToCall);
	
	HTMLcode = '<div>' + HTMLProblemDiv + HTMLAnswerText + checkAnswerBtn + generateWordProblemBtn + HTMLEquationText
	                   + HTMLEquationValRangeText + HTMLVarSetText + HTMLTemplateText  + HTMLExptAnswerText + '</div>';	
	return [HTMLcode, uuid];
}


function validateInput()
{
	var equation = document.getElementById("templateEquation").innerHTML;
	var equationValRange = document.getElementById("templateEqnVarMaxVal").innerHTML;
	var varSet = document.getElementById("templateVarSet").innerHTML;
    var textData = document.getElementsByClassName("templateProblem");
	for (var index=0; index < textData.length; index++)
	{
		if (validateTemplate(textData[index].innerHTML, equation, equationValRange, varSet) == false)
		{
			return false;
		}
	}	
	
	return true;
}
