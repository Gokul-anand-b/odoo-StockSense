'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Navigation Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2">
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-white">Create Product</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-white" />
            Add New Inventory SKU
          </h1>
        </div>

        <Link href="/products" className="bw-button-outline text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>

      {/* Form Component */}
      <ProductForm />
    </div>
  );
}
