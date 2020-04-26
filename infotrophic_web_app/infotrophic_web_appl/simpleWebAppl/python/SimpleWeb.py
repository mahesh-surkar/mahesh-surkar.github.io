from django.template import RequestContext
from django.http import HttpRequest
from django.shortcuts import render_to_response
import re

import SimpleWebGlobal
from SimpleWebHome import *
 
def googleVerify(request):
    pageToRender =  "googleVarify.html"
    context = RequestContext(request)
    context_dict = {
                        'headerCSS': SimpleWebGlobal.headerCSS,
                   }
    return render_to_response(pageToRender, context_dict, context)

def SWSiteMap(request):
    siteMapXML  = SimpleWebGlobal.EXTENDED_XML_FILE_PATH + 'sitemap.xml'
    return HttpResponse(open(siteMapXML).read(), content_type='text/xml')

def SWHeader(request):
    context = RequestContext(request)
    context_dict = {
                        'myCSS': SimpleWebGlobal.headerCSS,
                        'myJS': SimpleWebGlobal.headerJS,
			            'myJSConst': SimpleWebGlobal.headerJSConst, 
                   }
    return render_to_response(SimpleWebGlobal.headerHtmlTemplate, context_dict, context)

def SWHome(request):
     return renderSWHome(request) 

def SWLayout(request):
    if request.method == "POST":
       reqContentId = request.POST.get('page')
    else:      
       reqContentId = request.GET.get('page')
       
    context = RequestContext(request)
    context_dict = { 'reqContentId' : reqContentId }
    return render_to_response(reqContentId +'.html', context_dict, context)

