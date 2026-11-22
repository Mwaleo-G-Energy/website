import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import config from "../../tailwind.config";

// The page is drawn under the notch (viewport-fit=cover), so the page itself has to stay inside the safe area.
describe("root layout", () => {
  const source = readFileSync("src/app/layout.tsx", "utf8");
  const bodyTag = source.match(/<body\s+className=\{`([^`]*)`\}/)?.[1] ?? "";

  it("draws under the notch", () => {
    expect(source).toContain('viewportFit: "cover"');
  });

  it("leaves room at the bottom of every page for the floating phone dock", () => {
    expect(bodyTag).toContain("pb-[calc(5.5rem_+_env(safe-area-inset-bottom))]");
  });

  it("pads the body, not some other element, left and right", () => {
    expect(bodyTag).toContain("pl-[env(safe-area-inset-left)]");
    expect(bodyTag).toContain("pr-[env(safe-area-inset-right)]");
  });
});

describe("fonts", () => {
  const source = readFileSync("src/app/layout.tsx", "utf8");
  const bodyTag = source.match(/<body\s+className=\{`([^`]*)`\}/)?.[1] ?? "";

  it("loads DM Sans for body text and Montserrat for headings", () => {
    expect(source).toContain('src: "./fonts/dm-sans-latin.woff2"');
    expect(source).toContain('src: "./fonts/montserrat-latin.woff2"');
  });

  it("names the CSS variables the Tailwind theme reads, so a rename on one side cannot silently drop the fonts", () => {
    expect(source).toContain('variable: "--font-sans"');
    expect(source).toContain('variable: "--font-display"');
    const fonts = (config.theme?.extend as { fontFamily?: Record<string, string[]> })?.fontFamily ?? {};
    expect(fonts.sans?.[0]).toBe("var(--font-sans)");
    expect(fonts.display?.[0]).toBe("var(--font-display)");
  });

  it("loads only the weights specified by the brand system", () => {
    expect(source).toContain('weight: "400 500"');
    expect(source).toContain('weight: "700 800"');
  });

  it("puts both font variables on the body and sets the text font", () => {
    expect(bodyTag).toContain("dmSans.variable");
    expect(bodyTag).toContain("montserrat.variable");
    expect(bodyTag).toContain("font-sans");
  });
});

describe("theme", () => {
  const source = readFileSync("src/app/layout.tsx", "utf8");

  it("sets the theme before the page paints, so a dark page never flashes white", () => {
    expect(source).toContain("THEME_SCRIPT");
    expect(source).toMatch(/<head>[\s\S]*dangerouslySetInnerHTML[\s\S]*<\/head>/);
    expect(source).toContain("suppressHydrationWarning");
  });
});
