'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2 } from 'lucide-react';
import { operationService } from '@/services/operationService';

const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function CreateDeliveryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    sourceLocation: '',
    scheduledDate: '',
    notes: '',
  });

  const [items, setItems] = useState([{ product: '', sku: '', demanded: 1 }]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { product: '', sku: '', demanded: 1 }]);
  
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer) return alert('Customer is required');
    if (items.some(i => !i.product)) return alert('All items must have a product name');

    try {
      setLoading(true);
      await operationService.createDelivery({
        ...formData,
        items: items
      });
      router.push('/operations/deliveries');
    } catch (err) {
      console.error(err);
      alert('Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <Link href="/operations/deliveries" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Deliveries</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>New Delivery</h1>
      </div>
      <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Customer *</label><input type="text" name="customer" value={formData.customer} onChange={handleChange} placeholder="Customer name" style={inputStyle} required /></div>
          <div><label style={labelStyle}>Source Location</label><input type="text" name="sourceLocation" value={formData.sourceLocation} onChange={handleChange} placeholder="Warehouse A" style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Scheduled Date</label><input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={labelStyle}>Priority</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Normal</option><option>High</option><option>Urgent</option></select></div>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Items to Deliver *</label>
            <button type="button" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--color-text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}><Plus size={14}/> Add Item</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--color-surface-1)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ flex: 2 }}><input type="text" placeholder="Product Name" value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)} style={inputStyle} required /></div>
                <div style={{ flex: 1 }}><input type="text" placeholder="SKU" value={item.sku} onChange={e => handleItemChange(idx, 'sku', e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><input type="number" min="1" placeholder="Qty" value={item.demanded} onChange={e => handleItemChange(idx, 'demanded', parseInt(e.target.value) || 1)} style={inputStyle} required /></div>
                <button type="button" onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '5px' }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        
        <div><label style={labelStyle}>Notes</label><textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Optional notes…" style={{ ...inputStyle, height: 70, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/operations/deliveries" style={{ padding: '9px 20px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Cancel</Link>
          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: loading ? 0.7 : 1 }}>
            <Save size={14} /> {loading ? 'Saving...' : 'Create Delivery'}
          </button>
        </div>
      </form>
    </div>
  );
}
