import { Header } from '../../../components/shared/header';
import { Footer } from '../../../components/shared/footer';
import { AnnouncementBar } from '../../../components/shared/announcement-bar';
import { ProductCard } from '../../../components/storefront/product-card';
import { DataEmptyState } from '../../../components/shared/data-empty-state';
import {
  getActiveProducts,
  getCollections,
  getActiveAnnouncement
} from '../../../lib/services/catalog-service';

export const revalidate = 30;

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const collectionSlug = resolvedParams.slug;
  const sort = resolvedSearchParams.sort || 'featured';

  const [allProducts, collections, announcement] = await Promise.all([
    getActiveProducts({ sort }),
    getCollections(),
    getActiveAnnouncement()
  ]);

  const activeCollection = collections.find((c) => c.slug === collectionSlug);
  const pageTitle = activeCollection ? activeCollection.name : collectionSlug.replace(/-/g, ' ');
  const pageDescription = activeCollection?.description || 'Fresh small-batch apparel handcrafted by traditional artisans.';

  // Filter products by collection logic
  let displayProducts = allProducts;
  if (collectionSlug === 'new-arrivals') {
    displayProducts = allProducts.filter((p) => p.is_new_arrival);
    if (displayProducts.length === 0) displayProducts = allProducts;
  }

  return (
    <div className="shell">
      <AnnouncementBar announcement={announcement} />
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Tanavi Collection Edit</span>
          <h1 style={{ textTransform: 'capitalize' }}>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </section>

        <section className="section compact">
          <div className="shop-layout">
            {/* Sidebar Collection Navigation */}
            <aside className="filters">
              <span className="eyebrow">Studio Collections</span>
              <div className="filter-block">
                <a
                  href="/shop"
                  className="filter-option"
                  style={{ fontWeight: 400 }}
                >
                  All Pieces
                </a>
                {collections.map((col) => {
                  const isActive = col.slug === collectionSlug;
                  return (
                    <a
                      key={col.id}
                      href={`/collections/${col.slug}`}
                      className={`filter-option ${isActive ? 'active' : ''}`}
                      style={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--accent)' : 'inherit' }}
                    >
                      {col.name}
                    </a>
                  );
                })}
              </div>
            </aside>

            {/* Product Grid */}
            <div>
              <div className="shop-toolbar">
                <span className="meta">{displayProducts.length} considered pieces in {pageTitle}</span>
                <a href="/shop" className="text-link" style={{ fontSize: 12 }}>
                  View All Catalogue Pieces →
                </a>
              </div>

              {displayProducts.length > 0 ? (
                <div className="product-grid">
                  {displayProducts.map((p) => (
                    <ProductCard product={p} key={p.id} />
                  ))}
                </div>
              ) : (
                <DataEmptyState
                  title={`No ${pageTitle} pieces found`}
                  description="Explore our full catalogue for handcrafted designer apparel."
                  actionLabel="Explore All Pieces"
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
