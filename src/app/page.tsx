
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
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Authorised Felicity Solar dealer · Nairobi CBD</p>
          <h1>Off-grid solar and backup power</h1>
          <p>Make room for reliable power. Explore Felicity Solar inverters, batteries and equipment for your next solar system.</p>
          <Link href="#home-products" className={styles.primary}>Explore the equipment <span aria-hidden="true">→</span></Link>
          <Link href="/contact" className={styles.secondary}>Ask us about your system</Link>
        </div>
        <figure className={styles.heroProduct}>
          <Image src="/solar/felicity-ivem6048-ii.png" alt="Felicity Solar IVEM6048-II off-grid inverter" width={800} height={800} sizes="(max-width: 700px) 80vw, 440px" priority />
          <figcaption>Felicity Solar IVEM6048-II</figcaption>
        </figure>
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
