import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const categories = vi.hoisted(() => ({ list: [] as { name: string; slug: string }[] }));
vi.mock("@/hooks/useCategories", () => ({ default: () => categories.list }));

import Footer from "@/components/Footer";

const items = [
  { _id: "all", name: "All Products", slug: "all-products" },
  { _id: "l", name: "Ladies Watches", slug: "ladies-watches" },
  { _id: "g", name: "Gent's Watches", slug: "gents-watches" },
  { _id: "n", name: "Naviforce", slug: "naviforce-watches-kenya" },
  { _id: "e", name: "Editor's Picks", slug: "editors-picks" },
  { _id: "c", name: "Customizable Gifts", slug: "customizable-gifts" },
  { _id: "x1", name: "Extra One", slug: "extra-one" },
  { _id: "x2", name: "Extra Two", slug: "extra-two" },
];

const render = async () => renderToStaticMarkup(<Footer />);
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

beforeEach(() => {
  categories.list = items.filter((c) => c.slug !== "all-products").map((c) => ({ name: c.name, slug: c.slug }));
});

describe("Footer", () => {
  it("is laid out as a grid, four columns on a computer and two on a phone", async () => {
    const html = await render();
    expect(html).toContain("grid-cols-2");
    expect(html).toMatch(/md:grid-cols-\[[^\]]+\]/);
  });

  it("has a column each for the brand, the shop, the pages and the shop's details", async () => {
    const t = text(await render());
    for (const heading of ["Shop", "Explore", "Visit us"]) expect(t).toContain(heading);
    expect(t).toContain("Mwaleo Green Energy");
  });

  it("lists the real categories as links, starting with the whole shop", async () => {
    const html = await render();
    const shopColumn = html.split(">Shop<")[1]?.split("</nav>")[0] ?? "";
    expect(shopColumn).toContain('href="/shop"');
    for (const slug of ["ladies-watches", "gents-watches", "naviforce-watches-kenya", "editors-picks", "customizable-gifts"]) {
      expect(shopColumn).toContain(`href="/shop/${slug}"`);
    }
    expect(shopColumn).not.toContain("all-products");
  });

  it("shows only the whole-shop link until the categories have loaded, or when they cannot be loaded", async () => {
    categories.list = [];
    const html = await render();
    expect(html).toContain('href="/shop"');
    expect(html).not.toContain("cat=");
  });

  it("links only pages that exist: no Terms or Privacy until those pages are written", async () => {
    const t = text(await render());
    expect(t).not.toMatch(/Terms of Service|Privacy Policy|Couple Sets/);
    const html = await render();
    expect(html).not.toContain('href="#"');
    for (const path of ["/", "/shop", "/contact"]) expect(html).toContain(`href="${path}"`);
  });

  it("shows the confirmed locality and leaves out unconfirmed contact details", async () => {
    const html = await render();
    expect(html).toContain("Nairobi CBD");
    expect(html).not.toMatch(/Stanbank House|watchfusion|mailto:|tel:|wa\.me/i);
  });

  it("carries the copyright line without a year that could go stale on a page built months ago", async () => {
    const html = await render();
    expect(html).toContain("© Mwaleo Green Energy");
    expect(html).not.toMatch(/© \d{4}/);
  });

  it("keeps its text left aligned, with section titles that are headings for screen readers", async () => {
    const html = await render();
    expect(html).not.toContain("items-center md:items-start");
    expect((html.match(/<h2/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it("is the page's footer landmark", async () => {
    expect(await render()).toMatch(/^<footer/);
  });

  it("groups the locality in an address landmark", async () => {
    expect(await render()).toMatch(/<address[^>]*><p>Nairobi CBD<\/p><\/address>/);
  });

  it("centres the brand, the link columns, the details and the copyright on a phone, and keeps them left aligned from tablet width up", async () => {
    const html = await render();
    const grid = html.match(/<div class="grid[^"]*">([\s\S]*)<\/div><\/div><\/footer>/)?.[1] ?? "";
    for (const part of [
      /<nav aria-label="Shop" class="[^"]*"/,
      /<nav aria-label="Explore" class="[^"]*"/,
      /<div class="[^"]*col-span-2[^"]*"[^>]*><h2[^>]*>Visit us/,
    ]) {
      const tag = grid.match(part)?.[0] ?? "";
      expect(tag).toMatch(/\btext-center\b/);
      expect(tag).toMatch(/\bmd:text-left\b/);
    }
    expect(html).toMatch(/<p class="[^"]*text-center[^"]*md:text-left[^"]*">© Mwaleo/);
  });

  it("shows the reverse logo on every screen size", async () => {
    const html = await render();
    const link = html.match(/<a [^>]*class="[^"]*\bmx-auto\b[^"]*"[^>]*><img[^>]*>/)?.[0] ?? "";
    expect(link).not.toBe("");
    expect(link).toContain("/mwaleo-logo-horizontal-reverse.svg");
    expect(link).toMatch(/\bw-full\b/);
    expect(link).toMatch(/max-w-\[12\.5rem\]/);
    expect(link).not.toMatch(/\bhidden\b/);
    expect(link).not.toContain("object-cover");
  });

  it("has only the logo in the brand column, with no second small logo or written tagline", async () => {
    const html = await render();
    expect((html.match(/<img[^>]*src="[^"]*mwaleo-logo-horizontal-reverse\.svg[^"]*"/g) ?? []).length).toBe(1);
    expect(html).not.toContain("Watches and gifts in Nairobi");
    expect(html).not.toMatch(/>Mwaleo Green Energy<\/span>/);
  });

  it("gives the brand column more room than the others on computers, so the logo can be big", async () => {
    const html = await render();
    expect(html).toMatch(/md:grid-cols-\[1\.6fr_1fr_1fr_1\.3fr\]/);
  });

  it("centres the brand column on computers too: the logo sits in the middle of its column while the other columns stay left aligned", async () => {
    const html = await render();
    const brand = html.match(/<div class="([^"]*col-span-2[^"]*)"[^>]*><a [^>]*mx-auto/)?.[1] ?? "";
    expect(brand).toMatch(/\bmd:text-center\b/);
    expect(brand).not.toMatch(/md:text-left/);
    expect(html).toMatch(/<nav aria-label="Shop" class="[^"]*md:text-left/);
  });
});
