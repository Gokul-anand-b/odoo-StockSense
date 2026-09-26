'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  Edit,
  Trash2,
  Sliders,
  AlertTriangle,
  ArrowUpDown,
  CheckSquare,
  Square,
  QrCode,
  Package
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';

export default function ProductTable({ products = [], onEdit, onReorderRule }) {
  const {
    selectedProductIds,
    toggleSelectProduct,
    selectAllProducts,
    deleteProduct,
    setFilter,
    filters
  } = useProductStore();

  const allSelected =
    products.length > 0 && selectedProductIds.length === products.length;

  const handleSelectAll = () => {
    selectAllProducts(!allSelected);
  };

  const getStatusBadge = (product) => {
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

  const handleSort = (key) => {
    const currentSort = filters.sortBy;
    let nextSort = key;
    if (currentSort === `${key}-asc`) nextSort = `${key}-desc`;
    else if (currentSort === key) nextSort = `${key}-asc`;
    setFilter('sortBy', nextSort);
  };

  return (
    <div className="bw-card overflow-hidden">
      {/* Selection Banner if items checked */}
      {selectedProductIds.length > 0 && (
        <div className="bg-[#18181b] border-b border-[#27272a] px-6 py-3 flex items-center justify-between text-xs text-white">
          <span className="font-mono font-medium">
            {selectedProductIds.length} item(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedProductIds.length} selected products?`)) {
                  selectedProductIds.forEach((id) => deleteProduct(id));
                }
              }}
              className="bw-button-outline py-1 text-xs text-red-400 hover:text-red-300 border-red-900/50 hover:bg-red-950/20"
            >
              <Trash2 className="w-3.5 h-3.5" /> Batch Delete
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#27272a] bg-[#09090b]/60 text-zinc-400 font-mono uppercase tracking-wider">
              <th className="p-4 w-10 text-center">
                <button onClick={handleSelectAll} className="text-zinc-400 hover:text-white">
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-white" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('sku')}>
                <div className="flex items-center gap-1">
                  <span>SKU / Item</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-4">Category</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('stock')}>
                <div className="flex items-center gap-1">
                  <span>Stock Level</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  <span>Price ($)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-4">Warehouse</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]">
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-12 text-center text-zinc-500">
                  <Package className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                  <p className="text-sm font-semibold text-white">No products found</p>
                  <p className="text-xs text-zinc-400 mt-1">Try adjusting your filters or search terms.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                const stockPercent = Math.min(
                  100,
                  Math.round((product.stockOnHand / (product.maxStockLevel || 100)) * 100)
                );

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-[#18181b]/50 transition-colors ${
                      isSelected ? 'bg-[#18181b]' : ''
                    }`}
                  >
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleSelectProduct(product.id)}
                        className="text-zinc-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-white" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#09090b] border border-[#27272a] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt=""
                              className="w-full h-full object-cover filter grayscale"
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          ) : (
                            <Package className="w-5 h-5 text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/products/${product.id}`}
                            className="font-bold text-white hover:underline text-sm block"
                          >
                            {product.name}
                          </Link>
                          <span className="font-mono text-[11px] text-zinc-400">
                            {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-zinc-300">
                      {product.category}
                    </td>

                    <td className="p-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-white font-bold">{product.stockOnHand}</span>
                          <span className="text-zinc-500">/ {product.maxStockLevel || 100}</span>
                        </div>
                        <div className="w-full bg-[#18181b] h-1.5 rounded-full overflow-hidden border border-[#27272a]">
                          <div
                            className={`h-full ${
                              product.stockOnHand <= 0
                                ? 'bg-transparent'
                                : product.stockOnHand <= (product.minStockLevel || 10)
                                ? 'bg-zinc-400'
                                : 'bg-white'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white text-sm">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>

                    <td className="p-4 text-zinc-400 truncate max-w-[150px]">
                      {product.warehouse || 'Main Warehouse'}
                    </td>

                    <td className="p-4">{getStatusBadge(product)}</td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${product.id}`}
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
                          title="View Specs"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => (onEdit ? onEdit(product) : null)}
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => (onReorderRule ? onReorderRule(product) : null)}
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
                          title="Configure Reorder Rule"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete ${product.name}?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
