
import Image from "next/image";
import { categoryHref, LAUNCH_CATEGORIES } from "@/lib/categoryPages";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = { alternates: { canonical: "/" } };

const featuredSections = [
  { title: "Customer favourites", categoryId: process.env.FEATURED_PRODUCTS_CATEGORY_ID },
  { title: "New products", categoryId: process.env.NEW_PRODUCTS_CATEGORY_ID },
];

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }} />
      <section className="bg-brand-cream">
        <div className="grid items-center gap-8 px-4 py-12 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-16 lg:px-16 xl:px-32 2xl:px-64">
          <div>
            <p className="mb-4 font-display text-sm font-bold">Authorised Felicity Solar dealer in Nairobi CBD</p>
            <h1 className="max-w-2xl font-display text-4xl font-extrabold lg:text-5xl">Off-grid solar and backup power</h1>
            <p className="mt-4 max-w-lg text-lg text-gray-700">Find Felicity Solar inverters, lithium batteries and off-grid kits for your home or business.</p>
            <Link href="/shop" className="mt-6 inline-flex min-h-11 items-center rounded bg-brand-gold px-5 py-3 font-medium text-brand-black hover:bg-brand-gold-dark">
              Browse solar equipment
            </Link>
          </div>
          <figure className="mx-auto w-full max-w-sm">
            <Image
              src="/solar/felicity-ivem6048-ii.png"
              alt="Felicity Solar IVEM6048-II off-grid inverter"
              width={800}
              height={800}
              sizes="(max-width: 420px) calc(100vw - 32px), 384px"
              priority
              className="aspect-square h-auto w-full object-contain"
            />
            <figcaption className="mt-2 text-sm text-gray-600">Felicity Solar IVEM6048-II shown as an example</figcaption>
          </figure>
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
      {featuredSections.map(({ title, categoryId }) => categoryId && (
        <section key={title} className="mb-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          <h2 className="font-display text-3xl font-bold">{title}</h2>
          <Suspense fallback={<Skeleton />}>
            <ProductList categoryId={categoryId} limit={9} emptyMessage="Coming soon." />
          </Suspense>
        </section>
      ))}
    </main>
  );
}
