"""
URL routing for operations module: deliveries, receipts, transfers.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OperationViewSet, DeliveryViewSet, ReceiptViewSet, TransferViewSet

router = DefaultRouter()
router.register(r'deliveries', DeliveryViewSet, basename='delivery')
router.register(r'receipts', ReceiptViewSet, basename='receipt')
router.register(r'transfers', TransferViewSet, basename='transfer')
router.register(r'', OperationViewSet, basename='operation')

urlpatterns = [
    path('', include(router.urls)),
]
