
var fileLoader = function(basePath)
{
	var filesadded=""; //list of files already added dynamically
	var totalFilesAdded=0;
	var filesloaded=0;
	
	this.fileLoaded = function()
	{
		filesloaded++;
	}
	
	this.allFilesLoaded = function()
	{
        //alert("Files loaded : " + filesloaded + ", Files added: " + totalFilesAdded);

		return totalFilesAdded == filesloaded ? true : false;
	}
	
	this.loadfile = function (filename, filetype, useCDN)
	{
		if (typeof basePath === typeof undefined)
		{
			basePath = "";	
		}

		if (typeof useCDN === typeof undefined)
		{
			useCDN = false;	
		}

		var fileref = "";
		if (filetype=="js")
		{ //if filename is a external JavaScript file
			fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
   
			if (useCDN) { fileref.setAttribute("src",  filename); }
			else { fileref.setAttribute("src", basePath + filename); }

		}
		else if (filetype=="css")
		{ //if filename is an external CSS file
			fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			if (useCDN) { fileref.setAttribute("href", filename); }
			else { fileref.setAttribute("href", basePath + filename); }
		}

		if (typeof fileref !==  typeof undefined)
		{
			fileref.async = false; // optionally
			totalFilesAdded++;

			var onFileLoad = function() 
			{
				this.fileLoaded();
			}
			var myOnFileLoad = onFileLoad.bind(this);
			
			fileref.addEventListener('load', myOnFileLoad);		
			
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	}

	this.loadjscssfile = function (filename, filetype, useCDN)
	{
		if (filesadded.indexOf("["+filename+"]")==-1)
		{
			this.loadfile(filename, filetype, useCDN);
			filesadded+="["+filename+"]"; //List of files added in the form "[filename1],[filename2],etc"
		}
		else
		{
			 //  alert("file already added!");
		}
	}

}
var myFileLoader = new fileLoader("static/");

console.log("Loading svgCanvas dependancies");

//from cdn
//myFileLoader.loadjscssfile("//code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" , "css", true);
//myFileLoader.loadjscssfile("//cdn.ckeditor.com/4.5.11/full-all/ckeditor.js", "js", true);
//myFileLoader.loadjscssfile("ckeditor_4_5_8/ckeditor.js", "js");
myFileLoader.loadjscssfile("ckeditor/ckeditor.js", "js");


myFileLoader.loadjscssfile("jquery/css/jquery-ui-timepicker-addon.css" , "css");
myFileLoader.loadjscssfile("jquery/css/jquery-ui.css" , "css");
myFileLoader.loadjscssfile("jquery-custom-scrollbar-0.5.5/jquery.custom-scrollbar.css" , "css");
myFileLoader.loadjscssfile("jquery/js/jquery-1.10.2.js" , "js");

myFileLoader.loadjscssfile("jquery/js/jquery-ui.min.js" , "js");
myFileLoader.loadjscssfile("jquery-custom-scrollbar-0.5.5/jquery.custom-scrollbar.js" , "js");
myFileLoader.loadjscssfile("jaukia-zoomooz/jquery.zoomooz.min.js" , "js");

myFileLoader.loadjscssfile("jquery-resize-keep-ratio/dist/jquery_modified.keep-ratio.js" , "js");
myFileLoader.loadjscssfile("Javascript-Undo-Manager/lib/undomanager.js" , "js");
myFileLoader.loadjscssfile("font-awesome-4.6.3/css/font-awesome.css" , "css");
myFileLoader.loadjscssfile("jQuery-contextMenu/dist/jquery.SWcontextMenu.css" , "css");
myFileLoader.loadjscssfile("jQuery-contextMenu/dist/jquery.contextMenu.min.js" , "js");
myFileLoader.loadjscssfile("jquery-minicolors/jquery.minicolors.js" , "js");
myFileLoader.loadjscssfile("jquery-minicolors/jquery.minicolors.css" , "css");

myFileLoader.loadjscssfile("SWextended/css/SVGBaseEditor.css" , "css");
myFileLoader.loadjscssfile("Snap.svg-0.4.1/dist/snap.svg.js" , "js");
myFileLoader.loadjscssfile("svgPathParser/path-data-polyfill.js" , "js");
myFileLoader.loadjscssfile("simpleWeb/js/SimpleWebConstants.js" , "js");
myFileLoader.loadjscssfile("simpleWeb/css/SimpleWebContent.css" , "css");
myFileLoader.loadjscssfile("SWextended/css/SVGBaseEditor.css" , "css");

myFileLoader.loadjscssfile("SWextended/js/SWCommon.js" , "js");
myFileLoader.loadjscssfile("SWextended/js/SWSVGEdit.js" , "js");
myFileLoader.loadjscssfile("SWextended/js/SWCKEditor.js" , "js");
myFileLoader.loadjscssfile("SWextended/js/SWSVGContextMenu.js" , "js");
myFileLoader.loadjscssfile("SWextended/js/SVGBaseEditor.js" , "js");


//console.log("Loaded all svgCanvas dependancies");

var svgEditor = function()
{

	this.createEditor = function()
	{
		if (myFileLoader.allFilesLoaded())
		{
			console.log("All dependant JS to loaded");		
			loadEditor();
		}
		else
		{
			console.log("Waiting for for dependant JS to load");			
			var myCreateEditor = this.createEditor.bind(this);			
			setTimeout(myCreateEditor, 40);
		}
	}
}

