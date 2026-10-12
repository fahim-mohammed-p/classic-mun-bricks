from django.contrib import admin
from django.utils.html import format_html
from .models import State, District, ProjectLocation, ProjectImage


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'district_count')
    search_fields = ('name', 'code')
    ordering = ('name',)

    def district_count(self, obj):
        return obj.districts.count()
    district_count.short_description = 'Districts'


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    """
    Searchable District master directory.
    Configured with search_fields for native Django Admin autocomplete.
    """
    list_display = ('name', 'state', 'latitude', 'longitude')
    list_filter = ('state',)
    search_fields = ('name', 'state__name')
    ordering = ('name',)
    readonly_fields = ('slug',)


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ('image', 'caption', 'order')


@admin.register(ProjectLocation)
class ProjectLocationAdmin(admin.ModelAdmin):
    """
    Classic Mun Bricks Project Location Administration.
    Features searchable autocomplete dropdown for districts across India,
    enforcing that the admin picks a valid official district instead of typing free text.
    """
    autocomplete_fields = ['district']
    list_display = (
        'district_name',
        'state_name',
        'is_factory_hub',
        'is_active',
        'image_count',
        'order',
        'updated_at',
    )
    list_filter = (
        'is_active',
        'is_factory_hub',
        'district__state',
    )
    search_fields = (
        'district__name',
        'district__state__name',
    )
    inlines = [ProjectImageInline]
    ordering = ('order', 'district__name')

    def district_name(self, obj):
        return obj.district.name
    district_name.short_description = 'District'
    district_name.admin_order_field = 'district__name'

    def state_name(self, obj):
        return obj.district.state.name
    state_name.short_description = 'State'
    state_name.admin_order_field = 'district__state__name'

    def image_count(self, obj):
        count = obj.images.count()
        return format_html('<b>{}</b> images', count)
    image_count.short_description = 'Gallery Photos'


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'location', 'image', 'caption', 'order', 'created_at')
    list_filter = ('location__district__state', 'location')
    search_fields = ('location__district__name', 'caption')
    autocomplete_fields = ['location']
    ordering = ('location', 'order', '-created_at')
