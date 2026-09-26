'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  X,
  RefreshCw,
  Truck,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';

export default function ReorderRuleForm({ product, isOpen = true, onClose, onSuccess }) {
  const saveReorderRule = useProductStore((state) => state.saveReorderRule);

  const existingRule = product?.reorderRule || {};

  const [formData, setFormData] = useState({
    minQuantity: product?.minStockLevel || 10,
    maxQuantity: product?.maxStockLevel || 100,
    reorderQuantity: existingRule.reorderQuantity || 50,
    supplierLeadDays: existingRule.supplierLeadDays || 7,
    preferredVendor: existingRule.preferredVendor || 'Apex Industrial Supply',
    autoTrigger: existingRule.autoTrigger ?? true,
  });

  useEffect(() => {
    if (product) {
      const rule = product.reorderRule || {};
      setFormData({
        minQuantity: product.minStockLevel || 10,
        maxQuantity: product.maxStockLevel || 100,
        reorderQuantity: rule.reorderQuantity || 50,
        supplierLeadDays: rule.supplierLeadDays || 7,
        preferredVendor: rule.preferredVendor || 'Apex Industrial Supply',
        autoTrigger: rule.autoTrigger ?? true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) return;

    await saveReorderRule(product.id, {
      minQuantity: parseInt(formData.minQuantity, 10),
      maxQuantity: parseInt(formData.maxQuantity, 10),
      reorderQuantity: parseInt(formData.reorderQuantity, 10),
      supplierLeadDays: parseInt(formData.supplierLeadDays, 10),
      preferredVendor: formData.preferredVendor,
      autoTrigger: formData.autoTrigger,
    });

    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  if (!product) return null;

  return (
    <div className="bw-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Automated Reorder Rule Configuration
            </h3>
            <p className="text-xs text-zinc-400">
              Set automated replenishment thresholds for <span className="text-white font-mono">{product.name}</span>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#27272a] hover:bg-[#18181b] text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Threshold Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Min Stock (Trigger Point) *
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              className="bw-input font-mono"
              required
            />
            <p className="text-[10px] text-zinc-500 mt-1">Order triggers when stock falls below this level.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Max Target Capacity *
            </label>
            <input
              type="number"
              name="maxQuantity"
              value={formData.maxQuantity}
              onChange={handleChange}
              className="bw-input font-mono"
              required
            />
            <p className="text-[10px] text-zinc-500 mt-1">Upper limit storage safety cap.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Default Order Batch Size *
            </label>
            <input
              type="number"
              name="reorderQuantity"
              value={formData.reorderQuantity}
              onChange={handleChange}
              className="bw-input font-mono"
              required
            />
            <p className="text-[10px] text-zinc-500 mt-1">Quantity requested per purchase draft.</p>
          </div>
        </div>

        {/* Vendor & Lead Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#27272a]">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Preferred Vendor / Supplier
            </label>
            <input
              type="text"
              name="preferredVendor"
              value={formData.preferredVendor}
              onChange={handleChange}
              placeholder="e.g. Global Tech Distributors"
              className="bw-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Supplier Lead Time (Days)
            </label>
            <input
              type="number"
              name="supplierLeadDays"
              value={formData.supplierLeadDays}
              onChange={handleChange}
              className="bw-input font-mono"
            />
          </div>
        </div>

        {/* Auto Trigger Toggle */}
        <div className="bg-[#121215] border border-[#27272a] p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <h5 className="font-bold text-white text-sm">Automatic PO Generation</h5>
            <p className="text-xs text-zinc-400">
              Auto-generate draft Purchase Orders when stock reaches min threshold.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="autoTrigger"
              checked={formData.autoTrigger}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
          </label>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button type="button" onClick={onClose} className="bw-button-outline text-xs">
              Cancel
            </button>
          )}
          <button type="submit" className="bw-button-primary text-xs">
            <Save className="w-4 h-4" /> Save Reorder Rules
          </button>
        </div>
      </form>
    </div>
  );
}
