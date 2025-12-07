from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .models import Indicator, Category, DataModel
from .serializers import (
    IndicatorSerializer, CategorySerializer, DataModelSerializer,
    IndicatorCreateSerializer, IndicatorDetailSerializer
)

User = get_user_model()

class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des catégories d'indicateurs"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

class DataModelViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des modèles de données"""
    queryset = DataModel.objects.all()
    serializer_class = DataModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

class IndicatorViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des indicateurs/données"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return IndicatorCreateSerializer
        elif self.action == 'retrieve':
            return IndicatorDetailSerializer
        return IndicatorSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        elif self.action == 'public':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        
        # Si Admin connecté : accès à tout
        if user.is_authenticated and (user.is_staff or user.role == User.IS_ADMIN):
            return Indicator.objects.all()
        
        # Si Partenaire connecté : accès public + privé
        if user.is_authenticated and user.role == User.IS_PARTNER:
            return Indicator.objects.all()
        
        # Sinon (Citoyen public) : accès uniquement au public
        return Indicator.objects.filter(visibility='PUBLIC')
    
    def perform_create(self, serializer):
        """Créer un nouvel indicateur"""
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request):
        """Lister uniquement les indicateurs publics"""
        try:
            public_indicators = Indicator.objects.filter(visibility='PUBLIC')
            serializer = IndicatorSerializer(public_indicators, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la recuperation des indicateurs publics: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def private(self, request):
        """Lister uniquement les indicateurs privés (Admin uniquement)"""
        try:
            # Vérifier que l'utilisateur est admin
            if not (request.user.is_staff or request.user.role == User.IS_ADMIN):
                return Response(
                    {'error': 'Vous n\'avez pas la permission d\'accéder à cette ressource'},
                    status=status.HTTP_403_FORBIDDEN
                )
            private_indicators = Indicator.objects.filter(visibility='PRIVATE')
            serializer = IndicatorSerializer(private_indicators, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la recuperation des indicateurs prives: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def by_category(self, request):
        """Lister les indicateurs par catégorie (Admin uniquement)"""
        # Vérifier que l'utilisateur est admin
        if not (request.user.is_staff or request.user.role == User.IS_ADMIN):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à cette ressource'},
                status=status.HTTP_403_FORBIDDEN
            )
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {'error': 'category_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        indicators = Indicator.objects.filter(category_id=category_id)
        serializer = IndicatorSerializer(indicators, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def by_data_model(self, request):
        """Lister les indicateurs par modèle de données (Admin uniquement)"""
        # Vérifier que l'utilisateur est admin
        if not (request.user.is_staff or request.user.role == User.IS_ADMIN):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à cette ressource'},
                status=status.HTTP_403_FORBIDDEN
            )
        data_model_id = request.query_params.get('data_model_id')
        if not data_model_id:
            return Response(
                {'error': 'data_model_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        indicators = Indicator.objects.filter(data_model_id=data_model_id)
        serializer = IndicatorSerializer(indicators, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def datapoints(self, request, pk=None):
        """Récupérer les points de données d'un indicateur"""
        try:
            indicator = self.get_object()
            
            # Pour l'instant, retourner des données vides (à implémenter avec le modèle DataPoint)
            # Cette action sera utilisée pour récupérer les séries temporelles
            datapoints = []
            
            return Response(datapoints, status=status.HTTP_200_OK)
        except Indicator.DoesNotExist:
            return Response(
                {'error': 'Indicateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la récupération des données: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def export(self, request, pk=None):
        """Exporter les données d'un indicateur en CSV ou JSON"""
        try:
            indicator = self.get_object()
            format_type = request.query_params.get('format', 'json')
            
            if format_type == 'csv':
                # Retourner un CSV vide pour l'instant
                import csv
                from django.http import HttpResponse
                
                response = HttpResponse(content_type='text/csv')
                response['Content-Disposition'] = f'attachment; filename="indicator_{indicator.id}.csv"'
                writer = csv.writer(response)
                writer.writerow(['ID', 'Titre', 'Description'])
                writer.writerow([indicator.id, indicator.title, indicator.description])
                return response
            else:
                # Retourner JSON
                return Response({
                    'id': indicator.id,
                    'title': indicator.title,
                    'description': indicator.description,
                    'category': indicator.category.name if indicator.category else None,
                    'visibility': indicator.visibility
                }, status=status.HTTP_200_OK)
        except Indicator.DoesNotExist:
            return Response(
                {'error': 'Indicateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de l\'export: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def unprocessed(self, request):
        """Lister les indicateurs non traités (Admin uniquement)"""
        # Vérifier que l'utilisateur est admin
        if not (request.user.is_staff or request.user.role == User.IS_ADMIN):
            return Response(
                {'error': 'Vous n\'avez pas la permission d\'accéder à cette ressource'},
                status=status.HTTP_403_FORBIDDEN
            )
        unprocessed = Indicator.objects.filter(is_processed=False)
        serializer = IndicatorSerializer(unprocessed, many=True, context={'request': request})
        return Response(serializer.data)