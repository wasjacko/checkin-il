import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * AiChat — mobile conversational sheet ("Chat with AI").
 *
 * A fully scripted front-end demo (no backend): the user picks a suggestion or
 * types/speaks a request, and the assistant replies on a timer, eventually
 * surfacing a horizontal carousel of curated residences. Mirrors the product
 * screenshots, harmonised to the brand teal (--teal) instead of the mock orange.
 *
 * States reproduced:
 *  1. Empty   — sparkle badge, title, 3 suggestion pills, input + mic + send
 *  2. Filled  — tapping a suggestion fills the input (no keyboard) + send active
 *  3. Chat    — user/AI bubbles, typing indicator, property-card carousel
 *  4. Voice   — record dot + animated waveform + send
 */

const SUGGESTIONS = [
  { icon: 'search', text: 'Find the best property for Tel Aviv in September' },
  { icon: 'compare', text: 'Compare top-rated hotels in Eilat' },
  { icon: 'photo', text: 'Identify a landmark from a photo' },
];

const CURATED = [
  { img: '/telaviv.jpg', name: 'The Jaffa House', loc: 'Tel Aviv', price: 450, rating: 4.92 },
  { img: '/appolonia.jpeg', name: 'Royal Beach', loc: 'Herzliya', price: 520, rating: 4.88 },
  { img: '/caesarea.jpg', name: 'Caesarea Villa', loc: 'Caesarea', price: 610, rating: 4.95 },
];

const VOICE_TRANSCRIPT = 'Find me a quiet villa with a sea view, late September.';

