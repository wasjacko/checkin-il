import { useEffect } from 'react';

/**
 * Hero slow zoom-out on scroll (premium feel). Mirrors the original site.
 *
 * Disabled on mobile (≤720px) because:
 *  - the Chrome/Safari URL bar shows/hides on scroll, which fires scroll
 *    events that retrigger the transform → visible jitter
 *  - the effect is subtle and adds little value on a small viewport
 *  - per the mobile-ui playbook: keep motion calm on mobile
 */
export function useHeroZoom() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 720px)').matches) return;
    const heroImg = document.querySelector('.hero-image img');
    if (!heroImg) return;
    heroImg.style.willChange = 'transform';
    let ticking = false;
    function update() {
      const y = window.scrollY;
      const wh = window.innerHeight;
      const t = Math.min(1, Math.max(0, y / wh));
      const scale = 1 + t * 0.04;
      const ty = t * 24;
      heroImg.style.transform =
        'translate3d(0,' + ty.toFixed(1) + 'px,0) scale(' + scale.toFixed(3) + ')';
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
