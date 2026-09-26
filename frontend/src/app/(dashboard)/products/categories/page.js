'use client';

import Link from 'next/link';
import { ArrowLeft, Tag, Plus } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Audio', skus: 4, value: '$12,400' },
  { id: 2, name: 'Peripherals', skus: 8, value: '$31,200' },
  { id: 3, name: 'Connectivity', skus: 6, value: '$8,900' },
  { id: 4, name: 'Display', skus: 3, value: '$47,800' },
  { id: 5, name: 'Furniture', skus: 5, value: '$22,100' },
  { id: 6, name: 'Video', skus: 4, value: '$18,600' },
];

export default function CategoriesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/products" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Products</Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Categories</h1>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <Plus size={14} /> New Category
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              <Tag size={16} />
            </div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{cat.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{cat.skus} SKUs · Total value {cat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
