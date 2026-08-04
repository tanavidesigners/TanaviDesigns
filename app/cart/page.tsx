"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';
import { formatMoney } from '../../lib/services/catalog-service';
import { buildCartWhatsAppUrl } from '../../lib/services/whatsapp-service';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tanavi_cart') || '[]';
      setCart(JSON.parse(raw));
    } catch {}
  }, []);

  const updateQuantity = (variantId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.variantId === variantId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setCart(updated);
    localStorage.setItem('tanavi_cart', JSON.stringify(updated));
  };

  const removeItem = (variantId: string) => {
    const updated = cart.filter((item) => item.variantId !== variantId);
    setCart(updated);
    localStorage.setItem('tanavi_cart', JSON.stringify(updated));
  };

  const subtotalPaise = cart.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);
  const shippingPaise = subtotalPaise >= 299900 || subtotalPaise === 0 ? 0 : 14900;
  const totalPaise = subtotalPaise + shippingPaise;

  const itemSummary = cart
    .map((x) => `• ${x.productName} (Size: ${x.size}) × ${x.quantity}`)
    .join('\n');

  const whatsappUrl = buildCartWhatsAppUrl({
    itemCount: cart.length,
    subtotalFormatted: formatMoney(subtotalPaise),
    itemSummary
  });

  return (
    <div className="shell">
      <Header cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Your Selection</span>
          <h1>Shopping Bag</h1>
        </section>

        <div className="cart-layout">
          <div>
            {cart.length > 0 ? (
              cart.map((item) => (
                <article className="cart-item" key={item.variantId}>
                  <img src={item.imageUrl || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85'} alt={item.productName} />
                  <div>
                    <h3 style={{ margin: '3px 0' }}>{item.productName}</h3>
                    <div className="meta">
                      Size: {item.size} {item.colour ? `· ${item.colour}` : ''}
                      <br />
                      SKU: {item.sku}
                    </div>
                    <div className="qty">
                      <button onClick={() => updateQuantity(item.variantId, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, 1)}>+</button>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        style={{ width: 'auto', border: 0, textDecoration: 'underline', color: 'var(--muted)', fontSize: 12, marginLeft: 12 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <strong>{formatMoney(item.pricePaise * item.quantity)}</strong>
                </article>
              ))
            ) : (
              <div className="success" style={{ margin: '30px 0', textAlign: 'center', padding: '48px 24px' }}>
                <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, margin: '0 0 8px' }}>Your bag is waiting</h2>
                <p className="meta" style={{ marginBottom: 24 }}>Discover a piece made to stay with you.</p>
                <a className="btn" href="/shop">Explore the collection</a>
              </div>
            )}
          </div>

          <aside className="summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotalPaise)}</span>
            </div>
            <div className="summary-row">
              <span>Standard Shipping</span>
              <span>{subtotalPaise >= 299900 ? 'Complimentary' : formatMoney(14900)}</span>
            </div>
            <div className="summary-row">
              <span>Taxes</span>
              <span>Included</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatMoney(totalPaise)}</span>
            </div>

            {cart.length > 0 ? (
              <>
                <a className="btn full" href="/checkout">
                  Proceed to Secure Checkout
                </a>
                <a
                  className="btn secondary full"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ borderColor: '#315d47', color: '#315d47' }}
                >
                  ◉ &nbsp; Order via WhatsApp
                </a>
              </>
            ) : (
              <a className="btn secondary full" href="/shop">
                Continue Shopping
              </a>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
