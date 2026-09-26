'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowDownLeft,
  CheckCircle2,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Package,
  DollarSign,
  Printer,
  Edit,
  CheckSquare,
  ShieldCheck,
  Activity,
  X
} from 'lucide-react';
import { useOperationStore } from '@/store/operationStore';

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchReceiptById, selectedReceipt, loading, validateReceipt, toast, clearToast } = useOperationStore();

  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReceiptById(id);
    }
  }, [id, fetchReceiptById]);

  if (loading || (!selectedReceipt && loading)) {
    return (
      <div className="bw-card p-16 text-center space-y-4">
        <ArrowDownLeft className="w-8 h-8 mx-auto text-white animate-pulse" />
        <p className="text-sm font-semibold text-zinc-300">Loading Receipt Specifications...</p>
      </div>
    );
  }

  if (!selectedReceipt) {
    return (
      <div className="bw-card p-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Receipt Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested receipt ID <span className="font-mono text-white">{id}</span> does not exist.
        </p>
        <Link href="/operations/receipts" className="bw-button-primary text-xs">
          Return to Receipts List
        </Link>
      </div>
    );
  }

  const isValidated = selectedReceipt.status === 'done';

  const handleValidate = async () => {
    if (!confirm(`Validate receipt ${selectedReceipt.id}? This will automatically increase physical stock on hand and write entries to the ledger.`)) {
      return;
    }

    setValidating(true);
    try {
      await validateReceipt(selectedReceipt.id);
      await fetchReceiptById(id);
    } catch (err) {
      console.error(err);
    } finally {
      setValidating(false);
    }
  };

  const totalReceiptValue = selectedReceipt.items
    ? selectedReceipt.items.reduce(
        (acc, i) => acc + (parseFloat(i.unitPrice || 0) * parseInt(i.received || i.expected || 0, 10)),
        0
      )
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
            <Link href="/operations/receipts" className="hover:text-white transition-colors">
              Incoming Receipts
            </Link>
            <span>/</span>
            <span className="text-white">{selectedReceipt.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight font-mono">
              {selectedReceipt.id}
            </h1>
            {isValidated ? (
              <span className="bw-badge bw-badge-in-stock text-xs py-1 px-3">
                <CheckCircle2 className="w-3.5 h-3.5" /> Validated (Done)
              </span>
            ) : (
              <span className="bw-badge bg-zinc-800 text-zinc-200 border border-zinc-600 text-xs py-1 px-3">
                Ready to Validate
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/operations/receipts" className="bw-button-outline text-xs">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          {!isValidated && (
            <button
              onClick={handleValidate}
              disabled={validating}
              className="bw-button-primary text-xs"
            >
              <CheckSquare className="w-4 h-4" />
              {validating ? 'Validating & Increasing Stock...' : 'Validate & Credit Stock'}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="bw-button-outline text-xs"
            title="Print Goods Received Note"
          >
            <Printer className="w-4 h-4" /> Print GRN
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
            <span className={`px-3 py-1 rounded-md border ${selectedReceipt.status === 'draft' ? 'bg-white text-black font-bold' : 'bg-[#18181c] text-zinc-400 border-[#27272a]'}`}>
              1. Draft
            </span>
            <span className="text-zinc-600">→</span>
            <span className={`px-3 py-1 rounded-md border ${selectedReceipt.status === 'ready' ? 'bg-white text-black font-bold' : 'bg-[#18181c] text-zinc-400 border-[#27272a]'}`}>
              2. Ready
            </span>
            <span className="text-zinc-600">→</span>
            <span className={`px-3 py-1 rounded-md border ${selectedReceipt.status === 'done' ? 'bg-white text-black font-bold shadow-lg' : 'bg-[#18181c] text-zinc-400 border-[#27272a]'}`}>
              3. Validated (Stock Credited)
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
              <h4 className="font-bold text-white text-sm">Receipt Successfully Validated</h4>
              <p className="text-xs text-zinc-300">
                Stock on hand has been automatically credited and a permanent entry written to the Stock Move Ledger at{' '}
                <span className="font-mono text-white">{new Date(selectedReceipt.validatedAt || Date.now()).toLocaleTimeString()}</span>.
              </p>
            </div>
          </div>

          <Link href="/move-history" className="bw-button-outline text-xs">
            <Activity className="w-4 h-4 text-white" /> View Stock Ledger
          </Link>
        </div>
      )}

      {/* Specification Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bw-card p-5 space-y-3">
          <p className="text-xs text-zinc-400 font-mono uppercase flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-white" /> Supplier / Vendor
          </p>
          <p className="text-lg font-bold text-white tracking-tight">{selectedReceipt.supplier}</p>
          <p className="text-xs text-zinc-500 font-mono">PO Ref: {selectedReceipt.poReference || 'N/A'}</p>
        </div>

        <div className="bw-card p-5 space-y-3">
          <p className="text-xs text-zinc-400 font-mono uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-white" /> Destination Storage
          </p>
          <p className="text-lg font-bold text-white tracking-tight">{selectedReceipt.destinationLocation}</p>
          <p className="text-xs text-zinc-500 font-mono">
            Arrival: {new Date(selectedReceipt.scheduledDate || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <div className="bw-card p-5 space-y-3">
          <p className="text-xs text-zinc-400 font-mono uppercase flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-white" /> Total Inbound Value
          </p>
          <p className="text-2xl font-black text-white font-mono">
            ${totalReceiptValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 font-mono">
            {selectedReceipt.items ? selectedReceipt.items.length : 0} line items
          </p>
        </div>
      </div>

      {/* Inbound Line Items Table */}
      <div className="bw-card p-6 space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-white" /> Itemized Goods Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#09090b]/60 text-zinc-400 font-mono uppercase tracking-wider">
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Expected Qty</th>
                <th className="p-3">Received Qty</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {selectedReceipt.items && selectedReceipt.items.map((item, idx) => {
                const qty = parseInt(item.received ?? item.expected, 10);
                const subtotal = qty * parseFloat(item.unitPrice || 0);

                return (
                  <tr key={idx} className="hover:bg-[#18181b]/50">
                    <td className="p-3 font-bold text-white text-sm">{item.product}</td>
                    <td className="p-3 font-mono text-zinc-300">{item.sku}</td>
                    <td className="p-3 font-mono text-zinc-400">
                      {item.expected} {item.uom || 'units'}
                    </td>
                    <td className="p-3 font-mono font-bold text-white text-sm">
                      {qty} {item.uom || 'units'}
                    </td>
                    <td className="p-3 font-mono text-zinc-300">
                      ${parseFloat(item.unitPrice || 0).toFixed(2)}
                    </td>
                    <td className="p-3 font-mono font-bold text-white text-right text-sm">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Section */}
      {selectedReceipt.notes && (
        <div className="bw-card p-6 space-y-2">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Notes & Remarks
          </h4>
          <p className="text-sm text-zinc-300">{selectedReceipt.notes}</p>
        </div>
      )}
    </div>
  );
}
