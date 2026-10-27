import json
from rest_framework import serializers
from .models import SEOSiteSettings, PageSEO, PageHeading, ImageSEO, SEORedirect


class SEOSiteSettingsSerializer(serializers.ModelSerializer):
    default_og_image = serializers.SerializerMethodField()
    organization_schema = serializers.SerializerMethodField()

    class Meta:
        model = SEOSiteSettings
        fields = [
            'site_name',
            'site_title_suffix',
            'canonical_base_url',
            'default_meta_description',
            'default_og_image',
            'default_twitter_card',
            'robots_allow_indexing',
            'robots_allow_following',
            'sitemap_enabled',
            'organization_schema',
        ]

    def get_default_og_image(self, obj):
        if not obj.default_og_image:
            return f"{obj.canonical_base_url}/logo.png"
        try:
            url = obj.default_og_image.url
            if url.startswith(('http://', 'https://')):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return f"{obj.canonical_base_url}{url}"
        except Exception:
            return f"{obj.canonical_base_url}/logo.png"

    def get_organization_schema(self, obj):
        return {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": obj.site_name,
            "legalName": obj.org_legal_name,
            "url": obj.canonical_base_url,
            "logo": f"{obj.canonical_base_url}/logo.png",
            "description": obj.default_meta_description,
            "telephone": obj.org_phone,
            "email": obj.org_email,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": obj.org_address_locality,
                "addressLocality": obj.org_address_locality,
                "addressRegion": obj.org_address_region,
                "postalCode": obj.org_postal_code,
                "addressCountry": obj.org_address_country
            },
            "priceRange": "$$",
            "areaServed": ["Kerala", "Tamil Nadu"]
        }


class PageSEOSerializer(serializers.ModelSerializer):
    canonical_url = serializers.SerializerMethodField()
    og_title = serializers.SerializerMethodField()
    og_description = serializers.SerializerMethodField()
    og_image = serializers.SerializerMethodField()
    schema_markup = serializers.SerializerMethodField()
    headings = serializers.SerializerMethodField()

    class Meta:
        model = PageSEO
        fields = [
            'page_path',
            'page_name',
            'meta_title',
            'meta_description',
            'canonical_url',
            'index_directive',
            'seo_content',
            'og_title',
            'og_description',
            'og_image',
            'twitter_card',
            'schema_markup',
            'headings',
            'updated_at',
        ]

    def _get_site_settings(self):
        return SEOSiteSettings.get_solo()

    def get_canonical_url(self, obj):
        settings = self._get_site_settings()
        return obj.get_effective_canonical(settings.canonical_base_url)

    def get_og_title(self, obj):
        if obj.og_title and obj.og_title.strip():
            return obj.og_title.strip()
        return obj.meta_title

    def get_og_description(self, obj):
        if obj.og_description and obj.og_description.strip():
            return obj.og_description.strip()
        return obj.meta_description

    def get_og_image(self, obj):
        settings = self._get_site_settings()
        if obj.og_image:
            try:
                url = obj.og_image.url
                if url.startswith(('http://', 'https://')):
                    return url
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(url)
                return f"{settings.canonical_base_url}{url}"
            except Exception:
                pass
        # Fallback to site settings default og image
        return SEOSiteSettingsSerializer(settings, context=self.context).data['default_og_image']

    def get_schema_markup(self, obj):
        # 1. Custom schema override if defined
        if obj.custom_schema_json and obj.custom_schema_json.strip():
            try:
                return json.loads(obj.custom_schema_json)
            except Exception:
                pass

        settings = self._get_site_settings()
        base_url = settings.canonical_base_url
        page_url = obj.get_effective_canonical(base_url)

        # 2. Automated schema based on page type
        if obj.schema_type == 'None':
            return None

        if obj.schema_type in ('Auto', 'Organization') and obj.page_path == '/':
            return {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "LocalBusiness",
                        "@id": f"{base_url}/#organization",
                        "name": settings.site_name,
                        "url": base_url,
                        "logo": f"{base_url}/logo.png",
                        "description": obj.meta_description,
                        "telephone": settings.org_phone,
                        "email": settings.org_email,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": settings.org_address_locality,
                            "addressRegion": settings.org_address_region,
                            "postalCode": settings.org_postal_code,
                            "addressCountry": settings.org_address_country
                        }
                    },
                    {
                        "@type": "WebSite",
                        "@id": f"{base_url}/#website",
                        "url": base_url,
                        "name": settings.site_name,
                        "publisher": {"@id": f"{base_url}/#organization"}
                    }
                ]
            }

        if obj.schema_type in ('Auto', 'AboutPage') and obj.page_path == '/about-us':
            return {
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": obj.meta_title,
                "description": obj.meta_description,
                "url": page_url,
                "publisher": {
                    "@type": "Organization",
                    "name": settings.site_name,
                    "url": base_url
                }
            }

        if obj.schema_type in ('Auto', 'ContactPage') and obj.page_path == '/contact':
            return {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": obj.meta_title,
                "description": obj.meta_description,
                "url": page_url,
                "mainEntity": {
                    "@type": "LocalBusiness",
                    "name": settings.site_name,
                    "telephone": settings.org_phone,
                    "email": settings.org_email,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": settings.org_address_locality,
                        "addressRegion": settings.org_address_region,
                        "addressCountry": settings.org_address_country
                    }
                }
            }

        if obj.schema_type in ('Auto', 'CollectionPage') and obj.page_path == '/projects':
            return {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": obj.meta_title,
                "description": obj.meta_description,
                "url": page_url
            }

        # Default Breadcrumb / WebPage schema
        return {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": obj.meta_title,
            "description": obj.meta_description,
            "url": page_url
        }

    def get_headings(self, obj):
        headings_dict = {}
        for h in obj.headings.filter(is_active=True).order_by('order'):
            headings_dict[h.heading_key] = h.text
        return headings_dict


class ImageSEOSerializer(serializers.ModelSerializer):
    effective_alt = serializers.SerializerMethodField()

    class Meta:
        model = ImageSEO
        fields = [
            'image_key',
            'label',
            'page_location',
            'image_preview_url',
            'alt_text',
            'effective_alt',
            'is_decorative',
        ]

    def get_effective_alt(self, obj):
        return "" if obj.is_decorative else obj.alt_text


class SEORedirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEORedirect
        fields = ['source_path', 'destination_url', 'redirect_type']
