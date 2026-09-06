from rest_framework import serializers
from .models import FactoryProcess, CompanyProfile


class FactoryProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = FactoryProcess
        fields = [
            'id',
            'step_number',
            'title',
            'short_description',
            'image',
            'video',
            'is_active',
            'created_at',
            'updated_at',
        ]


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = [
            'id',
            'company_name',
            'started_year',
            'years_experience',
            'about_short',
            'about_long',
            'tamil_nadu_projects',
            'kerala_projects',
            'total_projects',
            'is_active',
            'created_at',
            'updated_at',
        ]


