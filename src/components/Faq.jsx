import { useState } from 'react';

const FAQS = [
  { q: '1. How does a home enter the collection?', a: 'Every residence is visited, walked through, and slept in by our team before it joins us. We never list a place we haven\'t lived with. The collection stays small on purpose: around twenty addresses each season.' },
  { q: '2. What makes you different from the larger platforms?', a: 'We\'re small on purpose. No catalogue, no endless scroll. A single concierge knows every home in the collection, and every guest by name.' },
  { q: '3. How does cancellation work?', a: 'Free cancellation up to thirty days before arrival. After that, we\'d rather move your stay than charge you. Most of the time, we can.' },
  { q: '4. Can I speak with the owner before booking?', a: 'We handle every conversation ourselves: questions, virtual tours, the small practical things. It keeps the experience consistent, and the owners undisturbed.' },
  { q: '5. Can I book a home for tomorrow?', a: 'Most homes accept short-notice stays, availability allowing. For arrivals inside 72 hours, write directly to the concierge. There\'s almost always a way.' },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(-1);
  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="faq-header">
          <div className="stats-eyebrow reveal">
            <span className="line"></span>
            <span>Answer</span>
            <span className="line"></span>
          </div>
          <h2 className="faq-title reveal">Frequently Asked Questions</h2>
        </div>
        <ul className="faq-list reveal">
          {FAQS.map((it, i) => {
            const isOpen = openIdx === i;
            return (
              <li key={i} className={'faq-item' + (isOpen ? ' is-open' : '')}>
                <button
                  className="faq-q"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                >
                  <span className="faq-text">{it.q}</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <div className="faq-a-body">{it.a}</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
