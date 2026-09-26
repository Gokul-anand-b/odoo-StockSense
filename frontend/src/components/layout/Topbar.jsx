'use client';

import React from 'react';
import { Search, Bell, Shield, Radio } from 'lucide-react';

export default function Topbar({ title = 'Products Management' }) {
  return (
    <header className="h-16 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <span className="bw-badge bg-zinc-900 text-zinc-300 border border-zinc-700">
          <Radio className="w-3 h-3 text-white animate-pulse" /> Live Pulse
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Quick SKU search..."
            className="bw-input pl-9 text-xs"
          />
        </div>

        {/* Notifications Button */}
        <button className="p-2 rounded-lg border border-[#27272a] bg-[#121215] text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-white absolute top-1.5 right-1.5 ring-2 ring-black" />
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-[#121215] border border-[#27272a] px-3 py-1.5 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-white" />
          <span>B&W ENGINE ONLINE</span>
        </div>
      </div>
    </header>
  );
}
