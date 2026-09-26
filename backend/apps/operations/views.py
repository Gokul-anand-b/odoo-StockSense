"""
Views for Operations app (Internal Transfers API).
"""

from datetime import date
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction

from .models import InternalTransfer, InternalTransferItem
from .serializers import InternalTransferSerializer
from apps.products.models import Product


ZONE_ID_MAP = {
    'Zone A': 'loc-wh-cold-zone-a',
    'Zone B': 'loc-wh-cold-zone-b',
    'Zone C': 'loc-wh-cold-zone-c',
    'Zone D': 'loc-wh-cold-zone-d',
}


class TransferListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        transfers = InternalTransfer.objects.all().order_by('-created_at')
        serializer = InternalTransferSerializer(transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        from_zone = data.get('from_zone') or data.get('from_zone_id') or 'Zone A'
        to_zone = data.get('to_zone') or data.get('to_zone_id') or 'Zone B'
        scheduled_date_raw = data.get('scheduled_date')
        reason = data.get('reason') or data.get('notes') or ''
        responsible = data.get('responsible') or data.get('responsible_user_id')
        if not responsible:
            responsible = None

        units = data.get('units') or data.get('requested_quantity') or 10
        items_input = data.get('items')

        # Generate unique transfer number
        existing_count = InternalTransfer.objects.count()
        transfer_number = f"TRF-{4822 + existing_count}"

        from_zone_id = ZONE_ID_MAP.get(from_zone, from_zone)
        to_zone_id = ZONE_ID_MAP.get(to_zone, to_zone)

        scheduled_date = None
        if scheduled_date_raw:
            try:
                scheduled_date = date.fromisoformat(str(scheduled_date_raw)[:10])
            except (ValueError, TypeError):
                scheduled_date = date.today()
        else:
            scheduled_date = date.today()

        # Get default product_id
        default_prod = Product.objects.first()
        default_prod_id = default_prod.id if default_prod else 'SKU-1'

        with transaction.atomic():
            transfer = InternalTransfer.objects.create(
                transfer_number=transfer_number,
                from_zone_id=from_zone_id,
                to_zone_id=to_zone_id,
                scheduled_date=scheduled_date,
                reason=reason,
                status='PENDING',
                responsible_user_id=responsible,
            )

            if items_input and isinstance(items_input, list) and len(items_input) > 0:
                for it in items_input:
                    pid = it.get('product_id') or it.get('product') or default_prod_id
                    qty = float(it.get('requested_quantity') or it.get('units') or units)
                    InternalTransferItem.objects.create(
                        transfer=transfer,
                        product_id=pid,
                        requested_quantity=qty,
                        approved_quantity=qty,
                        transferred_quantity=0.0,
                        unit_of_measure=it.get('unit_of_measure') or 'Units',
                        source_location_id=from_zone_id,
                        destination_location_id=to_zone_id,
                        notes=reason,
                    )
            else:
                qty = float(units) if units else 10.0
                InternalTransferItem.objects.create(
                    transfer=transfer,
                    product_id=default_prod_id,
                    requested_quantity=qty,
                    approved_quantity=qty,
                    transferred_quantity=0.0,
                    unit_of_measure='Units',
                    source_location_id=from_zone_id,
                    destination_location_id=to_zone_id,
                    notes=reason,
                )

        serializer = InternalTransferSerializer(transfer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TransferDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            if '-' in str(pk) and len(str(pk)) > 20:
                transfer = InternalTransfer.objects.get(id=pk)
            else:
                transfer = InternalTransfer.objects.get(transfer_number=pk)
        except InternalTransfer.DoesNotExist:
            return Response({'error': 'Transfer not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InternalTransferSerializer(transfer)
        return Response(serializer.data, status=status.HTTP_200_OK)
