import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ContactPage from "@/app/contact/page";

const html = renderToStaticMarkup(<ContactPage />);

describe("Contact page", () => {
  it("shows Mwaleo and the confirmed locality without inherited contact details", () => {
    expect(html).toContain("Contact Mwaleo Green Energy");
    expect(html).toContain("Nairobi CBD");
    expect(html).not.toMatch(/Stanbank House|watchfusion|mailto:|tel:|wa\.me/i);
  });

  it("checks whether the Wix form is available before claiming it can send messages", () => {
    expect(html).toContain("Send us a message");
    expect(html).toContain("Loading the message form");
    expect(html).not.toMatch(/sent successfully|message has been sent/i);
  });

  it("makes no delivery or returns promises and has one main heading", () => {
    expect(html).not.toMatch(/free (delivery|shipping)|30-day|3-7 business/i);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(/<h1[^>]*font-display/);
  });
});
