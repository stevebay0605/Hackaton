from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # IL FAUT AJOUTER 'apps.' DEVANT
    name = 'apps.accounts'