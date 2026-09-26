'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PackageOpen, Plus, Search, Eye, CheckCircle, Clock, AlertCircle, Loader2, Download } from 'lucide-react';
import { operationService } from '@/services/operationService';

const MOCK_RECEIPTS = [
  { id: 'RCP-9021', supplier: 'TechWorld Supplies', items: 8, units: 240, status: 'validated', date: '2026-09-25', zone: 'Zone D' },
  { id: 'RCP-9020', supplier: 'Global Parts Co.', items: 3, units: 96, status: 'pending', date: '2026-09-25', zone: 'Zone A' },
  { id: 'RCP-9019', supplier: 'FastShip Inc.', items: 12, units: 504, status: 'pending', date: '2026-09-24', zone: 'Zone B' },
  { id: 'RCP-9018', supplier: 'MediaTech Corp.', items: 5, units: 180, status: 'validated', date: '2026-09-23', zone: 'Zone C' },
  { id: 'RCP-9017', supplier: 'TechWorld Supplies', items: 2, units: 48, status: 'overdue', date: '2026-09-20', zone: 'Zone A' },
];

const STATUS_CONFIG = {
  validated: { label: 'Validated', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  pending: { label: 'Pending', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  overdue: { label: 'Overdue', color: 'var(--color-error)', bg: 'rgba(239,68,68,0.1)', icon: AlertCircle },
};

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await operationService.getReceipts();
      if (data && data.length > 0) {
        setReceipts(data);
      } else {
        setReceipts(MOCK_RECEIPTS);
      }
    } catch (err) {
      console.error('Failed to load receipts:', err);
      setReceipts(MOCK_RECEIPTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleQuickDownload = async (receiptId) => {
    try {
      const receipt = await operationService.getReceiptById(receiptId);
      if (!receipt) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const itemsList = receipt.items_detail && receipt.items_detail.length > 0 ? receipt.items_detail : [
        { product: 'Standard Inventory Item', sku: 'SKU-REC', expected: receipt.units || 50, received: receipt.units || 50, uom: 'Units' }
      ];

      const itemsHtml = itemsList.map((it, idx) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${idx + 1}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600;">${it.product}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-family: monospace;">${it.sku || 'N/A'}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center;">${it.expected || 0}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center; font-weight: 700; color: #16a34a;">${it.received || it.expected || 0}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px;">${it.uom || 'Units'}</td>
        </tr>
      `).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Goods Receipt Voucher - ${receipt.id}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; max-width: 850px; margin: 0 auto; background: #ffffff; }
            .grn-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 28px; }
            .company-name { font-size: 26px; font-weight: 800; color: #0f172a; }
            .company-sub { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; }
            .grn-title-text { font-size: 20px; font-weight: 800; color: #2563eb; }
            .grn-id { font-size: 14px; font-family: monospace; color: #475569; font-weight: 700; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 28px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
            .val { font-size: 14px; color: #0f172a; font-weight: 600; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 28px; margin-top: 10px; }
            th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1; }
            .signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; padding-top: 20px; }
            .sign-line { border-top: 1.5px dashed #94a3b8; text-align: center; padding-top: 8px; font-size: 12px; font-weight: 600; color: #475569; }
            .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
            @media print { .no-print { display: none !important; } body { padding: 0; margin: 0; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 24px; display: flex; gap: 12px;">
            <button onclick="window.print()" style="padding: 10px 22px; background: #0f172a; color: #ffffff; border: none; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer;">🖨️ Print / Download PDF</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer;">Close</button>
          </div>
          <div class="grn-header">
            <div>
              <div class="company-name">StockSense ERP</div>
              <div class="company-sub">Inventory & Stock Management System</div>
            </div>
            <div style="text-align: right;">
              <div class="grn-title-text">GOODS RECEIPT VOUCHER</div>
              <div class="grn-id">REF: ${receipt.id}</div>
            </div>
          </div>
          <div class="info-grid">
            <div><span class="label">Supplier / Partner</span><div class="val">${receipt.supplier || 'N/A'}</div></div>
            <div><span class="label">Purchase Order Ref</span><div class="val">${receipt.poReference || 'N/A'}</div></div>
            <div><span class="label">Destination Warehouse</span><div class="val">${receipt.destinationLocation || receipt.zone || 'Main Warehouse'}</div></div>
            <div><span class="label">Total Stock Received</span><div class="val">${receipt.units || 0} Units</div></div>
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #0f172a; text-transform: uppercase; margin-bottom: 8px;">Received Line Items</div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th><th>Product Name</th><th>SKU</th><th style="text-align: center;">Demanded</th><th style="text-align: center;">Received</th><th>UOM</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="signatures">
            <div class="sign-line">Receiving Officer</div>
            <div class="sign-line">Quality Inspector</div>
            <div class="sign-line">Warehouse Manager</div>
          </div>
          <div class="footer">
            <div>Generated by StockSense Stock Management ERP</div>
            <div>Document Date: ${new Date().toLocaleDateString()}</div>
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };</script>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  const filtered = receipts.filter(
    (r) => r.id.toLowerCase().includes(search.toLowerCase()) || (r.supplier && r.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/operations" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Operations</Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>Goods Receipts</h1>
        </div>
        <Link href="/operations/receipts/create" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'var(--color-white)', color: 'var(--color-black)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
          <Plus size={15} /> New Receipt
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 340 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
        <input
          type="text" placeholder="Search receipts…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}>
                {['Receipt ID', 'Supplier', 'Items', 'Total Units', 'Destination', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Loader2 size={18} className="animate-spin" /> Loading receipts...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                    No receipts found.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                  const Icon = cfg.icon;
                  return (
                    <tr key={r.id + idx} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{r.supplier}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.items}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.units}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.zone || r.destinationLocation}</td>
                      <td style={{ padding: '14px 16px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{r.date}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Link href={`/operations/receipts/${r.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', textDecoration: 'none' }}>
                            <Eye size={14} /> View
                          </Link>
                          <button
                            onClick={() => handleQuickDownload(r.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 500, padding: 0 }}
                            title="Download Goods Receipt Voucher"
                          >
                            <Download size={13} /> GRN
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

