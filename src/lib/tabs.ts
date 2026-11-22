export type TabKey = "home" | "shop" | "contact" | "cart";

export type Tab = { key: TabKey; label: string; href: string };

export const TABS: Tab[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "shop", label: "Shop", href: "/shop" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "cart", label: "Cart", href: "/cart" },
];

// Which tab matches the page the shopper is on.
export const activeTab = (pathname: string): TabKey | null => {
  if (pathname === "/") return "home";
  if (pathname === "/cart" || pathname.startsWith("/cart/")) return "cart";
  if (pathname === "/shop" || pathname.startsWith("/shop/")) return "shop";
  if (pathname === "/contact") return "contact";
  return null;
};
