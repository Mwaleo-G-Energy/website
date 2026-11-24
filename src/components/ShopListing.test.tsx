import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const products = vi.hoisted(() => vi.fn());
vi.mock("@/components/ProductList", () => ({ default: (props: unknown) => { products(props); return <div>Product grid</div>; } }));
vi.mock("@/components/Filter", () => ({ default: () => <div>Price and sort controls</div> }));
vi.mock("@/components/CategoryChips", () => ({ default: () => <nav>Category links</nav> }));
vi.mock("@/lib/wixClientServer", () => ({ wixClientServer: async () => ({ fetchWithAuth: vi.fn() }) }));
vi.mock("@/lib/storeProducts", () => ({ getPriceBounds: async () => undefined }));
import ShopListing from "./ShopListing";

const searchParams = { min: "100", sort: "asc price", page: "2" };

describe("embedded shop listing", () => {
  it("uses a section heading and passes filter and pagination choices to the grid", async () => {
    const html = renderToStaticMarkup(await ShopListing({ category: null, categories: [], searchParams, embedded: true }));
    expect(html).toMatch(/<h2[^>]*>Shop all products<\/h2>/);
    expect(html).not.toContain("BreadcrumbList");
    expect(html).toContain("Price and sort controls");
    expect(products).toHaveBeenLastCalledWith(expect.objectContaining({ searchParams }));
  });

  it("keeps the page heading and breadcrumb for existing shop callers", async () => {
    const html = renderToStaticMarkup(await ShopListing({ category: null, categories: [], searchParams: {} }));
    expect(html).toMatch(/<h1[^>]*>Shop all products<\/h1>/);
    expect(html).toContain("BreadcrumbList");
  });
});
