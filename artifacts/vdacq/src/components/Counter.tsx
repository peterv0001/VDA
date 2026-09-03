import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  delayMs?: number;
};

/**
 * Renders `prefix + value + suffix`. On the client it counts up from zero once,
 * after hydration, unless the visitor prefers reduced motion. The server and
 * the first client render both show the final value, so prerendered HTML and
 * hydration stay identical.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  delayMs = 500,
}: CounterProps) {
  const [shown, setShown] = useState(value);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let start = 0;
    const startTimer = window.setTimeout(() => {
      setShown(0);
      const tick = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(Math.round(value * eased));
        if (t < 1) frame.current = window.requestAnimationFrame(tick);
      };
      frame.current = window.requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(startTimer);
      window.cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs, delayMs]);

  return (
    <span aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
