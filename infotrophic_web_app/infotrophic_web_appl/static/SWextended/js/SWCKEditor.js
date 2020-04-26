var SW_CKEditor = function(attachToElem, onCommandExecCallBack)
{
	var editor = null;	
//	var defaultText = "Click to edit Text";
	var defaultText = "";
	
	//alert("this is called" + this.attachToElem.id );
	var setCKEditorToolbarView = function () 
	{

		CKEDITOR.config.toolbar_Full =
			[
			 { name: 'clipboard', items : [ 'SelectAll','Cut','Copy','Paste','PasteText','PasteFromWord','-','Find','-','Undo','Redo' ] },
			 { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
			 { name: 'Align', items : [ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock', 'BidiLtr','BidiRtl' ] },

			 { name: 'paragraph', items : [ 'NumberedList','BulletedList', '-', 'Link','Unlink','Anchor' ] },
			 { name: 'colors', items : [ 'TextColor','BGColor' ] },

			 //{ name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 
			 //  'HiddenField' ] },
			 //	'/',			

			 //	'/',

			 { name: 'styles', items : [ 'Styles','Format','Font','FontSize'] },

			 //{ name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
			 //	{ name: 'insert', items : [ 'Image', 'HorizontalRule','Smiley','SpecialChar','PageBreak'] },		
			 //	{ name: 'editing', items : ['SpellChecker', 'Scayt' ] },
			 //	{ name: 'document', items : [ 'Source', 'CreateDiv','Textarea'] },
			 ];
		CKEDITOR.config.contenedittsCss  = '/static/simpleWeb/css/SimpleWebContent.css';
		CKEDITOR.config.disableNativeSpellChecker = false;
		CKEDITOR.config.allowedContent = true;
		CKEDITOR.config.toolbar = 'Full';
		CKEDITOR.config.uiColor = '#E6CCCC';  
		CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR; // inserts `<br>`
		//CKEDITOR.config.enterMode = CKEDITOR.ENTER_DIV; // inserts `<div></div>`
		CKEDITOR.config.autoParagraph = false;
		CKEDITOR.config.autoUpdateElement = false;
		CKEDITOR.config.allowedContent = true;
		CKEDITOR.config.title = false;
		CKEDITOR.dtd.$removeEmpty.div = 0;
		CKEDITOR.config.disableNativeSpellChecker = true;

	}

	this.attachCKEditor = function (toolbarHolder) 
	{
		editor = this.getAttachedCKEditor();
		if (editor != null)
		{
			return editor;
		}
		
	/*	if (attachToElem.innerHTML == "") //Set Default Text
		{
			attachToElem.innerHTML ="Click to edit Text";
			//alert("empty: "+ attachToElem.innerHTML );
		}*/
		
		if (attachToElem.innerHTML == defaultText)
		{
			attachToElem.innerHTML = "";
		}
		
		var caretCursor = new CaretCursor(attachToElem);
		var cursorPos = caretCursor.getCursorPositionOffset();
		var scrollTop = $(attachToElem).scrollTop();
		//alert("CKEdoit before cursor pos :" + cursorPos);
		//alert("this is called11 " +  attachToElem.id);
		setCKEditorToolbarView();

		CKEDITOR.disableAutoInline = true;

		//alert("ElemID = " + attachToElem.id);

		// Turn off automatic editor creation first.
		CKEDITOR.disableAutoInline = true;
		editor = CKEDITOR.inline(attachToElem.id, {
			// To enable source code editing in a dialog window, inline editors require the "sourcedialog" plugin.
			extraPlugins: 'sharedspace,sourcedialog',
			removePlugins: 'floatingspace,maximize,resize,elementspath,wsc,magicline,htmldataprocessor,undo,dragdrop,basket',
			scayt_autoStartup: true,
			sharedSpaces: {
				top: toolbarHolder.id,
				//bottom: 'bottom2'
			}
		});
		
		CKEDITOR.on( 'dialogDefinition', function( ev )
		{
		
			var dialogName = ev.data.name;
			var dialogDefinition = ev.data.definition;

			if (dialogName == 'tableProperties')
			{

				// Get the advanced tab reference
				var infoTab2 = dialogDefinition.getContents('advanced');

				//Set the default
				// Remove the 'Advanced' tab completely
				dialogDefinition.removeContents('advanced');

				// Get the properties tab reference
				var infoTab = dialogDefinition.getContents('info');

				// Remove unnecessary bits from this tab
				//infoTab.remove('txtBorder');
				//infoTab.remove('cmbAlign');
				infoTab.remove('txtWidth');
				infoTab.remove('txtHeight');
				//infoTab.remove('txtCellSpace');
				//infoTab.remove('txtCellPad');
				infoTab.remove('txtCaption');
				infoTab.remove('txtSummary');
			}
		});

		editor.on('instanceReady',  function(event)
		{
			
			// console.log("editor instance ready");
		
			
		    event.editor.document.on('mouseup', function (event) {
		        console.log("ckditor mouse up happened");
		        SWSnapDrag.mouseReleased();
		    });
		    
		    event.editor.document.on('dragstart', function (event) {
		        event.data.preventDefault(true);
		    });
		    
		    event.editor.document.on('drop', function (event) {
		        event.data.preventDefault(true);
		        console.log("MSSS..........fire mouse up as ck editor drop(mouse up) happened");
		        var u = new Event("mouseup");
		        var pageOffset = event.data.getPageOffset();
		        u.clientX = pageOffset.x;
		        u.clientY = pageOffset.y;
		        document.dispatchEvent(u);	
		        SWSnapDrag.mouseReleased();
		     });
		    
		    event.editor.document.on('drag', function (event) {
                event.data.preventDefault(true);
             });
		    
		    event.editor.document.on('dragover', function (event) {
                event.data.preventDefault(true);
             });
		    
			caretCursor.setCursorPosition(cursorPos, scrollTop);
			
			event.editor.removeMenuItem('cut');
			event.editor.removeMenuItem('copy');
			event.editor.removeMenuItem('paste');
			event.editor.removeMenuItem('tabledelete');
			
			
		/*	var textHistory = new SW_TextHistory(editor, SVGHistory);
			
			editor.document.on( 'keydown', function( event )
			{
			    console.log("editor instance ready key down");
			    if ( !event.data.$.ctrlKey && !event.data.$.metaKey )
			    {	textHistory.type(event);
					//console.log("editor key down");
			    }
			});*/
					
			var spnapShotRecordingStarted = false;
			
			var handleAfterCommandExec = function(event)
			{
				var commandName = event.data.name;
				
				if (typeof onCommandExecCallBack == 'function')
				{ 
					onCommandExecCallBack(commandName);
					//alert("Resize happended");
				}
			}
			
			var handleSaveSnapShot = function(event)
			{
				if (spnapShotRecordingStarted)
				{
					//alert("handleSaveSnapShot saving1111" + typeof onCommandExecCallBack);
					if (typeof onCommandExecCallBack == 'function')
					{ 
						//alert("handleSaveSnapShot saving222");
						onCommandExecCallBack("snapshot");					
					}					
				}
				
				spnapShotRecordingStarted = !spnapShotRecordingStarted;
				
			}
			
			editor.on('afterCommandExec', handleAfterCommandExec);
			editor.on('saveSnapshot', handleSaveSnapShot);
		
		});
		
		//Firefox remove editing controls
	    //attachToElem.designMode = "on";
        document.execCommand("enableInlineTableEditing", null, false);
        //document.execCommand("enableObjectResizing", null, false);
        
		
		return this;
	}

	this.dettachCKEditor = function(generateSnapEvent)
	{

		//alert("handleSaveSnapShot saving1111" + typeof onCommandExecCallBack);
		
		var selection = window.getSelection ? window.getSelection() : document.selection ? document.selection : null;
		if(!!selection) selection.empty ? selection.empty() : selection.removeAllRanges();

		if (typeof editor !== undefined && editor)
		{
			//console.log("Detaching CK editor1111");
			//editor.getSelection().removeAllRanges();
			editor.destroy(true);
			editor = null;
		}
		
		$(attachToElem).removeClass("cke_focus"); //added by ckeditor
		
		if (attachToElem.innerHTML == "" || attachToElem.innerHTML == "<BR>" || attachToElem.innerHTML == "<br>") //Set Default Text
		{
			attachToElem.innerHTML = defaultText;
			//alert("empty: "+ attachToElem.innerHTML );
		}
		
		if (typeof onCommandExecCallBack == 'function' && generateSnapEvent == true)
		{ 
			//alert("handleSaveSnapShot saving222");
			onCommandExecCallBack("snapshot");					
		}
		
		
		return this;
	},
	
	this.getAttachedCKEditor = function()
	{
		//alert("editor" +attachToElem);
		for(var i in CKEDITOR.instances)
		{	
			//alert(" CKEDITOR.instances[i].name" + CKEDITOR.instances[i].name + "\n id:"+editor.id); 

			if (attachToElem.id == CKEDITOR.instances[i].name)
			{
				//alert(" CKEDITOR.instances[i].name" + CKEDITOR.instances[i].name); 
				console.log ("Ckeditor is already attached");
				return CKEDITOR.instances[i];
			}
		}
		
		return null;
	}

	return this;
	
}


var Image = function(editor)
{
	    this.cursorPosition = 0;
	    this.scrollTopPos = 0;
	    
		this.getCKEditor = function (domEditor)
		{
			var editor = null;
			
			for(var i in CKEDITOR.instances)
			{	
				//alert(" CKEDITOR.instances[i].name" + CKEDITOR.instances[i].name + "\n id:"+editor.id); 
				
				if (domEditor.id == CKEDITOR.instances[i].name)
				{	
					//alert(" CKEDITOR.instances[i].name" + CKEDITOR.instances[i].name); 
					editor = CKEDITOR.instances[i];
					break;
				}
			}
			
			return editor;
		},

	
			
		//class init code starts here 
		ckeditor = this.getCKEditor(editor);
		
		if (ckeditor)
		{
			contentsOnly = false;
			
			ckeditor.fire( 'beforeUndoImage' );

			var contents = ckeditor.getSnapshot();

			// In IE, we need to remove the expando attributes.
			if ( CKEDITOR.env.ie && contents )
				contents = contents.replace( /\s+data-cke-expando=".*?"/g, '' );

			this.contents = contents;

			if (!contentsOnly) {
				var selection = contents && ckeditor.getSelection();
				this.bookmarks = selection && selection.createBookmarks2( true );
			}

			ckeditor.fire( 'afterUndoImage' );
		}
		else
		{
			this.contents = editor.innerHTML;
			this.bookmarks	= null;
		}
 		
		var caretCursor = new CaretCursor(editor);
		this.cursorPosition = caretCursor.getCursorPositionOffset();
		this.scrollTopPos = $(editor).scrollTop();
		console.log("current cursor positon" + this.cursorPosition);
		
};

 	// Attributes that browser may changing them when setting via innerHTML.
var protectedAttrs = /\b(?:href|src|name)="[^"]*?"/gi;

Image.prototype =
{
		equals : function(otherImage)
		{

			var thisContents = this.contents,
			otherContents = otherImage.contents;
			
			if (thisContents != otherContents)
			{
				return false;
			}

			return true;
		}
};
 

var SW_TextEditMonitor = function (SWElement)
{	
	//alert(" editor id  id:"+editor); 
	this.typesCount = 0;
	this.modifiersCount = 0;
	this.snapshots = [];

	var editingKeyCodes = {  8:1,  46:1 }; //Backspace, Delete
	var modifierKeyCodes = { 16:1, 17:1, 18:1 };  //Shift, Ctrl, Alt
	var	navigationKeyCodes = { 37: 1, 38: 1, 39: 1, 40: 1, // Arrows: L, T, R, B
					36: 1, 35: 1, // Home, End.
		        	33: 1, 34: 1 // PgUp, PgDn.
			};  
	var spaceKeyCodes = { 32:1, 13:1 }; //space, enter
			
	var domEditor = SWElement.getEditableElement();
	this.currentImage = new Image(domEditor);
	
	this.canRecord = function(event) 
	{	
		console.log("typing detected: " + event.which);
		var keystroke = event && event.which,
		isModifierKey = keystroke in modifierKeyCodes,
		isEditingKey = keystroke in editingKeyCodes,
		isSpaceKey = keystroke in spaceKeyCodes,
		wasEditingKey = this.lastKeystroke in editingKeyCodes,
		wasSpaceKey = this.lastKeystroke in spaceKeyCodes,
		sameAsLastEditingKey = isEditingKey && keystroke == this.lastKeystroke,
		// Keystrokes which navigation through contents.
		isReset = keystroke in navigationKeyCodes,
		wasReset = this.lastKeystroke in navigationKeyCodes,

		// Keystrokes which just introduce new contents.
		isContent = (!isEditingKey && !isReset),

		// Create undo snap for every different modifier key.
		modifierSnapshot = (isEditingKey && !sameAsLastEditingKey),
		// Create undo snap on the following cases:
		// 1. Just start to type .
		// 2. Typing some content after a modifier.
		// 3. Typing some content after make a visible selection.
		startedTyping = !( isModifierKey || this.typing )
		|| ( isContent && ( wasEditingKey || wasReset ) );

		this.lastKeystroke = keystroke;

		if (isEditingKey)
		{
			this.typesCount = 0;
			this.modifiersCount++;

			if ( this.modifiersCount > 25 )
			{
				//this.record( false, null, false );
				console.log("This is time to record text");
				this.modifiersCount = 1;
				return true;
			}
		}
		if (isSpaceKey && !wasSpaceKey)
		{
			this.modifiersCount = 0;
			this.typesCount = 0;
			return true;
		}
		else if (!isReset)
		{
			console.log("This is time to record text and reset :" + this.typesCount);
			this.modifiersCount = 0;
			this.typesCount++;

			if ( this.typesCount > 25 )
			{
				console.log("This is time to record text and reset");
				//this.record( false, null, false );
				this.typesCount = 1;
				return true;
			}
		}

		return false;
	},

    this.getRecordInfo = function()
    {
		var domEditor = SWElement.getEditableElement();
		
    	var image = new Image(domEditor);
    	var onContentOnly = false;
    	
    	if (image.contents == "")
    	{	
    		console.log("No contents in image");
    		return null; 
    	}
    		 
    	if (this.currentImage && image.equals(this.currentImage))
    	{ 	
    		
    		console.log("last image is same as this image\n" + this.currentImage.contents
    				+ "\n"+ image.contents);
    		return null;	
    	}	
    	
    	var undoFunct = this.restoreImage.bind(this, this.currentImage);
    	var redoFunct = this.restoreImage.bind(this, image);
    	this.currentImage = image; 	
    	
    	swRecorder = new SW_Recorder;
    	swRecorder.recordUndoFunction(undoFunct);
    	swRecorder.recordRedoFunction(redoFunct);
    	
    	console.log("storing image  cursorPosition" + image.cursorPosition);
    	return swRecorder;
    },
    
    this.restoreImage = function(image)
    {
    	var domEditor = SWElement.getEditableElement();
    	console.log("Restoring contents: " + image.contents);
    	domEditor.innerHTML = image.contents;	
    	var caretCursor = new CaretCursor(domEditor);
    	console.log("setting new  image  cursorPosition" + image.cursorPosition);
    	caretCursor.setCursorPosition(image.cursorPosition, image.scrollTopPos);
    	$(domEditor).blur(); //As CKEdotor is not attached.
     	//alert("image content" + image.contents);
     
    }
    
	
	return this;

}

