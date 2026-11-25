"use client";

import Link from "next/link";
import { MessageSquare, Store } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/hooks/useCartStore";
import { TABS, activeTab, type TabKey } from "@/lib/tabs";
import { TabBagIcon, TabHomeIcon } from "@/components/icons";

const ICONS: Record<TabKey, (props: { className?: string }) => JSX.Element> = {
  home: TabHomeIcon,
  shop: (props) => <Store {...props} strokeWidth={1.5} strokeLinecap="square" />,
  contact: (props) => <MessageSquare {...props} strokeWidth={1.5} strokeLinecap="square" />,
  cart: TabBagIcon,
};

// A compact Mwaleo navigation dock: leaf marks the current destination, with sun reserved for the cart count.
export const TabBarView = ({
  pathname,
  counter,
}: {
  pathname: string;
  counter: number;
}) => {
  const current = activeTab(pathname);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] md:hidden">
      <nav
        aria-label="Main"
        className="pointer-events-auto mx-auto max-w-md overflow-hidden rounded-2xl border border-gray-200 border-t-2 border-t-brand-leaf bg-white px-1 shadow-[0_8px_28px_-12px_rgba(20,24,27,0.38)] dark:border-gray-700 dark:border-t-brand-gold dark:bg-[#1f2428] dark:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.85)]"
      >
        <ul className="grid grid-cols-4">
          {TABS.map((tab) => {
            const Icon = ICONS[tab.key];
            const active = current === tab.key;
            return (
              <li key={tab.key}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={tab.key === "cart" && counter > 0 ? `Cart, ${counter} items` : undefined}
                  className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                    active ? "font-semibold text-brand-leaf-ink dark:text-brand-gold" : "text-gray-600 active:text-brand-leaf-ink dark:active:text-white"
                  }`}
                >
                  <span className={`relative flex h-8 w-12 items-center justify-center rounded-lg transition-colors ${active ? "bg-brand-leaf/10 dark:bg-brand-gold/10" : ""}`}>
                    <Icon className="h-6 w-6" />
                    {tab.key === "cart" && counter > 0 && (
                      <span
                        data-cart-count={counter}
                        className="absolute -top-1 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-black ring-2 ring-white dark:ring-[#1f2428]"
                      >
                        {counter}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// Reads the current page and the cart count. The cart is loaded into the store by NavIcons on every page.
const BottomTabBar = () => {
  const pathname = usePathname();
  const { counter } = useCartStore();
  return <TabBarView pathname={pathname} counter={counter} />;
};

export default BottomTabBar;
