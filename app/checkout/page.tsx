"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';
import { formatMoney } from '../../lib/services/catalog-service';

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'pay_later'>('razorpay');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Andhra Pradesh',
    pinCode: ''
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tanavi_cart') || '[]';
      setCart(JSON.parse(raw));
    } catch {}

    // Load Razorpay Script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const subtotalPaise = cart.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);
  const shippingPaise = subtotalPaise >= 299900 || subtotalPaise === 0 ? 0 : 14900;
  const totalPaise = subtotalPaise + shippingPaise;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const items = cart.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity
      }));

      // Option 1: Prepaid / Online Payment (Razorpay)
      if (paymentMethod === 'razorpay') {
        const res = await fetch('/api/payments/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, customer: formData })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to initialize payment');
        }

        const options = {
          key: data.keyId,
          amount: data.amountPaise,
          currency: data.currency,
          name: 'Tanavi by Deepika',
          description: `Order ${data.orderNumber}`,
          order_id: data.razorpayOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: '#7c5e4a' },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/payments/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                })
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                localStorage.removeItem('tanavi_cart');
                window.location.href = `/payment/success?order=${verifyData.orderNumber}`;
              } else {
                throw new Error(verifyData.error || 'Signature verification failed');
              }
            } catch (vErr: any) {
              alert(`Payment verification error: ${vErr.message}`);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setError(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();
      }
      // Option 2 & 3: Cash on Delivery (COD) or Pay Later (Studio Reserve)
      else {
        const res = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            customer: formData,
            paymentMethod
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to process order');
        }

        // Open WhatsApp notification tab for Admin notification if available
        if (data.adminWhatsAppUrl) {
          try {
            window.open(data.adminWhatsAppUrl, '_blank');
          } catch {}
        }

        localStorage.removeItem('tanavi_cart');
        window.location.href = `/payment/success?order=${data.orderNumber}&method=${paymentMethod}`;
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Secure Checkout</span>
          <h1>Shipping & Payment Method</h1>
        </section>

        {error && (
          <div style={{ maxWidth: 720, margin: '0 auto 20px', background: '#fde8e8', color: '#9b1c1c', padding: '14px 20px', borderRadius: 12, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div>
            <div className="checkout-section">
              <h3>Contact Information</h3>
              <div className="field-grid">
                <div className="field">
                  <label>Full Name</label>
                  <input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Deepika Chowdary"
                  />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="field">
                  <label>Mobile Number (India)</label>
                  <input
                    required
                    pattern="[6-9][0-9]{9}"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="94822 45679"
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h3>Delivery Address</h3>
              <div className="field">
                <label>Address Line 1</label>
                <input
                  required
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  placeholder="House number, apartment name and street locality"
                />
              </div>
              <div className="field">
                <label>Address Line 2 (Optional)</label>
                <input
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  placeholder="Landmark or locality notes"
                />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label>City</label>
                  <input
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Vijayawada"
                  />
                </div>
                <div className="field">
                  <label>State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>
                <div className="field">
                  <label>PIN Code</label>
                  <input
                    required
                    pattern="[1-9][0-9]{5}"
                    inputMode="numeric"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="520001"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="checkout-section">
              <h3>Select Payment Method</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                {/* Method 1: Prepaid Razorpay */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 12,
                    border: paymentMethod === 'razorpay' ? '2px solid var(--accent, #7c5e4a)' : '1px solid var(--border)',
                    background: paymentMethod === 'razorpay' ? '#faf6f4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    style={{ width: 18, height: 18, accentColor: '#7c5e4a' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--ink)' }}>💳 Online Payment (Prepaid)</strong>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Pay instantly via Razorpay (UPI, Google Pay, Credit/Debit Cards, Netbanking)</span>
                  </div>
                </label>

                {/* Method 2: Cash on Delivery (COD) */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 12,
                    border: paymentMethod === 'cod' ? '2px solid var(--accent, #7c5e4a)' : '1px solid var(--border)',
                    background: paymentMethod === 'cod' ? '#faf6f4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ width: 18, height: 18, accentColor: '#7c5e4a' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--ink)' }}>🚚 Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Pay cash upon package delivery to your address</span>
                  </div>
                </label>

                {/* Method 3: Pay Later / Studio Reserve */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 12,
                    border: paymentMethod === 'pay_later' ? '2px solid var(--accent, #7c5e4a)' : '1px solid var(--border)',
                    background: paymentMethod === 'pay_later' ? '#faf6f4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="pay_later"
                    checked={paymentMethod === 'pay_later'}
                    onChange={() => setPaymentMethod('pay_later')}
                    style={{ width: 18, height: 18, accentColor: '#7c5e4a' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--ink)' }}>🕒 Pay Later (Studio Reserve)</strong>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Reserve your piece for 48h; pay on delivery or studio pickup</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <aside className="summary">
            <h3>Your Order Summary</h3>
            {cart.map((x) => (
              <div className="summary-row" key={x.variantId}>
                <span>
                  {x.productName} (Size {x.size}) × {x.quantity}
                </span>
                <span>{formatMoney(x.pricePaise * x.quantity)}</span>
              </div>
            ))}

            <div className="summary-row" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <span>Subtotal</span>
              <span>{formatMoney(subtotalPaise)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{subtotalPaise >= 299900 ? 'Complimentary' : formatMoney(shippingPaise)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Payable</span>
              <span>{formatMoney(totalPaise)}</span>
            </div>

            <button className="btn full" disabled={loading || cart.length === 0}>
              {loading
                ? 'Processing Order…'
                : paymentMethod === 'razorpay'
                ? `Pay Securely · ${formatMoney(totalPaise)}`
                : paymentMethod === 'cod'
                ? `Place COD Order · ${formatMoney(totalPaise)}`
                : `Reserve & Pay Later · ${formatMoney(totalPaise)}`}
            </button>

            <p className="meta" style={{ lineHeight: 1.6, marginTop: 14, fontSize: 11 }}>
              📲 Orders automatically trigger instant WhatsApp & Email notifications to both you and our Studio Work Mobile team.
            </p>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}
