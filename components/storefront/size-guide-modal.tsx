"use client";

import React from 'react';

export function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        className="admin-card"
        style={{ width: '100%', maxWidth: 640, background: '#fff', padding: 32, position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            border: 0,
            background: 'none',
            fontSize: 24,
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <span className="eyebrow">Tanavi Garment Fit</span>
        <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, margin: '8px 0 16px' }}>
          Standard Size Guide
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          Our silhouettes are designed for ease and modest comfort. All measurements below reflect body measurements in inches.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textIndent: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 8px' }}>Size</th>
                <th style={{ padding: '10px 8px' }}>Bust (in)</th>
                <th style={{ padding: '10px 8px' }}>Waist (in)</th>
                <th style={{ padding: '10px 8px' }}>Hip (in)</th>
                <th style={{ padding: '10px 8px' }}>Kurta Length (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>XS</td>
                <td style={{ padding: '10px 8px' }}>32"</td>
                <td style={{ padding: '10px 8px' }}>26"</td>
                <td style={{ padding: '10px 8px' }}>36"</td>
                <td style={{ padding: '10px 8px' }}>44"</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>S</td>
                <td style={{ padding: '10px 8px' }}>34"</td>
                <td style={{ padding: '10px 8px' }}>28"</td>
                <td style={{ padding: '10px 8px' }}>38"</td>
                <td style={{ padding: '10px 8px' }}>45"</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>M</td>
                <td style={{ padding: '10px 8px' }}>36"</td>
                <td style={{ padding: '10px 8px' }}>30"</td>
                <td style={{ padding: '10px 8px' }}>40"</td>
                <td style={{ padding: '10px 8px' }}>45"</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>L</td>
                <td style={{ padding: '10px 8px' }}>38"</td>
                <td style={{ padding: '10px 8px' }}>32"</td>
                <td style={{ padding: '10px 8px' }}>42"</td>
                <td style={{ padding: '10px 8px' }}>46"</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>XL</td>
                <td style={{ padding: '10px 8px' }}>40"</td>
                <td style={{ padding: '10px 8px' }}>34"</td>
                <td style={{ padding: '10px 8px' }}>44"</td>
                <td style={{ padding: '10px 8px' }}>46"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', background: 'var(--soft)', padding: 14, borderRadius: 10 }}>
          <strong>Custom Fitting:</strong> Need custom sizing or sleeve length adjustments? Chat directly with Deepika on WhatsApp for bespoke orders.
        </div>
      </div>
    </div>
  );
}
