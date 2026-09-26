'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ArrowDownLeft, 
  ArrowLeftRight, 
  SlidersHorizontal, 
  History, 
  Box, 
  Settings, 
  User, 
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/products', icon: Package },
    { 
      label: 'Operations', 
      isSection: true,
      children: [
        { label: 'Receipts', href: '/operations/receipts', icon: ArrowDownLeft },
        { label: 'Delivery Orders', href: '/operations/deliveries', icon: Truck, badge: 'Active' },
        { label: 'Internal Transfers', href: '/operations/transfers', icon: ArrowLeftRight },
        { label: 'Stock Adjustments', href: '/operations/adjustments', icon: SlidersHorizontal },
      ]
    },
    { label: 'Move History', href: '/move-history', icon: History },
    { label: '3D Warehouse', href: '/warehouse-3d', icon: Box, novelty: true },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          color: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
        }}>
          <Box size={22} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Stock<span style={{ color: 'var(--text-muted)' }}>Sense</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
            Enterprise IMS
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item, idx) => {
          if (item.isSection) {
            return (
              <div key={idx} style={{ marginTop: '12px', marginBottom: '4px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '6px 12px',
                }}>
                  {item.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {item.children.map((child) => {
                    const active = isActive(child.href);
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          fontSize: '13.5px',
                          fontWeight: active ? '600' : '500',
                          color: active ? '#ffffff' : 'var(--text-secondary)',
                          backgroundColor: active ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                          border: active ? '1px solid var(--border-medium)' : '1px solid transparent',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <ChildIcon size={17} strokeWidth={active ? 2.2 : 1.8} color={active ? '#ffffff' : 'var(--text-muted)'} />
                          <span>{child.label}</span>
                        </div>
                        {child.badge && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 7px',
                            borderRadius: '999px',
                            backgroundColor: active ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                            color: active ? '#000000' : '#ffffff',
                          }}>
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: active ? '600' : '500',
                color: active ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: active ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: active ? '1px solid var(--border-medium)' : '1px solid transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} color={active ? '#ffffff' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.novelty && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <Sparkles size={11} /> 3D
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Bottom Bar */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '13px',
          }}>
            GM
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>Gokul Anand</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inventory Manager</div>
          </div>
        </div>
        <button 
          title="Logout"
          style={{
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: '6px',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
