import { useEffect, useRef } from 'react';

export default function Stats() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const stats = sectionRef.current;
    if (!stats) return;
    const values = stats.querySelectorAll('.stat-value');
    if (!values.length) return;

    const configs = Array.from(values).map((el) => {
      const text = el.textContent.trim();
      const match = text.match(/^(\d+)(.*)$/);
      return {
        el,
        target: match ? parseInt(match[1], 10) : 0,
        suffix: match ? match[2] : '',
      };
    });

    let started = false;
    function animateNumber(el, target, suffix, duration) {
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) setTimeout(tick, 1000 / 60);
        else el.textContent = target + suffix;
      };
      tick();
    }
    function trigger() {
      if (started) return;
      started = true;
      configs.forEach((c) => { c.el.textContent = '0' + c.suffix; });
      configs.forEach((c, i) => {
        setTimeout(() => animateNumber(c.el, c.target, c.suffix, 1600), i * 350);
      });
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) trigger(); }),
      { threshold: 0 }
    );
    obs.observe(stats);

    function checkVisible() {
      if (started) return;
      const r = stats.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) trigger();
    }
    window.addEventListener('scroll', checkVisible, { passive: true });
    checkVisible();
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', checkVisible);
    };
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      <div className="wrap">
        <div className="stats-eyebrow reveal">
          <span className="line"></span>
          <span>Quietly, by the numbers</span>
          <span className="line"></span>
        </div>
        <p className="stats-quote reveal">
          We work one house at a time. Each address is walked through before
          it joins the collection, and stays only as long as it earns its
          place. Hospitality, as it should still feel: personal, particular,
          and very much your own.
        </p>

        <div className="stats-grid reveal reveal-d1">
          <div className="stat">
            <div className="stat-value">120+</div>
            <div className="stat-label">Residences in the collection</div>
          </div>
          <div className="stat">
            <div className="stat-value">97%</div>
            <div className="stat-label">Guests who return</div>
          </div>
          <div className="stat">
            <div className="stat-value">5+</div>
            <div className="stat-label">Years curating Israel</div>
          </div>
        </div>
      </div>
    </section>
  );
}
