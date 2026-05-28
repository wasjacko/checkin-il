export default function Nav() {
  return (
    <nav className="nav" id="nav">
      <a href="#top" className="logo" aria-label="checkin — home">
        <img
          className="logo-img"
          src="/checkin-logo.png"
          alt="checkin"
          width="346"
          height="100"
        />
      </a>
      <div className="nav-right">
        <button className="nav-globe" type="button" aria-label="Language & region">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9.5" />
            <path d="M3 12h18" />
            <path d="M12 2.5c2.8 3 4.4 6.2 4.4 9.5s-1.6 6.5-4.4 9.5" />
            <path d="M12 2.5c-2.8 3-4.4 6.2-4.4 9.5s1.6 6.5 4.4 9.5" />
          </svg>
        </button>
        <a href="#submit" className="nav-host">Host with us</a>
        <div className="nav-menu-pill">
          <button
            className="nav-burger"
            type="button"
            aria-label="Menu (coming soon)"
            disabled
          >
            <span></span><span></span><span></span>
          </button>
          <span className="nav-avatar" aria-hidden="true">
            <img src="/avatar1.png" alt="" />
          </span>
        </div>
      </div>
    </nav>
  );
}
