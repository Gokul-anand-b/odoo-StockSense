const API_URL = 'http://localhost:8000/api/operations';

export const operationService = {
  // --- INTERNAL TRANSFERS ---
  async getTransfers({ status = 'all', search = '' } = {}) {
    const res = await fetch(`${API_URL}/transfers/`);
    if (!res.ok) throw new Error('Failed to fetch transfers');
    const data = await res.json();
    return data.results.map(mapApiToTransfer).filter(t => {
      const matchStatus = status === 'all' || t.status.toLowerCase() === status.toLowerCase();
      const matchSearch = !search || t.id.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  },

  async getTransferById(id) {
    const res = await fetch(`${API_URL}/transfers/${id}/`);
    if (!res.ok) throw new Error(`Transfer ${id} not found`);
    return mapApiToTransfer(await res.json());
  },

  async createTransfer(data) {
    const payload = {
      operation_type: 'internal_transfer',
      source_location: data.sourceLocation,
      destination_location: data.destinationLocation,
      status: 'draft',
      scheduled_date: data.scheduledDate || new Date().toISOString(),
      notes: data.notes || '',
      items: (data.items || []).map(it => ({
        product_name: it.product,
        sku: it.sku,
        demanded_or_expected: parseInt(it.qtyToTransfer || 1, 10),
        uom: it.uom || 'Units'
      }))
    };
    const res = await fetch(`${API_URL}/transfers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create transfer');
    return mapApiToTransfer(await res.json());
  },

  async validateTransfer(id) {
    const res = await fetch(`${API_URL}/transfers/${id}/confirm/`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to validate transfer');
    return { transfer: mapApiToTransfer(await res.json()) };
  },

  // --- INCOMING RECEIPTS ---
  async getReceipts({ status = 'all', search = '' } = {}) {
    const res = await fetch(`${API_URL}/receipts/`);
    if (!res.ok) throw new Error('Failed to fetch receipts');
    const data = await res.json();
    return data.results.map(mapApiToReceipt).filter(r => {
      const matchStatus = status === 'all' || r.status.toLowerCase() === status.toLowerCase();
      const matchSearch = !search || r.id.toLowerCase().includes(search.toLowerCase()) || (r.supplier && r.supplier.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchSearch;
    });
  },

  async getReceiptById(id) {
    const res = await fetch(`${API_URL}/receipts/${id}/`);
    if (!res.ok) throw new Error(`Receipt ${id} not found`);
    return mapApiToReceipt(await res.json());
  },

  async createReceipt(data) {
    const payload = {
      operation_type: 'receipt',
      partner_name: data.supplier,
      destination_location: data.destinationLocation,
      status: 'draft',
      po_reference: data.poReference,
      scheduled_date: data.scheduledDate || new Date().toISOString(),
      notes: data.notes || '',
      items: (data.items || []).map(it => ({
        product_name: it.product,
        sku: it.sku,
        demanded_or_expected: parseInt(it.expected || 1, 10),
        done_or_received: parseInt(it.received || it.expected || 1, 10),
        uom: it.uom || 'Units',
        unit_price: parseFloat(it.unitPrice || 0)
      }))
    };
    const res = await fetch(`${API_URL}/receipts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create receipt');
    return mapApiToReceipt(await res.json());
  },

  async validateReceipt(id) {
    const res = await fetch(`${API_URL}/receipts/${id}/validate_op/`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to validate receipt');
    return { receipt: mapApiToReceipt(await res.json()) };
  },

  // --- OUTGOING DELIVERIES ---
  async getDeliveries({ status = 'all', search = '' } = {}) {
    const res = await fetch(`${API_URL}/deliveries/`);
    if (!res.ok) throw new Error('Failed to fetch deliveries');
    const data = await res.json();
    return data.results.map(mapApiToDelivery).filter(d => {
      const matchStatus = status === 'all' || d.status.toLowerCase() === status.toLowerCase();
      const matchSearch = !search || d.id.toLowerCase().includes(search.toLowerCase()) || (d.customer && d.customer.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchSearch;
    });
  },

  async getDeliveryById(id) {
    const res = await fetch(`${API_URL}/deliveries/${id}/`);
    if (!res.ok) throw new Error(`Delivery ${id} not found`);
    return mapApiToDelivery(await res.json());
  },

  async createDelivery(data) {
    const payload = {
      operation_type: 'delivery',
      partner_name: data.customer,
      source_location: data.sourceLocation,
      status: 'draft',
      scheduled_date: data.scheduledDate || new Date().toISOString(),
      notes: data.notes || '',
      items: (data.items || []).map(it => ({
        product_name: it.product,
        sku: it.sku,
        demanded_or_expected: parseInt(it.demanded || 1, 10),
        picked_qty: 0,
        packed_qty: 0,
        available_qty: it.available || 50,
        uom: it.uom || 'Units'
      }))
    };
    const res = await fetch(`${API_URL}/deliveries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create delivery');
    return mapApiToDelivery(await res.json());
  },

  async validateDelivery(id) {
    const res = await fetch(`${API_URL}/deliveries/${id}/validate_op/`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to validate delivery');
    return { order: mapApiToDelivery(await res.json()) };
  },
  
  async updatePicking(orderId, itemId, pickedQuantity) {
    // Ideally this would be a PATCH on the item, but we'll re-save the whole delivery to match the mock behavior
    const delivery = await this.getDeliveryById(orderId);
    
    // We update the item and mark ready if needed
    const payload = {
      items: delivery.itemList.map(i => {
        if (i.id === itemId || i.original_id === itemId) {
          return {
             id: i.original_id,
             product_name: i.product,
             sku: i.sku,
             demanded_or_expected: i.demanded,
             picked_qty: pickedQuantity,
             packed_qty: i.packed,
             available_qty: i.available,
             uom: i.uom
          };
        }
        return {
           id: i.original_id,
           product_name: i.product,
           sku: i.sku,
           demanded_or_expected: i.demanded,
           picked_qty: i.picked,
           packed_qty: i.packed,
           available_qty: i.available,
           uom: i.uom
        };
      })
    };
    
    // We send PUT or PATCH to update
    let res = await fetch(`${API_URL}/deliveries/${orderId}/`, {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
       const errBody = await res.text();
       console.error("PATCH ERROR:", errBody);
       throw new Error(`Failed to update picking: ${errBody}`);
    }
    
    const updated = await res.json();
    const mapped = mapApiToDelivery(updated);
    
    const allPicked = mapped.itemList.every(i => i.picked >= i.demanded);
    if (allPicked && mapped.status === 'draft') {
        // mark ready
        res = await fetch(`${API_URL}/deliveries/${orderId}/mark_ready/`, { method: 'POST' });
        return mapApiToDelivery(await res.json());
    }
    
    return mapped;
  }
};

// --- Mappers ---

function mapApiToTransfer(op) {
  return {
    id: op.id,
    sourceLocation: op.source_location || '',
    destinationLocation: op.destination_location || '',
    status: op.status,
    date: op.created_date || op.created_at,
    scheduledDate: op.scheduled_date,
    totalItems: op.items ? op.items.length : 0,
    items: (op.items || []).map(i => ({
      original_id: i.id,
      id: i.id,
      product: i.product_name,
      sku: i.sku,
      qtyToTransfer: i.demanded_or_expected,
      uom: i.uom
    })),
    notes: op.notes || ''
  };
}

function mapApiToReceipt(op) {
  return {
    id: op.id,
    supplier: op.partner_name || '',
    destinationLocation: op.destination_location || '',
    status: op.status,
    date: op.created_date || op.created_at,
    scheduledDate: op.scheduled_date,
    poReference: op.po_reference || '',
    totalItems: op.items ? op.items.length : 0,
    items: (op.items || []).map(i => ({
      original_id: i.id,
      id: i.id,
      product: i.product_name,
      sku: i.sku,
      expected: i.demanded_or_expected,
      received: i.done_or_received,
      uom: i.uom,
      unitPrice: i.unit_price
    })),
    notes: op.notes || ''
  };
}

function mapApiToDelivery(op) {
  const dateStr = (op.created_date || op.created_at || '').split('T')[0];
  const itemsCount = op.items ? op.items.length : 0;
  let units = 0;
  (op.items || []).forEach(i => units += (i.demanded_or_expected || 0));

  return {
    id: op.id,
    customer: op.partner_name || '',
    sourceLocation: op.source_location || '',
    status: op.status,
    date: dateStr,
    scheduledDate: op.scheduled_date,
    trackingNumber: op.tracking_number || '',
    priority: 'normal',
    items: itemsCount, 
    units: units,
    totalItems: itemsCount,
    itemList: (op.items || []).map(i => ({
      original_id: i.id,
      id: i.id,
      product: i.product_name,
      sku: i.sku,
      demanded: i.demanded_or_expected,
      picked: i.picked_qty,
      packed: i.packed_qty,
      available: i.available_qty,
      uom: i.uom
    })),
    notes: op.notes || ''
  };
}
