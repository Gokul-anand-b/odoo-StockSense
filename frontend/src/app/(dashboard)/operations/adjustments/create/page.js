'use client';

import Link from 'next/link';
import { Save } from 'lucide-react';

const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function CreateAdjustmentPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <Link href="/operations/adjustments" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Adjustments</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>New Adjustment</h1>
      </div>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Product SKU *</label><input type="text" placeholder="SKU-XXXXX" style={inputStyle} /></div>
          <div><label style={labelStyle}>Adjustment Type</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Cycle Count</option><option>Damage Write-off</option><option>Found Stock</option><option>Theft / Loss</option></select></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Expected Qty</label><input type="number" placeholder="0" style={inputStyle} /></div>
          <div><label style={labelStyle}>Actual Qty</label><input type="number" placeholder="0" style={inputStyle} /></div>
          <div><label style={labelStyle}>Zone</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Zone A</option><option>Zone B</option><option>Zone C</option><option>Zone D</option></select></div>
        </div>
        <div><label style={labelStyle}>Reason / Notes</label><textarea placeholder="Describe the reason for adjustment…" style={{ ...inputStyle, height: 80, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/operations/adjustments" style={{ padding: '9px 20px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Cancel</Link>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Save size={14} /> Submit Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
