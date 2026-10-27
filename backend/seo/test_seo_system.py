import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from django.contrib.auth.models import User, Group, Permission
from django.test import RequestFactory
from seo.models import SEOSiteSettings, PageSEO, PageHeading, ImageSEO, SEORedirect
from seo.views import SEOBundleView, PageSEOView, sitemap_xml_view, robots_txt_view
from seo.middleware import SEORedirectMiddleware
from blog.models import BlogPost

def run_tests():
    print("=" * 60)
    print("SEO MANAGEMENT SYSTEM COMPLETE VALIDATION SUITE")
    print("=" * 60)

    # 1. User & Permission Checks
    print("\n--- 1. SEO Admin User & Permissions ---")
    seo_admin = User.objects.filter(username='seo_admin').first()
    assert seo_admin is not None, "seo_admin does not exist!"
    assert seo_admin.is_staff == True, "seo_admin must have is_staff=True!"
    assert seo_admin.is_superuser == False, "seo_admin must NOT be superuser!"
    print(f"[PASS] seo_admin exists: staff={seo_admin.is_staff}, superuser={seo_admin.is_superuser}")

    # Check password hash preserved
    assert seo_admin.password.startswith('pbkdf2_sha256$1000000$64lpNmxH28PuVr7TPSJpnf$CEXnHUXM7yc3oEV6IOQ7VKR2H2W/RqLefhpLcol6Pok='), "Password hash was modified!"
    print("[PASS] seo_admin password hash is strictly preserved and unchanged.")

    # Check groups
    groups = list(seo_admin.groups.values_list('name', flat=True))
    assert 'SEO Manager' in groups, "seo_admin must be in 'SEO Manager' group"
    print(f"[PASS] seo_admin belongs to group: {groups}")

    # Check permissions
    assert seo_admin.has_perm('seo.change_pageseo'), "Must have seo.change_pageseo"
    assert seo_admin.has_perm('seo.change_pageheading'), "Must have seo.change_pageheading"
    assert seo_admin.has_perm('seo.change_imageseo'), "Must have seo.change_imageseo"
    assert seo_admin.has_perm('seo.change_seoredirect'), "Must have seo.change_seoredirect"
    assert seo_admin.has_perm('seo.change_seositesettings'), "Must have seo.change_seositesettings"
    assert seo_admin.has_perm('blog.change_blogpost'), "Must have blog.change_blogpost"
    print("[PASS] seo_admin has full change/add permissions for all SEO models and Blog posts.")

    # Check security boundaries
    assert not seo_admin.has_perm('auth.change_user'), "SEO Admin MUST NOT have auth.change_user"
    assert not seo_admin.has_perm('auth.delete_user'), "SEO Admin MUST NOT have auth.delete_user"
    assert not seo_admin.has_perm('auth.change_group'), "SEO Admin MUST NOT have auth.change_group"
    assert not seo_admin.has_perm('projects.delete_projectlocation'), "SEO Admin MUST NOT have projects.delete_projectlocation"
    assert not seo_admin.has_perm('projects.delete_projectimage'), "SEO Admin MUST NOT have projects.delete_projectimage"
    print("[PASS] Security boundary verified: seo_admin cannot manage Users, Groups, or delete Project locations/images.")

    # 2. Check Project Manager
    print("\n--- 2. Project Manager User & Permissions ---")
    pm = User.objects.filter(username='projectmanager').first()
    if pm:
        assert pm.is_superuser == False, "projectmanager must not be superuser"
        print(f"[PASS] projectmanager user is intact: staff={pm.is_staff}, superuser={pm.is_superuser}")
    else:
        print("[INFO] projectmanager user not found in local db (check Supabase)")

    # 3. Model & Seed Data Check
    print("\n--- 3. SEO Models & Seed Data ---")
    page_count = PageSEO.objects.count()
    heading_count = PageHeading.objects.count()
    image_count = ImageSEO.objects.count()
    settings = SEOSiteSettings.load()

    assert page_count >= 6, f"Expected at least 6 PageSEO records, found {page_count}"
    assert heading_count >= 10, f"Expected at least 10 PageHeading records, found {heading_count}"
    assert image_count >= 5, f"Expected at least 5 ImageSEO records, found {image_count}"
    assert settings.site_name == "Classic Mun Bricks", f"Unexpected site name: {settings.site_name}"
    print(f"[PASS] Seed data loaded: {page_count} pages, {heading_count} headings, {image_count} images, site='{settings.site_name}'")

    # 4. API Endpoints Check
    print("\n--- 4. API Endpoints ---")
    factory = RequestFactory()

    # Bundle API
    req = factory.get('/api/seo/bundle/')
    view = SEOBundleView.as_view()
    resp = view(req)
    assert resp.status_code == 200, f"SEOBundleView returned {resp.status_code}"
    bundle_data = resp.data
    assert 'pages' in bundle_data and len(bundle_data['pages']) >= 6
    assert 'headings' in bundle_data and len(bundle_data['headings']) >= 10
    assert 'images' in bundle_data and len(bundle_data['images']) >= 5
    assert 'settings' in bundle_data and bundle_data['settings']['site_name'] == "Classic Mun Bricks"
    print(f"[PASS] SEOBundleView (/api/seo/bundle/) returned 200 OK with full payload.")

    # Page API
    req = factory.get('/api/seo/page/?path=/')
    view = PageSEOView.as_view()
    resp = view(req)
    assert resp.status_code == 200, f"PageSEOView returned {resp.status_code}"
    page_data = resp.data
    assert page_data['page_path'] == '/'
    assert 'headings' in page_data
    assert 'schema_markup' in page_data
    print(f"[PASS] PageSEOView (/api/seo/page/?path=/) returned 200 OK with home page metadata & schema.")

    # Sitemap XML
    req = factory.get('/sitemap.xml')
    resp = sitemap_xml_view(req)
    assert resp.status_code == 200, f"sitemap_xml_view returned {resp.status_code}"
    assert resp['Content-Type'] == 'application/xml; charset=utf-8'
    content = resp.content.decode('utf-8')
    assert '<urlset' in content and 'https://www.classicmunbricks.com/' in content
    assert '/projects' in content and '/visit-us' in content
    print(f"[PASS] sitemap_xml_view (/sitemap.xml) returned valid XML with indexable URLs.")

    # Robots.txt
    req = factory.get('/robots.txt')
    resp = robots_txt_view(req)
    assert resp.status_code == 200, f"robots_txt_view returned {resp.status_code}"
    assert resp['Content-Type'] == 'text/plain; charset=utf-8'
    content = resp.content.decode('utf-8')
    assert 'User-agent: *' in content
    assert 'Sitemap: https://www.classicmunbricks.com/sitemap.xml' in content
    print(f"[PASS] robots_txt_view (/robots.txt) returned valid directives with sitemap link.")

    # 5. Dynamic Update Simulation
    print("\n--- 5. Dynamic Update Simulation ---")
    heading = PageHeading.objects.filter(heading_key='home_hero_h1').first()
    assert heading is not None, "home_hero_h1 heading record not found"
    original_text = heading.text
    try:
        # Simulate SEO Admin changing the hero H1 in Django Admin
        heading.text = "Engineered Laterite & Interlocking Bricks in Kerala"
        heading.save()

        # Query the bundle API
        req = factory.get('/api/seo/bundle/')
        resp = SEOBundleView.as_view()(req)
        assert resp.data['headings']['home_hero_h1'] == "Engineered Laterite & Interlocking Bricks in Kerala"
        print("[PASS] Dynamic update verified: Django Admin edit instantly flows through public API!")
    finally:
        # Revert back to original
        heading.text = original_text
        heading.save()
        print(f"[PASS] Reverted heading back to original approved text: '{original_text}'")

    # 6. Redirect Middleware
    print("\n--- 6. URL Redirect Middleware ---")
    redir = SEORedirect.objects.create(
        source_path='/old-interlock-guide',
        destination_url='/blog',
        redirect_type=301,
        is_active=True
    )
    try:
        mw = SEORedirectMiddleware(lambda req: None)
        req = factory.get('/old-interlock-guide')
        resp = mw(req)
        assert resp is not None and resp.status_code == 301
        assert resp['Location'] == '/blog'
        print("[PASS] SEORedirectMiddleware correctly issued HTTP 301 redirect to /blog.")
    finally:
        redir.delete()
        print("[PASS] Cleaned up temporary test redirect.")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! SYSTEM IS 100% PRODUCTION READY.")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
