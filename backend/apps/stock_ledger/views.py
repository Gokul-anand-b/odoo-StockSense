"""
Stock Ledger (Move History) API — returns real transfer/movement records
from Supabase internal_transfers + internal_transfer_items + products tables.
Optimized for immediate response time.
"""

import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.operations.models import InternalTransfer, InternalTransferItem
from apps.products.models import Product


ZONE_NAME_MAP = {
    'loc-wh-cold-zone-a': 'Zone A',
    'loc-wh-cold-zone-b': 'Zone B',
    'loc-wh-cold-zone-c': 'Zone C',
    'loc-wh-cold-zone-d': 'Zone D',
}

_LEDGER_CACHE = {
    'data': None,
    'timestamp': 0
}
CACHE_TTL = 30  # seconds



def invalidate_ledger_cache():
    global _LEDGER_CACHE
    _LEDGER_CACHE['data'] = None
    _LEDGER_CACHE['timestamp'] = 0


def _zone_display(zone_id):
    """Convert a zone ID to a friendly display name."""
    if not zone_id:
        return 'Unknown'
    return ZONE_NAME_MAP.get(zone_id, zone_id)


def _get_product_cache():
    """Build a dict of product_id -> {sku, name} for fast lookups."""
    products = Product.objects.all().values('id', 'sku', 'name')
    return {str(p['id']): {'sku': p['sku'] or p['id'], 'name': p['name']} for p in products}


class MoveHistoryListView(APIView):
    """
    GET /api/stock-ledger/moves/
    Returns all stock movements derived from internal transfers.
    Supports query params: ?type=transfer&search=keyword
    Optimized to execute only 3 bulk queries regardless of record count.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.query_params.get('search', '').strip().lower()
        type_filter = request.query_params.get('type', 'all').strip().lower()

        now = time.time()
        # Serve unfiltered from fast memory cache if fresh and no search/type filter
        if not search and type_filter == 'all' and _LEDGER_CACHE['data'] is not None and (now - _LEDGER_CACHE['timestamp']) < CACHE_TTL:
            return Response(_LEDGER_CACHE['data'])

        # Query 1: Fetch all transfers ordered by newest first
        transfers = list(InternalTransfer.objects.all().order_by('-created_at'))

        # Query 2: Build product cache for SKU/name lookups
        product_cache = _get_product_cache()

        # Query 3: Fetch all transfer items in a single bulk query and group by transfer_id
        all_items = InternalTransferItem.objects.all()
        items_by_transfer = {}
        for item in all_items:
            items_by_transfer.setdefault(str(item.transfer_id), []).append(item)

        moves = []
        for transfer in transfers:
            items = items_by_transfer.get(str(transfer.id), [])

            from_display = _zone_display(transfer.from_zone_id)
            to_display = _zone_display(transfer.to_zone_id)
            user_display = transfer.responsible_user_id or transfer.created_by or 'System'
            timestamp = transfer.created_at.strftime('%Y-%m-%d %H:%M') if transfer.created_at else ''

            if items:
                for item in items:
                    product_id_str = str(item.product_id) if item.product_id else ''
                    product_info = product_cache.get(product_id_str, {
                        'sku': product_id_str or 'N/A',
                        'name': 'Unknown Product',
                    })

                    qty = float(item.transferred_quantity or item.requested_quantity or 0)

                    moves.append({
                        'id': transfer.transfer_number,
                        'type': 'transfer',
                        'sku': product_info['sku'],
                        'product': product_info['name'],
                        'qty': int(qty) if qty == int(qty) else qty,
                        'from': from_display,
                        'to': to_display,
                        'user': user_display,
                        'date': timestamp,
                        'status': transfer.status,
                    })
            else:
                # Transfer with no items — still show the transfer itself
                moves.append({
                    'id': transfer.transfer_number,
                    'type': 'transfer',
                    'sku': 'N/A',
                    'product': 'No items',
                    'qty': 0,
                    'from': from_display,
                    'to': to_display,
                    'user': user_display,
                    'date': timestamp,
                    'status': transfer.status,
                })

        # Cache unfiltered result
        if not search and type_filter == 'all':
            _LEDGER_CACHE['data'] = moves
            _LEDGER_CACHE['timestamp'] = now

        # Apply type filter
        filtered_moves = moves
        if type_filter and type_filter != 'all':
            filtered_moves = [m for m in filtered_moves if m['type'] == type_filter]

        # Apply search filter
        if search:
            filtered_moves = [
                m for m in filtered_moves
                if search in m['id'].lower()
                or search in m['sku'].lower()
                or search in m['product'].lower()
                or search in m['user'].lower()
            ]

        return Response(filtered_moves)

