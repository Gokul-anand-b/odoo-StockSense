'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Boxes, Plus, Search, Filter, Tag, Eye } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 'SKU-00192', name: 'Wireless Earbuds Pro', category: 'Audio', stock: 8, reorderPt: 50, price: 89.99, status: 'critical' },
  { id: 'SKU-00781', name: 'Mechanical Keyboard TKL', category: 'Peripherals', stock: 23, reorderPt: 30, price: 129.99, status: 'warning' },
  { id: 'SKU-00445', name: 'USB-C Hub 7-Port', category: 'Connectivity', stock: 0, reorderPt: 25, price: 49.99, status: 'critical' },
  { id: 'SKU-00210', name: 'Monitor Stand Adjustable', category: 'Furniture', stock: 142, reorderPt: 20, price: 74.99, status: 'healthy' },
  { id: 'SKU-00388', name: 'Webcam 4K Ultra', category: 'Video', stock: 67, reorderPt: 40, price: 199.99, status: 'healthy' },
  { id: 'SKU-00512', name: 'Laptop Docking Station', category: 'Connectivity', stock: 31, reorderPt: 30, price: 249.99, status: 'warning' },
  { id: 'SKU-00901', name: 'LED Monitor 27"', category: 'Display', stock: 55, reorderPt: 15, price: 399.99, status: 'healthy' },
  { id: 'SKU-00302', name: 'Gaming Mouse RGB', category: 'Peripherals', stock: 110, reorderPt: 30, price: 59.99, status: 'healthy' },
];

const STATUS_CONFIG = {
  critical: { label: 'Critical', color: 'var(--color-error)', bg: 'rgba(239,68,68,0.1)' },
  warning: { label: 'Warning', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
  healthy: { label: 'Healthy', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = MOCK_PRODUCTS.filter(
    (p) =>
      (filter === 'all' || p.status === filter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      {/* Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6) var(--space-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)' }}>
            <Boxes size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: 'var(--tracking-tight)' }}>Product Catalog</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Manage SKUs, stock levels, and reorder thresholds.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/products/categories" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
            <Tag size={14} /> Categories
          </Link>
          <Link href="/products/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--color-white)', color: 'var(--color-black)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </section>

      {/* Filters Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
          <input type="text" placeholder="Search products, SKU, category…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: 320, padding: '8px 12px 8px 36px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['all', 'critical', 'warning', 'healthy'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: filter === f ? (STATUS_CONFIG[f]?.color || 'var(--color-border-hover)') : 'var(--color-border)', background: filter === f ? (STATUS_CONFIG[f]?.bg || 'var(--color-surface-2)') : 'transparent', color: filter === f ? (STATUS_CONFIG[f]?.color || 'var(--color-text-primary)') : 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: filter === f ? 700 : 400, transition: 'all 0.15s', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
                {['SKU', 'Product Name', 'Category', 'In Stock', 'Reorder Pt.', 'Unit Price', 'Status', ''].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const cfg = STATUS_CONFIG[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{p.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', fontWeight: 700, color: p.stock === 0 ? 'var(--color-error)' : p.stock <= p.reorderPt ? 'var(--color-warning)' : 'var(--color-text-primary)' }}>{p.stock}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{p.reorderPt}</td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>${p.price}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}>{cfg.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link href={`/products/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', textDecoration: 'none' }}>
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
