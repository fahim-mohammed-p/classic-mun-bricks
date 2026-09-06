import re
from rest_framework import serializers
from .models import ContactEnquiry


class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = [
            'id',
            'name',
            'phone',
            'email',
            'location',
            'enquiry_type',
            'message',
            'is_contacted',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'is_contacted', 'created_at', 'updated_at']

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Full name is required and cannot be blank.")
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Please enter a valid full name.")
        return value

    def validate_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Phone number is required and cannot be blank.")
        value = value.strip()
        cleaned = re.sub(r'[\s\+\-\(\)]', '', value)
        if not cleaned.isdigit() or len(cleaned) < 7 or len(cleaned) > 15:
            raise serializers.ValidationError("Please enter a valid contact phone number.")
        return value

    def validate_email(self, value):
        if value and value.strip():
            value = value.strip()
            return value
        return ""

    def validate_location(self, value):
        if value:
            return value.strip()
        return ""

    def validate_message(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Message or requirement details cannot be blank.")
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError("Please provide a brief description of your requirement.")
        return value
