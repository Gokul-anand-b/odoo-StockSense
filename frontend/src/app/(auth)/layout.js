'use client';

import AuthBackground from '../../components/auth/AuthBackground';
import styles from '../../styles/auth.module.css';

export default function AuthLayout({ children }) {
  return (
    <main className={styles.authPage}>
      <div className={styles.canvasWrapper} aria-hidden="true">
        <AuthBackground />
      </div>
      <div className={styles.authContent}>
        {children}
      </div>
    </main>
  );
}
