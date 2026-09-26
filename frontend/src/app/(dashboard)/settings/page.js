'use client';

import { useState } from 'react';
import { Settings, Warehouse, Bell, Shield, Palette, Save } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'access', label: 'Access Control', icon: Shield },
];

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
      <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</span>
      </div>
      <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{label}</div>
        {hint && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 3 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '8px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)',
  fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
};

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, background: checked ? 'var(--color-success)' : 'var(--color-surface-3)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', top: 3, left: checked ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: 'var(--color-white)', transition: 'left 0.2s' }} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [notifs, setNotifs] = useState({ email: true, stockAlerts: true, opSummary: false, weeklyReport: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      {/* Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6) var(--space-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)' }}>
            <Settings size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: 'var(--tracking-tight)' }}>System Settings</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Configure StockSense behaviour, warehouses, and access control.</p>
          </div>
        </div>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: saved ? 'var(--color-success)' : 'var(--color-white)', color: saved ? 'white' : 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}>
          <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </section>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 'var(--radius-md)', border: 'none', background: activeTab === id ? 'var(--color-surface-3)' : 'transparent', color: activeTab === id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: activeTab === id ? 600 : 400, transition: 'all 0.15s' }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div>
          <Section title="Organization">
            <Field label="Company Name" hint="Appears in documents and exports">
              <input type="text" defaultValue="StockSense Corp." style={inputStyle} />
            </Field>
            <Field label="Default Currency" hint="Used for valuation and pricing">
              <select style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>USD — US Dollar</option>
                <option>INR — Indian Rupee</option>
                <option>EUR — Euro</option>
              </select>
            </Field>
            <Field label="Fiscal Year Start">
              <select style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>January</option>
                <option>April</option>
                <option>October</option>
              </select>
            </Field>
          </Section>
          <Section title="Inventory Defaults">
            <Field label="FIFO / LIFO" hint="Default stock valuation method">
              <select style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>FIFO — First In, First Out</option>
                <option>LIFO — Last In, First Out</option>
                <option>AVCO — Average Cost</option>
              </select>
            </Field>
            <Field label="Auto Reorder" hint="Automatically create purchase orders when below threshold">
              <Toggle checked={true} onChange={() => {}} />
            </Field>
          </Section>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <Section title="Alert Preferences">
            <Field label="Email Alerts" hint="Receive critical alerts via email">
              <Toggle checked={notifs.email} onChange={(v) => setNotifs((n) => ({ ...n, email: v }))} />
            </Field>
            <Field label="Stock Level Alerts" hint="Notify when SKUs fall below safety stock">
              <Toggle checked={notifs.stockAlerts} onChange={(v) => setNotifs((n) => ({ ...n, stockAlerts: v }))} />
            </Field>
            <Field label="Operations Summary" hint="Daily summary of receipts, deliveries, transfers">
              <Toggle checked={notifs.opSummary} onChange={(v) => setNotifs((n) => ({ ...n, opSummary: v }))} />
            </Field>
            <Field label="Weekly Report" hint="Automated weekly PDF report via email">
              <Toggle checked={notifs.weeklyReport} onChange={(v) => setNotifs((n) => ({ ...n, weeklyReport: v }))} />
            </Field>
          </Section>
        </div>
      )}

      {activeTab === 'warehouses' && (
        <div>
          <Section title="Warehouse Zones">
            {['Zone A — Main Storage', 'Zone B — Cold Storage', 'Zone C — High-Value', 'Zone D — Dispatch Bay'].map((z) => (
              <Field key={z} label={z} hint="Location code and rack configuration">
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <input type="text" placeholder="Location code" style={{ ...inputStyle, flex: 1 }} />
                  <input type="number" placeholder="Capacity" style={{ ...inputStyle, width: 120 }} />
                </div>
              </Field>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'access' && (
        <div>
          <Section title="Role Permissions">
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              RBAC roles are managed at the user level. Visit the <strong style={{ color: 'var(--color-text-primary)' }}>Profile</strong> page to assign roles to individual users.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {[
                { role: 'Inventory Manager', perms: ['View All', 'Edit Products', 'Approve Transfers', 'View Reports', 'Manage Users'] },
                { role: 'Warehouse Staff', perms: ['View Inventory', 'Create Operations', 'View Own History'] },
              ].map(({ role, perms }) => (
                <div key={role} style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{role}</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {perms.map((p) => (
                      <li key={p} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
