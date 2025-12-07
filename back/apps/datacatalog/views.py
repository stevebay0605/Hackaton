from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
import logging
import csv
from django.http import HttpResponse

from .models import Indicator, Category, DataModel
from .serializers import (
    IndicatorSerializer, CategorySerializer, DataModelSerializer,
    IndicatorCreateSerializer, IndicatorDetailSerializer
)
from apps.accounts.permissions import IsAdmin, IsAdminOrReadOnly, CanAccessPrivateData

User = get_user_model()
logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet optimisé pour la gestion des catégories d'indicateurs.

    Endpoints:
    - GET    /api/catalog/categories/         - Liste toutes les catégories
    - POST   /api/catalog/categories/         - Créer une catégorie (Admin)
    - GET    /api/catalog/categories/{id}/    - Détail d'une catégorie
    - PUT    /api/catalog/categories/{id}/    - Modifier une catégorie (Admin)
    - PATCH  /api/catalog/categories/{id}/    - Modifier partiellement (Admin)
    - DELETE /api/catalog/categories/{id}/    - Supprimer une catégorie (Admin)
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    @method_decorator(cache_page(60 * 15))  # Cache 15 minutes
    def list(self, request, *args, **kwargs):
        """Liste des catégories avec cache"""
        logger.info(f"User {request.user} requested categories list")
        return super().list(request, *args, **kwargs)


class DataModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet optimisé pour la gestion des modèles de données.

    Endpoints:
    - GET    /api/catalog/data-models/         - Liste tous les modèles
    - POST   /api/catalog/data-models/         - Créer un modèle (Admin)
    - GET    /api/catalog/data-models/{id}/    - Détail d'un modèle
    - PUT    /api/catalog/data-models/{id}/    - Modifier un modèle (Admin)
    - PATCH  /api/catalog/data-models/{id}/    - Modifier partiellement (Admin)
    - DELETE /api/catalog/data-models/{id}/    - Supprimer un modèle (Admin)
    """
    queryset = DataModel.objects.all().order_by('name')
    serializer_class = DataModelSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    @method_decorator(cache_page(60 * 15))  # Cache 15 minutes
    def list(self, request, *args, **kwargs):
        """Liste des modèles avec cache"""
        logger.info(f"User {request.user} requested data models list")
        return super().list(request, *args, **kwargs)


class IndicatorViewSet(viewsets.ModelViewSet):
    """
    ViewSet optimisé pour la gestion des indicateurs/données.

    Endpoints standards:
    - GET    /api/catalog/indicators/         - Liste des indicateurs (selon rôle)
    - POST   /api/catalog/indicators/         - Créer un indicateur (Admin)
    - GET    /api/catalog/indicators/{id}/    - Détail d'un indicateur
    - PUT    /api/catalog/indicators/{id}/    - Modifier un indicateur (Admin)
    - PATCH  /api/catalog/indicators/{id}/    - Modifier partiellement (Admin)
    - DELETE /api/catalog/indicators/{id}/    - Supprimer un indicateur (Admin)

    Actions personnalisées:
    - GET /api/catalog/indicators/public/           - Liste indicateurs publics (tous)
    - GET /api/catalog/indicators/private/          - Liste indicateurs privés (Admin)
    - GET /api/catalog/indicators/unprocessed/      - Liste indicateurs non traités (Admin)
    - GET /api/catalog/indicators/by_category/      - Filtrer par catégorie (Admin)
    - GET /api/catalog/indicators/by_data_model/    - Filtrer par modèle (Admin)
    - GET /api/catalog/indicators/{id}/export/      - Exporter données (CSV/JSON)
    - GET /api/catalog/indicators/{id}/datapoints/  - Récupérer points de données
    """
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    filterset_fields = ['category', 'visibility', 'is_processed']

    def get_serializer_class(self):
        """Retourne le serializer approprié selon l'action"""
        if self.action == 'create':
            return IndicatorCreateSerializer
        elif self.action == 'retrieve':
            return IndicatorDetailSerializer
        return IndicatorSerializer

    def get_permissions(self):
        """Permissions dynamiques selon l'action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        elif self.action == 'public':
            return [permissions.AllowAny()]
        elif self.action in ['private', 'by_category', 'by_data_model', 'unprocessed']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """
        Optimise les requêtes avec select_related et prefetch_related.
        Filtre selon le rôle de l'utilisateur.
        """
        user = self.request.user

        # Queryset de base optimisé avec jointures
        queryset = Indicator.objects.select_related(
            'category',
            'data_model',
            'uploaded_by'
        ).order_by('-created_at')

        # Si Admin : accès à tout
        if user.is_authenticated and (user.is_staff or user.role == User.IS_ADMIN):
            logger.debug(f"Admin {user} accessing all indicators")
            return queryset

        # Si Partenaire : accès public + privé
        if user.is_authenticated and user.role == User.IS_PARTNER:
            logger.debug(f"Partner {user} accessing all indicators")
            return queryset

        # Sinon (Public) : accès uniquement au public
        logger.debug(f"Public user {user} accessing public indicators only")
        return queryset.filter(visibility='PUBLIC')

    def perform_create(self, serializer):
        """Créer un nouvel indicateur et enregistrer l'utilisateur"""
        instance = serializer.save(uploaded_by=self.request.user)
        logger.info(f"Indicator {instance.id} created by {self.request.user}")

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request):
        """
        Liste uniquement les indicateurs publics.
        Accessible sans authentification.
        """
        try:
            public_indicators = Indicator.objects.filter(
                visibility='PUBLIC'
            ).select_related(
                'category', 'data_model', 'uploaded_by'
            ).order_by('-created_at')

            serializer = IndicatorSerializer(
                public_indicators,
                many=True,
                context={'request': request}
            )
            logger.info(f"Public indicators list accessed (count: {public_indicators.count()})")
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching public indicators: {str(e)}")
            return Response(
                {'error': 'Erreur lors de la récupération des indicateurs publics'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def private(self, request):
        """
        Liste uniquement les indicateurs privés.
        Réservé aux administrateurs.
        """
        try:
            private_indicators = Indicator.objects.filter(
                visibility='PRIVATE'
            ).select_related(
                'category', 'data_model', 'uploaded_by'
            ).order_by('-created_at')

            serializer = IndicatorSerializer(
                private_indicators,
                many=True,
                context={'request': request}
            )
            logger.info(f"Admin {request.user} accessed private indicators (count: {private_indicators.count()})")
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching private indicators: {str(e)}")
            return Response(
                {'error': 'Erreur lors de la récupération des indicateurs privés'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def by_category(self, request):
        """
        Filtre les indicateurs par catégorie.
        Réservé aux administrateurs.
        """
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {'error': 'Le paramètre category_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            indicators = Indicator.objects.filter(
                category_id=category_id
            ).select_related(
                'category', 'data_model', 'uploaded_by'
            ).order_by('-created_at')

            serializer = IndicatorSerializer(
                indicators,
                many=True,
                context={'request': request}
            )
            logger.info(f"Indicators filtered by category {category_id} (count: {indicators.count()})")
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error filtering by category: {str(e)}")
            return Response(
                {'error': 'Erreur lors du filtrage par catégorie'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def by_data_model(self, request):
        """
        Filtre les indicateurs par modèle de données.
        Réservé aux administrateurs.
        """
        data_model_id = request.query_params.get('data_model_id')
        if not data_model_id:
            return Response(
                {'error': 'Le paramètre data_model_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            indicators = Indicator.objects.filter(
                data_model_id=data_model_id
            ).select_related(
                'category', 'data_model', 'uploaded_by'
            ).order_by('-created_at')

            serializer = IndicatorSerializer(
                indicators,
                many=True,
                context={'request': request}
            )
            logger.info(f"Indicators filtered by data_model {data_model_id} (count: {indicators.count()})")
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error filtering by data model: {str(e)}")
            return Response(
                {'error': 'Erreur lors du filtrage par modèle de données'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def unprocessed(self, request):
        """
        Liste les indicateurs non traités.
        Réservé aux administrateurs.
        """
        try:
            unprocessed = Indicator.objects.filter(
                is_processed=False
            ).select_related(
                'category', 'data_model', 'uploaded_by'
            ).order_by('-created_at')

            serializer = IndicatorSerializer(
                unprocessed,
                many=True,
                context={'request': request}
            )
            logger.info(f"Unprocessed indicators accessed (count: {unprocessed.count()})")
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching unprocessed indicators: {str(e)}")
            return Response(
                {'error': 'Erreur lors de la récupération des indicateurs non traités'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def datapoints(self, request, pk=None):
        """
        Récupère les points de données d'un indicateur.
        À implémenter avec le modèle DataPoint.
        """
        try:
            indicator = self.get_object()
            logger.info(f"Datapoints requested for indicator {indicator.id}")

            # Pour l'instant, retourner des données vides
            # À implémenter avec le modèle DataPoint
            datapoints = []

            return Response(datapoints, status=status.HTTP_200_OK)

        except Indicator.DoesNotExist:
            return Response(
                {'error': 'Indicateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error fetching datapoints: {str(e)}")
            return Response(
                {'error': 'Erreur lors de la récupération des données'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def export(self, request, pk=None):
        """
        Exporte les données d'un indicateur en CSV ou JSON.

        Query params:
        - format: 'csv' ou 'json' (défaut: json)
        """
        try:
            indicator = self.get_object()
            format_type = request.query_params.get('format', 'json').lower()

            if format_type == 'csv':
                # Export CSV
                response = HttpResponse(content_type='text/csv; charset=utf-8')
                response['Content-Disposition'] = f'attachment; filename="indicator_{indicator.id}_{indicator.title[:30]}.csv"'

                writer = csv.writer(response)
                writer.writerow(['ID', 'Titre', 'Description', 'Catégorie', 'Visibilité', 'Traité'])
                writer.writerow([
                    indicator.id,
                    indicator.title,
                    indicator.description,
                    indicator.category.name if indicator.category else 'N/A',
                    indicator.get_visibility_display(),
                    'Oui' if indicator.is_processed else 'Non'
                ])

                logger.info(f"Indicator {indicator.id} exported as CSV by {request.user}")
                return response

            else:
                # Export JSON
                data = {
                    'id': indicator.id,
                    'title': indicator.title,
                    'description': indicator.description,
                    'category': indicator.category.name if indicator.category else None,
                    'data_model': indicator.data_model.name if indicator.data_model else None,
                    'visibility': indicator.visibility,
                    'is_processed': indicator.is_processed,
                    'created_at': indicator.created_at,
                    'updated_at': indicator.updated_at,
                }

                logger.info(f"Indicator {indicator.id} exported as JSON by {request.user}")
                return Response(data, status=status.HTTP_200_OK)

        except Indicator.DoesNotExist:
            return Response(
                {'error': 'Indicateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error exporting indicator: {str(e)}")
            return Response(
                {'error': 'Erreur lors de l\'export'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
