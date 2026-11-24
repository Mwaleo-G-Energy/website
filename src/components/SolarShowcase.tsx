"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./SolarShowcase.module.css";

const scenes = [
  { model: "IVEM5048-LV", type: "Off-grid inverter", image: "/solar/felicity-inverter-scene.webp" },
  { model: "LUX-X-48100LG01", type: "Battery storage", image: "/solar/felicity-battery-scene.webp" },
  { model: "V-SKY-R10KLNA-US", type: "Hybrid inverter", image: "/solar/felicity-hybrid-scene.webp" },
];

export default function SolarShowcase() {
  const [active, setActive] = useState(0);
  const scene = scenes[active];

  return (
    <section className={styles.showcase} aria-label="Explore Felicity Solar" aria-roledescription="carousel">
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Explore Felicity Solar</p>
          <h2>See the equipment in context.</h2>
        </div>
        <p>Official Felicity Solar illustrations. Ask us about local availability and a suitable system.</p>
      </div>
      <div className={styles.scene}>
        <Image key={scene.image} src={scene.image} alt={`Felicity Solar ${scene.model} shown beside a home with rooftop solar panels`} fill sizes="100vw" className={styles.background} />
        <div className={styles.caption}>
          <p className={styles.eyebrow}>{scene.type}</p>
          <h3 aria-live="polite" aria-atomic="true">{scene.model}</h3>
          <Link href="/contact">Enquire about this range <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.controls}>
          <button type="button" aria-label="Previous product scene" onClick={() => setActive((active + scenes.length - 1) % scenes.length)}>←</button>
          <p aria-live="polite">{active + 1} / {scenes.length}</p>
          <button type="button" aria-label="Next product scene" onClick={() => setActive((active + 1) % scenes.length)}>→</button>
        </div>
      </div>
      <div className={styles.choices} aria-label="Choose a product scene">
        {scenes.map((item, index) => (
          <button key={item.model} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
            <span>{item.type}</span>
            <strong>{item.model}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
