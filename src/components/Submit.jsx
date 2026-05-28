export default function Submit() {
  return (
    <section className="submit" id="submit">
      <div className="wrap">
        <div className="submit-text reveal">
          <span className="submit-eyebrow">For host</span>
          <h2 className="submit-title">
            <span className="submit-title-serif">Do you have</span>
            <span className="submit-title-sans">a home we <span className="accent">need to know?</span></span>
          </h2>
          <p className="submit-desc">
            We look for places with character. Doesn&rsquo;t have to be large, doesn&rsquo;t have to be expensive. Has to be real: a place where you feel the hands that built it and the people who live there.
          </p>
        </div>
        <div className="submit-media reveal reveal-d2">
          <div className="submit-media-imgs">
            <div className="submit-img-main"><img src="/form.png" alt="A residence" loading="lazy" /></div>
            <div className="submit-img-sub"><img src="/formsub.png" alt="Interior detail" loading="lazy" /></div>
          </div>
        </div>
        {/* CTA as an independent grid item — placed via grid-area per breakpoint */}
        <a className="submit-cta-button reveal reveal-d3" href="#submit" onClick={(e) => e.preventDefault()} aria-label="Submit your home">
          <span>Submit your home</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </section>
  );
}
