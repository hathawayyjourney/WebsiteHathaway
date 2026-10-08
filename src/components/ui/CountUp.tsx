'use client';

import { useEffect, useRef } from 'react';

const NUMBER = /^(\D*)([\d.,]+)(.*)$/;
const format = new Intl.NumberFormat('id-ID');

/**
 * Counts a stat like "10.000+" up from 0 when it scrolls into view.
 * Server HTML (and reduced-motion / no-JS) always shows the final value.
 */
export default function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(NUMBER);
    if (!el || !match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/[.,]/g, ''));
    if (!Number.isFinite(target) || target === 0) return;

    const render = (n: number) => {
      el.textContent = `${prefix}${format.format(n)}${suffix}`;
    };
    let frame = 0;
    render(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          render(Math.round(target * (1 - Math.pow(1 - t, 3)))); // easeOutCubic
          if (t < 1) frame = requestAnimationFrame(tick);
          else el.textContent = value;
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value, duration]);

  return <span ref={ref}>{value}</span>;
}
