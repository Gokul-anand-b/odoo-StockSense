'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowLeftRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Package,
  Printer,
  CheckSquare,
  ShieldCheck,
  Activity,
  ArrowRight,
  X
} from 'lucide-react';
import { useOperationStore } from '@/store/operationStore';

export default function TransferDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchTransferById, selectedTransfer, loading, validateTransfer, toast, clearToast } = useOperationStore();

  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTransferById(id);
    }
  }, [id, fetchTransferById]);

  if (loading || (!selectedTransfer && loading)) {
    return (
      <div className="bw-card p-16 text-center space-y-4">
        <ArrowLeftRight className="w-8 h-8 mx-auto text-white animate-pulse" />
        <p className="text-sm font-semibold text-zinc-300">Loading Transfer Specifications...</p>
      </div>
    );
  }

  if (!selectedTransfer) {
    return (
      <div className="bw-card p-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Transfer Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested transfer ID <span className="font-mono text-white">{id}</span> does not exist.
        </p>
        <Link href="/operations/transfers" className="bw-button-primary text-xs">
          Return to Internal Transfers List
        </Link>
      </div>
    );
  }

  const isValidated = selectedTransfer.status === 'done';

  const handleConfirmTransfer = async () => {
    if (!confirm(`Confirm internal transfer ${selectedTransfer.id}? Location quants will update while total company stock remains unchanged.`)) {
      return;
    }

    setValidating(true);
    try {
      await validateTransfer(selectedTransfer.id);
      await fetchTransferById(id);
    } catch (err) {
      console.error(err);
    } finally {
      setValidating(false);
    }
  };

  const totalUnits = selectedTransfer.items
    ? selectedTransfer.items.reduce((acc, i) => acc + parseInt(i.qtyToTransfer || 0, 10), 0)
    : 0;

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

      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2">
            <Link href="/operations/transfers" className="hover:text-white transition-colors">
              Internal Transfers
            </Link>
            <span>/</span>
            <span className="text-white">{selectedTransfer.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight font-mono">
              {selectedTransfer.id}
            </h1>
            {isValidated ? (
              <span className="bw-badge bw-badge-in-stock text-xs py-1 px-3">
                <CheckCircle2 className="w-3.5 h-3.5" /> Transferred (Done)
              </span>
            ) : (
              <span className="bw-badge bg-zinc-800 text-zinc-200 border border-zinc-600 text-xs py-1 px-3">
                Ready to Execute
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/operations/transfers" className="bw-button-outline text-xs">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          {!isValidated && (
            <button
              onClick={handleConfirmTransfer}
              disabled={validating}
              className="bw-button-primary text-xs"
            >
              <CheckSquare className="w-4 h-4" />
              {validating ? 'Executing Transfer...' : 'Confirm & Execute Transfer'}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="bw-button-outline text-xs"
            title="Print Stock Movement Slip"
          >
            <Printer className="w-4 h-4" /> Print Slip
          </button>
        </div>
      </div>

      {/* Operation Status Pipeline Flow */}
      <div className="bw-card p-5 bg-[#121215]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-zinc-400">Pipeline Status:</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className={`px-3 py-1 rounded-md border ${selectedTransfer.status === 'draft' ? 'bg-white text-black font-bold' : 'bg-[#18181c] text-zinc-400 border-[#27272a]'}`}>
              1. Draft
            </span>
            <span className="text-zinc-600">→</span>
            <span className={`px-3 py-1 rounded-md border ${selectedTransfer.status === 'ready' ? 'bg-white text-black font-bold' : 'bg-[#18181c] text-zinc-400 border-[#27272a]'}`}>
              2. Ready
            </span>
            <span className="text-zinc-600">→</span>
            <span className={`px-3 py-1 rounded-md border ${selectedTransfer.status === 'done' ? 'bg-white text-black font-bold shadow-lg' : 'bg-[#18181c] text-zinc-400 border-[#27272a]'}`}>
              3. Transferred (Location Quants Updated)
            </span>
          </div>
        </div>
      </div>

      {/* Validated Ledger Banner Notification */}
      {isValidated && (
        <div className="bg-[#121215] border border-white p-5 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Internal Stock Transfer Executed</h4>
              <p className="text-xs text-zinc-300">
                Location quants updated seamlessly. Total company stock remains unchanged while an <span className="font-mono text-white">INTERNAL_TRANSFER</span> entry was logged to the ledger at{' '}
                <span className="font-mono text-white">{new Date(selectedTransfer.validatedAt || Date.now()).toLocaleTimeString()}</span>.
              </p>
            </div>
          </div>

          <Link href="/move-history" className="bw-button-outline text-xs">
            <Activity className="w-4 h-4 text-white" /> View Stock Ledger
          </Link>
        </div>
      )}

      {/* Location Route Card */}
      <div className="bw-card p-6 bg-[#121215] border-zinc-700">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
          Location Relocation Route
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-xl bg-[#09090b] border border-[#27272a]">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">From Source Location</span>
            <p className="text-lg font-bold text-white font-mono flex items-center gap-2 justify-center md:justify-start">
              <MapPin className="w-4 h-4 text-zinc-400" /> {selectedTransfer.sourceLocation}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg">
            <ArrowRight className="w-5 h-5 text-black" />
          </div>

          <div className="space-y-1 text-center md:text-right">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">To Destination Location</span>
            <p className="text-lg font-bold text-white font-mono flex items-center gap-2 justify-center md:justify-end">
              <MapPin className="w-4 h-4 text-white" /> {selectedTransfer.destinationLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Transfer Lines Table */}
      <div className="bw-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-white" /> Relocated Line Items
          </h3>
          <span className="font-mono text-xs text-white bg-[#18181b] border border-[#27272a] px-3 py-1 rounded-lg">
            Total Units: {totalUnits}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#09090b]/60 text-zinc-400 font-mono uppercase tracking-wider">
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Quantity Transferred</th>
                <th className="p-3">Impact on Total Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {selectedTransfer.items && selectedTransfer.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#18181b]/50">
                  <td className="p-3 font-bold text-white text-sm">{item.product}</td>
                  <td className="p-3 font-mono text-zinc-300">{item.sku}</td>
                  <td className="p-3 font-mono font-bold text-white text-sm">
                    {item.qtyToTransfer} {item.uom || 'units'}
                  </td>
                  <td className="p-3 font-mono text-zinc-400">
                    <span className="bw-badge bg-[#18181b] text-zinc-300 border border-zinc-700">
                      0 Net Delta (Quants Updated)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Notes */}
      {selectedTransfer.notes && (
        <div className="bw-card p-6 space-y-2">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Transfer Purpose & Internal Notes
          </h4>
          <p className="text-sm text-zinc-300">{selectedTransfer.notes}</p>
        </div>
      )}
    </div>
  );
}
