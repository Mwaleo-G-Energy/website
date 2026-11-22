import { describe, expect, it } from "vitest";
import config from "../tailwind.config";

describe("tailwind theme", () => {
  const fonts = (config.theme?.extend as { fontFamily?: Record<string, string[]> })?.fontFamily ?? {};

  it("sets the text font to DM Sans through its CSS variable", () => {
    expect(fonts.sans?.[0]).toBe("var(--font-sans)");
  });

  it("offers a display font for headings, with a sans-serif fallback", () => {
    expect(fonts.display?.[0]).toBe("var(--font-display)");
    expect(fonts.display).toContain("sans-serif");
  });
});
