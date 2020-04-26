from cms.toolbar_pool import toolbar_pool
from cms.toolbar_base import CMSToolbar

@toolbar_pool.register
class NoopModifier(CMSToolbar):

    def populate(self):
        pass

    def post_template_populate(self):
        pass

    def request_hook(self):
        pass
