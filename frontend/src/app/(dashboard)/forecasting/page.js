'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  Zap,
  BarChart2,
  RefreshCw,
} from 'lucide-react';

const FORECAST_DATA = [
  {
    sku: 'SKU-00192',
    name: 'Wireless Earbuds Pro',
    currentStock: 8,
    safetyStock: 50,
    avgDailyUsage: 4.2,
    daysRemaining: 1,
    forecastedDemand: 310,
    suggestedOrder: 400,
    trend: 'up',
    risk: 'critical',
  },
  {
    sku: 'SKU-00781',
    name: 'Mechanical Keyboard TKL',
    currentStock: 23,
    safetyStock: 30,
    avgDailyUsage: 1.8,
    daysRemaining: 12,
    forecastedDemand: 54,
    suggestedOrder: 100,
    trend: 'up',
    risk: 'warning',
  },
  {
    sku: 'SKU-00445',
    name: 'USB-C Hub 7-Port',
    currentStock: 0,
    safetyStock: 25,
    avgDailyUsage: 2.1,
    daysRemaining: 0,
    forecastedDemand: 63,
    suggestedOrder: 150,
    trend: 'up',
    risk: 'critical',
  },
  {
    sku: 'SKU-00210',
    name: 'Monitor Stand Adjustable',
    currentStock: 142,
    safetyStock: 20,
    avgDailyUsage: 0.9,
    daysRemaining: 157,
    forecastedDemand: 27,
    suggestedOrder: 0,
    trend: 'stable',
    risk: 'safe',
  },
  {
    sku: 'SKU-00388',
    name: 'Webcam 4K Ultra',
    currentStock: 67,
    safetyStock: 40,
    avgDailyUsage: 3.3,
    daysRemaining: 20,
    forecastedDemand: 99,
    suggestedOrder: 80,
    trend: 'down',
    risk: 'safe',
  },
  {
    sku: 'SKU-00512',
    name: 'Laptop Docking Station',
    currentStock: 31,
    safetyStock: 30,
    avgDailyUsage: 1.5,
    daysRemaining: 20,
    forecastedDemand: 45,
    suggestedOrder: 50,
    trend: 'up',
    risk: 'warning',
  },
];

const RISK_CONFIG = {
  critical: { label: 'Critical', color: 'var(--color-error)', bg: 'rgba(239,68,68,0.1)' },
  warning: { label: 'Warning', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
  safe: { label: 'Healthy', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
};

export default function ForecastingPage() {
  const [filter, setFilter] = useState('all');

  const filtered = FORECAST_DATA.filter(
    (d) => filter === 'all' || d.risk === filter
  );

  const summary = {
    critical: FORECAST_DATA.filter((d) => d.risk === 'critical').length,
    warning: FORECAST_DATA.filter((d) => d.risk === 'warning').length,
    safe: FORECAST_DATA.filter((d) => d.risk === 'safe').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      {/* Header */}
      <section style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--color-success), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-white)', letterSpacing: 'var(--tracking-tight)' }}>
              AI Demand Forecasting
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              30-day rolling demand predictions with safety-stock recommendations.
            </p>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <RefreshCw size={14} /> Recalculate
        </button>
      </section>

      {/* Summary KPIs */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Critical Risk SKUs', value: summary.critical, color: 'var(--color-error)', icon: AlertTriangle },
          { label: 'Warning SKUs', value: summary.warning, color: 'var(--color-warning)', icon: TrendingDown },
          { label: 'Healthy Stock SKUs', value: summary.safe, color: 'var(--color-success)', icon: Package },
          { label: 'Suggested Orders', value: FORECAST_DATA.filter((d) => d.suggestedOrder > 0).length, color: 'var(--color-text-primary)', icon: Zap },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', fontWeight: 600 }}>{label}</span>
              <Icon size={16} style={{ color }} />
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color }}>{value}</div>
          </div>
        ))}
      </section>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {['all', 'critical', 'warning', 'safe'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filter === f ? (RISK_CONFIG[f]?.color || 'var(--color-border-hover)') : 'var(--color-border)',
              background: filter === f ? (RISK_CONFIG[f]?.bg || 'var(--color-surface-2)') : 'transparent',
              color: filter === f ? (RISK_CONFIG[f]?.color || 'var(--color-text-primary)') : 'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontWeight: filter === f ? 600 : 400,
              transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All SKUs' : RISK_CONFIG[f]?.label}
          </button>
        ))}
      </div>

      {/* Forecast Table */}
      <section style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
                {['SKU', 'Product', 'Current Stock', 'Safety Stock', 'Days Remaining', '30d Forecast', 'Suggested Order', 'Risk'].map((h) => (
                  <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => {
                const cfg = RISK_CONFIG[row.risk];
                return (
                  <tr key={row.sku} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{row.sku}</td>
                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: row.currentStock === 0 ? 'var(--color-error)' : 'var(--color-text-primary)', fontWeight: 600 }}>{row.currentStock}</td>
                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{row.safetyStock}</td>
                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: row.daysRemaining <= 7 ? 'var(--color-error)' : 'var(--color-text-primary)', fontWeight: 600 }}>
                      {row.daysRemaining === 0 ? 'OUT' : `${row.daysRemaining}d`}
                    </td>
                    <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{row.forecastedDemand} units</td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      {row.suggestedOrder > 0 ? (
                        <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                          +{row.suggestedOrder} units
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>No action</span>
                      )}
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
