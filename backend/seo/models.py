import json
from urllib.parse import urlparse
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class SEOSiteSettings(models.Model):
    """
    Global SEO and site-wide metadata settings for Classic Mun Bricks.
    Singleton pattern ensures a single authoritative configuration record.
    """
    site_name = models.CharField(
        max_length=150,
        default="Classic Mun Bricks",
        help_text="Brand name used across search engine titles and social metadata."
    )
    site_title_suffix = models.CharField(
        max_length=100,
        default=" | Classic Mun Bricks",
        help_text="Default suffix appended to page meta titles (e.g. ' | Classic Mun Bricks')."
    )
    canonical_base_url = models.URLField(
        default="https://www.classicmunbricks.com",
        help_text="Production public website URL (without trailing slash), used for canonical URLs and sitemaps."
    )
    default_meta_description = models.TextField(
        default="Compressed laterite interlocking bricks manufactured for high-strength residential and commercial construction across Kerala and Tamil Nadu.",
        help_text="Default meta description fallback when a page does not define a custom description (150-160 characters recommended)."
    )
    default_og_image = models.ImageField(
        upload_to='seo/social/',
        blank=True,
        null=True,
        help_text="Default social preview image for Open Graph and Twitter cards (recommended: 1200x630 pixels)."
    )
    default_twitter_card = models.CharField(
        max_length=30,
        choices=[
            ('summary_large_image', 'Summary Card with Large Image (Recommended)'),
            ('summary', 'Standard Summary Card'),
        ],
        default='summary_large_image',
        help_text="Twitter/X card display format."
    )
    robots_allow_indexing = models.BooleanField(
        default=True,
        help_text="Master control: Allow search engines to index the website (sets index vs noindex)."
    )
    robots_allow_following = models.BooleanField(
        default=True,
        help_text="Master control: Allow search engines to follow links (sets follow vs nofollow)."
    )
    custom_robots_txt = models.TextField(
        blank=True,
        help_text="Optional custom robots.txt directives. If blank, standard secure directives will be generated automatically."
    )
    sitemap_enabled = models.BooleanField(
        default=True,
        help_text="Enable automatic public XML sitemap at /sitemap.xml."
    )

    # Organization Schema (JSON-LD) defaults
    org_legal_name = models.CharField(
        max_length=200,
        default="Classic Mun Bricks",
        help_text="Official business/legal entity name."
    )
    org_phone = models.CharField(
        max_length=50,
        default="+91 94471 23456",
        help_text="Official contact phone number."
    )
    org_email = models.EmailField(
        default="enquiries@classicmunbricks.com",
        help_text="Official customer contact email."
    )
    org_address_locality = models.CharField(
        max_length=150,
        default="Kodur, Malappuram",
        help_text="Plant/Office city or locality."
    )
    org_address_region = models.CharField(
        max_length=100,
        default="Kerala",
        help_text="State / Province."
    )
    org_postal_code = models.CharField(
        max_length=20,
        default="676504",
        help_text="Postal / PIN code."
    )
    org_address_country = models.CharField(
        max_length=10,
        default="IN",
        help_text="Two-letter ISO country code."
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'SEO Site Settings'
        verbose_name_plural = 'SEO Site Settings'

    def __str__(self):
        return f"{self.site_name} Global SEO Settings"

    def clean(self):
        # Enforce singleton
        if not self.pk and SEOSiteSettings.objects.exists():
            raise ValidationError(_("Only one SEO Site Settings record can exist."))
        if self.canonical_base_url:
            self.canonical_base_url = self.canonical_base_url.rstrip('/')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj = cls.objects.first()
        if not obj:
            obj = cls.objects.create()
        return obj

    @classmethod
    def load(cls):
        return cls.get_solo()



class PageSEO(models.Model):
    """
    Page-level SEO metadata, indexing controls, and social sharing tags.
    Every indexable public route maps to exactly one PageSEO record.
    """
    INDEX_DIRECTIVE_CHOICES = [
        ('index, follow', 'Index, Follow (Recommended for public pages)'),
        ('noindex, follow', 'Noindex, Follow (Do not index, but follow links)'),
        ('index, nofollow', 'Index, Nofollow (Index page, do not follow links)'),
        ('noindex, nofollow', 'Noindex, Nofollow (Exclude from search engines)'),
    ]

    SCHEMA_TYPE_CHOICES = [
        ('Auto', 'Auto-Generate Schema based on page type'),
        ('Organization', 'Organization / LocalBusiness'),
        ('AboutPage', 'AboutPage Schema'),
        ('ContactPage', 'ContactPage Schema'),
        ('CollectionPage', 'CollectionPage Schema (Projects Gallery)'),
        ('Blog', 'Blog Listing Schema'),
        ('None', 'None (Disable JSON-LD for this page)'),
    ]

    page_path = models.CharField(
        max_length=255,
        unique=True,
        help_text="Relative URL path of the page (e.g. '/', '/visit-us', '/projects', '/about-us', '/contact', '/blog')."
    )
    page_name = models.CharField(
        max_length=150,
        help_text="Human-readable page title for admin reference (e.g. 'Home Page', 'Visit Us')."
    )

    # Core Meta Tags
    meta_title = models.CharField(
        max_length=255,
        help_text="Search engine title tag. Recommended length: 50-60 characters."
    )
    meta_description = models.TextField(
        help_text="Meta description snippet for search results. Recommended length: 150-160 characters."
    )
    canonical_url = models.CharField(
        max_length=500,
        blank=True,
        default="",
        help_text="Custom canonical URL (e.g. 'https://www.classicmunbricks.com/projects'). If left blank, automatically derived from domain + path."
    )
    index_directive = models.CharField(
        max_length=30,
        choices=INDEX_DIRECTIVE_CHOICES,
        default='index, follow',
        help_text="Search engine crawler indexing instructions."
    )

    # SEO Supporting Content
    seo_content = models.TextField(
        blank=True,
        default="",
        help_text="Optional SEO supporting paragraph or introduction rendered in the page's designated SEO block."
    )

    # Social Media / Open Graph / Twitter
    og_title = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Open Graph title for WhatsApp, Facebook, LinkedIn. If blank, falls back to Meta Title."
    )
    og_description = models.TextField(
        blank=True,
        default="",
        help_text="Open Graph description. If blank, falls back to Meta Description."
    )
    og_image = models.ImageField(
        upload_to='seo/social/',
        blank=True,
        null=True,
        help_text="Page-specific social sharing banner (1200x630 pixels recommended). If blank, uses global default."
    )
    twitter_card = models.CharField(
        max_length=30,
        choices=[
            ('summary_large_image', 'Summary Large Image'),
            ('summary', 'Standard Summary'),
        ],
        default='summary_large_image',
        help_text="Twitter/X preview card presentation."
    )

    # Structured Data
    schema_type = models.CharField(
        max_length=50,
        choices=SCHEMA_TYPE_CHOICES,
        default='Auto',
        help_text="Schema.org structured data format for rich search results."
    )
    custom_schema_json = models.TextField(
        blank=True,
        default="",
        help_text="Optional custom Schema.org JSON-LD object (must be valid JSON). Overrides automated schema when provided."
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Controls whether this page's SEO overrides are active on the public frontend."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['page_path']
        verbose_name = 'Page SEO'
        verbose_name_plural = 'Page SEO'

    def __str__(self):
        return f"{self.page_name} ({self.page_path})"

    def clean(self):
        super().clean()
        # Normalize page path
        if self.page_path:
            p = self.page_path.strip()
            if not p.startswith('/'):
                p = '/' + p
            if len(p) > 1 and p.endswith('/'):
                p = p.rstrip('/')
            self.page_path = p

        # Validate custom schema JSON if provided
        if self.custom_schema_json and self.custom_schema_json.strip():
            try:
                parsed = json.loads(self.custom_schema_json)
                if not isinstance(parsed, (dict, list)):
                    raise ValidationError(_("Custom Schema must be a valid JSON object or array."))
            except json.JSONDecodeError as err:
                raise ValidationError(_(f"Invalid JSON in Custom Schema: {err}"))

    def get_effective_canonical(self, base_url="https://www.classicmunbricks.com"):
        if self.canonical_url and self.canonical_url.strip():
            return self.canonical_url.strip()
        clean_base = base_url.rstrip('/')
        clean_path = self.page_path if self.page_path == '/' else self.page_path.rstrip('/')
        return f"{clean_base}{clean_path}"


class PageHeading(models.Model):
    """
    Granular H1, H2, and H3 heading manager mapped to actual React component sections.
    Enables SEO team to optimize headlines and section titles directly from Django Admin.
    """
    TAG_CHOICES = [
        ('h1', 'H1 (Main Page Headline - Limit 1 per page)'),
        ('h2', 'H2 (Primary Section Heading)'),
        ('h3', 'H3 (Subsection / Card Heading)'),
    ]

    page = models.ForeignKey(
        PageSEO,
        on_delete=models.CASCADE,
        related_name='headings',
        help_text="The page where this heading is rendered."
    )
    heading_key = models.CharField(
        max_length=100,
        help_text="Unique programmatic key used by the React component (e.g. 'home_hero_h1', 'home_products_h2')."
    )
    section_label = models.CharField(
        max_length=150,
        help_text="Human-readable section title for the SEO specialist (e.g. 'Hero Section', 'Product Showcase Section')."
    )
    tag = models.CharField(
        max_length=10,
        choices=TAG_CHOICES,
        default='h2',
        help_text="HTML heading semantic tag level."
    )
    text = models.CharField(
        max_length=350,
        help_text="Heading text displayed on the website. Preserves responsive layout."
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order in the admin list."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Toggle heading override on/off."
    )

    class Meta:
        ordering = ['page__page_path', 'order', 'heading_key']
        unique_together = ('page', 'heading_key')
        verbose_name = 'Page Heading'
        verbose_name_plural = 'Page Headings'

    def __str__(self):
        return f"[{self.tag.upper()}] {self.section_label}: {self.text[:40]}"


class ImageSEO(models.Model):
    """
    Image alt text and accessibility management for core website photos and assets.
    """
    image_key = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique asset key (e.g. 'hero_slide_1', 'hero_slide_2', 'brick_groove', 'factory_step_1')."
    )
    label = models.CharField(
        max_length=150,
        help_text="Descriptive asset label (e.g. 'Hero Slide 1 - Sloped Ceiling Architecture')."
    )
    page_location = models.CharField(
        max_length=100,
        blank=True,
        default="",
        help_text="Page or section where this image appears (e.g. 'Home - Hero', 'Products Showcase')."
    )
    image_preview_url = models.CharField(
        max_length=500,
        blank=True,
        default="",
        help_text="Static asset URL or Cloudinary CDN link for image preview in Django Admin."
    )
    alt_text = models.CharField(
        max_length=255,
        help_text="Descriptive alternative text for search engines and screen readers."
    )
    is_decorative = models.BooleanField(
        default=False,
        help_text="If checked, renders empty alt='' attribute (for purely decorative visual elements)."
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['page_location', 'label']
        verbose_name = 'Image SEO'
        verbose_name_plural = 'Image SEO'

    def __str__(self):
        return f"{self.label} ({self.image_key})"


class SEORedirect(models.Model):
    """
    Managed URL redirect system to preserve backlinks and resolve legacy or outdated URLs.
    Supports HTTP 301 (Permanent) and HTTP 302 (Temporary) redirects.
    Includes loop prevention and open redirect protection.
    """
    REDIRECT_CHOICES = [
        (301, '301 Permanent Redirect (SEO Link Equity Preserved)'),
        (302, '302 Temporary Redirect'),
    ]

    source_path = models.CharField(
        max_length=255,
        unique=True,
        help_text="The incoming URL path to redirect from (e.g. '/factory-tour', '/products-list')."
    )
    destination_url = models.CharField(
        max_length=500,
        help_text="Destination URL (relative path e.g. '/visit-us' or full approved URL)."
    )
    redirect_type = models.PositiveIntegerField(
        choices=REDIRECT_CHOICES,
        default=301,
        help_text="HTTP redirect status code."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Enable or disable this redirect rule."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['source_path']
        verbose_name = 'URL Redirect'
        verbose_name_plural = 'URL Redirects'

    def __str__(self):
        return f"{self.source_path} → {self.destination_url} ({self.redirect_type})"

    def clean(self):
        super().clean()
        src = self.source_path.strip()
        dest = self.destination_url.strip()

        # Normalize source path
        if not src.startswith('/'):
            src = '/' + src
        if len(src) > 1 and src.endswith('/'):
            src = src.rstrip('/')
        self.source_path = src

        # Normalize destination
        if dest.startswith('/'):
            if len(dest) > 1 and dest.endswith('/'):
                dest = dest.rstrip('/')
        self.destination_url = dest

        # Disallow loop: source cannot equal destination
        if src == dest:
            raise ValidationError(_("Source path and destination URL cannot be identical (causes infinite redirect loop)."))

        # Disallow redirecting homepage to avoid taking down whole site
        if src == '/':
            raise ValidationError(_("Cannot redirect the root homepage '/'."))

        # Disallow redirecting system endpoints
        for prefix in ['/admin', '/api', '/static', '/media']:
            if src.startswith(prefix):
                raise ValidationError(_(f"Cannot create redirect for protected system path '{src}'."))

        # Prevent open redirects: if destination is absolute URL, restrict to approved domains
        if dest.startswith(('http://', 'https://')):
            parsed = urlparse(dest)
            allowed_hosts = ['classicmunbricks.com', 'www.classicmunbricks.com', 'classic-mun-bricks.onrender.com', 'localhost', '127.0.0.1']
            if parsed.hostname and not any(parsed.hostname == h or parsed.hostname.endswith('.' + h) for h in allowed_hosts):
                raise ValidationError(_(f"External redirect to '{parsed.hostname}' is prohibited to prevent open redirect vulnerabilities."))
