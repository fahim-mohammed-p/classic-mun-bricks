from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class BlogPost(models.Model):
    """
    Model representing editorial articles and SEO insights for Classic Mun Bricks.
    Supports draft and published statuses, automated publication timestamps,
    safe slug generation, and customizable SEO metadata.
    """

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'

    title = models.CharField(
        max_length=250,
        help_text="Article title (required, up to 250 characters)"
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        help_text="SEO-friendly URL identifier. Auto-generated from title if left blank."
    )
    excerpt = models.CharField(
        max_length=500,
        blank=True,
        default="",
        help_text="Brief summary for listings, cards, and previews (recommended 150-300 characters)"
    )
    content = models.TextField(
        help_text="Main article content in plain text or structured paragraphs."
    )
    featured_image = models.ImageField(
        upload_to='blog/',
        blank=True,
        null=True,
        help_text="Optional featured header/card image. Blog works completely without an image."
    )
    author_name = models.CharField(
        max_length=120,
        blank=True,
        default="Classic Mun Bricks",
        help_text="Author name or entity (defaults to 'Classic Mun Bricks')"
    )
    seo_title = models.CharField(
        max_length=250,
        blank=True,
        default="",
        help_text="Optional custom SEO title tag. If left blank, the main title will be used."
    )
    meta_description = models.CharField(
        max_length=200,
        blank=True,
        default="",
        help_text="Optional SEO meta description for search engines (recommended ~160 characters)"
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
        help_text="Only published posts are visible on the public website."
    )
    published_at = models.DateTimeField(
        blank=True,
        null=True,
        db_index=True,
        help_text="Official publication date and time. Set automatically on first publish if left blank."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the post was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the post was last edited"
    )

    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'

    def __str__(self):
        return f"{self.title} [{self.get_status_display()}]"

    def clean(self):
        super().clean()
        if not self.author_name or not self.author_name.strip():
            self.author_name = "Classic Mun Bricks"

    def save(self, *args, **kwargs):
        # 1. Handle auto-slugification and collision resolution
        if not self.slug or not self.slug.strip():
            base_slug = slugify(self.title) or 'article'
            candidate_slug = base_slug[:240]
            counter = 1

            slug_query = BlogPost.objects.filter(slug=candidate_slug)
            if self.pk:
                slug_query = slug_query.exclude(pk=self.pk)

            while slug_query.exists():
                candidate_slug = f"{base_slug[:230]}-{counter}"
                counter += 1
                slug_query = BlogPost.objects.filter(slug=candidate_slug)
                if self.pk:
                    slug_query = slug_query.exclude(pk=self.pk)

            self.slug = candidate_slug
        else:
            # Normalize user-provided slug
            self.slug = slugify(self.slug)[:255]

        # 2. Automated publication timestamp logic
        # If transitioning to Published and published_at is empty, assign current time
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()

        # Fallback author if empty
        if not self.author_name or not self.author_name.strip():
            self.author_name = "Classic Mun Bricks"

        super().save(*args, **kwargs)
