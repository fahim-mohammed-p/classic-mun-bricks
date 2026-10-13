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
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


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
