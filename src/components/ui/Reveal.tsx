'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

// One observer shared by every <Reveal> on the page.
let observer: IntersectionObserver | null = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      }
    },
    // threshold 0 so very tall blocks (itinerary, FAQ) still trigger as soon as they enter.
    { threshold: 0, rootMargin: '0px 0px -10% 0px' },
  );
  return observer;
}

/**
 * Fades + slides its content up once when it scrolls into view (see `.reveal` in globals.css).
 * Use `delay` (ms) to stagger items in a grid.
 */
export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}
