"use client";

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { AdminHeader } from '../../../components/admin/admin-header';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState({
    admin_work_mobile: '919482245679',
    admin_email: 'tanavidesigns@gmail.com',
    whatsapp_number: '919482245679',
    cod_enabled: true,
    pay_later_enabled: true,
    storefront_domain: 'tanavidesigns.com'
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.config) {
        setConfig((prev) => ({ ...prev, ...data.config }));
      }
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg, #f7f4ee)' }}>
      <AdminSidebar currentTab="settings" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Studio Settings & Config" subtitle="Admin Configuration" />

        <main style={{ flex: 1, padding: 36, maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, color: '#2b2420', letterSpacing: '-0.01em' }}>
                Studio Settings & Configuration
              </h1>
              <span style={{ fontSize: 13, color: '#796c62' }}>Configure WhatsApp work mobile, payment options, and admin notifications</span>
            </div>
          </div>

          {saved && (
            <div style={{ margin: '0 0 24px', background: '#e6f4ea', color: '#137333', padding: '14px 20px', borderRadius: 12, fontSize: 13, border: '1px solid #b7e1cd', fontWeight: 600 }}>
              ✓ Studio settings saved successfully to Supabase Database!
            </div>
          )}

          {error && (
            <div style={{ margin: '0 0 24px', background: '#fde8e8', color: '#9b1c1c', padding: '14px 20px', borderRadius: 12, fontSize: 13, border: '1px solid #f8b4b4' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* WhatsApp & Admin Work Mobile Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2b2420' }}>
                📱 WhatsApp & Work Mobile Notifications
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#796c62', lineHeight: 1.5 }}>
                Order alerts and customer enquiries will be routed directly to this Admin Work Mobile number.
              </p>

              <div className="field-grid">
                <div className="field">
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>
                    Admin / Work Mobile WhatsApp Number
                  </label>
                  <input
                    required
                    value={config.admin_work_mobile}
                    onChange={(e) => setFormData('admin_work_mobile', e.target.value)}
                    placeholder="919482245679"
                    style={{ padding: '12px 16px', fontSize: 14, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                  />
                  <span style={{ fontSize: 11, color: '#796c62', marginTop: 4 }}>Include country code without + sign (e.g. 919482245679)</span>
                </div>

                <div className="field">
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>
                    Studio Notification Email
                  </label>
                  <input
                    type="email"
                    required
                    value={config.admin_email}
                    onChange={(e) => setFormData('admin_email', e.target.value)}
                    placeholder="tanavidesigns@gmail.com"
                    style={{ padding: '12px 16px', fontSize: 14, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods Configuration Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2b2420' }}>
                💳 Payment Method Controls
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#796c62', lineHeight: 1.5 }}>
                Enable or disable Cash on Delivery and Pay Later options on customer checkout.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Razorpay Online */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#faf8f5', borderRadius: 12, border: '1px solid #e4ddd0' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#2b2420', fontSize: 14 }}>1. Online Payment (Razorpay Standard)</strong>
                    <span style={{ fontSize: 12, color: '#796c62' }}>UPI, Credit/Debit Cards, Netbanking & Wallets</span>
                  </div>
                  <span style={{ background: '#e6f4ea', color: '#137333', padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    ACTIVE & LIVE
                  </span>
                </div>

                {/* Cash on Delivery (COD) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#ffffff', borderRadius: 12, border: '1px solid #e4ddd0' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#2b2420', fontSize: 14 }}>2. Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: 12, color: '#796c62' }}>Allow customers to pay cash upon doorstep package delivery</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.cod_enabled}
                      onChange={(e) => setConfig({ ...config, cod_enabled: e.target.checked })}
                      style={{ width: 20, height: 20, accentColor: '#7c5e4a' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: config.cod_enabled ? '#137333' : '#c5221f' }}>
                      {config.cod_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Pay Later */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#ffffff', borderRadius: 12, border: '1px solid #e4ddd0' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#2b2420', fontSize: 14 }}>3. Pay Later (Studio Reserve)</strong>
                    <span style={{ fontSize: 12, color: '#796c62' }}>Reserve items for 48h; customer pays upon delivery or collection</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.pay_later_enabled}
                      onChange={(e) => setConfig({ ...config, pay_later_enabled: e.target.checked })}
                      style={{ width: 20, height: 20, accentColor: '#7c5e4a' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: config.pay_later_enabled ? '#137333' : '#c5221f' }}>
                      {config.pay_later_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                background: '#7c5e4a',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(124, 94, 74, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Saving Studio Configuration…' : 'SAVE STUDIO CONFIGURATION'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );

  function setFormData(key: string, val: any) {
    setConfig((prev) => ({ ...prev, [key]: val }));
  }
}
