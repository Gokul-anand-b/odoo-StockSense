'use client';

import Link from 'next/link';
import {
  Boxes,
  ArrowLeftRight,
  Box,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Shield,
  Activity,
  ScanLine,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import styles from '../../../styles/dashboard.module.css';

export default function DashboardPage() {
  const { user, isManager, isStaff } = useAuth({ requireAuth: true });

  const roleName = isManager
    ? 'Inventory Manager'
    : isStaff
    ? 'Warehouse Staff'
    : user?.role || 'Staff';

  return (
    <div className={styles.container}>
      {/* Welcome Hero */}
      <section className={styles.welcomeHero}>
        <div className={styles.heroLeft}>
          <div className={styles.roleTag}>
            <Shield size={13} />
            <span>{roleName} Portal</span>
          </div>
          <h1 className={styles.title}>
            Welcome back, {user?.first_name || 'Operator'}
          </h1>
          <p className={styles.subtitle}>
            StockSense inventory monitoring & operational command center.
          </p>
        </div>

        <Link
          href="/profile"
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            fontSize: '0.8125rem',
            fontWeight: '500',
            textDecoration: 'none',
          }}
        >
          View Profile & RBAC Settings →
        </Link>
      </section>

      {/* Operational Stats Grid */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Active Inventory SKUs</span>
            <Boxes size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>1,428</div>
          <div className={styles.statFooter}>
            <span>12 categories across 4 warehouse zones</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Pending Operations</span>
            <ArrowLeftRight size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>24</div>
          <div className={styles.statFooter}>
            <span>14 picks, 6 receipts, 4 transfers</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Safety Stock Alerts</span>
            <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className={styles.statValue} style={{ color: 'var(--color-warning)' }}>
            3
          </div>
          <div className={styles.statFooter}>
            <span>3 SKUs below minimum reorder threshold</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Ledger Integrity</span>
            <Activity size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className={styles.statValue} style={{ color: 'var(--color-success)' }}>
            100%
          </div>
          <div className={styles.statFooter}>
            <span>Zero reconciliation discrepancy detected</span>
          </div>
        </div>
      </section>

      {/* Operational Modules Navigation */}
      <section className={styles.moduleSection}>
        <h2 className={styles.sectionHeading}>System Modules</h2>
        <div className={styles.modulesGrid}>
          <Link href="/operations" className={styles.moduleCard}>
            <div className={styles.moduleIconBox}>
              <ArrowLeftRight size={20} />
            </div>
            <h3 className={styles.moduleTitle}>Warehouse Operations</h3>
            <p className={styles.moduleDesc}>
              Execute goods receipts, customer order picking, internal bay transfers, and batch shipments.
            </p>
          </Link>

          <Link href="/warehouse-3d" className={styles.moduleCard}>
            <div className={styles.moduleIconBox}>
              <Box size={20} />
            </div>
            <h3 className={styles.moduleTitle}>3D Digital Twin</h3>
            <p className={styles.moduleDesc}>
              Interactive 3D isometric simulation of warehouse racks, bays, item locations, and occupancy heatmaps.
            </p>
          </Link>

          <Link href="/products" className={styles.moduleCard}>
            <div className={styles.moduleIconBox}>
              <Boxes size={20} />
            </div>
            <h3 className={styles.moduleTitle}>Product Catalog</h3>
            <p className={styles.moduleDesc}>
              Manage items, SKUs, barcode mappings, reorder rules, and supplier tracking.
            </p>
          </Link>

          <Link href="/forecasting" className={styles.moduleCard}>
            <div className={styles.moduleIconBox}>
              <TrendingUp size={20} />
            </div>
            <h3 className={styles.moduleTitle}>AI Demand Forecasting</h3>
            <p className={styles.moduleDesc}>
              Predict stock depletion, compute safety stock buffers, and generate automated purchase orders.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
