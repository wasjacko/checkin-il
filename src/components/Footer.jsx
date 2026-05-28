export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <a href="#top" className="logo" aria-label="checkin — home">
            <img className="logo-img" src="/checkin-logo.png" alt="checkin" />
          </a>
          <div className="footer-pills">
            <button className="footer-pill" type="button">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <ellipse cx="12" cy="12" rx="4.5" ry="9" />
              </svg>
              English (US)
            </button>
            <button className="footer-pill" type="button">$ USD</button>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Concierge</h4>
            <ul>
              <li><a href="#faq">Speak to us</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Cancellations</a></li>
            </ul>
          </div>
          <div>
            <h4>The house</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Our story</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Partners</a></li>
            </ul>
          </div>
          <div>
            <h4>For owners</h4>
            <ul>
              <li><a href="#submit">Host with us</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Owner&rsquo;s guide</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© <span id="year">{year}</span> CheckIn, Inc.</span>
        <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Sitemap</a>
      </div>
    </footer>
  );
}
