from django.db import models


class ContactEnquiry(models.Model):
    """
    Model storing customer contact and requirements enquiries submitted via website form.
    Database-first storage ensures no customer enquiry is lost if SMTP fails.
    """
    ENQUIRY_TYPE_CHOICES = [
        ('General Enquiry', 'General Enquiry'),
        ('Product Enquiry', 'Product Enquiry'),
        ('Project Requirement', 'Project Requirement'),
        ('Bulk Requirement', 'Bulk Requirement'),
        ('Other', 'Other'),
    ]

    name = models.CharField(
        max_length=200,
        help_text="Customer full name"
    )
    phone = models.CharField(
        max_length=50,
        help_text="Customer phone number"
    )
    email = models.EmailField(
        blank=True,
        null=True,
        help_text="Customer email address (optional)"
    )
    location = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Customer location or city"
    )
    enquiry_type = models.CharField(
        max_length=50,
        choices=ENQUIRY_TYPE_CHOICES,
        default='General Enquiry',
        help_text="Category of enquiry"
    )
    message = models.TextField(
        help_text="Detailed project requirement or message"
    )
    is_contacted = models.BooleanField(
        default=False,
        help_text="Status flag indicating whether company sales/support team has followed up"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Enquiry'
        verbose_name_plural = 'Contact Enquiries'

    def __str__(self):
        return f"{self.name} - {self.enquiry_type} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
