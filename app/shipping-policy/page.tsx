import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';

export default function ShippingPolicyPage() {
  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Studio Policies</span>
          <h1>Shipping & Delivery Policy</h1>
        </section>

        <section className="section compact" style={{ maxWidth: 800, margin: '0 auto', fontSize: 14, lineHeight: 1.8, color: 'var(--muted)' }}>
          <div className="checkout-section" style={{ padding: 32 }}>
            <h3 style={{ color: 'var(--ink)' }}>Domestic Dispatch & Timelines</h3>
            <p>
              At <strong>Tanavi by Deepika</strong>, every piece is made in small, deliberate batches or finished by hand upon order placement.
              Standard domestic orders dispatch from our Vijayawada studio within <strong>3 to 5 business days</strong>.
            </p>

            <h3 style={{ color: 'var(--ink)', marginTop: 24 }}>Shipping Charges</h3>
            <ul>
              <li><strong>Complimentary Standard Shipping:</strong> On all domestic orders above <strong>₹2,999</strong>.</li>
              <li><strong>Standard Shipping Fee:</strong> Flat <strong>₹149</strong> across India on orders under ₹2,999.</li>
            </ul>

            <h3 style={{ color: 'var(--ink)', marginTop: 24 }}>Transit & Tracking</h3>
            <p>
              Once your parcel leaves our studio, courier transit typically takes <strong>3 to 5 business days</strong> depending on your pincode destination.
              You will receive an email and SMS with your tracking number upon dispatch. You can also track your status anytime on our <a href="/track-order" style={{ textDecoration: 'underline' }}>Track Order</a> page.
            </p>

            <div style={{ marginTop: 32, padding: 16, background: 'var(--soft)', borderRadius: 10, fontSize: 12 }}>
              <em>Note for legal review: This policy outline represents Tanavi by Deepika's studio shipping commitments and will be updated when international shipping destinations are enabled.</em>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
