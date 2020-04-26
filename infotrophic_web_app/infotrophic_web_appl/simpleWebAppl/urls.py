"""infotrophic_web_appl URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
#from PoolsDjangoProject import settings
#from django.contrib import admin
from . import settings
from django.conf import settings
from django.conf.urls.static import static

from python.SimpleWeb import *

#admin.site.site_header = settings.ADMIN_SITE_HEADER
#admin.site.site_title = settings.ADMIN_SITE_HEADER 
#admin.site.index_title = settings.ADMIN_SITE_HEADER

urlpatterns = [
#    url(r'^admin/', include(admin.site.urls)),    
#    url(r'^cms/', include('cms.urls')),
    url(r'^(?i)search$', include('haystack.urls')),
    url(r'^(?i)search/', include('haystack.urls')),
    url(r'^(?i)google8612703b8d1ab254.html/', googleVerify),
    url(r'^(?i)SWSiteMap$', SWSiteMap),    
    url(r'^$', SWHome), 
    url(r'^(?i)index*', SWHome),
    url(r'^(?i)SWHome$', SWHome),
    url(r'^(?i)SWContent$', SWHome),
    url(r'^(?i)SWPageLayout$', SWLayout),    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


