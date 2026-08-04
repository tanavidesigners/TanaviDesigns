"use client";

import React, { useState } from 'react';

export function AdminOrderStatusControls({
  orderId,
  currentStatus
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      if (res.ok) {
        setStatus(newStatus);
      }
    } catch {
      setStatus(newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const statuses = [
    'pending_payment',
    'paid',
    'processing',
    'packed',
    'shipped',
    'delivered',
    'cancelled'
  ];

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
      <select
        value={status}
        disabled={updating}
        onChange={(e) => handleStatusChange(e.target.value)}
        style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#fff' }}
      >
        {statuses.map((st) => (
          <option value={st} key={st}>
            {st.toUpperCase().replace('_', ' ')}
          </option>
        ))}
      </select>
      {updating && <span style={{ fontSize: 12, color: 'var(--muted)' }}>Updating order status…</span>}
    </div>
  );
}
