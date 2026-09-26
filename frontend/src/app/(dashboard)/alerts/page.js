'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  TrendingDown,
  Package,
  Truck,
  RefreshCw,
  Filter,
} from 'lucide-react';
import styles from '../../../styles/alerts.module.css';

const MOCK_ALERTS = [
  {
    id: 1,
    type: 'critical',
    category: 'Stock',
    title: 'SKU-00192 Below Safety Stock',
    description: 'Wireless Earbuds Pro has only 8 units remaining. Reorder threshold is 50.',
    time: '2 minutes ago',
    icon: TrendingDown,
    sku: 'SKU-00192',
  },
  {
    id: 2,
    type: 'warning',
    category: 'Operations',
    title: 'Pending Transfer Overdue',
    description: 'Transfer TRF-4821 from Zone A to Zone C has been pending for 48 hours.',
    time: '1 hour ago',
    icon: Truck,
    sku: 'TRF-4821',
  },
  {
    id: 3,
    type: 'critical',
    category: 'Stock',
    title: 'SKU-00345 Out of Stock',
    description: 'USB-C Hub 7-Port is completely out of stock. Last reorder was 30 days ago.',
    time: '3 hours ago',
    icon: Package,
    sku: 'SKU-00345',
  },
  {
    id: 4,
    type: 'info',
    category: 'System',
    title: 'Inventory Reconciliation Complete',
    description: 'Nightly cycle count for Zone B completed. No discrepancies found.',
    time: '5 hours ago',
    icon: CheckCircle,
    sku: null,
  },
  {
    id: 5,
    type: 'warning',
    category: 'Stock',
    title: 'SKU-00781 Approaching Reorder Point',
    description: 'Mechanical Keyboard TKL has 23 units remaining. Reorder point is 30.',
    time: '6 hours ago',
    icon: TrendingDown,
    sku: 'SKU-00781',
  },
  {
    id: 6,
    type: 'info',
    category: 'Operations',
    title: 'Receipt RCP-9021 Validated',
    description: '240 units of Monitor Stand Adjustable received and logged to Zone D.',
    time: '8 hours ago',
    icon: CheckCircle,
    sku: 'RCP-9021',
  },
];

const TYPE_CONFIG = {
  critical: { label: 'Critical', color: 'var(--color-error)' },
  warning: { label: 'Warning', color: 'var(--color-warning)' },
  info: { label: 'Info', color: 'var(--color-success)' },
};

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState(new Set());

  const visible = MOCK_ALERTS.filter(
    (a) => !dismissed.has(a.id) && (filter === 'all' || a.type === filter)
  );

  const counts = {
    all: MOCK_ALERTS.filter((a) => !dismissed.has(a.id)).length,
    critical: MOCK_ALERTS.filter((a) => !dismissed.has(a.id) && a.type === 'critical').length,
    warning: MOCK_ALERTS.filter((a) => !dismissed.has(a.id) && a.type === 'warning').length,
    info: MOCK_ALERTS.filter((a) => !dismissed.has(a.id) && a.type === 'info').length,
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <Bell size={20} />
          </div>
          <div>
            <h1 className={styles.title}>Alerts & Notifications</h1>
            <p className={styles.subtitle}>
              Real-time stock, operational, and system alerts.
            </p>
          </div>
        </div>
        <button className={styles.refreshBtn} title="Refresh">
          <RefreshCw size={15} />
          Refresh
        </button>
      </section>

      {/* Summary Chips */}
      <section className={styles.summaryRow}>
        {[
          { key: 'all', label: 'All Alerts', count: counts.all, color: 'var(--color-text-primary)' },
          { key: 'critical', label: 'Critical', count: counts.critical, color: 'var(--color-error)' },
          { key: 'warning', label: 'Warnings', count: counts.warning, color: 'var(--color-warning)' },
          { key: 'info', label: 'Info', count: counts.info, color: 'var(--color-success)' },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            className={`${styles.filterChip} ${filter === key ? styles.filterActive : ''}`}
            onClick={() => setFilter(key)}
            style={filter === key ? { borderColor: color, color } : {}}
          >
            <span style={{ color, fontWeight: 700, fontSize: '1rem' }}>{count}</span>
            <span>{label}</span>
          </button>
        ))}
      </section>

      {/* Alerts List */}
      <section className={styles.alertList}>
        {visible.length === 0 ? (
          <div className={styles.emptyState}>
            <CheckCircle size={40} style={{ color: 'var(--color-success)' }} />
            <p>No active alerts in this category.</p>
          </div>
        ) : (
          visible.map((alert) => {
            const Icon = alert.icon;
            const cfg = TYPE_CONFIG[alert.type];
            return (
              <div
                key={alert.id}
                className={styles.alertCard}
                style={{ borderLeftColor: cfg.color }}
              >
                <div className={styles.alertIconBox} style={{ background: `${cfg.color}18` }}>
                  <Icon size={18} style={{ color: cfg.color }} />
                </div>
                <div className={styles.alertBody}>
                  <div className={styles.alertMeta}>
                    <span className={styles.alertBadge} style={{ background: `${cfg.color}20`, color: cfg.color }}>
                      {alert.type.toUpperCase()}
                    </span>
                    <span className={styles.alertCategory}>{alert.category}</span>
                    {alert.sku && (
                      <span className={styles.alertSku}>{alert.sku}</span>
                    )}
                  </div>
                  <h3 className={styles.alertTitle}>{alert.title}</h3>
                  <p className={styles.alertDesc}>{alert.description}</p>
                  <div className={styles.alertTime}>
                    <Clock size={12} />
                    <span>{alert.time}</span>
                  </div>
                </div>
                <button
                  className={styles.dismissBtn}
                  onClick={() => setDismissed((prev) => new Set([...prev, alert.id]))}
                  title="Dismiss alert"
                >
                  <XCircle size={16} />
                </button>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
