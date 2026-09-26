'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Package,
  Building2,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useOperationStore } from '@/store/operationStore';
import { useProductStore } from '@/store/productStore';

const SUPPLIERS = [
  'Apex Industrial Supply Corp',
  'Global Tech Components Ltd',
  'MetalCraft Steel & Alloys',
  'PolyPack Logistics Supplies',
  'Espressif Systems Direct',
  'Stark Robotics Materials',
];

export default function ReceiptForm({ initialData = null, onSuccess }) {
  const router = useRouter();
  const { createReceipt, updateReceipt, validateReceipt, loading } = useOperationStore();
  const { products, fetchProducts } = useProductStore();

  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    supplier: SUPPLIERS[0],
    poReference: `PO-${Math.floor(90000 + Math.random() * 10000)}`,
    destinationLocation: 'Main Warehouse - Rack A-12',
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [
      {
        product: 'Industrial High-Torque Servo Motor 4.5kW',
        sku: 'MOT-SER-8088',
        expected: 10,
        received: 10,
        uom: 'Units',
        unitPrice: 840.00,
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
        supplier: initialData.supplier || SUPPLIERS[0],
        poReference: initialData.poReference || '',
        destinationLocation: initialData.destinationLocation || 'Main Warehouse - Rack A-12',
        scheduledDate: initialData.scheduledDate ? initialData.scheduledDate.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
        items: initialData.items && initialData.items.length > 0 ? initialData.items : [
          { product: '', sku: '', expected: 1, received: 1, uom: 'Units', unitPrice: 0 }
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
          expected: 1,
          received: 1,
          uom: 'Units',
          unitPrice: 0,
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

      // Auto-populate SKU, UoM, Cost Price if product selected from catalog
      if (field === 'product') {
        const found = products.find((p) => p.name === value);
        if (found) {
          updated[index].sku = found.sku;
          updated[index].uom = found.unitOfMeasure || 'Units';
          updated[index].unitPrice = found.costPrice || found.price || 0;
        }
      }

      return { ...prev, items: updated };
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.supplier.trim()) errs.supplier = 'Supplier name is required';
    if (!formData.destinationLocation.trim()) errs.destinationLocation = 'Destination warehouse location required';
    if (formData.items.length === 0) errs.items = 'At least one item row is required';

    formData.items.forEach((item, idx) => {
      if (!item.product.trim()) errs[`item_${idx}_product`] = 'Product name required';
      if (parseInt(item.expected, 10) < 1) errs[`item_${idx}_expected`] = 'Min 1 unit expected';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await updateReceipt(initialData.id, formData);
      } else {
        await createReceipt(formData);
      }
      if (onSuccess) onSuccess();
      else router.push('/operations/receipts');
    } catch (err) {
      console.error(err);
    }
  };

  const handleValidateAndIncreaseStock = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let receiptId = initialData?.id;
      if (isEdit) {
        await updateReceipt(receiptId, formData);
      } else {
        const created = await createReceipt(formData);
        receiptId = created.id;
      }

      // Execute atomic validation -> increases stock & writes to ledger
      await validateReceipt(receiptId);

      if (onSuccess) onSuccess();
      else router.push(`/operations/receipts/${receiptId}`);
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
              <ArrowDownLeft className="w-5 h-5 text-white" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isEdit ? `Edit Receipt (${initialData.id})` : 'Create Incoming Stock Receipt'}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Log incoming vendor goods, verify received quantities, and validate to automatically increase stock.
            </p>
          </div>
          <span className="bw-badge bg-white text-black font-bold">
            INBOUND OPERATION
          </span>
        </div>

        {/* Header Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" /> Supplier / Vendor *
            </label>
            <select
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="bw-input bg-[#18181c] text-xs font-medium"
            >
              {SUPPLIERS.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
            {errors.supplier && <p className="text-xs text-red-400 mt-1">{errors.supplier}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" /> PO Reference
            </label>
            <input
              type="text"
              value={formData.poReference}
              onChange={(e) => setFormData({ ...formData, poReference: e.target.value })}
              placeholder="e.g. PO-99420"
              className="bw-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Destination Location *
            </label>
            <input
              type="text"
              value={formData.destinationLocation}
              onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
              placeholder="e.g. Main Warehouse - Rack A-12"
              className="bw-input text-xs"
            />
            {errors.destinationLocation && <p className="text-xs text-red-400 mt-1">{errors.destinationLocation}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Scheduled Date
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

      {/* Dynamic Product Item Rows */}
      <div className="bw-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-white" /> Incoming Line Items & Received Quantities
          </h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="bw-button-outline text-xs py-1 px-3"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item Line
          </button>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          {formData.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#121215] border border-[#27272a] p-4 rounded-xl space-y-3 relative group"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Product Selector / Title */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Select / Product Title *
                  </label>
                  <input
                    type="text"
                    list="product-options"
                    value={item.product}
                    onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                    placeholder="Search catalog or type product name..."
                    className="bw-input text-xs"
                  />
                  <datalist id="product-options">
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.sku} - {p.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* SKU Code */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] text-zinc-400 mb-1">SKU</label>
                  <input
                    type="text"
                    value={item.sku}
                    onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                    placeholder="e.g. SKU-8088"
                    className="bw-input font-mono text-xs uppercase"
                  />
                </div>

                {/* Expected Qty */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] text-zinc-400 mb-1">Expected Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.expected}
                    onChange={(e) => handleItemChange(idx, 'expected', e.target.value)}
                    className="bw-input font-mono text-xs"
                  />
                </div>

                {/* Received Qty */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-white mb-1">Received Qty *</label>
                  <input
                    type="number"
                    min="0"
                    value={item.received}
                    onChange={(e) => handleItemChange(idx, 'received', e.target.value)}
                    className="bw-input font-mono text-xs font-bold border-white"
                  />
                </div>

                {/* Unit Price */}
                <div className="md:col-span-1">
                  <label className="block text-[11px] text-zinc-400 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="bw-input font-mono text-xs"
                  />
                </div>

                {/* Remove button */}
                <div className="md:col-span-1 flex justify-end pt-5">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={formData.items.length === 1}
                    className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#18181b] disabled:opacity-30"
                    title="Remove item row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes & Actions */}
      <div className="bw-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Receipt Notes & Inspection Observations
          </label>
          <textarea
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add quality inspection details, carrier bill of lading number, or packaging remarks..."
            className="bw-input text-xs resize-none"
          />
        </div>

        <div className="pt-4 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/operations/receipts')}
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
              onClick={handleValidateAndIncreaseStock}
              disabled={loading}
              className="bw-button-primary text-xs"
            >
              <CheckCircle2 className="w-4 h-4" /> Validate & Increase Stock
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
