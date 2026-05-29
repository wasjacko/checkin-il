import { useIsMobile } from '../hooks/useIsMobile.js';

export default function Picks() {
  const isMobile = useIsMobile();

  const set1 = [
    { src: '/slider1.png', wide: false, label: 'Stone & Sea',     location: 'Apollonia' },
    { src: '/slider2.png', wide: true,  label: 'Atelier 14',      location: 'Tel-Aviv' },
    { src: '/slider3.png', wide: false, label: 'Maison Carmel',   location: 'Haifa' },
    { src: '/slider4.png', wide: false, label: 'Villa Ramat',     location: 'Galilee' },
    { src: '/slider6.jpg', wide: false, label: 'House of Light',  location: 'Jaffa' },
    { src: '/slider7.jpg', wide: true,  label: 'The Olive Court', location: 'Nazareth' },
    { src: '/slider8.jpg', wide: false, label: 'Casa Negev',      location: 'Mitzpe Ramon' },
    { src: '/slider9.jpg', wide: false, label: 'Beit Shoresh',    location: 'Jerusalem Hills' },
  ];

  return (
    <section className="picks" id="picks">
      <div className="picks-header reveal">
        <div className="stats-eyebrow stats-eyebrow--invert">
          <span className="line"></span>
          <span>Take a look at</span>
          <span className="line"></span>
        </div>
        <h2 className="picks-title">CHECKIN&rsquo;S PICKS</h2>
      </div>

      {isMobile ? (
        <>
          {/* Mobile-only: horizontal scroll-snap carousel of tall cards */}
          <div className="picks-carousel reveal reveal-d1" aria-label="Featured residences">
            {set1.map((it, i) => (
              <article key={'m' + i} className="picks-card">
                <div className="picks-card-media">
                  <img src={it.src} alt={it.label + ' — ' + it.location} loading="lazy" decoding="async" />
                </div>
                <div className="picks-card-info">
                  <div className="picks-card-label">{it.label}</div>
                  <div className="picks-card-location">{it.location}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="picks-footer reveal reveal-d2">
            <a
              className="picks-viewall"
              href="#picks"
              onClick={(e) => e.preventDefault()}
              aria-label="View the full collection"
            >
              <span>View the full collection</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </>
      ) : (
        // Desktop: frozen /goal marquee — plain images, duplicated for a seamless loop.
        <div className="picks-marquee reveal reveal-d1">
          <div className="picks-row">
            {set1.map((it, i) => (
              <div key={'a' + i} className={'picks-item' + (it.wide ? ' picks-item-wide' : '')}>
                <img src={it.src} alt="Featured residence" loading="lazy" decoding="async" />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {set1.map((it, i) => (
              <div key={'b' + i} className={'picks-item' + (it.wide ? ' picks-item-wide' : '')} aria-hidden="true">
                <img src={it.src} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
