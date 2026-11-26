import Image from "next/image";
import Link from "next/link";
import type { ProductCard } from "@/lib/storeProducts";
import { ChevronRightIcon } from "@/components/icons";

const SIZES = "(max-width: 1023px) 50vw, 25vw";

// Product cards use an image stage rather than an enclosing tile; the product photo stays the focus.
const ProductCardView = ({ product }: { product: ProductCard }) => {
    const onSale = product.compareAtLabel !== null && product.discountPercent !== null;

    return (
        <Link href={"/" + product.slug} className="group flex h-full flex-col gap-2.5 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4">
            <div className="relative w-full aspect-square overflow-hidden bg-brand-cream">
                <Image
                    src={product.imageUrl || "/product.png"}
                    alt=""
                    fill
                    sizes={SIZES}
                    className={`absolute z-10 object-contain p-3 transition-[transform,clip-path] duration-500 ease-out motion-reduce:transition-none ${product.hoverImageUrl ? "md:group-hover:-translate-y-2 md:group-hover:[clip-path:inset(0_0_100%_0)]" : ""}`}
                />
                {product.hoverImageUrl && (
                    <Image
                        src={product.hoverImageUrl}
                        alt=""
                        fill
                        sizes={SIZES}
                        className="absolute object-contain p-3 translate-y-2 [clip-path:inset(100%_0_0_0)] transition-[transform,clip-path] duration-500 ease-out motion-reduce:transition-none md:group-hover:translate-y-0 md:group-hover:[clip-path:inset(0_0_0_0)]"
                    />
                )}
                {onSale && (
                    <span className="absolute left-3 top-3 z-20 bg-brand-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-black">
                        Sale {product.discountPercent}% off
                    </span>
                )}
            <span aria-hidden="true" className="absolute bottom-3 right-3 z-20 hidden h-9 w-9 place-items-center rounded-full bg-brand-leaf text-white opacity-0 transition-opacity duration-300 md:group-hover:grid md:group-hover:opacity-100 motion-reduce:transition-none">
                    <ChevronRightIcon className="h-4 w-4 -rotate-45" />
                </span>
            </div>
            <h3 className="min-h-[2.75rem] font-display text-sm font-bold leading-snug text-gray-900 line-clamp-2 sm:text-base">{product.name}</h3>
            <p data-price className="flex min-h-6 flex-wrap items-baseline gap-x-2 text-sm">
                {onSale ? (
                    <>
                        <span className="sr-only">Was {product.compareAtLabel}. Now {product.priceLabel}</span>
                        <s aria-hidden="true" className="text-sm text-gray-500">{product.compareAtLabel}</s>
                        <span aria-hidden="true" className="font-bold text-brand-leaf dark:text-brand-gold">{product.priceLabel}</span>
                    </>
                ) : (
                    <span className="font-bold text-brand-leaf dark:text-brand-gold">{product.priceLabel}</span>
                )}
            </p>
            <span aria-hidden="true" className="mt-auto flex min-h-11 w-full items-center justify-between border border-brand-black px-3 text-xs font-semibold text-brand-black transition-colors duration-300 md:group-hover:bg-brand-black md:group-hover:text-white motion-reduce:transition-none dark:border-gray-300 dark:text-white md:dark:group-hover:bg-brand-gold md:dark:group-hover:text-brand-black sm:px-4 sm:text-sm">
                <span>View product</span><ChevronRightIcon className="h-4 w-4" />
            </span>
        </Link>
    );
};

export default ProductCardView;
