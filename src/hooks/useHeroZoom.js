import { useEffect } from 'react';

/**
 * Hero slow zoom-out on scroll (premium feel). Mirrors the original site.
 *
 * Disabled on mobile (≤720px) because:
 *  - the Chrome/Safari URL bar shows/hides on scroll, which fires scroll
 *    events that retrigger the transform → visible jitter
 *  - the effect is subtle and adds little value on a small viewport
 *  - per the mobile-ui playbook: keep motion calm on mobile
 *
 * The desktop⇄mobile decision is RE-EVALUATED on every breakpoint change (not
 * just once at mount), mirroring useParallax. This guarantees the scroll
 * listener is never left bound while the viewport is mobile — so a mobile-width
 * scroll never does any main-thread zoom work — and it clears the inline
 * transform/will-change it set, handing the hero back to its CSS-static mobile
 * state cleanly. (On a real phone the page simply loads mobile and never binds.)
 */
export function useHeroZoom() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const heroImg = document.querySelector('.hero-image img');
    if (!heroImg) return;

    const mq = window.matchMedia('(max-width: 720px)');
    let ticking = false;
    let bound = false;

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
    function bind() {
      if (bound) return;
      heroImg.style.willChange = 'transform';
      window.addEventListener('scroll', onScroll, { passive: true });
      bound = true;
      update();
    }
    function unbind() {
      if (!bound) return;
      window.removeEventListener('scroll', onScroll);
      bound = false;
      // Hand the hero back to its CSS-static mobile state — no lingering inline
      // transform/will-change (the latter would otherwise keep a GPU layer alive
      // and was the source of the stale will-change seen on a live resize).
      heroImg.style.transform = '';
      heroImg.style.willChange = '';
    }
    function sync() {
      if (mq.matches) unbind();
      else bind();
    }

    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);
    else if (mq.addListener) mq.addListener(sync);

    return () => {
      unbind();
      if (mq.removeEventListener) mq.removeEventListener('change', sync);
      else if (mq.removeListener) mq.removeListener(sync);
    };
  }, []);
}
