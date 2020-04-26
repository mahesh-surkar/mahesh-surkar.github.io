from django.core.management.base import BaseCommand
from os import listdir, path
from os.path import * 
import re
from bs4 import BeautifulSoup

from simpleWebAppl.config import *
from simpleWebAppl.models import *

class ExtendedHTMLParser(BaseCommand):
                
    def parseHTMLDir(self, htmlDir):
          self.stdout.write("Parsing HTML file" + htmlDir)
          HTMLFiles = [ htmlFile for htmlFile in listdir(htmlDir) if (isfile(join(htmlDir, htmlFile)) and re.search('.html$', htmlFile))]

#          ExtendedPages.objects.all().remove()

          for fileName in HTMLFiles:
            self.stdout.write("Parsing HTML file" + fileName)
            fileNameWithPath = join(htmlDir, fileName) 
            #print fileNameWithPath 
            htmlData = open(fileNameWithPath).read()
            #print htmlData

            soup = BeautifulSoup(htmlData, 'html.parser')
 
            pageId, extention = splitext(fileName)
            htmlFile = pageId + ".html" 
            jsFile = pageId +  ".js"
            cssFile = pageId + ".css" 
            author=""
            title=""
            keywords=""
            summary=""
            displaySection=""

            for metaTag in soup.find_all('meta'):

               tagName = metaTag.get('name')
               if tagName is not None:
                 tagName = tagName.lower()

               if tagName == "author":
                 author= metaTag.get('content')
               elif tagName == "title":
                 title = metaTag.get('content')
               elif tagName == "keywords": 
                 keywords = metaTag.get('content')
               elif tagName == "displaysection": 
                 displaySection = metaTag.get('content')
               elif tagName == "description" or tagName == "summary":
                 summary = metaTag.get('content')
            ''' 
            print "pageId = " + pageId
            print "title = " + title
            print "htmlFile = " + htmlFile
            print "jsFile = " + jsFile
            print "cssFile = " + cssFile
            print "author = " + author 
            print "keywords =" + keywords
            print "displaySection = " + displaySection
            print "summary/description = " + summary 
            '''
                   
            try:
                ExtendedPages.objects.filter(PageId=pageId).delete() 
                page = ExtendedPages.objects.create(PageId=pageId, Author=author, Title=title, HTMLFile=htmlFile, JSFile=jsFile, CSSFile=cssFile, Summary=summary, Keywords=keywords, DisplaySection=displaySection, publishDate="2015-09-11 00:35")
                page.save()
                self.stdout.write("Added " + pageId + " page in database.")

            except:                
                self.stdout.write("Error: Could not add page in database. " + pageId + " might be already exists.")
             

    def parseHTML(self):
            
            self.stdout.write("Reading extended sub directories in " + EXTENDED_STATIC_DIR)
            ExtendedDirs = [ os.path.join(EXTENDED_STATIC_DIR,subDir) for subDir in os.listdir(EXTENDED_STATIC_DIR) if os.path.isdir(os.path.join(EXTENDED_STATIC_DIR, subDir))]
            
            for dirName in ExtendedDirs:
                self.stdout.write("Reading extended web direcory " + dirName)
                self.parseHTMLDir(join(dirName, "html"))
if __name__ == "__main__":

     parser = ExtendedHTMLParser()
     parser.parseHTML()

