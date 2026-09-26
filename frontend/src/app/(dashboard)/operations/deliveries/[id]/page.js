'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  FileText, 
  Barcode, 
  Printer, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { operationService } from '@/services/operationService';
import StatusBadge from '@/components/operations/StatusBadge';
import styles from '@/styles/operations.module.css';

export default function DeliveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validatedSuccess, setValidatedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId) => {
    setLoading(true);
    try {
      const data = await operationService.getDeliveryById(orderId);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickStep = async (itemId, newPicked) => {
    try {
      const updated = await operationService.updatePicking(order.id, itemId, newPicked);
      setOrder({ ...updated });
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePackStep = async (itemId, newPacked) => {
    try {
      const updated = await operationService.updatePacking(order.id, itemId, newPacked);
      setOrder({ ...updated });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleValidateNow = async () => {
    setValidating(true);
    try {
      // Simulate real-time stock processing
      await new Promise((r) => setTimeout(r, 800));
      await operationService.validateDelivery(order.id);
      setValidatedSuccess(true);
      const updated = await operationService.getDeliveryById(order.id);
      setOrder(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading delivery order {id}...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Delivery order {id} was not found.
          <div style={{ marginTop: '16px' }}>
            <Link href="/operations/deliveries" className={styles.btnSecondary}>
              Back to Deliveries
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDone = order.status === 'done';
  const totalDemanded = order.items.reduce((acc, i) => acc + i.demanded, 0);
  const totalPicked = order.items.reduce((acc, i) => acc + i.picked, 0);
  const totalPacked = order.items.reduce((acc, i) => acc + i.packed, 0);

  const pickPct = Math.round((totalPicked / totalDemanded) * 100) || 0;
  const packPct = Math.round((totalPacked / totalDemanded) * 100) || 0;

  return (
    <div className={styles.container}>
      {/* Top Navigation & Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Link 
            href="/operations/deliveries"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <ArrowLeft size={14} /> Back to Delivery Orders
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className={styles.title} style={{ fontSize: '24px' }}>
              <span>{order.id}</span>
            </h1>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => window.print()}
            className={styles.btnSecondary}
            style={{ fontSize: '12.5px' }}
          >
            <Printer size={15} />
            <span>Print Delivery Slip</span>
          </button>

          {!isDone && (
            <button
              type="button"
              onClick={handleValidateNow}
              disabled={validating}
              className={styles.btnPrimary}
              style={{
                fontSize: '13px',
                padding: '10px 20px',
                backgroundColor: '#ffffff',
                color: '#000000',
                boxShadow: '0 0 25px rgba(255, 255, 255, 0.4)',
              }}
            >
              <Sparkles size={16} />
              <span>{validating ? 'Validating & Deducting...' : 'Validate & Deduct Stock'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {validatedSuccess && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} />
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px' }}>Stock Deducted & Ledger Updated</div>
              <div style={{ fontSize: '12.5px', color: '#a7f3d0' }}>
                Inventory counts have been updated in real-time. Movement logged under Reference {order.id}.
              </div>
            </div>
          </div>
          <Link href="/move-history" className={styles.btnPrimary} style={{ fontSize: '12px', padding: '6px 14px' }}>
            Inspect Ledger
          </Link>
        </div>
      )}

      {/* Interactive Fulfillment Stepper */}
      <div className={styles.stepper}>
        <div className={`${styles.stepItem} ${styles.stepCompleted}`}>
          <div className={styles.stepNumber}><Check size={18} /></div>
          <div>
            <div className={styles.stepLabel}>Order Drafted</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{order.customer}</div>
          </div>
        </div>
        <div className={`${styles.stepDivider} ${pickPct > 0 ? styles.stepDividerActive : ''}`} />

        <div className={`${styles.stepItem} ${pickPct === 100 ? styles.stepCompleted : styles.stepActive}`}>
          <div className={styles.stepNumber}>{pickPct === 100 ? <Check size={18} /> : '2'}</div>
          <div>
            <div className={styles.stepLabel}>Picking ({pickPct}%)</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{totalPicked} of {totalDemanded} picked</div>
          </div>
        </div>
        <div className={`${styles.stepDivider} ${packPct > 0 ? styles.stepDividerActive : ''}`} />

        <div className={`${styles.stepItem} ${packPct === 100 ? styles.stepCompleted : styles.stepActive}`}>
          <div className={styles.stepNumber}>{packPct === 100 ? <Check size={18} /> : '3'}</div>
          <div>
            <div className={styles.stepLabel}>Packing ({packPct}%)</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{totalPacked} of {totalDemanded} packed</div>
          </div>
        </div>
        <div className={`${styles.stepDivider} ${isDone ? styles.stepDividerActive : ''}`} />

        <div className={`${styles.stepItem} ${isDone ? styles.stepCompleted : ''}`}>
          <div className={styles.stepNumber}>{isDone ? <Check size={18} /> : '4'}</div>
          <div>
            <div className={styles.stepLabel}>Validated & Shipped</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Stock permanently deducted</div>
          </div>
        </div>
      </div>

      {/* Order Info Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Customer</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>{order.customer}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Tracking: {order.trackingNumber}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Source Location</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>{order.sourceLocation}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Main Distribution Warehouse</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Scheduled Date</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
            {new Date(order.scheduledDate).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Created: {new Date(order.date).toLocaleDateString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Stock Deduction</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: isDone ? '#34d399' : '#f87171', marginTop: '4px' }}>
            {isDone ? `Executed (-${totalDemanded})` : `Pending (-${totalDemanded})`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isDone ? 'Recorded in Ledger' : 'Awaiting Validation'}
          </div>
        </div>
      </div>

      {/* Interactive Items Workbench */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--text-muted)" />
            <span>Interactive Picking & Packing Workbench</span>
          </div>

          {!isDone && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  order.items.forEach((it) => handlePickStep(it.id, it.demanded));
                }}
                className={styles.btnSecondary}
                style={{ fontSize: '12px' }}
              >
                Pick All Items
              </button>
              <button
                type="button"
                onClick={() => {
                  order.items.forEach((it) => {
                    handlePickStep(it.id, it.demanded);
                    handlePackStep(it.id, it.demanded);
                  });
                }}
                className={styles.btnSecondary}
                style={{ fontSize: '12px' }}
              >
                Pack All Items
              </button>
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Product</th>
                <th style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>SKU Code</th>
                <th style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Rack Availability</th>
                <th style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Demanded</th>
                <th style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Picked</th>
                <th style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Packed</th>
                <th style={{ padding: '14px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Interactive Control</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const isFullyPicked = item.picked >= item.demanded;
                const isFullyPacked = item.packed >= item.demanded;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#ffffff' }}>
                      {item.product}
                    </td>

                    <td style={{ padding: '16px', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                      {item.sku}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        color: '#34d399',
                        fontSize: '12.5px',
                        fontWeight: '700',
                      }}>
                        {item.available} {item.uom} available
                      </span>
                    </td>

                    <td style={{ padding: '16px', fontWeight: '700', color: '#ffffff', fontSize: '14px' }}>
                      {item.demanded} {item.uom}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{
                        fontWeight: '700',
                        color: isFullyPicked ? '#34d399' : '#f59e0b',
                        fontSize: '14px',
                      }}>
                        {item.picked} / {item.demanded}
                      </span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{
                        fontWeight: '700',
                        color: isFullyPacked ? '#34d399' : '#a1a1aa',
                        fontSize: '14px',
                      }}>
                        {item.packed} / {item.demanded}
                      </span>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {!isDone ? (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handlePickStep(item.id, Math.min(item.demanded, item.picked + 1))}
                            className={styles.btnSecondary}
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            + Pick 1
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePackStep(item.id, Math.min(item.picked, item.packed + 1))}
                            disabled={item.packed >= item.picked}
                            className={styles.btnSecondary}
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            + Pack 1
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '700' }}>
                          ✓ Dispatched
                        </span>
                      )}
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
