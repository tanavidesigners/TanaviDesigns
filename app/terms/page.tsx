import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';

export default function TermsPage() {
  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Studio Policies</span>
          <h1>Terms & Conditions</h1>
        </section>

        <section className="section compact" style={{ maxWidth: 800, margin: '0 auto', fontSize: 14, lineHeight: 1.8, color: 'var(--muted)' }}>
          <div className="checkout-section" style={{ padding: 32 }}>
            <h3 style={{ color: 'var(--ink)' }}>Artisanal & Handmade Disclaimers</h3>
            <p>
              Every <strong>Tanavi by Deepika</strong> garment is crafted by hand using natural fabrics, block printing, and artisanal tie-dye techniques. Slight variations in print alignment, dye intensity, or weave texture are natural characteristics of authentic handmade textiles and make every piece unique.
            </p>

            <h3 style={{ color: 'var(--ink)', marginTop: 24 }}>Pricing & Order Acceptance</h3>
            <p>
              All product prices are listed in Indian Rupees (INR) inclusive of applicable GST taxes. We reserve the right to decline or cancel orders in cases of obvious pricing error or inventory unavailability, with immediate full refund.
            </p>

            <div style={{ marginTop: 32, padding: 16, background: 'var(--soft)', borderRadius: 10, fontSize: 12 }}>
              <em>Note for legal review: Placeholder terms and conditions for designer studio e-commerce operations.</em>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
