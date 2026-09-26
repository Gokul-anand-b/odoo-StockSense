// Operation Service for Outgoing Deliveries, Receipts, Transfers & Adjustments
// Connects to Django Backend or uses reactive local cache during development

const STORAGE_KEY = 'stocksense_deliveries_v1';

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
  },
  {
    id: 'DEL-2025-002',
    customer: 'Apex Global Robotics',
    sourceLocation: 'Central Depot - Bay 4',
    status: 'waiting',
    date: '2026-09-26T09:15:00Z',
    scheduledDate: '2026-09-27T10:00:00Z',
    trackingNumber: 'TRK-984211',
    totalItems: 2,
    items: [
      { id: 'item-4', product: 'Hydraulic Actuator Pump', sku: 'ACT-HYD-500', demanded: 6, picked: 2, packed: 0, available: 2, uom: 'units' },
      { id: 'item-5', product: 'Braided Stainless Steel Hose', sku: 'HSE-SS-12', demanded: 12, picked: 12, packed: 6, available: 40, uom: 'meters' },
    ],
    notes: 'Awaiting remaining 4 actuators from incoming vendor receipt.',
  },
  {
    id: 'DEL-2025-003',
    customer: 'Tesla Supercharger Dept',
    sourceLocation: 'Main Warehouse - Bay 2',
    status: 'draft',
    date: '2026-09-26T09:40:00Z',
    scheduledDate: '2026-09-28T14:00:00Z',
    trackingNumber: 'PENDING',
    totalItems: 1,
    items: [
      { id: 'item-6', product: 'High Voltage Copper Busbars', sku: 'BUS-CU-400A', demanded: 30, picked: 0, packed: 0, available: 95, uom: 'pcs' },
    ],
    notes: 'Standard freight pallet shipment.',
  },
  {
    id: 'DEL-2025-004',
    customer: 'Wayne Enterprises Tech Lab',
    sourceLocation: 'Main Warehouse - Secure Vault B',
    status: 'done',
    date: '2026-09-25T14:20:00Z',
    scheduledDate: '2026-09-25T18:00:00Z',
    validatedAt: '2026-09-25T17:45:10Z',
    trackingNumber: 'TRK-984198',
    totalItems: 2,
    items: [
      { id: 'item-7', product: 'Carbon Fiber Reinforced Panels', sku: 'CF-PNL-2X4', demanded: 8, picked: 8, packed: 8, available: 32, uom: 'sheets' },
      { id: 'item-8', product: 'Titanium Fastener Kit M8', sku: 'TI-FST-M8', demanded: 50, picked: 50, packed: 50, available: 200, uom: 'kits' },
    ],
    notes: 'Validated and dispatched via DHL Express.',
  },
];

function getStoredDeliveries() {
  if (typeof window === 'undefined') return INITIAL_DELIVERIES;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DELIVERIES));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
}

export const operationService = {
  // Fetch deliveries with optional search and status filter
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

  // Get delivery by ID
  async getDeliveryById(id) {
    const list = getStoredDeliveries();
    const found = list.find((o) => o.id === id);
    if (!found) throw new Error(`Delivery order ${id} not found`);
    return found;
  },

  // Create new delivery order
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

  // Update item picking quantity
  async updatePicking(orderId, itemId, pickedQuantity) {
    const list = getStoredDeliveries();
    const order = list.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const item = order.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    item.picked = Math.min(Math.max(0, pickedQuantity), item.demanded);

    // Auto-update status
    const allPicked = order.items.every((i) => i.picked >= i.demanded);
    if (allPicked && order.status === 'draft') {
      order.status = 'ready';
    }

    saveDeliveries(list);
    return order;
  },

  // Update item packing quantity
  async updatePacking(orderId, itemId, packedQuantity) {
    const list = getStoredDeliveries();
    const order = list.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const item = order.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');

    item.packed = Math.min(Math.max(0, packedQuantity), item.picked);
    saveDeliveries(list);
    return order;
  },

  // Validate Delivery -> Atomically Decrements Stock & Writes to Ledger
  async validateDelivery(orderId) {
    const list = getStoredDeliveries();
    const order = list.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    // Check stock availability
    for (const item of order.items) {
      if (item.available < item.demanded) {
        throw new Error(`Insufficient stock for ${item.product}: demanded ${item.demanded}, available ${item.available}`);
      }
    }

    // Mark as done and deduct stock
    order.status = 'done';
    order.validatedAt = new Date().toISOString();
    order.items.forEach((item) => {
      item.picked = item.demanded;
      item.packed = item.demanded;
      item.available = Math.max(0, item.available - item.demanded);
    });

    saveDeliveries(list);

    // Log to simulated ledger
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
  },
};
