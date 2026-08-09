"use client";

import React, { useState } from 'react';

export function PDPGallery({
  images,
  productName
}: {
  images: string[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[selectedIndex] || images[0] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85';

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* Thumbnail Bar (if multiple images) */}
      {images.length > 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 80 }}>
          {images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                border: selectedIndex === idx ? '2px solid #7c5e4a' : '1px solid #e4ddd0',
                borderRadius: 8,
                overflow: 'hidden',
                padding: 0,
                background: '#ffffff',
                cursor: 'pointer',
                opacity: selectedIndex === idx ? 1 : 0.65,
                transition: 'all 0.2s'
              }}
            >
              <img
                src={imgUrl}
                alt={`${productName} thumbnail ${idx + 1}`}
                style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image View */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          onClick={() => setLightboxOpen(true)}
          style={{
            cursor: 'zoom-in',
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid #e4ddd0',
            background: '#faf8f5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <img
            src={currentImage}
            alt={productName}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 680,
              objectFit: 'cover',
              display: 'block'
            }}
          />

          <span
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#2b2420',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              border: '1px solid #e4ddd0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            🔍 Click to Enlarge
          </span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(20, 16, 14, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: 44,
              height: 44,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#2b2420',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              zIndex: 10000
            }}
          >
            ✕
          </button>

          {/* Previous Arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              style={{
                position: 'absolute',
                left: 24,
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                fontSize: 22,
                color: '#2b2420',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                zIndex: 10000
              }}
            >
              ‹
            </button>
          )}

          {/* Lightbox Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
            }}
          >
            <img
              src={currentImage}
              alt={`${productName} full view`}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          {/* Next Arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{
                position: 'absolute',
                right: 24,
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                fontSize: 22,
                color: '#2b2420',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                zIndex: 10000
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
