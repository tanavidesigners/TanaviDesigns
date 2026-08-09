"use client";

import React from 'react';

export function AdminHeader({
  title = 'Studio Management',
  subtitle = 'Tanavi Admin Portal'
}: {
  title?: string;
  subtitle?: string;
}) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network error on logout
    }
    window.location.href = '/admin/login';
  };

  return (
    <header
      style={{
        height: 68,
        background: '#ffffff',
        borderBottom: '1px solid var(--admin-border, #e4ddd0)',
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <div>
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--admin-muted, #796c62)',
            fontWeight: 600
          }}
        >
          {subtitle}
        </span>
        <h3
          style={{
            margin: 0,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 18,
            color: 'var(--admin-ink, #2b2420)',
            fontWeight: 500
          }}
        >
          {title}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#f7f4ee',
            border: '1px solid var(--admin-border, #e4ddd0)',
            borderRadius: 999,
            padding: '8px 16px',
            width: 260
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--admin-muted, #796c62)' }}>⌕</span>
          <input
            placeholder="Search products, SKUs, orders..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: 12,
              color: 'var(--admin-ink, #2b2420)'
            }}
          />
        </div>

        {/* Admin Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Admin Profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--admin-border, #e4ddd0)'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-ink, #2b2420)', lineHeight: 1.2 }}>
                Deepika Devineni
              </span>
              <span style={{ fontSize: 11, color: 'var(--admin-muted, #796c62)' }}>Studio Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: '#faf8f5',
              border: '1px solid var(--admin-border, #e4ddd0)',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              color: '#c53030',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
            title="Sign out of Studio Admin"
          >
            Logout 🚪
          </button>
        </div>
      </div>
    </header>
  );
}
