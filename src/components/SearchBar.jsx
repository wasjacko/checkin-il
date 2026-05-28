import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ALL_DESTS = [
  { value: 'tel-aviv', name: 'Tel Aviv', img: '/telaviv.jpg' },
  { value: 'jerusalem', name: 'Jerusalem', img: '/caesarea.jpg' },
  { value: 'haifa', name: 'Haifa', img: '/telaviv.jpg' },
  { value: 'caesarea', name: 'Caesarea', img: '/caesarea.jpg' },
  { value: 'herzliya', name: 'Herzliya', img: '/appolonia.jpeg' },
  { value: 'eilat', name: 'Eilat', img: '/land.png' },
  { value: 'nazareth', name: 'Nazareth', img: '/nazareth.jpg' },
  { value: 'netanya', name: 'Netanya', img: '/telaviv.jpg' },
  { value: 'tiberias', name: 'Tiberias', img: '/nazareth.jpg' },
  { value: 'jaffa', name: 'Jaffa', img: '/telaviv.jpg' },
  { value: 'galilee', name: 'Upper Galilee', img: '/nazareth.jpg' },
  { value: 'mitzpe-ramon', name: 'Mitzpe Ramon', img: '/land.png' },
];

const RECENT = [
  { value: 'neve-tzedek', title: 'The Neve Tzedek Loft', sub: 'Any week', img: '/telaviv.jpg' },
  { value: 'neve-tzedek-dec', title: 'The Neve Tzedek Loft', sub: '19 Dec — 21 Dec', img: '/telaviv.jpg' },
  { value: 'tel-aviv-recent', title: 'Tel Aviv, Israel', sub: 'Any week', img: '/telaviv.jpg' },
];

