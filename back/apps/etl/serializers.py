from rest_framework import serializers
from .models import RawFileUpload
from apps.accounts.serializers import UserSerializer

class RawFileUploadSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    uploaded_by_user = UserSerializer(source='uploaded_by', read_only=True)
    
    class Meta:
        model = RawFileUpload
        fields = [
            'id', 'file', 'file_name', 'file_format', 'uploaded_by',
            'uploaded_by_user', 'uploaded_at', 'status', 'status_display',
            'processing_started_at', 'processing_completed_at', 'report',
            'error_message', 'total_rows', 'processed_rows', 'failed_rows'
        ]
        read_only_fields = [
            'id', 'uploaded_by', 'uploaded_at', 'processing_started_at',
            'processing_completed_at', 'report', 'error_message',
            'total_rows', 'processed_rows', 'failed_rows'
        ]

class RawFileUploadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawFileUpload
        fields = ['file', 'file_name', 'file_format']

class RawFileUploadDetailSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    uploaded_by_user = UserSerializer(source='uploaded_by', read_only=True)
    
    class Meta:
        model = RawFileUpload
        fields = [
            'id', 'file', 'file_name', 'file_format', 'uploaded_by',
            'uploaded_by_user', 'uploaded_at', 'status', 'status_display',
            'processing_started_at', 'processing_completed_at', 'report',
            'error_message', 'total_rows', 'processed_rows', 'failed_rows'
        ]
        read_only_fields = [
            'id', 'uploaded_by', 'uploaded_at', 'processing_started_at',
            'processing_completed_at', 'report', 'error_message',
            'total_rows', 'processed_rows', 'failed_rows'
        ]

class RawFileUploadListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = RawFileUpload
        fields = [
            'id', 'file_name', 'file_format', 'uploaded_at',
            'status', 'status_display', 'total_rows', 'processed_rows'
        ]
