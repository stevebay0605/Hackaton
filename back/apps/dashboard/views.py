from rest_framework import views, response, permissions
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from apps.access_request.models import AccessRequest
from apps.datacatalog.models import Indicator, Category, DataModel
from apps.etl.models import RawFileUpload

User = get_user_model()

class DashboardStatsView(views.APIView):
    """Vue pour les statistiques du tableau de bord administrateur"""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        """Récupérer les statistiques globales"""
        stats = {
            # Statistiques utilisateurs
            'users': {
                'total': User.objects.count(),
                'admins': User.objects.filter(role=User.IS_ADMIN).count(),
                'partners': User.objects.filter(role=User.IS_PARTNER).count(),
                'public': User.objects.filter(role=User.IS_PUBLIC).count(),
                'active': User.objects.filter(is_active_user=True).count(),
            },
            
            # Statistiques demandes d accès
            'access_requests': {
                'total': AccessRequest.objects.count(),
                'pending': AccessRequest.objects.filter(status=AccessRequest.STATUS_PENDING).count(),
                'approved': AccessRequest.objects.filter(status=AccessRequest.STATUS_APPROVED).count(),
                'rejected': AccessRequest.objects.filter(status=AccessRequest.STATUS_REJECTED).count(),
            },
            
            # Statistiques indicateurs
            'indicators': {
                'total': Indicator.objects.count(),
                'public': Indicator.objects.filter(visibility=Indicator.VISIBILITY_PUBLIC).count(),
                'private': Indicator.objects.filter(visibility=Indicator.VISIBILITY_PRIVATE).count(),
                'processed': Indicator.objects.filter(is_processed=True).count(),
                'unprocessed': Indicator.objects.filter(is_processed=False).count(),
            },
            
            # Statistiques ETL
            'etl': {
                'total_uploads': RawFileUpload.objects.count(),
                'pending': RawFileUpload.objects.filter(status=RawFileUpload.STATUS_PENDING).count(),
                'processing': RawFileUpload.objects.filter(status=RawFileUpload.STATUS_PROCESSING).count(),
                'completed': RawFileUpload.objects.filter(status=RawFileUpload.STATUS_COMPLETED).count(),
                'failed': RawFileUpload.objects.filter(status=RawFileUpload.STATUS_FAILED).count(),
            },
            
            # Statistiques catalogue
            'catalog': {
                'categories': Category.objects.count(),
                'data_models': DataModel.objects.count(),
            }
        }
        return response.Response(stats)

class DashboardRecentActivityView(views.APIView):
    """Vue pour les activités récentes"""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        """Récupérer les activités récentes"""
        recent_requests = AccessRequest.objects.all()[:5]
        recent_uploads = RawFileUpload.objects.all()[:5]
        recent_indicators = Indicator.objects.all()[:5]
        
        activity = {
            'recent_access_requests': [
                {
                    'id': req.id,
                    'organization': req.organization_name,
                    'status': req.get_status_display(),
                    'created_at': req.created_at
                }
                for req in recent_requests
            ],
            'recent_uploads': [
                {
                    'id': upload.id,
                    'file_name': upload.file_name,
                    'status': upload.get_status_display(),
                    'uploaded_at': upload.uploaded_at
                }
                for upload in recent_uploads
            ],
            'recent_indicators': [
                {
                    'id': ind.id,
                    'title': ind.title,
                    'visibility': ind.get_visibility_display(),
                    'created_at': ind.created_at
                }
                for ind in recent_indicators
            ]
        }
        return response.Response(activity)