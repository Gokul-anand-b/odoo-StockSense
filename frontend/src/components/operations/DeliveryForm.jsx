'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Box, 
  Building2, 
  MapPin, 
  Calendar,
  Layers,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { operationService } from '@/services/operationService';
import styles from '@/styles/operations.module.css';

const SAMPLE_PRODUCTS = [
  { name: 'Precision Steel Rods (10mm)', sku: 'STL-ROD-01', available: 120, uom: 'pcs' },
  { name: 'Ergonomic Mesh Office Chair', sku: 'CHR-ERG-99', available: 24, uom: 'units' },
  { name: 'Heavy Duty Aluminum Extrusions', sku: 'ALU-EXT-40', available: 85, uom: 'kg' },
  { name: 'Hydraulic Actuator Pump', sku: 'ACT-HYD-500', available: 18, uom: 'units' },
  { name: 'High Voltage Copper Busbars', sku: 'BUS-CU-400A', available: 95, uom: 'pcs' },
  { name: 'Carbon Fiber Reinforced Panels', sku: 'CF-PNL-2X4', available: 32, uom: 'sheets' },
];

const SAMPLE_CUSTOMERS = [
  'Tesla Supercharger Dept',
  'Stark Industries Logistics',
  'Apex Global Robotics',
  'Wayne Enterprises Tech Lab',
  'Siemens Industrial Automation',
];

export default function DeliveryForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [customer, setCustomer] = useState(initialData?.customer || '');
  const [sourceLocation, setSourceLocation] = useState(initialData?.sourceLocation || 'Main Warehouse - Rack A-01');
  const [scheduledDate, setScheduledDate] = useState(
    initialData?.scheduledDate?.split('T')[0] || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  const [items, setItems] = useState(
    initialData?.items || [
      { product: SAMPLE_PRODUCTS[0].name, sku: SAMPLE_PRODUCTS[0].sku, demanded: 10, picked: 0, packed: 0, available: SAMPLE_PRODUCTS[0].available, uom: SAMPLE_PRODUCTS[0].uom },
      { product: SAMPLE_PRODUCTS[1].name, sku: SAMPLE_PRODUCTS[1].sku, demanded: 4, picked: 0, packed: 0, available: SAMPLE_PRODUCTS[1].available, uom: SAMPLE_PRODUCTS[1].uom },
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(null);

  // Add Item Line
  const handleAddItem = () => {
    const defaultProd = SAMPLE_PRODUCTS[items.length % SAMPLE_PRODUCTS.length];
    setItems([
      ...items,
      { product: defaultProd.name, sku: defaultProd.sku, demanded: 1, picked: 0, packed: 0, available: defaultProd.available, uom: defaultProd.uom },
    ]);
  };

  // Remove Item Line
  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Select Product
  const handleProductChange = (index, prodName) => {
    const found = SAMPLE_PRODUCTS.find((p) => p.name === prodName);
    if (!found) return;
    const next = [...items];
    next[index] = {
      ...next[index],
      product: found.name,
      sku: found.sku,
      available: found.available,
      uom: found.uom,
    };
    setItems(next);
  };

  // Change Demanded Qty
  const handleQuantityChange = (index, value) => {
    const next = [...items];
    next[index].demanded = Math.max(1, parseInt(value, 10) || 1);
    setItems(next);
  };

  // Quick Pick All Items
  const handlePickAll = () => {
    setItems(items.map((i) => ({ ...i, picked: i.demanded })));
  };

  // Quick Pack All Items
  const handlePackAll = () => {
    setItems(items.map((i) => ({ ...i, picked: i.demanded, packed: i.demanded })));
  };

  // Check if any product has insufficient stock
  const hasInsufficientStock = items.some((i) => i.demanded > i.available);
  const totalDemanded = items.reduce((acc, curr) => acc + curr.demanded, 0);
  const totalPicked = items.reduce((acc, curr) => acc + curr.picked, 0);
  const totalPacked = items.reduce((acc, curr) => acc + curr.packed, 0);

  const pickProgress = Math.round((totalPicked / totalDemanded) * 100) || 0;
  const packProgress = Math.round((totalPacked / totalDemanded) * 100) || 0;

  // Handle Save / Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer) {
      alert('Please select or specify a customer name.');
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await operationService.createDelivery({
        customer,
        sourceLocation,
        scheduledDate,
        items,
        notes,
      });
      router.push(`/operations/deliveries/${created.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Validation (Stock Deduction & Ledger Write)
  const handleConfirmValidation = async () => {
    setIsSubmitting(true);
    try {
      // Simulate real-time stock deduction
      await new Promise((r) => setTimeout(r, 900));
      const res = await operationService.validateDelivery(initialData?.id || 'DEL-2025-001');
      setValidationSuccess(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Visual Workflow Steps */}
      <div className={styles.stepper}>
        <div className={`${styles.stepItem} ${styles.stepCompleted}`}>
          <div className={styles.stepNumber}><CheckCircle2 size={18} /></div>
          <div>
            <div className={styles.stepLabel}>1. Order Created</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Customer & Items set</div>
          </div>
        </div>
        <div className={`${styles.stepDivider} ${pickProgress > 0 ? styles.stepDividerActive : ''}`} />
        
        <div className={`${styles.stepItem} ${pickProgress === 100 ? styles.stepCompleted : styles.stepActive}`}>
          <div className={styles.stepNumber}>2</div>
          <div>
            <div className={styles.stepLabel}>2. Pick Items ({pickProgress}%)</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Retrieve from racks</div>
          </div>
        </div>
        <div className={`${styles.stepDivider} ${packProgress > 0 ? styles.stepDividerActive : ''}`} />

        <div className={`${styles.stepItem} ${packProgress === 100 ? styles.stepCompleted : styles.stepActive}`}>
          <div className={styles.stepNumber}>3</div>
          <div>
            <div className={styles.stepLabel}>3. Pack & Seal ({packProgress}%)</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Box & weigh parcel</div>
          </div>
        </div>
        <div className={`${styles.stepDivider} ${initialData?.status === 'done' ? styles.stepDividerActive : ''}`} />

        <div className={`${styles.stepItem} ${initialData?.status === 'done' ? styles.stepCompleted : ''}`}>
          <div className={styles.stepNumber}>4</div>
          <div>
            <div className={styles.stepLabel}>4. Validate Delivery</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Stock decreases & ledger log</div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Form Details & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--text-muted)" />
                <span>Customer & Destination Details</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reference: {initialData?.id || 'NEW-DRAFT'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Customer Name *
                </label>
                <input 
                  type="text"
                  list="customers-list"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="e.g. Tesla Supercharger Dept"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                <datalist id="customers-list">
                  {SAMPLE_CUSTOMERS.map((c, idx) => (
                    <option key={idx} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Source Warehouse / Location *
                </label>
                <select
                  value={sourceLocation}
                  onChange={(e) => setSourceLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                >
                  <option value="Main Warehouse - Rack A-01">Main Warehouse - Rack A-01 (General)</option>
                  <option value="Main Warehouse - Rack B-04">Main Warehouse - Rack B-04 (Hardware)</option>
                  <option value="Central Depot - Bay 4">Central Depot - Bay 4 (Heavy Metals)</option>
                  <option value="Production Floor - Staging Area">Production Floor - Staging Area</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Scheduled Delivery Date
                </label>
                <input 
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Internal Operations Notes
                </label>
                <input 
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Fragile glass, load via Forklift 02"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Items Table Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--text-muted)" />
                <span>Order Line Items ({items.length})</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePickAll}
                  className={styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  ⚡ Fast Pick All
                </button>
                <button
                  type="button"
                  onClick={handlePackAll}
                  className={styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  📦 Fast Pack All
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className={styles.btnPrimary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
            </div>

            {hasInsufficientStock && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '13px',
              }}>
                <ShieldAlert size={18} />
                <span><strong>Insufficient Stock Warning:</strong> One or more demanded quantities exceed physical stock currently available on shelf!</span>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                    <th style={{ padding: '12px 14px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Product & SKU</th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>On Hand</th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Demanded</th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Picked</th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Packed</th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const isDeficit = item.demanded > item.available;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 12px' }}>
                          <select
                            value={item.product}
                            onChange={(e) => handleProductChange(idx, e.target.value)}
                            style={{
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              padding: '8px 10px',
                              color: '#ffffff',
                              fontSize: '13px',
                              width: '100%',
                              outline: 'none',
                            }}
                          >
                            {SAMPLE_PRODUCTS.map((p, pIdx) => (
                              <option key={pIdx} value={p.name}>
                                {p.name} ({p.sku})
                              </option>
                            ))}
                          </select>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
                            SKU: {item.sku}
                          </div>
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            backgroundColor: isDeficit ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: isDeficit ? '#f87171' : '#34d399',
                          }}>
                            {item.available} {item.uom}
                          </span>
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <input 
                            type="number"
                            min="1"
                            value={item.demanded}
                            onChange={(e) => handleQuantityChange(idx, e.target.value)}
                            style={{
                              width: '75px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              background: 'var(--bg-primary)',
                              border: isDeficit ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              fontWeight: '700',
                              textAlign: 'center',
                            }}
                          />
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input 
                              type="number"
                              min="0"
                              max={item.demanded}
                              value={item.picked}
                              onChange={(e) => {
                                const next = [...items];
                                next[idx].picked = Math.min(item.demanded, parseInt(e.target.value, 10) || 0);
                                setItems(next);
                              }}
                              style={{
                                width: '65px',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-subtle)',
                                color: item.picked === item.demanded ? '#34d399' : '#ffffff',
                                fontWeight: '700',
                                textAlign: 'center',
                              }}
                            />
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {item.demanded}</span>
                          </div>
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input 
                              type="number"
                              min="0"
                              max={item.picked}
                              value={item.packed}
                              onChange={(e) => {
                                const next = [...items];
                                next[idx].packed = Math.min(item.picked, parseInt(e.target.value, 10) || 0);
                                setItems(next);
                              }}
                              style={{
                                width: '65px',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-subtle)',
                                color: item.packed === item.demanded ? '#34d399' : '#ffffff',
                                fontWeight: '700',
                                textAlign: 'center',
                              }}
                            />
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {item.demanded}</span>
                          </div>
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: '4px' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Execution & Summary Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Progress & Validation Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="var(--text-muted)" />
              <span>Fulfillment Status</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Picking Progress</span>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>{pickProgress}% ({totalPicked}/{totalDemanded})</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${pickProgress}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Packing Progress</span>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>{packProgress}% ({totalPacked}/{totalDemanded})</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${packProgress}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Outgoing Units:</span>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>{totalDemanded}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Stock Deduction Impact:</span>
                <span style={{ fontWeight: '700', color: '#f87171' }}>-{totalDemanded} units</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setShowValidationModal(true)}
                disabled={hasInsufficientStock || isSubmitting}
                className={styles.btnPrimary}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px 18px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  boxShadow: '0 0 25px rgba(255, 255, 255, 0.35)',
                }}
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>Validate & Deduct Stock</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.btnSecondary}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Save as Draft
              </button>
            </div>
          </div>

          {/* Operational Ledger Note */}
          <div style={{
            padding: '18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
          }}>
            <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Immutable Ledger Guarantee</div>
            Clicking <strong>Validate</strong> immediately executes an atomic reduction in inventory across specified racks and records a permanent, append-only transaction in the company Stock Ledger.
          </div>
        </div>
      </form>

      {/* Validation Confirmation & Ledger Preview Modal */}
      {showValidationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {!validationSuccess ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Truck size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>Confirm Delivery Validation</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Executing this action will deduct stock from the warehouse.</p>
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Stock Movement Ledger Impact:
                  </div>
                  {items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#ffffff' }}>{it.product}</span>
                      <span style={{ color: '#f87171', fontWeight: '700', fontFamily: 'monospace' }}>
                        -{it.demanded} {it.uom}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowValidationModal(false)}
                    className={styles.btnSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmValidation}
                    disabled={isSubmitting}
                    className={styles.btnPrimary}
                  >
                    {isSubmitting ? 'Deducting Stock...' : 'Confirm & Write to Ledger'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 35px rgba(16, 185, 129, 0.5)',
                  animation: 'bounceCheck 0.4s ease forwards',
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>Delivery Successfully Validated!</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Stock has been automatically deducted and logged to the Ledger with Reference <strong>{initialData?.id || 'DEL-2025-001'}</strong>.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => router.push('/move-history')}
                    className={styles.btnSecondary}
                  >
                    View Stock Ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/operations/deliveries')}
                    className={styles.btnPrimary}
                  >
                    Back to Deliveries
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
