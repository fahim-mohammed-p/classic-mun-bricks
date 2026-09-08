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
            ),
            'description': 'Primary editorial text, summary, and optional featured media.'
        }),
        ('SEO', {
            'fields': (
                'seo_title',
                'meta_description',
            ),
            'description': 'Search engine metadata. If left blank, defaults are derived from the article content.'
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
