import React from 'react';

export function AdminSidebar({ currentTab }: { currentTab: string }) {
  const navItems = [
    { key: 'overview', icon: '📊', label: 'Dashboard Overview', href: '/admin' },
    { key: 'products', icon: '🛍️', label: 'Products & Catalogue', href: '/admin/products' },
    { key: 'inventory', icon: '📦', label: 'Inventory Control', href: '/admin/inventory' },
    { key: 'orders', icon: '🚚', label: 'Orders & Fulfilment', href: '/admin/orders' },
    { key: 'payments', icon: '💳', label: 'Payment Records', href: '/admin/payments' },
    { key: 'announcements', icon: '📢', label: 'Announcement Bar', href: '/admin/announcements' },
    { key: 'settings', icon: '⚙️', label: 'Studio Settings', href: '/admin/settings' }
  ];

  return (
    <aside
      style={{
        width: 260,
        background: 'var(--admin-sidebar-bg, #f4efe6)',
        borderRight: '1px solid var(--admin-border, #e4ddd0)',
        padding: '28px 20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ marginBottom: 36, paddingLeft: 6 }}>
          <span
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--admin-accent, #7c5e4a)',
              fontWeight: 700,
              display: 'block'
            }}
          >
            Studio Portal
          </span>
          <h2
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 22,
              margin: '4px 0 0',
              color: 'var(--admin-ink, #2b2420)',
              fontWeight: 500
            }}
          >
            Tanavi Admin
          </h2>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <a
                key={item.key}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? 'var(--admin-accent, #7c5e4a)' : 'var(--admin-ink, #2b2420)',
                  textDecoration: 'none',
                  border: isActive ? '1px solid var(--admin-border, #e4ddd0)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer Storefront Link */}
      <div style={{ paddingTop: 24, borderTop: '1px solid var(--admin-border, #e4ddd0)' }}>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            background: '#ffffff',
            color: 'var(--admin-accent, #7c5e4a)',
            border: '1px solid var(--admin-border, #e4ddd0)',
            textDecoration: 'none'
          }}
        >
          View Storefront ↗
        </a>
      </div>
    </aside>
  );
}
