// Operation Service for Outgoing Deliveries, Incoming Receipts, Transfers & Adjustments
import { productService } from './productService';

const DELIVERIES_STORAGE_KEY = 'stocksense_deliveries_v1';
const RECEIPTS_STORAGE_KEY = 'stocksense_receipts_v1';
const LEDGER_STORAGE_KEY = 'stocksense_ledger_entries_v1';

const INITIAL_RECEIPTS = [
  {
    id: 'REC-2026-001',
    supplier: 'Apex Industrial Supply Corp',
    destinationLocation: 'Main Warehouse - Rack A-12',
    status: 'ready',
    date: '2026-09-26T08:00:00Z',
    scheduledDate: '2026-09-26T14:00:00Z',
    poReference: 'PO-99420',
    totalItems: 2,
    items: [
      { id: 'item-rec-1', product: 'Industrial High-Torque Servo Motor 4.5kW', sku: 'MOT-SER-8088', expected: 10, received: 10, uom: 'Units', unitPrice: 840.00 },
      { id: 'item-rec-2', product: 'Rugged Wireless Barcode & QR Scanner', sku: 'SCN-QR-900', expected: 20, received: 20, uom: 'Pieces', unitPrice: 190.00 }
    ],
    notes: 'Urgent Q3 component replenishment delivery.'
  },
  {
    id: 'REC-2026-002',
    supplier: 'MetalCraft Steel & Alloys',
    destinationLocation: 'Raw Metal Yard - Bay 3',
    status: 'draft',
    date: '2026-09-26T09:30:00Z',
    scheduledDate: '2026-09-27T10:00:00Z',
    poReference: 'PO-99421',
    totalItems: 1,
    items: [
      { id: 'item-rec-3', product: 'Aerospace Grade Aluminum Sheet 2mm (2x1m)', sku: 'ALU-SHT-2024', expected: 50, received: 0, uom: 'Sheets', unitPrice: 110.00 }
    ],
    notes: 'Bulk raw metal sheets shipment.'
  },
  {
    id: 'REC-2026-003',
    supplier: 'Espressif Systems Direct',
    destinationLocation: 'Cleanroom Storage - Bin 4',
    status: 'done',
    date: '2026-09-25T11:00:00Z',
    scheduledDate: '2026-09-25T11:00:00Z',
    validatedAt: '2026-09-25T11:45:00Z',
    poReference: 'PO-99415',
    totalItems: 1,
    items: [
      { id: 'item-rec-4', product: 'ESP32-S3 Dual-Core Microcontroller Node', sku: 'ESP32-S3-WROOM', expected: 200, received: 200, uom: 'Units', unitPrice: 6.50 }
    ],
    notes: 'Validated and stored in cleanroom storage.'
  }
];

const INITIAL_DELIVERIES = [
  {
    id: 'DEL-2025-001',
    customer: 'Stark Industries Logistics',
    sourceLocation: 'Main Warehouse - Rack A-01',
    status: 'ready',
    date: '2026-09-26T08:30:00Z',
    scheduledDate: '2026-09-26T16:00:00Z',
    trackingNumber: 'TRK-984210',
    totalItems: 3,
    items: [
      { id: 'item-1', product: 'Precision Steel Rods (10mm)', sku: 'STL-ROD-01', demanded: 10, picked: 10, packed: 10, available: 120, uom: 'pcs' },
      { id: 'item-2', product: 'Ergonomic Mesh Office Chair', sku: 'CHR-ERG-99', demanded: 4, picked: 4, packed: 4, available: 24, uom: 'units' },
      { id: 'item-3', product: 'Heavy Duty Aluminum Extrusions', sku: 'ALU-EXT-40', demanded: 15, picked: 15, packed: 15, available: 85, uom: 'kg' },
    ],
    notes: 'Urgent express delivery for automated assembly line.',
  }
];

function getStoredDeliveries() {
  if (typeof window === 'undefined') return INITIAL_DELIVERIES;
  const raw = localStorage.getItem(DELIVERIES_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(DELIVERIES_STORAGE_KEY, JSON.stringify(INITIAL_DELIVERIES));
    return INITIAL_DELIVERIES;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DELIVERIES;
  }
}

function saveDeliveries(deliveries) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DELIVERIES_STORAGE_KEY, JSON.stringify(deliveries));
}

function getStoredReceipts() {
  if (typeof window === 'undefined') return INITIAL_RECEIPTS;
  const raw = localStorage.getItem(RECEIPTS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(INITIAL_RECEIPTS));
    return INITIAL_RECEIPTS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_RECEIPTS;
  }
}

function saveReceipts(receipts) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
}

function appendLedgerEntry(entry) {
  if (typeof window === 'undefined') return;
  let ledger = [];
  try {
    const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (raw) ledger = JSON.parse(raw);
  } catch (e) {}
  ledger.unshift(entry);
  localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
}

