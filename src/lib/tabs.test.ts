import { describe, expect, it } from "vitest";
import { TABS, activeTab } from "@/lib/tabs";

describe("TABS", () => {
  it("are Home, Shop, Contact and Cart, in that order", () => {
    expect(TABS.map((t) => t.label)).toEqual(["Home", "Shop", "Contact", "Cart"]);
  });

  it("links to the catalogue, contact page and cart", () => {
    const href = (key: string) => TABS.find((t) => t.key === key)?.href;
    expect(href("shop")).toBe("/shop");
    expect(href("contact")).toBe("/contact");
    expect(href("cart")).toBe("/cart");
  });

  it("keep every tab inside the site, so no tab opens WhatsApp", () => {
    expect(TABS.every((t) => t.href.startsWith("/"))).toBe(true);
  });
});

describe("activeTab", () => {
  it("marks Home only on the homepage", () => {
    expect(activeTab("/")).toBe("home");
    expect(activeTab("/return-policy")).toBeNull();
  });

  it("marks Shop for the catalogue and its categories", () => {
    expect(activeTab("/shop")).toBe("shop");
    expect(activeTab("/shop/off-grid-inverters")).toBe("shop");
    expect(activeTab("/shopper-guide")).toBeNull();
    expect(activeTab("/list")).toBeNull();
  });

  it("marks Contact on the contact page", () => {
    expect(activeTab("/contact")).toBe("contact");
  });

  it("marks Cart on the cart page", () => {
    expect(activeTab("/cart")).toBe("cart");
  });

  it("does not mark Cart on a product whose address merely starts with 'cart'", () => {
    expect(activeTab("/cartier-style-watch")).toBeNull();
    expect(activeTab("/cartoon-kids-watch")).toBeNull();
  });
});
