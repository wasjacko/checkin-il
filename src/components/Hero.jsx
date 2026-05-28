import SearchBar from './SearchBar.jsx';

export default function Hero() {
  return (
    <>
    <header className="hero" id="top">
      <div className="hero-image">
        <img
          src="/hero-desert.png"
          alt="Negev landscape — stone mountains in the late golden light"
          fetchpriority="high"
        />
      </div>

      <div className="hero-inner">
        <h1 className="hero-title">
          Find the place
          <em><span className="blue">You'll</span> <span className="green">love to rest.</span></em>
        </h1>
        <p className="hero-tagline">
          A short, private collection of singular homes across Israel, each one visited, vetted, and held to a single standard: that you'll want to come back.
        </p>

        <div className="search-error" id="searchError" role="alert" aria-live="polite">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          <span className="search-error-text"></span>
        </div>

        <SearchBar />
      </div>

      <div className="hero-rating">
        <div className="rating-eyebrow">Quietly trusted</div>
        <div className="rating-row">
          <div className="rating-avatars" aria-hidden="true">
            <img src="/avatar2.png" alt="" loading="lazy" />
            <img src="/avatar3.png" alt="" loading="lazy" />
            <img src="/avatar4.png" alt="" loading="lazy" />
          </div>
          <div className="rating-info">
            <div className="rating-stars">
              ★★★★★
              <span className="rating-score">4,6</span>
            </div>
            <div className="rating-caption">3,000+ stays, mostly returning</div>
          </div>
        </div>
      </div>

      {/* Mobile-only KPI row, bottom of the hero */}
      <div className="hero-kpis-mobile" aria-hidden="true">
        <div className="hero-kpi">
          <span className="hero-kpi-val">120+</span>
          <span className="hero-kpi-label">Residences</span>
        </div>
        <div className="hero-kpi">
          <span className="hero-kpi-val">97%</span>
          <span className="hero-kpi-label">Return rate</span>
        </div>
        <div className="hero-kpi">
          <span className="hero-kpi-val">5+</span>
          <span className="hero-kpi-label">Years curating</span>
        </div>
      </div>
    </header>

    {/* Mobile-only trust strip — sits just below the hero, on the page bg */}
    <div className="hero-trust-strip">
      <span className="trust-stars" aria-hidden="true">★★★★★</span>
      <span className="trust-text">Trusted by 3,000+ returning guests</span>
    </div>
    </>
  );
}
