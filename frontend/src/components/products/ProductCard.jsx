'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';

export default function ProductCard({ product, onEdit, onDelete }) {
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      if (onDelete) onDelete(product.id);
      else deleteProduct(product.id);
    }
  };

  const getStatusBadge = () => {
    if (product.stockOnHand <= 0) {
      return (
        <span className="bw-badge bw-badge-out-of-stock">
          Out of Stock
        </span>
      );
    }
    if (product.stockOnHand <= (product.minStockLevel || 10)) {
      return (
        <span className="bw-badge bw-badge-low-stock">
          <AlertTriangle className="w-3 h-3 text-white" /> Low Stock
        </span>
      );
    }
    return (
      <span className="bw-badge bw-badge-in-stock">
        In Stock
      </span>
    );
  };

  const stockPercent = Math.min(
    100,
    Math.round((product.stockOnHand / (product.maxStockLevel || 100)) * 100)
  );

  return (
    <div className="bw-card bw-card-interactive p-5 flex flex-col justify-between relative group">
      <div>
        {/* Top Header: Image & Badges */}
        <div className="relative h-44 w-full rounded-lg bg-[#09090b] border border-[#27272a] overflow-hidden mb-4 flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter grayscale brightness-90 contrast-125"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="w-full h-full flex items-center justify-center bg-[#121215] text-zinc-600"
            style={{ display: product.imageUrl ? 'none' : 'flex' }}
          >
            <Package className="w-12 h-12 text-zinc-500" />
          </div>

          {/* Status Badge overlay */}
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>

          {/* Quick Barcode Trigger */}
          <button
            onClick={() => setShowBarcodeModal(true)}
            className="absolute top-3 right-3 bg-black/80 text-white p-2 rounded-lg border border-zinc-700 hover:border-white transition-colors"
            title="View Barcode"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {/* Category & SKU */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
          <span className="bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded text-zinc-300">
            {product.sku}
          </span>
          <span className="truncate max-w-[140px] text-zinc-400">{product.category}</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-bold text-white text-base hover:underline line-clamp-2 mb-2 tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-extrabold text-white font-mono">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          {product.costPrice && (
            <span className="text-xs text-zinc-500 line-through font-mono">
              ${parseFloat(product.costPrice).toFixed(2)} cost
            </span>
          )}
        </div>

        {/* Stock Gauge */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs font-medium text-zinc-400">
            <span>Stock on hand</span>
            <span className="font-mono text-white font-semibold">
              {product.stockOnHand} {product.unitOfMeasure || 'units'}
            </span>
          </div>
          <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden border border-[#27272a]">
            <div
              className={`h-full transition-all duration-300 ${
                product.stockOnHand <= 0
                  ? 'bg-transparent'
                  : product.stockOnHand <= (product.minStockLevel || 10)
                  ? 'bg-zinc-400 animate-pulse'
                  : 'bg-white'
              }`}
              style={{ width: `${stockPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
        <Link
          href={`/products/${product.id}`}
          className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
        >
          View Specs <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit ? onEdit(product) : null}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#18181b] transition-colors"
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#18181b] transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-700 rounded-xl p-6 max-w-sm w-full text-center space-y-4">
            <h4 className="text-lg font-bold text-white">{product.name}</h4>
            <p className="text-xs font-mono text-zinc-400">SKU: {product.sku}</p>

            {/* Simulated Black & White Barcode SVG */}
            <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-center my-2">
              <div className="flex gap-1 items-center h-16 w-full justify-center">
                {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 2, 6, 2, 5, 3, 2, 4, 1, 6].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w * 2}px` }}
                  />
                ))}
              </div>
              <p className="text-black font-mono font-bold text-sm mt-2 tracking-widest">
                {product.barcode || '8901234567890'}
              </p>
            </div>

            <button
              onClick={() => setShowBarcodeModal(false)}
              className="bw-button-secondary w-full"
            >
              Close Barcode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
