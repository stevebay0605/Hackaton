from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class DataModel(models.Model):
    """Modèle de données (Santé, Éducation, etc.)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    schema = models.JSONField(default=dict)  # Schéma JSON du modèle
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Indicator(models.Model):
    VISIBILITY_PUBLIC = 'PUBLIC'
    VISIBILITY_PRIVATE = 'PRIVATE'

    VISIBILITY_CHOICES = [
        (VISIBILITY_PUBLIC, 'Public (Citoyen)'),
        (VISIBILITY_PRIVATE, 'Privé (Partenaire)'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='indicators')
    data_model = models.ForeignKey(DataModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='indicators')
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default=VISIBILITY_PUBLIC)
    
    # Fichier CSV ou Excel associé
    data_file = models.FileField(upload_to='indicators/')
    file_format = models.CharField(max_length=10, choices=[('CSV', 'CSV'), ('EXCEL', 'Excel')], default='CSV')
    
    # Métadonnées
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_indicators')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Statut de traitement
    is_processed = models.BooleanField(default=False)
    processing_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['visibility']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_visibility_display()})"
    
    def is_public(self):
        return self.visibility == self.VISIBILITY_PUBLIC
    
    def is_private(self):
        return self.visibility == self.VISIBILITY_PRIVATE