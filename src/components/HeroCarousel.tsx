"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import styles from "@/app/home.module.css";

const slides = [
  {
    eyebrow: "Solar equipment for your next system",
    title: <>Shop solar, batteries, inverters <span>&amp; accessories.</span></>,
    description: "Find solar equipment for your home or business, and get help choosing a system that fits.",
    primary: { label: "Shop solar accessories", href: "#home-products" },
    secondary: { label: "Request free installation quote", href: "/contact#send-message" },
  },
  {
    eyebrow: "Solar installation",
    title: <>A solar system planned for <span>your home or business.</span></>,
    description: "Tell us what you need to power and where you are. Mwaleo can help you plan an installation that suits your property.",
    primary: { label: "Request free installation quote", href: "/contact#send-message" },
    secondary: { label: "Shop solar equipment", href: "#home-products" },
  },
  {
    eyebrow: "Project spotlight",
    title: <>Our next solar project <span>could be yours.</span></>,
    description: "Owner-approved project photos and location details will be added here. Planning an installation? Request a free quote.",
    primary: { label: "Request free installation quote", href: "/contact#send-message" },
    secondary: { label: "Shop solar equipment", href: "#home-products" },
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (paused || hovered || reducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [hovered, paused, reducedMotion]);

  const step = (direction: -1 | 1) => setActive((current) => (current + direction + slides.length) % slides.length);
  const slide = slides[active];

  return (
    <div
      className={styles.heroCarousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured solar equipment and services"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{slide.eyebrow}</p>
        <h1 id="hero-title">{slide.title}</h1>
        <p>{slide.description}</p>
        <div className={styles.heroActions}>
          <Link href={slide.primary.href} className={styles.primary}>{slide.primary.label}</Link>
          <Link href={slide.secondary.href} className={styles.secondary}>{slide.secondary.label}</Link>
        </div>
        <div className={styles.heroCarouselControls}>
          <button type="button" aria-label="Previous banner" onClick={() => step(-1)}><ChevronLeftIcon /></button>
          <div className={styles.heroCarouselDots} role="group" aria-label="Choose a banner">
            {slides.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                aria-label={`Show banner ${index + 1}: ${item.eyebrow}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button type="button" aria-label="Next banner" onClick={() => step(1)}><ChevronRightIcon /></button>
          <button
            type="button"
            className={styles.heroCarouselPause}
            aria-label={paused ? "Resume automatic banners" : "Pause automatic banners"}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live={paused || hovered || reducedMotion ? "polite" : "off"}>
        Banner {active + 1} of {slides.length}: {slide.eyebrow}
      </p>
    </div>
  );
}
