import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import OrderOnWhatsApp from "@/components/OrderOnWhatsApp";
import ProductDescription from "@/components/ProductDescription";
import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Metadata } from "next";
import { breadcrumbJsonLd, jsonLdScript, productJsonLd, productMetadata } from "@/lib/seo";
import type { SeoTag } from "@/lib/categoryPages";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";

type Props = {
    params: { slug: string };
};

// Everything a search engine or a link preview is told about a product comes from one place, src/lib/seo.ts: the title and description
// the shop wrote for the product in the store when there are some, a clean one made from its own text when there are not.
const seoOf = (product: Awaited<ReturnType<typeof findProduct>>, slug: string) => {
    const photos = (product?.media?.items ?? []).flatMap((item) => (item?.image?.url ? [item.image.url] : []));
    return {
        name: product?.name ?? "",
        slug,
        description: product?.description,
        seoTags: product?.seoData?.tags as SeoTag[] | undefined,
        imageUrl: product?.media?.mainMedia?.image?.url ?? null,
        imageUrls: photos,
        sku: product?.sku,
        brand: product?.brand,
        price: product?.price?.discountedPrice || product?.price?.price || null,
        inStock: Boolean(product?.stock?.inStock),
    };
};

const findProduct = async (slug: string) => {
    const wixClient = await wixClientServer();
    const products = await wixClient.products.queryProducts().eq("slug", slug).find();
    return products.items[0];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = params;
    const product = await findProduct(slug);
    if (!product) return { title: "Product Not Found" };
    return productMetadata(seoOf(product, slug));
}

const SinglePage = async ({ params }: Props) => {
    const { slug } = params;

    const product = await findProduct(slug);

    if (!product) {
        return notFound();
    }

    return (
        <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-5 md:px-8 md:pt-8 lg:px-16 lg:pb-20 xl:px-24">
            {/* What search engines are told about the product, and where it sits in the shop */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd(seoOf(product, slug))) }} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: jsonLdScript(
                        breadcrumbJsonLd([
                            { name: "Home", path: "/" },
                            { name: "Shop", path: "/shop" },
                            { name: product.name ?? "Product", path: `/${slug}` },
                        ])
                    ),
                }}
            />
            {/* IMG */}
            <div className="mb-5 flex items-center gap-2 text-xs text-gray-500 sm:mb-8">
                <Link href="/shop" className="underline decoration-brand-gold underline-offset-4 hover:text-brand-leaf-ink">Shop</Link>
                <span aria-hidden="true">/</span>
                <span className="line-clamp-1 text-gray-700 dark:text-gray-300">{product.name}</span>
            </div>
            <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.8fr)] lg:gap-14">
            <div className="min-w-0 lg:sticky lg:top-8">
                <ProductImages key={product._id} items={product.media?.items} name={product.name ?? undefined} />
            </div>

            {/* TEXTS */}
            <div className="flex min-w-0 flex-col gap-5 sm:gap-7">
                <div className="border-b border-gray-200 pb-5 dark:border-gray-700">
                    <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-leaf-ink dark:text-brand-gold">
                        <span className="h-2 w-2 rounded-full bg-brand-leaf dark:bg-brand-gold" />
                        Felicity Solar · Mwaleo catalogue
                    </p>
                    <h1 className="font-display text-2xl font-bold leading-tight text-gray-900 sm:text-4xl">{product.name}</h1>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Authorised Felicity Solar dealer in Nairobi</p>
                </div>

                {/* Price */}
                {product.price?.price === product.price?.discountedPrice ? (
                    <h2 className="font-display text-3xl font-bold text-brand-leaf-ink dark:text-brand-gold">KES {product.price?.price}</h2>
                ) : (
                    <div className="flex items-center gap-4">
                        <h3 className="text-base text-gray-500 line-through">
                            KES {product.price?.price}
                        </h3>
                        <h2 className="font-display text-3xl font-bold text-brand-leaf-ink dark:text-brand-gold">
                            KES {product.price?.discountedPrice}
                        </h2>
                    </div>
                )}

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                {/* Add to Cart / Customize, with Order on WhatsApp right under it */}
                <div className="flex flex-col gap-3">
                    {product.variants && product.productOptions && product.productOptions.length > 0 ? (
                        <CustomizeProducts
                            productId={product._id!}
                            variants={product.variants}
                            productOptions={product.productOptions}
                        />
                    ) : (
                        <Add
                            productId={product._id!}
                            variantId="00000000-0000-0000-0000-000000000000"
                            stockNumber={
                              product.stock?.quantity ?? (product.stock?.inStock ? 9999 : 0)
                            }
                        />
                    )}

                    <OrderOnWhatsApp
                        name={product.name ?? "this product"}
                        price={product.price?.discountedPrice ?? product.price?.price ?? undefined}
                        hasOptions={Boolean(product.productOptions && product.productOptions.length > 0)}
                        url={`${SITE_URL}/${slug}`}
                    />
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                {product.description && <ProductDescription html={product.description} />}

                {/* Additional Info */}
                {product.additionalInfoSections?.map((section: any) => (
                    <div className="text-sm" key={section.title}>
                        <h4 className="font-semibold text-lg mb-2">{section.title}</h4>
                        <div
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(section.description || ""),
                            }}
                        />
                    </div>
                ))}

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                
            </div>
            </div>
        </main>
    );
};

export default SinglePage;
