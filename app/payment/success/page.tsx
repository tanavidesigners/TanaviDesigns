import { Header } from '../../../components/shared/header';
import { Footer } from '../../../components/shared/footer';
import { buildOrderSupportWhatsAppUrl } from '../../../lib/services/whatsapp-service';

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const resolvedParams = await searchParams;
  const orderNumber = resolvedParams.order || 'TNV-CONFIRMED';
  const waSupportUrl = buildOrderSupportWhatsAppUrl(orderNumber);

  return (
    <div className="shell">
      <Header />

      <main>
        <div className="success">
          <div className="success-mark">✓</div>
          <span className="eyebrow" style={{ marginTop: 16 }}>Order Confirmed</span>
          <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 36, margin: '8px 0 16px' }}>
            Thank you, beautifully.
          </h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 24px' }}>
            Your order <strong>{orderNumber}</strong> has been received and confirmed in our studio. We are hand-preparing your pieces with care and will notify you when your parcel dispatches.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a className="btn" href={`/track-order?order=${orderNumber}`}>
              Track Your Order
            </a>
            <a
              className="btn secondary"
              href={waSupportUrl}
              target="_blank"
              rel="noreferrer"
              style={{ borderColor: '#315d47', color: '#315d47' }}
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
