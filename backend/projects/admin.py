from django import forms
from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Max
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.html import format_html
from .models import State, District, ProjectLocation, ProjectImage


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleImageField(forms.ImageField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault(
            'widget',
            MultipleFileInput(attrs={'multiple': True, 'accept': 'image/*'})
        )
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            if not data and self.required:
                raise ValidationError(self.error_messages['required'], code='required')
            return [single_file_clean(d, initial) for d in data]
        return [single_file_clean(data, initial)]


class ProjectImageBatchAddForm(forms.ModelForm):
    images = MultipleImageField(
        label='Project Images',
        help_text='Select one or more project images to upload simultaneously (Ctrl/Shift+Click in file picker).',
        required=True,
    )

    class Meta:
        model = ProjectImage
        fields = ('location', 'images', 'caption')


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
    fields = ('image_preview', 'image', 'caption', 'order')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.pk and obj.image:
            return format_html(
                '<img src="{}" style="max-height: 48px; max-width: 72px; object-fit: cover; border-radius: 3px; border: 1px solid #ccc;" />',
                obj.image.url
            )
        return format_html('<span style="color:#999; font-size:11px;">(Upload to preview)</span>')
    image_preview.short_description = 'Preview'


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
    list_display_links = ('district_name',)
    list_editable = ('is_active', 'order')
    list_filter = (
        'is_active',
        'is_factory_hub',
        'district__state',
    )
    search_fields = (
        'district__name',
        'district__state__name',
    )
    fieldsets = (
        ('Location (India District Master)', {
            'fields': ('district',),
            'description': 'Search and select an official Indian District from the India master dataset.',
        }),
        ('Manufacturing & Display Settings', {
            'fields': ('is_factory_hub', 'hub_label', 'is_active', 'order'),
        }),
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
    list_display = (
        'id',
        'image_preview',
        'location_district',
        'location_state',
        'caption',
        'order',
        'created_at',
    )
    list_display_links = ('id', 'image_preview', 'location_district')
    list_editable = ('caption', 'order')
    list_filter = ('location__district__state', 'location')
    search_fields = (
        'location__district__name',
        'location__district__state__name',
        'caption',
    )
    autocomplete_fields = ['location']
    readonly_fields = ('image_preview',)
    ordering = ('location', 'order', '-created_at')

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return (
                ('Bulk Upload Project Images', {
                    'fields': ('location', 'images', 'caption'),
                    'description': 'Select a Project Location and choose one or more images to upload at once. Sequential ordering will be assigned automatically.',
                }),
            )
        return (
            ('Project Image Details', {
                'fields': ('image_preview', 'location', 'image', 'caption', 'order'),
            }),
        )

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return ()
        return ('image_preview',)

    def get_form(self, request, obj=None, change=False, **kwargs):
        if obj is None:
            kwargs['form'] = ProjectImageBatchAddForm
            kwargs['fields'] = ('location', 'images', 'caption')
        return super().get_form(request, obj, change=change, **kwargs)

    def save_model(self, request, obj, form, change):
        if change:
            super().save_model(request, obj, form, change)
            return

        images = form.cleaned_data.get('images', [])
        location = form.cleaned_data.get('location')
        caption = form.cleaned_data.get('caption', '')

        with transaction.atomic():
            max_order = (
                ProjectImage.objects
                .filter(location=location)
                .aggregate(max_val=Max('order'))['max_val']
            )
            base_order = 0 if max_order is None else max_order + 1

            created = []
            for idx, img_file in enumerate(images):
                item = ProjectImage(
                    location=location,
                    image=img_file,
                    caption=caption,
                    order=base_order + idx,
                )
                item.save()
                created.append(item)

            request._created_instances = created
            request._created_images_count = len(created)
            request._created_location_name = location.district.name

            if created:
                obj.pk = created[0].pk
                obj.id = created[0].id
                obj.image = created[0].image
                obj.order = created[0].order

    def response_add(self, request, obj, post_url_continue=None):
        count = getattr(request, '_created_images_count', None)
        loc_name = getattr(request, '_created_location_name', None)
        if count is not None and loc_name:
            suffix = 's' if count != 1 else ''
            msg = f"{count} project image{suffix} added to {loc_name}."
            self.message_user(request, msg, messages.SUCCESS)
            if '_addanother' in request.POST:
                return HttpResponseRedirect(request.path)
            elif '_continue' in request.POST and getattr(request, '_created_instances', None):
                first_pk = request._created_instances[0].pk
                return HttpResponseRedirect(
                    reverse('admin:projects_projectimage_change', args=[first_pk])
                )
            else:
                return HttpResponseRedirect(
                    reverse('admin:projects_projectimage_changelist')
                )
        return super().response_add(request, obj, post_url_continue)

    def log_addition(self, request, object, message):
        created_instances = getattr(request, '_created_instances', None)
        if created_instances:
            for inst in created_instances:
                super().log_addition(request, inst, message)
        else:
            super().log_addition(request, object, message)

    def location_district(self, obj):
        return obj.location.district.name
    location_district.short_description = 'District'
    location_district.admin_order_field = 'location__district__name'

    def location_state(self, obj):
        return obj.location.district.state.name
    location_state.short_description = 'State'
    location_state.admin_order_field = 'location__district__state__name'

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 52px; max-width: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #ccc;" />',
                obj.image.url
            )
        return format_html('<span style="color:#999; font-size:12px;">No image</span>')
    image_preview.short_description = 'Preview'

