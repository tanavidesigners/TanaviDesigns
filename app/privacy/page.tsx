import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Studio Policies</span>
          <h1>Privacy Policy</h1>
        </section>

        <section className="section compact" style={{ maxWidth: 800, margin: '0 auto', fontSize: 14, lineHeight: 1.8, color: 'var(--muted)' }}>
          <div className="checkout-section" style={{ padding: 32 }}>
            <h3 style={{ color: 'var(--ink)' }}>Data Privacy & Trust</h3>
            <p>
              At <strong>Tanavi by Deepika</strong>, we respect your privacy. We collect customer contact details, shipping addresses, and transaction records strictly to process your orders, fulfill deliveries, and send optional studio updates.
            </p>

            <h3 style={{ color: 'var(--ink)', marginTop: 24 }}>Payment Security</h3>
            <p>
              All online payments are processed through Razorpay using PCI-DSS compliant 256-bit encryption. We <strong>never store or record</strong> your card numbers, CVVs, netbanking passwords, or UPI PINs on our servers.
            </p>

            <h3 style={{ color: 'var(--ink)', marginTop: 24 }}>Third-Party Disclosure</h3>
            <p>
              Your personal information is never sold, rented, or shared with third parties, except trusted logistics partners (e.g. courier agencies) strictly necessary for parcel delivery.
            </p>

            <div style={{ marginTop: 32, padding: 16, background: 'var(--soft)', borderRadius: 10, fontSize: 12 }}>
              <em>Note for legal review: Prepared placeholder for standard Indian e-commerce data protection guidelines.</em>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
