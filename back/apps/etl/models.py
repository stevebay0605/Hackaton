from django.db import models
from django.contrib.auth import get_user_model
from apps.datacatalog.models import Category

User = get_user_model()

class RawFileUpload(models.Model):
    STATUS_PENDING = 'PENDING'
    STATUS_PROCESSING = 'PROCESSING'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_FAILED = 'FAILED'
    
    STATUS_CHOICES = [
        (STATUS_PENDING, 'En attente'),
        (STATUS_PROCESSING, 'En traitement'),
        (STATUS_COMPLETED, 'Complété'),
        (STATUS_FAILED, 'Échoué'),
    ]
    
    file = models.FileField(upload_to='etl/raw/')
    file_name = models.CharField(max_length=255)
    file_format = models.CharField(max_length=10, choices=[('CSV', 'CSV'), ('EXCEL', 'Excel')])
    
    # Catégorie pour le traitement
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_files')
    
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_files')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    processing_started_at = models.DateTimeField(null=True, blank=True)
    processing_completed_at = models.DateTimeField(null=True, blank=True)
    
    # Rapport de traitement
    report = models.TextField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    # Statistiques
    total_rows = models.IntegerField(default=0)
    processed_rows = models.IntegerField(default=0)
    failed_rows = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['uploaded_by']),
        ]

    def __str__(self):
        return f"{self.file_name} - {self.get_status_display()}"
    
    def is_pending(self):
        return self.status == self.STATUS_PENDING
    
    def is_processing(self):
        return self.status == self.STATUS_PROCESSING
    
    def is_completed(self):
        return self.status == self.STATUS_COMPLETED
    
    def is_failed(self):
        return self.status == self.STATUS_FAILED