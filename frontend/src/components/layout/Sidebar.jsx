'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Truck,
  ArrowDownLeft,
  ArrowLeftRight,
  SlidersHorizontal,
  History,
  Box,
  Settings,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname() || '';

  const isActive = (href) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <aside className="w-64 bg-[#09090b] border-r border-[#27272a] min-h-screen flex flex-col justify-between p-4 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-[#27272a]">
          <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center font-black text-lg shadow-md">
            SS
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">StockSense</h1>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">B&W Inventory Core</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-4">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Catalog & Products
            </p>
            <div className="space-y-1">
              <Link
                href="/products"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/products') && !pathname.includes('/categories') && !pathname.includes('/create')
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products Directory</span>
              </Link>
              <Link
                href="/products/create"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/products/create'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Product</span>
              </Link>
              <Link
                href="/products/categories"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/products/categories'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>Categories</span>
              </Link>
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Operations & Logistics
            </p>
            <div className="space-y-1">
              <Link
                href="/operations/deliveries"
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/operations/deliveries')
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4" />
                  <span>Delivery Orders</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Active
                </span>
              </Link>
              <Link
                href="/operations/receipts"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/operations/receipts')
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Incoming Receipts</span>
              </Link>
              <Link
                href="/operations/transfers"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/operations/transfers')
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Internal Transfers</span>
              </Link>
              <Link
                href="/operations/adjustments"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/operations/adjustments')
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Stock Adjustments</span>
              </Link>
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Ledger & Visualization
            </p>
            <div className="space-y-1">
              <Link
                href="/move-history"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/move-history')
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Stock Move Ledger</span>
              </Link>
              <Link
                href="/warehouse-3d"
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/warehouse-3d')
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Box className="w-4 h-4" />
                  <span>3D Warehouse</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-black font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> 3D
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
            GA
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Gokul Anand</p>
            <p className="text-[10px] text-zinc-400">Inventory Manager</p>
          </div>
        </div>
        <button className="text-zinc-400 hover:text-white p-1">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
