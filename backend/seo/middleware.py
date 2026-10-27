from django.http import HttpResponsePermanentRedirect, HttpResponseRedirect
from django.utils.deprecation import MiddlewareMixin
from .models import SEORedirect


class SEORedirectMiddleware(MiddlewareMixin):
    """
    Middleware that checks incoming URL paths against active SEORedirect rules.
    If a rule matches, issues an HTTP 301 (Permanent) or 302 (Temporary) redirect.
    Bypasses admin, api, static, and media paths.
    """
    def process_request(self, request):
        path = request.path
        if path.startswith(('/admin', '/api', '/static', '/media')):
            return None

        # Check clean path with and without trailing slash
        clean_path = path.rstrip('/') if len(path) > 1 else path
        redirect_rule = SEORedirect.objects.filter(
            source_path__in=[clean_path, clean_path + '/'],
            is_active=True
        ).first()

        if redirect_rule:
            dest = redirect_rule.destination_url
            if redirect_rule.redirect_type == 301:
                return HttpResponsePermanentRedirect(dest)
            return HttpResponseRedirect(dest)

        return None
