"""
Operation and OperationItem models matching Supabase database schema.
"""

import uuid
from django.db import models
from django.utils import timezone


class Operation(models.Model):
    class Type(models.TextChoices):
        DELIVERY = 'delivery', 'Delivery Order'
        RECEIPT = 'receipt', 'Incoming Receipt'
        TRANSFER = 'internal_transfer', 'Internal Transfer'
        ADJUSTMENT = 'adjustment', 'Stock Adjustment'

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        WAITING = 'waiting', 'Waiting'
        READY = 'ready', 'Ready'
        IN_PROGRESS = 'in_progress', 'In Progress'
        DONE = 'done', 'Done'
        CANCELLED = 'cancelled', 'Cancelled'

    id = models.CharField(max_length=100, primary_key=True)
    operation_type = models.CharField(max_length=50, choices=Type.choices, default=Type.DELIVERY)
    partner_name = models.CharField(max_length=255, blank=True, default='')
    source_location = models.CharField(max_length=255, blank=True, default='')
    destination_location = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.DRAFT)
    tracking_number = models.CharField(max_length=100, blank=True, default='')
    po_reference = models.CharField(max_length=100, blank=True, default='')
    total_items = models.IntegerField(default=0)
    notes = models.TextField(blank=True, default='')

    scheduled_date = models.DateTimeField(null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)
    validated_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'operations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.id} ({self.operation_type}) - {self.status}"


class OperationItem(models.Model):
    id = models.CharField(max_length=100, primary_key=True, default=uuid.uuid4)
    operation = models.ForeignKey(Operation, related_name='items', on_delete=models.CASCADE, db_column='operation_id')
    product_id = models.CharField(max_length=100, blank=True, default='')
    product_name = models.CharField(max_length=255, blank=True, default='')
    sku = models.CharField(max_length=100, blank=True, default='')
    demanded_or_expected = models.IntegerField(default=0)
    done_or_received = models.IntegerField(default=0)
    picked_qty = models.IntegerField(default=0)
    packed_qty = models.IntegerField(default=0)
    available_qty = models.IntegerField(default=0)
    uom = models.CharField(max_length=50, default='Units')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'operation_items'

    def __str__(self):
        return f"{self.product_name} ({self.sku}) x {self.demanded_or_expected}"
