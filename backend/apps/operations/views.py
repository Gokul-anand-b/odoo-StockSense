"""
Views for Operations app (Internal Transfers & Incoming Receipts API).
"""

from datetime import date, datetime, time
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction

from .models import InternalTransfer, InternalTransferItem, ReceiptOperation, ReceiptItem
from .serializers import InternalTransferSerializer, ReceiptOperationSerializer
from apps.products.models import Product


ZONE_ID_MAP = {
    'Zone A': 'loc-wh-cold-zone-a',
    'Zone B': 'loc-wh-cold-zone-b',
    'Zone C': 'loc-wh-cold-zone-c',
    'Zone D': 'loc-wh-cold-zone-d',
}


from apps.authentication.models import User
from apps.dashboard.views import invalidate_dashboard_cache
from apps.stock_ledger.views import invalidate_ledger_cache


class TransferListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        transfers = InternalTransfer.objects.prefetch_related('items').all().order_by('-created_at')
        users = User.objects.all()
        user_map = {str(u.id): u.full_name or u.email for u in users}

        serializer = InternalTransferSerializer(
            transfers, many=True, context={'user_map': user_map}
        )
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

        invalidate_dashboard_cache()
        invalidate_ledger_cache()

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


# ──────────────────────────────────────────────
# Incoming Receipts Views
# ──────────────────────────────────────────────
class ReceiptListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        receipts = ReceiptOperation.objects.filter(operation_type='receipt').exclude(po_reference='ADJUSTMENT').order_by('-created_at')
        serializer = ReceiptOperationSerializer(receipts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        supplier = data.get('supplier') or data.get('partner_name') or 'Supplier Corp'
        destination = data.get('destination_location') or data.get('destinationLocation') or 'Main Warehouse - Rack A-12'
        po_ref = data.get('po_reference') or data.get('poReference') or f"PO-{date.today().year}-{ReceiptOperation.objects.count() + 101}"
        notes = data.get('notes') or ''
        scheduled_raw = data.get('scheduled_date') or data.get('scheduledDate')
        items_input = data.get('items', [])
        units_input = data.get('units') or 50

        scheduled_date = timezone.now()
        if scheduled_raw:
            try:
                dt_obj = date.fromisoformat(str(scheduled_raw)[:10])
                scheduled_date = timezone.make_aware(datetime.combine(dt_obj, time.min))
            except Exception:
                scheduled_date = timezone.now()

        new_id = f"REC-2026-{String_Pad(ReceiptOperation.objects.count() + 4, 3)}"

        default_prod = Product.objects.first()
        default_prod_id = default_prod.id if default_prod else 'SKU-1'
        default_prod_name = default_prod.name if default_prod else 'Standard Inventory Item'

        with transaction.atomic():
            receipt = ReceiptOperation.objects.create(
                id=new_id,
                operation_type='receipt',
                partner_name=supplier,
                destination_location=destination,
                status='draft',
                po_reference=po_ref,
                notes=notes,
                scheduled_date=scheduled_date,
                total_items=len(items_input) if items_input else 1
            )

            if items_input and isinstance(items_input, list) and len(items_input) > 0:
                for idx, it in enumerate(items_input):
                    item_id = f"item-rec-{new_id}-{idx+1}"
                    p_name = it.get('product_name') or it.get('product') or default_prod_name
                    sku = it.get('sku') or 'SKU-REC'
                    expected = int(it.get('expected') or it.get('demanded_or_expected') or units_input)
                    unit_p = float(it.get('unit_price') or 0.0)

                    ReceiptItem.objects.create(
                        id=item_id,
                        operation=receipt,
                        product_id=it.get('product_id') or default_prod_id,
                        product_name=p_name,
                        sku=sku,
                        demanded_or_expected=expected,
                        done_or_received=expected,
                        uom=it.get('uom') or 'Units',
                        unit_price=unit_p
                    )
            else:
                item_id = f"item-rec-{new_id}-1"
                expected_qty = int(units_input)
                ReceiptItem.objects.create(
                    id=item_id,
                    operation=receipt,
                    product_id=default_prod_id,
                    product_name=default_prod_name,
                    sku='SKU-REC',
                    demanded_or_expected=expected_qty,
                    done_or_received=expected_qty,
                    uom='Units',
                    unit_price=100.00
                )

        serializer = ReceiptOperationSerializer(receipt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReceiptDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            receipt = ReceiptOperation.objects.get(id=pk)
        except ReceiptOperation.DoesNotExist:
            return Response({'error': 'Receipt not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReceiptOperationSerializer(receipt)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReceiptValidateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            receipt = ReceiptOperation.objects.get(id=pk)
        except ReceiptOperation.DoesNotExist:
            return Response({'error': 'Receipt not found'}, status=status.HTTP_404_NOT_FOUND)

        if receipt.status == 'done':
            return Response({'message': 'Receipt is already validated'}, status=status.HTTP_200_OK)

        with transaction.atomic():
            receipt.status = 'done'
            receipt.validated_at = timezone.now()
            receipt.save()

            # Update stock on hand for each item in product catalog
            for item in receipt.items.all():
                qty = item.done_or_received if item.done_or_received > 0 else item.demanded_or_expected
                if item.product_id:
                    try:
                        product = Product.objects.get(id=item.product_id)
                        product.stock_on_hand += qty
                        product.save()
                    except Product.DoesNotExist:
                        pass

        serializer = ReceiptOperationSerializer(receipt)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SupplierListAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        db_suppliers = list(
            ReceiptOperation.objects.exclude(partner_name='')
            .values_list('partner_name', flat=True)
            .distinct()
        )
        defaults = [
            'Apex Industrial Supply Corp',
            'Espressif Systems Direct',
            'Stark Industries Logistics',
            'MetalCraft Steel & Alloys'
        ]
        combined = list(dict.fromkeys(defaults + db_suppliers))
        return Response(combined, status=status.HTTP_200_OK)


class AdjustmentListCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        adjustments = ReceiptOperation.objects.filter(po_reference='ADJUSTMENT').order_by('-created_at')
        res = []
        for adj in adjustments:
            first_item = adj.items.first()
            p_name = first_item.product_name if first_item else 'Inventory Item'
            sku = first_item.sku if first_item else 'SKU-000'
            expected = first_item.demanded_or_expected if first_item else 0
            actual = first_item.done_or_received if first_item else 0
            delta = first_item.picked_qty if first_item else (actual - expected)
            res.append({
                'id': adj.id,
                'type': adj.partner_name.replace('Adjustment - ', '').replace('Stock Adjustment - ', '') if adj.partner_name else 'Cycle Count',
                'product_id': first_item.product_id if first_item else '',
                'product': p_name,
                'sku': sku,
                'expected': expected,
                'actual': actual,
                'delta': delta,
                'zone': adj.source_location or 'Zone A',
                'reason': adj.notes or '',
                'date': adj.created_at.strftime('%Y-%m-%d') if adj.created_at else timezone.now().strftime('%Y-%m-%d'),
            })
        return Response(res, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        product_id = data.get('product_id') or data.get('product')
        sku = data.get('sku')
        adjustment_type = data.get('adjustment_type') or data.get('type') or 'Cycle Count'
        counted_qty = int(data.get('counted_quantity') or data.get('actual') or 0)
        zone = data.get('zone') or data.get('location') or 'Zone A'
        reason = data.get('reason') or data.get('notes') or ''

        # Locate product from database
        product = None
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                pass
        if not product and sku:
            try:
                product = Product.objects.get(sku=sku)
            except Product.DoesNotExist:
                pass

        if not product:
            product = Product.objects.first()

        if not product:
            return Response({'error': 'Product not found in catalog'}, status=status.HTTP_404_NOT_FOUND)

        recorded_qty = product.stock_on_hand
        delta = counted_qty - recorded_qty

        adj_count = ReceiptOperation.objects.filter(po_reference='ADJUSTMENT').count()
        new_id = f"ADJ-2026-{String_Pad(adj_count + 101, 3)}"

        with transaction.atomic():
            # 1. Atomic DB Stock Update
            product.stock_on_hand = counted_qty
            product.save()

            # 2. Immutable Audit Log Creation
            adj_op = ReceiptOperation.objects.create(
                id=new_id,
                operation_type='receipt',
                partner_name=f"Adjustment - {adjustment_type}",
                source_location=zone,
                destination_location=zone,
                status='done',
                po_reference='ADJUSTMENT',
                total_items=1,
                notes=reason,
                scheduled_date=timezone.now(),
                validated_at=timezone.now()
            )

            ReceiptItem.objects.create(
                id=f"item-adj-{new_id}-1",
                operation=adj_op,
                product_id=product.id,
                product_name=product.name,
                sku=product.sku or product.id,
                demanded_or_expected=recorded_qty,
                done_or_received=counted_qty,
                picked_qty=delta,
                uom=product.unit_of_measure or 'Units',
                unit_price=product.price
            )

        resp_data = {
            'id': adj_op.id,
            'type': adjustment_type,
            'product_id': product.id,
            'product': product.name,
            'sku': product.sku or product.id,
            'expected': recorded_qty,
            'actual': counted_qty,
            'delta': delta,
            'zone': zone,
            'reason': reason,
            'date': timezone.now().strftime('%Y-%m-%d'),
            'updated_stock_on_hand': counted_qty
        }
        return Response(resp_data, status=status.HTTP_201_CREATED)


def String_Pad(num, length):
    return str(num).zfill(length)




