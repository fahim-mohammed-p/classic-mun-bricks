import re
from rest_framework import serializers
from .models import ProjectLocation, ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'order', 'created_at']

    def get_image(self, obj):
        if not obj.image:
            return ''

        storage = obj.image.storage
        name = getattr(obj.image, 'name', '')

        # Resolve URL from storage
        # If an ephemeral hashed filename does not exist on disk,
        # fallback to the persistent/git-tracked base file if present.
        url = None
        if name and hasattr(storage, 'exists') and not storage.exists(name):
            clean_name = re.sub(r'_[a-zA-Z0-9]{7}(\.[a-zA-Z0-9]+)$', r'\1', name)
            if clean_name != name and storage.exists(clean_name):
                url = storage.url(clean_name)

        if not url:
            try:
                url = obj.image.url
            except Exception:
                return ''

        if not url:
            return ''

        # If storage URL is already absolute (e.g. S3 / CDN / Cloudinary), return directly
        if url.startswith('http://') or url.startswith('https://'):
            return url

        # If storage URL is relative, make it absolute exactly once
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)

        return url


class ProjectLocationSerializer(serializers.ModelSerializer):
    district = serializers.CharField(source='district.name', read_only=True)
    district_slug = serializers.CharField(source='district.slug', read_only=True)
    state = serializers.CharField(source='district.state.name', read_only=True)
    state_code = serializers.CharField(source='district.state.code', read_only=True)
    latitude = serializers.FloatField(source='district.latitude', read_only=True)
    longitude = serializers.FloatField(source='district.longitude', read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    image_count = serializers.IntegerField(source='images.count', read_only=True)

    class Meta:
        model = ProjectLocation
        fields = [
            'id',
            'district',
            'district_slug',
            'state',
            'state_code',
            'latitude',
            'longitude',
            'is_factory_hub',
            'hub_label',
            'is_active',
            'order',
            'images',
            'image_count',
        ]
