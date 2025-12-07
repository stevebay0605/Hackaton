from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    IS_PARTNER = 'PARTNER'
    IS_ADMIN = 'ADMIN'
    IS_PUBLIC = 'PUBLIC'
    
    ROLE_CHOICES = [
        (IS_PARTNER, 'Partenaire'),
        (IS_ADMIN, 'Administrateur'),
        (IS_PUBLIC, 'Utilisateur Public'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=IS_PUBLIC)
    organization = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    professional_email = models.EmailField(blank=True, null=True)
    is_active_user = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['organization']),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

    def is_structure_partner(self):
        return self.role == self.IS_PARTNER
    
    def is_admin_user(self):
        return self.role == self.IS_ADMIN
    
    def is_public_user(self):
        return self.role == self.IS_PUBLIC