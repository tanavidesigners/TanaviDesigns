"use client";

import React, { useState } from 'react';

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="header">
      <button
        className="icon-btn mobile-menu"
        aria-label="Open menu"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>

      <nav className="nav">
        <a href="/shop">Shop</a>
        <a href="/collections/new-arrivals">New Arrivals</a>
        <a href="/category/sarees">Sarees</a>
        <a href="/category/kurta-sets">Kurta Sets</a>
        <a href="/about">Our Story</a>
      </nav>

      <a className="logo" href="/">
        <strong>TANAVI</strong>
        <span>by Deepika</span>
      </a>

      <div className="header-actions">
        <a className="icon-btn hide-mobile" aria-label="Search" href="/search">
          ⌕
        </a>
        <a className="icon-btn hide-mobile" aria-label="Account" href="/account">
          ♙
        </a>
        <a className="icon-btn hide-mobile" aria-label="Wishlist" href="/wishlist">
          ♡
        </a>
        <a className="icon-btn" aria-label={`Cart with ${cartCount} items`} href="/cart">
          ▢
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </a>
      </div>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '78px 0 0 0',
            background: 'var(--bg)',
            zIndex: 40,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            fontSize: 18,
            borderTop: '1px solid var(--border)'
          }}
        >
          <a href="/shop" onClick={() => setMobileOpen(false)}>Shop All</a>
          <a href="/collections/new-arrivals" onClick={() => setMobileOpen(false)}>New Arrivals</a>
          <a href="/category/sarees" onClick={() => setMobileOpen(false)}>Sarees</a>
          <a href="/category/kurta-sets" onClick={() => setMobileOpen(false)}>Kurta Sets</a>
          <a href="/category/co-ords" onClick={() => setMobileOpen(false)}>Co-ords</a>
          <a href="/category/dresses" onClick={() => setMobileOpen(false)}>Dresses</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>Our Story</a>
          <hr style={{ border: 0, borderTop: '1px solid var(--border)', width: '100%' }} />
          <a href="/search" onClick={() => setMobileOpen(false)}>Search</a>
          <a href="/account" onClick={() => setMobileOpen(false)}>My Account</a>
          <a href="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</a>
        </div>
      )}
    </header>
  );
}
