from django.core.management.base import BaseCommand, CommandError
from simpleWebAppl.python.extendedHTMLParser import *

class Command(BaseCommand):
    help = 'Parse extended SimpleWeb HTML pages to make database entries.'
    
    can_import_settings = True    
    
    def handle(self, *args, **options):
        parser = ExtendedHTMLParser()
        parser.parseHTML()
        
        #self.stdout.write("Unterminated line", ending='')