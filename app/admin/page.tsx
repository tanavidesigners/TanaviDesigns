import { AdminSidebar } from '../../components/admin/admin-sidebar';
import { AdminHeader } from '../../components/admin/admin-header';
import { getAdminDashboardMetrics, getInventoryAlerts } from '../../lib/services/analytics-service';
import { formatMoney } from '../../lib/services/catalog-service';
import { DataEmptyState } from '../../components/shared/data-empty-state';

export const revalidate = 0; // Always fresh database query

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();
  const alerts = await getInventoryAlerts();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg, #f7f4ee)' }}>
      <AdminSidebar currentTab="overview" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Studio Overview & Analytics" subtitle="Administrative Dashboard" />

        <main style={{ flex: 1, padding: 36, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, color: '#2b2420', letterSpacing: '-0.01em' }}>
                Studio Overview & Analytics
              </h1>
              <span style={{ fontSize: 13, color: '#796c62' }}>Live performance metrics, revenue analytics, and stock ledger alerts</span>
            </div>

            <a
              href="/shop"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 10,
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                color: '#7c5e4a',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none'
              }}
            >
              View Live Storefront ↗
            </a>
          </div>

          {/* Real KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c5e4a', fontWeight: 700 }}>
                Gross Revenue
              </span>
              <strong style={{ display: 'block', fontFamily: '"Fraunces", Georgia, serif', fontSize: 30, margin: '8px 0 4px', color: '#2b2420' }}>
                {formatMoney(metrics.grossRevenuePaise)}
              </strong>
              <span style={{ fontSize: 11, color: '#796c62' }}>From paid/captured orders</span>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c5e4a', fontWeight: 700 }}>
                Paid Orders
              </span>
              <strong style={{ display: 'block', fontFamily: '"Fraunces", Georgia, serif', fontSize: 30, margin: '8px 0 4px', color: '#2b2420' }}>
                {metrics.paidOrdersCount}
              </strong>
              <span style={{ fontSize: 11, color: '#796c62' }}>Confirmed transactions</span>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c5e4a', fontWeight: 700 }}>
                Pending Orders
              </span>
              <strong style={{ display: 'block', fontFamily: '"Fraunces", Georgia, serif', fontSize: 30, margin: '8px 0 4px', color: '#2b2420' }}>
                {metrics.pendingOrdersCount}
              </strong>
              <span style={{ fontSize: 11, color: '#796c62' }}>Awaiting payment completion</span>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c5e4a', fontWeight: 700 }}>
                Inventory Alerts
              </span>
              <strong
                style={{
                  display: 'block',
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 30,
                  margin: '8px 0 4px',
                  color: metrics.lowStockCount > 0 || metrics.outOfStockCount > 0 ? '#c5221f' : '#2b2420'
                }}
              >
                {metrics.lowStockCount + metrics.outOfStockCount}
              </strong>
              <span style={{ fontSize: 11, color: '#796c62' }}>
                {metrics.lowStockCount} low · {metrics.outOfStockCount} out of stock
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
            {/* Revenue Analytics Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2b2420' }}>Revenue Analytics</h3>
              {metrics.paidOrdersCount > 0 ? (
                <div style={{ padding: '20px 0' }}>
                  <p style={{ color: '#796c62', fontSize: 14 }}>
                    Total captured revenue across {metrics.paidOrdersCount} orders: <strong>{formatMoney(metrics.grossRevenuePaise)}</strong>
                  </p>
                  <div style={{ height: 12, background: '#f2ece0', borderRadius: 999, overflow: 'hidden', margin: '16px 0' }}>
                    <div style={{ width: '100%', height: '100%', background: '#7c5e4a' }} />
                  </div>
                </div>
              ) : (
                <DataEmptyState
                  title="No revenue data yet"
                  description="Revenue analytics will appear after captured orders are recorded in Supabase."
                />
              )}
            </div>

            {/* Inventory Stock Alerts Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e4ddd0',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: '#2b2420' }}>Inventory Stock Alerts</h3>
              {alerts.length > 0 ? (
                <div>
                  {alerts.map((alert) => (
                    <div
                      key={alert.variant_id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 0',
                        borderTop: '1px solid #e4ddd0',
                        fontSize: 13
                      }}
                    >
                      <div>
                        <strong style={{ color: '#2b2420' }}>{alert.product_name}</strong> ({alert.size})
                        <div style={{ fontSize: 11, color: '#796c62', marginTop: 2 }}>SKU: {alert.sku}</div>
                      </div>
                      <span
                        style={{
                          padding: '5px 12px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: alert.alert_status === 'out_of_stock' ? '#fce8e6' : '#fef7e0',
                          color: alert.alert_status === 'out_of_stock' ? '#c5221f' : '#b06000'
                        }}
                      >
                        {alert.alert_status === 'out_of_stock' ? 'Out of Stock' : `${alert.quantity_available} left`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '30px 0', textAlign: 'center', color: '#137333', fontSize: 13, background: '#f4fbf6', borderRadius: 12, border: '1px solid #d2f0db' }}>
                  ✓ All active product inventory levels are healthy.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
