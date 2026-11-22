import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("canonical links", () => {
  it("are not set once for the whole site, which would make every page claim to be the home page", () => {
    expect(read("src/app/layout.tsx")).not.toMatch(/canonical/);
  });

  it("name each main page as itself", () => {
    expect(read("src/app/page.tsx")).toMatch(/canonical:\s*["']\/["']/);
    for (const [file, path] of [
      ["src/app/shop/page.tsx", "/shop"],
      ["src/app/deals/page.tsx", "/deals"],
      ["src/app/contact/page.tsx", "/contact"],
    ]) {
      expect(read(file)).toMatch(new RegExp(`canonical:\\s*["']${path}["']`));
    }
  });
});

describe("page titles", () => {
  it("give the shop, deals and contact pages a title and a description of their own", () => {
    for (const file of ["src/app/shop/page.tsx", "src/app/deals/page.tsx", "src/app/contact/page.tsx"]) {
      const source = read(file);
      expect(source).toMatch(/export const metadata|export async function generateMetadata/);
      expect(source).toMatch(/title:\s*["'][^"']+["']/);
      expect(source).toMatch(/description:\s*"[^"]{40,}"/);
    }
  });
});

describe("the picture shown when a link to the shop is shared", () => {
  const layout = read("src/app/layout.tsx");

  it("uses a dedicated share card for social previews", () => {
    expect(layout).not.toMatch(/images:\s*\[\s*\{\s*url:\s*"\/logo\.png"/);
    expect(layout).not.toMatch(/images:\s*\["\/logo\.png"\]/);
    expect(layout).toContain('url: "/share-image.png"');
    expect(layout).toContain('images: ["/share-image.png"]');
  });

  it("is the 1200 by 630 size link previews ask for, and the file is that size and a real PNG", () => {
    expect(layout).toMatch(/width:\s*1200,\s*height:\s*630/);
    const png = readFileSync("public/share-image.png");
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  it("is a small file, so a chat app does not skip it", () => {
    expect(readFileSync("public/share-image.png").length).toBeLessThan(300_000);
  });
});

describe("the shop's name", () => {
  const files = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? files(`${dir}/${e.name}`) : /\.(ts|tsx)$/.test(e.name) && !/\.test\./.test(e.name) ? [`${dir}/${e.name}`] : []
    );

  it("is spelled Mwaleo Green Energy in every title, link preview and structured-data line the site makes", () => {
    const wrong = files("src").filter((f) => /WatchFusion Kenya|WatchFusionKe/.test(readFileSync(f, "utf8")));
    expect(wrong).toEqual([]);
    expect(read("src/lib/site.ts")).not.toContain("SITE_ALTERNATE_NAMES");
    expect(read("src/lib/site.ts")).toContain('export const SITE_NAME = "Mwaleo Green Energy";');
  });

  it("is written in the page language of Kenya, and the layout leaves each page's own title and description to its link preview", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain('<html lang="en-KE"');
    const share = layout.slice(layout.indexOf("openGraph:"), layout.indexOf("robots:"));
    expect(share).not.toMatch(/title:|description:/);
    expect(share).toContain("siteName: SITE_NAME");
  });
});

describe("structured data", () => {
  it("tells search engines about the shop and its search from the home page, once", () => {
    const home = read("src/app/page.tsx");
    expect(home).toContain("organizationJsonLd");
    expect(home).toContain("websiteJsonLd");
    expect(home).toContain("jsonLdScript");
  });

  it("describes each product with a clean description, a trail of links and the shop's own wording from the store", () => {
    const page = read("src/app/[slug]/page.tsx");
    expect(page).toContain("productMetadata");
    expect(page).toContain("productJsonLd");
    expect(page).toContain("breadcrumbJsonLd");
    expect(page).toContain("jsonLdScript");
    expect(page).not.toMatch(/replace\(\/<\[\^>\]\*>\/g/);
    expect(page).toContain("seoData");
  });

  it("gives the Shop, Deals and Contact pages their own address in link previews, not the home page's", () => {
    for (const [file, path] of [["src/app/shop/page.tsx", "/shop"], ["src/app/deals/page.tsx", "/deals"], ["src/app/contact/page.tsx", "/contact"]]) {
      expect(read(file)).toContain(`pageShare("${path}")`);
    }
  });

  it("gives the product photo the product's name as its text", () => {
    expect(read("src/app/[slug]/page.tsx")).toMatch(/<ProductImages[^>]*name=\{product\.name/);
  });
});

describe("the home page's title and description", () => {
  const layout = read("src/app/layout.tsx");

  it("uses confirmed business details in the shared title and description", async () => {
    const { SITE_DESCRIPTION } = await import("@/lib/site");
    expect(layout).toContain('default: `${SITE_NAME} | Felicity Solar in Nairobi`');
    expect(layout).toContain("description: SITE_DESCRIPTION");
    expect(SITE_DESCRIPTION).toContain("Authorised Felicity Solar dealer in Nairobi CBD");
    expect(SITE_DESCRIPTION).not.toMatch(/watch|engraving|free delivery/i);
  });
});

describe("home storefront", () => {
  it("introduces the solar range and links to the shop", () => {
    const home = read("src/app/page.tsx");
    expect(home).toContain("Off-grid solar and backup power");
    expect(home).toContain('href="/shop"');
    expect(home).not.toContain("<Slider");
    expect(home).toContain("/solar/felicity-ivem6048-ii.png");
    expect(home).toContain("LAUNCH_CATEGORIES.map");
    expect(home.indexOf("Shop by category")).toBeGreaterThan(home.indexOf("Off-grid solar and backup power"));
    expect(home).toContain("categoryId &&");
  });
});

describe("retired storefront pages", () => {
  it("sends former gift-voucher and returns links to active Mwaleo pages", () => {
    const config = read("next.config.mjs");
    expect(config).toMatch(/source: "\/gift-vouchers", destination: "\/shop"/);
    expect(config).toMatch(/source: "\/return-policy", destination: "\/contact"/);
  });
});