export const operationService = {
  // --- INCOMING RECEIPTS ---
  async getReceipts({ status = 'all', search = '' } = {}) {
    const list = getStoredReceipts();
    return list.filter((r) => {
      const matchStatus = status === 'all' || r.status.toLowerCase() === status.toLowerCase();
      const matchSearch =
        !search ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.supplier.toLowerCase().includes(search.toLowerCase()) ||
        (r.poReference && r.poReference.toLowerCase().includes(search.toLowerCase())) ||
        r.items.some((i) => i.product.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchSearch;
    });
  },

  async getReceiptById(id) {
    const list = getStoredReceipts();
    const found = list.find((r) => r.id === id);
    if (!found) throw new Error(`Incoming receipt ${id} not found`);
    return found;
  },

  async createReceipt(data) {
    const list = getStoredReceipts();
    const newId = `REC-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newReceipt = {
      id: newId,
      supplier: data.supplier,
      destinationLocation: data.destinationLocation || 'Main Warehouse - Rack A-12',
      status: 'draft',
      date: new Date().toISOString(),
      scheduledDate: data.scheduledDate || new Date(Date.now() + 86400000).toISOString(),
      poReference: data.poReference || `PO-${Math.floor(90000 + Math.random() * 10000)}`,
      totalItems: data.items ? data.items.length : 0,
      items: (data.items || []).map((it, idx) => ({
        id: `item-rec-${Date.now()}-${idx}`,
        product: it.product,
        sku: it.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        expected: parseInt(it.expected || 1, 10),
        received: parseInt(it.received ?? it.expected ?? 1, 10),
        uom: it.uom || 'Units',
        unitPrice: parseFloat(it.unitPrice || 0)
      })),
      notes: data.notes || '',
    };

    const updated = [newReceipt, ...list];
    saveReceipts(updated);
    return newReceipt;
  },

  async updateReceipt(id, data) {
    const list = getStoredReceipts();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Receipt not found');

    list[index] = {
      ...list[index],
      ...data,
      totalItems: data.items ? data.items.length : list[index].totalItems
    };
    saveReceipts(list);
    return list[index];
  },

  // VALIDATE RECEIPT -> Increases Stock on Hand & Writes Ledger Entry
  async validateReceipt(receiptId) {
    const list = getStoredReceipts();
    const receipt = list.find((r) => r.id === receiptId);
    if (!receipt) throw new Error('Receipt not found');

    if (receipt.status === 'done') {
      throw new Error('Receipt is already validated');
    }

    const validatedTimestamp = new Date().toISOString();
    receipt.status = 'done';
    receipt.validatedAt = validatedTimestamp;

    // Automatically increase stock on hand for each item in receipt
    for (const item of receipt.items) {
      const qtyReceived = parseInt(item.received ?? item.expected, 10);
      await productService.increaseStockOnHand(item.sku || item.product, qtyReceived);
    }

    saveReceipts(list);

    // Create & append Stock Ledger entry
    const ledgerEntry = {
      id: `LEDGER-${Date.now()}`,
      reference: receipt.id,
      operationType: 'Incoming Receipt',
      partner: receipt.supplier,
      location: receipt.destinationLocation,
      timestamp: validatedTimestamp,
      items: receipt.items.map((i) => ({
        product: i.product,
        sku: i.sku,
        qty: parseInt(i.received ?? i.expected, 10),
        type: 'INBOUND',
        uom: i.uom
      })),
      notes: `Validated receipt from ${receipt.supplier}`
    };

    appendLedgerEntry(ledgerEntry);

    return { receipt, ledgerEntry };
  },

  // --- OUTGOING DELIVERIES ---
  async getDeliveries({ status = 'all', search = '' } = {}) {
    const list = getStoredDeliveries();
    return list.filter((order) => {
      const matchStatus = status === 'all' || order.status.toLowerCase() === status.toLowerCase();
      const matchSearch =
        !search ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some((i) => i.product.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchSearch;
    });
  },

  async getDeliveryById(id) {
    const list = getStoredDeliveries();
    const found = list.find((o) => o.id === id);
    if (!found) throw new Error(`Delivery order ${id} not found`);
    return found;
  },

  async createDelivery(data) {
    const list = getStoredDeliveries();
    const newId = `DEL-2025-${String(list.length + 1).padStart(3, '0')}`;
    const newOrder = {
      id: newId,
      customer: data.customer,
      sourceLocation: data.sourceLocation || 'Main Warehouse - Rack A-01',
      status: 'draft',
      date: new Date().toISOString(),
      scheduledDate: data.scheduledDate || new Date(Date.now() + 86400000).toISOString(),
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      totalItems: data.items.length,
      items: data.items.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        product: it.product,
        sku: it.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
        demanded: Number(it.demanded) || 1,
        picked: 0,
        packed: 0,
        available: it.available || 50,
        uom: it.uom || 'units',
      })),
      notes: data.notes || '',
    };

    const updated = [newOrder, ...list];
    saveDeliveries(updated);
    return newOrder;
  },

  async updatePicking(orderId, itemId, pickedQuantity) {
    const list = getStoredDeliveries();
    const order = list.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const item = order.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    item.picked = Math.min(Math.max(0, pickedQuantity), item.demanded);

    const allPicked = order.items.every((i) => i.picked >= i.demanded);
    if (allPicked && order.status === 'draft') {
      order.status = 'ready';
    }

    saveDeliveries(list);
    return order;
  },

  async validateDelivery(orderId) {
    const list = getStoredDeliveries();
    const order = list.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    for (const item of order.items) {
      if (item.available < item.demanded) {
        throw new Error(`Insufficient stock for ${item.product}: demanded ${item.demanded}, available ${item.available}`);
      }
    }

    order.status = 'done';
    order.validatedAt = new Date().toISOString();
    order.items.forEach((item) => {
      item.picked = item.demanded;
      item.packed = item.demanded;
      item.available = Math.max(0, item.available - item.demanded);
    });

    saveDeliveries(list);

    const ledgerEntry = {
      reference: order.id,
      customer: order.customer,
      timestamp: order.validatedAt,
      itemsDeducted: order.items.map((i) => ({
        product: i.product,
        sku: i.sku,
        delta: -i.demanded,
        newBalance: i.available,
      })),
    };

    return { order, ledgerEntry };
  }
};
