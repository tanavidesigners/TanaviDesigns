"use client";

import React, { useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@tanavidesigns.com');
  const [password, setPassword] = useState('TanaviAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f4ee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: '100%',
          background: '#ffffff',
          border: '1px solid #e4ddd0',
          borderRadius: 20,
          padding: 40,
          boxShadow: '0 12px 40px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#796c62', fontWeight: 600 }}>
            STUDIO MANAGEMENT PORTAL
          </span>
          <h1
            style={{
              margin: '8px 0 4px',
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 26,
              color: '#2b2420',
              letterSpacing: '0.04em'
            }}
          >
            TANAVI BY DEEPIKA
          </h1>
          <span style={{ fontSize: 13, color: '#796c62' }}>Please sign in to access Studio Admin</span>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 20,
              background: '#fde8e8',
              color: '#9b1c1c',
              padding: '12px 16px',
              borderRadius: 10,
              fontSize: 13,
              border: '1px solid #f8b4b4'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6 }}>
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tanavidesigns.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid #e4ddd0',
                fontSize: 14,
                background: '#ffffff'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid #e4ddd0',
                fontSize: 14,
                background: '#ffffff'
              }}
            />
          </div>

          <button
            disabled={loading}
            style={{
              marginTop: 10,
              width: '100%',
              padding: '14px 20px',
              borderRadius: 10,
              background: '#7c5e4a',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(124, 94, 74, 0.25)',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Authenticating…' : 'SIGN IN TO STUDIO ADMIN'}
          </button>
        </form>

        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid #f0eafe',
            fontSize: 12,
            color: '#796c62',
            background: '#faf8f5',
            padding: 16,
            borderRadius: 10,
            lineHeight: 1.6
          }}
        >
          <strong style={{ color: '#2b2420', display: 'block', marginBottom: 4 }}>🔑 Studio Access Credentials:</strong>
          👑 Admin: <code>admin@tanavidesigns.com</code> / <code>TanaviAdmin2026!</code>
        </div>
      </div>
    </div>
  );
}
