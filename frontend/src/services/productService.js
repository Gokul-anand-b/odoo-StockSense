/**
 * StockSense — Product & Category Service
 * Connects directly to Django Backend REST API & Supabase PostgreSQL database
 */

const PRODUCTS_API = 'http://localhost:8000/api/products/';
const CATEGORIES_API = 'http://localhost:8000/api/products/categories/';

export const productService = {
  // ── Products ──
  getProducts: async () => {
    try {
      const response = await fetch(PRODUCTS_API);
      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        return results.map((p) => ({
          ...p,
          id: p.sku || p.id,
          db_id: p.id,
          name: p.name,
          category: p.category || p.category_name || 'General',
          stock: p.stock ?? p.stock_on_hand ?? 0,
          maxStock: p.max_stock_level || 100,
          price: p.price ?? p.unit_price ?? '0.00',
          reorderPoint: p.reorder_point ?? p.min_stock_level ?? 0,
          warehouse: p.warehouse || 'Central Hub (WH-01)',
          status: (p.status || 'IN STOCK').toUpperCase(),
          statusType: p.status_type || (p.stock === 0 ? 'out_of_stock' : (p.stock <= (p.reorder_point || 0) ? 'low_stock' : 'in_stock')),
        }));
      }
    } catch (err) {
      console.warn('Products API fetch failed:', err);
    }
    return [];
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${PRODUCTS_API}${id}/`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Error fetching product by ID:', err);
    }
    return null;
  },

  createProduct: async (productData) => {
    try {
      const payload = {
        sku: productData.sku,
        name: productData.name,
        category: productData.category || 'General',
        unitPrice: parseFloat(productData.unitPrice || productData.price || 0),
        initial_stock: parseInt(productData.initialStock || productData.stock || 0, 10),
        reorderPoint: parseInt(productData.reorderPoint || 0, 10),
        safety_stock: parseInt(productData.safetyStock || 0, 10),
        description: productData.description || '',
        warehouse: productData.warehouse || 'Central Hub (WH-01)',
      };

      const response = await fetch(PRODUCTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to save product.';
        try {
          const errData = await response.json();
          if (errData.sku) {
            errorMessage = Array.isArray(errData.sku) ? errData.sku[0] : errData.sku;
          } else if (errData.detail) {
            errorMessage = errData.detail;
          } else if (errData.name) {
            errorMessage = Array.isArray(errData.name) ? errData.name[0] : errData.name;
          } else {
            errorMessage = Object.values(errData).flat().join(', ');
          }
        } catch {
          errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      console.error('Error in createProduct:', err);
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${PRODUCTS_API}${id}/`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      console.error('Error deleting product from Supabase:', err);
      return false;
    }
  },

  // ── Categories ──
  getCategories: async () => {
    try {
      const response = await fetch(CATEGORIES_API);
      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        return results.map((c) => ({
          ...c,
          id: c.id,
          name: c.name,
          code: c.code || '',
          description: c.description || '',
          skus: c.skus_count || 0,
          value: `$${(c.total_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          raw_value: c.total_value || 0,
        }));
      }
    } catch (err) {
      console.warn('Categories API fetch failed:', err);
    }
    return [];
  },

  createCategory: async (categoryData) => {
    try {
      const response = await fetch(CATEGORIES_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.name?.[0] || 'Failed to create category.');
      }
      return await response.json();
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await fetch(`${CATEGORIES_API}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.name?.[0] || 'Failed to update category.');
      }
      return await response.json();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await fetch(`${CATEGORIES_API}${id}/`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      console.error('Error deleting category:', err);
      return false;
    }
  },
};
