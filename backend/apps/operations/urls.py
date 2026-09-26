"""
URL patterns for Operations app.
"""

from django.urls import path
from .views import TransferListCreateView, TransferDetailView

urlpatterns = [
    path('transfers/', TransferListCreateView.as_view(), name='transfer-list-create'),
    path('transfers/<str:pk>/', TransferDetailView.as_view(), name='transfer-detail'),
]
