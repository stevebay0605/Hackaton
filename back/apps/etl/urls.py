from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RawFileUploadViewSet, ETLUploadView

router = DefaultRouter()
router.register(r'uploads', RawFileUploadViewSet, basename='raw-file-upload')

urlpatterns = [
    path('', include(router.urls)),
    path('upload/', ETLUploadView.as_view(), name='etl-upload'),
]