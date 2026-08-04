"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';
import { formatMoney } from '../../lib/services/catalog-service';

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      // 1. Call server to create order & reserve inventory
      const res = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: formData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // 2. Open Razorpay Standard Checkout modal
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
        theme: {
          color: '#9E3850'
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Razorpay Payment Signature
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
          <h1>Shipping & Payment</h1>
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
                    <option value="Rajasthan">Rajasthan</option>
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
          </div>

          <aside className="summary">
            <h3>Your Order</h3>
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
              {loading ? 'Preparing Payment Gateway…' : `Pay Securely · ${formatMoney(totalPaise)}`}
            </button>

            <p className="meta" style={{ lineHeight: 1.6, marginTop: 14, fontSize: 11 }}>
              🔒 Payment encrypted and verified server-side with Razorpay (UPI, Credit/Debit Cards, Netbanking & Wallets).
            </p>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}
