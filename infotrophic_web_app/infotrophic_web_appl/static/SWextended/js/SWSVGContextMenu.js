var SW_SVGContextMenu = function(SWelement, SWSvgCanvas)
{
    this.SWelement = SWelement;
    this.SWSvgCanvas = SWSvgCanvas;
    
    var elem = this.SWelement.getUpperElement();    
    var myShowHideInnerText = function() 
    {  
        if (this.SWelement.isInnerTextHidden())
        {
            this.SWelement.showInnerText(); 
        }
        else
        {
           this.SWelement.hideInnerText(); 
        }
        
        this.SWSvgCanvas.unselectElement(false);
        this.SWSvgCanvas.selectElement(this.SWelement);
    }
    
    var myReqInnerText = function () { return this.SWelement.isForeignObject(); }
    var myIsInnerTextHidden = function () { return this.SWelement.isInnerTextHidden(); }
    var myBringFront = function() { this.SWelement.birngToFront();  }    
    var mySendBack = function() { this.SWelement.sendToBack();  }  
    var myDelete = function() {  this.SWSvgCanvas.deleteElement(this.SWelement,true);  } //true record
    //alert("id"+document.getElementById(elem.id));
    
    var loalreqInnerText = myReqInnerText.bind(this);
    var loalIsInnerTextHidden = myIsInnerTextHidden.bind(this);
    var localShowHideInnerText = myShowHideInnerText.bind(this);
    var localBringFront = myBringFront.bind(this);
    var localSendBack = mySendBack.bind(this);
    var localDelete = myDelete.bind(this);
    
    
    
    //elem.classList.add("SW_ContextClass");
    //remove existing context menu for element
   // alert("context menu:"+ elem.id);
    $.contextMenu("destroy",  { selector: '#'+elem.id});
    
    $.contextMenu({
        selector: '#'+elem.id ,
        build: function($trigger, e) {
            return {               
                items: {    

                    showhideInnerText : {
                        name: (loalIsInnerTextHidden()) ? "Show Text Block" : "Hide Text Block",   
                        disabled: loalreqInnerText() ? true : false,
                        icon: "fa-stop-o",
                        callback: function(key, opt){
                                            localShowHideInnerText();                    
                        }
                    }, 

                    separator1: "-----",

                    bringToFront : {
                        name: "Bring Front",       
                        icon: "fa-stop-o",
                        callback: function(key, opt){
                            localBringFront();                    
                        }
                    },   
                    
                    separator2: "-----",
                    sendToBack : {
                        name: "Send Back",       
                        icon: "fa-stop-o",
                        callback: function(key, opt){
                            localSendBack();                    
                        }
                    },   
                    separator3: "-----",
                    deleteMe : {
                        name: "Delete",       
                        icon: "fa-trash-o",
                        callback: function(key, opt){
                            $.contextMenu("destroy",  { selector: '#'+elem.id});
                            localDelete();                    
                        }
                    },  
                }
            };
        },
    });
}