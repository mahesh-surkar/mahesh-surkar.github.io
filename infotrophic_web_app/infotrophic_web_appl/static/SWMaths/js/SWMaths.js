//\sqrt 3, \nthroot 3, \int, \pi, \R, 



//showAllInput = "none";
//showAllInput = "";
var mathKeyboard = "";
var AttachedMathEditorToMathKeyBoard = "";
showAllInput = "none";
//showAllInput = "";

//constants
var C_UNKNOWN=0;
var C_INTEGRATION=1;
var C_DERIVATIVE=2;

var sinCosMathSymbol = ['sin():\\sin \\left(\\right)', 'cos():\\cos \\left(\\right)', 'tan():\\tan \\left(\\right)',
                        'sec():\\sec \\left(\\right)', 'cosec():\\csc \\left(\\right)', 'cot():\\cot \\left(\\right)'
                       ];


 function includeJsCss(filename, filetype)
 {
	 if (filetype == "js")
	 { //if filename is a external JavaScript file                  
		 var fileref = document.createElement('script');
		 fileref.type = "text/javascript";
		 fileref.src = filename;   
		 fileref.defer = "defer";                 
	 }
	 else if (filetype == "css") 
	 { //if filename is an external CSS file
		 var fileref = document.createElement("link");
		 fileref.setAttribute("rel", "stylesheet");
		 fileref.setAttribute("type", "text/css");
		 fileref.setAttribute("href", filename);
		 fileref.defer = "defer"; 
	 }

	 if (typeof fileref != "undefined")
		 document.getElementsByTagName("head")[0].appendChild(fileref);

	 JSLoadWait();
 }

 function JSLoadWait() 
 {
	 if (typeof $.cookie == 'undefined' || // set in jquery.cookie-min.js
			 typeof getLastViewedAnchor == 'undefined' || // set in application-min.js
			 typeof getLastViewedArchive == 'undefined' || // set in application-min.js 
			 typeof getAntiSpamValue == 'undefined') // set in application-min.js
	 { 
		 window.setTimeout(JSLoadWait, 100); 
	 }        
 }

includeJsCss("static/jquery/css/jquery-ui.css", "css"); 
includeJsCss("http://code.jquery.com/jquery-1.11.1.min.js", "js"); 
includeJsCss("static/jquery/js/jquery-ui.min.js", "js"); 

includeJsCss("static/mathquill-0.9.4/mathquill.css", "css");
includeJsCss("static/mathquill-0.9.4/mathquill.min.js", "js"); 

includeJsCss("http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML", "js"); 
includeJsCss("http://aleph.sagemath.org/embedded_sagecell.js", "js"); 

//includeJsCss("https://sagecell.sagemath.org/static/embedded_sagecell.js", "js"); 

 
var mathEditableId = 0;
var mathEditableArray = [];

function loadSWMaths(branch)
{
	//alert("loading :" + branch);
	if (branch == "linearEquation")
	{
		var mathManipulationCallback = loadLinearEqMathEditor();
		outFormat = "text";  //or can be latex
		var multipleEqn = true;
		var singleEqn = false
		loadVisualMathEditor("mathEditorDiv", multipleEqn, outFormat, mathManipulationCallback);		
	}
	else if (branch == "calculus")
	{
		var mathManipulationCallback = loadCalculusMathEditor();
		outFormat = "text";  //or can be latex
		loadVisualMathEditor("calculusEditorDiv", singleEqn, outFormat, mathManipulationCallback);		
	}
	else
	{
		alert("Not implemented :" + branch);
	}
	
}

function getMathKeyboard()
{
	if (mathKeyboard != "")
	{
		return mathKeyboard;
	}
	
	
	mathKeyboard = document.createElement("div");
    mathKeyboard.appendChild(getCalculusKeyboard());	
    mathKeyboard.appendChild(getSinCosKeyboard());	
	mathKeyboard.appendChild(document.createElement("br"));
	mathKeyboard.appendChild(document.createElement("br"));
	return mathKeyboard;
}

