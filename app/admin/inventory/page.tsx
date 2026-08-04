import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { createAdminClient } from '../../../lib/supabase/admin';
import { DataEmptyState } from '../../../components/shared/data-empty-state';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const supabase = createAdminClient();

  const { data: inventoryList } = await supabase
    .from('inventory')
    .select(`
      *,
      variant:product_variants(
        id,
        sku,
        size,
        colour_name,
        product:products(name)
      )
    `)
    .order('updated_at', { ascending: false });

  const items = inventoryList || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="inventory" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Inventory Control</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Variant Inventory Ledger ({items.length})</h1>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 28 }}>
          {items.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textIndent: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>SKU</th>
                    <th style={{ padding: 12 }}>Product Title</th>
                    <th style={{ padding: 12 }}>Size</th>
                    <th style={{ padding: 12 }}>On Hand</th>
                    <th style={{ padding: 12 }}>Reserved</th>
                    <th style={{ padding: 12 }}>Available</th>
                    <th style={{ padding: 12 }}>Threshold</th>
                    <th style={{ padding: 12 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const variant = item.variant as any;
                    const productName = variant?.product?.name || 'Unknown';
                    const available = item.quantity_on_hand - item.quantity_reserved;
                    const isLow = available > 0 && available <= item.low_stock_threshold;
                    const isOut = available <= 0;

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 12, fontWeight: 600 }}>{variant?.sku || 'N/A'}</td>
                        <td style={{ padding: 12 }}>{productName}</td>
                        <td style={{ padding: 12 }}>{variant?.size || 'M'}</td>
                        <td style={{ padding: 12 }}>{item.quantity_on_hand}</td>
                        <td style={{ padding: 12, color: 'var(--muted)' }}>{item.quantity_reserved}</td>
                        <td style={{ padding: 12, fontWeight: 600 }}>{Math.max(0, available)}</td>
                        <td style={{ padding: 12 }}>{item.low_stock_threshold}</td>
                        <td style={{ padding: 12 }}>
                          <span
                            className="status"
                            style={{
                              background: isOut ? '#fde8e8' : isLow ? '#fef3c7' : '#e6f4ea',
                              color: isOut ? '#9b1c1c' : isLow ? '#92400e' : '#137333'
                            }}
                          >
                            {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'HEALTHY'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <DataEmptyState
              title="Inventory levels healthy"
              description="No active product variants exist in the inventory control ledger."
            />
          )}
        </div>
      </main>
    </div>
  );
}
