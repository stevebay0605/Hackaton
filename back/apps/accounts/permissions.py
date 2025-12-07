from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()

class IsAdmin(permissions.BasePermission):
    """
    Permission personnalisée pour vérifier si l'utilisateur est administrateur.
    """
    message = "Vous devez être administrateur pour effectuer cette action."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == User.IS_ADMIN or request.user.is_staff)
        )

class IsPartner(permissions.BasePermission):
    """
    Permission personnalisée pour vérifier si l'utilisateur est partenaire.
    """
    message = "Vous devez être partenaire pour accéder à cette ressource."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.IS_PARTNER
        )

class IsPublicUser(permissions.BasePermission):
    """
    Permission personnalisée pour vérifier si l'utilisateur est public.
    """
    message = "Accès réservé aux utilisateurs publics."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.IS_PUBLIC
        )

class IsAdminOrPartner(permissions.BasePermission):
    """
    Permission pour administrateur ou partenaire uniquement.
    """
    message = "Accès réservé aux administrateurs et partenaires."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [User.IS_ADMIN, User.IS_PARTNER]
        )

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission pour admin en écriture ou lecture seule pour tous.
    """
    message = "Vous devez être administrateur pour modifier cette ressource."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == User.IS_ADMIN or request.user.is_staff)
        )

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission pour propriétaire de l'objet ou administrateur.
    """
    message = "Vous devez être le propriétaire ou administrateur pour effectuer cette action."

    def has_object_permission(self, request, view, obj):
        # Admin a tous les droits
        if request.user.role == User.IS_ADMIN or request.user.is_staff:
            return True

        # Vérifier si l'objet appartient à l'utilisateur
        if hasattr(obj, 'uploaded_by'):
            return obj.uploaded_by == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'requester_email'):
            return obj.requester_email == request.user.email

        return False

class CanAccessPrivateData(permissions.BasePermission):
    """
    Permission pour accéder aux données privées (Admin + Partenaires).
    """
    message = "Accès aux données privées réservé aux administrateurs et partenaires."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [User.IS_ADMIN, User.IS_PARTNER]
        )
