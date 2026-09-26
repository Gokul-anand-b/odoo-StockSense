'use client';

import React from 'react';
import {
  Boxes,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  ShieldCheck
} from 'lucide-react';

export default function StockAvailability({ product }) {
  if (!product) return null;

  const warehouses = product.warehouses || [
    { name: 'Warehouse A (Central Hub)', onHand: product.stockOnHand || 0, reserved: 2, incoming: 10, min: product.minStockLevel || 10 },
    { name: 'Warehouse B (East Logistics)', onHand: 0, reserved: 0, incoming: 0, min: 5 }
  ];

  const totalOnHand = warehouses.reduce((acc, w) => acc + (w.onHand || 0), 0);
  const totalReserved = warehouses.reduce((acc, w) => acc + (w.reserved || 0), 0);
  const totalIncoming = warehouses.reduce((acc, w) => acc + (w.incoming || 0), 0);
  const availableToPromise = Math.max(0, totalOnHand - totalReserved);

  return (
    <div className="bw-card p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#27272a] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Warehouse Stock Availability & Distribution
            </h3>
            <span className="bw-badge bg-white text-black font-mono font-bold">
              LIVE NETWORK
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time on-hand, reserved, and incoming inventory across all fulfillment centers.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>SAFETY THRESHOLD: {product.minStockLevel || 10} {product.unitOfMeasure || 'units'}</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121215] border border-[#27272a] p-4 rounded-xl space-y-1">
          <p className="text-xs font-mono text-zinc-400">Total On-Hand</p>
          <p className="text-2xl font-extrabold text-white font-mono">{totalOnHand}</p>
          <span className="text-[10px] text-zinc-500 font-mono">Physical count</span>
        </div>

        <div className="bg-[#121215] border border-[#27272a] p-4 rounded-xl space-y-1">
          <p className="text-xs font-mono text-zinc-400">Available to Promise</p>
          <p className="text-2xl font-extrabold text-white font-mono">{availableToPromise}</p>
          <span className="text-[10px] text-zinc-500 font-mono">Unreserved stock</span>
        </div>

        <div className="bg-[#121215] border border-[#27272a] p-4 rounded-xl space-y-1">
          <p className="text-xs font-mono text-zinc-400">Allocated / Reserved</p>
          <p className="text-2xl font-extrabold text-zinc-300 font-mono">{totalReserved}</p>
          <span className="text-[10px] text-zinc-500 font-mono">Pending orders</span>
        </div>

        <div className="bg-[#121215] border border-[#27272a] p-4 rounded-xl space-y-1">
          <p className="text-xs font-mono text-zinc-400">Incoming Receipts</p>
          <p className="text-2xl font-extrabold text-white font-mono">{totalIncoming}</p>
          <span className="text-[10px] text-zinc-500 font-mono">In-transit POs</span>
        </div>
      </div>

      {/* Warehouse Location List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Warehouse Location Breakdown
        </h4>

        <div className="space-y-3">
          {warehouses.map((wh, idx) => {
            const isLow = wh.onHand <= (wh.min || 5);
            return (
              <div
                key={idx}
                className="bg-[#121215] border border-[#27272a] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white" />
                    <h5 className="font-bold text-white text-sm">{wh.name}</h5>
                    {isLow && (
                      <span className="bw-badge bw-badge-low-stock text-[10px]">
                        Low Zone Stock
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    Min Threshold: {wh.min || 5} {product.unitOfMeasure || 'units'}
                  </p>
                </div>

                {/* Meter & Quantities */}
                <div className="flex items-center gap-6">
                  <div className="text-right space-y-0.5">
                    <p className="text-xs text-zinc-400">On-Hand</p>
                    <p className="text-base font-bold font-mono text-white">
                      {wh.onHand} <span className="text-xs font-normal text-zinc-500">{product.unitOfMeasure}</span>
                    </p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <p className="text-xs text-zinc-400">Reserved</p>
                    <p className="text-base font-bold font-mono text-zinc-300">{wh.reserved || 0}</p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <p className="text-xs text-zinc-400">Incoming</p>
                    <p className="text-base font-bold font-mono text-white">{wh.incoming || 0}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
