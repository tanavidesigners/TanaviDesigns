"use client";

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../../components/admin/admin-sidebar';
import { AdminHeader } from '../../../../components/admin/admin-header';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Configurable Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    categoryId: '',
    basePriceINR: '2450',
    fabric: 'Handloom Chanderi Silk',
    craft: 'Gota Patti Work & Hand Embroidery',
    occasion: 'Festive & Occasion Wear',
    description: 'Introducing our luxury handcrafted silhouette, woven from pure Chanderi silk with intricate gota patti borders and artisan hand embroidery.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85',
    status: 'active',
    // Required Size Stock Configuration
    stockS: '',
    stockM: '',
    stockL: '',
    stockXS: '0',
    stockXL: '0',
    stockXXL: '0'
  });

  // Fetch categories from DB on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0 && !formData.categoryId) {
            // Default to Kurta Sets if available
            const defaultCat = data.categories.find((c: Category) => c.slug.includes('kurta')) || data.categories[0];
            setFormData((prev) => ({ ...prev, categoryId: defaultCat.id }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Handle inline creation of new Configurable Category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      setCategories((prev) => [...prev, data.category]);
      setFormData((prev) => ({ ...prev, categoryId: data.category.id }));
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  // Calculate live total stock
  const totalStock =
    (parseInt(formData.stockS) || 0) +
    (parseInt(formData.stockM) || 0) +
    (parseInt(formData.stockL) || 0) +
    (parseInt(formData.stockXS) || 0) +
    (parseInt(formData.stockXL) || 0) +
    (parseInt(formData.stockXXL) || 0);

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
        body: JSON.stringify({
          ...formData,
          totalStock
        })
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e4ddd0',
                    borderRadius: 16,
                    padding: 32,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}
                >
                  <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#2b2420' }}>
                    1. General Product Details
                  </h3>

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

                  {/* Configurable Category Dropdown Section */}
                  <div className="field" style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#2b2420' }}>Garment Category (Dropdown)</label>
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#7c5e4a',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {showAddCategory ? '✕ Cancel' : '+ Add New Category'}
                      </button>
                    </div>

                    {showAddCategory && (
                      <div style={{ background: '#faf8f5', border: '1px solid #e4ddd0', borderRadius: 10, padding: 14, marginBottom: 12, display: 'flex', gap: 10 }}>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="New category name (e.g. Anarkali Sets)"
                          style={{ flex: 1, padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff' }}
                        />
                        <button
                          type="button"
                          disabled={creatingCategory}
                          onClick={handleCreateCategory}
                          style={{
                            padding: '8px 16px',
                            background: '#7c5e4a',
                            color: '#ffffff',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {creatingCategory ? 'Saving…' : 'Save Category'}
                        </button>
                      </div>
                    )}

                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      style={{ padding: '12px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                    >
                      <option value="">Select Category...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-grid" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

                  <div className="field-grid" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

                  <div className="field-grid" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Handcrafted silhouette details..."
                      style={{ padding: '14px 16px', fontSize: 13, borderRadius: 10, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%', lineHeight: 1.6 }}
                    />
                  </div>
                </div>

                {/* Size Stock Inventory Configuration Box (Required S, M, L) */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e4ddd0',
                    borderRadius: 16,
                    padding: 32,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#2b2420' }}>
                        2. Size Inventory Quantities (Required S / M / L)
                      </h3>
                      <span style={{ fontSize: 12, color: '#796c62' }}>Specify initial stock available for each garment size</span>
                    </div>

                    <div style={{ background: '#faf8f5', border: '1px solid #e4ddd0', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, color: '#7c5e4a' }}>
                      📦 Total Stock: {totalStock} items
                    </div>
                  </div>

                  {/* Required Sizes: S, M, L */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="field" style={{ background: '#faf8f5', padding: 14, borderRadius: 12, border: '1px solid #e4ddd0' }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#7c5e4a', marginBottom: 4, display: 'block' }}>
                        Size S Quantity <span style={{ color: '#c53030' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.stockS}
                        onChange={(e) => setFormData({ ...formData, stockS: e.target.value })}
                        placeholder="e.g. 5"
                        style={{ padding: '10px 14px', fontSize: 14, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%', fontWeight: 700 }}
                      />
                    </div>

                    <div className="field" style={{ background: '#faf8f5', padding: 14, borderRadius: 12, border: '1px solid #e4ddd0' }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#7c5e4a', marginBottom: 4, display: 'block' }}>
                        Size M Quantity <span style={{ color: '#c53030' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.stockM}
                        onChange={(e) => setFormData({ ...formData, stockM: e.target.value })}
                        placeholder="e.g. 5"
                        style={{ padding: '10px 14px', fontSize: 14, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%', fontWeight: 700 }}
                      />
                    </div>

                    <div className="field" style={{ background: '#faf8f5', padding: 14, borderRadius: 12, border: '1px solid #e4ddd0' }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#7c5e4a', marginBottom: 4, display: 'block' }}>
                        Size L Quantity <span style={{ color: '#c53030' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.stockL}
                        onChange={(e) => setFormData({ ...formData, stockL: e.target.value })}
                        placeholder="e.g. 5"
                        style={{ padding: '10px 14px', fontSize: 14, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%', fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  {/* Optional Extended Sizes: XS, XL, XXL */}
                  <details style={{ fontSize: 12, color: '#796c62', cursor: 'pointer' }}>
                    <summary style={{ fontWeight: 600, color: '#7c5e4a', marginBottom: 12 }}>+ Additional Sizes (XS, XL, XXL)</summary>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, paddingTop: 8 }}>
                      <div className="field">
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#2b2420', marginBottom: 4, display: 'block' }}>Size XS Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stockXS}
                          onChange={(e) => setFormData({ ...formData, stockXS: e.target.value })}
                          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                        />
                      </div>
                      <div className="field">
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#2b2420', marginBottom: 4, display: 'block' }}>Size XL Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stockXL}
                          onChange={(e) => setFormData({ ...formData, stockXL: e.target.value })}
                          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                        />
                      </div>
                      <div className="field">
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#2b2420', marginBottom: 4, display: 'block' }}>Size XXL Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stockXXL}
                          onChange={(e) => setFormData({ ...formData, stockXXL: e.target.value })}
                          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1px solid #e4ddd0', background: '#ffffff', width: '100%' }}
                        />
                      </div>
                    </div>
                  </details>
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
                  {loading ? 'Publishing Product…' : `PUBLISH PRODUCT (${totalStock} ITEMS IN STOCK)`}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
