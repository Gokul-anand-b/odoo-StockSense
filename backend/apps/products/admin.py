"""
Admin configuration for products module.
"""

from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'unit_price', 'stock', 'reorder_point', 'created_at')
    list_filter = ('category', 'warehouse', 'created_at')
    search_fields = ('id', 'name', 'category')
    ordering = ('-created_at',)
