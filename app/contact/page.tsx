"use client";

import React, { useState } from 'react';
import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';
import { createClient } from '../../lib/supabase/client';
import { buildGeneralWhatsAppUrl } from '../../lib/services/whatsapp-service';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from('contact_enquiries').insert(formData);
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = buildGeneralWhatsAppUrl('Hello Tanavi, I am reaching out from your contact page.');

  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Get in Touch</span>
          <h1>Contact Our Studio</h1>
          <p>We welcome your notes, sizing enquiries, and custom order requests.</p>
        </section>

        <section className="section compact" style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="checkout-layout" style={{ padding: 0 }}>
            <div>
              {sent ? (
                <div className="success" style={{ margin: 0, textAlign: 'center', padding: '48px 24px' }}>
                  <div className="success-mark">✓</div>
                  <h3 style={{ fontSize: 24, margin: '16px 0 8px', fontFamily: '"Fraunces", serif' }}>Note Received</h3>
                  <p className="meta">Thank you for writing to us. Deepika and our studio team will reply within 24 hours.</p>
                </div>
              ) : (
                <form className="checkout-section" onSubmit={handleSubmit}>
                  <h3>Send a Note to the Studio</h3>
                  <div className="field-grid">
                    <div className="field">
                      <label>Your Full Name</label>
                      <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Kavya Sharma" />
                    </div>
                    <div className="field">
                      <label>Email Address</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="field-grid">
                    <div className="field">
                      <label>Phone Number (Optional)</label>
                      <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="98765 43210" />
                    </div>
                    <div className="field">
                      <label>Subject</label>
                      <input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Custom Fit / Order Enquiry" />
                    </div>
                  </div>
                  <div className="field">
                    <label>Your Message</label>
                    <textarea rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us how we can help you…" />
                  </div>
                  <button className="btn full" disabled={loading}>
                    {loading ? 'Sending Note…' : 'Send Message to Studio'}
                  </button>
                </form>
              )}
            </div>

            <aside className="summary">
              <h3>Visit & Connect</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
                <strong>Tanavi Studio & Workshop</strong><br />
                Vijayawada, Andhra Pradesh, India<br />
                By appointment only
              </p>

              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginTop: 16 }}>
                <strong>Email:</strong><br />
                tanavidesigns@gmail.com
              </p>

              <a
                className="btn secondary full"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{ borderColor: '#315d47', color: '#315d47', marginTop: 24 }}
              >
                ◉ &nbsp; Instant WhatsApp Inquiry
              </a>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
