"""
Product and Category views and ViewSets with Upsert support.
"""

import time
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from apps.dashboard.views import invalidate_dashboard_cache
from apps.stock_ledger.views import invalidate_ledger_cache


_PROD_CACHE = {'data': None, 'timestamp': 0}
_CAT_CACHE = {'data': None, 'timestamp': 0}
CACHE_TTL = 30  # seconds



def invalidate_prod_cat_caches():
    global _PROD_CACHE, _CAT_CACHE
    _PROD_CACHE['data'] = None
    _PROD_CACHE['timestamp'] = 0
    _CAT_CACHE['data'] = None
    _CAT_CACHE['timestamp'] = 0
    invalidate_dashboard_cache()
    invalidate_ledger_cache()


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Categories.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        global _CAT_CACHE
        now = time.time()
        has_query = len(request.query_params) > 0
        if not has_query and _CAT_CACHE['data'] is not None and (now - _CAT_CACHE['timestamp']) < CACHE_TTL:
            return Response(_CAT_CACHE['data'])
        response = super().list(request, *args, **kwargs)
        if not has_query:
            _CAT_CACHE['data'] = dict(response.data) if isinstance(response.data, dict) else list(response.data)
            _CAT_CACHE['timestamp'] = now
        return response

    def create(self, request, *args, **kwargs):
        res = super().create(request, *args, **kwargs)
        invalidate_prod_cat_caches()
        return res

    def update(self, request, *args, **kwargs):
        res = super().update(request, *args, **kwargs)
        invalidate_prod_cat_caches()
        return res

    def destroy(self, request, *args, **kwargs):
        res = super().destroy(request, *args, **kwargs)
        invalidate_prod_cat_caches()
        return res


class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Products with automatic upsert support.
    If a product with the given SKU already exists, it updates the record.
    """
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        global _PROD_CACHE
        now = time.time()
        has_query = len(request.query_params) > 0
        if not has_query and _PROD_CACHE['data'] is not None and (now - _PROD_CACHE['timestamp']) < CACHE_TTL:
            return Response(_PROD_CACHE['data'])
        response = super().list(request, *args, **kwargs)
        if not has_query:
            _PROD_CACHE['data'] = dict(response.data) if isinstance(response.data, dict) else list(response.data)
            _PROD_CACHE['timestamp'] = now
        return response





    def create(self, request, *args, **kwargs):
        sku = request.data.get('sku') or request.data.get('id')
        if sku:
            existing_product = Product.objects.filter(sku=sku).first() or Product.objects.filter(id=sku).first()
            if existing_product:
                serializer = self.get_serializer(existing_product, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                invalidate_prod_cat_caches()
                return Response(serializer.data, status=status.HTTP_200_OK)

        res = super().create(request, *args, **kwargs)
        invalidate_prod_cat_caches()
        return res

    def update(self, request, *args, **kwargs):
        res = super().update(request, *args, **kwargs)
        invalidate_prod_cat_caches()
        return res

    def destroy(self, request, *args, **kwargs):
        res = super().destroy(request, *args, **kwargs)
        invalidate_prod_cat_caches()
        return res

