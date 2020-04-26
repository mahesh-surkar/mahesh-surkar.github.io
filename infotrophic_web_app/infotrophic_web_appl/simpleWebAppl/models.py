from django.db import models
from django.contrib.auth.models import User

class ExtendedPages(models.Model):
    PageId = models.CharField(max_length=200, unique=True)
    Author = models.CharField(max_length=200)
    Title = models.CharField(max_length=200) 
    HTMLFile = models.CharField(max_length=200)
    JSFile = models.CharField(max_length=200)
    CSSFile = models.CharField(max_length=200)
    Summary = models.TextField()
    Keywords = models.TextField()
    DisplaySection = models.TextField()
    publishDate = models.DateTimeField()

    def __unicode__(self):
       return self.Title

