"""
Product views and ViewSets with Upsert support.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Products with automatic upsert support.
    If a product with the given SKU already exists, it updates the record.
    """
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        sku = request.data.get('sku') or request.data.get('id')
        if sku:
            existing_product = Product.objects.filter(sku=sku).first() or Product.objects.filter(id=sku).first()
            if existing_product:
                serializer = self.get_serializer(existing_product, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                return Response(serializer.data, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)
