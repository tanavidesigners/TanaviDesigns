"use client";

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { AdminHeader } from '../../../components/admin/admin-header';

interface Announcement {
  id: string;
  message: string;
  link_url?: string | null;
  active: boolean;
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('Complimentary shipping across India on orders above ₹2,999 • Small-batch Indian craftsmanship');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [active, setActive] = useState(true);

  // Load announcements from API
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      if (data.announcements) {
        setAnnouncements(data.announcements);
        const activeOne = data.announcements.find((a: Announcement) => a.active);
        if (activeOne) {
          setEditingId(activeOne.id);
          setMessage(activeOne.message);
          setLinkUrl(activeOne.link_url || '');
          setActive(activeOne.active);
        }
      }
    } catch (err: any) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          message,
          link_url: linkUrl,
          active
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save announcement bar');
      }

      setSuccess('✨ Announcement Bar updated successfully!');
      loadAnnouncements();
    } catch (err: any) {
      setError(err.message || 'Failed to save announcement bar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: announcement.id,
          message: announcement.message,
          link_url: announcement.link_url,
          active: !announcement.active
        })
      });

      if (res.ok) {
        loadAnnouncements();
      }
    } catch {
      alert('Failed to toggle announcement status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement message?')) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (editingId === id) {
          setEditingId(null);
          setMessage('');
          setLinkUrl('');
        }
        loadAnnouncements();
      }
    } catch {
      alert('Failed to delete announcement');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg, #f7f4ee)' }}>
      <AdminSidebar currentTab="announcements" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Announcement Bar Control" subtitle="Storefront Merchandising" />

        <main style={{ flex: 1, padding: 36, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, color: '#2b2420', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Announcement Bar Control
            </h1>
            <span style={{ fontSize: 13, color: '#796c62' }}>
              Configure the top alert banner message rendered across all public storefront pages
            </span>
          </div>

          {error && (
            <div style={{ margin: '0 0 24px', background: '#fde8e8', color: '#9b1c1c', padding: '14px 20px', borderRadius: 12, fontSize: 13, border: '1px solid #f8b4b4' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ margin: '0 0 24px', background: '#edf7ed', color: '#1e4620', padding: '14px 20px', borderRadius: 12, fontSize: 13, border: '1px solid #b7dfb9' }}>
              {success}
            </div>
          )}

          {/* Announcement Bar Form Configurator */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4ddd0',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              marginBottom: 32
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#2b2420' }}>
              📢 Configure Active Storefront Banner Message
            </h3>

            {/* Live Storefront Banner Preview */}
            <div
              style={{
                background: '#7c5e4a',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: 12,
                textAlign: 'center',
                letterSpacing: '0.05em',
                marginBottom: 24,
                fontWeight: 600
              }}
            >
              STOREFRONT BANNER PREVIEW: {message || 'Your announcement message will appear here'}
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>
                  Banner Message Text <span style={{ color: '#c53030' }}>*</span>
                </label>
                <input
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Complimentary shipping across India on orders above ₹2,999"
                  style={{
                    padding: '12px 16px',
                    fontSize: 14,
                    borderRadius: 10,
                    border: '1px solid #e4ddd0',
                    background: '#ffffff',
                    width: '100%'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>
                    Clickable Destination Link (Optional)
                  </label>
                  <input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="e.g. /shop or /collections/kurta-sets"
                    style={{
                      padding: '12px 16px',
                      fontSize: 13,
                      borderRadius: 10,
                      border: '1px solid #e4ddd0',
                      background: '#ffffff',
                      width: '100%'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>
                    Banner Visibility Status
                  </label>
                  <select
                    value={active ? 'active' : 'inactive'}
                    onChange={(e) => setActive(e.target.value === 'active')}
                    style={{
                      padding: '12px 16px',
                      fontSize: 13,
                      borderRadius: 10,
                      border: '1px solid #e4ddd0',
                      background: '#ffffff',
                      width: '100%'
                    }}
                  >
                    <option value="active">🟢 Active (Visible on Storefront)</option>
                    <option value="inactive">🔴 Hidden (Disabled)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '14px 28px',
                    borderRadius: 10,
                    background: '#7c5e4a',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(124, 94, 74, 0.25)'
                  }}
                >
                  {saving ? 'Saving Banner…' : 'SAVE ANNOUNCEMENT BANNER'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setMessage('');
                      setLinkUrl('');
                      setActive(true);
                    }}
                    style={{
                      padding: '14px 20px',
                      borderRadius: 10,
                      background: '#ffffff',
                      border: '1px solid #e4ddd0',
                      color: '#796c62',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Create New Banner
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Announcement History Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4ddd0',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
          >
            <h4 style={{ margin: '0 0 16px', fontSize: 15, color: '#2b2420' }}>
              All Configured Announcements ({announcements.length})
            </h4>

            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#796c62' }}>Loading announcements…</div>
            ) : announcements.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e4ddd0', textAlign: 'left', color: '#796c62', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: 12 }}>Message Text</th>
                      <th style={{ padding: 12 }}>Link URL</th>
                      <th style={{ padding: 12 }}>Status</th>
                      <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((anc) => (
                      <tr key={anc.id} style={{ borderBottom: '1px solid #f0eafe' }}>
                        <td style={{ padding: 12, fontWeight: 600, color: '#2b2420' }}>{anc.message}</td>
                        <td style={{ padding: 12, color: '#796c62' }}>{anc.link_url || 'None'}</td>
                        <td style={{ padding: 12 }}>
                          <button
                            onClick={() => handleToggleActive(anc)}
                            style={{
                              border: 'none',
                              borderRadius: 20,
                              padding: '4px 12px',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: anc.active ? '#e6f4ea' : '#fce8e8',
                              color: anc.active ? '#137333' : '#c53030'
                            }}
                          >
                            {anc.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}
                          </button>
                        </td>
                        <td style={{ padding: 12, textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setEditingId(anc.id);
                              setMessage(anc.message);
                              setLinkUrl(anc.link_url || '');
                              setActive(anc.active);
                            }}
                            style={{
                              marginRight: 10,
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: '1px solid #e4ddd0',
                              background: '#ffffff',
                              color: '#7c5e4a',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Edit ✏️
                          </button>

                          <button
                            onClick={() => handleDelete(anc.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: '1px solid #f8b4b4',
                              background: '#fde8e8',
                              color: '#c53030',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Delete 🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#796c62' }}>
                No announcements configured yet. Use the form above to add your first storefront announcement.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
