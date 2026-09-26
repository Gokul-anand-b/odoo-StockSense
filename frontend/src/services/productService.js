import api from './api';

// Initial Mock Dataset for Offline/Development preview in Black & White theme
const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Electronics & Sensors', code: 'ELEC', description: 'Sensors, IoT microcontrollers, and electronic components', count: 18 },
  { id: 'cat-2', name: 'Heavy Machinery & Motors', code: 'MACH', description: 'Industrial motors, hydraulic actuators, and pumps', count: 12 },
  { id: 'cat-3', name: 'Raw Materials & Alloys', code: 'RAW', description: 'Aluminum sheets, steel rods, carbon fiber rolls', count: 24 },
  { id: 'cat-4', name: 'Warehouse Tools & Gear', code: 'TOOL', description: 'Barcodes, scanners, safety helmets, and forklifts', count: 15 },
  { id: 'cat-5', name: 'Packaging & Logistics', code: 'PKG', description: 'Pallets, bubble wrap, industrial strapping', count: 30 }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-101',
    sku: 'MOT-SER-8088',
    barcode: '8901234567890',
    name: 'Industrial High-Torque Servo Motor 4.5kW',
    category: 'Heavy Machinery & Motors',
    categoryId: 'cat-2',
    price: 1250.00,
    costPrice: 840.00,
    stockOnHand: 45,
    minStockLevel: 15,
    maxStockLevel: 120,
    unitOfMeasure: 'Units',
    status: 'In Stock',
    warehouse: 'Main Hub - Rack A-12',
    description: 'Brushless heavy-duty servo motor engineered for high precision robotic automation arms and conveyor drivers.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    updatedAt: '2026-09-25T14:30:00Z',
    warehouses: [
      { name: 'Warehouse A (Central)', onHand: 25, reserved: 5, incoming: 10, min: 10 },
      { name: 'Warehouse B (East)', onHand: 15, reserved: 2, incoming: 0, min: 5 },
      { name: 'Production Floor', onHand: 5, reserved: 0, incoming: 0, min: 0 }
    ],
    reorderRule: {
      minQuantity: 15,
      maxQuantity: 100,
      reorderQuantity: 50,
      supplierLeadDays: 7,
      preferredVendor: 'Apex Robotics Corp',
      autoTrigger: true
    }
  },
  {
    id: 'prod-102',
    sku: 'SCN-QR-900',
    barcode: '8909876543210',
    name: 'Rugged Wireless Barcode & QR Scanner',
    category: 'Warehouse Tools & Gear',
    categoryId: 'cat-4',
    price: 320.00,
    costPrice: 190.00,
    stockOnHand: 8,
    minStockLevel: 10,
    maxStockLevel: 50,
    unitOfMeasure: 'Pieces',
    status: 'Low Stock',
    warehouse: 'Tech Zone - Rack T-04',
    description: 'IP67 rated wireless 2D barcode scanner with 50-meter range Bluetooth connection and vibration alert.',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
    updatedAt: '2026-09-24T09:15:00Z',
    warehouses: [
      { name: 'Warehouse A (Central)', onHand: 5, reserved: 2, incoming: 20, min: 6 },
      { name: 'Warehouse B (East)', onHand: 3, reserved: 1, incoming: 0, min: 4 }
    ],
    reorderRule: {
      minQuantity: 10,
      maxQuantity: 50,
      reorderQuantity: 25,
      supplierLeadDays: 3,
      preferredVendor: 'ScanTech Global',
      autoTrigger: true
    }
  },
  {
    id: 'prod-103',
    sku: 'ALU-SHT-2024',
    barcode: '8904567890123',
    name: 'Aerospace Grade Aluminum Sheet 2mm (2x1m)',
    category: 'Raw Materials & Alloys',
    categoryId: 'cat-3',
    price: 185.50,
    costPrice: 110.00,
    stockOnHand: 140,
    minStockLevel: 40,
    maxStockLevel: 300,
    unitOfMeasure: 'Sheets',
    status: 'In Stock',
    warehouse: 'Raw Metal Yard - Bay 3',
    description: 'High strength-to-weight ratio alloy 2024-T3 aluminum sheet ideal for structural fabrication.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60',
    updatedAt: '2026-09-26T08:00:00Z',
    warehouses: [
      { name: 'Warehouse A (Central)', onHand: 90, reserved: 15, incoming: 50, min: 30 },
      { name: 'Warehouse B (East)', onHand: 50, reserved: 10, incoming: 0, min: 10 }
    ],
    reorderRule: {
      minQuantity: 40,
      maxQuantity: 300,
      reorderQuantity: 100,
      supplierLeadDays: 14,
      preferredVendor: 'MetalCraft Steel & Alloys',
      autoTrigger: false
    }
  },
  {
    id: 'prod-104',
    sku: 'PLT-HDPE-01',
    barcode: '8907890123456',
    name: 'Heavy Duty Euro HDPE Plastic Pallet',
    category: 'Packaging & Logistics',
    categoryId: 'cat-5',
    price: 65.00,
    costPrice: 38.00,
    stockOnHand: 0,
    minStockLevel: 25,
    maxStockLevel: 200,
    unitOfMeasure: 'Units',
    status: 'Out of Stock',
    warehouse: 'Pallet Staging Area',
    description: 'Four-way entry non-porous hygienic plastic pallet rated for 1500kg dynamic load capacity.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60',
    updatedAt: '2026-09-22T11:45:00Z',
    warehouses: [
      { name: 'Warehouse A (Central)', onHand: 0, reserved: 0, incoming: 100, min: 15 },
      { name: 'Warehouse B (East)', onHand: 0, reserved: 0, incoming: 0, min: 10 }
    ],
    reorderRule: {
      minQuantity: 25,
      maxQuantity: 200,
      reorderQuantity: 100,
      supplierLeadDays: 5,
      preferredVendor: 'PolyPack Logistics',
      autoTrigger: true
    }
  },
  {
    id: 'prod-105',
    sku: 'ESP32-S3-WROOM',
    barcode: '8903456789012',
    name: 'ESP32-S3 Dual-Core Microcontroller Node',
    category: 'Electronics & Sensors',
    categoryId: 'cat-1',
    price: 12.80,
    costPrice: 6.50,
    stockOnHand: 420,
    minStockLevel: 100,
    maxStockLevel: 1000,
    unitOfMeasure: 'Units',
    status: 'In Stock',
    warehouse: 'Cleanroom Storage - Bin 4',
    description: '2.4GHz Wi-Fi + Bluetooth 5 (LE) microcontroller module equipped with vector instructions for AI acceleration.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
    updatedAt: '2026-09-26T07:20:00Z',
    warehouses: [
      { name: 'Warehouse A (Central)', onHand: 300, reserved: 45, incoming: 200, min: 80 },
      { name: 'Warehouse B (East)', onHand: 120, reserved: 10, incoming: 0, min: 20 }
    ],
    reorderRule: {
      minQuantity: 100,
      maxQuantity: 1000,
      reorderQuantity: 300,
      supplierLeadDays: 10,
      preferredVendor: 'Espressif Direct',
      autoTrigger: true
    }
  }
];

