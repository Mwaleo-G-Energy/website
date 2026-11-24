
import ThemeToggle from "@/components/ThemeToggle";
import SolarShowcase from "@/components/SolarShowcase";
import styles from "./home.module.css";
import Image from "next/image";
import { categoryHref, LAUNCH_CATEGORIES } from "@/lib/categoryPages";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }} />
      <section className={styles.hero} data-home-hero aria-labelledby="hero-title">
        <Image src="/solar/solar-technician-hero.jpg" alt="Solar technician working on rooftop panels" fill sizes="100vw" priority className={styles.heroImage} />
        <div className={styles.heroShade} />
        <header className={styles.heroHeader}>
          <p className={styles.topline}>Authorised Felicity Solar dealer <span>Nairobi CBD</span></p>
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
          <p className={styles.eyebrow}>Solar equipment for your next system</p>
          <h1 id="hero-title">Off-grid solar<br />and backup<br /><span>power.</span></h1>
          <p>Find Felicity Solar inverters, lithium batteries and solar equipment for your home or business. Talk to Mwaleo about the right setup for you.</p>
          <div className={styles.heroActions}>
            <Link href="#shop-categories" className={styles.primary}>Shop solar equipment</Link>
            <Link href="/contact" className={styles.secondary}>Talk to Mwaleo</Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="shop-categories" className="px-4 py-12 md:px-8 md:py-16 lg:px-16 xl:px-32 2xl:px-64">
        <h2 id="shop-categories" className="mb-6 font-display text-3xl font-bold">Shop by category</h2>
        <ul className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3">
          {LAUNCH_CATEGORIES.map((category) => (
            <li key={category.slug} className="bg-white">
              <Link href={categoryHref(category.slug)} className="block h-full p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
                <h3 className="font-display text-lg font-bold underline decoration-brand-gold underline-offset-4">{category.name}</h3>
                <p className="mt-2 text-gray-700">{category.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section id="home-products" className={styles.products}>
        <div className={styles.sectionTitle}>
          <div><p className={styles.eyebrow}>The Mwaleo catalogue</p><h2>Find your next power setup.</h2></div>
          <Link href="/shop">Shop all equipment <span aria-hidden="true">→</span></Link>
        </div>
        <Suspense fallback={<Skeleton />}>
          <ProductList categoryId="" limit={8} emptyMessage="Our solar equipment catalogue is coming soon." />
        </Suspense>
      </section>
      <SolarShowcase />
      <section className={styles.help}>
        <p className={styles.eyebrow}>A system that fits</p>
        <h2>Choosing an inverter or battery?</h2>
        <p>Tell us what you need to power. We can help you explore the equipment and check availability.</p>
        <Link href="/contact">Talk to Mwaleo <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
