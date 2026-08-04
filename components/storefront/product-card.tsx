"use client";

import type { Product } from '../../lib/types/database';
import { formatMoney } from '../../lib/services/catalog-service';

export function ProductCard({
  product,
  onWishlistToggle
}: {
  product: Product;
  onWishlistToggle?: (p: Product) => void;
}) {
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.storage_path ||
    product.images?.[0]?.storage_path ||
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85';

  const secondaryImage = product.images?.[1]?.storage_path;

  // Calculate stock status from actual variant inventory
  const totalStock = product.variants?.reduce((sum, v) => {
    const avail = (v.inventory?.quantity_on_hand || 0) - (v.inventory?.quantity_reserved || 0);
    return sum + Math.max(0, avail);
  }, 0) ?? 0;

  const isLowStock = totalStock > 0 && totalStock <= 3;
  const isOutOfStock = totalStock <= 0;

  return (
    <article className="product-card">
      <a href={`/products/${product.slug}`}>
        <div className="product-image">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
          />
          {product.is_new_arrival && <span className="badge">New</span>}
          {!product.is_new_arrival && isLowStock && <span className="badge">Only {totalStock} left</span>}
          {isOutOfStock && <span className="badge" style={{ background: '#333', color: '#fff' }}>Sold Out</span>}

          <button
            className="heart"
            aria-label={`Save ${product.name}`}
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle?.(product);
            }}
          >
            ♡
          </button>
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <div className="meta">
            {product.fabric ? `${product.fabric} · ` : ''}
            {product.category?.name || 'Designer Apparel'}
          </div>
          <div className="price">
            {formatMoney(product.base_price)}
            {product.compare_at_price && (
              <span style={{ textDecoration: 'line-through', color: 'var(--muted)', marginLeft: 8, fontSize: 12 }}>
                {formatMoney(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}
