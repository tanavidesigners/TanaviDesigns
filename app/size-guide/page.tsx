import { Header } from '../../components/shared/header';
import { Footer } from '../../components/shared/footer';

export default function SizeGuidePage() {
  return (
    <div className="shell">
      <Header />

      <main>
        <section className="page-hero">
          <span className="eyebrow">Tanavi Fit</span>
          <h1>Size Guide & Measurement Chart</h1>
          <p>Standard Indian designer garment sizing chart for kurtas, co-ords, dresses, and sarees.</p>
        </section>

        <section className="section compact" style={{ maxWidth: 840, margin: '0 auto' }}>
          <div className="checkout-section" style={{ padding: 32 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, textIndent: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px' }}>Size</th>
                    <th style={{ padding: '12px 8px' }}>Bust (in)</th>
                    <th style={{ padding: '12px 8px' }}>Waist (in)</th>
                    <th style={{ padding: '12px 8px' }}>Hip (in)</th>
                    <th style={{ padding: '12px 8px' }}>Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>XS</td>
                    <td style={{ padding: '12px 8px' }}>32"</td>
                    <td style={{ padding: '12px 8px' }}>26"</td>
                    <td style={{ padding: '12px 8px' }}>36"</td>
                    <td style={{ padding: '12px 8px' }}>13.5"</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>S</td>
                    <td style={{ padding: '12px 8px' }}>34"</td>
                    <td style={{ padding: '12px 8px' }}>28"</td>
                    <td style={{ padding: '12px 8px' }}>38"</td>
                    <td style={{ padding: '12px 8px' }}>14"</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>M</td>
                    <td style={{ padding: '12px 8px' }}>36"</td>
                    <td style={{ padding: '12px 8px' }}>30"</td>
                    <td style={{ padding: '12px 8px' }}>40"</td>
                    <td style={{ padding: '12px 8px' }}>14.5"</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>L</td>
                    <td style={{ padding: '12px 8px' }}>38"</td>
                    <td style={{ padding: '12px 8px' }}>32"</td>
                    <td style={{ padding: '12px 8px' }}>42"</td>
                    <td style={{ padding: '12px 8px' }}>15"</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>XL</td>
                    <td style={{ padding: '12px 8px' }}>40"</td>
                    <td style={{ padding: '12px 8px' }}>34"</td>
                    <td style={{ padding: '12px 8px' }}>44"</td>
                    <td style={{ padding: '12px 8px' }}>15.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong>Saree Specifications:</strong> All sarees are standard 5.5 meters in length and include an unstitched 80cm blouse fabric piece unless specified otherwise.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
