import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { createAdminClient } from '../../../lib/supabase/admin';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role, created_at')
    .order('created_at', { ascending: false });

  const staffList = profiles || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="settings" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Studio Governance & Configuration</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Staff Accounts & Studio Settings</h1>
          </div>
        </div>

        {/* Staff Accounts Section */}
        <div className="admin-card" style={{ marginTop: 28, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>Staff & Admin Accounts ({staffList.length})</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 0' }}>
                Authorized studio team members with access to fulfilment, catalogue management, and store analytics.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>Name</th>
                  <th style={{ padding: 12 }}>Phone</th>
                  <th style={{ padding: 12 }}>Role</th>
                  <th style={{ padding: 12 }}>Registered</th>
                  <th style={{ padding: 12 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>{p.full_name || 'Studio User'}</td>
                      <td style={{ padding: 12 }}>{p.phone || 'N/A'}</td>
                      <td style={{ padding: 12 }}>
                        <span
                          className="status"
                          style={{
                            background: p.role === 'admin' ? '#e6f4ea' : '#e8f0fe',
                            color: p.role === 'admin' ? '#137333' : '#1a73e8',
                            fontWeight: 600
                          }}
                        >
                          {p.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>
                        {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: 12 }}>
                        <span className="status" style={{ background: '#e6f4ea', color: '#137333' }}>
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
                      No staff accounts found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Connections & Environment Config */}
        <div className="admin-card" style={{ marginTop: 28, padding: 28 }}>
          <h3 style={{ margin: 0 }}>System Connections & Integrations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Database System of Record:</strong></span>
              <span className="status" style={{ background: '#e6f4ea', color: '#137333' }}>Supabase PostgreSQL (Active & Connected)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Payment Processor:</strong></span>
              <span className="status" style={{ background: '#e6f4ea', color: '#137333' }}>Razorpay Standard Checkout (Live Webhooks Enabled)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>WhatsApp Customer Channel:</strong></span>
              <span className="status" style={{ background: '#e6f4ea', color: '#137333' }}>wa.me/919482245679 (Active)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Storefront Domain:</strong></span>
              <span>tanavibydeepika.com / tanavidesigns.com</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Administrative Subdomain:</strong></span>
              <span>admin.tanavidesigns.com</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
