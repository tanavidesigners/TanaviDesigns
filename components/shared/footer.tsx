import { buildGeneralWhatsAppUrl } from '../../lib/services/whatsapp-service';

export function Footer() {
  const whatsappUrl = buildGeneralWhatsAppUrl();

  return (
    <>
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>Tanavi by Deepika</h3>
            <p>
              Small-batch Indian clothing, shaped by hand<br />
              and made to stay with you.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <a href="/shop">All Pieces</a>
            <a href="/collections/new-arrivals">New Arrivals</a>
            <a href="/category/sarees">Sarees</a>
            <a href="/category/kurta-sets">Kurta Sets</a>
            <a href="/category/co-ords">Co-ords</a>
          </div>
          <div>
            <h4>Customer Care</h4>
            <a href="/track-order">Track an Order</a>
            <a href="/shipping-policy">Shipping Policy</a>
            <a href="/returns">Returns & Exchanges</a>
            <a href="/size-guide">Size Guide</a>
            <a href="/faqs">FAQs</a>
            <a href="/contact">Contact Us</a>
          </div>
          <div>
            <h4>Studio</h4>
            <p>
              Vijayawada, Andhra Pradesh<br />
              By appointment only<br />
              tanavidesigns@gmail.com
            </p>
          </div>
        </div>
        <div className="copyright">
          <span>© {new Date().getFullYear()} Tanavi by Deepika</span>
          <div>
            <a href="/privacy" style={{ display: 'inline', marginRight: 12 }}>Privacy Policy</a>
            <a href="/terms" style={{ display: 'inline' }}>Terms & Conditions</a>
          </div>
          <span>Crafted slowly in India</span>
        </div>
      </footer>

      <a
        className="wa"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        ◉ &nbsp; Chat on WhatsApp
      </a>
    </>
  );
}
