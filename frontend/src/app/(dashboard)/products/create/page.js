'use client';

import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function CreateProductPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/products" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Products</Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Add Product</h1>
        </div>
      </div>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Product Name *</label><input type="text" placeholder="e.g. Wireless Earbuds Pro" style={inputStyle} /></div>
          <div><label style={labelStyle}>SKU *</label><input type="text" placeholder="e.g. SKU-00001" style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Category</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Select Category</option><option>Audio</option><option>Peripherals</option><option>Display</option><option>Connectivity</option></select></div>
          <div><label style={labelStyle}>Unit Price</label><input type="number" placeholder="0.00" style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Initial Stock</label><input type="number" placeholder="0" style={inputStyle} /></div>
          <div><label style={labelStyle}>Reorder Point</label><input type="number" placeholder="0" style={inputStyle} /></div>
          <div><label style={labelStyle}>Safety Stock</label><input type="number" placeholder="0" style={inputStyle} /></div>
        </div>
        <div><label style={labelStyle}>Description</label><textarea placeholder="Product description…" style={{ ...inputStyle, height: 90, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/products" style={{ padding: '9px 20px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Cancel</Link>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Save size={14} /> Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
