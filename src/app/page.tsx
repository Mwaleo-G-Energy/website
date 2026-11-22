
import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = { alternates: { canonical: "/" } };

const HomePage = async () => {
  return (
    <div className="">
      {/* Tells search engines who the shop is, where it is, and how its search works. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }} />
      <div className="mt-0 md:mt-6">
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div>
      <section className="bg-brand-cream px-4 py-12 md:px-8 md:py-16 lg:px-16 xl:px-32 2xl:px-64">
        <p className="mb-3 font-display text-sm font-bold">Authorised Felicity Solar dealer in Nairobi CBD</p>
        <h1 className="max-w-3xl font-display text-4xl font-extrabold md:text-5xl">Off-grid solar and backup power</h1>
        <p className="mt-4 max-w-xl text-lg text-gray-700">Shop Felicity Solar inverters, lithium batteries and complete solar kits.</p>
        <Link href="/shop" className="mt-6 inline-flex min-h-11 items-center rounded bg-brand-gold px-5 py-3 font-medium text-brand-black hover:bg-brand-gold-dark">
          Browse solar equipment
        </Link>
      </section>
      <div className="mt-10 md:mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="font-display text-3xl font-bold">Customer Favourites</h2>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_CATEGORY_ID!}
            categoryName="Editor's Picks"
            limit={9}
          />
        </Suspense>
      </div>
      <div className="mt-10 md:mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="font-display text-3xl font-bold">New Products</h2>
        <Suspense fallback={<Skeleton />}>
            <ProductList
                categoryId={process.env.NEW_PRODUCTS_CATEGORY_ID!}
                limit={9}
            />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;