from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer


class BlogPostListView(generics.ListAPIView):
    """
    Public read-only API view returning strictly published blog posts.
    Drafts are filtered out at the queryset level.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = BlogPostListSerializer
    pagination_class = None  # Clean array response for frontend consumption

    def get_queryset(self):
        return BlogPost.objects.filter(
            status=BlogPost.Status.PUBLISHED
        ).order_by('-published_at', '-created_at')


class BlogPostDetailView(generics.RetrieveAPIView):
    """
    Public read-only API view returning full details of a single published blog post by slug.
    Draft posts or non-existent slugs return HTTP 404 Not Found.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        # Enforce that only published articles are retrievable; drafts return 404 automatically
        return BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED)
