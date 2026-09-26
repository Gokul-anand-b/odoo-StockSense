'use client';

import { useState, useEffect, useCallback } from 'react';
import { History, Search, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Filter, Loader2, RefreshCw, Inbox } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const MOVE_TYPES = {
  receipt: { label: 'Receipt', icon: ArrowDownLeft, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
  delivery: { label: 'Delivery', icon: ArrowUpRight, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  transfer: { label: 'Transfer', icon: ArrowLeftRight, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
};

const STATUS_COLORS = {
  PENDING: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  DRAFT: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  SCHEDULED: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  IN_PROGRESS: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  COMPLETED: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function MoveHistoryPage() {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMoves = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stock-ledger/moves/`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setMoves(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch move history:', err);
      setError('Failed to load move history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoves();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMoves, 30000);
    return () => clearInterval(interval);
  }, [fetchMoves]);

  // Client-side filtering on top of the live data
  const filtered = moves.filter(
    (m) =>
      (typeFilter === 'all' || m.type === typeFilter) &&
      (search === '' ||
        m.id.toLowerCase().includes(search.toLowerCase()) ||
        m.product.toLowerCase().includes(search.toLowerCase()) ||
        m.sku.toLowerCase().includes(search.toLowerCase()) ||
        m.user.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      {/* Header */}
      <section style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6) var(--space-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)' }}>
              <History size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: 'var(--tracking-tight)' }}>Move History</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Full audit ledger of all stock movements across the warehouse.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {lastUpdated && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => { setLoading(true); fetchMoves(); }}
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Refresh moves"
            >
              <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
            </button>
            <span style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}>
              {moves.length} total moves
            </span>
          </div>
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#ef4444',
          fontSize: 'var(--text-sm)',
        }}>
          ⚠️ {error}
        </div>
      )}

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
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: 'var(--space-4)' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-text-tertiary)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Loading move history from database…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: 'var(--space-4)' }}>
            <Inbox size={36} style={{ color: 'var(--color-text-tertiary)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
              {moves.length === 0 ? 'No stock movements recorded yet.' : 'No moves match your search criteria.'}
            </span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
                  {['Move ID', 'Type', 'SKU', 'Product', 'Qty', 'From', 'To', 'Status', 'User', 'Timestamp'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, idx) => {
                  const cfg = MOVE_TYPES[m.type] || MOVE_TYPES.transfer;
                  const Icon = cfg.icon;
                  const statusCfg = STATUS_COLORS[m.status] || STATUS_COLORS.PENDING;
                  return (
                    <tr key={`${m.id}-${idx}`} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
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
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: statusCfg.bg,
                          color: statusCfg.color,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}>
                          {m.status?.replace('_', ' ') || 'Unknown'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{m.user}</td>
                      <td style={{ padding: '12px 16px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{m.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
