import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';

export default function AboutPage() {
  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Our Philosophy</span>
          <h1>About Tanavi by Deepika</h1>
        </section>

        <section className="section compact" style={{ maxWidth: 840, margin: '0 auto', fontSize: 15, lineHeight: 1.8, color: 'var(--muted)' }}>
          <div className="checkout-section" style={{ padding: 40 }}>
            <h2 style={{ fontFamily: '"Fraunces", serif', color: 'var(--ink)', fontSize: 32, margin: '0 0 16px' }}>
              Crafted slowly, worn with ease.
            </h2>
            <p>
              Tanavi by Deepika was born out of a deep reverence for slow fashion, natural textiles, and the rich heritage of Indian handloom crafts.
              Deepika founded the label to create clothing that does not chase transient trends, but rather celebrates understated elegance, breathable comfort, and timeless silhouttes.
            </p>
            <p>
              Operating from our studio in Vijayawada, we work closely with artisan block printers, bandhani dyers, and handloom weavers across Andhra Pradesh and Rajasthan. Every collection is produced in small, limited editions to preserve hand-craftsmanship and maintain minimal studio waste.
            </p>
            <div style={{ margin: '32px 0 0', display: 'flex', gap: 16 }}>
              <a className="btn" href="/shop">Explore Our Creations</a>
              <a className="btn secondary" href="/contact">Visit Our Studio</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
