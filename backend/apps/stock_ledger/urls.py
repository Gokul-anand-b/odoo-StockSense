"""
URL patterns for Stock Ledger app.
"""

from django.urls import path
from .views import MoveHistoryListView

urlpatterns = [
    path('moves/', MoveHistoryListView.as_view(), name='move-history-list'),
]