function getSinCosKeyboard()
{
	var sinCosKeyboard = document.createElement("div");
	sinCosKeyboard.className = "SWMathKeyboard";
	
	for (index=0; index < sinCosMathSymbol.length; index++)
	{
		var symAndVal = sinCosMathSymbol[index].split(':');
		
		var mathSym = document.createElement("button");
		mathSym.id = symAndVal[0];	
		mathSym.className =  "mathquill-embedded-latex SWMathKeyboardBtn";	
		mathSym.innerHTML = symAndVal[0];
		mathSym.onclick = (function (val) {
		     	return function (e) 
		     	{ 
		     		AttachedMathEditorToMathKeyBoard.mathquill('write', val);
		     	}
			})(symAndVal[1]);

		sinCosKeyboard.appendChild(mathSym);
	}
	
	return sinCosKeyboard;
}

function getCalculusKeyboard()
{	
	var calculusKeyboard = document.createElement("div");
	//mathKeyboard = document.createElement("div");
	calculusKeyboard.className = "SWMathKeyboard";
	
	var integrtion = document.createElement("button");
	integrtion.id = "integrtion";	
	integrtion.className = "mathquill-embedded-latex SWMathKeyboardBtn";	
	integrtion.innerHTML ="\\int";
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub, integrtion ]);
	
	integrtion.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('write','\\int'); });	
	
	var definateIntegrtion = document.createElement("button");
	definateIntegrtion.id = "definateIntegrtion";	
	definateIntegrtion.className =  "mathquill-embedded-latex SWMathKeyboardBtn";	
	definateIntegrtion.innerHTML ="\\int _{n}^{m}";
	definateIntegrtion.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('write','\\int ^{ }_{ }'); });	
	
	var derivative = document.createElement("button");
	derivative.id = "derivative";			
	derivative.className = "SWMathKeyboardBtn";	
	derivative.innerHTML ="$$\\frac{\\partial}{\\partial x}$$";
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub, derivative ]);	
	derivative.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('write','\\frac{\\partial }{\\partial x}'); });	
	
	var orderdDivative = document.createElement("button");
	orderdDivative.id = "orderdDivative";	
	orderdDivative.className = "SWMathKeyboardBtn";	
	orderdDivative.innerHTML ="$$\\frac{\\partial ^n}{\\partial x^n}$$";
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub, orderdDivative ]);
	orderdDivative.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('write','\\frac{\\partial ^{ }}{\\partial x^{ }}'); });	
	
	var mySquare = document.createElement("button");
	mySquare.id = "mySquare";	
	mySquare.className = "mathquill-embedded-latex SWMathKeyboardBtn";	
	mySquare.innerHTML = "x^2";
	//MathJax.Hub.Queue([ "Typeset", MathJax.Hub, mySquare ]);
	mySquare.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('write','^2'); });	
	
	var nthPower = document.createElement("button");
	nthPower.id = "nthPower";	
	nthPower.className = "mathquill-embedded-latex SWMathKeyboardBtn";	
	nthPower.innerHTML = "x^n";
	//MathJax.Hub.Queue([ "Typeset", MathJax.Hub, nthPower ]);
	nthPower.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('cmd','^'); });	
	
	
	var squareRoot = document.createElement("button");
	squareRoot.id = "squareRoot";	
	squareRoot.className = "SWMathKeyboardBtn";	
	squareRoot.innerHTML = "$$\\sqrt{x}$$";
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub, squareRoot ]);
	squareRoot.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('cmd','\\sqrt'); });	
	
	
	var nthRoot = document.createElement("button");
	nthRoot.id = "nthRoot";		
	nthRoot.className = "SWMathKeyboardBtn";	
	nthRoot.innerHTML ="$$\\sqrt[n]{x}$$";
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub, nthRoot ]);
	nthRoot.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('cmd','\\nthroot'); });	
	
	var infinity = document.createElement("button");
	infinity.id = "infinity";	
	infinity.className = "mathquill-embedded-latex SWMathKeyboardBtn";	
	infinity.innerHTML = "\\infty";
	infinity.onclick = (function () { AttachedMathEditorToMathKeyBoard.mathquill('cmd','\\infty'); });	
	
	calculusKeyboard.appendChild(integrtion);
	calculusKeyboard.appendChild(definateIntegrtion);
	calculusKeyboard.appendChild(derivative);
	calculusKeyboard.appendChild(orderdDivative);	
	calculusKeyboard.appendChild(mySquare);
	calculusKeyboard.appendChild(nthPower);
	calculusKeyboard.appendChild(squareRoot);
	calculusKeyboard.appendChild(nthRoot);
	calculusKeyboard.appendChild(infinity);
	
	//calculusKeyboard.style.display = "none"; 
	return calculusKeyboard;
}

