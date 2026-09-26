"""
Serializers for Operation and OperationItem models.
"""

from rest_framework import serializers
from .models import Operation, OperationItem
import uuid


class OperationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationItem
        fields = [
            'id',
            'operation',
            'product_id',
            'product_name',
            'sku',
            'demanded_or_expected',
            'done_or_received',
            'picked_qty',
            'packed_qty',
            'available_qty',
            'uom',
            'unit_price',
            'created_at',
        ]
        extra_kwargs = {
            'operation': {'required': False},
            'id': {'required': False},
        }


class OperationSerializer(serializers.ModelSerializer):
    items = OperationItemSerializer(many=True, required=False)

    class Meta:
        model = Operation
        fields = [
            'id',
            'operation_type',
            'partner_name',
            'source_location',
            'destination_location',
            'status',
            'tracking_number',
            'po_reference',
            'total_items',
            'notes',
            'scheduled_date',
            'created_date',
            'validated_at',
            'created_at',
            'updated_at',
            'items',
        ]
        extra_kwargs = {
            'id': {'required': False},
        }

    def create(self, validated_data):
        from apps.products.models import Product
        
        items_data = validated_data.pop('items', [])
        if not validated_data.get('id'):
            op_type = validated_data.get('operation_type', 'delivery')
            prefix = 'DEL' if op_type == 'delivery' else ('REC' if op_type == 'receipt' else 'TRN')
            validated_data['id'] = f"{prefix}-{uuid.uuid4().hex[:6].upper()}"

        operation = Operation.objects.create(**validated_data)

        for item_data in items_data:
            if not item_data.get('id'):
                item_data['id'] = f"item-{uuid.uuid4().hex[:6]}"
            
            # Ensure product_id is valid by looking up or creating the product
            sku = item_data.get('sku')
            name = item_data.get('product_name', 'Unknown Product')
            product = None
            if sku:
                product = Product.objects.filter(sku=sku).first()
            if not product:
                product = Product.objects.filter(name=name).first()
            if not product:
                # Create a temporary product to satisfy FK
                product = Product.objects.create(name=name, sku=sku if sku else str(uuid.uuid4())[:8])
            
            item_data['product_id'] = product.id
            item_data['product_name'] = product.name
            if not item_data.get('sku'):
                item_data['sku'] = product.sku

            OperationItem.objects.create(operation=operation, **item_data)

        return operation

    def update(self, instance, validated_data):
        from apps.products.models import Product
        
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                if not item_data.get('id'):
                    item_data['id'] = f"item-{uuid.uuid4().hex[:6]}"
                
                sku = item_data.get('sku')
                name = item_data.get('product_name', 'Unknown Product')
                product = None
                if sku:
                    product = Product.objects.filter(sku=sku).first()
                if not product:
                    product = Product.objects.filter(name=name).first()
                if not product:
                    product = Product.objects.create(name=name, sku=sku if sku else str(uuid.uuid4())[:8])
                
                item_data['product_id'] = product.id
                item_data['product_name'] = product.name
                if not item_data.get('sku'):
                    item_data['sku'] = product.sku
                
                OperationItem.objects.create(operation=instance, **item_data)

        return instance
