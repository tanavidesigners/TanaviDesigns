import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { createAdminClient } from '../../../lib/supabase/admin';
import { formatMoney } from '../../../lib/services/catalog-service';
import { DataEmptyState } from '../../../components/shared/data-empty-state';

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const supabase = createAdminClient();

  const { data: payments } = await supabase
    .from('payments')
    .select('*, order:orders(order_number, guest_email)')
    .order('created_at', { ascending: false });

  const paymentList = payments || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="payments" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Financial Audit</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Payment Transaction Records ({paymentList.length})</h1>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 28 }}>
          {paymentList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textIndent: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Provider</th>
                    <th style={{ padding: 12 }}>Order #</th>
                    <th style={{ padding: 12 }}>Razorpay Payment ID</th>
                    <th style={{ padding: 12 }}>Amount</th>
                    <th style={{ padding: 12 }}>Status</th>
                    <th style={{ padding: 12 }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentList.map((p) => {
                    const order = p.order as any;
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 12, fontWeight: 600 }}>{p.provider}</td>
                        <td style={{ padding: 12 }}>{order?.order_number || 'N/A'}</td>
                        <td style={{ padding: 12 }}>
                          <code>{p.provider_payment_id || 'Pending'}</code>
                        </td>
                        <td style={{ padding: 12, fontWeight: 600 }}>{formatMoney(p.amount)}</td>
                        <td style={{ padding: 12 }}>
                          <span
                            className="status"
                            style={{
                              background: p.status === 'captured' ? '#e6f4ea' : '#fce8e8',
                              color: p.status === 'captured' ? '#137333' : '#9b1c1c'
                            }}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          {new Date(p.created_at).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <DataEmptyState
              title="No failed or recorded payments"
              description="Razorpay transaction logs will appear here after customer checkout attempts are recorded in Supabase."
            />
          )}
        </div>
      </main>
    </div>
  );
}
