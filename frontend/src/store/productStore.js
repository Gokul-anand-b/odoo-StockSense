import { create } from 'zustand';
import { productService } from '@/services/productService';

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  viewMode: 'table', // 'table' | 'grid'
  selectedProductIds: [],
  toast: null,
  filters: {
    search: '',
    category: 'all',
    stockStatus: 'all',
    sortBy: 'name',
  },

  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchProducts();
  },

  resetFilters: () => {
    set({
      filters: { search: '', category: 'all', stockStatus: 'all', sortBy: 'name' },
    });
    get().fetchProducts();
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },

  clearToast: () => set({ toast: null }),

  toggleSelectProduct: (id) => {
    set((state) => {
      const exists = state.selectedProductIds.includes(id);
      return {
        selectedProductIds: exists
          ? state.selectedProductIds.filter((item) => item !== id)
          : [...state.selectedProductIds, id],
      };
    });
  },

  selectAllProducts: (selectAll) => {
    set((state) => ({
      selectedProductIds: selectAll ? state.products.map((p) => p.id) : [],
    }));
  },

  // Async API Calls
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const data = await productService.getProducts(filters);
      set({ products: data.results || data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch products', loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const prod = await productService.getProductById(id);
      set({ selectedProduct: prod, loading: false });
      return prod;
    } catch (err) {
      set({ error: err.message || 'Product not found', loading: false });
      return null;
    }
  },

  addProduct: async (productData) => {
    set({ loading: true });
    try {
      const newProduct = await productService.createProduct(productData);
      set((state) => ({
        products: [newProduct, ...state.products],
        loading: false,
      }));
      get().showToast(`Product '${newProduct.name}' created successfully`, 'success');
      return newProduct;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to create product', 'error');
      throw err;
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true });
    try {
      const updated = await productService.updateProduct(id, productData);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
        selectedProduct: state.selectedProduct?.id === id ? updated : state.selectedProduct,
        loading: false,
      }));
      get().showToast(`Product updated successfully`, 'success');
      return updated;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to update product', 'error');
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        selectedProductIds: state.selectedProductIds.filter((item) => item !== id),
        loading: false,
      }));
      get().showToast('Product deleted', 'info');
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to delete product', 'error');
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories();
      set({ categories });
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  },

  addCategory: async (categoryData) => {
    try {
      const newCat = await productService.createCategory(categoryData);
      set((state) => ({
        categories: [...state.categories, newCat],
      }));
      get().showToast(`Category '${newCat.name}' created`, 'success');
      return newCat;
    } catch (err) {
      get().showToast(err.message || 'Failed to add category', 'error');
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const updated = await productService.updateCategory(id, categoryData);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updated : c)),
      }));
      get().showToast(`Category updated`, 'success');
    } catch (err) {
      get().showToast(err.message || 'Failed to update category', 'error');
    }
  },

  deleteCategory: async (id) => {
    try {
      await productService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      get().showToast('Category deleted', 'info');
    } catch (err) {
      get().showToast(err.message || 'Failed to delete category', 'error');
    }
  },

  saveReorderRule: async (productId, ruleData) => {
    try {
      const rule = await productService.saveReorderRule(productId, ruleData);
      set((state) => {
        const updatedProducts = state.products.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              reorderRule: rule,
              minStockLevel: ruleData.minQuantity ?? p.minStockLevel,
              maxStockLevel: ruleData.maxQuantity ?? p.maxStockLevel,
            };
          }
          return p;
        });

        const updatedSelected =
          state.selectedProduct?.id === productId
            ? {
                ...state.selectedProduct,
                reorderRule: rule,
                minStockLevel: ruleData.minQuantity ?? state.selectedProduct.minStockLevel,
                maxStockLevel: ruleData.maxQuantity ?? state.selectedProduct.maxQuantity,
              }
            : state.selectedProduct;

        return { products: updatedProducts, selectedProduct: updatedSelected };
      });
      get().showToast('Reorder rule updated successfully', 'success');
    } catch (err) {
      get().showToast(err.message || 'Failed to save reorder rule', 'error');
    }
  },
}));
