'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Plus, Search, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { operationService } from '@/services/operationService';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'var(--color-text-secondary)', bg: 'var(--color-surface-2)', icon: Clock },
  pending: { label: 'Ready to Pick', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  ready: { label: 'Ready to Ship', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', icon: Truck },
  dispatched: { label: 'Dispatched', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  done: { label: 'Done', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'var(--color-error)', bg: 'rgba(239,68,68,0.1)', icon: AlertCircle },
  overdue: { label: 'Overdue', color: 'var(--color-error)', bg: 'rgba(239,68,68,0.1)', icon: AlertCircle },
};

const PRIORITY_CONFIG = {
  urgent: { label: 'URGENT', color: 'var(--color-error)' },
  high: { label: 'HIGH', color: 'var(--color-warning)' },
  normal: { label: 'NORMAL', color: 'var(--color-text-tertiary)' },
};

export default function DeliveriesPage() {
  const [search, setSearch] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await operationService.getDeliveries();
        setDeliveries(data);
      } catch (err) {
        console.error('Failed to load deliveries:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = deliveries.filter(
    (r) => r.id.toLowerCase().includes(search.toLowerCase()) || (r.customer && r.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Customer Deliveries</h1>
        </div>
        <Link href="/operations/deliveries/create" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'var(--color-white)', color: 'var(--color-black)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
          <Plus size={15} /> New Delivery
        </Link>
      </div>

      <div style={{ position: 'relative', maxWidth: 340 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
        <input type="text" placeholder="Search deliveries…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
             <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading deliveries...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
                  {['Delivery ID', 'Customer', 'Items', 'Units', 'Priority', 'Date', 'Status', ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => {
                  const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG['draft'];
                  const pri = PRIORITY_CONFIG[r.priority || 'normal'];
                  const Icon = cfg.icon;
                  return (
                    <tr key={r.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{r.customer}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.items}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.units}</td>
                      <td style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, color: pri.color, fontFamily: 'var(--font-mono)' }}>{pri.label}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{r.date}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link href={`/operations/deliveries/${r.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', textDecoration: 'none' }}>
                          <Eye size={14} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                   <tr>
                     <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                       No deliveries found.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
