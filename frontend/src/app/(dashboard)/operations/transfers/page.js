'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, Plus, Search, Eye, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { operationService } from '@/services/operationService';

const MOCK_TRANSFERS = [
  { id: 'TRF-4821', from: 'Zone A', to: 'Zone C', items: 4, units: 80, status: 'pending', date: '2026-09-23' },
  { id: 'TRF-4820', from: 'Zone B', to: 'Zone D', items: 2, units: 50, status: 'complete', date: '2026-09-25' },
  { id: 'TRF-4819', from: 'Zone C', to: 'Zone A', items: 6, units: 120, status: 'pending', date: '2026-09-26' },
  { id: 'TRF-4818', from: 'Zone D', to: 'Zone B', items: 1, units: 30, status: 'complete', date: '2026-09-24' },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const data = await operationService.getTransfers();
      if (data && data.length > 0) {
        setTransfers(data);
      } else {
        setTransfers(MOCK_TRANSFERS);
      }
    } catch (err) {
      console.error('Failed to load transfers:', err);
      setTransfers(MOCK_TRANSFERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const filtered = transfers.filter((r) =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    (r.from && r.from.toLowerCase().includes(search.toLowerCase())) ||
    (r.to && r.to.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Internal Transfers</h1>
        </div>
        <Link href="/operations/transfers/create" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'var(--color-white)', color: 'var(--color-black)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
          <Plus size={15} /> New Transfer
        </Link>
      </div>
      <div style={{ position: 'relative', maxWidth: 340 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
        <input type="text" placeholder="Search transfers…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
              {['Transfer ID', 'From Zone', 'To Zone', 'Responsible', 'Items', 'Units', 'Date', 'Status', ''].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Loader2 size={18} className="animate-spin" /> Loading transfers...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  No transfers found.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => (
                <tr key={r.id + idx} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.from}</td>
                  <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.to}</td>
                  <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{r.responsible || 'Unassigned'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.items}</td>
                  <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.units}</td>
                  <td style={{ padding: '14px 16px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{r.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {r.status === 'complete' || r.status === 'COMPLETED' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', fontSize: 11, fontWeight: 700 }}>
                        <CheckCircle size={11} /> Complete
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)', fontSize: 11, fontWeight: 700 }}>
                        <Clock size={11} /> Pending
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/operations/transfers/${r.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', textDecoration: 'none' }}>
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
