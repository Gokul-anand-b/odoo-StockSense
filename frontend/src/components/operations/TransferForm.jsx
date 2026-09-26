'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftRight,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Package,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useOperationStore } from '@/store/operationStore';
import { useProductStore } from '@/store/productStore';

const LOCATIONS = [
  'Main Warehouse - Rack A-12',
  'Warehouse A (Central Hub)',
  'Warehouse B (East Logistics)',
  'Production Assembly Floor - Bay 2',
  'Machining & Fabrication Zone',
  'Raw Metal Yard - Bay 3',
  'Cleanroom Storage - Bin 4',
  'Pallet Staging Area',
];

export default function TransferForm({ initialData = null, onSuccess }) {
  const router = useRouter();
  const { createTransfer, updateTransfer, validateTransfer, loading } = useOperationStore();
  const { products, fetchProducts } = useProductStore();

  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    sourceLocation: LOCATIONS[0],
    destinationLocation: LOCATIONS[3],
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [
      {
        product: 'Industrial High-Torque Servo Motor 4.5kW',
        sku: 'MOT-SER-8088',
        qtyToTransfer: 5,
        uom: 'Units',
      },
    ],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sourceLocation: initialData.sourceLocation || LOCATIONS[0],
        destinationLocation: initialData.destinationLocation || LOCATIONS[3],
        scheduledDate: initialData.scheduledDate ? initialData.scheduledDate.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
        items: initialData.items && initialData.items.length > 0 ? initialData.items : [
          { product: '', sku: '', qtyToTransfer: 1, uom: 'Units' }
        ],
      });
    }
  }, [initialData]);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: '',
          sku: '',
          qtyToTransfer: 1,
          uom: 'Units',
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };

      if (field === 'product') {
        const found = products.find((p) => p.name === value);
        if (found) {
          updated[index].sku = found.sku;
          updated[index].uom = found.unitOfMeasure || 'Units';
        }
      }

      return { ...prev, items: updated };
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.sourceLocation.trim()) errs.sourceLocation = 'Source location is required';
    if (!formData.destinationLocation.trim()) errs.destinationLocation = 'Destination location is required';
    if (formData.sourceLocation === formData.destinationLocation) {
      errs.destinationLocation = 'Destination must be different from source location';
    }
    if (formData.items.length === 0) errs.items = 'At least one item is required for transfer';

    formData.items.forEach((item, idx) => {
      if (!item.product.trim()) errs[`item_${idx}_product`] = 'Product title required';
      if (parseInt(item.qtyToTransfer, 10) < 1) errs[`item_${idx}_qty`] = 'Min transfer quantity is 1';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await updateTransfer(initialData.id, formData);
      } else {
        await createTransfer(formData);
      }
      if (onSuccess) onSuccess();
      else router.push('/operations/transfers');
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let transferId = initialData?.id;
      if (isEdit) {
        await updateTransfer(transferId, formData);
      } else {
        const created = await createTransfer(formData);
        transferId = created.id;
      }

      // Execute atomic location stock transfer (Company total stays unchanged)
      await validateTransfer(transferId);

      if (onSuccess) onSuccess();
      else router.push(`/operations/transfers/${transferId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="space-y-6">
      {/* Header Info Card */}
      <div className="bw-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#27272a] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-white" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isEdit ? `Edit Internal Transfer (${initialData.id})` : 'New Internal Stock Transfer'}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Move inventory between warehouse racks and zones. Total company stock remains constant while location quants update.
            </p>
          </div>
          <span className="bw-badge bg-white text-black font-bold">
            INTERNAL MOVEMENT
          </span>
        </div>

        {/* Location Movement Route Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-center">
          <div className="lg:col-span-3 space-y-1">
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Source Location (From) *
            </label>
            <select
              value={formData.sourceLocation}
              onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
              className="bw-input bg-[#18181c] text-xs font-medium"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.sourceLocation && <p className="text-xs text-red-400 mt-1">{errors.sourceLocation}</p>}
          </div>

          <div className="lg:col-span-1 flex justify-center items-center pt-5 hidden lg:flex">
            <div className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-white">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-1">
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-white" /> Destination Location (To) *
            </label>
            <select
              value={formData.destinationLocation}
              onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
              className="bw-input bg-[#18181c] text-xs font-medium"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.destinationLocation && <p className="text-xs text-red-400 mt-1">{errors.destinationLocation}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#27272a]">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Scheduled Transfer Date
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="bw-input text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Product Transfer Line Items */}
      <div className="bw-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-white" /> Products & Transfer Quantities
          </h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="bw-button-outline text-xs py-1 px-3"
          >
            <Plus className="w-3.5 h-3.5" /> Add Transfer Item
          </button>
        </div>

        {/* Transfer Item Rows */}
        <div className="space-y-3">
          {formData.items.map((item, idx) => {
            const catalogItem = products.find((p) => p.name === item.product || p.sku === item.sku);
            const sourceStock = catalogItem ? catalogItem.stockOnHand : 50;

            return (
              <div
                key={idx}
                className="bg-[#121215] border border-[#27272a] p-4 rounded-xl space-y-3 relative group"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Product Title */}
                  <div className="md:col-span-5">
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Product Item *
                    </label>
                    <input
                      type="text"
                      list="transfer-product-options"
                      value={item.product}
                      onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                      placeholder="Search product from catalog..."
                      className="bw-input text-xs"
                    />
                    <datalist id="transfer-product-options">
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.sku} - {p.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* SKU */}
                  <div className="md:col-span-3">
                    <label className="block text-[11px] text-zinc-400 mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={item.sku}
                      onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                      placeholder="e.g. MOT-SER-8088"
                      className="bw-input font-mono text-xs uppercase"
                    />
                  </div>

                  {/* Quantity to Transfer */}
                  <div className="md:col-span-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-bold text-white">Qty to Transfer *</label>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Avail: {sourceStock} {item.uom || 'units'}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max={sourceStock}
                      value={item.qtyToTransfer}
                      onChange={(e) => handleItemChange(idx, 'qtyToTransfer', e.target.value)}
                      className="bw-input font-mono text-xs font-bold border-white"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1 flex justify-end pt-5">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={formData.items.length === 1}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#18181b] disabled:opacity-30"
                      title="Remove line item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transfer Notes & Actions */}
      <div className="bw-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Transfer Purpose & Internal Notes
          </label>
          <textarea
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add internal relocation reason, machine assembly order reference, or staging notes..."
            className="bw-input text-xs resize-none"
          />
        </div>

        <div className="pt-4 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/operations/transfers')}
            className="bw-button-outline text-xs w-full sm:w-auto"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="bw-button-secondary text-xs"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>

            <button
              type="button"
              onClick={handleConfirmTransfer}
              disabled={loading}
              className="bw-button-primary text-xs"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm & Execute Transfer
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
