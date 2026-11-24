import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("next/image", () => ({ default: ({ fill: _fill, ...props }: any) => <img {...props} /> }));
import SolarShowcase from "./SolarShowcase";

describe("solar showcase", () => {
  it("labels manufacturer scenes and offers an availability enquiry", () => {
    const html = renderToStaticMarkup(<SolarShowcase />);
    expect(html).toContain("Official Felicity Solar illustrations");
    expect(html).toContain('href="/contact"');
    expect(html).toContain('aria-label="Next product scene"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("IVEM5048-LV");
  });
});
