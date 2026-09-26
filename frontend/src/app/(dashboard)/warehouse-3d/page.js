'use client';

import { useEffect, useRef } from 'react';
import { Box } from 'lucide-react';

// ── Simple deterministic 3D warehouse rack visualizer using Canvas ──────────

const ZONES = [
  { id: 'A', label: 'Zone A', racks: 4, color: '#10b981', occupancy: 0.82 },
  { id: 'B', label: 'Zone B', racks: 6, color: '#6366f1', occupancy: 0.55 },
  { id: 'C', label: 'Zone C', racks: 4, color: '#f59e0b', occupancy: 0.93 },
  { id: 'D', label: 'Zone D', racks: 5, color: '#8b8b8b', occupancy: 0.34 },
];

function drawIsometricBox(ctx, x, y, w, h, d, colors) {
  // Top face
  ctx.beginPath();
  ctx.moveTo(x, y - d);
  ctx.lineTo(x + w, y - d - w * 0.5);
  ctx.lineTo(x + w, y - w * 0.5);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = colors.top;
  ctx.fill();

  // Left face
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - d);
  ctx.lineTo(x - w * 0.5, y - d + w * 0.25);
  ctx.lineTo(x - w * 0.5, y + w * 0.25);
  ctx.closePath();
  ctx.fillStyle = colors.left;
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + w, y - w * 0.5);
  ctx.lineTo(x + w, y - d - w * 0.5);
  ctx.lineTo(x + w * 1.5, y - d - w * 0.25);
  ctx.lineTo(x + w * 1.5, y - w * 0.25);
  ctx.closePath();
  ctx.fillStyle = colors.right;
  ctx.fill();
}

function getHeatColor(occupancy) {
  if (occupancy > 0.85) return { top: '#ef444440', left: '#ef444428', right: '#ef444420' };
  if (occupancy > 0.6) return { top: '#f59e0b40', left: '#f59e0b28', right: '#f59e0b20' };
  return { top: '#10b98130', left: '#10b98120', right: '#10b98118' };
}

export default function Warehouse3DPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let i = 0; i < H; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
    }

    // Floor
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(60, H - 120, W - 120, 80);

    // Draw zone racks
    let offsetX = 100;
    ZONES.forEach((zone) => {
      const heat = getHeatColor(zone.occupancy);

      // Zone label
      ctx.fillStyle = zone.color;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(zone.label, offsetX, H - 30);

      for (let r = 0; r < zone.racks; r++) {
        const rx = offsetX + r * 46;
        const ry = H - 70;
        const rackH = 90 + Math.random() * 20;

        // Draw shelf boxes
        for (let shelf = 0; shelf < 3; shelf++) {
          const sy = ry - shelf * 32;
          const filled = Math.random() < zone.occupancy;
          drawIsometricBox(ctx, rx, sy, 30, 28, filled ? 28 : 10, filled ? heat : {
            top: 'rgba(30,30,30,0.6)', left: 'rgba(20,20,20,0.6)', right: 'rgba(15,15,15,0.6)'
          });
        }
        // Rack frame
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(rx - 2, ry - 90, 32, 92);
      }
      offsetX += zone.racks * 46 + 40;
    });

    // Legend
    const legendItems = [
      { color: '#10b981', label: '< 60% Occupied' },
      { color: '#f59e0b', label: '60–85% Occupied' },
      { color: '#ef4444', label: '> 85% Occupied' },
    ];
    legendItems.forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(W - 180, 30 + i * 24, 12, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(item.label, W - 163, 41 + i * 24);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', animation: 'fadeIn 0.4s var(--ease-out)' }}>
      {/* Header */}
      <section style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #6366f1, transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
            <Box size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: 'var(--tracking-tight)' }}>3D Digital Twin</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Interactive isometric warehouse layout with occupancy heatmap.</p>
          </div>
        </div>
      </section>

      {/* Zone summary cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
        {ZONES.map((zone) => (
          <div key={zone.id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', borderTop: `2px solid ${zone.color}` }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', fontWeight: 600, marginBottom: 8 }}>{zone.label}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: zone.color }}>{Math.round(zone.occupancy * 100)}%</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{zone.racks} racks</div>
            {/* Mini progress bar */}
            <div style={{ height: 3, background: 'var(--color-surface-2)', borderRadius: 2, marginTop: 10 }}>
              <div style={{ height: '100%', width: `${zone.occupancy * 100}%`, background: zone.color, borderRadius: 2, transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
      </section>

      {/* Canvas viewer */}
      <section style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', overflow: 'hidden' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 'var(--space-4)' }}>
          Warehouse Layout — Isometric View
        </div>
        <canvas
          ref={canvasRef}
          width={900}
          height={380}
          style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-elevated)', display: 'block' }}
        />
      </section>
    </div>
  );
}