let localProducts = [...INITIAL_PRODUCTS];
let localCategories = [...INITIAL_CATEGORIES];

export const productService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products/', { params });
      return response.data;
    } catch (err) {
      let filtered = [...localProducts];
      const { search, category, stockStatus, sortBy } = params;

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(query) ||
               p.sku.toLowerCase().includes(query) ||
               (p.barcode && p.barcode.includes(query))
        );
      }

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category || p.categoryId === category);
      }

      if (stockStatus && stockStatus !== 'all') {
        filtered = filtered.filter(p => p.status.toLowerCase().replace(/\s+/g, '-') === stockStatus);
      }

      if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      if (sortBy === 'stock-asc') filtered.sort((a, b) => a.stockOnHand - b.stockOnHand);
      if (sortBy === 'stock-desc') filtered.sort((a, b) => b.stockOnHand - a.stockOnHand);
      if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

      return {
        count: filtered.length,
        results: filtered
      };
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}/`);
      return response.data;
    } catch (err) {
      const prod = localProducts.find(p => p.id === id || p.sku === id);
      if (!prod) throw new Error('Product not found');
      return prod;
    }
  },

  // Increase stock on hand (called during Receipt Validation)
  async increaseStockOnHand(skuOrId, amount) {
    const qty = parseInt(amount, 10) || 0;
    if (qty <= 0) return;

    const prod = localProducts.find(p => p.id === skuOrId || p.sku === skuOrId || p.name === skuOrId);
    if (prod) {
      prod.stockOnHand += qty;
      if (prod.stockOnHand > prod.minStockLevel) {
        prod.status = 'In Stock';
      } else if (prod.stockOnHand > 0) {
        prod.status = 'Low Stock';
      }

      if (prod.warehouses && prod.warehouses.length > 0) {
        prod.warehouses[0].onHand += qty;
      }
      prod.updatedAt = new Date().toISOString();
    }
  },

  // Internal Stock Transfer between locations (Total company stock remains UNCHANGED)
  async transferStockBetweenLocations(skuOrId, amount, sourceLoc, destLoc) {
    const qty = parseInt(amount, 10) || 0;
    if (qty <= 0) return;

    const prod = localProducts.find(p => p.id === skuOrId || p.sku === skuOrId || p.name === skuOrId);
    if (prod && prod.warehouses) {
      // Find or adjust source warehouse location
      let srcWh = prod.warehouses.find(w => w.name.toLowerCase().includes(sourceLoc.toLowerCase()) || sourceLoc.toLowerCase().includes(w.name.toLowerCase()));
      if (srcWh) {
        srcWh.onHand = Math.max(0, srcWh.onHand - qty);
      }

      // Find or create destination warehouse location
      let destWh = prod.warehouses.find(w => w.name.toLowerCase().includes(destLoc.toLowerCase()) || destLoc.toLowerCase().includes(w.name.toLowerCase()));
      if (destWh) {
        destWh.onHand += qty;
      } else {
        prod.warehouses.push({
          name: destLoc,
          onHand: qty,
          reserved: 0,
          incoming: 0,
          min: 5
        });
      }
      prod.updatedAt = new Date().toISOString();
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products/', productData);
      return response.data;
    } catch (err) {
      const newProd = {
        id: `prod-${Date.now()}`,
        sku: productData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: productData.barcode || `${Math.floor(8900000000000 + Math.random() * 100000000000)}`,
        name: productData.name,
        category: productData.category || 'General Stock',
        categoryId: productData.categoryId || 'cat-1',
        price: parseFloat(productData.price || 0),
        costPrice: parseFloat(productData.costPrice || 0),
        stockOnHand: parseInt(productData.stockOnHand || 0, 10),
        minStockLevel: parseInt(productData.minStockLevel || 10, 10),
        maxStockLevel: parseInt(productData.maxStockLevel || 100, 10),
        unitOfMeasure: productData.unitOfMeasure || 'Units',
        status: parseInt(productData.stockOnHand || 0) === 0 ? 'Out of Stock' : (parseInt(productData.stockOnHand) <= parseInt(productData.minStockLevel || 10) ? 'Low Stock' : 'In Stock'),
        warehouse: productData.warehouse || 'Central Warehouse',
        description: productData.description || '',
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60',
        updatedAt: new Date().toISOString(),
        warehouses: [
          { name: productData.warehouse || 'Warehouse A (Central)', onHand: parseInt(productData.stockOnHand || 0), reserved: 0, incoming: 0, min: parseInt(productData.minStockLevel || 5) }
        ],
        reorderRule: {
          minQuantity: parseInt(productData.minStockLevel || 10),
          maxQuantity: parseInt(productData.maxStockLevel || 100),
          reorderQuantity: 25,
          supplierLeadDays: 7,
          preferredVendor: 'Standard Logistics Corp',
          autoTrigger: true
        }
      };
      localProducts.unshift(newProd);
      return newProd;
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.patch(`/products/${id}/`, productData);
      return response.data;
    } catch (err) {
      const index = localProducts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      
      const updated = {
        ...localProducts[index],
        ...productData,
        updatedAt: new Date().toISOString()
      };
      
      if (updated.stockOnHand <= 0) updated.status = 'Out of Stock';
      else if (updated.stockOnHand <= updated.minStockLevel) updated.status = 'Low Stock';
      else updated.status = 'In Stock';

      localProducts[index] = updated;
      return updated;
    }
  },

  async deleteProduct(id) {
    try {
      await api.delete(`/products/${id}/`);
      return { success: true };
    } catch (err) {
      localProducts = localProducts.filter(p => p.id !== id);
      return { success: true };
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (err) {
      return localCategories;
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories/', categoryData);
      return response.data;
    } catch (err) {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryData.name,
        code: categoryData.code || categoryData.name.substring(0, 4).toUpperCase(),
        description: categoryData.description || '',
        count: 0
      };
      localCategories.push(newCat);
      return newCat;
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const response = await api.patch(`/categories/${id}/`, categoryData);
      return response.data;
    } catch (err) {
      const index = localCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        localCategories[index] = { ...localCategories[index], ...categoryData };
        return localCategories[index];
      }
      throw new Error('Category not found');
    }
  },

  async deleteCategory(id) {
    try {
      await api.delete(`/categories/${id}/`);
      return { success: true };
    } catch (err) {
      localCategories = localCategories.filter(c => c.id !== id);
      return { success: true };
    }
  },

  async saveReorderRule(productId, ruleData) {
    try {
      const response = await api.post(`/products/${productId}/reorder-rules/`, ruleData);
      return response.data;
    } catch (err) {
      const prod = localProducts.find(p => p.id === productId);
      if (prod) {
        prod.reorderRule = { ...prod.reorderRule, ...ruleData };
        prod.minStockLevel = ruleData.minQuantity ?? prod.minStockLevel;
        prod.maxStockLevel = ruleData.maxQuantity ?? prod.maxStockLevel;
        return prod.reorderRule;
      }
      return ruleData;
    }
  }
};
