from django.contrib import admin
from .models import ContactEnquiry


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'enquiry_type', 'location', 'is_contacted', 'created_at')
    list_filter = ('enquiry_type', 'is_contacted', 'created_at')
    search_fields = ('name', 'phone', 'email', 'location', 'message')
    list_editable = ('is_contacted',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
