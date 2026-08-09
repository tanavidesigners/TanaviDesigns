"use client";

import React, { useState } from 'react';
import { AdminSidebar } from '../../../../components/admin/admin-sidebar';
import { AdminHeader } from '../../../../components/admin/admin-header';

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    basePriceINR: '2450',
    fabric: 'Handloom Chanderi Silk',
    craft: 'Gota Patti Work & Hand Embroidery',
    occasion: 'Festive & Occasion Wear',
    description: 'Introducing our luxury handcrafted silhouette, woven from pure Chanderi silk with intricate gota patti borders and artisan hand embroidery.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85',
    status: 'active'
  });

  // Client-side image compression helper to avoid "Payload Too Large"
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas compression failed'));
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview thumbnail
    const localObjectUrl = URL.createObjectURL(file);
    setPreviewUrl(localObjectUrl);

    setUploading(true);
    setError('');

    try {
      // Compress file client-side if needed
      let uploadBlob: Blob = file;
      if (file.size > 1 * 1024 * 1024) {
        try {
          uploadBlob = await compressImage(file);
        } catch {
          uploadBlob = file;
        }
      }

      const uploadData = new FormData();
      uploadData.append('file', uploadBlob, file.name.replace(/\.[^/.]+$/, '.jpg'));

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData
      });

      if (res.status === 413) {
        throw new Error('Image size is too large. Please select an image under 10MB.');
      }

      const text = await res.text();
      let result: any = {};
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error('Upload failed: Image server returned invalid response');
      }

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

  const currentDisplayImage = previewUrl || formData.imageUrl;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg, #f7f4ee)' }}>
      <AdminSidebar currentTab="products" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Add New Designer Product" subtitle="Catalogue Control" />

        <main style={{ flex: 1, padding: 36, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, color: '#2b2420', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                Add New Designer Product
              </h1>
              <span style={{ fontSize: 13, color: '#796c62' }}>Publish new artisanal pieces directly to your storefront catalogue</span>
            </div>

            <a
              href="/admin/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                borderRadius: 10,
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                color: '#7c5e4a',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none'
              }}
            >
              ← Back to Products
            </a>
          </div>

          {error && (
            <div style={{ margin: '0 0 24px', background: '#fde8e8', color: '#9b1c1c', padding: '14px 20px', borderRadius: 12, fontSize: 13, border: '1px solid #f8b4b4' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
              {/* Left Column: Product Details Form */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e4ddd0',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}
              >
                <div className="field">
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>Product Title</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData({ ...formData, name, slug, sku: `TNV-${slug.slice(0, 8).toUpperCase()}-26` });
                    }}
                    placeholder="e.g. Meera Chanderi Anarkali Set"
                    style={{ padding: '12px 16px', fontSize: 14, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                  />
                </div>

                <div className="field-grid" style={{ marginTop: 16 }}>
                  <div className="field">
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>URL Slug</label>
                    <input
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      style={{ padding: '12px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#f7f4ee', width: '100%' }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>SKU Code</label>
                    <input
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      style={{ padding: '12px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="field-grid" style={{ marginTop: 16 }}>
                  <div className="field">
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>Base Price (INR ₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.basePriceINR}
                      onChange={(e) => setFormData({ ...formData, basePriceINR: e.target.value })}
                      style={{ padding: '12px 16px', fontSize: 14, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>Publish Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ padding: '12px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                    >
                      <option value="active">Active (Published)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="field-grid" style={{ marginTop: 16 }}>
                  <div className="field">
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>Fabric Composition</label>
                    <input
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="Handloom Chanderi Silk"
                      style={{ padding: '12px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>Craft & Technique</label>
                    <input
                      value={formData.craft}
                      onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
                      placeholder="Gota Patti Work & Hand Embroidery"
                      style={{ padding: '12px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420', marginBottom: 6, display: 'block' }}>Description & Garment Specs</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Handcrafted silhouette details..."
                    style={{ padding: '14px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%', lineHeight: 1.6 }}
                  />
                </div>
              </div>

              {/* Right Column: Image Upload Box & Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e4ddd0',
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}
                >
                  <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2b2420', marginBottom: 14, display: 'block' }}>
                    IMAGE UPLOAD
                  </label>

                  <div style={{ border: '2px dashed #e4ddd0', borderRadius: 14, padding: 16, textAlign: 'center', background: '#faf8f5' }}>
                    {currentDisplayImage ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <img
                          src={currentDisplayImage}
                          alt="Product Preview"
                          onError={(err) => {
                            // Fallback if image fails to load
                            (err.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80';
                          }}
                          style={{
                            width: '100%',
                            maxHeight: 280,
                            objectFit: 'cover',
                            borderRadius: 10,
                            border: '1px solid #e4ddd0'
                          }}
                        />
                        <span style={{ fontSize: 12, color: '#796c62', fontWeight: 500 }}>
                          ✓ Photo Loaded Preview
                        </span>
                      </div>
                    ) : (
                      <div style={{ padding: '40px 20px', color: '#796c62' }}>
                        <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📷</span>
                        <span style={{ fontSize: 13 }}>No photo selected yet</span>
                      </div>
                    )}

                    <div style={{ marginTop: 16 }}>
                      <label
                        style={{
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          width: '100%',
                          padding: '12px 18px',
                          borderRadius: 10,
                          background: '#7c5e4a',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: 13,
                          transition: 'background 0.2s'
                        }}
                      >
                        {uploading ? 'Compressing & Uploading…' : 'Browse File 📤'}
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 11, color: '#796c62', marginBottom: 4, display: 'block' }}>Direct Image URL</label>
                    <input
                      required
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        setPreviewUrl('');
                      }}
                      placeholder="https://..."
                      style={{ padding: '10px 14px', fontSize: 12, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                    />
                  </div>
                </div>

                <button
                  disabled={loading || uploading}
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
                    cursor: loading || uploading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(124, 94, 74, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? 'Publishing Product…' : 'PUBLISH PRODUCT'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
