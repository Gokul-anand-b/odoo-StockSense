"""
Serializers for Product model matching Supabase schema.
"""

from rest_framework import serializers
from .models import Product, Category
import uuid


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'code', 'description']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(write_only=True, required=False, allow_blank=True)
    category_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    category_name = serializers.CharField(read_only=True)
    stock = serializers.IntegerField(source='stock_on_hand', required=False)
    reorder_point = serializers.IntegerField(source='min_stock_level', required=False)
    safety_stock = serializers.IntegerField(source='min_stock_level', required=False)
    initial_stock = serializers.IntegerField(write_only=True, required=False)
    unit_price = serializers.DecimalField(source='price', max_digits=12, decimal_places=2, required=False)
    status_type = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id',
            'sku',
            'barcode',
            'name',
            'category_id',
            'category',
            'category_name',
            'price',
            'unit_price',
            'cost_price',
            'stock_on_hand',
            'stock',
            'initial_stock',
            'min_stock_level',
            'reorder_point',
            'safety_stock',
            'max_stock_level',
            'unit_of_measure',
            'status',
            'status_type',
            'warehouse',
            'description',
            'image_url',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'id': {'required': False},
            'sku': {'required': False},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Expose category string for seamless frontend compatibility
        data['category'] = instance.category.name if instance.category else (instance.category_id or 'General')
        return data

    def _resolve_category(self, cat_input):
        if not cat_input:
            return None
        category_obj = Category.objects.filter(id=cat_input).first() or Category.objects.filter(name__iexact=cat_input).first()
        if not category_obj:
            code_prefix = cat_input[:4].upper()
            cat_id = f"cat-{cat_input.lower().replace(' ', '-')[:15]}"
            category_obj, _ = Category.objects.get_or_create(
                id=cat_id,
                defaults={'name': cat_input, 'code': code_prefix}
            )
        return category_obj

    def create(self, validated_data):
        initial_stock = validated_data.pop('initial_stock', None)
        if initial_stock is not None and 'stock_on_hand' not in validated_data:
            validated_data['stock_on_hand'] = int(initial_stock)
            
        if 'initial_stock' in self.initial_data and 'stock_on_hand' not in validated_data:
            validated_data['stock_on_hand'] = int(self.initial_data['initial_stock'])
        if 'unitPrice' in self.initial_data and 'price' not in validated_data:
            validated_data['price'] = float(self.initial_data['unitPrice'])
        if 'reorderPoint' in self.initial_data and 'min_stock_level' not in validated_data:
            validated_data['min_stock_level'] = int(self.initial_data['reorderPoint'])

        # Handle Category mapping
        cat_input = validated_data.pop('category', None) or self.initial_data.get('category') or self.initial_data.get('category_id')
        if cat_input:
            validated_data['category'] = self._resolve_category(cat_input)

        if not validated_data.get('id'):
            validated_data['id'] = validated_data.get('sku') or str(uuid.uuid4())
        if not validated_data.get('sku'):
            validated_data['sku'] = validated_data.get('id')

        return super().create(validated_data)

    def update(self, instance, validated_data):
        initial_stock = validated_data.pop('initial_stock', None)
        if initial_stock is not None:
            validated_data['stock_on_hand'] = int(initial_stock)
        elif 'initial_stock' in self.initial_data:
            validated_data['stock_on_hand'] = int(self.initial_data['initial_stock'])

        if 'unitPrice' in self.initial_data and 'price' not in validated_data:
            validated_data['price'] = float(self.initial_data['unitPrice'])
        if 'reorderPoint' in self.initial_data and 'min_stock_level' not in validated_data:
            validated_data['min_stock_level'] = int(self.initial_data['reorderPoint'])

        cat_input = validated_data.pop('category', None) or self.initial_data.get('category') or self.initial_data.get('category_id')
        if cat_input:
            validated_data['category'] = self._resolve_category(cat_input)

        return super().update(instance, validated_data)
