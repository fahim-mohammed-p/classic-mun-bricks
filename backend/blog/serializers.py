from rest_framework import serializers
from .models import BlogPost


class BlogPostListSerializer(serializers.ModelSerializer):
    """
    Compact read-only serializer for public blog post cards/listings.
    """
    featured_image = serializers.ImageField(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'featured_image',
            'author_name',
            'published_at',
        ]
        read_only_fields = fields


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """
    Complete read-only serializer for full article viewing and SEO metadata.
    """
    featured_image = serializers.ImageField(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'featured_image',
            'featured_image_alt',
            'author_name',
            'seo_title',
            'meta_description',
            'h1_override',
            'canonical_url',
            'og_title',
            'og_description',
            'index_directive',
            'published_at',
            'updated_at',
        ]
        read_only_fields = fields
