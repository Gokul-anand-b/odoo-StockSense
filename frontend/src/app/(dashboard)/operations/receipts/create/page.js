'use client';

import Link from 'next/link';
import { Save } from 'lucide-react';

const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function CreateReceiptPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <Link href="/operations/receipts" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Receipts</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>New Receipt</h1>
      </div>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Supplier *</label><input type="text" placeholder="Supplier name" style={inputStyle} /></div>
          <div><label style={labelStyle}>Purchase Order Ref.</label><input type="text" placeholder="PO-XXXXX" style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Expected Arrival</label><input type="date" style={inputStyle} /></div>
          <div><label style={labelStyle}>Destination Zone</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Zone A</option><option>Zone B</option><option>Zone C</option><option>Zone D</option></select></div>
        </div>
        <div><label style={labelStyle}>Notes</label><textarea placeholder="Additional notes…" style={{ ...inputStyle, height: 80, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/operations/receipts" style={{ padding: '9px 20px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Cancel</Link>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Save size={14} /> Create Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
