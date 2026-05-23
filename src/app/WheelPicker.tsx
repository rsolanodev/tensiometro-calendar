"use client";

import { useRef, useEffect, useCallback } from "react";

const ITEM_H = 36;

type Props = {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
  onChange: (value: number) => void;
};

export default function WheelPicker({ value, min, max, step = 1, label, unit, onChange }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const values: number[] = [];
  for (let v = min; v <= max; v += step) {
    values.push(v);
  }

  const pad = 72;

  const scrollToValue = useCallback((v: number) => {
    if (!listRef.current) return;
    const idx = Math.round((v - min) / step);
    listRef.current.scrollTop = idx * ITEM_H;
  }, [min, step]);

  useEffect(() => {
    scrollToValue(value);
  }, [value, scrollToValue]);

  function handleScroll() {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (!listRef.current) return;
      const idx = Math.round(listRef.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(values.length - 1, idx));
      const newVal = min + clamped * step;
      if (newVal !== value) {
        onChange(newVal);
      }
    });
  }

  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-label-sm text-text-secondary mb-2">{label}</span>
      <div className="relative w-full h-[180px] overflow-hidden rounded-xl bg-surface-variant border border-border-subtle">
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto"
          style={{ scrollbarWidth: "none", scrollSnapType: "y mandatory" }}
        >
          <div style={{ height: pad }} />
          {values.map((v) => (
            <div
              key={v}
              className="flex items-center justify-center"
              style={{ height: ITEM_H, scrollSnapAlign: "center" }}
            >
              <span
                className={`transition-all duration-100 ${
                  v === value
                    ? "text-headline-sm text-primary font-semibold"
                    : "text-body-md text-text-secondary/60"
                }`}
              >
                {v}
              </span>
            </div>
          ))}
          <div style={{ height: pad }} />
        </div>

        <div className="absolute inset-x-0 top-0 h-[72px] bg-gradient-to-b from-surface-variant to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[72px] bg-gradient-to-t from-surface-variant to-transparent pointer-events-none" />

        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-9 border-y border-border-subtle pointer-events-none" />

        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label-sm text-text-secondary/60 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
