import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f9f4f2', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
