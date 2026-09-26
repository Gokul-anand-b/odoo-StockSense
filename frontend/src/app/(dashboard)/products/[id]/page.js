'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  QrCode,
  MapPin,
  Tag,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Boxes,
  Activity,
  Layers,
  Printer
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import StockAvailability from '@/components/products/StockAvailability';
import ReorderRuleForm from '@/components/products/ReorderRuleForm';
import ProductForm from '@/components/products/ProductForm';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchProductById, selectedProduct, loading, deleteProduct } = useProductStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'availability' | 'reorder'
  const [isEditing, setIsEditing] = useState(false);
  const [showBarcodePrint, setShowBarcodePrint] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  if (loading || (!selectedProduct && loading)) {
    return (
      <div className="bw-card p-16 text-center space-y-4">
        <Package className="w-8 h-8 mx-auto text-white animate-pulse" />
        <p className="text-sm font-semibold text-zinc-300">Loading Product Specifications...</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="bw-card p-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 mx-auto text-zinc-500" />
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested product ID <span className="font-mono text-white">{id}</span> does not exist or has been removed.
        </p>
        <Link href="/products" className="bw-button-primary text-xs">
          Return to Products Directory
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm(`Delete ${selectedProduct.name}?`)) {
      await deleteProduct(selectedProduct.id);
      router.push('/products');
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <h2 className="text-2xl font-bold text-white">Editing: {selectedProduct.name}</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="bw-button-outline text-xs"
          >
            Cancel Editing
          </button>
        </div>
        <ProductForm
          initialData={selectedProduct}
          onSuccess={() => {
            setIsEditing(false);
            fetchProductById(id);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2">
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-white">{selectedProduct.sku}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {selectedProduct.name}
            </h1>
            {selectedProduct.stockOnHand <= 0 ? (
              <span className="bw-badge bw-badge-out-of-stock">Out of Stock</span>
            ) : selectedProduct.stockOnHand <= (selectedProduct.minStockLevel || 10) ? (
              <span className="bw-badge bw-badge-low-stock">Low Stock</span>
            ) : (
              <span className="bw-badge bw-badge-in-stock">In Stock</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBarcodePrint(true)}
            className="bw-button-outline text-xs"
          >
            <Printer className="w-4 h-4" /> Print Barcode Label
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="bw-button-secondary text-xs"
          >
            <Edit className="w-4 h-4" /> Edit Specs
          </button>
          <button
            onClick={handleDelete}
            className="bw-button-outline text-xs text-red-400 hover:text-red-300 hover:border-red-800"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Hero Product Overview Banner */}
      <div className="bw-card p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Image */}
        <div className="relative h-64 lg:h-auto rounded-xl bg-[#09090b] border border-[#27272a] overflow-hidden flex items-center justify-center">
          {selectedProduct.imageUrl ? (
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          ) : (
            <Package className="w-16 h-16 text-zinc-600" />
          )}
        </div>

        {/* Right Column: Spec Sheet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#121215] border border-[#27272a]">
            <div>
              <p className="text-xs text-zinc-400 font-mono">Selling Price</p>
              <p className="text-2xl font-black text-white font-mono">
                ${parseFloat(selectedProduct.price).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-mono">Cost Price</p>
              <p className="text-2xl font-black text-zinc-300 font-mono">
                ${parseFloat(selectedProduct.costPrice || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-mono">Stock on Hand</p>
              <p className="text-2xl font-black text-white font-mono">
                {selectedProduct.stockOnHand} <span className="text-xs font-normal text-zinc-400">{selectedProduct.unitOfMeasure}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-mono">SKU Code</p>
              <p className="text-base font-bold text-white font-mono mt-1">
                {selectedProduct.sku}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Description & Inventory Notes
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {selectedProduct.description || 'No detailed technical documentation provided for this product entry.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-400 border-t border-[#27272a] pt-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-white" />
              <span>Category: <strong className="text-white">{selectedProduct.category}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white" />
              <span>Primary Bay: <strong className="text-white">{selectedProduct.warehouse}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-white" />
              <span>Barcode: <strong className="text-white">{selectedProduct.barcode || '8901234567890'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-white" />
              <span>Last Modified: <strong className="text-white">{new Date(selectedProduct.updatedAt || Date.now()).toLocaleDateString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#27272a] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
          }`}
        >
          <Boxes className="w-4 h-4 inline mr-2" /> Stock Availability & Warehouses
        </button>

        <button
          onClick={() => setActiveTab('reorder')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'reorder'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
          }`}
        >
          <Sliders className="w-4 h-4 inline mr-2" /> Reorder Rule Rules
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'overview' && (
          <StockAvailability product={selectedProduct} />
        )}

        {activeTab === 'reorder' && (
          <ReorderRuleForm
            product={selectedProduct}
            onSuccess={() => fetchProductById(id)}
          />
        )}
      </div>

      {/* Printable Barcode Label Modal */}
      {showBarcodePrint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded-xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="border-2 border-black p-6 rounded-lg space-y-3">
              <p className="font-black text-xl tracking-tight uppercase">{selectedProduct.name}</p>
              <p className="font-mono text-xs font-bold">SKU: {selectedProduct.sku}</p>

              {/* Barcode Graphic */}
              <div className="flex gap-1 items-center h-20 w-full justify-center my-4">
                {[5, 2, 7, 1, 4, 6, 2, 8, 3, 1, 5, 2, 7, 2, 6, 3, 2, 5, 1, 7].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w * 2}px` }}
                  />
                ))}
              </div>
              <p className="font-mono font-bold text-sm tracking-widest">
                {selectedProduct.barcode || '8901234567890'}
              </p>
              <p className="text-[10px] font-mono text-zinc-600">STOCKSENSE B&W INVENTORY SYSTEM</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-black text-white font-bold text-xs py-2 px-4 rounded-lg w-full"
              >
                Print Label
              </button>
              <button
                onClick={() => setShowBarcodePrint(false)}
                className="bg-zinc-200 text-black font-bold text-xs py-2 px-4 rounded-lg w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
