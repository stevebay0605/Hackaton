from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings

from .models import AccessRequest
from .serializers import (
    AccessRequestSerializer, AccessRequestCreateSerializer,
    AccessRequestApprovalSerializer, AccessRequestRejectionSerializer,
    AccessRequestListSerializer
)

User = get_user_model()

class AccessRequestViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des demandes d accès aux données confidentielles"""
    queryset = AccessRequest.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AccessRequestCreateSerializer
        elif self.action == 'list':
            return AccessRequestListSerializer
        elif self.action == 'approve':
            return AccessRequestApprovalSerializer
        elif self.action == 'reject':
            return AccessRequestRejectionSerializer
        return AccessRequestSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        elif self.action in ['approve', 'reject', 'list', 'retrieve']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAdminUser()]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (user.is_staff or user.role == User.IS_ADMIN):
            return AccessRequest.objects.all()
        return AccessRequest.objects.none()
    
    def perform_create(self, serializer):
        """Créer une nouvelle demande d accès"""
        serializer.save()
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """Approuver une demande d accès et créer un compte utilisateur"""
        access_request = self.get_object()
        
        if access_request.status != AccessRequest.STATUS_PENDING:
            return Response(
                {'error': f'Demande déjà {access_request.get_status_display().lower()}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AccessRequestApprovalSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # 1. Mise à jour statut
        access_request.status = AccessRequest.STATUS_APPROVED
        access_request.processed_at = timezone.now()
        access_request.processed_by = request.user
        access_request.save()
        
        # 2. Création du compte utilisateur
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = User.objects.create_user(
            username=username,
            email=access_request.requester_email,
            password=password,
            first_name=access_request.requester_full_name.split()[0],
            last_name=' '.join(access_request.requester_full_name.split()[1:]),
            role=User.IS_PARTNER,
            organization=access_request.organization_name,
            phone=access_request.requester_phone,
            professional_email=access_request.requester_email
        )
        
        access_request.associated_user = user
        access_request.save()
        
        # 3. Envoi email
        self._send_approval_email(access_request, username, password)
        
        return Response({
            'status': 'approved',
            'message': 'Demande approuvée et compte créé',
            'username': username,
            'user_id': user.id
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """Rejeter une demande d accès"""
        access_request = self.get_object()
        
        if access_request.status != AccessRequest.STATUS_PENDING:
            return Response(
                {'error': f'Demande déjà {access_request.get_status_display().lower()}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AccessRequestRejectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Mise à jour statut
        access_request.status = AccessRequest.STATUS_REJECTED
        access_request.processed_at = timezone.now()
        access_request.processed_by = request.user
        access_request.rejection_reason = serializer.validated_data['rejection_reason']
        access_request.save()
        
        # Envoi email de rejet
        self._send_rejection_email(access_request)
        
        return Response({
            'status': 'rejected',
            'message': 'Demande rejetée'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def pending(self, request):
        """Lister les demandes en attente"""
        pending_requests = AccessRequest.objects.filter(status=AccessRequest.STATUS_PENDING)
        serializer = AccessRequestListSerializer(pending_requests, many=True)
        return Response(serializer.data)
    
    def _send_approval_email(self, access_request, username, password):
        """Envoyer un email d'approbation"""
        subject = 'Votre demande d\'accès HISWACA a été approuvée'
        message = f"""
        Bonjour {access_request.requester_full_name},
        
        Votre demande d accès aux données confidentielles de HISWACA a été approuvée.
        
        Identifiants de connexion:
        - Nom d'utilisateur: {username}
        - Mot de passe: {password}
        
        Veuillez vous connecter et changer votre mot de passe dès que possible.
        
        Cordialement,
        L'équipe HISWACA
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [access_request.requester_email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Erreur lors de l'envoi d'email: {str(e)}")
    
    def _send_rejection_email(self, access_request):
        """Envoyer un email de rejet"""
        subject = 'Votre demande d\'accès HISWACA'
        message = f"""
        Bonjour {access_request.requester_full_name},
        
        Nous regrettons de vous informer que votre demande d accès aux données confidentielles de HISWACA a été rejetée.
        
        Raison: {access_request.rejection_reason}
        
        Si vous avez des questions, veuillez nous contacter.
        
        Cordialement,
        L'équipe HISWACA
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [access_request.requester_email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Erreur lors de l'envoi d'email: {str(e)}")