import { useEffect } from 'react';

/**
 * Subtle scroll-driven translate on image frames marked [data-parallax].
 * Offset is bounded by the IMG's real extra room — image edges can never appear.
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Mobile: CSS already neutralises the parallax visually; skip the JS too
    if (window.matchMedia('(max-width: 720px)').matches) return;
    const items = [...document.querySelectorAll('[data-parallax]')]
      .map((el) => ({
        el,
        img: el.querySelector('img'),
        speed: parseFloat(el.dataset.parallax) || 1,
      }))
      .filter((i) => i.img);
    if (!items.length) return;

    let ticking = false;
    const EDGE_SAFETY_PX = 4;
    function update() {
      const wh = window.innerHeight;
      for (const { el, img, speed } of items) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > wh + 120) continue;
        const frameH = rect.height;
        const imgH = img.offsetHeight;
        if (frameH < 20 || imgH <= frameH + EDGE_SAFETY_PX * 2) continue;
        const center = rect.top + frameH / 2;
        const denom = (wh + frameH) / 2;
        const raw = (center - wh / 2) / denom;
        const clamped = raw < -1 ? -1 : raw > 1 ? 1 : raw;
        const halfExtra = (imgH - frameH) / 2 - EDGE_SAFETY_PX;
        const offset = -clamped * halfExtra * speed;
        img.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}
