"""
Models for Operations app matching Supabase schema.
"""

import uuid
from django.db import models


class InternalTransfer(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('DRAFT', 'Draft'),
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transfer_number = models.CharField(max_length=50, unique=True)
    from_zone_id = models.CharField(max_length=100)
    to_zone_id = models.CharField(max_length=100)
    scheduled_date = models.DateField(null=True, blank=True)
    reason = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    cancellation_reason = models.TextField(blank=True, default='')
    created_by = models.CharField(max_length=100, null=True, blank=True)
    responsible_user_id = models.CharField(max_length=100, null=True, blank=True)
    warehouse_id = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'internal_transfers'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transfer_number} ({self.from_zone_id} -> {self.to_zone_id})"


class InternalTransferItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transfer = models.ForeignKey(
        InternalTransfer,
        on_delete=models.CASCADE,
        db_column='transfer_id',
        related_name='items'
    )
    product_id = models.CharField(max_length=100, null=True, blank=True)
    requested_quantity = models.DecimalField(max_digits=12, decimal_places=2, default=1.0)
    approved_quantity = models.DecimalField(max_digits=12, decimal_places=2, default=1.0)
    transferred_quantity = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    unit_of_measure = models.CharField(max_length=50, default='Units', blank=True)
    source_location_id = models.CharField(max_length=100, null=True, blank=True)
    destination_location_id = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'internal_transfer_items'
        managed = False
        ordering = ['created_at']


class ReceiptOperation(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    operation_type = models.CharField(max_length=50, default='receipt')
    partner_name = models.CharField(max_length=255, blank=True, default='')  # Supplier
    source_location = models.CharField(max_length=255, blank=True, default='')
    destination_location = models.CharField(max_length=255, default='Main Warehouse - Rack A-12')
    status = models.CharField(max_length=30, default='draft')
    tracking_number = models.CharField(max_length=100, blank=True, default='')
    po_reference = models.CharField(max_length=100, blank=True, default='')
    total_items = models.IntegerField(default=0)
    notes = models.TextField(blank=True, default='')
    scheduled_date = models.DateTimeField(null=True, blank=True)
    created_date = models.DateTimeField(null=True, blank=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'operations'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.id} - {self.partner_name} ({self.status})"


class ReceiptItem(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    operation = models.ForeignKey(
        ReceiptOperation,
        on_delete=models.CASCADE,
        db_column='operation_id',
        related_name='items'
    )
    product_id = models.CharField(max_length=100, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True, default='')
    sku = models.CharField(max_length=100, blank=True, default='')
    demanded_or_expected = models.IntegerField(default=1)
    done_or_received = models.IntegerField(default=0)
    picked_qty = models.IntegerField(default=0)
    packed_qty = models.IntegerField(default=0)
    available_qty = models.IntegerField(default=0)
    uom = models.CharField(max_length=50, default='Units', blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'operation_items'
        managed = False
        ordering = ['created_at']
