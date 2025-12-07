from rest_framework import serializers
from .models import AccessRequest
from apps.accounts.serializers import UserSerializer

class AccessRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    processed_by_user = UserSerializer(source='processed_by', read_only=True)
    associated_user_data = UserSerializer(source='associated_user', read_only=True)
    
    class Meta:
        model = AccessRequest
        fields = [
            'id', 'requester_full_name', 'requester_email', 'requester_phone',
            'organization_name', 'organization_type', 'organization_address',
            'motivation', 'official_letter', 'supporting_documents',
            'status', 'status_display', 'created_at', 'processed_at',
            'processed_by', 'processed_by_user', 'rejection_reason',
            'associated_user', 'associated_user_data'
        ]
        read_only_fields = [
            'id', 'created_at', 'processed_at', 'processed_by',
            'processed_by_user', 'associated_user', 'associated_user_data'
        ]

class AccessRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessRequest
        fields = [
            'requester_full_name', 'requester_email', 'requester_phone',
            'organization_name', 'organization_type', 'organization_address',
            'motivation', 'official_letter', 'supporting_documents'
        ]

class AccessRequestApprovalSerializer(serializers.Serializer):
    """Serializer pour l'approbation d'une demande d'accès"""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    
    def validate_username(self, value):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur existe déjà.")
        return value

class AccessRequestRejectionSerializer(serializers.Serializer):
    """Serializer pour le rejet d'une demande d'accès"""
    rejection_reason = serializers.CharField(required=True)

class AccessRequestListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AccessRequest
        fields = [
            'id', 'requester_full_name', 'organization_name',
            'status', 'status_display', 'created_at'
        ]
