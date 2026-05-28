import { useEffect, useRef, useState } from 'react';

const REVIEWS = [
  { date: 'Sep 2023', quote: '“The kind of place you stop wanting to leave. Even the light was thought through. We’ve already booked the next one.”', name: 'Natacha Clack', avatar: '/avatar1.png' },
  { date: 'Jul 2023', quote: '“They knew us by name before we arrived. Every recommendation was right. We’ve stopped looking anywhere else.”', name: 'David Mizrahi', avatar: '/avatar2.png' },
  { date: 'May 2023', quote: '“A house with soul. Quiet, exact, somehow yours from the first hour. Rare to feel this at home, this fast.”', name: 'Sarah Cohen', avatar: '/avatar3.png' },
];
const DURATION = 5000;

export default function Testimonial() {
  const [idx, setIdx] = useState(0);
  const barsRef = useRef([]);

  useEffect(() => {
    // Reset all bars, then animate the current one to 100%.
    barsRef.current.forEach((b) => {
      if (!b) return;
      b.style.transition = 'none';
      b.style.width = '0%';
    });
    const cur = barsRef.current[idx];
    if (cur) {
      // Force reflow so the transition restarts from 0
      // eslint-disable-next-line no-unused-expressions
      void cur.offsetWidth;
      cur.style.transition = 'width ' + DURATION + 'ms linear';
      cur.style.width = '100%';
    }
    const id = setTimeout(() => setIdx((i) => (i + 1) % REVIEWS.length), DURATION);
    return () => clearTimeout(id);
  }, [idx]);

  const r = REVIEWS[idx];

  return (
    <section className="testimonial">
      <div className="testimonial-bg" aria-hidden="true">
        <img src="/avis.jpg" alt="" loading="lazy" />
      </div>
      <div className="wrap">
        <div className="testimonial-proof reveal">
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
        <div className="testimonial-card reveal reveal-d1">
          <div className="testimonial-card-top">
            <div className="testimonial-stars">★★★★★</div>
            <span className="testimonial-date">{r.date}</span>
          </div>
          <p className="testimonial-quote">{r.quote}</p>
          <div className="testimonial-foot">
            <div className="testimonial-author">
              <img src={r.avatar} alt="" className="testimonial-avatar" loading="lazy" />
              <span>{r.name}</span>
            </div>
            <div className="testimonial-dots" aria-hidden="true">
              {REVIEWS.map((_, i) => (
                <span key={i} className="bar">
                  <i ref={(el) => { barsRef.current[i] = el; }}></i>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
