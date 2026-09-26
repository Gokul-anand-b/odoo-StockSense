'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';
import DeliveryForm from '@/components/operations/DeliveryForm';
import styles from '@/styles/operations.module.css';

export default function CreateDeliveryPage() {
  return (
    <div className={styles.container}>
      {/* Breadcrumb & Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link 
          href="/operations/deliveries"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={14} /> Back to Delivery Orders
        </Link>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <Truck size={26} />
            <span>Create New Delivery Order</span>
          </h1>
          <p className={styles.subtitle}>
            Draft an outgoing shipment, assign items from warehouse racks, and track picking progress.
          </p>
        </div>
      </div>

      {/* Main Delivery Creation Form */}
      <DeliveryForm />
    </div>
  );
}
