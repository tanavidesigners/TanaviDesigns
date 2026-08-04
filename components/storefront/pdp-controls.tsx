"use client";

import React, { useState } from 'react';
import type { Product, ProductVariant } from '../../lib/types/database';
import { formatMoney } from '../../lib/services/catalog-service';
import { buildProductWhatsAppUrl } from '../../lib/services/whatsapp-service';
import { SizeGuideModal } from './size-guide-modal';

export function PDPInteractiveControls({ product }: { product: Product }) {
  const activeVariants = product.variants?.filter((v) => v.active) || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(activeVariants[0]?.id || '');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId) || activeVariants[0];

  const currentPrice = selectedVariant?.price_override || product.base_price;
  const currentPriceFormatted = formatMoney(currentPrice);

  const availableStock = (selectedVariant?.inventory?.quantity_on_hand || 0) - (selectedVariant?.inventory?.quantity_reserved || 0);
  const isOutOfStock = availableStock <= 0;

  const whatsappUrl = buildProductWhatsAppUrl({
    productName: product.name,
    sku: selectedVariant?.sku || product.sku,
    size: selectedVariant?.size,
    colour: selectedVariant?.colour_name,
    priceFormatted: currentPriceFormatted
  });

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    try {
      const existingCartRaw = localStorage.getItem('tanavi_cart') || '[]';
      const existingCart = JSON.parse(existingCartRaw);

      const idx = existingCart.findIndex((item: any) => item.variantId === selectedVariant.id);
      if (idx >= 0) {
        existingCart[idx].quantity += 1;
      } else {
        existingCart.push({
          variantId: selectedVariant.id,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          sku: selectedVariant.sku,
          size: selectedVariant.size,
          colour: selectedVariant.colour_name,
          pricePaise: currentPrice,
          imageUrl: product.images?.[0]?.storage_path,
          quantity: 1
        });
      }

      localStorage.setItem('tanavi_cart', JSON.stringify(existingCart));
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="detail-price">
        <span style={{ fontSize: 24, fontWeight: 600 }}>{currentPriceFormatted}</span>
        {product.compare_at_price && (
          <span style={{ textDecoration: 'line-through', color: 'var(--muted)', marginLeft: 12, fontSize: 16 }}>
            {formatMoney(product.compare_at_price)}
          </span>
        )}
        <div className="tax">Inclusive of all taxes</div>
      </div>

      <p className="detail-copy">{product.short_description || product.description.slice(0, 140)}</p>

      {/* Stock Awareness */}
      {availableStock > 0 && availableStock <= 3 && (
        <div className="stock">
          Only {availableStock} pieces left in stock for selected size · Dispatches in 3–5 working days
        </div>
      )}
      {isOutOfStock && (
        <div className="stock" style={{ background: '#fce8e8', color: '#9b1c1c' }}>
          This size is currently sold out in our studio.
        </div>
      )}

      {/* Size Selector */}
      {activeVariants.length > 0 && (
        <>
          <div className="choice-label">
            <span>Select Size</span>
            <button
              onClick={() => setShowSizeGuide(true)}
              style={{ border: 0, background: 'none', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Size Guide
            </button>
          </div>

          <div className="choices">
            {activeVariants.map((v) => {
              const stock = (v.inventory?.quantity_on_hand || 0) - (v.inventory?.quantity_reserved || 0);
              const disabled = stock <= 0;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`choice ${selectedVariantId === v.id ? 'active' : ''}`}
                  disabled={disabled}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Primary Actions */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="btn full"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {added ? '✓ Added to Shopping Bag' : isOutOfStock ? 'Sold Out' : `Add to Bag · ${currentPriceFormatted}`}
        </button>

        <a className="btn secondary full" href="/cart">
          View Shopping Bag & Checkout
        </a>

        <a
          className="btn secondary full"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          style={{ borderColor: '#315d47', color: '#315d47' }}
        >
          ◉ &nbsp; Ask about this piece on WhatsApp
        </a>
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
}
