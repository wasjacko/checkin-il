import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  };
  const close = () => {
    setOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
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
              aria-label="Menu"
              aria-expanded={open}
              onClick={toggle}
            >
              <span></span><span></span><span></span>
            </button>
            <a href="#" onClick={(e) => e.preventDefault()} className="nav-avatar" aria-label="My account">
              <img src="/avatar1.png" alt="User profile" />
            </a>
          </div>
        </div>
      </nav>

      <div className={'nav-overlay' + (open ? ' open' : '')} id="navOverlay">
        <a href="#picks" onClick={close}>The collection</a>
        <a href="#alternating" onClick={close}>By place</a>
        <a href="#submit" onClick={close}>Host with us</a>
        <a href="#faq" onClick={close}>Questions</a>
      </div>
    </>
  );
}
