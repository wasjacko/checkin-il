import { useEffect } from 'react';

/**
 * Adds the `is-visible` class to every `.reveal` and `.reveal-stagger` element
 * once it enters the viewport.
 *
 * Uses a MutationObserver in addition to IntersectionObserver so newly-mounted
 * elements (e.g. after HMR or React re-renders) are picked up too — otherwise
 * they stay stuck at opacity:0 because the observer was attached before they
 * existed in the DOM.
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );

    // Register one element. If its top edge is already at or above the bottom
    // of the viewport it has effectively entered view (or been scrolled past),
    // so reveal it straight away — an IntersectionObserver attached to an
    // element that's already out of view above only ever fires
    // `isIntersecting:false`, which would leave it stuck at opacity:0. This
    // covers initial load, scroll restoration, anchor jumps and — crucially —
    // HMR remounts that happen while scrolled down the page. Anything still
    // below the fold is observed so it animates in on scroll as intended.
    const register = (el) => {
      if (el.classList.contains('is-visible')) return;
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('is-visible');
      } else {
        io.observe(el);
      }
    };

    const observeReveals = (root = document) => {
      root.querySelectorAll('.reveal, .reveal-stagger').forEach(register);
    };

    // Initial pass
    observeReveals();

    // Watch the DOM for newly-added .reveal elements (HMR, late renders…)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return; // element only
          if (node.matches && node.matches('.reveal, .reveal-stagger')) {
            register(node);
          }
          if (node.querySelectorAll) observeReveals(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
