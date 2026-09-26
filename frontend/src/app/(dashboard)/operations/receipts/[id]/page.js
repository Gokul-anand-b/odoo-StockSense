'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { PackageOpen, CheckCircle, Clock, ArrowLeft, Loader2, Check, AlertCircle, Download, Printer } from 'lucide-react';
import { operationService } from '@/services/operationService';

export default function ReceiptDetailPage({ params }) {
  const { id } = use(params);

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await operationService.getReceiptById(id);
      setReceipt(data);
    } catch (err) {
      console.error('Failed to load receipt detail:', err);
      // Fallback object for mock ID
      setReceipt({
        id: id,
        supplier: 'TechWorld Supplies',
        poReference: 'PO-99420',
        destinationLocation: 'Main Warehouse - Rack A-12',
        zone: 'Zone D',
        items: 2,
        units: 240,
        status: 'pending',
        date: '2026-09-25',
        notes: 'Goods receipt delivery',
        items_detail: [
          { id: 'item-1', product: 'Industrial High-Torque Servo Motor 4.5kW', sku: 'MOT-SER-8088', expected: 10, received: 10, uom: 'Units', unitPrice: 840.00 },
          { id: 'item-2', product: 'Rugged Wireless Barcode & QR Scanner', sku: 'SCN-QR-900', expected: 20, received: 20, uom: 'Pieces', unitPrice: 190.00 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleValidate = async () => {
    try {
      setIsValidating(true);
      setError(null);
      await operationService.validateReceipt(id);
      setSuccessMsg('Receipt validated successfully! Product stock has been updated in the catalog database.');
      await fetchDetail();
    } catch (err) {
      console.error('Validation error:', err);
      setError(err.message || 'Failed to validate receipt.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!receipt) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups in your browser to download/print the receipt.');
      return;
    }

    const itemsList = receipt.items_detail && receipt.items_detail.length > 0 ? receipt.items_detail : [
      {
        product: 'Standard Inventory Item',
        sku: 'SKU-REC',
        expected: receipt.units || 50,
        received: receipt.units || 50,
        uom: 'Units'
      }
    ];

    const itemsHtml = itemsList.map((it, idx) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">${it.product}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-family: monospace; color: #475569;">${it.sku || 'N/A'}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center; color: #475569;">${it.expected || it.demanded_or_expected || 0}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center; font-weight: 700; color: #16a34a;">${it.received || it.done_or_received || it.expected || 0}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">${it.uom || 'Units'}</td>
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
          .company-name { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
          .company-sub { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 2px; }
          .doc-title { text-align: right; }
          .grn-title-text { font-size: 20px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; }
          .grn-id { font-size: 14px; font-family: monospace; color: #475569; font-weight: 700; margin-top: 2px; }
          
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 28px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
          .info-cell { display: flex; flexDirection: column; }
          .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.6px; }
          .val { font-size: 14px; color: #0f172a; font-weight: 600; margin-top: 2px; }
          
          .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; background: #dcfce7; color: #15803d; font-weight: 700; font-size: 12px; border: 1px solid #bbf7d0; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 28px; margin-top: 10px; }
          th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #cbd5e1; }
          
          .notes-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 14px 18px; border-radius: 8px; margin-bottom: 36px; font-size: 13px; color: #1e40af; }
          
          .signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; padding-top: 20px; }
          .sign-line { border-top: 1.5px dashed #94a3b8; text-align: center; padding-top: 8px; font-size: 12px; font-weight: 600; color: #475569; }
          
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
          
          .btn-print { padding: 10px 22px; background: #0f172a; color: #ffffff; border: none; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
          .btn-close { padding: 10px 20px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; }
          
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 24px; display: flex; gap: 12px;">
          <button onclick="window.print()" class="btn-print">🖨️ Print / Download PDF</button>
          <button onclick="window.close()" class="btn-close">Close</button>
        </div>

        <div class="grn-header">
          <div>
            <div class="company-name">StockSense ERP</div>
            <div class="company-sub">Inventory & Stock Management System</div>
          </div>
          <div class="doc-title">
            <div class="grn-title-text">GOODS RECEIPT VOUCHER</div>
            <div class="grn-id">REF: ${receipt.id}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-cell">
            <span class="label">Supplier / Partner</span>
            <span class="val">${receipt.supplier || 'N/A'}</span>
          </div>
          <div class="info-cell">
            <span class="label">Purchase Order Ref</span>
            <span class="val">${receipt.poReference || 'N/A'}</span>
          </div>
          <div class="info-cell">
            <span class="label">Destination Warehouse</span>
            <span class="val">${receipt.destinationLocation || receipt.zone || 'Main Warehouse'}</span>
          </div>
          <div class="info-cell">
            <span class="label">Verification Status</span>
            <span class="val" style="margin-top: 4px;">
              <span class="status-badge">✓ ${isValidated ? 'VALIDATED & CATALOG UPDATED' : 'PENDING VERIFICATION'}</span>
            </span>
          </div>
          <div class="info-cell">
            <span class="label">Arrival Date</span>
            <span class="val">${receipt.date || new Date().toISOString().slice(0, 10)}</span>
          </div>
          <div class="info-cell">
            <span class="label">Total Stock Received</span>
            <span class="val">${receipt.units || 0} Units</span>
          </div>
        </div>

        <div style="font-weight: 700; font-size: 14px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Received Line Items</div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th style="text-align: center;">Demanded</th>
              <th style="text-align: center;">Received</th>
              <th>UOM</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        ${receipt.notes ? `<div class="notes-box"><strong>Notes / Inspection Remarks:</strong><br/>${receipt.notes}</div>` : ''}

        <div class="signatures">
          <div class="sign-line">Receiving Officer</div>
          <div class="sign-line">Quality Inspector</div>
          <div class="sign-line">Warehouse Manager</div>
        </div>

        <div class="footer">
          <div>Generated by StockSense Stock Management ERP</div>
          <div>Document Date: ${new Date().toLocaleDateString()} | System Timestamp: ${new Date().toLocaleTimeString()}</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', color: 'var(--color-text-tertiary)' }}>
        <Loader2 size={24} className="animate-spin" /> Loading receipt detail...
      </div>
    );
  }

  const isValidated = receipt.status === 'validated' || receipt.status === 'done' || receipt.status === 'COMPLETED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s var(--ease-out)', maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/operations/receipts" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> Receipts
          </Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>{receipt.id}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Download Receipt Button */}
          <button
            onClick={handleDownloadReceipt}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--color-surface-2)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            title="Download Goods Receipt Voucher for Stock Management"
          >
            <Download size={15} /> Download Receipt
          </button>

          {!isValidated && (
            <button
              onClick={handleValidate}
              disabled={isValidating}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--color-success)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: isValidating ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: isValidating ? 0.7 : 1 }}
            >
              {isValidating ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {isValidating ? 'Validating...' : 'Validate Receipt'}
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: isValidated ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${isValidated ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isValidated ? 'var(--color-success)' : 'var(--color-warning)' }}>
            <PackageOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-white)' }}>Receipt {receipt.id}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Supplier: {receipt.supplier} • PO: {receipt.poReference || 'N/A'}</div>
          </div>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: isValidated ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: isValidated ? 'var(--color-success)' : 'var(--color-warning)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
            {isValidated ? <CheckCircle size={12} /> : <Clock size={12} />}
            {isValidated ? 'Validated' : 'Pending Verification'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
          {[
            ['Supplier', receipt.supplier],
            ['PO Ref.', receipt.poReference || '—'],
            ['Destination', receipt.destinationLocation || receipt.zone],
            ['Total Items', receipt.items],
            ['Total Units', receipt.units],
            ['Scheduled Date', receipt.date],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Line Items Table */}
        {receipt.items_detail && receipt.items_detail.length > 0 && (
          <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)' }}>Line Items</h3>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-1)', borderBottom: '1px solid var(--color-border)' }}>
                    {['Product', 'SKU', 'Expected Qty', 'Received Qty', 'UOM'].map((h) => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {receipt.items_detail.map((it, idx) => (
                    <tr key={it.id || idx} style={{ borderBottom: idx < receipt.items_detail.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <td style={{ padding: '12px 14px', fontSize: 'var(--text-sm)', color: 'var(--color-white)', fontWeight: 500 }}>{it.product}</td>
                      <td style={{ padding: '12px 14px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{it.sku}</td>
                      <td style={{ padding: '12px 14px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{it.expected}</td>
                      <td style={{ padding: '12px 14px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-success)' }}>{it.received}</td>
                      <td style={{ padding: '12px 14px', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{it.uom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