const SUGGESTED = [
  { value: 'tel-aviv', name: 'Tel Aviv', img: '/telaviv.jpg' },
  { value: 'herzliya', name: 'Herzliya', img: '/appolonia.jpeg' },
  { value: 'caesarea', name: 'Caesarea', img: '/caesarea.jpg' },
  { value: 'nazareth', name: 'Nazareth', img: '/nazareth.jpg' },
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function fmtDate(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
function sameDay(a, b) {
  return a && b && a.getTime() === b.getTime();
}

export default function SearchBar() {
  // Which popover is open: null | 'dest' | 'date' | 'guests'
  const [openField, setOpenField] = useState(null);
  const formRef = useRef(null);
  const submitBtnRef = useRef(null);

  // Destination state
  // destInputValue: what is displayed in the input field
  // destQuery:      what is used to filter results (cleared after a pick)
  const [destInputValue, setDestInputValue] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [activeDestKey, setActiveDestKey] = useState(null);

  // Date state
  const today = (() => { const t = new Date(); t.setHours(0,0,0,0); return t; })();
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateDisplay, setDateDisplay] = useState('Choose your nights');

  // Guests state
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestsTouched, setGuestsTouched] = useState(false);
  const [guestsDisplay, setGuestsDisplay] = useState('Add who\'s coming');
  const [petsAllowed, setPetsAllowed] = useState(false);

  // === Mobile combined search sheet ===
  // mobileSheetOpen: whether the accordion sheet is open
  // mobileStep: which step is expanded — 'dest' | 'date' | 'guests'
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileStep, setMobileStep] = useState('dest');
  // Error state for the "Show N places" action when destination is missing
  const [mobileError, setMobileError] = useState(null);  // null | 'no-dest'

  // === AI search sheet ===
  const [aiSheetOpen, setAiSheetOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiSending, setAiSending] = useState(false);

  // Close popovers when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!formRef.current) return;
      if (!formRef.current.contains(e.target)) setOpenField(null);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpenField(null); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Update guests display when state changes (if user touched)
  useEffect(() => {
    if (!guestsTouched) return;
    let t = adults + ' adult' + (adults > 1 ? 's' : '');
    if (children > 0) t += ', ' + children + ' child' + (children > 1 ? 'ren' : '');
    setGuestsDisplay(t);
  }, [adults, children, guestsTouched]);

  // Lock body scroll when ANY sheet is open (desktop popover, mobile accordion, AI)
  useEffect(() => {
    const anyOpen = openField || mobileSheetOpen || aiSheetOpen;
    if (anyOpen) document.body.classList.add('sheet-open');
    else document.body.classList.remove('sheet-open');
    return () => document.body.classList.remove('sheet-open');
  }, [openField, mobileSheetOpen, aiSheetOpen]);

  // === AI sheet handlers ===
  const onAISubmit = () => {
    if (!aiQuery.trim()) return;
    setAiSending(true);
    // Mock: in production, post aiQuery to the AI search backend
    setTimeout(() => {
      setAiSending(false);
      setAiSheetOpen(false);
      setAiQuery('');
      const btn = submitBtnRef.current;
      if (btn) {
        btn.classList.remove('is-pulse');
        void btn.offsetWidth;
        btn.classList.add('is-pulse');
        setTimeout(() => btn.classList.remove('is-pulse'), 700);
      }
    }, 900);
  };

  // === Mobile combined sheet handlers ===
  const openMobileSheet = () => {
    setMobileSheetOpen(true);
    setMobileStep('dest');
  };
  const closeMobileSheet = () => setMobileSheetOpen(false);
  const clearAll = () => {
    setDestInputValue('');
    setDestQuery('');
    setActiveDestKey(null);
    setStartDate(null);
    setEndDate(null);
    setDateDisplay('Choose your nights');
    setAdults(2);
    setChildren(0);
    setGuestsTouched(false);
    setGuestsDisplay("Add who's coming");
    setPetsAllowed(false);
    setMobileStep('dest');
  };

  // Mock count — would come from a real search API
  const placesCount = 124;

  const toggleField = (field) => setOpenField((cur) => (cur === field ? null : field));

  // ---------- DESTINATION ----------
  const filteredDests = (() => {
    const q = destQuery.trim().toLowerCase();
    if (!q) return null;
    return ALL_DESTS.filter((d) => d.name.toLowerCase().includes(q));
  })();

  const pickDest = (item) => {
    const text = item.name || item.title;
    setDestInputValue(text);
    setActiveDestKey(item.value);
    setDestQuery('');
    setOpenField(null);
  };

  const onDestFlexible = (e) => {
    e.stopPropagation();
    setDestInputValue('Anywhere');
    setDestQuery('');
    setOpenField(null);
  };

  // ---------- CALENDAR ----------
  const inRange = (d) => startDate && endDate && d > startDate && d < endDate;

  function selectDate(d) {
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
    } else if (d < startDate) {
      setEndDate(startDate);
      setStartDate(d);
    } else if (sameDay(d, startDate)) {
      setStartDate(null);
      setEndDate(null);
    } else {
      setEndDate(d);
    }
  }

  // Update display when range changes
  useEffect(() => {
    if (startDate && endDate) setDateDisplay(fmtDate(startDate) + ' — ' + fmtDate(endDate));
    else if (startDate) setDateDisplay(fmtDate(startDate) + ' — ?');
    else if (dateDisplay !== 'Open dates') setDateDisplay('Choose your nights');
    // Auto-advance to Guests step once a full range is set on mobile
    if (startDate && endDate && mobileSheetOpen && mobileStep === 'date') {
      setMobileStep('guests');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const onDateFlexible = (e) => {
    e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    setDateDisplay('Open dates');
    setOpenField(null);
  };

  const renderMonth = (year, month) => {
    const grid = [];
    DAY_NAMES.forEach((n, i) => grid.push(
      <div key={'h' + i} className="cal-day-name">{n.toUpperCase()}</div>
    ));
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < startDay; i++) {
      grid.push(<div key={'e' + i} className="cal-day empty"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const disabled = cellDate < today;
      const isStart = sameDay(cellDate, startDate);
      const isEnd = sameDay(cellDate, endDate);
      const isRange = inRange(cellDate);
      const classes = ['cal-day'];
      if (disabled) classes.push('disabled');
      if (isStart) classes.push('selected', 'range-start');
      if (isEnd) classes.push('selected', 'range-end');
      if (isRange) classes.push('in-range');
      grid.push(
        <button
          key={'d' + d}
          type="button"
          className={classes.join(' ')}
          onClick={(e) => { e.stopPropagation(); if (!disabled) selectDate(cellDate); }}
        >
          {d}
        </button>
      );
    }
    return grid;
  };

  // ---------- GUESTS ----------
  const onGuestsFlexible = (e) => {
    e.stopPropagation();
    setGuestsDisplay('Open');
    setOpenField(null);
  };

  const bumpAdults = (delta) => {
    setGuestsTouched(true);
    setAdults((a) => {
      const n = a + delta;
      return Math.min(12, Math.max(1, n));
    });
  };
  const bumpChildren = (delta) => {
    setGuestsTouched(true);
    setChildren((c) => {
      const n = c + delta;
      return Math.min(8, Math.max(0, n));
    });
  };

  // ---------- SUBMIT ----------
  const onSubmit = (e) => {
    e.preventDefault();
    const btn = submitBtnRef.current;
    if (btn) {
      btn.classList.remove('is-pulse');
      // eslint-disable-next-line no-unused-expressions
      void btn.offsetWidth;
      btn.classList.add('is-pulse');
      setTimeout(() => btn.classList.remove('is-pulse'), 700);
    }
    // No auto-scroll on submit — the pulse is enough feedback. A real
    // search would route to /results; until that exists, jumping the page
    // around (especially to a section that moved to the end) is jarring.
  };

  // Month rendering
  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const ny = m === 11 ? y + 1 : y;
  const nm = m === 11 ? 0 : m + 1;

  return (
    <>
    <form
      ref={formRef}
      className="search"
      id="heroSearch"
      autoComplete="off"
      aria-label="Search a residence"
      onSubmit={onSubmit}
    >
      {/* Mobile-only: single CTA that opens the combined search sheet.
          Mirrors the desktop button structure exactly:
          outer wrap (teal-40% gradient) → inner (teal-70% gradient) → navy
          button with 3 box-shadow strokes (grey/white/grey).
          Hidden on desktop via CSS. */}
      <div className="search-mobile-cta-wrap">
        <div className="search-mobile-cta-inner">
          <button
            type="button"
            className="search-mobile-cta"
            onClick={openMobileSheet}
            aria-label="Search residences"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.5-4.5" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* DESTINATION */}
      <div
        className={'search-field' + (openField === 'dest' ? ' is-open' : '')}
        data-field="dest"
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={openField === 'dest'}
        aria-controls="popDest"
        onClick={(e) => { e.stopPropagation(); toggleField('dest'); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            toggleField('dest');
          }
        }}
      >
        <span className="field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
        <div className="field-text">
        <label className="search-label" htmlFor="destInput">Where</label>
        <input
          className={'search-value search-input' + (destInputValue ? ' is-filled' : '')}
          id="destInput"
          data-display="dest"
          type="search"
          inputMode="search"
          enterKeyHint="search"
          placeholder="Anywhere in Israel"
          autoComplete="off"
          value={destInputValue}
          onClick={(e) => { e.stopPropagation(); if (openField !== 'dest') setOpenField('dest'); }}
          onFocus={() => { if (openField !== 'dest') setOpenField('dest'); }}
          onChange={(e) => {
            const v = e.target.value;
            setDestInputValue(v);
            setDestQuery(v);
          }}
        />
        </div>
        <span className="field-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>

        <div
          className={'search-popover dest-popover' + (openField === 'dest' ? ' open' : '')}
          id="popDest"
          role="dialog"
          aria-label="Choose destination"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="dest-header">
            <div className="dest-title">Where to?</div>
            <button type="button" className="dest-flexible" onClick={onDestFlexible}>I'm open</button>
          </div>

          {filteredDests !== null ? (
            <div className="dest-results">
              {filteredDests.length === 0 ? (
                <div className="dest-section-label">No matches for "{destQuery.trim().replace(/[<>&]/g, '')}"</div>
              ) : (
                <>
                  <div className="dest-section-label">Results</div>
                  <ul className="dest-recent-list">
                    {filteredDests.map((d) => (
                      <li
                        key={d.value}
                        className={'dest-recent-item' + (activeDestKey === d.value ? ' is-active' : '')}
                        data-value={d.value}
                        data-display-text={d.name}
                        onClick={() => pickDest(d)}
                      >
                        <div className="dest-recent-thumb"><img src={d.img} alt="" /></div>
                        <div>
                          <div className="dest-recent-title">{d.name}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <div className="dest-default-content">
              <div className="dest-section">
                <div className="dest-section-label">You've looked at</div>
                <ul className="dest-recent-list">
                  {RECENT.map((r) => (
                    <li
                      key={r.value}
                      className={'dest-recent-item' + (activeDestKey === r.value ? ' is-active' : '')}
                      data-value={r.value}
                      data-display-text={r.title}
                      onClick={() => pickDest({ value: r.value, name: r.title })}
                    >
                      <div className="dest-recent-thumb">
                        <img src={r.img} alt="" />
                        <span className="dest-recent-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <polyline points="12 7 12 12 15 14" />
                          </svg>
                        </span>
                      </div>
                      <div>
                        <div className="dest-recent-title">{r.title}</div>
                        <div className="dest-recent-sub">{r.sub}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dest-section">
                <div className="dest-section-label">Quietly recommended</div>
                <div className="dest-suggested-grid">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      className="dest-suggested"
                      data-value={s.value}
                      data-display-text={s.name}
                      onClick={() => pickDest(s)}
                    >
                      <div className="dest-suggested-img">
                        <img src={s.img} alt={s.name} loading="lazy" />
                      </div>
                      <div className="dest-suggested-name">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DATE */}
      <div
        className={'search-field' + (openField === 'date' ? ' is-open' : '')}
        data-field="date"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={openField === 'date'}
        aria-controls="popCalendar"
        onClick={(e) => { e.stopPropagation(); toggleField('date'); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            toggleField('date');
          }
        }}
      >
        <span className="field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <div className="field-text">
        <span className="search-label">When</span>
        <span
          className={'search-value' + (dateDisplay !== 'Choose your nights' ? ' is-filled' : '')}
          data-display="date"
        >{dateDisplay}</span>
        <input type="hidden" id="dateArrival" value={startDate ? startDate.toISOString().slice(0, 10) : ''} readOnly />
        <input type="hidden" id="dateDeparture" value={endDate ? endDate.toISOString().slice(0, 10) : ''} readOnly />
        </div>
        <span className="field-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>

        <div
          className={'search-popover calendar-popover' + (openField === 'date' ? ' open' : '')}
          id="popCalendar"
          role="dialog"
          aria-label="Choose dates"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cal-header">
            <div className="cal-title">Your nights</div>
            <button type="button" className="cal-flexible" onClick={onDateFlexible}>I'm open</button>
          </div>
          <div className="cal-months">
            <button
              type="button"
              className="cal-nav"
              data-act="prev"
              aria-label="Previous month"
              onClick={(e) => { e.stopPropagation(); setViewDate(new Date(y, m - 1, 1)); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="cal-nav"
              data-act="next"
              aria-label="Next month"
              onClick={(e) => { e.stopPropagation(); setViewDate(new Date(y, m + 1, 1)); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <div className="cal-month" data-month-idx="0">
              <div className="cal-month-head"><span className="cal-month-name">{MONTH_NAMES[m] + ' ' + y}</span></div>
              <div className="cal-grid">{renderMonth(y, m)}</div>
            </div>
            <div className="cal-month" data-month-idx="1">
              <div className="cal-month-head"><span className="cal-month-name">{MONTH_NAMES[nm] + ' ' + ny}</span></div>
              <div className="cal-grid">{renderMonth(ny, nm)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* GUESTS */}
      <div
        className={'search-field' + (openField === 'guests' ? ' is-open' : '')}
        data-field="guests"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={openField === 'guests'}
        aria-controls="popGuests"
        onClick={(e) => { e.stopPropagation(); toggleField('guests'); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            toggleField('guests');
          }
        }}
      >
        <span className="field-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </span>
        <div className="field-text">
        <span className="search-label">Who</span>
        <span
          className={'search-value' + (guestsDisplay !== "Add who's coming" ? ' is-filled' : '')}
          data-display="guests"
        >{guestsDisplay}</span>
        </div>
        <span className="field-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>

        <div
          className={'search-popover guests-popover' + (openField === 'guests' ? ' open' : '')}
          id="popGuests"
          role="dialog"
          aria-label="Choose guests"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="guests-header">
            <div className="guests-title">Who's joining you</div>
            <button type="button" className="guests-flexible" onClick={onGuestsFlexible}>I'm open</button>
          </div>
          <div className="guests-grid">
            <div className="popover-row">
              <div>
                <div className="popover-label-name">Adults</div>
                <div className="popover-hint">Ages 13+</div>
              </div>
              <div className="counter" data-counter="adults">
                <button
                  className="counter-btn"
                  type="button"
                  data-act="dec"
                  aria-label="Decrease"
                  disabled={adults <= 1}
                  onClick={(e) => { e.stopPropagation(); bumpAdults(-1); }}
                >−</button>
                <span className="counter-val">{adults}</span>
                <button
                  className="counter-btn"
                  type="button"
                  data-act="inc"
                  aria-label="Increase"
                  onClick={(e) => { e.stopPropagation(); bumpAdults(1); }}
                >+</button>
              </div>
            </div>
            <div className="popover-row">
              <div>
                <div className="popover-label-name">Children</div>
                <div className="popover-hint">Ages 2-12</div>
              </div>
              <div className="counter" data-counter="children">
                <button
                  className="counter-btn"
                  type="button"
                  data-act="dec"
                  aria-label="Decrease"
                  disabled={children <= 0}
                  onClick={(e) => { e.stopPropagation(); bumpChildren(-1); }}
                >−</button>
                <span className="counter-val">{children}</span>
                <button
                  className="counter-btn"
                  type="button"
                  data-act="inc"
                  aria-label="Increase"
                  onClick={(e) => { e.stopPropagation(); bumpChildren(1); }}
                >+</button>
              </div>
            </div>
          </div>
          <div className="popover-row">
            <div>
              <div className="popover-label-name">Pets</div>
              <div className="popover-hint">Welcomed by request <span className="guests-info-i">i</span></div>
            </div>
            <label className="toggle-switch" aria-label="Allow animals">
              <input type="checkbox" data-toggle="animals" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="search-submit-wrap">
        <div className="search-submit-inner">
          <button
            ref={submitBtnRef}
            type="submit"
            className="search-submit"
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.5-4.5" />
            </svg>
          </button>
        </div>
      </div>
    </form>

    {/* ============ AI SEARCH — aspirational benefit-led CTA ============
        First-person wording sells the BENEFIT, not the tech. The arrow
        signals "go" — together they invite the user to try the smarter route. */}
    <button
      type="button"
      className="search-ai-cta"
      onClick={() => setAiSheetOpen(true)}
      aria-label="Find me my perfect place with AI"
    >
      <span className="ai-sparkle" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 2 L11.4 7.6 17 9 L11.4 10.4 10 16 L8.6 10.4 3 9 L8.6 7.6 Z" />
          <path d="M18 13 L18.7 15.8 21.5 16.5 L18.7 17.2 18 20 L17.3 17.2 14.5 16.5 L17.3 15.8 Z" />
        </svg>
      </span>
      <span className="ai-cta-text">
        <span className="ai-cta-headline">Find me my perfect place</span>
        <span className="ai-cta-sub">Search with AI</span>
      </span>
      <svg className="ai-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>

    {/* ============ MOBILE COMBINED SEARCH SHEET (portaled to body) ============
        One sheet, 3 accordion rows. Only the active step shows its content.
        Rendered via createPortal so it sits ABOVE every stacking context
        on the page (nav, hero, etc.). Hidden on desktop via CSS. */}
    {createPortal(
      <>
        {(openField || mobileSheetOpen) && (
          <div
            className="sheet-backdrop sheet-backdrop-top"
            onClick={() => {
              setOpenField(null);
              setMobileSheetOpen(false);
              setMobileError(null);
            }}
            aria-hidden="true"
          />
        )}
        <div
          className={'search-mobile-sheet' + (mobileSheetOpen ? ' open' : '')}
          role="dialog"
          aria-label="Search residences"
          aria-modal="true"
        >
          <div className="mobile-sheet-top">
            <span className="mobile-sheet-grabber" aria-hidden="true" />
            <button
              type="button"
              className="mobile-sheet-close"
              onClick={() => {
                setMobileSheetOpen(false);
                setMobileError(null);
              }}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

      <div className="mobile-sheet-scroll">
        {/* ---- DESTINATION ---- */}
        <div className={
          'mobile-step'
          + (mobileStep === 'dest' ? ' is-active' : '')
          + (mobileError === 'no-dest' ? ' has-error' : '')
        }>
          <button
            type="button"
            className="mobile-step-header"
            onClick={() => setMobileStep('dest')}
          >
            <span className="step-label">Destination</span>
            <span className="step-value">
              {mobileStep === 'dest'
                ? 'Selected'
                : (destInputValue || 'Select…')}
            </span>
          </button>
          {mobileStep === 'dest' && (
            <div className="mobile-step-body">
              <div className="mobile-dest-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m20 20-4.5-4.5" />
                </svg>
                <input
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder="Search destinations"
                  value={destInputValue}
                  onChange={(e) => {
                    setDestInputValue(e.target.value);
                    setDestQuery(e.target.value);
                    if (mobileError) setMobileError(null);
                  }}
                  autoComplete="off"
                />
              </div>

              {filteredDests !== null ? (
                <div className="mobile-dest-results">
                  <ul className="dest-recent-list">
                    {filteredDests.length === 0 ? (
                      <li className="dest-section-label">No matches for "{destQuery}"</li>
                    ) : (
                      filteredDests.map((d) => (
                        <li
                          key={d.value}
                          className="mobile-dest-result"
                          onClick={() => {
                            pickDest(d);
                            setMobileStep('date');
                          }}
                        >
                          <span className="mobile-dest-pin" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </span>
                          <span className="mobile-dest-name">{d.name}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="dest-section">
                    <div className="dest-section-label">Recent searches</div>
                    <ul className="dest-recent-list">
                      {RECENT.map((r) => (
                        <li
                          key={r.value}
                          className="dest-recent-item"
                          onClick={() => {
                            pickDest({ value: r.value, name: r.title });
                            setMobileStep('date');
                          }}
                        >
                          <div className="dest-recent-thumb">
                            <img src={r.img} alt="" />
                            <span className="dest-recent-icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9" />
                                <polyline points="12 7 12 12 15 14" />
                              </svg>
                            </span>
                          </div>
                          <div>
                            <div className="dest-recent-title">{r.title}</div>
                            <div className="dest-recent-sub">{r.sub}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="dest-section">
                    <div className="dest-section-label">Suggested destinations</div>
                    <div className="mobile-suggested-scroller">
                      {SUGGESTED.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className="mobile-suggested-card"
                          onClick={() => {
                            pickDest(s);
                            setMobileStep('date');
                          }}
                        >
                          <div className="mobile-suggested-img">
                            <img src={s.img} alt={s.name} loading="lazy" />
                          </div>
                          <div className="mobile-suggested-name">{s.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ---- DATES ---- */}
        <div className={'mobile-step' + (mobileStep === 'date' ? ' is-active' : '')}>
          <button
            type="button"
            className="mobile-step-header"
            onClick={() => setMobileStep('date')}
          >
            <span className="step-label">Dates</span>
            <span className="step-value">
              {mobileStep === 'date'
                ? 'Selected'
                : (dateDisplay === 'Choose your nights' ? 'Select…' : dateDisplay)}
            </span>
          </button>
          {mobileStep === 'date' && (
            <div className="mobile-step-body">
              <div className="cal-months mobile-cal-months">
                <button
                  type="button"
                  className="cal-nav"
                  data-act="prev"
                  aria-label="Previous month"
                  onClick={(e) => { e.stopPropagation(); setViewDate(new Date(y, m - 1, 1)); }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="cal-nav"
                  data-act="next"
                  aria-label="Next month"
                  onClick={(e) => { e.stopPropagation(); setViewDate(new Date(y, m + 1, 1)); }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <div className="cal-month">
                  <div className="cal-month-head"><span className="cal-month-name">{MONTH_NAMES[m] + ' ' + y}</span></div>
                  <div className="cal-grid">{renderMonth(y, m)}</div>
                </div>
                <div className="cal-month">
                  <div className="cal-month-head"><span className="cal-month-name">{MONTH_NAMES[nm] + ' ' + ny}</span></div>
                  <div className="cal-grid">{renderMonth(ny, nm)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---- GUESTS ---- */}
        <div className={'mobile-step' + (mobileStep === 'guests' ? ' is-active' : '')}>
          <button
            type="button"
            className="mobile-step-header"
            onClick={() => setMobileStep('guests')}
          >
            <span className="step-label">Guests</span>
            <span className="step-value">
              {mobileStep === 'guests'
                ? 'Selected'
                : (guestsDisplay === "Add who's coming" ? 'Select…' : guestsDisplay)}
            </span>
          </button>
          {mobileStep === 'guests' && (
            <div className="mobile-step-body">
              <div className="popover-row">
                <div>
                  <div className="popover-label-name">Adults</div>
                  <div className="popover-hint">Ages 13+</div>
                </div>
                <div className="counter">
                  <button
                    className="counter-btn"
                    type="button"
                    aria-label="Decrease adults"
                    disabled={adults <= 1}
                    onClick={() => bumpAdults(-1)}
                  >−</button>
                  <span className="counter-val">{adults}</span>
                  <button
                    className="counter-btn"
                    type="button"
                    aria-label="Increase adults"
                    onClick={() => bumpAdults(1)}
                  >+</button>
                </div>
              </div>
              <div className="popover-row">
                <div>
                  <div className="popover-label-name">Children</div>
                  <div className="popover-hint">Ages 2-12</div>
                </div>
                <div className="counter">
                  <button
                    className="counter-btn"
                    type="button"
                    aria-label="Decrease children"
                    disabled={children <= 0}
                    onClick={() => bumpChildren(-1)}
                  >−</button>
                  <span className="counter-val">{children}</span>
                  <button
                    className="counter-btn"
                    type="button"
                    aria-label="Increase children"
                    onClick={() => bumpChildren(1)}
                  >+</button>
                </div>
              </div>
              <div className="popover-row">
                <div>
                  <div className="popover-label-name">Pets</div>
                  <div className="popover-hint">Welcomed by request</div>
                </div>
                <label className="toggle-switch" aria-label="Allow pets">
                  <input
                    type="checkbox"
                    checked={petsAllowed}
                    onChange={(e) => setPetsAllowed(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="mobile-sheet-actions">
        <button
          type="button"
          className="action-clear"
          onClick={clearAll}
        >
          Clear all
        </button>
        <button
          type="button"
          className="action-show"
          onClick={() => {
            // Validation: a destination is required to "search"
            if (!destInputValue.trim()) {
              setMobileError('no-dest');
              setMobileStep('dest');
              // shake animation hook — reset then re-apply
              setTimeout(() => setMobileError((cur) => (cur === 'no-dest' ? 'no-dest' : null)), 0);
              return;
            }
            setMobileError(null);
            closeMobileSheet();
            const btn = submitBtnRef.current;
            if (btn) {
              btn.classList.remove('is-pulse');
              void btn.offsetWidth;
              btn.classList.add('is-pulse');
              setTimeout(() => btn.classList.remove('is-pulse'), 700);
            }
          }}
        >
          Show {placesCount} places
        </button>
      </div>
      {mobileError === 'no-dest' && (
        <div className="mobile-sheet-error" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          <span>Choose a destination first.</span>
        </div>
      )}
    </div>
    </>,
    document.body
    )}

    {/* ============ AI SEARCH SHEET (portaled to body) ============ */}
    {createPortal(
      <>
        {aiSheetOpen && (
          <div
            className="sheet-backdrop sheet-backdrop-top sheet-backdrop-ai"
            onClick={() => setAiSheetOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          className={'search-ai-sheet' + (aiSheetOpen ? ' open' : '')}
          role="dialog"
          aria-label="Describe your stay"
          aria-modal="true"
        >
          <div className="mobile-sheet-top">
            <span className="mobile-sheet-grabber" aria-hidden="true" />
            <button
              type="button"
              className="mobile-sheet-close"
              onClick={() => setAiSheetOpen(false)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="ai-sheet-content">
            <div className="ai-sheet-header">
              <span className="ai-sparkle ai-sparkle-lg" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 2 L11.4 7.6 17 9 L11.4 10.4 10 16 L8.6 10.4 3 9 L8.6 7.6 Z" />
                  <path d="M18 13 L18.7 15.8 21.5 16.5 L18.7 17.2 18 20 L17.3 17.2 14.5 16.5 L17.3 15.8 Z" />
                </svg>
              </span>
              <h3 className="ai-sheet-title">Describe your stay</h3>
              <p className="ai-sheet-subtitle">
                Tell us what you have in mind — we&rsquo;ll find the closest residences.
              </p>
            </div>

            <textarea
              className="ai-sheet-textarea"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="A quiet stone house in the Upper Galilee, four nights in late September. Two adults, somewhere with a view, a pool would be nice…"
              rows={5}
              enterKeyHint="send"
              aria-label="Describe your stay"
            />

            <div className="ai-sheet-suggestions">
              <span className="ai-sheet-suggestions-label">Or try…</span>
              <div className="ai-sheet-chips">
                {[
                  'A weekend in Tel Aviv with a sea view',
                  'A farmhouse near Caesarea for a family of four',
                  'Late September in the Galilee, quiet',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="ai-sheet-chip"
                    onClick={() => setAiQuery(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="ai-sheet-submit"
              onClick={onAISubmit}
              disabled={!aiQuery.trim() || aiSending}
            >
              {aiSending ? 'Finding…' : 'Find places'}
              {!aiSending && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </>,
      document.body
    )}
    </>
  );
}
