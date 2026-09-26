'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { operationService } from '@/services/operationService';
import StatusBadge from '@/components/operations/StatusBadge';
import styles from '@/styles/operations.module.css';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveries();
  }, [statusFilter, searchQuery]);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const data = await operationService.getDeliveries({
        status: statusFilter,
        search: searchQuery,
      });
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // KPI Counter metrics
  const totalCount = deliveries.length;
  const readyCount = deliveries.filter((d) => d.status === 'ready').length;
  const waitingCount = deliveries.filter((d) => d.status === 'waiting').length;
  const doneCount = deliveries.filter((d) => d.status === 'done').length;

  return (
    <div className={styles.container}>
      {/* Page Title & Quick Action */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <Truck size={28} />
            <span>Delivery Orders</span>
            <span style={{ fontSize: '13px', fontWeight: '600', padding: '2px 10px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
              Outgoing Stock
            </span>
          </h1>
          <p className={styles.subtitle}>
            Pick items, pack parcels, validate outbound shipments, and automatically deduct warehouse stock.
          </p>
        </div>

        <Link href="/operations/deliveries/create" className={styles.btnPrimary}>
          <Plus size={16} />
          <span>New Delivery Order</span>
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{totalCount}</div>
            <div className={styles.statLabel}>Total Outgoing Orders</div>
          </div>
          <div className={styles.statIcon}><Layers size={22} /></div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue} style={{ color: '#60a5fa' }}>{readyCount}</div>
            <div className={styles.statLabel}>Ready for Validation</div>
          </div>
          <div className={styles.statIcon} style={{ borderColor: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}>
            <PackageCheck size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue} style={{ color: '#fbbf24' }}>{waitingCount}</div>
            <div className={styles.statLabel}>Waiting Availability</div>
          </div>
          <div className={styles.statIcon} style={{ borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue} style={{ color: '#34d399' }}>{doneCount}</div>
            <div className={styles.statLabel}>Shipped & Ledger Deducted</div>
          </div>
          <div className={styles.statIcon} style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          {['all', 'draft', 'waiting', 'ready', 'done'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`${styles.filterTab} ${statusFilter === st ? styles.filterTabActive : ''}`}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={15} color="var(--text-muted)" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, customer, or SKU..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Delivery Orders Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Reference</th>
              <th className={styles.th}>Customer</th>
              <th className={styles.th}>Source Warehouse</th>
              <th className={styles.th}>Scheduled Date</th>
              <th className={styles.th}>Items Count</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Loading delivery orders...
                </td>
              </tr>
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  No delivery orders found matching filter criteria.
                </td>
              </tr>
            ) : (
              deliveries.map((order) => (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td}>
                    <Link href={`/operations/deliveries/${order.id}`} className={styles.referenceLink}>
                      <span>{order.id}</span>
                      <ArrowUpRight size={14} color="var(--text-muted)" />
                    </Link>
                  </td>

                  <td className={styles.td} style={{ fontWeight: '600', color: '#ffffff' }}>
                    {order.customer}
                  </td>

                  <td className={styles.td}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {order.sourceLocation}
                    </span>
                  </td>

                  <td className={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      <Calendar size={13} />
                      <span>{new Date(order.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  </td>

                  <td className={styles.td}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#ffffff',
                    }}>
                      {order.totalItems} line items
                    </span>
                  </td>

                  <td className={styles.td}>
                    <StatusBadge status={order.status} />
                  </td>

                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <Link 
                      href={`/operations/deliveries/${order.id}`}
                      className={styles.btnSecondary}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <span>Inspect & Pick</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
