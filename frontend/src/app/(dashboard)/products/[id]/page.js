'use client';

import Link from 'next/link';
import { Boxes, ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';

const PRODUCT_DATA = {
  'SKU-00192': { name: 'Wireless Earbuds Pro', category: 'Audio', stock: 8, reorderPt: 50, safetyStock: 50, price: 89.99, status: 'critical', description: 'Premium wireless earbuds with ANC and 30hr battery life.' },
  'SKU-00781': { name: 'Mechanical Keyboard TKL', category: 'Peripherals', stock: 23, reorderPt: 30, safetyStock: 25, price: 129.99, status: 'warning', description: 'Tenkeyless mechanical keyboard with Cherry MX switches.' },
};

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const product = PRODUCT_DATA[id] || { name: `Product ${id}`, category: '—', stock: 0, reorderPt: 0, safetyStock: 0, price: 0, status: 'healthy', description: 'No description available.' };
  const statusColor = product.status === 'critical' ? 'var(--color-error)' : product.status === 'warning' ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/products" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Products
        </Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{id}</span>
      </div>

      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)' }}>{product.name}</h1>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 8, alignItems: 'center' }}>
              <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>{product.category}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{id}</span>
            </div>
          </div>
          <span style={{ padding: '4px 14px', borderRadius: 'var(--radius-full)', background: `${statusColor}18`, color: statusColor, fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'capitalize' }}>
            {product.status}
          </span>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>{product.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
          {[['Current Stock', product.stock, product.stock <= product.reorderPt ? statusColor : 'var(--color-white)'], ['Reorder Point', product.reorderPt, 'var(--color-text-primary)'], ['Safety Stock', product.safetyStock, 'var(--color-text-primary)'], ['Unit Price', `$${product.price}`, 'var(--color-white)']].map(([label, val, color]) => (
            <div key={label} style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
