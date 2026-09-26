'use client';

import React from 'react';

export default function StatusBadge({ status }) {
  const norm = (status || 'draft').toLowerCase();

  const configs = {
    draft: {
      label: 'Draft',
      bg: 'var(--status-draft-bg)',
      color: 'var(--status-draft-text)',
      border: 'var(--status-draft-border)',
      dotColor: '#a1a1aa',
      pulse: false,
    },
    waiting: {
      label: 'Waiting Availability',
      bg: 'var(--status-waiting-bg)',
      color: 'var(--status-waiting-text)',
      border: 'var(--status-waiting-border)',
      dotColor: '#f59e0b',
      pulse: true,
    },
    ready: {
      label: 'Ready to Ship',
      bg: 'var(--status-ready-bg)',
      color: 'var(--status-ready-text)',
      border: 'var(--status-ready-border)',
      dotColor: '#3b82f6',
      pulse: true,
    },
    done: {
      label: 'Done / Validated',
      bg: 'var(--status-done-bg)',
      color: 'var(--status-done-text)',
      border: 'var(--status-done-border)',
      dotColor: '#10b981',
      pulse: false,
    },
    canceled: {
      label: 'Canceled',
      bg: 'var(--status-canceled-bg)',
      color: 'var(--status-canceled-text)',
      border: 'var(--status-canceled-border)',
      dotColor: '#ef4444',
      pulse: false,
    },
  };

  const current = configs[norm] || configs.draft;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: current.bg,
      color: current.color,
      border: `1px solid ${current.border}`,
      letterSpacing: '0.01em',
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: current.dotColor,
        boxShadow: current.pulse ? `0 0 8px ${current.dotColor}` : 'none',
      }} />
      {current.label}
    </span>
  );
}
