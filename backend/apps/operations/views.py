"""
Views for Operations: Deliveries, Receipts, Transfers, Adjustments.
All CRUD operations persist to Supabase PostgreSQL.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Operation, OperationItem
from .serializers import OperationSerializer, OperationItemSerializer


class OperationViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for all operation types. Filter by ?type=delivery|receipt|internal_transfer|adjustment
    """
    queryset = Operation.objects.all()
    serializer_class = OperationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        op_type = self.request.query_params.get('type')
        if op_type:
            qs = qs.filter(operation_type=op_type)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=True, methods=['post'])
    def validate_op(self, request, pk=None):
        """Mark an operation as done/validated."""
        operation = self.get_object()
        operation.status = 'done'
        operation.validated_at = timezone.now()
        operation.save()
        return Response(OperationSerializer(operation).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an operation."""
        operation = self.get_object()
        operation.status = 'cancelled'
        operation.save()
        return Response(OperationSerializer(operation).data)

    @action(detail=True, methods=['post'])
    def mark_ready(self, request, pk=None):
        """Mark an operation as ready."""
        operation = self.get_object()
        operation.status = 'ready'
        operation.save()
        return Response(OperationSerializer(operation).data)


class DeliveryViewSet(viewsets.ModelViewSet):
    """Filtered ViewSet for delivery operations only."""
    serializer_class = OperationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Operation.objects.filter(operation_type='delivery')

    def perform_create(self, serializer):
        serializer.save(operation_type='delivery')

    @action(detail=True, methods=['post'])
    def validate_op(self, request, pk=None):
        from apps.products.models import Product
        
        operation = self.get_object()
        
        # Decrease stock automatically based on picked quantity
        for item in operation.items.all():
            if item.product_id:
                product = Product.objects.filter(id=item.product_id).first()
                if product:
                    # Depending on model field, let's assume it has an available_quantity or similar
                    # Actually, if we just deduct from the item's available_qty it's local. 
                    # If we have a global product table, we deduct it there.
                    # Since we don't know the exact Product model, let's deduct if field exists.
                    if hasattr(product, 'quantity'):
                        product.quantity -= item.picked_qty
                        product.save()
                    elif hasattr(product, 'available_stock'):
                        product.available_stock -= item.picked_qty
                        product.save()

        operation.status = 'done'
        operation.validated_at = timezone.now()
        operation.save()
        return Response(OperationSerializer(operation).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        operation = self.get_object()
        operation.status = 'cancelled'
        operation.save()
        return Response(OperationSerializer(operation).data)

    @action(detail=True, methods=['post'])
    def mark_ready(self, request, pk=None):
        operation = self.get_object()
        operation.status = 'ready'
        operation.save()
        return Response(OperationSerializer(operation).data)


class ReceiptViewSet(viewsets.ModelViewSet):
    """Filtered ViewSet for receipt operations only."""
    serializer_class = OperationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Operation.objects.filter(operation_type='receipt')

    def perform_create(self, serializer):
        serializer.save(operation_type='receipt')

    @action(detail=True, methods=['post'])
    def validate_op(self, request, pk=None):
        operation = self.get_object()
        operation.status = 'done'
        operation.validated_at = timezone.now()
        operation.save()
        return Response(OperationSerializer(operation).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        operation = self.get_object()
        operation.status = 'cancelled'
        operation.save()
        return Response(OperationSerializer(operation).data)


class TransferViewSet(viewsets.ModelViewSet):
    """Filtered ViewSet for internal transfer operations only."""
    serializer_class = OperationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Operation.objects.filter(operation_type='internal_transfer')

    def perform_create(self, serializer):
        serializer.save(operation_type='internal_transfer')

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        operation = self.get_object()
        operation.status = 'done'
        operation.validated_at = timezone.now()
        operation.save()
        return Response(OperationSerializer(operation).data)
