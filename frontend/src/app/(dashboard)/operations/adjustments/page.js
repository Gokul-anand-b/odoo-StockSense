'use client';

import Link from 'next/link';
import { PackageCheck, Plus } from 'lucide-react';

const MOCK_ADJUSTMENTS = [
  { id: 'ADJ-1041', type: 'Cycle Count', sku: 'SKU-00192', product: 'Wireless Earbuds Pro', expected: 50, actual: 48, delta: -2, date: '2026-09-25', zone: 'Zone A' },
  { id: 'ADJ-1040', type: 'Damage Write-off', sku: 'SKU-00388', product: 'Webcam 4K Ultra', expected: 70, actual: 67, delta: -3, date: '2026-09-24', zone: 'Zone B' },
  { id: 'ADJ-1039', type: 'Found Stock', sku: 'SKU-00210', product: 'Monitor Stand Adjustable', expected: 140, actual: 142, delta: +2, date: '2026-09-23', zone: 'Zone D' },
];

export default function AdjustmentsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Stock Adjustments</h1>
        </div>
        <Link href="/operations/adjustments/create" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'var(--color-white)', color: 'var(--color-black)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
          <Plus size={15} /> New Adjustment
        </Link>
      </div>

      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
              {['Adj. ID', 'Type', 'SKU', 'Product', 'Expected', 'Actual', 'Delta', 'Zone', 'Date'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ADJUSTMENTS.map((r, idx) => (
              <tr key={r.id} style={{ borderBottom: idx < MOCK_ADJUSTMENTS.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.id}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.type}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{r.sku}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{r.product}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.expected}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.actual}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', fontWeight: 700, color: r.delta < 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
                  {r.delta > 0 ? `+${r.delta}` : r.delta}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.zone}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
