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

    const observeReveals = (root = document) => {
      root.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
        if (!el.classList.contains('is-visible')) io.observe(el);
      });
    };

    // Initial pass
    observeReveals();

    // Watch the DOM for newly-added .reveal elements (HMR, late renders…)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return; // element only
          if (node.matches && node.matches('.reveal, .reveal-stagger')) {
            io.observe(node);
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
