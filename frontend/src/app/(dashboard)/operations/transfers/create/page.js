'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowLeftRight } from 'lucide-react';
import TransferForm from '@/components/operations/TransferForm';

export default function CreateTransferPage() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Navigation Breadcrumbs & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2">
            <Link href="/operations/transfers" className="hover:text-white transition-colors">
              Operations & Logistics
            </Link>
            <span>/</span>
            <Link href="/operations/transfers" className="hover:text-white transition-colors">
              Internal Transfers
            </Link>
            <span>/</span>
            <span className="text-white">Create Transfer</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-white" />
            New Internal Stock Movement
          </h1>
        </div>

        <Link href="/operations/transfers" className="bw-button-outline text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Transfers
        </Link>
      </div>

      {/* Transfer Form Component */}
      <TransferForm />
    </div>
  );
}
