from django.contrib import admin
from django.utils.html import format_html
from .models import SEOSiteSettings, PageSEO, PageHeading, ImageSEO, SEORedirect


class PageHeadingInline(admin.TabularInline):
    model = PageHeading
    extra = 0
    fields = ('heading_key', 'section_label', 'tag', 'text', 'order', 'is_active')
    ordering = ('order', 'heading_key')
    classes = ('collapse',)
    verbose_name = "Page Heading"
    verbose_name_plural = "Page Headings (H1, H2, H3)"


@admin.register(PageSEO)
class PageSEOAdmin(admin.ModelAdmin):
    list_display = (
        'page_name',
        'page_path',
        'meta_title_preview',
        'index_directive',
        'heading_count',
        'is_active',
        'updated_at',
    )
    list_filter = ('index_directive', 'is_active')
    search_fields = ('page_name', 'page_path', 'meta_title', 'meta_description')
    inlines = [PageHeadingInline]
    save_on_top = True

    fieldsets = (
        ('PAGE IDENTIFICATION', {
            'fields': (
                'page_name',
                'page_path',
                'is_active',
            ),
            'description': 'Target page route (e.g., / for Home, /visit-us for Visit Us, /projects for Projects).'
        }),
        ('SEARCH ENGINE METADATA', {
            'fields': (
                'meta_title',
                'meta_description',
                'canonical_url',
                'index_directive',
            ),
            'description': (
                '<strong>Meta Title:</strong> 50–60 characters recommended. Appears in browser tab and search results.<br>'
                '<strong>Meta Description:</strong> 150–160 characters recommended. Concise search result snippet.<br>'
                '<strong>Canonical URL:</strong> Leave blank to automatically use official domain + page path.'
            )
        }),
        ('SEO SUPPORTING CONTENT', {
            'fields': ('seo_content',),
            'classes': ('collapse',),
            'description': 'Optional introductory or supporting SEO paragraph rendered in the designated page block.'
        }),
        ('SOCIAL MEDIA SHARING (OPEN GRAPH & TWITTER)', {
            'fields': (
                'og_title',
                'og_description',
                'og_image',
                'twitter_card',
            ),
            'description': 'Preview title, description, and banner image used when sharing on WhatsApp, Facebook, LinkedIn, Twitter/X.'
        }),
        ('STRUCTURED DATA (SCHEMA.ORG JSON-LD)', {
            'fields': (
                'schema_type',
                'custom_schema_json',
            ),
            'classes': ('collapse',),
            'description': 'Select automated Schema or enter custom validated JSON-LD markup for rich Google snippets.'
        }),
    )

    def meta_title_preview(self, obj):
        length = len(obj.meta_title)
        badge_color = "#28a745" if 40 <= length <= 65 else "#ffc107" if length <= 75 else "#dc3545"
        return format_html(
            '<span>{}</span> <span style="display:inline-block; margin-left:6px; padding:2px 6px; font-size:11px; background:{}; color:#fff; border-radius:10px;">{} chars</span>',
            obj.meta_title[:50] + ('...' if length > 50 else ''),
            badge_color,
            length
        )
    meta_title_preview.short_description = 'Meta Title'

    def heading_count(self, obj):
        count = obj.headings.count()
        return format_html('<strong>{} headings</strong>', count)
    heading_count.short_description = 'Headings'


@admin.register(PageHeading)
class PageHeadingAdmin(admin.ModelAdmin):
    list_display = (
        'text_preview',
        'tag_badge',
        'section_label',
        'page_link',
        'heading_key',
        'is_active',
    )
    list_filter = ('page', 'tag', 'is_active')
    search_fields = ('text', 'section_label', 'heading_key')
    list_editable = ('is_active',)
    ordering = ('page__page_path', 'order', 'heading_key')

    def text_preview(self, obj):
        return obj.text
    text_preview.short_description = 'Heading Text'

    def tag_badge(self, obj):
        colors = {'h1': '#d9534f', 'h2': '#0275d8', 'h3': '#5bc0de'}
        return format_html(
            '<span style="padding:3px 8px; font-size:11px; font-weight:bold; background:{}; color:#fff; border-radius:4px;">{}</span>',
            colors.get(obj.tag, '#6c757d'),
            obj.tag.upper()
        )
    tag_badge.short_description = 'Tag'

    def page_link(self, obj):
        return obj.page.page_name
    page_link.short_description = 'Page'


@admin.register(ImageSEO)
class ImageSEOAdmin(admin.ModelAdmin):
    list_display = (
        'image_thumbnail',
        'label',
        'page_location',
        'alt_text',
        'image_key',
        'is_decorative',
        'updated_at',
    )
    list_filter = ('page_location', 'is_decorative')
    search_fields = ('label', 'alt_text', 'image_key', 'page_location')
    list_editable = ('alt_text',)

    def image_thumbnail(self, obj):
        if obj.image_preview_url:
            return format_html(
                '<img src="{}" style="height:38px; width:56px; object-fit:cover; border-radius:4px; border:1px solid #ccc;" alt="{}" />',
                obj.image_preview_url,
                obj.alt_text or obj.label
            )
        return format_html('<span style="color:#999; font-size:11px;">(No preview)</span>')
    image_thumbnail.short_description = 'Thumbnail'

    def alt_text_preview(self, obj):
        if obj.is_decorative:
            return format_html('<em style="color:#888;">(Marked decorative: alt="")</em>')
        return obj.alt_text
    alt_text_preview.short_description = 'Alt Text'


@admin.register(SEORedirect)
class SEORedirectAdmin(admin.ModelAdmin):
    list_display = (
        'source_path',
        'arrow_indicator',
        'destination_url',
        'redirect_type_badge',
        'is_active',
        'created_at',
    )
    list_filter = ('redirect_type', 'is_active')
    search_fields = ('source_path', 'destination_url')
    list_editable = ('is_active',)

    def arrow_indicator(self, obj):
        return '→'
    arrow_indicator.short_description = ''

    def redirect_type_badge(self, obj):
        color = "#28a745" if obj.redirect_type == 301 else "#ffc107"
        return format_html(
            '<span style="padding:2px 6px; font-size:11px; background:{}; color:#fff; border-radius:4px;">{}</span>',
            color,
            obj.get_redirect_type_display()
        )
    redirect_type_badge.short_description = 'Type'


@admin.register(SEOSiteSettings)
class SEOSiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('BRAND IDENTITY & DEFAULT METADATA', {
            'fields': (
                'site_name',
                'site_title_suffix',
                'canonical_base_url',
                'default_meta_description',
            ),
            'description': 'Global default branding and fallback search engine description.'
        }),
        ('GLOBAL SOCIAL MEDIA PREVIEW', {
            'fields': (
                'default_og_image',
                'default_twitter_card',
            ),
            'description': 'Default social sharing banner image when a page does not supply its own.'
        }),
        ('SEARCH ENGINE CRAWLER DIRECTIVES', {
            'fields': (
                'robots_allow_indexing',
                'robots_allow_following',
                'custom_robots_txt',
                'sitemap_enabled',
            ),
            'description': 'Global indexing rules and automated sitemap/robots generation.'
        }),
        ('ORGANIZATION SCHEMA (JSON-LD STRUCTURED DATA)', {
            'fields': (
                'org_legal_name',
                'org_phone',
                'org_email',
                'org_address_locality',
                'org_address_region',
                'org_postal_code',
                'org_address_country',
            ),
            'description': 'Official business information injected into Google Knowledge Graph JSON-LD schema.'
        }),
    )

    def has_add_permission(self, request):
        # Singleton: allow add only if no instance exists
        if SEOSiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False
