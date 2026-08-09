"use client";

import React, { useState } from 'react';
import { AdminSidebar } from '../../../../components/admin/admin-sidebar';

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    basePriceINR: '2450',
    fabric: 'Cotton',
    craft: 'Hand-Block Printing',
    occasion: 'Everyday',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85',
    status: 'active'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      window.location.href = '/admin/products';
    } catch (err: any) {
      setError(err.message || 'Product creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="products" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Catalogue Control</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Add New Designer Product</h1>
          </div>
          <a className="btn secondary" href="/admin/products">
            ← Back to Products
          </a>
        </div>

        {error && (
          <div style={{ maxWidth: 720, margin: '20px 0', background: '#fde8e8', color: '#9b1c1c', padding: '12px 18px', borderRadius: 10 }}>
            {error}
          </div>
        )}

        <form className="admin-card" style={{ marginTop: 24, maxWidth: 720, padding: 32 }} onSubmit={handleSubmit}>
          <div className="field">
            <label>Product Title</label>
            <input
              required
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                setFormData({ ...formData, name, slug, sku: `TNV-${slug.slice(0, 8).toUpperCase()}-26` });
              }}
              placeholder="e.g. Meera Chanderi Anarkali Set"
            />
          </div>

          <div className="field-grid">
            <div className="field">
              <label>URL Slug</label>
              <input required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div className="field">
              <label>SKU Code</label>
              <input required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
            </div>
          </div>

          <div className="field-grid">
            <div className="field">
              <label>Base Price (INR ₹)</label>
              <input type="number" required value={formData.basePriceINR} onChange={(e) => setFormData({ ...formData, basePriceINR: e.target.value })} />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active (Published)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="field-grid">
            <div className="field">
              <label>Fabric</label>
              <input value={formData.fabric} onChange={(e) => setFormData({ ...formData, fabric: e.target.value })} placeholder="100% Breathable Cotton" />
            </div>
            <div className="field">
              <label>Craft / Technique</label>
              <input value={formData.craft} onChange={(e) => setFormData({ ...formData, craft: e.target.value })} placeholder="Hand-Block Printing" />
            </div>
          </div>

          {/* Product Image Section: File Upload & URL Input */}
          <div className="field" style={{ background: '#faf6f4', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
            <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: 'block' }}>Product Photo</label>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <label
                className="btn secondary"
                style={{
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  padding: '10px 18px',
                  background: '#fff',
                  border: '1px solid var(--border)'
                }}
              >
                {uploading ? 'Uploading Photo…' : '📁 Upload Image File from Device'}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>

              <span style={{ fontSize: 12, color: 'var(--muted)' }}>or paste URL below</span>
            </div>

            <div style={{ marginTop: 12 }}>
              <input
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                style={{ fontSize: 13, background: '#fff' }}
              />
            </div>

            {/* Thumbnail Preview */}
            {formData.imageUrl && (
              <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                <img
                  src={formData.imageUrl}
                  alt="Product Preview"
                  style={{ width: 70, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                />
                <span style={{ fontSize: 12, color: '#137333', fontWeight: 500 }}>✓ Image Preview Loaded</span>
              </div>
            )}
          </div>

          <div className="field">
            <label>Description & Garment Details</label>
            <textarea rows={4} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Handcrafted silhouette details..." />
          </div>

          <button className="btn full" disabled={loading || uploading} style={{ marginTop: 16 }}>
            {loading ? 'Publishing Product…' : 'Publish Product to Store'}
          </button>
        </form>
      </main>
    </div>
  );
}
