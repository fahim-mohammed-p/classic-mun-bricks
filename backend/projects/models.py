from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify


class State(models.Model):
    """
    Indian State or Union Territory master record.
    """
    name = models.CharField(max_length=100, unique=True, help_text="Official State / UT name")
    code = models.CharField(max_length=10, blank=True, help_text="State code (e.g., KL, TN, KA)")

    class Meta:
        ordering = ['name']
        verbose_name = 'State'
        verbose_name_plural = 'States'

    def __str__(self):
        return self.name


class District(models.Model):
    """
    Official Indian District master record with geographic centroid coordinates.
    Used for searchable location selection in Django Admin.
    """
    name = models.CharField(max_length=100, help_text="Official district name")
    state = models.ForeignKey(
        State,
        on_delete=models.CASCADE,
        related_name='districts',
        help_text="State / UT this district belongs to"
    )
    latitude = models.FloatField(
        help_text="Centroid latitude in decimal degrees (e.g. 11.0510)"
    )
    longitude = models.FloatField(
        help_text="Centroid longitude in decimal degrees (e.g. 76.0711)"
    )
    slug = models.SlugField(max_length=120, blank=True, db_index=True)

    class Meta:
        unique_together = ('name', 'state')
        ordering = ['name']
        verbose_name = 'District'
        verbose_name_plural = 'Districts'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{self.state.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        # District Display Format required by Django Admin: District — State
        return f"{self.name} — {self.state.name}"


class ProjectLocation(models.Model):
    """
    Active Classic Mun Bricks project location on the geographic Project Route.
    Enforces district-level uniqueness: one district corresponds to one Project Route node.
    """
    district = models.OneToOneField(
        District,
        on_delete=models.PROTECT,
        related_name='project_location',
        help_text="Select a district from the India Master Data (Searchable / Autocomplete)"
    )
    is_factory_hub = models.BooleanField(
        default=False,
        help_text="Check if this location is the automated manufacturing plant / HQ"
    )
    hub_label = models.CharField(
        max_length=100,
        blank=True,
        default="Plant & HQ (Kodur)",
        help_text="Badge label for factory hub (e.g. 'Plant & HQ (Kodur)')"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Controls visibility on the public website Project Route"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Sort order in the journey sequence"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'district__name']
        verbose_name = 'Project Location'
        verbose_name_plural = 'Project Locations'

    def clean(self):
        super().clean()
        if hasattr(self, 'district') and self.district:
            if self.district.latitude is None or self.district.longitude is None:
                raise ValidationError(
                    f"Selected district '{self.district.name}' is missing geographic coordinates. "
                    "Please ensure latitude and longitude are specified."
                )

    def __str__(self):
        return f"{self.district.name} ({self.district.state.name})"


class ProjectImage(models.Model):
    """
    Project photograph belonging to an active ProjectLocation.
    Supports many images under a single district.
    """
    location = models.ForeignKey(
        ProjectLocation,
        on_delete=models.CASCADE,
        related_name='images',
        help_text="District location this project photo belongs to"
    )
    image = models.ImageField(
        upload_to='projects/gallery/',
        help_text="Upload high-resolution project photograph"
    )
    caption = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional descriptive caption or label"
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Dedicated SEO alternative text. If blank, caption is used as alt text."
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order in the location gallery"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Project Image'
        verbose_name_plural = 'Project Images'

    def __str__(self):
        return f"Image #{self.id} for {self.location.district.name}"
