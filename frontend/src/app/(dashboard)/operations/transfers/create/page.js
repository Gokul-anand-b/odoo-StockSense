'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Loader2, AlertCircle, Search, UserCheck, ChevronDown } from 'lucide-react';
import { operationService } from '@/services/operationService';
import authService from '@/services/authService';

const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 };

export default function CreateTransferPage() {
  const router = useRouter();

  const [fromZone, setFromZone] = useState('Zone A');
  const [toZone, setToZone] = useState('Zone B');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [responsible, setResponsible] = useState('');
  const [responsibleInput, setResponsibleInput] = useState('');
  const [reason, setReason] = useState('');
  const [units, setUnits] = useState('10');

  // Searchable user dropdown state
  const [dbUsers, setDbUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const dropdownRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const users = await authService.getUsers();
        setDbUsers(users || []);
      } catch (err) {
        console.warn('Could not fetch DB users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = dbUsers.filter((u) => {
    const q = responsibleInput.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleSelectUser = (user) => {
    setResponsible(user.id);
    setResponsibleInput(user.name);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (fromZone === toZone) {
      setError('Source zone and destination zone must be different.');
      return;
    }

    try {
      setIsSubmitting(true);
      await operationService.createTransfer({
        from_zone: fromZone,
        to_zone: toZone,
        scheduledDate: scheduledDate,
        responsible: responsible || responsibleInput,
        reason: reason,
        units: Number(units) || 10,
      });

      router.push('/operations/transfers');
    } catch (err) {
      console.error('Error creating transfer:', err);
      setError(err.message || 'Failed to create internal transfer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <Link href="/operations/transfers" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Transfers</Link>
        <span style={{ color: 'var(--color-text-muted)' }}>/</span>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>New Transfer</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle}>From Zone *</label>
            <select
              value={fromZone}
              onChange={(e) => setFromZone(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              required
            >
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>To Zone *</label>
            <select
              value={toZone}
              onChange={(e) => setToZone(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              required
            >
              <option value="Zone B">Zone B</option>
              <option value="Zone A">Zone A</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle}>Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Searchable Responsible User Field */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <label style={labelStyle}>Responsible</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Assign to user..."
                value={responsibleInput}
                onChange={(e) => {
                  setResponsibleInput(e.target.value);
                  setResponsible('');
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                style={inputStyle}
              />
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
            </div>

            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 100, maxHeight: 200, overflowY: 'auto' }}>
                {loadingUsers ? (
                  <div style={{ padding: '10px 14px', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Loading users…</div>
                ) : filteredUsers.length === 0 ? (
                  <div style={{ padding: '10px 14px', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      style={{ padding: '9px 12px', borderBottom: '1px solid var(--color-surface-2)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-white)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <UserCheck size={13} style={{ color: 'var(--color-success)' }} /> {user.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{user.email} • <span style={{ textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</span></div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Total Units</label>
            <input
              type="number"
              min="1"
              placeholder="Quantity of units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Reason / Note</label>
          <textarea
            placeholder="Reason for transfer…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ ...inputStyle, height: 70, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/operations/transfers" style={{ padding: '9px 20px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSubmitting ? 'Creating...' : 'Create Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
}
