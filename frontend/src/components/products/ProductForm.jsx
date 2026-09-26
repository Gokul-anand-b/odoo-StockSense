'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  X,
  Package,
  Barcode,
  Layers,
  DollarSign,
  Boxes,
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';

export default function ProductForm({ initialData = null, onSuccess }) {
  const router = useRouter();
  const { categories, fetchCategories, addProduct, updateProduct, loading } = useProductStore();

  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Electronics & Sensors',
    categoryId: 'cat-1',
    price: '',
    costPrice: '',
    stockOnHand: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    unitOfMeasure: 'Units',
    warehouse: 'Main Hub - Rack A-12',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        barcode: initialData.barcode || '',
        category: initialData.category || 'Electronics & Sensors',
        categoryId: initialData.categoryId || 'cat-1',
        price: initialData.price || '',
        costPrice: initialData.costPrice || '',
        stockOnHand: initialData.stockOnHand ?? 0,
        minStockLevel: initialData.minStockLevel ?? 10,
        maxStockLevel: initialData.maxStockLevel ?? 100,
        unitOfMeasure: initialData.unitOfMeasure || 'Units',
        warehouse: initialData.warehouse || 'Main Hub - Rack A-12',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'SKU';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${rand}` }));
  };

  const generateBarcode = () => {
    const code = '890' + Math.floor(1000000000 + Math.random() * 9000000000);
    setFormData((prev) => ({ ...prev, barcode: code }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU identifier is required';
    if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = 'Valid selling price required';
    if (formData.stockOnHand === '' || parseInt(formData.stockOnHand, 10) < 0) newErrors.stockOnHand = 'Stock quantity cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await updateProduct(initialData.id, formData);
      } else {
        await addProduct(formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/products');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form Fields */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit} className="bw-card p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isEdit ? 'Edit Product Details' : 'Create New Inventory Product'}
              </h3>
              <p className="text-xs text-zinc-400">
                Configure SKU specs, warehouse rules, pricing, and stock thresholds.
              </p>
            </div>
            <span className="bw-badge bg-white text-black font-semibold">
              {isEdit ? 'EDIT MODE' : 'NEW ENTRY'}
            </span>
          </div>

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              1. Basic Information & Classification
            </h4>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Industrial High-Torque Servo Motor 4.5kW"
                className={`bw-input ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    const sel = categories.find((c) => c.name === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                      categoryId: sel ? sel.id : 'cat-1',
                    }));
                  }}
                  className="bw-input bg-[#18181c]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  {categories.length === 0 && (
                    <option value="Electronics & Sensors">Electronics & Sensors</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Unit of Measure (UoM)
                </label>
                <select
                  name="unitOfMeasure"
                  value={formData.unitOfMeasure}
                  onChange={handleChange}
                  className="bw-input bg-[#18181c]"
                >
                  <option value="Units">Units (pcs)</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Pallets">Pallets</option>
                  <option value="KiloGrams">Kilograms (kg)</option>
                  <option value="Meters">Meters (m)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-zinc-300">
                    SKU Code *
                  </label>
                  <button
                    type="button"
                    onClick={generateSKU}
                    className="text-[11px] text-zinc-400 hover:text-white underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto Gen
                  </button>
                </div>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. MOT-SER-8088"
                  className={`bw-input font-mono ${errors.sku ? 'border-red-500' : ''}`}
                />
                {errors.sku && <p className="text-xs text-red-400 mt-1">{errors.sku}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-zinc-300">
                    Barcode / EAN-13
                  </label>
                  <button
                    type="button"
                    onClick={generateBarcode}
                    className="text-[11px] text-zinc-400 hover:text-white underline flex items-center gap-1"
                  >
                    <Barcode className="w-3 h-3" /> Auto Gen
                  </button>
                </div>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="e.g. 8901234567890"
                  className="bw-input font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Stock Levels */}
          <div className="space-y-4 pt-4 border-t border-[#27272a]">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              2. Financials & Inventory Levels
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Selling Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`bw-input font-mono ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Cost Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bw-input font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Initial Stock on Hand *
                </label>
                <input
                  type="number"
                  name="stockOnHand"
                  value={formData.stockOnHand}
                  onChange={handleChange}
                  className={`bw-input font-mono ${errors.stockOnHand ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Minimum Stock (Reorder Threshold)
                </label>
                <input
                  type="number"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  className="bw-input font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Maximum Capacity
                </label>
                <input
                  type="number"
                  name="maxStockLevel"
                  value={formData.maxStockLevel}
                  onChange={handleChange}
                  className="bw-input font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Primary Warehouse Storage Location
              </label>
              <input
                type="text"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                placeholder="e.g. Warehouse A - Rack B-04 / Shelf 2"
                className="bw-input"
              />
            </div>
          </div>

          {/* Section 3: Media & Description */}
          <div className="space-y-4 pt-4 border-t border-[#27272a]">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              3. Media & Notes
            </h4>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Product Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="bw-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Detailed Product Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Specify dimensions, compatibility, material properties, or storage warnings..."
                className="bw-input resize-none"
              />
            </div>
          </div>

          {/* Form Controls */}
          <div className="pt-4 border-t border-[#27272a] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="bw-button-outline text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bw-button-primary text-xs"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Save & Publish Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Side Live Card Preview */}
      <div className="space-y-4">
        <div className="sticky top-24">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Live Preview (Black & White Theme)
          </p>
          <div className="bw-card p-5 space-y-4 bg-[#121215] border-zinc-700 shadow-xl">
            <div className="h-44 w-full rounded-lg bg-[#09090b] border border-zinc-700 flex items-center justify-center overflow-hidden relative">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <Package className="w-12 h-12 text-zinc-600" />
              )}
              <span className="bw-badge bw-badge-in-stock absolute top-3 left-3">
                PREVIEW
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono bg-[#18181b] border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">
                {formData.sku || 'SKU-XXXX'}
              </span>
              <h4 className="font-bold text-white text-lg tracking-tight line-clamp-1">
                {formData.name || 'Untitled Product'}
              </h4>
              <p className="text-xs text-zinc-400">{formData.category}</p>
            </div>

            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-xl font-extrabold text-white">
                ${parseFloat(formData.price || 0).toFixed(2)}
              </span>
              {formData.costPrice && (
                <span className="text-xs text-zinc-500">
                  (${parseFloat(formData.costPrice).toFixed(2)} cost)
                </span>
              )}
            </div>

            <div className="bg-[#18181c] p-3 rounded-lg border border-[#27272a] space-y-2">
              <div className="flex justify-between text-xs text-zinc-300">
                <span>Stock level</span>
                <span className="font-bold font-mono">
                  {formData.stockOnHand || 0} {formData.unitOfMeasure}
                </span>
              </div>
              <div className="w-full bg-[#09090b] h-2 rounded-full overflow-hidden border border-[#27272a]">
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        ((formData.stockOnHand || 0) / (formData.maxStockLevel || 100)) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-xs text-zinc-400 space-y-1 border-t border-[#27272a] pt-3">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-300" />
                <span className="truncate">{formData.warehouse || 'Unassigned'}</span>
              </p>
              {formData.barcode && (
                <p className="flex items-center gap-2 font-mono text-[11px]">
                  <Barcode className="w-3.5 h-3.5 text-zinc-300" />
                  <span>{formData.barcode}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