function SuggestionIcon({ kind }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  if (kind === 'compare') {
    return (
      <svg {...common}>
        <line x1="6" y1="20" x2="6" y2="13" />
        <line x1="12" y1="20" x2="12" y2="8" />
        <line x1="18" y1="20" x2="18" y2="4" />
      </svg>
    );
  }
  if (kind === 'photo') {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="8.5" cy="9.5" r="1.6" />
        <path d="M21 16l-5-5L5 20" />
      </svg>
    );
  }
  // search
  return (
    <svg {...common}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

export default function AiChat({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const sheetRef = useRef(null);
  const userMsgCount = useRef(0);
  const timers = useRef([]);

  const hasConversation = messages.length > 0 || typing;
  const canSend = input.trim().length > 0;

  // ---- scripted assistant reply (timer-based) ----
  const aiReply = () => {
    setTyping(true);
    const delay = 850 + Math.random() * 500;
    const t = setTimeout(() => {
      setTyping(false);
      const n = userMsgCount.current;
      let msg;
      if (n === 1) {
        msg = {
          role: 'ai',
          text: 'Tel Aviv is a fantastic destination. Would you like me to suggest a few residences?',
        };
      } else if (n === 2) {
        msg = {
          role: 'ai',
          text: "I've curated 3 top-rated options for you. The Jaffa offers historic luxury, while Royal Beach is perfect for sea lovers.",
          cards: CURATED,
        };
      } else {
        msg = {
          role: 'ai',
          text: 'Lovely choice. I can refine by neighbourhood, budget, or dates whenever you are ready.',
        };
      }
      setMessages((m) => [...m, msg]);
    }, delay);
    timers.current.push(t);
  };

  const send = (raw) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    userMsgCount.current += 1;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setActiveSuggestion(null);
    aiReply();
  };

  // Tapping a suggestion fills the input WITHOUT opening the keyboard
  // (matches the screenshot: prefilled field, send arrow active, no keyboard).
  const onSuggestion = (s) => {
    setInput(s);
    setActiveSuggestion(s);
  };

  const stopAndSend = () => {
    setRecording(false);
    send(VOICE_TRANSCRIPT);
  };

  // ---- auto-scroll to newest message ----
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  // ---- reset everything shortly after the sheet closes ----
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setMessages([]);
      setInput('');
      setRecording(false);
      setTyping(false);
      setActiveSuggestion(null);
      userMsgCount.current = 0;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }, 360);
    return () => clearTimeout(t);
  }, [open]);

  // ---- Escape closes ----
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // ---- keyboard-aware: lift the sheet above the soft keyboard ----
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const sheet = sheetRef.current;
    const onResize = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      if (sheet) sheet.style.setProperty('--kb', kb + 'px');
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    onResize();
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, [open]);

  // ---- clear pending timers on unmount ----
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const leftArrow = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );

  return createPortal(
    <>
      {open && (
        <div
          className="sheet-backdrop sheet-backdrop-top sheet-backdrop-ai"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={sheetRef}
        className={
          'search-ai-sheet aichat-sheet' +
          (open ? ' open' : '') +
          (hasConversation ? ' has-convo' : '')
        }
        role="dialog"
        aria-label="Chat with AI"
        aria-modal="true"
      >
        {/* ---- top bar ---- */}
        <div className="aichat-top">
          <span className="mobile-sheet-grabber" aria-hidden="true" />
          <div className="aichat-titlebar">
            <span className="aichat-title">Chat with AI</span>
            <button
              type="button"
              className="aichat-close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ---- body ---- */}
        <div className="aichat-body" ref={bodyRef}>
          {!hasConversation ? (
            <div className="aichat-empty">
              <span className="ai-sparkle ai-sparkle-lg aichat-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 2 L11.4 7.6 17 9 L11.4 10.4 10 16 L8.6 10.4 3 9 L8.6 7.6 Z" />
                  <path d="M18 13 L18.7 15.8 21.5 16.5 L18.7 17.2 18 20 L17.3 17.2 14.5 16.5 L17.3 15.8 Z" />
                </svg>
              </span>
              <h3 className="aichat-empty-title">Research your next vacation property</h3>

              <div className="aichat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    type="button"
                    className={
                      'aichat-suggestion' +
                      (activeSuggestion === s.text ? ' is-active' : '')
                    }
                    onClick={() => onSuggestion(s.text)}
                  >
                    <span className="aichat-suggestion-ico">
                      <SuggestionIcon kind={s.icon} />
                    </span>
                    <span className="aichat-suggestion-txt">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="aichat-messages">
              {messages.map((m, i) => (
                <div key={i} className={'aichat-msg aichat-msg-' + m.role}>
                  <div className="aichat-bubble">{m.text}</div>
                  {m.cards && (
                    <div className="aichat-cards">
                      {m.cards.map((c) => (
                        <article key={c.name} className="aichat-card">
                          <div className="aichat-card-media">
                            <img src={c.img} alt={c.name} loading="lazy" decoding="async" />
                            <button
                              type="button"
                              className="aichat-card-heart"
                              aria-label={'Save ' + c.name}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M12 21s-7-4.6-9.5-8.6C1 9.6 2.6 5.8 6 5.8c2 0 3.2 1.3 4 2.4.8-1.1 2-2.4 4-2.4 3.4 0 5 3.8 3.5 6.6C19 16.4 12 21 12 21z" />
                              </svg>
                            </button>
                          </div>
                          <div className="aichat-card-info">
                            <div className="aichat-card-row">
                              <span className="aichat-card-name">{c.name}</span>
                              <span className="aichat-card-rating">
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                  <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9z" />
                                </svg>
                                {c.rating}
                              </span>
                            </div>
                            <span className="aichat-card-loc">{c.loc}</span>
                            <span className="aichat-card-price">
                              <strong>${c.price}</strong> / night
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="aichat-msg aichat-msg-ai">
                  <div className="aichat-bubble aichat-typing" aria-label="Assistant is typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---- input bar ---- */}
        <div className="aichat-inputbar">
          {recording ? (
            <>
              <button
                type="button"
                className="aichat-recdot"
                onClick={() => setRecording(false)}
                aria-label="Cancel recording"
              >
                <span className="aichat-recdot-core" />
              </button>
              <div className="aichat-wave" aria-hidden="true">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      height: 18 + Math.round(Math.abs(Math.sin(i * 0.9)) * 78) + '%',
                      animationDelay: (i % 8) * 0.08 + 's',
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="aichat-send is-active"
                onClick={stopAndSend}
                aria-label="Send recording"
              >
                {leftArrow}
              </button>
            </>
          ) : (
            <>
              <input
                ref={inputRef}
                className="aichat-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setActiveSuggestion(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Describe your needs"
                enterKeyHint="send"
                aria-label="Describe your needs"
              />
              <button
                type="button"
                className="aichat-mic"
                onClick={() => setRecording(true)}
                aria-label="Record voice"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
                  <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
                  <line x1="12" y1="17.5" x2="12" y2="21" />
                  <line x1="8.5" y1="21" x2="15.5" y2="21" />
                </svg>
              </button>
              <button
                type="button"
                className={'aichat-send' + (canSend ? ' is-active' : '')}
                onClick={() => send()}
                disabled={!canSend}
                aria-label="Send"
              >
                {leftArrow}
              </button>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
