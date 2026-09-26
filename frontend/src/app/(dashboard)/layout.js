import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <main style={{ marginTop: '64px', padding: '32px 36px', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
