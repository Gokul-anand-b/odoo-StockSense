'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  FolderTree,
  LayoutGrid,
  List,
  Search,
  Filter,
  AlertTriangle,
  Boxes,
  DollarSign,
  TrendingUp,
  X,
  Sliders,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import ProductTable from '@/components/products/ProductTable';
import ProductCard from '@/components/products/ProductCard';
import ProductForm from '@/components/products/ProductForm';
import ReorderRuleForm from '@/components/products/ReorderRuleForm';
import CategoryManager from '@/components/products/CategoryManager';

export default function ProductsPage() {
  const {
    products,
    categories,
    loading,
    filters,
    viewMode,
    toast,
    fetchProducts,
    fetchCategories,
    setFilter,
    resetFilters,
    setViewMode,
    clearToast
  } = useProductStore();

  const [editingProduct, setEditingProduct] = useState(null);
  const [reorderProduct, setReorderProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Derived Metrics
  const totalProducts = products.length;
  const totalValuation = products.reduce(
    (acc, p) => acc + (parseFloat(p.price || 0) * parseInt(p.stockOnHand || 0, 10)),
    0
  );
  const lowStockCount = products.filter(
    (p) => p.stockOnHand > 0 && p.stockOnHand <= (p.minStockLevel || 10)
  ).length;
  const outOfStockCount = products.filter((p) => p.stockOnHand <= 0).length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121215] border border-white text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={clearToast} className="text-zinc-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Products Inventory Directory
            </h1>
            <span className="bw-badge bg-white text-black font-bold font-mono">
              BLACK & WHITE CORE
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time stock catalog, SKU specifications, pricing, and reorder controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bw-button-outline text-xs"
          >
            <FolderTree className="w-4 h-4" /> Categories
          </button>
          <Link href="/products/create" className="bw-button-primary text-xs">
            <PlusCircle className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* KPI Metrics Dashboard Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Total SKUs
            </span>
            <Package className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{totalProducts}</p>
          <p className="text-[11px] text-zinc-500 font-mono">Active catalog listings</p>
        </div>

        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Inventory Value
            </span>
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">Total on-hand valuation</p>
        </div>

        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Low Stock Warnings
            </span>
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{lowStockCount}</p>
          <p className="text-[11px] text-zinc-500 font-mono">Requires replenishment</p>
        </div>

        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Out of Stock
            </span>
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{outOfStockCount}</p>
          <p className="text-[11px] text-zinc-500 font-mono">Zero inventory count</p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bw-card p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter by SKU, Product Name, or Barcode..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="bw-input pl-9 text-xs"
            />
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              className="bw-input w-auto text-xs bg-[#18181c]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filters.stockStatus}
              onChange={(e) => setFilter('stockStatus', e.target.value)}
              className="bw-input w-auto text-xs bg-[#18181c]"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={resetFilters}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bw-card p-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto text-white animate-spin" />
          <p className="text-sm font-semibold text-zinc-300">Fetching Inventory Records...</p>
        </div>
      ) : viewMode === 'table' ? (
        <ProductTable
          products={products}
          onEdit={(prod) => setEditingProduct(prod)}
          onReorderRule={(prod) => setReorderProduct(prod)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full bw-card p-16 text-center space-y-3">
              <Package className="w-12 h-12 mx-auto text-zinc-600" />
              <p className="text-lg font-bold text-white">No products found</p>
              <p className="text-xs text-zinc-400">
                Adjust your filters or add a new product to get started.
              </p>
            </div>
          ) : (
            products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={(prod) => setEditingProduct(prod)}
              />
            ))
          )}
        </div>
      )}

      {/* Modal: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <ProductForm
              initialData={editingProduct}
              onSuccess={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal: Reorder Rules */}
      {reorderProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <ReorderRuleForm
              product={reorderProduct}
              onClose={() => setReorderProduct(null)}
              onSuccess={() => {
                setReorderProduct(null);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal: Category Manager */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <CategoryManager onClose={() => setShowCategoryModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
