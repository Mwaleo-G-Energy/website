import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CategoryCarousel from "@/components/CategoryCarousel";

const categories = [
  { slug: "off-grid-inverters", name: "Off-grid inverters", description: "Inverter chargers for solar and backup power." },
  { slug: "lithium-batteries", name: "Lithium batteries", description: "Battery storage for compatible solar systems." },
  { slug: "solar-kits", name: "Solar kits", description: "Matched equipment for a complete off-grid system." },
  { slug: "lead-acid-batteries", name: "Lead-acid batteries", description: "12V batteries for backup and off-grid systems." },
  { slug: "solar-panels", name: "Solar panels", description: "Solar modules for home and business power systems." },
] as const;

describe("homepage category carousel", () => {
  it("shows the confirmed categories as shop links with side navigation and swipeable slides", () => {
    const html = renderToStaticMarkup(<CategoryCarousel categories={categories} />);
    expect(html).toContain('role="region" aria-roledescription="carousel" aria-label="Shop by category"');
    expect(html).toContain('aria-label="Previous categories"');
    expect(html).toContain('aria-label="Next categories"');
    expect(html.match(/data-category-slide/g)).toHaveLength(5);
    expect(html).toContain('href="/shop/lead-acid-batteries"');
    expect(html).toContain('href="/shop/solar-panels"');
  });
});
