import os

defaultContentPage = "SimpleWebContent.html"
SWContent="SWContent";

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
EXTERNAL_STATIC_DIR = os.path.join(BASE_DIR, 'externalStatic/')
EXTENDED_STATIC_DIR = os.path.join(BASE_DIR, 'extendedStatic/')
EXTENDED_HTML_DIR=os.path.join(EXTENDED_STATIC_DIR, 'SWextended/html/')

SIMPLE_WEB_CSS_PATH = "simpleWeb/css/"
SIMPLE_WEB_JS_PATH = "simpleWeb/js/"
SIMPLE_WEB_JSON_PATH = "static/simpleWeb/json/" 
SIMPLE_WEB_CMS_JSON_PATH = "static/SWcms/json/"
SIMPLE_WEB_EXTENDED_JSON_PATH = "static/SWextended/json/"

SW_LAYOUT_JASON_FILE_PATH = "webLayout/json/" #for development
EXTENDED_XML_FILE_PATH  = "extendedStatic/xml/" #for development
 
try :
  if os.environ['SIMPLE_WEB_ENV'] == "PRODUCTION":
      #BASE__DIR = "/opt/python/current/app/infotrophic_web_appl"
      SW_LAYOUT_JASON_FILE_PATH = os.path.join(BASE_DIR, "webLayout/json/")
      EXTENDED_XML_FILE_PATH = os.path.join(BASE_DIR, "extendedStatic/xml/")
      SIMPLE_WEB_JSON_PATH = os.path.join(BASE_DIR, "static/simpleWeb/json/")
      SIMPLE_WEB_CMS_JSON_PATH = os.path.join(BASE_DIR, "static/SWcms/json/")
      SIMPLE_WEB_EXTENDED_JSON_PATH = os.path.join(BASE_DIR, "static/SWextended/json/")
except : 
      SW_LAYOUT_JASON_FILE_PATH = "webLayout/json/" #for development
      EXTENDED_XML_FILE_PATH  = "extendedStatic/xml/" #for development
      SIMPLE_WEB_JSON_PATH = "static/simpleWeb/json/"
      SIMPLE_WEB_CMS_JSON_PATH = "static/SWcms/json/"
      SIMPLE_WEB_EXTENDED_JSON_PATH = "static/SWextended/json/"
      
