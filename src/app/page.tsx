
import SolarShowcase from "@/components/SolarShowcase";
import styles from "./home.module.css";
import { categoryHref, LAUNCH_CATEGORIES } from "@/lib/categoryPages";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage({ searchParams = {} }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }} />
      <header className={styles.shopIntro}>
        <p className={styles.eyebrow}>Authorised Felicity Solar dealer · Nairobi CBD</p>
        <h1>Off-grid solar and backup power</h1>
        <p>Shop inverters, batteries and solar equipment.</p>
      </header>
      <section aria-labelledby="shop-categories" className={styles.categories}>
        <h2 id="shop-categories" className="mb-3 font-display text-lg font-bold">Shop by category</h2>
        <ul className="grid grid-cols-3 gap-px border border-gray-200 bg-gray-200">
          {LAUNCH_CATEGORIES.map((category) => (
            <li key={category.slug} className="bg-white">
              <Link href={categoryHref(category.slug)} className="block h-full p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
                <h3 className="font-display text-sm md:text-lg font-bold underline decoration-brand-gold underline-offset-4">{category.name}</h3>
                <p className="mt-2 hidden text-gray-700 md:block">{category.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section id="home-products" className={styles.products}>
        <div className={styles.sectionTitle}>
          <div><h2>Shop solar equipment</h2></div>
          <Link href="/shop">Shop all equipment <span aria-hidden="true">→</span></Link>
        </div>
        <form action="/" className={styles.search}>
          <label htmlFor="model-search">Search by model or product name</label>
          <div><input id="model-search" name="name" type="search" defaultValue={typeof searchParams.name === "string" ? searchParams.name : ""} placeholder="e.g. IVEM6048" /><button type="submit">Search products</button></div>
        </form>
        <Suspense fallback={<Skeleton />}>
          <ProductList categoryId="" searchParams={searchParams} limit={12} emptyMessage="Our solar equipment catalogue is coming soon." />
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
