"""
URL patterns for Operations app (Transfers & Receipts).
"""

from django.urls import path
from .views import (
    TransferListCreateView,
    TransferDetailView,
    ReceiptListCreateView,
    ReceiptDetailView,
    ReceiptValidateView,
    SupplierListAPIView,
    AdjustmentListCreateView,
)

urlpatterns = [
    # ── Internal Transfers ──
    path('transfers/', TransferListCreateView.as_view(), name='transfer-list-create'),
    path('transfers/<str:pk>/', TransferDetailView.as_view(), name='transfer-detail'),

    # ── Goods Receipts ──
    path('receipts/', ReceiptListCreateView.as_view(), name='receipt-list-create'),
    path('receipts/<str:pk>/', ReceiptDetailView.as_view(), name='receipt-detail'),
    path('receipts/<str:pk>/validate/', ReceiptValidateView.as_view(), name='receipt-validate'),

    # ── Suppliers ──
    path('suppliers/', SupplierListAPIView.as_view(), name='supplier-list'),

    # ── Stock Adjustments ──
    path('adjustments/', AdjustmentListCreateView.as_view(), name='adjustment-list-create'),
]


