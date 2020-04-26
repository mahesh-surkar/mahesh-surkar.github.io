import os
from django import template
import json
from simpleWebAppl.config import *


register = template.Library()

@register.simple_tag
def generateJsonToSend(jsonFile):     
    json_data = open(jsonFile)
    objJSON = json.load(json_data)      
    return json.dumps(objJSON)

@register.simple_tag               
def generateCMSJsonToSend(jsonFileWithoutPath):
    cmsJsonFile = os.path.join(SIMPLE_WEB_CMS_JSON_PATH, jsonFileWithoutPath)
    return generateJsonToSend(cmsJsonFile)

@register.simple_tag               
def generateExtentedJsonToSend(jsonFileWithoutPath):
    cmsJsonFile = os.path.join(SIMPLE_WEB_EXTENDED_JSON_PATH, jsonFileWithoutPath)
    return generateJsonToSend(cmsJsonFile)