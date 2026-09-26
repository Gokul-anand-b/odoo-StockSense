import { create } from 'zustand';
import { operationService } from '@/services/operationService';
import { useProductStore } from './productStore';

export const useOperationStore = create((set, get) => ({
  transfers: [],
  selectedTransfer: null,
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
    get().fetchTransfers();
    get().fetchReceipts();
  },

  resetFilters: () => {
    set({ filters: { search: '', status: 'all' } });
    get().fetchTransfers();
    get().fetchReceipts();
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },

  clearToast: () => set({ toast: null }),

  // Internal Transfers API Actions
  fetchTransfers: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const list = await operationService.getTransfers(filters);
      set({ transfers: list, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch transfers', loading: false });
    }
  },

  fetchTransferById: async (id) => {
    set({ loading: true, error: null });
    try {
      const transfer = await operationService.getTransferById(id);
      set({ selectedTransfer: transfer, loading: false });
      return transfer;
    } catch (err) {
      set({ error: err.message || 'Transfer not found', loading: false });
      return null;
    }
  },

  createTransfer: async (data) => {
    set({ loading: true });
    try {
      const created = await operationService.createTransfer(data);
      set((state) => ({
        transfers: [created, ...state.transfers],
        loading: false,
      }));
      get().showToast(`Transfer ${created.id} created successfully`, 'success');
      return created;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to create transfer', 'error');
      throw err;
    }
  },

  updateTransfer: async (id, data) => {
    set({ loading: true });
    try {
      const updated = await operationService.updateTransfer(id, data);
      set((state) => ({
        transfers: state.transfers.map((t) => (t.id === id ? updated : t)),
        selectedTransfer: state.selectedTransfer?.id === id ? updated : state.selectedTransfer,
        loading: false,
      }));
      get().showToast(`Transfer updated successfully`, 'success');
      return updated;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to update transfer', 'error');
      throw err;
    }
  },

  validateTransfer: async (id) => {
    set({ loading: true });
    try {
      const result = await operationService.validateTransfer(id);
      set((state) => ({
        transfers: state.transfers.map((t) => (t.id === id ? result.transfer : t)),
        selectedTransfer: state.selectedTransfer?.id === id ? result.transfer : state.selectedTransfer,
        loading: false,
      }));

      // Refresh products store so location breakdown quants update
      try {
        useProductStore.getState().fetchProducts();
      } catch (e) {}

      get().showToast(`Transfer ${id} confirmed! Stock moved & logged to ledger. Total company stock unchanged.`, 'success');
      return result;
    } catch (err) {
      set({ loading: false });
      get().showToast(err.message || 'Failed to validate transfer', 'error');
      throw err;
    }
  },

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
