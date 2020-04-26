from django.template import RequestContext
from django.http import HttpRequest
from django.http import HttpResponse
from django.shortcuts import render_to_response

import re
import sqlite3 as lite
import sys
import json

from SimpleWebDB import * 
import SimpleWebGlobal

def renderSWHome(request):
    context = RequestContext(request)
       
    objHeaderJSON = generateHeaderJson()
    
    if request.method == "POST":
       reqContentId = request.POST.get('page')
    else:      
       reqContentId = request.GET.get('page')

    jsToSend = SimpleWebGlobal.homeJS
    cssToSend = SimpleWebGlobal.homeCSS
    jsonFile  = SimpleWebGlobal.homeJson
    pageToRender = getSimpleWebPage(reqContentId)          
    
    if pageToRender == None:    
        pageToRender, jsToSend, cssToSend, jsonFile =  DB_getHTMLPageToRender(reqContentId)  
 
    print "pageToRender : " + pageToRender
       
    try:
        reqReferer = ""
        #regex = re.compile(r'localhost|127.0.0.1|infotrophic.com', re.IGNORECASE)  #localhost...
        regex = re.compile(r'infotrophic1.com|infotrophic.com', re.IGNORECASE)  #localhost...
        if re.search(regex, request.META['HTTP_REFERER']) is not None:
            reqReferer = request.META['HTTP_REFERER']
                
        isNewTab = request.GET.get('newTab')
       
        if isNewTab is None or isNewTab == "true":   
             pageToRender = SimpleWebGlobal.homeHtmlTemplate
             jsToSend = SimpleWebGlobal.homeJS
             cssToSend = SimpleWebGlobal.homeCSS
             jsonFile  = SimpleWebGlobal.homeJson
             
    except KeyError:  #no referer found 
       pageToRender = SimpleWebGlobal.homeHtmlTemplate
       jsToSend = SimpleWebGlobal.homeJS
       cssToSend = SimpleWebGlobal.homeCSS
       jsonFile  = SimpleWebGlobal.homeJson
       
    jsonDump = ""
    if jsonFile != "":
       jsonToSend = generateJsonToSend(jsonFile)
       jsonDump = json.dumps(jsonToSend)
    
    if request.is_ajax():
        return HttpResponse(jsonDump, content_type="application/json")
    else:
        context_dict = {
                        'headerCSS': SimpleWebGlobal.headerCSS,
                        'contentCSS': SimpleWebGlobal.contentCSS,
                        'myCSS': cssToSend, 
                        'headerJS': SimpleWebGlobal.headerJS,
                        'myJS': jsToSend,
                        'myJSConst': SimpleWebGlobal.homeJSConst,
                        'myContent': reqContentId,
                        'headerJasonDump': json.dumps(objHeaderJSON),
                        'myJasonDump': jsonDump,
        }
        #return HttpResponse(json.dumps(jsonToSend), content_type="application/json")        
        return render_to_response(pageToRender, context_dict, context) 

   
def getSimpleWebPage(pageId):  
    if pageId != None:
        pageId = pageId.lower()    
    
    if pageId == "swadmin":
       return "SimpleWebAdmin.html"
   
    return None

def generateJsonToSend(jsonFile):
     
    json_data = open(jsonFile) 
 #   json_data = open(SimpleWebGlobal.JASON_FILE_PATH + "Search.json") 
    objJSON = json.load(json_data)
    return objJSON
               
    
def generateHeaderJson():
    
    json_data = open(SimpleWebGlobal.headerJson) 
    objHeaderJSON = json.load(json_data)
    
    for menukey in objHeaderJSON: # to read array
        for menu in objHeaderJSON[menukey]:            
            myMenuName = menu["MenuName"]
            for subMenu in menu["SubMenu"]:
                mySubMenuName = subMenu["SubMenuHeading"]
                mySection = ""
                if mySubMenuName != "" :
                    mySection = myMenuName + ":" + mySubMenuName
                    #print mySection
                    pagesInfo = ""
                    pagesInfo = DB_getLinksForSection(mySection)
                    #print linkDetails
                    for linkDetails in pagesInfo:                                                
                        if linkDetails != "" and linkDetails.Title != "" and linkDetails.PageId != "":
                            lkname = '{ "LinkName": "' + linkDetails.Title + '" , "LinkURL": "' + SimpleWebGlobal.SWContent + '?page=' + linkDetails.PageId + '" }'
                            newlink = json.loads(lkname)
                            #print lkname
                            subMenu["Links"].append(newlink)
                            #print mySection
                           
                for link in subMenu["Links"]:
                    lkName = ""
                    lkURL = ""
                    for linkKey in link: 
                        if linkKey == "LinkName":
                            lkName = link[linkKey]
                        if linkKey == "LinkURL":
                            lkURL = link[linkKey]
                            
                        # if lkName != "" and lkURL != "": 
                        #print "Link Name :  " + lkName + "lkURL is :" + lkURL
                    #print "" 
    #print objHeaderJSON 
    return objHeaderJSON  
  
# main section to enable run from command line    
if __name__ == "__main__":
    import sys
    generateHeaderJson()       
