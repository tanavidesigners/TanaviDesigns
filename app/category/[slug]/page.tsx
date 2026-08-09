import { Header } from '../../../components/shared/header';
import { Footer } from '../../../components/shared/footer';
import { AnnouncementBar } from '../../../components/shared/announcement-bar';
import { ProductCard } from '../../../components/storefront/product-card';
import { DataEmptyState } from '../../../components/shared/data-empty-state';
import {
  getActiveProducts,
  getCategories,
  getActiveAnnouncement
} from '../../../lib/services/catalog-service';

export const revalidate = 30;

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedParams.slug;
  const sort = resolvedSearchParams.sort || 'featured';

  const [products, categories, announcement] = await Promise.all([
    getActiveProducts({ categorySlug, sort }),
    getCategories(),
    getActiveAnnouncement()
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const pageTitle = activeCategory ? activeCategory.name : categorySlug.replace(/-/g, ' ');
  const pageDescription = activeCategory?.description || 'Thoughtfully hand-crafted silhouettes designed for repeat wear.';

  return (
    <div className="shell">
      <AnnouncementBar announcement={announcement} />
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Tanavi Category Edit</span>
          <h1 style={{ textTransform: 'capitalize' }}>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </section>

        <section className="section compact">
          <div className="shop-layout">
            {/* Sidebar Category Navigation */}
            <aside className="filters">
              <span className="eyebrow">Explore Categories</span>
              <div className="filter-block">
                <a
                  href="/shop"
                  className="filter-option"
                  style={{ fontWeight: 400 }}
                >
                  All Pieces
                </a>
                {categories.map((cat) => {
                  const isActive = cat.slug === categorySlug;
                  return (
                    <a
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className={`filter-option ${isActive ? 'active' : ''}`}
                      style={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--accent)' : 'inherit' }}
                    >
                      {cat.name}
                    </a>
                  );
                })}
              </div>
            </aside>

            {/* Product Grid */}
            <div>
              <div className="shop-toolbar">
                <span className="meta">{products.length} considered pieces in {pageTitle}</span>
                <a href="/shop" className="text-link" style={{ fontSize: 12 }}>
                  View All Collection Pieces →
                </a>
              </div>

              {products.length > 0 ? (
                <div className="product-grid">
                  {products.map((p) => (
                    <ProductCard product={p} key={p.id} />
                  ))}
                </div>
              ) : (
                <DataEmptyState
                  title={`No ${pageTitle} pieces found`}
                  description="We are currently crafting new small-batch pieces for this category in our studio."
                  actionLabel="Explore All Collection Pieces"
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
