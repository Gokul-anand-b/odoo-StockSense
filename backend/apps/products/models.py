"""
Product and Category models matching Supabase schema.
"""

import uuid
from django.db import models


class Category(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, blank=True, default='')
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'categories'
        managed = False
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f'{self.name} ({self.id})'


class Product(models.Model):
    """
    Product item in inventory catalog.
    """

    id = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    barcode = models.CharField(max_length=100, unique=True, blank=True, null=True)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category,
        to_field='id',
        db_column='category_id',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
    )
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stock_on_hand = models.IntegerField(default=0)
    min_stock_level = models.IntegerField(default=0)
    max_stock_level = models.IntegerField(default=100)
    unit_of_measure = models.CharField(max_length=50, blank=True, default='Units')
    status = models.CharField(max_length=50, blank=True, default='In Stock')
    warehouse = models.CharField(max_length=100, blank=True, default='Central Hub (WH-01)')
    description = models.TextField(blank=True, default='')
    image_url = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        managed = False  # Matches existing Supabase table directly
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f'{self.name} ({self.sku or self.id})'

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = str(uuid.uuid4())
        if not self.sku:
            self.sku = self.id
        if not self.barcode or self.barcode == '':
            self.barcode = None  # Use NULL so unique constraint on barcode doesn't collide with empty strings

        # Compute status matching Supabase CHECK constraint
        if self.stock_on_hand == 0:
            self.status = 'Out of Stock'
        elif self.min_stock_level and self.stock_on_hand <= self.min_stock_level:
            self.status = 'Low Stock'
        else:
            self.status = 'In Stock'
        super().save(*args, **kwargs)

    @property
    def category_name(self):
        return self.category.name if self.category else 'General'

    @property
    def stock(self):
        return self.stock_on_hand

    @property
    def unit_price(self):
        return self.price

    @property
    def reorder_point(self):
        return self.min_stock_level

    @property
    def safety_stock(self):
        return self.min_stock_level

    @property
    def status_type(self):
        if self.stock_on_hand == 0:
            return 'out_of_stock'
        elif self.min_stock_level and self.stock_on_hand <= self.min_stock_level:
            return 'low_stock'
        return 'in_stock'
