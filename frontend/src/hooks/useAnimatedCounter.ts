// =============================================
// useAnimatedCounter — Smooth number animation hook
// =============================================

import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(
  target: number,
  duration: number = 1200,
  decimals: number = 0
): number {
  const [current, setCurrent] = useState(0);
  const startRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startValueRef.current = current;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startValueRef.current + (target - startValueRef.current) * eased;

      setCurrent(Number(value.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, decimals]);

  return current;
}
