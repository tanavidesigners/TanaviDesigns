import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { createAdminClient } from '../../../lib/supabase/admin';

export const revalidate = 0;

export default async function AdminAnnouncementsPage() {
  const supabase = createAdminClient();

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  const list = announcements || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="announcements" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Storefront Merchandising</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Announcement Bar Control</h1>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 28, maxWidth: 800 }}>
          <h3>Active Storefront Announcements</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
            Announcements configured here will render in the top banner across all public pages. When no active announcement exists, the banner is hidden automatically.
          </p>

          {list.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Message Text</th>
                    <th style={{ padding: 12 }}>Target Link</th>
                    <th style={{ padding: 12 }}>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((anc) => (
                    <tr key={anc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>{anc.message}</td>
                      <td style={{ padding: 12 }}>{anc.link_url || 'None'}</td>
                      <td style={{ padding: 12 }}>
                        <span className="status" style={{ background: anc.active ? '#e6f4ea' : '#fce8e8' }}>
                          {anc.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
              No announcements configured. Top announcement banner will remain hidden on public storefront.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
