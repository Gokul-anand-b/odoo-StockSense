'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import styles from '../../../styles/dashboard.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function DashboardPage() {
  const { user, isManager, isStaff } = useAuth({ requireAuth: true });

  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchKPIs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/kpis/`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setKpis(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch KPIs:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKPIs();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchKPIs, 30000);
    return () => clearInterval(interval);
  }, [fetchKPIs]);

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {lastUpdated && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => { setLoading(true); fetchKPIs(); }}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Refresh KPIs"
          >
            <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
          </button>
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
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#ef4444',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {/* Operational Stats Grid */}
      <section className={styles.statsGrid}>
        {/* KPI 1: Active Inventory SKUs */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Active Inventory SKUs</span>
            <Boxes size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              kpis?.total_skus?.toLocaleString() ?? '0'
            )}
          </div>
          <div className={styles.statFooter}>
            <span>
              {loading
                ? 'Loading...'
                : `${kpis?.total_categories ?? 0} categories across ${kpis?.warehouse_zones ?? 0} warehouse zones`}
            </span>
          </div>
        </div>

        {/* KPI 2: Pending Operations */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Pending Operations</span>
            <ArrowLeftRight size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              kpis?.pending_operations ?? 0
            )}
          </div>
          <div className={styles.statFooter}>
            <span>
              {loading ? 'Loading...' : kpis?.pending_breakdown ?? 'No active operations'}
            </span>
          </div>
        </div>

        {/* KPI 3: Safety Stock Alerts */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Safety Stock Alerts</span>
            <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className={styles.statValue} style={{ color: (kpis?.safety_stock_alerts > 0) ? 'var(--color-warning)' : 'var(--color-success)' }}>
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              kpis?.safety_stock_alerts ?? 0
            )}
          </div>
          <div className={styles.statFooter}>
            <span>
              {loading
                ? 'Loading...'
                : kpis?.safety_stock_alerts > 0
                  ? `${kpis.safety_stock_alerts} SKUs below minimum reorder threshold`
                  : 'All SKUs above safety stock levels'}
            </span>
          </div>
        </div>

        {/* KPI 4: Ledger Integrity */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Ledger Integrity</span>
            <Activity size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className={styles.statValue} style={{ color: (kpis?.ledger_integrity === 100) ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              `${kpis?.ledger_integrity ?? 100}%`
            )}
          </div>
          <div className={styles.statFooter}>
            <span>
              {loading
                ? 'Loading...'
                : kpis?.negative_stock_count === 0
                  ? 'Zero reconciliation discrepancy detected'
                  : `${kpis.negative_stock_count} products with negative stock detected`}
            </span>
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
