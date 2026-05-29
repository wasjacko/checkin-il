import { useEffect } from 'react';

/**
 * Subtle scroll-driven translate on image frames marked [data-parallax].
 * Offset is bounded by the IMG's real extra room — image edges can never appear.
 *
 * Performance notes (this is what keeps mobile scrolling smooth):
 *  - Layout-dependent values (frame height, image height) are measured ONCE and
 *    cached, then recomputed only on resize / image load — NEVER inside the
 *    scroll loop. Reading offsetHeight/getBoundingClientRect().height every
 *    frame forces a synchronous reflow and is the #1 cause of scroll jank.
 *  - The per-frame loop only reads each frame's position (unavoidable) and
 *    writes a transform (compositor-only, no reflow), and skips inactive frames
 *    entirely.
 *  - On MOBILE this hook never drives the .alt-image frames: where the browser
 *    supports CSS scroll-driven animations they parallax on the compositor (see
 *    the global.css @supports block); where it doesn't, they simply stay static.
 *    Either way NO scroll handler runs for them on touch devices — that JS path
 *    was the one remaining source of mobile scroll jank. JS parallax now drives
 *    the (frozen) desktop layout only.
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mq = window.matchMedia('(max-width: 720px)');

    const items = [...document.querySelectorAll('[data-parallax]')]
      .map((el) => ({
        el,
        img: el.querySelector('img'),
        speed: parseFloat(el.dataset.parallax) || 1,
        frameH: 0,
        docTop: 0,
        halfExtra: 0,
        active: false,
      }))
      .filter((i) => i.img);
    if (!items.length) return;

    const EDGE_SAFETY_PX = 4;
    let wh = window.innerHeight;
    let ticking = false;

    // Measure layout-dependent values once (re-run on resize / image load).
    // We also cache each frame's ABSOLUTE document offset (docTop) here, so the
    // scroll loop can derive its on-screen position from window.scrollY alone —
    // no getBoundingClientRect() per frame (see update()).
    function measure() {
      wh = window.innerHeight;
      const sy = window.scrollY || window.pageYOffset || 0;
      // On mobile we NEVER JS-drive the .alt-image frames. Where the browser
      // supports CSS scroll-driven animations they parallax on the compositor;
      // where it doesn't they stay static. Either way no per-scroll main-thread
      // work runs for them on touch devices. Desktop keeps the JS parallax.
      const mobile = mq.matches;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        const frameH = r.height;
        const imgH = it.img.offsetHeight;
        const skipMobileAlt = mobile && it.el.classList.contains('alt-image');
        it.frameH = frameH;
        it.docTop = r.top + sy;
        it.halfExtra = (imgH - frameH) / 2 - EDGE_SAFETY_PX;
        it.active =
          !skipMobileAlt && frameH >= 20 && imgH > frameH + EDGE_SAFETY_PX * 2;
        // Clear any inline transform left behind for frames we no longer drive.
        if (!it.active) it.img.style.transform = '';
      }
    }

    function update() {
      ticking = false;
      // Read live scroll ONCE; everything else is cached math. Crucially we do
      // NOT call getBoundingClientRect() in this loop — reading layout every
      // scroll frame forces a synchronous reflow and is the #1 cause of scroll
      // jank on mobile. A frame's viewport-relative top is just docTop - scrollY
      // (identical result, zero layout cost). docTop is refreshed by measure()
      // on resize / image load / window load, so it stays accurate.
      const sy = window.scrollY || window.pageYOffset || 0;
      for (const it of items) {
        if (!it.active) continue;
        const top = it.docTop - sy;
        if (top + it.frameH < -120 || top > wh + 120) continue;
        const center = top + it.frameH / 2;
        const denom = (wh + it.frameH) / 2;
        const raw = (center - wh / 2) / denom;
        const clamped = raw < -1 ? -1 : raw > 1 ? 1 : raw;
        const offset = -clamped * it.halfExtra * it.speed;
        it.img.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    // JS parallax drives ONLY the frozen desktop layout. On mobile (≤720px)
    // every [data-parallax] frame is an .alt-image, which parallaxes on the
    // compositor via CSS scroll-driven animations (or stays static) — so the
    // main-thread scroll loop has nothing to do. We therefore don't even
    // register the scroll listener on mobile: zero per-scroll work, zero jank.
    let scrollBound = false;
    function bindScroll() {
      if (scrollBound) return;
      window.addEventListener('scroll', onScroll, { passive: true });
      scrollBound = true;
    }
    function unbindScroll() {
      if (!scrollBound) return;
      window.removeEventListener('scroll', onScroll);
      scrollBound = false;
    }
    function syncScrollBinding() {
      if (mq.matches) unbindScroll();
      else bindScroll();
    }

    function remeasure() {
      measure();
      syncScrollBinding();
      if (scrollBound) onScroll();
    }

    // Defer the first measure a frame so layout/images are settled.
    requestAnimationFrame(() => {
      measure();
      update();
    });

    // Image heights define the travel range — re-measure once each loads.
    for (const it of items) {
      if (!it.img.complete) {
        it.img.addEventListener('load', remeasure, { once: true });
      }
    }

    syncScrollBinding();
    window.addEventListener('resize', remeasure, { passive: true });
    // Late-loading resources can shift the cached doc offsets — refresh once
    // everything has settled.
    window.addEventListener('load', remeasure);
    // Switching across the mobile breakpoint flips CSS vs JS ownership.
    if (mq.addEventListener) mq.addEventListener('change', remeasure);
    else if (mq.addListener) mq.addListener(remeasure);

    return () => {
      unbindScroll();
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('load', remeasure);
      if (mq.removeEventListener) mq.removeEventListener('change', remeasure);
      else if (mq.removeListener) mq.removeListener(remeasure);
    };
  }, []);
}
