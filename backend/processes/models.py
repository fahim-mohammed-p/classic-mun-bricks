from django.db import models


class FactoryProcess(models.Model):
    """
    Model representing individual steps in the factory manufacturing tour.
    Designed for read-only delivery and future content management.
    """
    step_number = models.PositiveIntegerField(
        unique=True,
        help_text="Sequence order of the manufacturing process (e.g. 1 for Process 01)"
    )
    title = models.CharField(
        max_length=200,
        help_text="Process title, e.g. 'Initial Material Processing'"
    )
    short_description = models.TextField(
        help_text="Factual description of this manufacturing stage"
    )
    image = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Image asset filename or static path"
    )
    video = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Video asset filename or static path"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Toggle visibility in the virtual factory tour"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['step_number']
        verbose_name = 'Factory Process'
        verbose_name_plural = 'Factory Processes'

    def __str__(self):
        return f"{self.step_number:02d}. {self.title}"


class CompanyProfile(models.Model):
    """
    Model representing core company details, verified project metrics,
    and regional presence stats for Classic Mun Bricks.
    """
    company_name = models.CharField(max_length=200, default="Classic Mun Bricks")
    started_year = models.PositiveIntegerField(default=2006, help_text="Company founding year (2006)")
    years_experience = models.PositiveIntegerField(default=20, help_text="Years of manufacturing experience (20 years)")
    about_short = models.TextField(
        default="Since 2006, Classic Mun Bricks has served projects across Kerala and Tamil Nadu."
    )
    about_long = models.TextField(
        default="Classic Mun Bricks has been serving construction projects across Kerala and Tamil Nadu for 20 years. Our experience comes from thousands of completed projects across both states."
    )
    tamil_nadu_projects = models.PositiveIntegerField(
        default=1000,
        help_text="Verified completed projects count in Tamil Nadu (1K+)"
    )
    kerala_projects = models.PositiveIntegerField(
        default=1500,
        help_text="Verified completed projects count in Kerala (1.5K+)"
    )
    total_projects = models.PositiveIntegerField(
        default=2500,
        help_text="Combined verified completed projects across Kerala + Tamil Nadu (2.5K+)"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Company Profile'
        verbose_name_plural = 'Company Profiles'

    def __str__(self):
        return f"{self.company_name} (2.5K+ Projects)"


