"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { categoryHref } from "@/lib/categoryPages";
import type { CategoryPage } from "@/lib/categoryPages";
import styles from "./CategoryCarousel.module.css";

type CategoryLink = Pick<CategoryPage, "name" | "slug" | "description">;

export default function CategoryCarousel({ categories }: { categories: readonly CategoryLink[] }) {
  const viewport = useRef<HTMLUListElement>(null);

  const move = (direction: -1 | 1) => {
    const list = viewport.current;
    const firstCard = list?.firstElementChild;
    if (!list || !firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    list.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap) });
  };

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Shop by category">
      <button type="button" className={styles.control} aria-label="Previous categories" onClick={() => move(-1)}>
        <ChevronLeftIcon />
      </button>
      <ul ref={viewport} className={styles.track}>
        {categories.map((category, index) => (
          <li key={category.slug} className={styles.slide} data-category-slide aria-label={`${index + 1} of ${categories.length}`}>
            <Link href={categoryHref(category.slug)} className={styles.card}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.control} aria-label="Next categories" onClick={() => move(1)}>
        <ChevronRightIcon />
      </button>
    </div>
  );
}
