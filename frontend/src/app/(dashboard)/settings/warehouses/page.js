'use client';

import Link from 'next/link';
import { Warehouse, Plus, ArrowLeft } from 'lucide-react';

const WAREHOUSES = [
  { id: 'WH-001', name: 'Main Distribution Centre', zones: 4, capacity: '10,000 sqft', city: 'Mumbai', status: 'operational' },
  { id: 'WH-002', name: 'Northern Hub', zones: 2, capacity: '4,500 sqft', city: 'Delhi', status: 'operational' },
  { id: 'WH-003', name: 'Southern Store', zones: 3, capacity: '6,800 sqft', city: 'Chennai', status: 'maintenance' },
];

export default function WarehousesSettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/settings" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> Settings
          </Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Warehouse Management</h1>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <Plus size={14} /> Add Warehouse
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {WAREHOUSES.map((wh) => (
          <div key={wh.id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                <Warehouse size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{wh.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{wh.id} · {wh.city} · {wh.zones} zones · {wh.capacity}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ padding: '3px 12px', borderRadius: 'var(--radius-full)', background: wh.status === 'operational' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: wh.status === 'operational' ? 'var(--color-success)' : 'var(--color-warning)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'capitalize' }}>
                {wh.status}
              </span>
              <button style={{ padding: '6px 14px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
