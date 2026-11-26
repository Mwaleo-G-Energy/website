import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("product page buttons", () => {
  const source = readFileSync("src/app/[slug]/page.tsx", "utf8");

  it("keeps Order on WhatsApp directly under Add to Cart, in one tight group", () => {
    const start = source.indexOf('<div className="flex flex-col gap-3">');
    const end = source.indexOf('<div className="h-px', start);
    const group = start >= 0 && end > start ? source.slice(start, end) : "";
    expect(group).toContain("<Add");
    expect(group).toContain("<CustomizeProducts");
    expect(group.indexOf("<Add")).toBeLessThan(group.indexOf("<OrderOnWhatsApp"));
    expect(group.indexOf("<CustomizeProducts")).toBeLessThan(group.indexOf("<OrderOnWhatsApp"));
  });
});
