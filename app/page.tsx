import { Header } from '../components/shared/header';
import { Footer } from '../components/shared/footer';
import { AnnouncementBar } from '../components/shared/announcement-bar';
import { ProductCard } from '../components/storefront/product-card';
import {
  getActiveProducts,
  getCategories,
  getActiveAnnouncement
} from '../lib/services/catalog-service';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [products, categories, announcement] = await Promise.all([
    getActiveProducts({ limit: 8 }),
    getCategories(),
    getActiveAnnouncement()
  ]);

  const newArrivals = products.filter((p) => p.is_new_arrival);
  const displayProducts = newArrivals.length > 0 ? newArrivals : products;

  return (
    <div className="shell">
      <AnnouncementBar announcement={announcement} />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">The Monsoon Edit · 2026</span>
            <h1>A softer<br />way to dress.</h1>
            <p>
              Easy silhouettes, painterly prints, and the quiet beauty of cloth shaped by hand.
              Made in small, considered editions.
            </p>
            <a href="/shop" className="btn">
              Discover the collection <span>→</span>
            </a>
          </div>

          <div className="hero-art">
            <img
              src={
                products[0]?.images?.[0]?.storage_path ||
                'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85'
              }
              alt="Tanavi Designer Apparel"
            />
            <div className="hero-note">
              <span className="eyebrow">Featured</span>
              <br />
              {products[0]?.name || 'Handcrafted Indian Apparel'}
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <section className="section compact">
            <div className="chips">
              <a className="chip active" href="/shop">
                All Collections
              </a>
              {categories.map((cat) => (
                <a className="chip" href={`/shop?category=${cat.slug}`} key={cat.id}>
                  {cat.name}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals Section - Only render when real products exist */}
        {displayProducts.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <span className="eyebrow">Fresh from the studio</span>
                <h2>New this week</h2>
              </div>
              <a href="/shop?sort=newest" className="text-link">
                View all pieces
              </a>
            </div>

            <div className="product-grid">
              {displayProducts.slice(0, 4).map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </section>
        )}

        {/* Shop by Category Section */}
        {categories.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <span className="eyebrow">Find your silhouette</span>
                <h2>Shop by category</h2>
              </div>
            </div>

            <div className="category-grid">
              {categories.slice(0, 3).map((cat, idx) => (
                <a className="category-card" href={`/shop?category=${cat.slug}`} key={cat.id}>
                  <img
                    src={
                      cat.image_url ||
                      products[idx]?.images?.[0]?.storage_path ||
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'
                    }
                    alt={cat.name}
                  />
                  <div className="category-label">
                    <span className="eyebrow">{idx === 0 ? 'Drape & Celebrate' : 'Ease, Considered'}</span>
                    <h3>{cat.name}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Story Section */}
        <section className="story" id="story">
          <div className="story-img">
            <img
              src={
                products[1]?.images?.[0]?.storage_path ||
                'https://images.unsplash.com/photo-1611042553365-9b101441c135?auto=format&fit=crop&w=1200&q=85'
              }
              alt="Artisan textile craftsmanship detail"
            />
          </div>
          <div className="story-copy">
            <span className="eyebrow">The Tanavi Story</span>
            <h2>Clothes with the pace of a keepsake.</h2>
            <p>
              Tanavi began with a belief that beautiful clothes need not shout. Deepika works closely with artisan communities
              and small tailoring ateliers in Andhra Pradesh and Rajasthan to make pieces that feel intimate, useful, and full of life.
            </p>
            <p>
              Every print is placed by hand. Every silhouette is fitted on real bodies. And every edition stays deliberately small.
            </p>
            <a className="text-link" href="/about">
              Read our full story
            </a>
          </div>
        </section>

        {/* Brand Promise Section */}
        <section className="section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Made with intention</span>
              <h2>From hand to wardrobe</h2>
            </div>
          </div>
          <div className="promise">
            <article>
              <span>01</span>
              <h3>Artisan-led craft</h3>
              <p>Block printing, hand painting and embroidery made in partnership with skilled craftspeople.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Considered editions</h3>
              <p>We produce in thoughtful quantities, keeping waste low and every piece distinctive.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Natural comfort</h3>
              <p>Breathable cottons, linens, silks and mulmul selected to feel as beautiful as they look.</p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
