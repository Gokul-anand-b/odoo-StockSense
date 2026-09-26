'use client';

import Link from 'next/link';
import {
  ArrowLeftRight,
  PackageOpen,
  Truck,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';

const OPERATION_MODULES = [
  {
    href: '/operations/receipts',
    icon: PackageOpen,
    title: 'Goods Receipts',
    description: 'Log incoming stock from suppliers and purchase orders into warehouse zones.',
    count: '6 pending',
    color: 'var(--color-success)',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    href: '/operations/deliveries',
    icon: Truck,
    title: 'Customer Deliveries',
    description: 'Pick and dispatch outbound orders to customers and distribution centers.',
    count: '14 pending',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    href: '/operations/transfers',
    icon: ArrowLeftRight,
    title: 'Internal Transfers',
    description: 'Move inventory between warehouse zones, bays, and storage locations.',
    count: '4 pending',
    color: 'var(--color-warning)',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    href: '/operations/adjustments',
    icon: PackageCheck,
    title: 'Stock Adjustments',
    description: 'Cycle count discrepancy corrections, damage write-offs, and ledger reconciliation.',
    count: '0 pending',
    color: 'var(--color-text-secondary)',
    bg: 'var(--color-surface-2)',
    border: 'var(--color-border)',
  },
];

export default function OperationsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      {/* Header */}
      <section style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.4), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)' }}>
            <ArrowLeftRight size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-white)', letterSpacing: 'var(--tracking-tight)' }}>
              Warehouse Operations
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              Execute receipts, deliveries, transfers, and inventory adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* Summary Bar */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Total Pending', value: 24 },
          { label: 'Completed Today', value: 38 },
          { label: 'Overdue', value: 2, warn: true },
          { label: 'Avg. Cycle Time', value: '1.4h' },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', fontWeight: 600, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: warn ? 'var(--color-error)' : 'var(--color-white)' }}>{value}</div>
          </div>
        ))}
      </section>

      {/* Operation Modules */}
      <section>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 'var(--space-4)' }}>
          Operation Types
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {OPERATION_MODULES.map(({ href, icon: Icon, title, description, count, color, bg, border }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                textDecoration: 'none',
                transition: 'all 0.2s var(--ease-out)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: bg, color, fontWeight: 600, border: `1px solid ${border}` }}>
                  {count}
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-white)', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>{description}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color, fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                Open module <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
