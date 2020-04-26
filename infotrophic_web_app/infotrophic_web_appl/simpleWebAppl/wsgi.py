"""
WSGI config for simpleWebAppl project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
import sys

#sys.path.append('/InfoTrophic/infotrophic_web_app/infotrophic_web_appl/simpleWebAppl')

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "simpleWebAppl.settings")

application = get_wsgi_application()
