'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  ArrowRight,
  Eye,
  CheckSquare,
  X
} from 'lucide-react';
import { useOperationStore } from '@/store/operationStore';

export default function TransfersPage() {
  const {
    transfers,
    loading,
    filters,
    toast,
    fetchTransfers,
    setFilter,
    validateTransfer,
    clearToast
  } = useOperationStore();

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  // Derived Metrics
  const totalTransfers = transfers.length;
  const readyCount = transfers.filter((t) => t.status === 'ready' || t.status === 'draft').length;
  const completedCount = transfers.filter((t) => t.status === 'done').length;
  const totalItemsMoved = transfers
    .filter((t) => t.status === 'done')
    .reduce((acc, t) => acc + t.items.reduce((sum, i) => sum + parseInt(i.qtyToTransfer || 0, 10), 0), 0);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'done':
        return <span className="bw-badge bw-badge-in-stock">Transferred</span>;
      case 'ready':
        return <span className="bw-badge bg-zinc-800 text-zinc-200 border border-zinc-600">Ready</span>;
      case 'draft':
        return <span className="bw-badge bw-badge-low-stock">Draft</span>;
      default:
        return <span className="bw-badge bg-zinc-900 text-zinc-400 border border-zinc-800">{status}</span>;
    }
  };

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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ArrowLeftRight className="w-8 h-8 text-white" />
              Internal Stock Transfers
            </h1>
            <span className="bw-badge bg-white text-black font-bold font-mono">
              LOCATION MOVEMENTS
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Move inventory between internal warehouse locations and production floors. Total company stock remains unchanged.
          </p>
        </div>

        <Link href="/operations/transfers/create" className="bw-button-primary text-xs">
          <PlusCircle className="w-4 h-4" /> New Transfer
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Total Transfers
            </span>
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{totalTransfers}</p>
          <p className="text-[11px] text-zinc-500 font-mono">Logged internal movements</p>
        </div>

        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              In-Transit / Pending
            </span>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{readyCount}</p>
          <p className="text-[11px] text-zinc-500 font-mono">Awaiting location execution</p>
        </div>

        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Completed Transfers
            </span>
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{completedCount}</p>
          <p className="text-[11px] text-zinc-500 font-mono">Quants updated & logged</p>
        </div>

        <div className="bw-card p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Relocated Units
            </span>
            <Package className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{totalItemsMoved}</p>
          <p className="text-[11px] text-zinc-500 font-mono">Total units moved internally</p>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bw-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search Transfer ID, Source, Destination or Product..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="bw-input pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              className="bw-input w-auto text-xs bg-[#18181c]"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="done">Transferred (Done)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transfers Data Table */}
      <div className="bw-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#09090b]/60 text-zinc-400 font-mono uppercase tracking-wider">
                <th className="p-4">Transfer Reference</th>
                <th className="p-4">Source Location (From)</th>
                <th className="p-4">Destination Location (To)</th>
                <th className="p-4">Items Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-zinc-500">
                    <ArrowLeftRight className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                    <p className="text-sm font-semibold text-white">No internal transfers found</p>
                    <p className="text-xs text-zinc-400 mt-1">Create a transfer order to move stock between locations.</p>
                  </td>
                </tr>
              ) : (
                transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-[#18181b]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-white text-sm">
                      <Link href={`/operations/transfers/${transfer.id}`} className="hover:underline">
                        {transfer.id}
                      </Link>
                    </td>

                    <td className="p-4 text-zinc-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{transfer.sourceLocation}</span>
                      </div>
                    </td>

                    <td className="p-4 text-white font-mono font-semibold">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{transfer.destinationLocation}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono">
                      <span className="bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded text-white font-bold">
                        {transfer.items ? transfer.items.length : transfer.totalItems} items
                      </span>
                    </td>

                    <td className="p-4">{getStatusBadge(transfer.status)}</td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/operations/transfers/${transfer.id}`}
                          className="bw-button-outline py-1 px-2.5 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Specs
                        </Link>

                        {transfer.status !== 'done' && (
                          <button
                            onClick={async () => {
                              if (confirm(`Confirm transfer ${transfer.id}? Location quants will update while total company stock remains unchanged.`)) {
                                await validateTransfer(transfer.id);
                              }
                            }}
                            className="bw-button-primary py-1 px-2.5 text-xs"
                          >
                            <CheckSquare className="w-3.5 h-3.5" /> Execute
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
