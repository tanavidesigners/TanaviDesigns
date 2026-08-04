import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';
import { AnnouncementBar } from '../../components/shared/announcement-bar';
import { ProductCard } from '../../components/storefront/product-card';
import { DataEmptyState } from '../../components/shared/data-empty-state';
import {
  getActiveProducts,
  getCategories,
  getActiveAnnouncement
} from '../../lib/services/catalog-service';

export const revalidate = 30;

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category || '';
  const sort = resolvedParams.sort || 'featured';
  const searchQuery = resolvedParams.q || '';

  const [products, categories, announcement] = await Promise.all([
    getActiveProducts({ categorySlug, sort, searchQuery }),
    getCategories(),
    getActiveAnnouncement()
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const pageTitle = activeCategory ? activeCategory.name : 'The Collection';

  return (
    <div className="shell">
      <AnnouncementBar announcement={announcement} />
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Tanavi Edits</span>
          <h1 style={{ textTransform: 'capitalize' }}>{pageTitle}</h1>
          <p>
            Clothing that meets you where you are—quietly distinctive, thoughtfully made and easy to return to.
          </p>
        </section>

        <section className="section compact">
          <div className="shop-layout">
            {/* Sidebar Filters */}
            <aside className="filters">
              <span className="eyebrow">Filter by Category</span>
              <div className="filter-block">
                <a
                  href="/shop"
                  className={`filter-option ${!categorySlug ? 'active' : ''}`}
                  style={{ fontWeight: !categorySlug ? 600 : 400, color: !categorySlug ? 'var(--accent)' : 'inherit' }}
                >
                  All Pieces ({products.length})
                </a>
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className={`filter-option ${categorySlug === cat.slug ? 'active' : ''}`}
                    style={{ fontWeight: categorySlug === cat.slug ? 600 : 400, color: categorySlug === cat.slug ? 'var(--accent)' : 'inherit' }}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </aside>

            {/* Main Product Grid */}
            <div>
              <div className="shop-toolbar">
                <span className="meta">{products.length} considered pieces</span>
                {categorySlug && (
                  <a href="/shop" className="text-link" style={{ fontSize: 12 }}>
                    Clear Category Filter (✕ {activeCategory?.name})
                  </a>
                )}
              </div>

              {products.length > 0 ? (
                <div className="product-grid">
                  {products.map((p) => (
                    <ProductCard product={p} key={p.id} />
                  ))}
                </div>
              ) : (
                <DataEmptyState
                  title="No pieces found"
                  description="Try clearing your category filter or searching with a different term to explore our collection."
                  actionLabel="Clear Filters"
                  actionHref="/shop"
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
