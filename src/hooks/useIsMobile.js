import { useState, useEffect } from 'react';

/**
 * Returns `true` when the viewport is at or below the mobile breakpoint (720px).
 *
 * The initial value is read synchronously from `matchMedia` so the correct
 * markup renders on the very first paint (no desktop→mobile flash). It then
 * updates live if the viewport crosses the breakpoint.
 *
 * This powers the "mobile only, frozen desktop" split: components render the
 * original /goal markup on desktop and the redesigned markup on mobile, so the
 * desktop DOM stays byte-for-byte identical to the approved /goal version.
 */
export function useIsMobile(query = '(max-width: 720px)') {
  const getMatch = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(query).matches;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    // Sync once in case the viewport changed between render and effect.
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}
