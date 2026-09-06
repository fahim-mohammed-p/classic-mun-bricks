from django.contrib import admin
from .models import FactoryProcess, CompanyProfile


@admin.register(FactoryProcess)
class FactoryProcessAdmin(admin.ModelAdmin):
    list_display = ('step_number', 'title', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'short_description')
    ordering = ('step_number',)


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'tamil_nadu_projects', 'kerala_projects', 'total_projects', 'is_active', 'updated_at')
    list_filter = ('is_active',)

