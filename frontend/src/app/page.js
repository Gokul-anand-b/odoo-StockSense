'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  Layers,
  Activity,
  Box,
  Cpu,
  ArrowRight,
  Boxes,
  Lock,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import styles from '../styles/landing.module.css';

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <div className={styles.landingContainer}>
      <div className={styles.ambientBackground} aria-hidden="true" />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoBadge}>S</div>
          <span className={styles.brandTitle}>StockSense</span>
          <span className={styles.brandTag}>v1.0-alpha</span>
        </div>

        <nav className={styles.navLinks}>
          {isAuthenticated ? (
            <Link href="/dashboard" className={styles.navBtnPrimary}>
              Dashboard ({user?.first_name || 'Account'})
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.navBtnSecondary}>
                Sign In
              </Link>
              <Link href="/signup" className={styles.navBtnPrimary}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} />
          <span>Module 1 Active: RBAC, Secure JWT & OTP Recovery</span>
        </div>

        <h1 className={styles.heroHeading}>
          Intelligent Inventory & <br />
          <span className={styles.heroHeadingGradient}>3D Digital Twin</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Built for high-velocity operations. Real-time double-entry ledger,
          role-based operational authorization, interactive Three.js 3D rack
          inspection, and AI predictive demand forecasting.
        </p>

        <div className={styles.ctaGroup}>
          {isAuthenticated ? (
            <Link href="/dashboard" className={styles.ctaPrimary}>
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link href="/signup" className={styles.ctaPrimary}>
                Create Manager / Staff Account <ArrowRight size={18} />
              </Link>
              <Link href="/login" className={styles.ctaSecondary}>
                Sign In to Portal
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Feature Grid */}
      <section className={styles.featuresSection}>
        <div className={styles.grid}>
          {/* Card 1: Auth & RBAC */}
          <div className={styles.card}>
            <div className={styles.cardIconBox}>
              <ShieldCheck size={22} />
            </div>
            <h2 className={styles.cardTitle}>Role-Based Access Control</h2>
            <p className={styles.cardText}>
              Segment operational privileges between Inventory Managers and
              Warehouse Staff with JWT tokens, short-lived expiries, and OTP recovery.
            </p>
            <span className={styles.cardBadge}>Module 1: Authentication</span>
          </div>

          {/* Card 2: 3D Warehouse */}
          <div className={styles.card}>
            <div className={styles.cardIconBox}>
              <Box size={22} />
            </div>
            <h2 className={styles.cardTitle}>3D Digital Twin</h2>
            <p className={styles.cardText}>
              Interactive 3D isometric warehouse simulation rendering physical
              racks, bays, and real-time occupancy heatmaps.
            </p>
            <span className={styles.cardBadge}>WebGL / Three.js</span>
          </div>

          {/* Card 3: Real-Time Ledger */}
          <div className={styles.card}>
            <div className={styles.cardIconBox}>
              <Activity size={22} />
            </div>
            <h2 className={styles.cardTitle}>Real-Time Stock Ledger</h2>
            <p className={styles.cardText}>
              Immutable double-entry stock transactions with instantaneous
              WebSocket updates, serial tracking, and zero reconciliation drift.
            </p>
            <span className={styles.cardBadge}>Django Channels + Redis</span>
          </div>

          {/* Card 4: Operations */}
          <div className={styles.card}>
            <div className={styles.cardIconBox}>
              <Layers size={22} />
            </div>
            <h2 className={styles.cardTitle}>Barcode & Voice Execution</h2>
            <p className={styles.cardText}>
              Hands-free voice recognition and mobile camera barcode scanning for
              frictionless picking, packing, receiving, and internal transfers.
            </p>
            <span className={styles.cardBadge}>Web Speech & Barcode API</span>
          </div>

          {/* Card 5: AI Forecasting */}
          <div className={styles.card}>
            <div className={styles.cardIconBox}>
              <Cpu size={22} />
            </div>
            <h2 className={styles.cardTitle}>Predictive Forecasting</h2>
            <p className={styles.cardText}>
              Machine learning models anticipate demand spikes, compute optimal
              safety stock thresholds, and auto-generate replenishment drafts.
            </p>
            <span className={styles.cardBadge}>Prophet / Statsmodels</span>
          </div>

          {/* Card 6: Enterprise Security */}
          <div className={styles.card}>
            <div className={styles.cardIconBox}>
              <Lock size={22} />
            </div>
            <h2 className={styles.cardTitle}>Enterprise Hardened</h2>
            <p className={styles.cardText}>
              Argon2/PBKDF2 password hashing, rate-limited OTP endpoints, token
              blacklisting on logout, and CSRF protection.
            </p>
            <span className={styles.cardBadge}>Zero-Trust Architecture</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>StockSense Enterprise Architecture • Next.js 15 • Django 5 REST Framework • SimpleJWT</p>
      </footer>
    </div>
  );
}
