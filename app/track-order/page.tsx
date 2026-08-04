import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';
import { createAdminClient } from '../../lib/supabase/admin';
import { formatMoney } from '../../lib/services/catalog-service';
import { buildOrderSupportWhatsAppUrl } from '../../lib/services/whatsapp-service';

export const revalidate = 0;

export default async function TrackOrderPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const resolvedParams = await searchParams;
  const orderQuery = resolvedParams.order || '';

  let orderData = null;
  if (orderQuery) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_number', orderQuery.trim().toUpperCase())
      .single();

    orderData = data;
  }

  const waUrl = orderQuery ? buildOrderSupportWhatsAppUrl(orderQuery) : '';

  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Studio Order Tracker</span>
          <h1>Track Your Order</h1>
          <p>Enter your Tanavi order number (e.g. TNV-20260804-1234) to view your dispatch status.</p>

          <form action="/track-order" method="GET" style={{ maxWidth: 520, margin: '28px auto 0', display: 'flex', gap: 10 }}>
            <input
              name="order"
              defaultValue={orderQuery}
              placeholder="e.g. TNV-20260804-1234"
              required
              style={{ flex: 1, padding: 14, borderRadius: 999, border: '1px solid var(--border)', outline: 'none' }}
            />
            <button className="btn" type="submit">
              Lookup
            </button>
          </form>
        </section>

        {orderQuery && (
          <section className="section compact" style={{ maxWidth: 720, margin: '0 auto' }}>
            {orderData ? (
              <div className="admin-card" style={{ padding: 32 }}>
                <span className="eyebrow">Order Number: {orderData.order_number}</span>
                <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, margin: '8px 0 16px' }}>
                  Status: {orderData.status.toUpperCase().replace('_', ' ')}
                </h2>

                <div style={{ background: 'var(--soft)', padding: 16, borderRadius: 12, marginBottom: 24, fontSize: 13 }}>
                  <div><strong>Placed On:</strong> {new Date(orderData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div><strong>Payment Status:</strong> {orderData.payment_status.toUpperCase()}</div>
                  <div><strong>Fulfilment Status:</strong> {orderData.fulfilment_status.toUpperCase()}</div>
                </div>

                <h3>Items in Parcel</h3>
                <div style={{ marginBottom: 24 }}>
                  {orderData.items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                      <div>
                        <strong>{item.product_name}</strong> (Size: {item.size || 'M'})
                        <div className="meta">SKU: {item.sku} · Qty: {item.quantity}</div>
                      </div>
                      <strong>{formatMoney(item.line_total)}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, borderTop: '2px solid var(--border)', paddingTop: 16, marginBottom: 24 }}>
                  <span>Grand Total</span>
                  <span>{formatMoney(orderData.grand_total)}</span>
                </div>

                <a className="btn secondary full" href={waUrl} target="_blank" rel="noreferrer" style={{ borderColor: '#315d47', color: '#315d47' }}>
                  ◉ &nbsp; Need help with this order? Chat on WhatsApp
                </a>
              </div>
            ) : (
              <div className="success" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <h3>No order found matching "{orderQuery}"</h3>
                <p className="meta">Please check your order confirmation email for the correct TNV order number.</p>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
