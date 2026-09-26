'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  Box,
  TrendingUp,
  Bell,
  User,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/dashboardLayout.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Operations', href: '/operations', icon: ArrowLeftRight },
  { label: 'Products', href: '/products', icon: Boxes },
  { label: '3D Warehouse', href: '/warehouse-3d', icon: Box },
  { label: 'Forecasting', href: '/forecasting', icon: TrendingUp },
  { label: 'Alerts', href: '/alerts', icon: Bell },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function DashboardLayout({ children }) {
  const { user, isAuthenticated, isLoading, logout, isManager } = useAuth({
    requireAuth: true,
  });
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p style={{ fontSize: '0.875rem' }}>Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAuth handles redirect to /login
  }

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : 'SS';

  const roleLabel =
    user?.role === 'inventory_manager'
      ? 'Inventory Manager'
      : user?.role === 'warehouse_staff'
      ? 'Warehouse Staff'
      : user?.role || 'Staff';

  return (
    <div className={styles.dashboardShell}>
      {/* Top Navbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.leftSection}>
            <Link href="/dashboard" className={styles.brandLink}>
              <div className={styles.logoIcon}>S</div>
              <span className={styles.brandTitle}>StockSense</span>
            </Link>

            <nav className={styles.navLinks} aria-label="Main Navigation">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.rightSection}>
            {/* Role Badge */}
            <span
              className={`${styles.roleBadge} ${
                isManager ? styles.roleManager : styles.roleStaff
              }`}
            >
              <Shield size={12} />
              {roleLabel}
            </span>

            {/* User Profile Pill */}
            <Link href="/profile" className={styles.userMenu}>
              <div className={styles.avatar}>{initials}</div>
              <span className={styles.userName}>
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email}
              </span>
            </Link>

            {/* Logout Action */}
            <button
              type="button"
              onClick={logout}
              className={styles.logoutBtn}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
