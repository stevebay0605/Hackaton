from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()

class IsAdmin(permissions.BasePermission):
    """Permission pour vérifier si l'utilisateur est admin"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.IS_ADMIN)

class IsPartner(permissions.BasePermission):
    """Permission pour vérifier si l'utilisateur est partenaire"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.IS_PARTNER)

class IsPublicUser(permissions.BasePermission):
    """Permission pour vérifier si l'utilisateur est public"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.IS_PUBLIC)

class IsAdminOrReadOnly(permissions.BasePermission):
    """Permission pour admin ou lecture seule"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == User.IS_ADMIN)

class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission pour propriétaire ou admin"""
    def has_object_permission(self, request, view, obj):
        if request.user.role == User.IS_ADMIN:
            return True
        return obj.user == request.user
