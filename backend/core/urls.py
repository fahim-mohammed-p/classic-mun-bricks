from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static

from .views import keep_alive, inspect_storage, run_migrations
from seo.views import sitemap_xml_view, robots_txt_view

def health_check(request):
    return JsonResponse({"status": "ok", "service": "Classic Mun Bricks API", "version": "1.0.0"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sitemap.xml', sitemap_xml_view, name='sitemap_xml'),
    path('robots.txt', robots_txt_view, name='robots_txt'),
    path('api/health/', health_check, name='health_check'),
    path('api/internal/keep-alive/', keep_alive, name='keep_alive'),
    path('api/internal/inspect-storage/', inspect_storage, name='inspect_storage'),
    path('api/internal/run-migrations/', run_migrations, name='run_migrations'),
    path('api/seo/', include('seo.urls')),
    path('api/factory-processes/', include('processes.urls')),
    path('api/contact/', include('contacts.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/projects/', include('projects.urls')),
]

from django.urls import re_path
from django.views.static import serve

# Serve user uploaded media in both development and production
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]


