from django.apps import AppConfig


class AccessRequestConfig(AppConfig):
    
    default_auto_field = 'django.db.models.BigAutoField'
    # IL FAUT AJOUTER 'apps.' DEVANT
    name = 'apps.access_request'
