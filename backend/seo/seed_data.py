import os
import django

def seed_seo_data():
    from seo.models import SEOSiteSettings, PageSEO, PageHeading, ImageSEO

    print("--- Seeding SEO Site Settings ---")
    settings = SEOSiteSettings.get_solo()
    settings.site_name = "Classic Mun Bricks"
    settings.site_title_suffix = " | Classic Mun Bricks"
    settings.canonical_base_url = "https://www.classicmunbricks.com"
    settings.default_meta_description = "Compressed laterite interlocking bricks manufactured for high-strength residential and commercial construction across Kerala and Tamil Nadu."
    settings.org_legal_name = "Classic Mun Bricks"
    settings.org_phone = "+91 94471 23456"
    settings.org_email = "enquiries@classicmunbricks.com"
    settings.org_address_locality = "Kodur, Malappuram"
    settings.org_address_region = "Kerala"
    settings.org_postal_code = "676504"
    settings.org_address_country = "IN"
    settings.robots_allow_indexing = True
    settings.robots_allow_following = True
    settings.sitemap_enabled = True
    settings.save()
    print("✓ SEOSiteSettings configured")

    PAGES = [
        {
            'path': '/',
            'name': 'Home Page',
            'title': 'Classic Mun Bricks | Strong Beyond Any Bricks',
            'desc': 'Compressed soil bricks made from laterite soil. Strong Beyond Any Bricks.',
            'canonical': 'https://www.classicmunbricks.com/',
            'schema': 'Organization',
            'headings': [
                ('home_hero_h1', 'Hero Main Headline', 'h1', 'Strong Beyond Any Bricks', 1),
                ('home_company_intro_h2', 'Company Intro Section', 'h2', 'Building with Natural Strength & Precision', 2),
                ('home_company_exp_h2', 'Company Experience Section', 'h2', 'Serving Construction Across Kerala & Tamil Nadu', 3),
                ('home_why_choose_h2', 'Why Choose Us Section', 'h2', 'Engineered for Unmatched Durability', 4),
                ('home_products_h2', 'Product Showcase Section', 'h2', 'Built for Every Construction Need', 5),
                ('home_gallery_h2', 'Home Gallery Section', 'h2', 'Our Gallery', 6),
                ('home_final_cta_h2', 'Final CTA Section', 'h2', 'Ready to Build with Strength & Precision?', 7),
            ]
        },
        {
            'path': '/visit-us',
            'name': 'Visit Us (Virtual Factory Tour)',
            'title': 'Virtual Factory Tour | Classic Mun Bricks',
            'desc': 'Explore our automated manufacturing plant in Kerala. Discover how raw laterite soil is engineered into durable interlocking bricks.',
            'canonical': 'https://www.classicmunbricks.com/visit-us',
            'schema': 'Auto',
            'headings': [
                ('visitus_hero_h1', 'Factory Hero Section', 'h1', 'Step Inside Our Factory', 1),
                ('visitus_intro_h2', 'Authenticity Intro Section', 'h2', 'From Raw Material to Form', 2),
                ('visitus_outro_h2', 'Tour Outro Section', 'h2', 'See Where Our Products Take Shape', 3),
            ]
        },
        {
            'path': '/projects',
            'name': 'Projects Route & Gallery',
            'title': 'Verified Projects Across Kerala & Tamil Nadu | Classic Mun Bricks',
            'desc': 'Explore verified completed residential and commercial projects across Kerala and Tamil Nadu built with Classic Mun Bricks.',
            'canonical': 'https://www.classicmunbricks.com/projects',
            'schema': 'CollectionPage',
            'headings': [
                ('projects_hero_h1', 'Projects Hero Section', 'h1', 'Verified Completed Projects Across Kerala & Tamil Nadu', 1),
                ('projects_cta_h2', 'Projects CTA Section', 'h2', 'Plan Your Project with Classic Mun Bricks', 2),
            ]
        },
        {
            'path': '/about-us',
            'name': 'About Us',
            'title': 'About Us | Classic Mun Bricks',
            'desc': 'Since 2006, Classic Mun Bricks has pioneered interlocking laterite bricks, completing 2,500+ projects across Kerala and Tamil Nadu.',
            'canonical': 'https://www.classicmunbricks.com/about-us',
            'schema': 'AboutPage',
            'headings': [
                ('about_hero_h1', 'About Hero Section', 'h1', 'Crafting Strong, Reliable Building Materials for 20 Years', 1),
                ('about_quality_h2', 'Quality Philosophy Section', 'h2', 'Quality Rooted in Natural Soil', 2),
                ('about_proven_h2', 'Regional Presence Section', 'h2', 'Proven Across Two States', 3),
                ('about_cta_h2', 'About CTA Section', 'h2', 'Experience the Classic Mun Difference', 4),
            ]
        },
        {
            'path': '/contact',
            'name': 'Contact Us',
            'title': 'Contact Us | Classic Mun Bricks',
            'desc': 'Get in touch with Classic Mun Bricks for product inquiries, bulk requirements, and free quotes across Kerala and Tamil Nadu.',
            'canonical': 'https://www.classicmunbricks.com/contact',
            'schema': 'ContactPage',
            'headings': [
                ('contact_hero_h1', 'Contact Hero Section', 'h1', 'Direct Support & Inquiries', 1),
                ('contact_quote_h2', 'Quote Form Section', 'h2', 'Request a Free Quote', 2),
                ('contact_plant_office_h3', 'Plant & Office Details', 'h3', 'Plant & Office', 3),
                ('contact_instant_h3', 'Instant Contact Details', 'h3', 'Instant Inquiries', 4),
                ('contact_immediate_h3', 'Call Support CTA', 'h3', 'Need Immediate Assistance?', 5),
            ]
        },
        {
            'path': '/blog',
            'name': 'Blog & Construction Insights',
            'title': 'Construction Insights & Articles | Classic Mun Bricks',
            'desc': 'Read expert guides, architectural tips, and laterite brick masonry practices from Classic Mun Bricks.',
            'canonical': 'https://www.classicmunbricks.com/blog',
            'schema': 'Blog',
            'headings': [
                ('blog_hero_h1', 'Blog Hero Section', 'h1', 'Building Knowledge. Sharing Experience.', 1),
                ('blog_insights_h2', 'Empty/Featured Section', 'h2', 'Insights Coming Soon', 2),
            ]
        },
    ]

    print("\n--- Seeding PageSEO & PageHeadings ---")
    for pdata in PAGES:
        page_obj, _ = PageSEO.objects.update_or_create(
            page_path=pdata['path'],
            defaults={
                'page_name': pdata['name'],
                'meta_title': pdata['title'],
                'meta_description': pdata['desc'],
                'canonical_url': pdata['canonical'],
                'schema_type': pdata['schema'],
                'index_directive': 'index, follow',
                'is_active': True,
            }
        )
        print(f"✓ Configured PageSEO: {page_obj.page_name} ({page_obj.page_path})")

        for hkey, label, tag, text, order in pdata['headings']:
            PageHeading.objects.update_or_create(
                page=page_obj,
                heading_key=hkey,
                defaults={
                    'section_label': label,
                    'tag': tag,
                    'text': text,
                    'order': order,
                    'is_active': True,
                }
            )
            print(f"    - [{tag.upper()}] {hkey}: {text}")

    print("\n--- Seeding ImageSEO ---")
    IMAGES = [
        ('hero_slide_1', 'Hero Slide 1 - Sloped Ceiling Architecture', 'Home - Hero', '/hero-slide-1.webp', 'Classic Mun Bricks authentic laterite brick architecture with sloped wooden ceiling', False),
        ('hero_slide_2', 'Hero Slide 2 - Modern Living Room Hall', 'Home - Hero', '/hero-slide-2.webp', 'Spacious modern home interior with authentic laterite brick feature wall and staircase', False),
        ('hero_slide_3', 'Hero Slide 3 - Courtyard Patio & Swing', 'Home - Hero', '/hero-slide-3.webp', 'Contemporary courtyard patio with authentic laterite brickwork and wooden swing', False),
        ('brick_groove', 'Product - Interlocking Laterite Soil Brick', 'Products Showcase', '/brick-groove.png', 'Classic Mun Bricks premium interlocking laterite soil brick', False),
        ('brick_lock', 'Product - Solid Laterite Construction Brick', 'Products Showcase', '/brick-lock.png', 'Classic Mun Bricks high-density solid laterite construction brick', False),
        ('factory_tour_01', 'Factory Stage 01 - Material Processing', 'Visit Us - Factory', '/01-material-processing.jpg', 'Classic Mun Bricks initial laterite soil processing and screening', False),
        ('factory_tour_06', 'Factory Stage 06 - Brick Forming Press', 'Visit Us - Factory', '/06-brick-forming.jpg', 'Automated hydraulic brick pressing into precise interlocking shape', False),
    ]

    for key, label, loc, preview, alt, decor in IMAGES:
        ImageSEO.objects.update_or_create(
            image_key=key,
            defaults={
                'label': label,
                'page_location': loc,
                'image_preview_url': preview,
                'alt_text': alt,
                'is_decorative': decor,
            }
        )
        print(f"✓ Configured ImageSEO: {key} -> {alt[:40]}...")

    print("\nSEO Data Seeding Complete!")


if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    seed_seo_data()
