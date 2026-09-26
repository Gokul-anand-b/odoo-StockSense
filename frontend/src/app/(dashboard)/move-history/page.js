'use client';

import { useState } from 'react';
import { History, Search, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Filter } from 'lucide-react';

const MOVE_TYPES = {
  receipt: { label: 'Receipt', icon: ArrowDownLeft, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
  delivery: { label: 'Delivery', icon: ArrowUpRight, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  transfer: { label: 'Transfer', icon: ArrowLeftRight, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
};

const MOCK_MOVES = [
  { id: 'MV-8801', type: 'receipt', sku: 'SKU-00210', product: 'Monitor Stand Adjustable', qty: 240, from: 'Supplier', to: 'Zone D', user: 'Priya M.', date: '2026-09-25 14:22' },
  { id: 'MV-8800', type: 'delivery', sku: 'SKU-00192', product: 'Wireless Earbuds Pro', qty: 12, from: 'Zone A', to: 'Customer', user: 'Arjun K.', date: '2026-09-25 13:10' },
  { id: 'MV-8799', type: 'transfer', sku: 'SKU-00781', product: 'Mechanical Keyboard TKL', qty: 20, from: 'Zone B', to: 'Zone A', user: 'Gokul A.', date: '2026-09-25 11:45' },
  { id: 'MV-8798', type: 'receipt', sku: 'SKU-00388', product: 'Webcam 4K Ultra', qty: 60, from: 'Supplier', to: 'Zone B', user: 'Priya M.', date: '2026-09-24 16:00' },
  { id: 'MV-8797', type: 'delivery', sku: 'SKU-00512', product: 'Laptop Docking Station', qty: 5, from: 'Zone C', to: 'Customer', user: 'Arjun K.', date: '2026-09-24 14:30' },
  { id: 'MV-8796', type: 'transfer', sku: 'SKU-00901', product: 'LED Monitor 27"', qty: 8, from: 'Zone D', to: 'Zone C', user: 'Gokul A.', date: '2026-09-24 10:15' },
  { id: 'MV-8795', type: 'receipt', sku: 'SKU-00302', product: 'Gaming Mouse RGB', qty: 100, from: 'Supplier', to: 'Zone A', user: 'Priya M.', date: '2026-09-23 09:00' },
];

export default function MoveHistoryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = MOCK_MOVES.filter(
    (m) =>
      (typeFilter === 'all' || m.type === typeFilter) &&
      (m.id.toLowerCase().includes(search.toLowerCase()) ||
        m.product.toLowerCase().includes(search.toLowerCase()) ||
        m.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      {/* Header */}
      <section style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6) var(--space-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)' }}>
            <History size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: 'var(--tracking-tight)' }}>Move History</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Full audit ledger of all stock movements across the warehouse.</p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
          <input type="text" placeholder="Search moves, SKU, product…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300, padding: '8px 12px 8px 36px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['all', 'receipt', 'delivery', 'transfer'].map((t) => {
            const cfg = MOVE_TYPES[t];
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: typeFilter === t ? (cfg?.color || 'var(--color-border-hover)') : 'var(--color-border)', background: typeFilter === t ? (cfg?.bg || 'var(--color-surface-2)') : 'transparent', color: typeFilter === t ? (cfg?.color || 'var(--color-text-primary)') : 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: typeFilter === t ? 700 : 400, textTransform: 'capitalize' }}>
                {t === 'all' ? 'All Moves' : cfg?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Move ledger */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
                {['Move ID', 'Type', 'SKU', 'Product', 'Qty', 'From', 'To', 'User', 'Timestamp'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, idx) => {
                const cfg = MOVE_TYPES[m.type];
                const Icon = cfg.icon;
                return (
                  <tr key={m.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{m.id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{m.sku}</td>
                    <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{m.product}</td>
                    <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{m.qty}</td>
                    <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{m.from}</td>
                    <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{m.to}</td>
                    <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{m.user}</td>
                    <td style={{ padding: '12px 16px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{m.date}</td>
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
