"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ProductDetailCard, SpecRow } from "@/lib/productSpecs";
import { rowDelayMs, startingPhase, type Phase } from "@/lib/specReveal";
import styles from "./ProductSpecs.module.css";

type Props = {
  specs: SpecRow[];
  features?: string[];
  featureCards?: ProductDetailCard[];
  expansion?: ProductDetailCard[];
  useCases?: ProductDetailCard[];
};

// These class names are written out here, not in a lib file, because the stylesheet build reads only components and app.
export const lineClass = (phase: Phase) =>
  [
    "mt-2 block h-0.5 w-14 origin-left bg-brand-gold motion-reduce:transition-none print:scale-x-100",
    phase === "armed" ? "scale-x-0" : "scale-x-100",
    phase === "shown" ? "transition-transform duration-700 ease-out" : "",
  ].join(" ");

// Only the opacity and the position move, so a colour change later is never held back by the stagger delay set on each row.
export const rowClass = (phase: Phase) =>
  [
    "grid min-w-0 content-start gap-y-1 motion-reduce:transition-none print:opacity-100 print:translate-y-0",
    phase === "armed" ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
    phase === "shown" ? "transition-[opacity,transform] duration-500 ease-out" : "",
  ].join(" ");

export default function ProductSpecs({ specs, features = [], featureCards = [], expansion = [], useCases = [] }: Props) {
  const headingId = useId();
  const table = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const el = table.current;
    if (!el) return;
    const start = startingPhase({
      hasObserver: typeof IntersectionObserver !== "undefined",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      top: el.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
    });
    if (start === "static") return;
    setPhase(start);
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          watcher.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  const rowDelay = (index: number) => (phase === "shown" ? { transitionDelay: `${rowDelayMs(index)}ms` } : undefined);

  return (
    <div className="flex flex-col gap-6">
      {(featureCards.length > 0 || features.length > 0) && (
        <section aria-labelledby={`${headingId}-features`} aria-label="Key features">
          <h3 id={`${headingId}-features`} className="font-display text-2xl font-semibold text-gray-900">What sets it apart</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(featureCards.length ? featureCards : features.map((title) => ({ title, description: "" }))).map((card, index) => (
              <article key={`${card.title}-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{card.title}</h4>
                {card.description && <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{card.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section ref={table} aria-labelledby={headingId}>
        <h3 id={headingId} className="font-display text-2xl font-semibold text-gray-900">
          Specifications
        </h3>
        <span data-spec-line="" aria-hidden="true" className={lineClass(phase)} />
        <dl data-spec-grid="" className={`${styles.grid} mt-4`}>
          {specs.map((spec, index) => (
            <div key={index} data-spec-row="" data-spec-cell="" className={`${styles.cell} ${rowClass(phase)}`} style={rowDelay(index)}>
              <dt className="break-words text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">{spec.label}</dt>
              <dd className="min-w-0 break-words text-[13px] font-semibold text-gray-900 first-letter:uppercase sm:text-sm">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {expansion.length > 0 && (
        <section aria-labelledby={`${headingId}-expansion`}>
          <h3 id={`${headingId}-expansion`} className="font-display text-2xl font-semibold text-gray-900">System expansion capability</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {expansion.map((card, index) => (
              <article key={`${card.title}-${index}`} className="rounded-xl bg-brand-cream p-5 dark:bg-gray-800">
                <h4 className="font-display text-2xl font-bold text-brand-leaf-ink dark:text-brand-gold">{card.title}</h4>
                {card.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{card.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {useCases.length > 0 && (
        <section aria-labelledby={`${headingId}-applications`}>
          <h3 id={`${headingId}-applications`} className="font-display text-2xl font-semibold text-gray-900">Where it works</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {useCases.map((card, index) => (
              <article key={`${card.title}-${index}`} className="border-l-2 border-brand-gold py-1 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{card.title}</h4>
                {card.description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{card.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
