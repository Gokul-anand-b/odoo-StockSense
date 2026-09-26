'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Loader2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { operationService } from '@/services/operationService';
import { productService } from '@/services/productService';

const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function CreateAdjustmentPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('Cycle Count');
  const [expectedQty, setExpectedQty] = useState(0);
  const [actualQty, setActualQty] = useState(0);
  const [zone, setZone] = useState('Zone A');
  const [reason, setReason] = useState('');

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const list = await productService.getProducts();
        if (list && list.length > 0) {
          setProducts(list);
          const firstP = list[0];
          setSelectedProduct(firstP);
          setExpectedQty(firstP.stock ?? 0);
          setActualQty(firstP.stock ?? 0);
        }
      } catch (err) {
        console.error('Failed to load products for adjustment:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    const found = products.find((p) => p.db_id === prodId || p.id === prodId);
    if (found) {
      setSelectedProduct(found);
      const stockVal = found.stock ?? found.stock_on_hand ?? 0;
      setExpectedQty(stockVal);
      setActualQty(stockVal);
    }
  };

  const delta = Number(actualQty) - Number(expectedQty);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedProduct) {
      setError('Please select a product to adjust.');
      return;
    }

    try {
      setIsSubmitting(true);
      await operationService.createAdjustment({
        productId: selectedProduct.db_id || selectedProduct.id,
        sku: selectedProduct.sku || selectedProduct.id,
        type: adjustmentType,
        actual: Number(actualQty),
        zone: zone,
        notes: reason,
      });

      router.push('/operations/adjustments');
    } catch (err) {
      console.error('Error creating stock adjustment:', err);
      setError(err.message || 'Failed to submit stock adjustment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <Link href="/operations/adjustments" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Adjustments</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>New Adjustment</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Product Selection */}
        <div>
          <label style={labelStyle}>Select Product *</label>
          {loadingProducts ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
              <Loader2 size={14} className="animate-spin" /> Loading catalog products...
            </div>
          ) : (
            <select
              value={selectedProduct ? (selectedProduct.db_id || selectedProduct.id) : ''}
              onChange={handleProductChange}
              style={{ ...inputStyle, cursor: 'pointer' }}
              required
            >
              {products.map((p) => (
                <option key={p.db_id || p.id} value={p.db_id || p.id}>
                  {p.name} ({p.sku || p.id}) — Stock: {p.stock ?? 0}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle}>Product SKU</label>
            <input
              type="text"
              value={selectedProduct ? (selectedProduct.sku || selectedProduct.id) : ''}
              readOnly
              style={{ ...inputStyle, opacity: 0.8, background: 'var(--color-surface-1)' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Adjustment Type</label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="Cycle Count">Cycle Count</option>
              <option value="Damage Write-off">Damage Write-off</option>
              <option value="Found Stock">Found Stock</option>
              <option value="Theft / Loss">Theft / Loss</option>
              <option value="Inventory Audit">Inventory Audit</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle}>Recorded System Stock</label>
            <input
              type="number"
              value={expectedQty}
              readOnly
              style={{ ...inputStyle, opacity: 0.8, background: 'var(--color-surface-1)', fontWeight: 600 }}
            />
          </div>
          <div>
            <label style={labelStyle}>Physical Counted Qty *</label>
            <input
              type="number"
              min="0"
              placeholder="Enter physical count"
              value={actualQty}
              onChange={(e) => setActualQty(e.target.value)}
              style={{ ...inputStyle, fontWeight: 700 }}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Warehouse Zone</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>
        </div>

        {/* Live Discrepancy (Delta) Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '12px 16px' }}>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} style={{ color: 'var(--color-primary)' }} /> Calculated Stock Discrepancy (Delta):
          </div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: delta > 0 ? 'var(--color-success)' : (delta < 0 ? 'var(--color-error)' : 'var(--color-text-tertiary)') }}>
            {delta > 0 ? `+${delta} (Surplus)` : (delta < 0 ? `${delta} (Deficit)` : '0 (No Variance)')}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Reason / Notes</label>
          <textarea
            placeholder="Describe the reason for adjustment (e.g. routine physical audit, damaged packaging)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ ...inputStyle, height: 75, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/operations/adjustments" style={{ padding: '9px 20px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSubmitting ? 'Submitting...' : 'Submit Adjustment'}
          </button>
        </div>
      </form>
    </div>
  );
}

