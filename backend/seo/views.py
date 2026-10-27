import xml.etree.ElementTree as ET
from datetime import datetime
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.cache import cache_control
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import SEOSiteSettings, PageSEO, ImageSEO, SEORedirect
from .serializers import (
    PageSEOSerializer,
    SEOSiteSettingsSerializer,
    ImageSEOSerializer,
    SEORedirectSerializer,
)


class PageSEOView(APIView):
    """
    Public read-only API endpoint to retrieve SEO metadata, headings,
    and schema for a specific page path.
    Example: GET /api/seo/page/?path=/projects
    """
    def get(self, request):
        path = request.query_params.get('path', '/').strip()
        if not path.startswith('/'):
            path = '/' + path
        if len(path) > 1 and path.endswith('/'):
            path = path.rstrip('/')

        try:
            page_seo = PageSEO.objects.get(page_path=path, is_active=True)
            serializer = PageSEOSerializer(page_seo, context={'request': request})
            resp = Response(serializer.data)
            resp['Cache-Control'] = 'public, max-age=60'
            return resp
        except PageSEO.DoesNotExist:
            return Response(
                {"error": f"No active SEO configuration for path '{path}'"},
                status=status.HTTP_404_NOT_FOUND
            )


class SEOBundleView(APIView):
    """
    Consolidated public endpoint returning all active page SEO configs,
    headings, image alt texts, site settings, and redirects.
    Optimized for SPA frontend to load all SEO metadata in a single network request.
    GET /api/seo/bundle/
    """
    def get(self, request):
        settings_obj = SEOSiteSettings.get_solo()
        pages = PageSEO.objects.filter(is_active=True).prefetch_related('headings')
        images = ImageSEO.objects.all()
        redirects = SEORedirect.objects.filter(is_active=True)

        pages_dict = {}
        all_headings = {}
        for p in pages:
            data = PageSEOSerializer(p, context={'request': request}).data
            pages_dict[p.page_path] = data
            if 'headings' in data and isinstance(data['headings'], dict):
                all_headings.update(data['headings'])

        images_dict = {}
        for img in images:
            images_dict[img.image_key] = "" if img.is_decorative else img.alt_text

        redirects_data = SEORedirectSerializer(redirects, many=True).data
        settings_data = SEOSiteSettingsSerializer(settings_obj, context={'request': request}).data

        resp = Response({
            "settings": settings_data,
            "pages": pages_dict,
            "headings": all_headings,
            "images": images_dict,
            "redirects": redirects_data,
        })
        resp['Cache-Control'] = 'public, max-age=60'
        return resp


class SEOSiteSettingsView(APIView):
    """
    Public read-only endpoint for site-wide SEO settings.
    GET /api/seo/site-settings/
    """
    def get(self, request):
        settings_obj = SEOSiteSettings.get_solo()
        serializer = SEOSiteSettingsSerializer(settings_obj, context={'request': request})
        resp = Response(serializer.data)
        resp['Cache-Control'] = 'public, max-age=300'
        return resp


class SEORedirectListView(APIView):
    """
    Public read-only endpoint returning active URL redirect rules.
    GET /api/seo/redirects/
    """
    def get(self, request):
        redirects = SEORedirect.objects.filter(is_active=True)
        serializer = SEORedirectSerializer(redirects, many=True)
        resp = Response(serializer.data)
        resp['Cache-Control'] = 'public, max-age=300'
        return resp


@require_GET
@cache_control(public=True, max_age=3600)
def sitemap_xml_view(request):
    """
    Dynamically generates standard XML Sitemap (sitemaps.org/schemas/sitemap/0.9).
    Includes all indexable PageSEO routes and published Blog Posts.
    Excludes noindex pages, admin endpoints, and private URLs.
    GET /sitemap.xml
    """
    settings_obj = SEOSiteSettings.get_solo()
    if not settings_obj.sitemap_enabled:
        return HttpResponse("Sitemap disabled", status=404, content_type='text/plain')

    base_url = settings_obj.canonical_base_url.rstrip('/')

    urlset = ET.Element('urlset', {
        'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9'
    })

    # 1. Add active indexable PageSEO pages
    pages = PageSEO.objects.filter(is_active=True).exclude(index_directive__icontains='noindex')
    for p in pages:
        loc_url = p.get_effective_canonical(base_url)
        url_elem = ET.SubElement(urlset, 'url')
        ET.SubElement(url_elem, 'loc').text = loc_url

        if p.updated_at:
            ET.SubElement(url_elem, 'lastmod').text = p.updated_at.strftime('%Y-%m-%d')

        if p.page_path == '/':
            ET.SubElement(url_elem, 'changefreq').text = 'weekly'
            ET.SubElement(url_elem, 'priority').text = '1.0'
        elif p.page_path in ('/projects', '/visit-us'):
            ET.SubElement(url_elem, 'changefreq').text = 'weekly'
            ET.SubElement(url_elem, 'priority').text = '0.9'
        elif p.page_path in ('/about-us', '/contact', '/blog'):
            ET.SubElement(url_elem, 'changefreq').text = 'monthly'
            ET.SubElement(url_elem, 'priority').text = '0.8'
        else:
            ET.SubElement(url_elem, 'changefreq').text = 'monthly'
            ET.SubElement(url_elem, 'priority').text = '0.7'

    # 2. Add published Blog Posts
    try:
        from blog.models import BlogPost
        published_posts = BlogPost.objects.filter(status='published').order_by('-published_at')
        for post in published_posts:
            # Check if post has noindex directive
            if hasattr(post, 'index_directive') and 'noindex' in post.index_directive:
                continue

            post_url = f"{base_url}/blog/{post.slug}"
            url_elem = ET.SubElement(urlset, 'url')
            ET.SubElement(url_elem, 'loc').text = post_url

            lastmod = post.updated_at or post.published_at
            if lastmod:
                ET.SubElement(url_elem, 'lastmod').text = lastmod.strftime('%Y-%m-%d')

            ET.SubElement(url_elem, 'changefreq').text = 'monthly'
            ET.SubElement(url_elem, 'priority').text = '0.7'
    except Exception:
        pass

    xml_bytes = ET.tostring(urlset, encoding='utf-8', xml_declaration=True)
    return HttpResponse(xml_bytes, content_type='application/xml; charset=utf-8')


@require_GET
@cache_control(public=True, max_age=3600)
def robots_txt_view(request):
    """
    Dynamically generates robots.txt for search engine crawlers.
    GET /robots.txt
    """
    settings_obj = SEOSiteSettings.get_solo()

    if settings_obj.custom_robots_txt and settings_obj.custom_robots_txt.strip():
        content = settings_obj.custom_robots_txt.strip()
    else:
        base_url = settings_obj.canonical_base_url.rstrip('/')
        lines = [
            "User-agent: *",
        ]
        if not settings_obj.robots_allow_indexing:
            lines.append("Disallow: /")
        else:
            lines.extend([
                "Allow: /",
                "Disallow: /admin/",
                "Disallow: /api/",
                "",
                f"Sitemap: {base_url}/sitemap.xml",
            ])
        content = "\n".join(lines)

    return HttpResponse(content, content_type='text/plain; charset=utf-8')
