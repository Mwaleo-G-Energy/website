import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ counter: 0 }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/useWixClient", () => ({
  useWixClient: () => ({ auth: { loggedIn: () => false, logout: vi.fn() } }),
}));
vi.mock("@/hooks/useCartStore", () => ({
  useCartStore: () => ({ counter: state.counter, getCart: vi.fn() }),
}));

import NavIcons from "@/components/NavIcons";

const html = () => renderToStaticMarkup(<NavIcons />);

describe("desktop navigation actions", () => {
  beforeEach(() => {
    state.counter = 0;
  });

  it("shows aligned, keyboard-accessible account and cart controls without notifications", () => {
    const markup = html();
    expect(markup).toContain('aria-label="Log in"');
    expect(markup).toContain('aria-label="Cart"');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).toContain("focus-visible:outline");
    expect(markup).toContain("h-10 w-10");
    expect(markup).not.toContain("notification.png");
  });

  it("announces the cart count accessibly", () => {
    state.counter = 3;
    expect(html()).toContain('aria-label="Cart, 3 items"');
  });
});
