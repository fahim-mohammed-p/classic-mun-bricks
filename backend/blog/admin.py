from django.contrib import admin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'status',
        'author_name',
        'published_at',
        'created_at'
    )
    list_filter = (
        'status',
        'published_at',
        'created_at'
    )
    search_fields = (
        'title',
        'excerpt',
        'content',
        'author_name'
    )
    prepopulated_fields = {
        'slug': ('title',)
    }
    readonly_fields = (
        'created_at',
        'updated_at'
    )
    date_hierarchy = 'published_at'
    ordering = ('-published_at', '-created_at')

    fieldsets = (
        ('CONTENT', {
            'fields': (
                'title',
                'slug',
                'excerpt',
                'content',
                'featured_image',
                'featured_image_alt',
            ),
            'description': 'Primary editorial text, summary, and optional featured media.'
        }),
        ('SEO & SOCIAL MEDIA', {
            'fields': (
                'h1_override',
                'seo_title',
                'meta_description',
                'canonical_url',
                'og_title',
                'og_description',
                'index_directive',
            ),
            'description': 'Search engine title, custom H1, meta description, canonical URL, and Open Graph sharing tags.'
        }),
        ('PUBLISHING', {
            'fields': (
                'author_name',
                'status',
                'published_at',
            ),
            'description': 'Publication status. Articles marked as Published become visible immediately on the public website.'
        }),
        ('SYSTEM', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
            'description': 'Automated database audit timestamps.'
        }),
    )
