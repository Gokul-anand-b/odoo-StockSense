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
