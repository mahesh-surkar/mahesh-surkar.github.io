import os
from simpleWebAppl.config import *

'''
SIMPLE_WEB_CSS_PATH = "simpleWeb/css/"
SIMPLE_WEB_JS_PATH = "simpleWeb/js/"
SIMPLE_WEB_JSON_PATH = "static/simpleWeb/json/" 
SIMPLE_WEB_CMS_JSON_PATH = "static/SWcms/json/"

SW_LAYOUT_JASON_FILE_PATH = "webLayout/json/" #for development
EXTENDED_XML_FILE_PATH  = "extendedStatic/xml/" #for development
 
try :
  if os.environ['SIMPLE_WEB_ENV'] == "PRODUCTION":
      SW_LAYOUT_JASON_FILE_PATH = "/opt/python/current/app/infotrophic_web_appl/webLayout/json/"
      EXTENDED_XML_FILE_PATH = "/opt/python/current/app/infotrophic_web_appl/extendedStatic/xml/"
      SIMPLE_WEB_JSON_PATH = "/opt/python/current/app/infotrophic_web_appl/static/simpleWeb/json/"
      SIMPLE_WEB_CMS_JSON_PATH = "/opt/python/current/app/infotrophic_web_appl/static/SWcms/json/"
except : 
      SW_LAYOUT_JASON_FILE_PATH = "webLayout/json/" #for development
      EXTENDED_XML_FILE_PATH  = "extendedStatic/xml/" #for development
      SIMPLE_WEB_JSON_PATH = "static/simpleWeb/json/"
      SIMPLE_WEB_CMS_JSON_PATH = "static/SWcms/json/"

'''

headerCSS = SIMPLE_WEB_CSS_PATH + "SimpleWebHeader.css"
headerJSConst = SIMPLE_WEB_JS_PATH + "SimpleWebConstants.js"
headerJS = SIMPLE_WEB_JS_PATH + "SimpleWebHeader.js"
headerJson = SIMPLE_WEB_JSON_PATH + "Header.json"
headerHtmlTemplate = "SimpleWebHeader.html"

homeCSS = SIMPLE_WEB_CSS_PATH + "SimpleWebHeader.css"
contentCSS = SIMPLE_WEB_CSS_PATH + "SimpleWebContent.css"
homeJSConst = SIMPLE_WEB_JS_PATH + "SimpleWebConstants.js"
homeJS = SIMPLE_WEB_JS_PATH + "SimpleWebHome.js"
homeJson = SW_LAYOUT_JASON_FILE_PATH + "Layout.json"
homeHtmlTemplate = "SimpleWebHome.html"


