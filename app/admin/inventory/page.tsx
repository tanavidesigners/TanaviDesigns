import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { AdminHeader } from '../../../components/admin/admin-header';
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
        price_override,
        product:products(
          name,
          base_price,
          product_images(storage_path, is_primary)
        )
      )
    `)
    .order('updated_at', { ascending: false });

  const items = inventoryList || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg, #f7f4ee)' }}>
      <AdminSidebar currentTab="inventory" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Inventory Control & Stock Ledger" subtitle="Studio Stock Ledger" />

        <main style={{ flex: 1, padding: 36, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {/* Header Title Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, color: '#2b2420', letterSpacing: '-0.01em' }}>
                Inventory Control & Stock Ledger
              </h1>
              <span style={{ fontSize: 13, color: '#796c62' }}>View and manage real-time stock levels across all designer product variants</span>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="/admin/products/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  borderRadius: 10,
                  background: '#7c5e4a',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none'
                }}
              >
                + Add New Product
              </a>
            </div>
          </div>

          {/* Table Container Card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4ddd0',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              overflow: 'hidden'
            }}
          >
            {items.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#faf8f5', borderBottom: '1px solid #e4ddd0', textAlign: 'left' }}>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>#</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Product Name & Details</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>SKU</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Size</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Qty on Hand</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Status</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const variant = item.variant as any;
                      const product = variant?.product;
                      const productName = product?.name || 'Designer Product';
                      const images = product?.product_images || [];
                      const primaryImg = images.find((img: any) => img.is_primary)?.storage_path || images[0]?.storage_path || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=300&q=80';

                      const unitPricePaise = variant?.price_override || product?.base_price || 245000;
                      const unitPriceINR = (unitPricePaise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

                      const available = item.quantity_on_hand - item.quantity_reserved;
                      const isLow = available > 0 && available <= item.low_stock_threshold;
                      const isOut = available <= 0;

                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e4ddd0', background: idx % 2 === 0 ? '#ffffff' : '#fcfaf7' }}>
                          <td style={{ padding: '16px 20px', fontWeight: 600, color: '#796c62' }}>({idx + 1})</td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <img
                                src={primaryImg}
                                alt={productName}
                                style={{ width: 44, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid #e4ddd0' }}
                              />
                              <div>
                                <strong style={{ display: 'block', color: '#2b2420', fontSize: 14 }}>{productName}</strong>
                                <span style={{ fontSize: 12, color: '#796c62' }}>{variant?.colour_name || 'Handcrafted Silk'}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: 600, fontFamily: 'monospace', color: '#7c5e4a', fontSize: 12 }}>
                            {variant?.sku || 'TNV-26'}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, background: '#f2ece0', fontWeight: 600, fontSize: 12 }}>
                              {variant?.size || 'M'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: 15, color: '#2b2420' }}>
                            {item.quantity_on_hand}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '5px 12px',
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                background: isOut ? '#fce8e6' : isLow ? '#fef7e0' : '#e6f4ea',
                                color: isOut ? '#c5221f' : isLow ? '#b06000' : '#137333'
                              }}
                            >
                              {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: 600, color: '#2b2420' }}>
                            {unitPriceINR}
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
    </div>
  );
}
