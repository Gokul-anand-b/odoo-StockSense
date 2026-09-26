'use client';

import React from 'react';
import { Search, Bell, ShieldCheck, Warehouse } from 'lucide-react';

export default function Topbar() {
  return (
    <header style={{
      height: '64px',
      position: 'fixed',
      top: 0,
      left: '260px',
      right: 0,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      zIndex: 30,
    }}>
      {/* Quick Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '7px 14px',
        width: '320px',
      }}>
        <Search size={15} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search deliveries, SKU, documents... (Ctrl+K)" 
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            width: '100%',
          }}
        />
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Active Warehouse Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12.5px',
          fontWeight: '500',
        }}>
          <Warehouse size={14} color="var(--text-muted)" />
          <span>Main Distribution Hub (WH-01)</span>
        </div>

        {/* Live Sync Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 10px #10b981',
          }} />
          <span>Realtime Live</span>
        </div>

        {/* Notification Bell */}
        <button style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          position: 'relative',
        }}>
          <Bell size={16} />
          <span style={{
            position: 'absolute',
            top: '7px',
            right: '7px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
          }} />
        </button>
      </div>
    </header>
  );
}
