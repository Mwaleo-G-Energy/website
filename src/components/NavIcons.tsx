"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCart, UserRound } from "lucide-react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";

const NavIcons = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const wixClient = useWixClient();
    const isLoggedIn = wixClient.auth.loggedIn();

    // TEMPORARY
    // const isLoggedIn = false;

    const handleProfile = () => {
        if (!isLoggedIn) {
            router.push("/login");
        } else {
            setIsProfileOpen((prev) => !prev);
        }
    };

    // AUTH WITH WIX-MANAGED AUTH

    // const wixClient = useWixClient();

    // const login = async () => {
    //   const loginRequestData = wixClient.auth.generateOAuthData(
    //     "http://localhost:3000"
    //   );


    //   localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
    //   const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
    //   window.location.href = authUrl;
    // };

    const handleLogout = async () => {
        setIsLoading(true);
        Cookies.remove("refreshToken");
        const { logoutUrl } = await wixClient.auth.logout(window.location.href);
        setIsLoading(false);
        setIsProfileOpen(false);
        router.push(logoutUrl);
    };


    const { counter, getCart } = useCartStore();

    useEffect(() => {
        getCart(wixClient);
    }, [wixClient, getCart]);

    return (
        <div className="relative flex items-center gap-1">
            <button
                type="button"
                aria-label={isLoggedIn ? "Account" : "Log in"}
                aria-expanded={isLoggedIn ? isProfileOpen : undefined}
                aria-controls={isLoggedIn && isProfileOpen ? "desktop-account-menu" : undefined}
                onClick={handleProfile}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--text)] transition-colors hover:bg-[var(--card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sun)]"
            >
                <UserRound aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
            </button>
            {isProfileOpen && (
                <div id="desktop-account-menu" className="absolute right-0 top-full z-20 mt-2 min-w-40 rounded-md border border-[var(--line)] bg-[var(--surface)] p-2 text-sm text-[var(--text)] shadow-md">
                    <Link href="/profile" className="block rounded px-3 py-2 hover:bg-[var(--card)]">Profile</Link>
                    <button type="button" className="mt-1 block w-full rounded px-3 py-2 text-left hover:bg-[var(--card)]" onClick={handleLogout}>
                        {isLoading ? "Logging out" : "Logout"}
                    </button>
                </div>
            )}
            <button
                type="button"
                aria-label={counter > 0 ? `Cart, ${counter} items` : "Cart"}
                aria-haspopup="dialog"
                aria-expanded={isCartOpen}
                onClick={() => setIsCartOpen((prev) => !prev)}
                className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--text)] transition-colors hover:bg-[var(--card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sun)]"
            >
                <ShoppingCart aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                {counter > 0 && (
                    <span
                        key={counter}
                        className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--page)] bg-[var(--sun)] px-1 text-xs font-bold text-[var(--ink)]"
                    >
                        {counter}
                    </span>
                )}
            </button>
            {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)}/>}
        </div>
    );
};

export default NavIcons;
