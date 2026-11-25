import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProductCardView from "@/components/ProductCard";
import type { ProductCard } from "@/lib/storeProducts";

const card = (extra: Partial<ProductCard> = {}): ProductCard => ({
  id: "1",
  slug: "naviforce-nf9269",
  name: "Naviforce NF9269 Men's Silver Dial Blue Leather Watch",
  imageUrl: "https://img/a.jpg",
  hoverImageUrl: "https://img/b.jpg",
  priceLabel: "KES 3,500",
  compareAtLabel: null,
  discountPercent: null,
  ...extra,
});

const render = (c: ProductCard) => renderToStaticMarkup(<ProductCardView product={c} />);

describe("ProductCardView", () => {
  it("links the whole card to the product page", () => {
    expect(render(card())).toContain('href="/naviforce-nf9269"');
  });

  it("shows the name over at most two lines and the price on a line of its own", () => {
    const html = render(card());
    const nameTag = html.match(/<h3[^>]*>/)?.[0] ?? "";
    expect(nameTag).toContain("line-clamp-2");
    const priceTag = html.match(/<p[^>]*data-price[^>]*>/)?.[0] ?? "";
    expect(priceTag).not.toBe("");
    expect(html.indexOf("<h3")).toBeLessThan(html.indexOf("data-price"));
  });

  it("shows no sale marks on a product that is not on sale", () => {
    const html = render(card());
    expect(html).not.toMatch(/<s[\s>]/);
    expect(html).not.toContain("Sale");
  });

  it("shows the old price struck through, the new price, and the percent off when on sale", () => {
    const html = render(card({ compareAtLabel: "KES 4,375", discountPercent: 20 }));
    expect(html).toMatch(/<s[^>]*>KES 4,375<\/s>/);
    expect(html).toContain("KES 3,500");
    expect(html).toContain("Sale 20% off");
  });

  it("tells screen reader users what the struck-through price means", () => {
    const html = render(card({ compareAtLabel: "KES 4,375", discountPercent: 20 }));
    expect(html).toContain("Was KES 4,375");
    expect(html).toContain("Now KES 3,500");
  });

  it("has one full-width product link treatment, not a button nested inside the link", () => {
    const html = render(card());
    expect(html).not.toContain("<button");
    expect(html).toContain("View product");
    expect(html).toContain("border-brand-black");
    expect(html).toContain("w-full");
  });

  it("uses no pink", () => {
    expect(render(card({ compareAtLabel: "KES 4,375", discountPercent: 20 }))).not.toMatch(/pink|rose|red-/);
  });

  it("reveals the alternate photo with a vertical wipe only when it exists", () => {
    const first = (html: string) => html.match(/<img[^>]*>/)?.[0] ?? "";
    expect(first(render(card()))).toContain("clip-path:inset(0_0_100%_0)");
    expect(first(render(card({ hoverImageUrl: null })))).not.toContain("group-hover:[clip-path");
  });

  it("changes on hover only on devices that can hover, so a tap does not leave a card stuck", () => {
    const html = render(card());
    expect(html).not.toMatch(/(^|[\s"])group-hover:/);
    expect(html).toContain("group-hover:bg-brand-black");
  });

  it("keeps the button look out of the link's spoken name, since the card only opens the product page", () => {
    const html = render(card());
    expect(html).toMatch(/<span[^>]*aria-hidden="true"[^>]*>[\s\S]*?View product/);
  });

  it("shows the second photo on hover only when there is one", () => {
    const second = encodeURIComponent("https://img/b.jpg");
    expect(render(card())).toContain(second);
    expect(render(card({ hoverImageUrl: null }))).not.toContain(second);
  });
});