function attachDattachMathKeyBord(mathEditor, attachOrDettach)
{
	
	mkeyboard = getMathKeyboard();
	
	if (attachOrDettach == "ATTACH") 
	{
		AttachedMathEditorToMathKeyBoard = mathEditor;
		mkeyboard.style.display = ""; 
	}
	else
	{
		//AttachedMathEditorToMathKeyBoard = "";
		//mkeyboard.style.display = "none"; 
	}
	
}

function addMathLine(attachToElem)
{
	var myId = "math-editor" + mathEditableId;
	
	var editmath = document.createElement("div");	
	editmath.id = myId;//"editable-math";
	editmath.innerHTML= "";
	editmath.className="SWmathInputDiv";
	
	
	
	var obj=document.getElementById(attachToElem);
	obj.appendChild(editmath);
	
	$("#" + myId).focusin(function(){
		attachDattachMathKeyBord($("#" + myId), "ATTACH");
	});
	
	$("#" + myId).focusout(function(){
		attachDattachMathKeyBord($("#" + myId), "DETTACH");
	});
	
	try
	{
		
	   $("#" + myId).appendTo(obj).mathquill('editable');	
	   obj.appendChild(document.createElement("br"));	   
	   mathEditableArray[mathEditableId]=myId;
	   mathEditableId++;  
	}
	catch (evt)
	{
		console.log("not loaded, add later." + evt);
	}
	
	
}

