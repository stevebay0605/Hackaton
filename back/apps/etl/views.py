from rest_framework import viewsets, views, parsers, response, status, permissions
from rest_framework.decorators import action
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.http import FileResponse

from .models import RawFileUpload
from .serializers import (
    RawFileUploadSerializer, RawFileUploadCreateSerializer,
    RawFileUploadDetailSerializer, RawFileUploadListSerializer
)
from .services.processor import ETLProcessor

User = get_user_model()

class RawFileUploadViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des uploads de fichiers bruts"""
    queryset = RawFileUpload.objects.all()
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RawFileUploadCreateSerializer
        elif self.action == 'retrieve':
            return RawFileUploadDetailSerializer
        elif self.action == 'list':
            return RawFileUploadListSerializer
        return RawFileUploadSerializer
    
    def perform_create(self, serializer):
        """Créer un nouvel upload"""
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def process(self, request, pk=None):
        """Traiter un fichier brut et créer les indicateurs"""
        raw_upload = self.get_object()
        
        if raw_upload.status != RawFileUpload.STATUS_PENDING:
            return response.Response(
                {'error': f'Fichier déjà {raw_upload.get_status_display().lower()}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not raw_upload.category:
            return response.Response(
                {'error': 'Aucune catégorie sélectionnée pour ce fichier'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Marquer comme en traitement
            raw_upload.status = RawFileUpload.STATUS_PROCESSING
            raw_upload.processing_started_at = timezone.now()
            raw_upload.save()
            
            # Traiter le fichier avec le service ETL
            processor = ETLProcessor(raw_upload)
            result = processor.process()
            
            if result['success']:
                return response.Response({
                    'status': 'completed',
                    'message': result['message'],
                    'id': raw_upload.id,
                    'total_rows': result['total_rows'],
                    'processed_rows': result['processed_rows'],
                    'failed_rows': result['failed_rows'],
                    'output_file': f'/api/etl/uploads/{raw_upload.id}/download/'
                }, status=status.HTTP_200_OK)
            else:
                return response.Response(
                    {'error': result['error']},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        except Exception as e:
            raw_upload.status = RawFileUpload.STATUS_FAILED
            raw_upload.error_message = str(e)
            raw_upload.processing_completed_at = timezone.now()
            raw_upload.save()
            
            return response.Response(
                {'error': f'Erreur lors du traitement: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def download(self, request, pk=None):
        """Télécharger le fichier de sortie XLS"""
        raw_upload = self.get_object()
        
        if raw_upload.status != RawFileUpload.STATUS_COMPLETED:
            return response.Response(
                {'error': 'Le fichier n\'a pas été traité ou le traitement a échoué'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Générer le fichier XLS
            processor = ETLProcessor(raw_upload)
            output_file = processor._generate_output_file()
            
            return FileResponse(
                output_file.open('rb'),
                as_attachment=True,
                filename=f'etl_output_{raw_upload.id}.xlsx'
            )
        
        except Exception as e:
            return response.Response(
                {'error': f'Erreur lors du téléchargement: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def pending(self, request):
        """Lister les fichiers en attente"""
        pending_files = RawFileUpload.objects.filter(status=RawFileUpload.STATUS_PENDING)
        serializer = RawFileUploadListSerializer(pending_files, many=True)
        return response.Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def processing(self, request):
        """Lister les fichiers en traitement"""
        processing_files = RawFileUpload.objects.filter(status=RawFileUpload.STATUS_PROCESSING)
        serializer = RawFileUploadListSerializer(processing_files, many=True)
        return response.Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def completed(self, request):
        """Lister les fichiers traités"""
        completed_files = RawFileUpload.objects.filter(status=RawFileUpload.STATUS_COMPLETED)
        serializer = RawFileUploadListSerializer(completed_files, many=True)
        return response.Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def failed(self, request):
        """Lister les fichiers avec erreur"""
        failed_files = RawFileUpload.objects.filter(status=RawFileUpload.STATUS_FAILED)
        serializer = RawFileUploadListSerializer(failed_files, many=True)
        return response.Response(serializer.data)

class ETLUploadView(views.APIView):
    """Vue pour upload et traitement automatique de fichiers"""
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        """Upload et traitement automatique du fichier"""
        file_obj = request.FILES.get('file')
        file_name = request.data.get('file_name', file_obj.name if file_obj else 'unknown')
        file_format = request.data.get('file_format', 'CSV')
        # Accepter 'category' ou 'category_id'
        category_id = request.data.get('category') or request.data.get('category_id')
        # Récupérer la visibilité (PUBLIC ou PRIVATE)
        visibility = request.data.get('visibility', 'PRIVATE')
        
        if not file_obj:
            return response.Response(
                {'error': 'Aucun fichier fourni'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not category_id:
            return response.Response(
                {'error': 'Catégorie requise'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from apps.datacatalog.models import Category
            
            # Vérifier que la catégorie existe
            category = Category.objects.get(id=category_id)
            
            # Créer l'upload
            raw_upload = RawFileUpload.objects.create(
                file=file_obj,
                file_name=file_name,
                file_format=file_format,
                category=category,
                uploaded_by=request.user,
                status=RawFileUpload.STATUS_PROCESSING,
                processing_started_at=timezone.now()
            )
            
            # Traiter le fichier immédiatement avec la visibilité spécifiée
            processor = ETLProcessor(raw_upload, visibility=visibility)
            result = processor.process()
            
            if result['success']:
                return response.Response({
                    'id': raw_upload.id,
                    'file_name': raw_upload.file_name,
                    'status': raw_upload.status,
                    'total_rows': result['total_rows'],
                    'processed_rows': result['processed_rows'],
                    'failed_rows': result['failed_rows'],
                    'message': result['message'],
                    'output_file': f'/api/etl/uploads/{raw_upload.id}/download/'
                }, status=status.HTTP_201_CREATED)
            else:
                return response.Response(
                    {'error': result['error']},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        except Exception as e:
            return response.Response(
                {'error': f'Erreur lors de l\'upload ou du traitement: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )