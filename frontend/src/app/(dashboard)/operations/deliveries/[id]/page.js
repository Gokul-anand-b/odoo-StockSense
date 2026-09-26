'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, ArrowLeft, Clock, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { operationService } from '@/services/operationService';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'var(--color-text-secondary)', bg: 'var(--color-surface-2)', icon: Clock },
  pending: { label: 'Ready to Pick', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  ready: { label: 'Ready to Ship', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', icon: Package },
  done: { label: 'Done', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
};

export default function DeliveryDetailPage({ params }) {
  // Unwrap params using `use()` to follow React 19 standards if needed, or simply handle it safely
  const resolvedParams = typeof params.then === 'function' ? use(params) : params;
  const { id } = resolvedParams;
  
  const router = useRouter();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [pickQuantities, setPickQuantities] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await operationService.getDeliveryById(id);
        setDelivery(data);
        const initialPickQuantities = {};
        data.itemList.forEach(item => {
           initialPickQuantities[item.id] = item.picked || 0;
        });
        setPickQuantities(initialPickQuantities);
      } catch (err) {
        setError(err.message || 'Failed to load delivery');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handlePickChange = (itemId, val) => {
    setPickQuantities({
       ...pickQuantities,
       [itemId]: parseInt(val) || 0
    });
  };

  const handleSavePick = async (itemId) => {
    try {
      const updated = await operationService.updatePicking(id, itemId, pickQuantities[itemId]);
      setDelivery(updated);
    } catch (err) {
      alert(err.message || 'Failed to update picking');
    }
  };

  const handleValidate = async () => {
    try {
      await operationService.validateDelivery(id);
      const data = await operationService.getDeliveryById(id);
      setDelivery(data);
      alert('Delivery Validated Successfully!');
    } catch (err) {
      alert(err.message || 'Failed to validate delivery');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: 'var(--color-error)' }}>{error}</div>;
  if (!delivery) return null;

  const cfg = STATUS_CONFIG[delivery.status] || STATUS_CONFIG['draft'];
  const Icon = cfg.icon;

  const allPicked = delivery.itemList.every(i => i.picked >= i.demanded);
  const canValidate = delivery.status === 'ready' || (delivery.status === 'draft' && allPicked);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/operations/deliveries" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Deliveries
        </Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>{delivery.id}</h1>
      </div>
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
            <Truck size={20} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-white)' }}>Delivery {delivery.id}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Customer delivery order detail</div>
          </div>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: 'var(--text-xs)', fontWeight: 700 }}>
            <Icon size={12} /> {cfg.label}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          {[
            ['Customer', delivery.customer], 
            ['Total Items', delivery.items], 
            ['Total Units', delivery.units], 
            ['Priority', delivery.priority?.toUpperCase() || 'NORMAL'], 
            ['Date', delivery.date]
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Items & Picking</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
              {['Product', 'SKU', 'Demanded', 'Picked', 'Available', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {delivery.itemList.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-white)' }}>{item.product}</td>
                <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{item.sku}</td>
                <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-white)', fontWeight: 500 }}>{item.demanded}</td>
                <td style={{ padding: '12px 16px' }}>
                  {delivery.status === 'done' ? (
                     <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{item.picked}</span>
                  ) : (
                     <input 
                       type="number" 
                       min="0" 
                       max={item.demanded}
                       value={pickQuantities[item.id] !== undefined ? pickQuantities[item.id] : item.picked}
                       onChange={(e) => handlePickChange(item.id, e.target.value)}
                       style={{ width: 60, padding: '4px 8px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)' }}
                     />
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 'var(--text-sm)', color: item.available < item.demanded ? 'var(--color-error)' : 'var(--color-success)' }}>{item.available}</td>
                <td style={{ padding: '12px 16px' }}>
                  {delivery.status !== 'done' && (
                     <button 
                       onClick={() => handleSavePick(item.id)}
                       style={{ padding: '4px 10px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)' }}
                     >
                       Save Pick
                     </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {delivery.status !== 'done' && (
           <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
             <button
               onClick={handleValidate}
               disabled={!canValidate}
               style={{ 
                 display: 'flex', alignItems: 'center', gap: 6, 
                 padding: '10px 24px', 
                 background: canValidate ? 'var(--color-success)' : 'var(--color-surface-2)', 
                 color: canValidate ? '#000' : 'var(--color-text-muted)', 
                 border: 'none', borderRadius: 'var(--radius-md)', 
                 fontWeight: 600, fontSize: 'var(--text-sm)', 
                 cursor: canValidate ? 'pointer' : 'not-allowed',
                 opacity: canValidate ? 1 : 0.7 
               }}
             >
               <CheckCircle size={16} /> Validate Delivery
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