function solveEquation(i_outFormat, i_mathManipulationCallback) 
{        
        var sageCellCmdLine = document.getElementsByClassName("sagecell_commands");
        //alert (sageCellCmdLine);   

        if (!sageCellCmdLine[0])
        {
        	alert("Page is not loaded completely. \nPlease check you netowk connectivity.");
        	return false;
        } 	

        var output = document.getElementById("equationOutput");
        if (output)
        { output.innerHTML =""; }
        
        var eqnList = "";

        // alert("len:" + mathEditableArray.length);
        for (var i = 0; i < mathEditableArray.length;  i++){

        	var latexMath = $("#" + mathEditableArray[i]);
        	//var SWlatex = latexMath.mathquill('latex');
        	//var newtext = latexMath.val();
        	//alert("newText: " + newtext );
        	var SWlatex = latexMath.mathquill(i_outFormat);
        	//alert("mathEditableArray[i]: " + SWlatex );
        	myEqns = SWlatex.replace(/\\cdot/g, '*');	//for multiplication
        	myEqns = SWlatex.replace(/cdot/g, '*');	//for multiplication
        	//alert("myEqns: " + myEqns );
        	eqnList += myEqns + "\n";		
        }

        //Let page author make changes in syntax of maths provided user and get it it back to process 
        var sageCommandsToExec = eqnList;

        if (i_mathManipulationCallback) 
        {
        	sageCommandsToExec = i_mathManipulationCallback(eqnList);
        }

        //alert ("Command To execute : "+ sageCommandsToExec );
        if (typeof sageCommandsToExec !== undefined && sageCommandsToExec !== "")
        {
           // alert(sageCellCmdLine[0].value);
        	sageCellCmdLine[0].value = sageCommandsToExec;
        	sageSolveButton = document
        	                .getElementsByClassName("sagecell_evalButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
        	sageSolveButton[0].click();
        	
        }

        return;
}      

function loadVisualMathEditor(i_mathEditorId, addMultipleEqns, i_outFormat, i_mathManipulationCallback)
{	
	var myMathInputId = i_mathEditorId + "_SWmathsInput";

	var mathEditorDiv = document.createElement("div");
	mathEditorDiv.id = i_mathEditorId;
	document.body.appendChild(mathEditorDiv);	

	var myMathInputDiv = document.createElement("div");

	var eqnText = document.createTextNode("Enter equations to solve, one equation in a line:");
	mathEditorDiv.appendChild(eqnText);
	mathEditorDiv.appendChild(document.createElement("br"));
	
	var myMathInputDiv = document.createElement("div");
	myMathInputDiv.id = myMathInputId;	
	mathEditorDiv.appendChild(myMathInputDiv);
	
	var addMathLineBtn = document.createElement("button");
	addMathLineBtn.id = i_mathEditorId + "button";
	addMathLineBtn.className = "btn";
	addMathLineBtn.innerHTML="+";
	addMathLineBtn.onclick =(function (){ addMathLine(myMathInputId); });
	
	if (!addMultipleEqns)
	{
		addMathLineBtn.style.display = "none";
		eqnText.val = "Enter equation to solve:";
	}

	mathEditorDiv.appendChild(addMathLineBtn);
	mathEditorDiv.appendChild(document.createElement("p"));	

	addMathLine(myMathInputId);

	myMathKeyboard = getMathKeyboard();
	mathEditorDiv.appendChild(myMathKeyboard);
	mathEditorDiv.appendChild(document.createElement("br"));
	
    var mathSolve = document.createElement("button");
	mathSolve.id = "mathSolve";	
	mathSolve.className = "btn";	
	mathSolve.innerHTML ="Solve";
	mathSolve.onclick = (function () {  solveEquation(i_outFormat, i_mathManipulationCallback); });	
	mathEditorDiv.appendChild(mathSolve);
	
	var mathOutput = document.createElement("div");
	mathOutput.id = "equationOutput";
    mathOutput.className="infoLabel";
    
    var outputLabel = document.createElement("H4");
    outputLabel.id = "mathOutputLabel";
    outputLabel.innerHTML = "OUTPUT:";
    outputLabel.className="infoLabel";
    outputLabel.style.display = "none";
    mathEditorDiv.appendChild(outputLabel);
    mathEditorDiv.appendChild(mathOutput);

    loadSageCell(mathEditorDiv); 

}


function waitForSageResult()
{	//alert("output " + $.active);
	var latex = document.getElementById("equationOutput");
	latex.className = "infoLabel";
	document.getElementById("mathOutputLabel").style.display="";
	
	if (latex.innerHTML == "Solving, Please wait...")
	{
		latex.innerHTML = "Solving, Please wait.......";
	}
	else
	{
		latex.innerHTML = "Solving, Please wait..."
	}

	var sageOutputDisplay = document.getElementsByClassName("sagecell_output_elements");
	//alert(":"+sageOutputDisplay[0].innerHTML);
	sageOutputDisplay[0].style.display=showAllInput;
	
	while(($.active) > 0)
	{
		//alert("Ajax still active!");
	   setTimeout(waitForSageResult, 500);
	   return;
	}
	

	var mathOutputObj = document.getElementsByClassName("sagecell_stdout");	
	if (typeof mathOutputObj === 'undefined' || mathOutputObj.length === 0)
	{
		mathOutputObj = document.getElementsByClassName("sagecell_pyout");	
		//alert("id1:" + mathOutputObj);	
	}
	//alert("id:" + mathOutputObj);	
	var val="";	
	
	
	for (var i = 0; i < mathOutputObj.length; i++) 
	{
		val += mathOutputObj[i].innerHTML;		
	}
	
	if(!val)		
	{		
		var sageOutputDisplay = document.getElementsByClassName("sagecell_pyerr");
		if (sageOutputDisplay[0])
		{
			
		    //alert(":"+sageOutputDisplay[0].innerHTML);
			//latex.appendChild(sageOutputDisplay[0]);
			latex.innerHTML = "Error:";
			latex.className = "warnLabel";
			latex.appendChild(sageOutputDisplay[0]);
			return;
		}
		else
		{
			setTimeout(waitForSageResult, 500);
			return;
		}		
	}

	
	//alert("output " + val);

	try
	{
		latex.innerHTML = "$$" + val + "$$";
		MathJax.Hub.Queue([ "Typeset", MathJax.Hub, latex ]);		
		
	} 
	catch (err) 
	{
		alert("error:" + err);
	}
}

function sageSovleSent() 
{
	var sageOutputDisplay = document.getElementsByClassName("sagecell_output_elements");
	//alert(":"+sageOutputDisplay[0].innerHTML);
	sageOutputDisplay[0].style.display=showAllInput;
	
	setTimeout(waitForSageResult, 50);
}

function sageCellOnLoad()
{
	//alert("sageSave loaded");

	sageInput = document.getElementsByClassName("sagecell_commands");
	sageInput[0].style.display = showAllInput;

	buttonObj = document.getElementsByClassName("sagecell_evalButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
	buttonObj[0].style.display = showAllInput;
	buttonObj[0].onclick = function(evt) 
	
	{			
		sageSovleSent();
	};

	buttonObj[0].onkeyup = function(evt) 
	{			
		sageSovleSent();
	};	
}

function loadSageCell(i_appaendOnDiv)
{
	var sageDiv = document.createElement("div");
	sageDiv.className = "compute";
	sageDiv.id = "sageDiv";
	
	i_appaendOnDiv.appendChild(sageDiv);

	try 
	{
		// Make *any* div with class 'compute' a Sage cell
		sagecell.makeSagecell({
			inputLocation : 'div.compute',
			evalButtonText : 'Solve',
			languages : [ "sage" ],
			hide : [ "permalink" ],
			editor : "textarea",
			callback : sageCellOnLoad
		});	
	}
	catch(evt)
	{
		alert("Please check your network connectivity.");
	}        
}

function getEqnVariableList(i_eqn)
{
	var myVar = i_eqn.trim().match(/[a-z]/ig);
	//alert(myVar);
	return myVar;
}

function findEquationType(eqn)
{
	if(eqn.lastIndexOf("int ", 0) === 0)  //integration
	{ 	
		//alert("intigration "+ eqn);
		var myLowerLimit = "";
		var myUpperLimit = "";
		
		if(eqn.lastIndexOf("int _", 0) === 0|| eqn.lastIndexOf("int **", 0) === 0)
		{
			//alert("eqn with definate limit");
			eqn = eqn.substring(4).trim();
			
			var definateCheckFailed = 2;
			for (var index=0;index<2; index++)
			{
				if (eqn.lastIndexOf("**", 0) === 0 )
				{					
					myUpperLimit = eqn.replace(/^\**/,"").match(/^infty/);
					
					if (!myUpperLimit)
					{
						myUpperLimit = eqn.replace(/^\**/,"").match(/\d+/);
						myUpperLimit = parseInt(myUpperLimit[0], 10);
						//alert(":upperLimit: " + myUpperLimit);						
					}
					eqn = eqn.replace(/^\**/,"").replace(myUpperLimit,"").replace(/^\(\)/,"");			
					definateCheckFailed--;
				}
				
				//alert(":eqn: " + eqn);
				eqn = eqn.trim();
				if (eqn.lastIndexOf("_", 0) === 0)
				{
					
					if (eqn.lastIndexOf("_(", 0) !== 0)
					{
						myLowerLimit = eqn.replace(/^\_/,"").match(/\d/);
					}
					else
					{
						myLowerLimit = eqn.replace(/^\_/,"").match(/\d+/);	
					}
					//myLowerLimit = eqn.replace(/^\_/,"").match(/\d+/);				
					myLowerLimit = parseInt(myLowerLimit[0], 10);
					//alert(":myLowerLimit: " + myLowerLimit);
					eqn = eqn.replace(/^\_/,"").replace(myLowerLimit,"").replace(/^\(\)/,"");
					definateCheckFailed--;
				}	
				
			}
			
			
			if (definateCheckFailed > 0)
			{
			    alert("Integration equation invalid: " + eqn);
				return [C_UNKNOWN, eqn, "", "", "", "" ];
			}
			
			eqn = eqn.replace(/^\*/,"");
			//alert(":eqn: " + eqn);
		}
		else
		{
			//alert("indefinated limit intigration "+ eqn);
			eqn = eqn.substring(3).trim().replace(/^\*/,"");
		}
		
		//alert(":eqn: " + eqn);
		//dx,dt like 	
		var expectedEnd = "d*"+ eqn.substring(eqn.length-1).trim();
		//alert("expt integration end : "+ eqn.substring(eqn.length-1));
	        var myEnq ="";
	        var myWTR ="";
		//alert ("Equation type last :" + eqn.substring(eqn.length-2)+":" + expectedEnd +":");
		if (eqn.substring(eqn.length-3) == expectedEnd)
		{
			myEnq = eqn.slice(0, -4);
			myWTR = eqn.substring(eqn.length-1).trim();		
		}
		else
		{
			myEnq = eqn;
			myWTR = eqn.match(/[a-z]/i)[0];
			//"45 Church St".match(/[a-z]/i)[0]; // output "C"			
		}
		
		var eqnVar = getEqnVariableList(myEnq);
		return [C_INTEGRATION, myEnq, eqnVar, myWTR, myLowerLimit, myUpperLimit];
	}
	else if(eqn.lastIndexOf("((partial ", 0) === 0) //derivative
	{ 	
		//alert("Derivative eqn:" + eqn);
		var derEqn = eqn.substring(9).trim();
		
		var derOrder;
		if (derEqn.lastIndexOf("**", 0) === 0)
		{ derOrder = derEqn.replace(/^\*\*/,""); }
		
		//alert(derOrder);
		if (derOrder && derOrder.lastIndexOf("(", 0) !== 0)
		{	
			derOrder = derOrder.match(/^\d/);
		}
		else if (derOrder)
		{
			derOrder = derOrder.replace(/^\(/,"");
			derOrder = derOrder.match(/^\d+/);
		}
		//alert("derOrder:" + derOrder);
		
		if (derOrder)
		{
			derOrder = parseInt(derOrder[0], 10);
			//alert("derOrder:" + derOrder);
			derEqn = derEqn.replace(/^\**/,"").replace(derOrder,"").replace(/^\(\)/,"");	
			//alert("Derivative eqn:" + derEqn);
		}
		else 
		{ 
			derOrder = 1; 
		}
		
		var dervRespTo = derEqn.match(/\(partial*.*/)[0].replace(/\(partial/, "");
		dervRespTo = dervRespTo.trim().replace(/^\*/,"").replace(/\)\)/,"").replace(/\*+.*/,"");
		                      //           .replace(/\)\/\(partial/, "");
		derEqn = derEqn.replace(/^\*/,"").replace(/\)\/\(partial*.*/,"");
		
		//var eqnVar = eqn.replace(/partial/g,"");
		var eqnVar = getEqnVariableList(eqn.replace(/partial/g,""));
		
	    //var myWRT = derEqn.match(/[a-z]/i)[0]
		
		//alert("Derivative eqn: " + derEqn + "derv order " + derOrder +  " variables " + eqnVar + " WRT: "
			//	                                             + dervRespTo);
		//return [C_UNKNOWN, eqn, "", "", "", "" ];
		
		
		return [C_DERIVATIVE, derEqn, eqnVar, dervRespTo, derOrder, ""]; //oder of derivative
	}
	else
	{
		alert ("Equation type unknown :" + eqn);
		return [C_UNKNOWN, eqn, "", "", "", "" ];
	}

	
}

function manipulateLinearMaths(eqnList) 
{
	var mathEqn = document.getElementById("equestions");
	mathEqn.innerHTML = "";
	mathEqn.innerHTML = eqnList;

	var myEqns = ""
	//alert ("Solving Equation	");
	var lines = document.getElementById("equestions").value.split('\n');
	for ( var i = 0; i < lines.length; i++)
        {
		lines[i].trim();
		if (!lines[i].trim()) 
                { continue; }

		if (myEqns[i])
                { myEqns += ","	}

		myEqns += lines[i].replace("=", "==");
		//myEqns += lines[i];
	}

	if (!myEqns) 
	{
		alert("Please provide equations.");
		return "";
	}

	var myEqns1 = "eqn = [" + myEqns + "]"

	var variables = getEqnVariableList(myEqns);
	//var myVariables = "(\'" + variables +  "\')";
	
	var sageMathToExec = 'var (\'' + variables + '\')' + "\n";
	sageMathToExec += myEqns1 + "\n";
	sageMathToExec += 's = solve(eqn, ' + variables + ')\;' + "\n";
	sageMathToExec += 'print latex(s)';
	return sageMathToExec;
}

function addAskForVarialbles(i_nodeToAppend, i_myId)
{
	var varText = document.createTextNode("Enter variables in the equation, comma separated:");
	i_nodeToAppend.appendChild(varText);
	i_nodeToAppend.appendChild(document.createElement("br"));
	
	var variables = document.createElement("input");	
	variables.type ="text";
	variables.id = i_myId;
	i_nodeToAppend.appendChild(variables);
	i_nodeToAppend.appendChild(document.createElement("br"));
	i_nodeToAppend.appendChild(document.createElement("br"));
}

function loadLinearEqMathEditor()
{
	var mathEditor = document.createElement("div");	
	mathEditor.id = "mathEditor";
       	
	var equationSolver = document.createElement("div");
	equationSolver.id = "equationSolver";
		
	var equestions = document.createElement("textarea");
	equestions.id = "equestions";	
	equestions.rows="6";
	equestions.cols="60";
        
	equationSolver.appendChild(equestions);

    equestions.style.display = showAllInput; //hide on page
	//equationSolver.appendChild(document.createElement("br"));
	//equationSolver.appendChild(document.createElement("br"));
	//addAskForVarialbles(equationSolver, "variables");

    mathEditor.appendChild(equationSolver);
	document.body.appendChild(mathEditor);	
	
	return manipulateLinearMaths; //For callback
}  

function manipulateCalculus(eqn)
{	
	if (!myEqns) 
	{
		alert("Please provide itegaration or derivaive to solve.");
		return "";
	}
	
	//alert("myEqns : " + eqn);
	var retutnArray =  new Array(); 
	retutnArray = findEquationType(eqn);
	
	var eqnType = retutnArray[0];
	var myEqn = retutnArray[1];
	var myEqnVar = retutnArray[2] == "" ? "x" : retutnArray[2];
	var myEqnWRT = retutnArray[3] == "" ? "x" : retutnArray[3]; //"with respect to"
	var lowerDefinate = retutnArray[4];
	var upperDefinate = retutnArray[5];
	
	var mathEqn = document.getElementById("calculusEqn");
	mathEqn.innerHTML = "";
	mathEqn.innerHTML = myEqn;
	
	////return "";
	if (eqnType == C_INTEGRATION)
	{
		eqnList = 'var (\'' + myEqnVar + '\')' + '\n';
		eqnList += 'f = ' + myEqn + '\n';
		
		if (typeof lowerDefinate == undefined || typeof upperDefinate == undefined || lowerDefinate == "", upperDefinate == "")
		{		
			eqnList += 's = integral(f,' + myEqnWRT + ');' + '\n';
		}
		else
		{
			if (upperDefinate == "infty") { upperDefinate = "infinity"; }
			eqnList += 's = integral(f,' + myEqnWRT + ', ' + lowerDefinate +', ' + upperDefinate + ');' + '\n';			
		}
		
		//eqnList += 'var (' + myEqnVar + ')';
		//eqnList += 's = integrate( ' + myEqn + ', ' + myEqnVar + ', 1, infinity)';
		//eqnList += 's = p.integral();' + " \n";
	}
	else if (eqnType == C_DERIVATIVE)
	{  
		/*eqnList = 'R = PolynomialRing(QQ,"' + myEqnVar + '")' +" \n";
		eqnList += myEqnVar + ' = R.gen()' + " \n";
		eqnList += 'p = ' + myEqn + " \n";		
		eqnList += 's = p.derivative();' + " \n";*/
		eqnList = 'var (\'' + myEqnVar + '\')' + '\n';
		eqnList += 'f = ' + myEqn + '\n';
		
		eqnList += 's = diff(f,' + myEqnWRT + ', ' + lowerDefinate + ');' + '\n';	 //lowerDefinate is deriavative order
		
	}
	else 
	{
		alert("Please provide itegaration or derivaive equation to solve.");
		return "";
	}

    eqnList += 'latex(s)';	
    
    
    //return;
    return eqnList;
}

function loadCalculusMathEditor()
{
	var mathEditor = document.createElement("div");	
	mathEditor.id = "CalculusMathEditor";
	document.body.appendChild(mathEditor);	
	
	var calculusMathEditor = document.createElement("div");
	calculusMathEditor.id = "calculusMathEditor";
		
	var calculusEqn = document.createElement("textarea");
	calculusEqn.id = "calculusEqn";	
	calculusEqn.rows="6";
	calculusEqn.cols="60";
        
	calculusEqn.appendChild(document.createElement("br"));
	calculusEqn.appendChild(document.createElement("br"));

	mathEditor.appendChild(calculusEqn);
	
	calculusEqn.style.display = showAllInput; //hide on page
	
	
	return manipulateCalculus; //For callback
}
