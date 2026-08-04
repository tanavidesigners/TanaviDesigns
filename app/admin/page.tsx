import { AdminSidebar } from '../../components/admin/admin-sidebar';
import { getAdminDashboardMetrics, getInventoryAlerts } from '../../lib/services/analytics-service';
import { formatMoney } from '../../lib/services/catalog-service';
import { DataEmptyState } from '../../components/shared/data-empty-state';

export const revalidate = 0; // Always fresh database query

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();
  const alerts = await getInventoryAlerts();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="overview" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Tanavi Studio · Administrative Portal</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Studio Analytics & Overview</h1>
          </div>
          <a className="btn secondary" href="/shop">
            View Live Store
          </a>
        </div>

        {/* Real KPI Cards */}
        <div className="stats">
          <div className="stat">
            <span className="eyebrow">Gross Captured Revenue</span>
            <strong>{formatMoney(metrics.grossRevenuePaise)}</strong>
            <span className="meta" style={{ fontSize: 11 }}>From paid/captured orders</span>
          </div>

          <div className="stat">
            <span className="eyebrow">Paid Orders</span>
            <strong>{metrics.paidOrdersCount}</strong>
            <span className="meta" style={{ fontSize: 11 }}>Confirmed transactions</span>
          </div>

          <div className="stat">
            <span className="eyebrow">Pending Orders</span>
            <strong>{metrics.pendingOrdersCount}</strong>
            <span className="meta" style={{ fontSize: 11 }}>Awaiting payment completion</span>
          </div>

          <div className="stat">
            <span className="eyebrow">Inventory Alerts</span>
            <strong style={{ color: metrics.lowStockCount > 0 || metrics.outOfStockCount > 0 ? 'var(--accent)' : 'inherit' }}>
              {metrics.lowStockCount + metrics.outOfStockCount}
            </strong>
            <span className="meta" style={{ fontSize: 11 }}>
              {metrics.lowStockCount} low · {metrics.outOfStockCount} out of stock
            </span>
          </div>
        </div>

        <div className="admin-grid">
          {/* Revenue Analytics Section */}
          <div className="admin-card">
            <h3>Revenue Analytics</h3>
            {metrics.paidOrdersCount > 0 ? (
              <div style={{ padding: '20px 0' }}>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                  Total captured revenue across {metrics.paidOrdersCount} orders: <strong>{formatMoney(metrics.grossRevenuePaise)}</strong>
                </p>
                <div style={{ height: 12, background: 'var(--soft)', borderRadius: 999, overflow: 'hidden', margin: '16px 0' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--accent)' }} />
                </div>
              </div>
            ) : (
              <DataEmptyState
                title="No revenue data yet"
                description="Revenue analytics will appear after captured orders are recorded in Supabase."
              />
            )}
          </div>

          {/* Real Inventory Alerts Section */}
          <div className="admin-card">
            <h3>Inventory Stock Alerts</h3>
            {alerts.length > 0 ? (
              <div>
                {alerts.map((alert) => (
                  <div className="inventory-row" key={alert.variant_id}>
                    <div>
                      <strong>{alert.product_name}</strong> ({alert.size})
                      <div className="meta">SKU: {alert.sku}</div>
                    </div>
                    <span
                      className="status"
                      style={{
                        background: alert.alert_status === 'out_of_stock' ? '#fde8e8' : '#fef3c7',
                        color: alert.alert_status === 'out_of_stock' ? '#9b1c1c' : '#92400e'
                      }}
                    >
                      {alert.alert_status === 'out_of_stock' ? 'Out of Stock' : `${alert.quantity_available} left`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                ✓ Inventory levels are healthy across all active product variants.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
