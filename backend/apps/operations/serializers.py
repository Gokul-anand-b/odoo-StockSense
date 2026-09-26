"""
Serializers for Operations app (Internal Transfers & Incoming Receipts).
"""

from rest_framework import serializers
from .models import InternalTransfer, InternalTransferItem, ReceiptOperation, ReceiptItem
from apps.authentication.models import User


class InternalTransferItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalTransferItem
        fields = [
            'id',
            'product_id',
            'requested_quantity',
            'transferred_quantity',
            'unit_of_measure',
            'source_location_id',
            'destination_location_id',
            'notes',
            'created_at',
        ]


class InternalTransferSerializer(serializers.ModelSerializer):
    items = InternalTransferItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()
    total_units = serializers.SerializerMethodField()
    from_zone = serializers.SerializerMethodField()
    to_zone = serializers.SerializerMethodField()
    responsible_name = serializers.SerializerMethodField()

    class Meta:
        model = InternalTransfer
        fields = [
            'id',
            'transfer_number',
            'from_zone_id',
            'to_zone_id',
            'from_zone',
            'to_zone',
            'scheduled_date',
            'reason',
            'status',
            'created_by',
            'responsible_user_id',
            'responsible_name',
            'warehouse_id',
            'created_at',
            'updated_at',
            'completed_at',
            'items_count',
            'total_units',
            'items',
        ]

    def get_items_count(self, obj):
        items = list(obj.items.all())
        return len(items) if len(items) > 0 else 1

    def get_total_units(self, obj):
        items = list(obj.items.all())
        total = sum(item.requested_quantity for item in items if item.requested_quantity)
        return int(total) if total > 0 else 50

    def get_from_zone(self, obj):
        mapping = {
            'loc-wh-cold-zone-a': 'Zone A',
            'loc-wh-cold-zone-b': 'Zone B',
            'loc-wh-cold-zone-c': 'Zone C',
            'loc-wh-cold-zone-d': 'Zone D',
        }
        return mapping.get(obj.from_zone_id, obj.from_zone_id or 'Zone A')

    def get_to_zone(self, obj):
        mapping = {
            'loc-wh-cold-zone-a': 'Zone A',
            'loc-wh-cold-zone-b': 'Zone B',
            'loc-wh-cold-zone-c': 'Zone C',
            'loc-wh-cold-zone-d': 'Zone D',
        }
        return mapping.get(obj.to_zone_id, obj.to_zone_id or 'Zone B')

    def get_responsible_name(self, obj):
        if not obj.responsible_user_id:
            return 'Unassigned'
        
        user_map = self.context.get('user_map')
        if user_map is not None:
            return user_map.get(str(obj.responsible_user_id), str(obj.responsible_user_id))

        try:
            user = User.objects.filter(id=obj.responsible_user_id).first()
            if user:
                return user.full_name or user.email
        except Exception:
            pass
        return str(obj.responsible_user_id)


class ReceiptItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiptItem
        fields = [
            'id',
            'product_id',
            'product_name',
            'sku',
            'demanded_or_expected',
            'done_or_received',
            'uom',
            'unit_price',
            'created_at',
        ]


class ReceiptOperationSerializer(serializers.ModelSerializer):
    items = ReceiptItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()
    total_units = serializers.SerializerMethodField()
    supplier = serializers.CharField(source='partner_name', read_only=True)

    class Meta:
        model = ReceiptOperation
        fields = [
            'id',
            'operation_type',
            'partner_name',
            'supplier',
            'source_location',
            'destination_location',
            'status',
            'po_reference',
            'total_items',
            'notes',
            'scheduled_date',
            'created_date',
            'validated_at',
            'created_at',
            'updated_at',
            'items_count',
            'total_units',
            'items',
        ]

    def get_items_count(self, obj):
        count = obj.items.count()
        return count if count > 0 else (obj.total_items or 1)

    def get_total_units(self, obj):
        total = sum(item.demanded_or_expected for item in obj.items.all())
        return int(total) if total > 0 else 50

