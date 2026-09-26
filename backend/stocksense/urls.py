"""
Root URL configuration for StockSense.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/categories/', include('apps.products.urls')),
    path('api/operations/', include('apps.operations.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
    path('api/stock-ledger/', include('apps.stock_ledger.urls')),
]
