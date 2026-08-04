import { notFound } from 'next/navigation';
import { Header } from '../../../components/shared/header';
import { Footer } from '../../../components/shared/footer';
import { AnnouncementBar } from '../../../components/shared/announcement-bar';
import { ProductCard } from '../../../components/storefront/product-card';
import { PDPInteractiveControls } from '../../../components/storefront/pdp-controls';
import {
  getProductBySlug,
  getActiveProducts,
  getActiveAnnouncement
} from '../../../lib/services/catalog-service';

export const revalidate = 30;

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [product, announcement] = await Promise.all([
    getProductBySlug(slug),
    getActiveAnnouncement()
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getActiveProducts({
    categorySlug: product.category?.slug,
    limit: 4
  });

  const displayRelated = relatedProducts.filter((p) => p.slug !== product.slug).slice(0, 4);

  const images = product.images && product.images.length > 0
    ? product.images.map((i) => i.storage_path)
    : ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85'];

  return (
    <div className="shell">
      <AnnouncementBar announcement={announcement} />
      <Header />

      <main>
        <section className="product-detail">
          {/* Gallery */}
          <div className="gallery">
            {images.map((imgUrl, idx) => (
              <img
                src={imgUrl}
                alt={`${product.name} view ${idx + 1}`}
                key={idx}
              />
            ))}
          </div>

          {/* Details & Controls */}
          <div className="detail-panel">
            <div className="crumbs">
              <a href="/">Home</a> / <a href="/shop">Shop</a> / {product.name}
            </div>

            {product.is_new_arrival && <span className="eyebrow">New Arrival</span>}
            <h1>{product.name}</h1>
            <div className="meta">
              {product.fabric ? `${product.fabric} · ` : ''}
              {product.craft ? `${product.craft} · ` : ''}
              SKU: {product.sku}
            </div>

            {/* Interactive Size, Quantity & Add to Cart Client Component */}
            <PDPInteractiveControls product={product} />

            <div style={{ marginTop: 28 }}>
              <details className="accordion" open>
                <summary style={{ fontWeight: 600, cursor: 'pointer' }}>Details & Craft</summary>
                <p className="detail-copy">{product.description}</p>
              </details>
              <details className="accordion">
                <summary style={{ fontWeight: 600, cursor: 'pointer' }}>Fabric & Care</summary>
                <p className="detail-copy">
                  {product.fabric || 'Natural Cotton & Silk blend'}.{' '}
                  {product.care_instructions || 'Gentle hand wash separately in cold water; dry in shade.'}
                </p>
              </details>
              <details className="accordion">
                <summary style={{ fontWeight: 600, cursor: 'pointer' }}>Shipping & Returns</summary>
                <p className="detail-copy">
                  {product.dispatch_information || 'Dispatches in 3-5 working days.'} Complimentary shipping across India on orders above ₹2,999. Unworn pieces eligible for 7-day store exchange.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {displayRelated.length > 0 && (
          <section className="section">
            <div className="section-head">
              <h2>You may also love</h2>
            </div>
            <div className="product-grid">
              {displayRelated.map((rel) => (
                <ProductCard product={rel} key={rel.id} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
