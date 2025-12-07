from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, DataModelViewSet, IndicatorViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'data-models', DataModelViewSet, basename='data-model')
router.register(r'indicators', IndicatorViewSet, basename='indicator')

urlpatterns = [
    path('', include(router.urls)),
]
