import React from 'react';

export function AdminSidebar({ currentTab }: { currentTab: string }) {
  const navItems = [
    { key: 'overview', label: '📊 Dashboard Overview', href: '/admin' },
    { key: 'products', label: '🛍️ Products & Catalogue', href: '/admin/products' },
    { key: 'inventory', label: '📦 Inventory Control', href: '/admin/inventory' },
    { key: 'orders', label: '🚚 Orders & Fulfilment', href: '/admin/orders' },
    { key: 'payments', label: '💳 Payment Records', href: '/admin/payments' },
    { key: 'announcements', label: '📢 Announcement Bar', href: '/admin/announcements' },
    { key: 'settings', label: '⚙️ Studio Settings', href: '/admin/settings' }
  ];

  return (
    <aside style={{ width: 250, background: '#fff', borderRight: '1px solid var(--border)', padding: 24, minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <span className="eyebrow">Studio Portal</span>
        <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 20, margin: '4px 0 0' }}>Tanavi Admin</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {navItems.map((item) => {
          const isActive = currentTab === item.key;
          return (
            <a
              key={item.key}
              href={item.href}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--soft)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--ink)',
                textDecoration: 'none'
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div style={{ marginTop: 60, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <a href="/" className="btn secondary full" style={{ fontSize: 12, padding: '8px 12px' }}>
          View Storefront ↗
        </a>
      </div>
    </aside>
  );
}
