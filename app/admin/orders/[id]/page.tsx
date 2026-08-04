import { notFound } from 'next/navigation';
import { AdminSidebar } from '../../../../components/admin/admin-sidebar';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { formatMoney } from '../../../../lib/services/catalog-service';
import { buildOrderSupportWhatsAppUrl } from '../../../../lib/services/whatsapp-service';
import { AdminOrderStatusControls } from '../../../../components/admin/order-controls';

export const revalidate = 0;

export default async function AdminOrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*, items:order_items(*), payments(*)')
    .eq('id', orderId)
    .single();

  if (!order) {
    notFound();
  }

  const waUrl = buildOrderSupportWhatsAppUrl(order.order_number);
  const address = order.shipping_address || {};

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="orders" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Fulfilment & Shipping</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Order #{order.order_number}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="btn secondary" href="/admin/orders">
              ← Back to Orders
            </a>
            <a
              className="btn secondary"
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style={{ borderColor: '#315d47', color: '#315d47' }}
            >
              ◉ Contact Customer on WhatsApp
            </a>
          </div>
        </div>

        <div className="admin-grid" style={{ marginTop: 28 }}>
          <div>
            {/* Status Change Control */}
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3>Order Status & Fulfilment Control</h3>
              <AdminOrderStatusControls orderId={order.id} currentStatus={order.status} />
            </div>

            {/* Items */}
            <div className="admin-card">
              <h3>Purchased Apparel Items</h3>
              {order.items?.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85'}
                    alt={item.product_name}
                    style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <strong>{item.product_name}</strong>
                    <div className="meta">SKU: {item.sku} · Size: {item.size || 'M'} · Colour: {item.colour || 'Original'}</div>
                    <div style={{ marginTop: 4 }}>Unit Price: {formatMoney(item.unit_price)} × Qty {item.quantity}</div>
                  </div>
                  <strong style={{ fontSize: 14 }}>{formatMoney(item.line_total)}</strong>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border)', paddingTop: 16, marginTop: 16, fontWeight: 600, fontSize: 16 }}>
                <span>Grand Total</span>
                <span>{formatMoney(order.grand_total)}</span>
              </div>
            </div>
          </div>

          <div>
            {/* Customer & Address Details */}
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3>Shipping Destination</h3>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--ink)' }}>{address.full_name || 'N/A'}</strong><br />
                {address.line1}<br />
                {address.line2 ? `${address.line2}\n` : ''}
                {address.city}, {address.state} - <strong>{address.pin_code}</strong><br />
                <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '12px 0' }} />
                <strong>Phone:</strong> {order.guest_phone || address.phone || 'N/A'}<br />
                <strong>Email:</strong> {order.guest_email || 'N/A'}
              </div>
            </div>

            {/* Payment Details */}
            <div className="admin-card">
              <h3>Razorpay Payment References</h3>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--muted)' }}>
                <strong>Razorpay Order ID:</strong><br />
                <code>{order.razorpay_order_id || 'None'}</code><br />
                <strong>Payment Status:</strong> {order.payment_status.toUpperCase()}<br />
                <strong>Currency:</strong> {order.currency}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
