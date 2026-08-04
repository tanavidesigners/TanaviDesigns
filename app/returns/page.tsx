import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';

export default function ReturnsPolicyPage() {
  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Studio Policies</span>
          <h1>Returns & Exchange Policy</h1>
        </section>

        <section className="section compact" style={{ maxWidth: 800, margin: '0 auto', fontSize: 14, lineHeight: 1.8, color: 'var(--muted)' }}>
          <div className="checkout-section" style={{ padding: 32 }}>
            <h3 style={{ color: 'var(--ink)' }}>7-Day Store Exchange Window</h3>
            <p>
              We want you to treasure every Tanavi piece. If you experience fit issues or receive a damaged item, eligible unworn products in original condition with tags intact may be submitted for exchange within <strong>7 days</strong> of delivery.
            </p>

            <h3 style={{ color: 'var(--ink)', marginTop: 24 }}>Non-Returnable Items</h3>
            <p>
              Due to the artisanal and small-batch nature of our craft, the following items are non-returnable:
            </p>
            <ul>
              <li>Custom-fitted or altered garments</li>
              <li>Sale / promotional clearance edit pieces</li>
              <li>Items showing visible signs of wear, perfume, or washing</li>
            </ul>

            <h3 style={{ color: 'var(--ink)', marginTop: 24 }}>How to Initiate an Exchange</h3>
            <p>
              To initiate an exchange request, please contact our studio via email at <code>tanavidesigns@gmail.com</code> or reach out directly on WhatsApp with your Order Number (e.g. TNV-20260804-1234) and photos if applicable.
            </p>

            <div style={{ marginTop: 32, padding: 16, background: 'var(--soft)', borderRadius: 10, fontSize: 12 }}>
              <em>Note for legal review: This returns outline is structured for studio operational clarity and store credit / replacement exchange workflows.</em>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
