from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccessRequestViewSet

router = DefaultRouter()
router.register(r'', AccessRequestViewSet, basename='access-request')

urlpatterns = [
    path('', include(router.urls)),
]
