"""
Dashboard KPI API — returns real-time stats from Supabase tables.
Optimized for immediate response time.
"""

import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count, Q, F

from apps.products.models import Product, Category
from apps.operations.models import InternalTransfer


_DASHBOARD_CACHE = {
    'data': None,
    'timestamp': 0
}
CACHE_TTL = 30  # seconds



def invalidate_dashboard_cache():
    global _DASHBOARD_CACHE
    _DASHBOARD_CACHE['data'] = None
    _DASHBOARD_CACHE['timestamp'] = 0


class DashboardKPIView(APIView):
    """
    GET /api/dashboard/kpis/
    Returns live KPI stats computed from products, categories, and transfers.
    Optimized to compute stats in 3 aggregate database queries with 3s fast caching.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        now = time.time()
        # Serve from fast memory cache if fresh
        if _DASHBOARD_CACHE['data'] is not None and (now - _DASHBOARD_CACHE['timestamp']) < CACHE_TTL:
            return Response(_DASHBOARD_CACHE['data'])

        # ── Query 1: All Product stats in 1 aggregated query ──
        prod_stats = Product.objects.aggregate(
            total_skus=Count('id'),
            low_stock=Count('id', filter=Q(stock_on_hand__lte=F('min_stock_level'), min_stock_level__gt=0)),
            out_of_stock_min0=Count('id', filter=Q(stock_on_hand=0, min_stock_level=0)),
            negative_stock=Count('id', filter=Q(stock_on_hand__lt=0)),
            out_of_stock_all=Count('id', filter=Q(stock_on_hand=0)),
            warehouse_zones=Count('warehouse', distinct=True)
        )

        total_skus = prod_stats['total_skus'] or 0
        low_stock_count = prod_stats['low_stock'] or 0
        out_of_stock_count = prod_stats['out_of_stock_all'] or 0
        safety_alerts = low_stock_count + (prod_stats['out_of_stock_min0'] or 0)
        negative_stock = prod_stats['negative_stock'] or 0
        warehouse_zones = prod_stats['warehouse_zones'] or 0

        # ── Query 2: Category count in 1 query ──
        total_categories = Category.objects.count()

        # ── Query 3: All Transfer status counts in 1 aggregated query ──
        trf_stats = InternalTransfer.objects.aggregate(
            pending=Count('id', filter=Q(status='PENDING')),
            draft=Count('id', filter=Q(status='DRAFT')),
            scheduled=Count('id', filter=Q(status='SCHEDULED')),
            in_progress=Count('id', filter=Q(status='IN_PROGRESS')),
        )

        pending_count = trf_stats['pending'] or 0
        draft_count = trf_stats['draft'] or 0
        scheduled_count = trf_stats['scheduled'] or 0
        in_progress_count = trf_stats['in_progress'] or 0

        total_pending = pending_count + draft_count + scheduled_count + in_progress_count

        parts = []
        if pending_count:
            parts.append(f"{pending_count} pending")
        if draft_count:
            parts.append(f"{draft_count} draft")
        if scheduled_count:
            parts.append(f"{scheduled_count} scheduled")
        if in_progress_count:
            parts.append(f"{in_progress_count} in progress")
        pending_breakdown = ', '.join(parts) if parts else 'No active operations'

        # ── KPI 4: Ledger Integrity ──
        if total_skus > 0:
            integrity = round(((total_skus - negative_stock) / total_skus) * 100, 1)
        else:
            integrity = 100.0

        response_data = {
            'total_skus': total_skus,
            'total_categories': total_categories,
            'warehouse_zones': warehouse_zones,
            'pending_operations': total_pending,
            'pending_breakdown': pending_breakdown,
            'safety_stock_alerts': safety_alerts,
            'low_stock_skus': low_stock_count,
            'out_of_stock_skus': out_of_stock_count,
            'ledger_integrity': integrity,
            'negative_stock_count': negative_stock,
        }

        # Store in cache
        _DASHBOARD_CACHE['data'] = response_data
        _DASHBOARD_CACHE['timestamp'] = now

        return Response(response_data)

