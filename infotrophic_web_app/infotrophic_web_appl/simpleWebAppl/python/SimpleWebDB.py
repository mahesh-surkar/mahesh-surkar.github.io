import SimpleWebGlobal
from simpleWebAppl.models import *

def DB_getHTMLPageToRender(pageID):

    if pageID != None:
            try: 
                pageDetails=ExtendedPages.objects.get(PageId=pageID)

                if pageDetails != None:
                    return pageDetails.HTMLFile, pageDetails.JSFile, pageDetails.CSSFile, "" #html template/page, js and css, json
                else:
                    return SimpleWebGlobal.defaultContentPage, SimpleWebGlobal.homeJS, SimpleWebGlobal.homeCSS, ""
            
            except:
                return SimpleWebGlobal.defaultContentPage, SimpleWebGlobal.homeJS, SimpleWebGlobal.homeCSS, ""
    else:
       return SimpleWebGlobal.defaultContentPage, SimpleWebGlobal.homeJS, SimpleWebGlobal.homeCSS, ""

def DB_getLinksForSection(section):
    try:
        pageDetails=ExtendedPages.objects.all().filter(DisplaySection=section)
        return pageDetails
    except:
        print "Exception in DB_getLinksForSection"
        return ""
        
    return linkDetails