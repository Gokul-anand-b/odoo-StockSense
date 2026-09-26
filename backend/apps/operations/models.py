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
