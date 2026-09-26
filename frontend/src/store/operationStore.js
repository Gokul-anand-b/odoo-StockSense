import { create } from 'zustand';
import { operationService } from '@/services/operationService';
import { useProductStore } from './productStore';

export const useOperationStore = create((set, get) => ({
  receipts: [],
  selectedReceipt: null,
  deliveries: [],
  selectedDelivery: null,
  loading: false,
  error: null,
  toast: null,
  filters: {
    search: '',
    status: 'all',
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchReceipts();
  },

  resetFilters: () => {
    set({ filters: { search: '', status: 'all' } });
    get().fetchReceipts();
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },

  clearToast: () => set({ toast: null }),

  // Receipts API Actions
  fetchReceipts: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const list = await operationService.getReceipts(filters);
      set({ receipts: list, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch receipts', loading: false });
    }
  },

  fetchReceiptById: async (id) => {
    set({ loading: true, error: null });
    try {
      const receipt = await operationService.getReceiptById(id);
      set({ selectedReceipt: receipt, loading: false });
      return receipt;
    } catch (err) {
      set({ error: err.message || 'Receipt not found', loading: false });
      return null;
    }
  },

  createReceipt: async (data) => {
    set({ loading: true });
    try {
      const created = await operationService.createReceipt(data);
      set((state) => ({
        receipts: [created, ...state.receipts],
        loading: false,
      }));
      get().showToast(`Receipt ${created.id} created successfully`, 'success');
      return created;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to create receipt', 'error');
      throw err;
    }
  },

  updateReceipt: async (id, data) => {
    set({ loading: true });
    try {
      const updated = await operationService.updateReceipt(id, data);
      set((state) => ({
        receipts: state.receipts.map((r) => (r.id === id ? updated : r)),
        selectedReceipt: state.selectedReceipt?.id === id ? updated : state.selectedReceipt,
        loading: false,
      }));
      get().showToast(`Receipt updated successfully`, 'success');
      return updated;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to update receipt', 'error');
      throw err;
    }
  },

  validateReceipt: async (id) => {
    set({ loading: true });
    try {
      const result = await operationService.validateReceipt(id);
      set((state) => ({
        receipts: state.receipts.map((r) => (r.id === id ? result.receipt : r)),
        selectedReceipt: state.selectedReceipt?.id === id ? result.receipt : state.selectedReceipt,
        loading: false,
      }));
      
      // Refresh Product Catalog state so product stock counts reflect automatically
      try {
        useProductStore.getState().fetchProducts();
      } catch (e) {}

      get().showToast(`Receipt ${id} validated! Stock increased & logged to ledger.`, 'success');
      return result;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to validate receipt', 'error');
      throw err;
    }
  },
}));
