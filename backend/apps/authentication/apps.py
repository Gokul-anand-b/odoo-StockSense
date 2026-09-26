"""
App configuration for the authentication module.
"""

from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'
    verbose_name = 'Authentication & RBAC'

    def ready(self):
        import apps.authentication.signals  # noqa: F401
