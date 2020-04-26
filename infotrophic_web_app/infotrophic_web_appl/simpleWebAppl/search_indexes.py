import datetime
from haystack import indexes
from simpleWebAppl.models import *

from python.extendedHTMLParser import *

class ExtendedPagesIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    Title = indexes.CharField(model_attr='Title')
    PageId = indexes.CharField(model_attr='PageId')
    Summary = indexes.CharField(model_attr='Summary')
    pub_date = indexes.DateTimeField(model_attr='publishDate')
    content_auto = indexes.EdgeNgramField(model_attr='Keywords')

    def get_model(self):
        return ExtendedPages

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
     #   parser = ExtendedHTMLParser()
    #  parser.parseHTML()
        return self.get_model().objects.all()
