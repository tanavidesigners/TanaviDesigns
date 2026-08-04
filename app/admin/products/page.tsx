import { AdminSidebar } from '../../../components/admin/admin-sidebar';
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
      variants:product_variants(id, sku, size, price_override, inventory(quantity_on_hand, quantity_reserved))
    `)
    .order('created_at', { ascending: false });

  const itemList = products || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar currentTab="products" />

      <main style={{ flex: 1, padding: 36 }}>
        <div className="admin-top">
          <div>
            <span className="eyebrow">Catalogue Control</span>
            <h1 style={{ margin: '6px 0', fontFamily: '"Fraunces", serif', fontSize: 32 }}>Products & Variants ({itemList.length})</h1>
          </div>
          <a className="btn" href="/admin/products/new">
            + Add New Product
          </a>
        </div>

        <div className="admin-card" style={{ marginTop: 28 }}>
          {itemList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textIndent: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Product</th>
                    <th style={{ padding: 12 }}>Category</th>
                    <th style={{ padding: 12 }}>Base Price</th>
                    <th style={{ padding: 12 }}>Variants</th>
                    <th style={{ padding: 12 }}>Total Available</th>
                    <th style={{ padding: 12 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {itemList.map((p) => {
                    const totalAvail = p.variants?.reduce((sum: number, v: any) => {
                      const avail = (v.inventory?.quantity_on_hand || 0) - (v.inventory?.quantity_reserved || 0);
                      return sum + Math.max(0, avail);
                    }, 0) || 0;

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 12, fontWeight: 600 }}>
                          {p.name}
                          <div className="meta">SKU: {p.sku}</div>
                        </td>
                        <td style={{ padding: 12 }}>{p.category?.name || 'Uncategorized'}</td>
                        <td style={{ padding: 12, fontWeight: 600 }}>{formatMoney(p.base_price)}</td>
                        <td style={{ padding: 12 }}>{p.variants?.length || 0} variants</td>
                        <td style={{ padding: 12 }}>{totalAvail} units</td>
                        <td style={{ padding: 12 }}>
                          <span
                            className="status"
                            style={{
                              background: p.status === 'active' ? '#e6f4ea' : '#fce8e8',
                              color: p.status === 'active' ? '#137333' : '#9b1c1c'
                            }}
                          >
                            {p.status.toUpperCase()}
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
  );
}
