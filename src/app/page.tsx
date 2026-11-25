
import ThemeToggle from "@/components/ThemeToggle";
import ShopListing from "@/components/ShopListing";
import { getCategoryPages } from "@/lib/categoryData";
import type { CategoryPage } from "@/lib/categoryPages";
import styles from "./home.module.css";
import Image from "next/image";
import { LAUNCH_CATEGORIES } from "@/lib/categoryPages";
import CategoryCarousel from "@/components/CategoryCarousel";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = { alternates: { canonical: "/" } };

type SearchParams = { [key: string]: string | string[] | undefined };

async function HomeCatalogue({ searchParams }: { searchParams: SearchParams }) {
  let categories: CategoryPage[] = [];
  try {
    categories = await getCategoryPages();
  } catch (error) {
    console.error("HomePage: category list failed", error);
  }
  return <ShopListing category={null} categories={categories} searchParams={searchParams} embedded />;
}

export default function HomePage({ searchParams = {} }: { searchParams?: SearchParams }) {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }} />
      <section className={styles.hero} data-home-hero aria-labelledby="hero-title">
        <Image src="/solar/solar-technician-hero.jpg" alt="Solar technician working on rooftop panels" fill sizes="100vw" priority className={styles.heroImage} />
        <div className={styles.heroShade} />
        <header className={styles.heroHeader}>
          <nav className={styles.heroNav} aria-label="Homepage navigation">
            <Link href="/" aria-label="Mwaleo Green Energy, home" className={styles.logo}>
              <Image src="/mwaleo-logo-horizontal.svg" alt="Mwaleo Green Energy" width={194} height={80} priority />
            </Link>
            <div className={styles.desktopLinks}>
              <Link href="/" aria-current="page">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/shop/off-grid-inverters">Inverters</Link>
              <Link href="/shop/lithium-batteries">Batteries</Link>
              <Link href="/shop/solar-kits">Solar kits</Link>
            </div>
            <div className={styles.navActions}><ThemeToggle /><Link href="/contact" className={styles.contact}>Contact us</Link></div>
            <details className={styles.mobileMenu}>
              <summary>Menu</summary>
              <div><Link href="/shop">Shop all</Link><Link href="/shop/off-grid-inverters">Inverters</Link><Link href="/shop/lithium-batteries">Batteries</Link><Link href="/shop/solar-kits">Solar kits</Link><Link href="/contact">Contact us</Link></div>
            </details>
          </nav>
        </header>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Felicity Solar equipment for home and business</p>
          <h1 id="hero-title">Shop solar, batteries, inverters <span>&amp; accessories.</span></h1>
          <p>Find solar equipment for your home or business, and get help choosing a system that fits.</p>
          <div className={styles.heroActions}>
            <Link href="#home-products" className={styles.primary}>Shop solar accessories</Link>
            <Link href="/contact" className={styles.secondary}>Request solar installation</Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="shop-categories" className={`${styles.categorySection} px-4 py-12 md:px-8 md:py-16 lg:px-16 xl:px-32 2xl:px-64`}>
        <h2 id="shop-categories" className="mb-6 font-display text-3xl font-bold">Shop by category</h2>
        <CategoryCarousel categories={LAUNCH_CATEGORIES} />
      </section>
      <section id="home-products" aria-label="Product catalogue">
        <Suspense fallback={<Skeleton />}>
          <HomeCatalogue searchParams={searchParams} />
        </Suspense>
      </section>
      <section className={styles.help}>
        <p className={styles.eyebrow}>A system that fits</p>
        <h2>Choosing an inverter or battery?</h2>
        <p>Tell us what you need to power. We can help you explore the equipment and check availability.</p>
        <Link href="/contact">Talk to Mwaleo <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
