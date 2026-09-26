'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Layers,
  PlusCircle,
  FolderTree,
  LayoutDashboard,
  ArrowUpDown,
  Boxes,
  Activity,
  Bell,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname() || '';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products Directory', href: '/products', icon: Package },
    { label: 'Create Product', href: '/products/create', icon: PlusCircle },
    { label: 'Category Manager', href: '/products/categories', icon: FolderTree },
    { label: 'Stock Operations', href: '/operations', icon: ArrowUpDown },
    { label: '3D Warehouse', href: '/warehouse-3d', icon: Boxes },
    { label: 'Stock Ledger', href: '/move-history', icon: Activity },
    { label: 'Alerts & Anomalies', href: '/alerts', icon: Bell },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#09090b] border-r border-[#27272a] min-h-screen flex flex-col justify-between p-4 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-[#27272a]">
          <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-black text-xl shadow-lg">
            SS
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight">StockSense</h1>
            <p className="text-xs text-zinc-400 font-medium">B&W Inventory Core</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Catalog & Products
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/products' && item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / User Badge */}
      <div className="pt-4 border-t border-[#27272a]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#121215] border border-[#27272a]">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-xs font-bold text-white">
            WM
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Warehouse Manager</p>
            <p className="text-[10px] text-zinc-400 truncate">admin@stocksense.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
