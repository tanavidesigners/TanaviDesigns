import { AdminSidebar } from '../../../components/admin/admin-sidebar';
import { AdminHeader } from '../../../components/admin/admin-header';
import { createAdminClient } from '../../../lib/supabase/admin';
import { formatMoney } from '../../../lib/services/catalog-service';
import { DataEmptyState } from '../../../components/shared/data-empty-state';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = createAdminClient();

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      product_images(storage_path, is_primary),
      variants:product_variants(id, sku, size, price_override, inventory(quantity_on_hand, quantity_reserved))
    `)
    .order('created_at', { ascending: false });

  const itemList = products || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg, #f7f4ee)' }}>
      <AdminSidebar currentTab="products" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Products & Catalogue" subtitle="Studio Catalogue Control" />

        <main style={{ flex: 1, padding: 36, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, color: '#2b2420', letterSpacing: '-0.01em' }}>
                Products & Catalogue ({itemList.length})
              </h1>
              <span style={{ fontSize: 13, color: '#796c62' }}>Manage designer apparel pieces, prices, and published status</span>
            </div>

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

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e4ddd0',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              overflow: 'hidden'
            }}
          >
            {itemList.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#faf8f5', borderBottom: '1px solid #e4ddd0', textAlign: 'left' }}>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Product Title</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>SKU Code</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Fabric & Craft</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Base Price</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Variants</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Total Stock</th>
                      <th style={{ padding: '16px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#796c62', fontWeight: 700 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemList.map((p, idx) => {
                      const images = p.product_images || [];
                      const primaryImg = images.find((img: any) => img.is_primary)?.storage_path || images[0]?.storage_path || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=300&q=80';

                      const totalAvail = p.variants?.reduce((sum: number, v: any) => {
                        const avail = (v.inventory?.quantity_on_hand || 0) - (v.inventory?.quantity_reserved || 0);
                        return sum + Math.max(0, avail);
                      }, 0) || 0;

                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e4ddd0', background: idx % 2 === 0 ? '#ffffff' : '#fcfaf7' }}>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <img
                                src={primaryImg}
                                alt={p.name}
                                style={{ width: 44, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid #e4ddd0' }}
                              />
                              <div>
                                <strong style={{ display: 'block', color: '#2b2420', fontSize: 14 }}>{p.name}</strong>
                                <span style={{ fontSize: 12, color: '#796c62' }}>{p.category?.name || 'Uncategorized'}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: 600, fontFamily: 'monospace', color: '#7c5e4a', fontSize: 12 }}>
                            {p.sku}
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: 12, color: '#796c62' }}>
                            {p.fabric || 'Cotton'} • {p.craft || 'Hand Block'}
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: 600, color: '#2b2420' }}>
                            {formatMoney(p.base_price)}
                          </td>
                          <td style={{ padding: '16px 20px', color: '#796c62' }}>
                            {p.variants?.length || 0} sizes
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: 600, color: '#2b2420' }}>
                            {totalAvail} units
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
                                background: p.status === 'active' ? '#e6f4ea' : '#fce8e6',
                                color: p.status === 'active' ? '#137333' : '#c5221f'
                              }}
                            >
                              {p.status === 'active' ? 'PUBLISHED' : 'DRAFT'}
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
                title="No products available"
                description="Add and publish your first designer apparel piece to make it visible in the storefront."
                actionLabel="+ Add Product"
                actionHref="/admin/products/new"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
