from django.urls import path
from .views import (
    PageSEOView,
    SEOBundleView,
    SEOSiteSettingsView,
    SEORedirectListView,
)

urlpatterns = [
    path('page/', PageSEOView.as_view(), name='seo_page'),
    path('bundle/', SEOBundleView.as_view(), name='seo_bundle'),
    path('site-settings/', SEOSiteSettingsView.as_view(), name='seo_site_settings'),
    path('redirects/', SEORedirectListView.as_view(), name='seo_redirects'),
]
