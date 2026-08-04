import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';

export default function FAQsPage() {
  const faqs = [
    {
      q: 'How long will it take to receive my order?',
      a: 'Orders are handcrafted and dispatched from Vijayawada within 3-5 business days. Transit usually takes an additional 3-5 days across India.'
    },
    {
      q: 'Can I place an order or request customization via WhatsApp?',
      a: 'Yes! While you can checkout securely online, you can also click any "Ask on WhatsApp" button to confirm custom sizing, sleeve adjustments, or express delivery options directly with Deepika.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major payment modes via Razorpay including UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, Netbanking, and Wallets.'
    },
    {
      q: 'How should I care for hand-block and bandhani garments?',
      a: 'We recommend gentle hand washing separately in cold water using mild eco-friendly detergent. Line dry in shade to preserve vibrant natural botanical colors.'
    }
  ];

  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Frequently Asked Questions</span>
          <h1>Studio FAQs</h1>
        </section>

        <section className="section compact" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="checkout-section" style={{ padding: 32 }}>
            {faqs.map((faq, idx) => (
              <details className="accordion" key={idx} open={idx === 0}>
                <summary style={{ fontWeight: 600, fontSize: 16, cursor: 'pointer', marginBottom: 6 }}>
                  {faq.q}
                </summary>
                <p className="detail-copy" style={{ margin: '8px 0 0' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
