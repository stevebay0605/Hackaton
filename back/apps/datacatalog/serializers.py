from rest_framework import serializers
from .models import Indicator, Category, DataModel
from apps.accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']

class DataModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataModel
        fields = ['id', 'name', 'description', 'schema', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class IndicatorSerializer(serializers.ModelSerializer):
    is_locked = serializers.SerializerMethodField()
    visibility_display = serializers.CharField(source='get_visibility_display', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    data_model_name = serializers.CharField(source='data_model.name', read_only=True)
    uploaded_by_user = UserSerializer(source='uploaded_by', read_only=True)

    class Meta:
        model = Indicator
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'data_model', 'data_model_name', 'visibility', 'visibility_display',
            'data_file', 'file_format', 'uploaded_by', 'uploaded_by_user',
            'is_processed', 'processing_notes', 'created_at', 'updated_at', 'is_locked'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at', 'updated_at']

    def get_is_locked(self, obj):
        # Indicateur visuel pour le Frontend (Cadenas)
        request = self.context.get('request')
        if obj.visibility == 'PRIVATE':
            if request and request.user.is_authenticated:
                return False
            return True
        return True

class IndicatorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = [
            'title', 'description', 'category', 'data_model',
            'visibility', 'data_file', 'file_format', 'processing_notes'
        ]

class IndicatorDetailSerializer(serializers.ModelSerializer):
    visibility_display = serializers.CharField(source='get_visibility_display', read_only=True)
    category = CategorySerializer(read_only=True)
    data_model = DataModelSerializer(read_only=True)
    uploaded_by_user = UserSerializer(source='uploaded_by', read_only=True)

    class Meta:
        model = Indicator
        fields = [
            'id', 'title', 'description', 'category', 'data_model',
            'visibility', 'visibility_display', 'data_file', 'file_format',
            'uploaded_by', 'uploaded_by_user', 'is_processed', 'processing_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at', 'updated_at']