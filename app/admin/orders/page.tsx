import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { createAdminClient } from '../../../lib/supabase/admin';
import { formatMoney } from '../../../lib/services/catalog-service';
import { DataEmptyState } from '../../../components/shared/data-empty-state';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });

  const orderList = orders || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="orders" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Studio Fulfilment</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Orders & Parcel Fulfilment ({orderList.length})</h1>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 28 }}>
          {orderList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textIndent: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Order #</th>
                    <th style={{ padding: 12 }}>Customer</th>
                    <th style={{ padding: 12 }}>Placed Date</th>
                    <th style={{ padding: 12 }}>Items</th>
                    <th style={{ padding: 12 }}>Amount</th>
                    <th style={{ padding: 12 }}>Payment</th>
                    <th style={{ padding: 12 }}>Order Status</th>
                    <th style={{ padding: 12 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>{ord.order_number}</td>
                      <td style={{ padding: 12 }}>
                        {ord.shipping_address?.full_name || ord.guest_email}
                        <div className="meta">{ord.guest_phone || ord.guest_email}</div>
                      </td>
                      <td style={{ padding: 12 }}>
                        {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: 12 }}>{ord.items?.length || 0} items</td>
                      <td style={{ padding: 12, fontWeight: 600 }}>{formatMoney(ord.grand_total)}</td>
                      <td style={{ padding: 12 }}>
                        <span
                          className="status"
                          style={{
                            background: ord.payment_status === 'captured' ? '#e6f4ea' : '#fce8e8',
                            color: ord.payment_status === 'captured' ? '#137333' : '#9b1c1c'
                          }}
                        >
                          {ord.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>
                        <span className="status">
                          {ord.status.toUpperCase().replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>
                        <a href={`/admin/orders/${ord.id}`} className="text-link">
                          Manage →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <DataEmptyState
              title="No orders yet"
              description="Customer orders will appear here after checkout transactions are recorded in Supabase."
              actionLabel="View Live Storefront"
              actionHref="/shop"
            />
          )}
        </div>
      </main>
    </div>
  );
}
