'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Loader2, AlertCircle, PlusCircle, Building2, UserCheck, ArrowLeft } from 'lucide-react';
import { operationService } from '@/services/operationService';

const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function CreateReceiptPage() {
  const router = useRouter();

  // Existing suppliers state
  const [suppliersList, setSuppliersList] = useState([
    'Apex Industrial Supply Corp',
    'Espressif Systems Direct',
    'Stark Industries Logistics',
    'MetalCraft Steel & Alloys'
  ]);
  const [supplierMode, setSupplierMode] = useState('select'); // 'select' | 'new'

  // Selected or New Supplier state
  const [selectedSupplier, setSelectedSupplier] = useState('Apex Industrial Supply Corp');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newSupplierAddress, setNewSupplierAddress] = useState('');

  // Receipt details
  const [poReference, setPoReference] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [destinationLocation, setDestinationLocation] = useState('Zone A');
  const [units, setUnits] = useState('50');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSuppliers() {
      try {
        const list = await operationService.getSuppliers();
        if (list && list.length > 0) {
          setSuppliersList(list);
          setSelectedSupplier(list[0]);
        }
      } catch (err) {
        console.error('Error loading suppliers:', err);
      }
    }
    loadSuppliers();
  }, []);

  const handleSupplierSelectChange = (e) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setSupplierMode('new');
    } else {
      setSelectedSupplier(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    let finalSupplierName = '';
    let supplierDetailsNote = '';

    if (supplierMode === 'new') {
      if (!newSupplierName.trim()) {
        setError('New supplier name is required.');
        return;
      }
      finalSupplierName = newSupplierName.trim();

      const detailsParts = [];
      if (newSupplierEmail.trim()) detailsParts.push(`Email: ${newSupplierEmail.trim()}`);
      if (newSupplierPhone.trim()) detailsParts.push(`Phone: ${newSupplierPhone.trim()}`);
      if (newSupplierAddress.trim()) detailsParts.push(`Address: ${newSupplierAddress.trim()}`);

      if (detailsParts.length > 0) {
        supplierDetailsNote = `[Supplier Info - ${detailsParts.join(' | ')}]`;
      }
    } else {
      if (!selectedSupplier.trim()) {
        setError('Please select a supplier.');
        return;
      }
      finalSupplierName = selectedSupplier.trim();
    }

    const combinedNotes = [notes.trim(), supplierDetailsNote].filter(Boolean).join('\n');

    try {
      setIsSubmitting(true);
      await operationService.createReceipt({
        supplier: finalSupplierName,
        poReference: poReference || `PO-${Math.floor(90000 + Math.random() * 10000)}`,
        scheduledDate: scheduledDate,
        destinationLocation: destinationLocation,
        units: Number(units) || 50,
        notes: combinedNotes,
      });

      router.push('/operations/receipts');
    } catch (err) {
      console.error('Error creating receipt:', err);
      setError(err.message || 'Failed to create goods receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <Link href="/operations/receipts" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Receipts</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>New Receipt</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Supplier Selection Section */}
        <div style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-white)' }}>
              <Building2 size={16} style={{ color: 'var(--color-primary)' }} />
              Supplier Details
            </div>
            {supplierMode === 'new' ? (
              <button
                type="button"
                onClick={() => setSupplierMode('select')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
              >
                <ArrowLeft size={12} /> Choose Existing Supplier
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSupplierMode('new')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
              >
                <PlusCircle size={12} /> Add New Supplier
              </button>
            )}
          </div>

          {supplierMode === 'select' ? (
            <div>
              <label style={labelStyle}>Select Supplier *</label>
              <select
                value={selectedSupplier}
                onChange={handleSupplierSelectChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {suppliersList.map((sup) => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
                <option value="__ADD_NEW__">+ Add New Supplier...</option>
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={labelStyle}>New Supplier Name *</label>
                <input
                  type="text"
                  placeholder="Enter full company or supplier name"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={labelStyle}>Contact Email</label>
                  <input
                    type="email"
                    placeholder="supplier@company.com"
                    value={newSupplierEmail}
                    onChange={(e) => setNewSupplierEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newSupplierPhone}
                    onChange={(e) => setNewSupplierPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Supplier Address / Location</label>
                <input
                  type="text"
                  placeholder="City, Country or Full Address"
                  value={newSupplierAddress}
                  onChange={(e) => setNewSupplierAddress(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}
        </div>

        {/* PO Reference & Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle}>Purchase Order Ref.</label>
            <input
              type="text"
              placeholder="PO-XXXXX"
              value={poReference}
              onChange={(e) => setPoReference(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Expected Arrival</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle}>Destination Zone</label>
            <select
              value={destinationLocation}
              onChange={(e) => setDestinationLocation(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Expected Units</label>
            <input
              type="number"
              min="1"
              placeholder="Total units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            placeholder="Additional notes…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ ...inputStyle, height: 75, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/operations/receipts" style={{ padding: '9px 20px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSubmitting ? 'Creating...' : 'Create Receipt'}
          </button>
        </div>
      </form>
    </div>
  );
}

