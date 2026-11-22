import AuthForm from "@/components/auth/AuthForm";
import type { ShowcaseWatch } from "@/components/auth/AuthShowcase";
import { OAuthStrategy, createClient } from "@wix/sdk";
import { unstable_cache } from "next/cache";
import { listProducts } from "@/lib/storeProducts";
import { SITE_NAME } from "@/lib/site";

export const metadata = { title: "Log in" };
export const revalidate = 600;

// Kept for ten minutes, so the login page does not wait on a product search for every visitor.
// It uses its own visitor session, since a cached result cannot depend on the shopper's cookies.
const loadWatches = unstable_cache(async (): Promise<ShowcaseWatch[]> => {
  try {
    const client = createClient({ auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }) });
    client.auth.setTokens(await client.auth.generateVisitorTokens());
    const page = await listProducts(
      (url, init) => client.fetchWithAuth(url, { ...init, signal: AbortSignal.timeout(4000) }),
      { limit: 5 }
    );
    const watches = page.items.flatMap((p) =>
      p.imageUrl ? [{ id: p.id, name: p.name, imageUrl: p.imageUrl, priceLabel: p.priceLabel, slug: p.slug }] : []
    );
    if (watches.length === 0) throw new Error("no products with a picture");
    return watches;
  } catch (e) {
    console.error("Login page: could not load products for the showcase", e);
    throw e; // a failed load is not kept; the page shows the fallback below
  }
}, ["login-showcase-watches"], { revalidate: 600 });

const watchesOrFallback = async (): Promise<ShowcaseWatch[]> => {
  try {
    return await loadWatches();
  } catch {
    return [{ id: "mwaleo", name: SITE_NAME, imageUrl: "/share-image.png", priceLabel: "" }];
  }
};

const LoginPage = async () => <AuthForm watches={await watchesOrFallback()} />;

export default LoginPage;
