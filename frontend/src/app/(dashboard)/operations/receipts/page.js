'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PackageOpen, Plus, Search, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MOCK_RECEIPTS = [
  { id: 'RCP-9021', supplier: 'TechWorld Supplies', items: 8, units: 240, status: 'validated', date: '2026-09-25', zone: 'Zone D' },
  { id: 'RCP-9020', supplier: 'Global Parts Co.', items: 3, units: 96, status: 'pending', date: '2026-09-25', zone: 'Zone A' },
  { id: 'RCP-9019', supplier: 'FastShip Inc.', items: 12, units: 504, status: 'pending', date: '2026-09-24', zone: 'Zone B' },
  { id: 'RCP-9018', supplier: 'MediaTech Corp.', items: 5, units: 180, status: 'validated', date: '2026-09-23', zone: 'Zone C' },
  { id: 'RCP-9017', supplier: 'TechWorld Supplies', items: 2, units: 48, status: 'overdue', date: '2026-09-20', zone: 'Zone A' },
];

const STATUS_CONFIG = {
  validated: { label: 'Validated', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  pending: { label: 'Pending', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  overdue: { label: 'Overdue', color: 'var(--color-error)', bg: 'rgba(239,68,68,0.1)', icon: AlertCircle },
};

export default function ReceiptsPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_RECEIPTS.filter(
    (r) => r.id.toLowerCase().includes(search.toLowerCase()) || r.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Goods Receipts</h1>
        </div>
        <Link href="/operations/receipts/create" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'var(--color-white)', color: 'var(--color-black)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
          <Plus size={15} /> New Receipt
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 340 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
        <input
          type="text" placeholder="Search receipts…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
                {['Receipt ID', 'Supplier', 'Items', 'Total Units', 'Destination', 'Date', 'Status', ''].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const cfg = STATUS_CONFIG[r.status];
                const Icon = cfg.icon;
                return (
                  <tr key={r.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{r.supplier}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.items}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.units}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.zone}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{r.date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link href={`/operations/receipts/${r.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', textDecoration: 'none' }}>
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
