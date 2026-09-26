'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  PlusCircle,
  SlidersHorizontal,
  Truck,
  ArrowDownLeft,
  ArrowLeftRight,
  Sliders,
  History,
  Box,
  Search,
  Warehouse,
  Bell,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/dashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth({
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

  const userInitial = user?.first_name ? user.first_name[0].toUpperCase() : 'N';

  return (
    <div className={styles.dashboardShell}>
      {/* ── Left Sidebar ── */}
      <aside className={styles.sidebar}>
        {/* Brand Header */}
        <Link href="/dashboard" className={styles.brandHeader}>
          <div className={styles.brandLogo}>ss</div>
          <div className={styles.brandTitles}>
            <span className={styles.brandName}>StockSense</span>
            <span className={styles.brandTagline}>B&W INVENTORY CORE</span>
          </div>
        </Link>

        {/* Group: CATALOG & PRODUCTS */}
        <div className={styles.navGroup}>
          <div className={styles.groupLabel}>Catalog & Products</div>
          <Link
            href="/products"
            className={`${styles.navLink} ${
              pathname === '/products' || pathname === '/dashboard' ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <Boxes size={16} />
              <span>Products Directory</span>
            </div>
          </Link>
          <Link
            href="/products/create"
            className={`${styles.navLink} ${
              pathname === '/products/create' ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <PlusCircle size={16} />
              <span>Create Product</span>
            </div>
          </Link>
          <Link
            href="/products/categories"
            className={`${styles.navLink} ${
              pathname === '/products/categories' ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <SlidersHorizontal size={16} />
              <span>Categories</span>
            </div>
          </Link>
        </div>

        {/* Group: OPERATIONS & LOGISTICS */}
        <div className={styles.navGroup}>
          <div className={styles.groupLabel}>Operations & Logistics</div>
          <Link
            href="/operations/deliveries"
            className={`${styles.navLink} ${
              pathname?.startsWith('/operations/deliveries') ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <Truck size={16} />
              <span>Delivery Orders</span>
            </div>
            <span className={`${styles.pillBadge} ${styles.pillBadgeDark}`}>Active</span>
          </Link>
          <Link
            href="/operations/receipts"
            className={`${styles.navLink} ${
              pathname?.startsWith('/operations/receipts') ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <ArrowDownLeft size={16} />
              <span>Incoming Receipts</span>
            </div>
          </Link>
          <Link
            href="/operations/transfers"
            className={`${styles.navLink} ${
              pathname?.startsWith('/operations/transfers') ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <ArrowLeftRight size={16} />
              <span>Internal Transfers</span>
            </div>
          </Link>
          <Link
            href="/operations/adjustments"
            className={`${styles.navLink} ${
              pathname?.startsWith('/operations/adjustments') ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <Sliders size={16} />
              <span>Stock Adjustments</span>
            </div>
          </Link>
        </div>

        {/* Group: LEDGER & VISUALIZATION */}
        <div className={styles.navGroup}>
          <div className={styles.groupLabel}>Ledger & Visualization</div>
          <Link
            href="/move-history"
            className={`${styles.navLink} ${
              pathname === '/move-history' ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <History size={16} />
              <span>Stock Move Ledger</span>
            </div>
          </Link>
          <Link
            href="/warehouse-3d"
            className={`${styles.navLink} ${
              pathname === '/warehouse-3d' ? styles.navLinkActive : ''
            }`}
          >
            <div className={styles.navLinkLeft}>
              <Box size={16} />
              <span>3D Warehouse</span>
            </div>
            <span className={`${styles.pillBadge} ${styles.pillBadgeLight}`}>3D</span>
          </Link>
        </div>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <Link href="/profile" className={styles.userAvatarBtn} title="User Profile">
            {userInitial}
          </Link>
          <button
            type="button"
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Viewport ── */}
      <div className={styles.mainViewport}>
        {/* Top Navbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.coreTitle}>StockSense Core</span>
            <div className={styles.pulseBadge}>
              <div className={styles.pulseDot} />
              <span>LIVE PULSE</span>
            </div>
          </div>

          <div className={styles.topbarCenter}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Quick SKU / Document search..."
              className={styles.topSearchInput}
            />
          </div>

          <div className={styles.topbarRight}>
            <button type="button" className={styles.topbarBtn}>
              <Warehouse size={14} />
              <span>Central Hub (WH-01)</span>
            </button>

            <Link href="/alerts" className={styles.iconOnlyBtn} title="Alerts & Notifications">
              <Bell size={15} />
              <span className={styles.notifDot} />
            </Link>

            <div className={styles.statusEnginePill}>
              <ShieldCheck size={14} />
              <span>B&W ENGINE ONLINE</span>
            </div>
          </div>
        </header>

        {/* Main Page Content */}
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
