from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AccessRequest(models.Model):
    STATUS_PENDING = 'PENDING'
    STATUS_APPROVED = 'APPROVED'
    STATUS_REJECTED = 'REJECTED'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'En attente'),
        (STATUS_APPROVED, 'Approuvé'),
        (STATUS_REJECTED, 'Rejeté'),
    ]

    # Informations du demandeur
    requester_full_name = models.CharField(max_length=255)
    requester_email = models.EmailField()
    requester_phone = models.CharField(max_length=20)
    
    # Informations de la structure
    organization_name = models.CharField(max_length=255)
    organization_type = models.CharField(max_length=100, blank=True)
    organization_address = models.TextField(blank=True)
    
    # Motivation et documents
    motivation = models.TextField()
    official_letter = models.FileField(upload_to='access_requests/letters/')
    supporting_documents = models.FileField(upload_to='access_requests/documents/', blank=True, null=True)
    
    # Statut et traitement
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_requests')
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Lien vers l'utilisateur créé après approbation
    associated_user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='access_request')
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['organization_name']),
        ]

    def __str__(self):
        return f"{self.organization_name} - {self.get_status_display()}"
    
    def is_pending(self):
        return self.status == self.STATUS_PENDING
    
    def is_approved(self):
        return self.status == self.STATUS_APPROVED
    
    def is_rejected(self):
        return self.status == self.STATUS_REJECTED