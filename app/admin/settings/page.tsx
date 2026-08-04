import { AdminSidebar } from '../../../components/admin/admin-sidebar';

export default function AdminSettingsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="settings" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Studio Configuration</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Store & Deployment Settings</h1>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 28, maxWidth: 720, padding: 32 }}>
          <h3>Connected Production Services</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Primary Database & System of Record:</strong></span>
              <span className="status" style={{ background: '#e6f4ea', color: '#137333' }}>Supabase PostgreSQL (Connected)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Payment Gateway:</strong></span>
              <span className="status" style={{ background: '#e6f4ea', color: '#137333' }}>Razorpay Standard Checkout (Active)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Customer Support Integration:</strong></span>
              <span className="status" style={{ background: '#e6f4ea', color: '#137333' }}>WhatsApp wa.me Links (+91 94822 45679)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--border)' }}>
              <span><strong>Timezone:</strong></span>
              <span>Asia/Kolkata (IST)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
