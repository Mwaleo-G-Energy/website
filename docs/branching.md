# How a change reaches the live site

`develop` is the preview branch. `main` is the production branch for `mwaleogreenenergy.co.ke`.

1. Branch from `develop` and open a draft pull request into it.
2. Run lint, type-check, tests, and build. Review the pull request in a fresh session once CI is green, then merge it with a merge commit.
3. Ask the owner to review the Vercel preview. Use the URL for the Mwaleo Vercel project.
4. Open a release pull request from `develop` into `main` after the owner approves the preview.

For a production hotfix, open the pull request into `main`, then merge `main` back into `develop` through a pull request.

## Connect the GitHub repo to Vercel

Import `Mwaleo-G-Energy/website` into the Mwaleo Vercel project. Use the Next.js preset, the repository root, and Node.js 22 to match CI. Keep the preset’s build and output settings.

Check the Production Branch setting during setup. GitHub defaults to `develop`, while this project uses `main` for production. If the import screen is about to deploy a branch with the inherited storefront, wait until the Mwaleo release is ready. Set the production branch to `main` before attaching the custom domain. Vercel treats `develop` and pull request branches as previews once `main` is set.

## Environment variables

Use [.env.example](../.env.example) as the checklist for Vercel Project Settings → Environment Variables. Add the values to Preview and Production. For local work, copy the template to `.env.local` and fill in the values there.

| Name | Value and behavior |
|---|---|
| `NEXT_PUBLIC_WIX_CLIENT_ID` | Public OAuth client ID from Mwaleo's Wix Headless setup. Required for the Wix storefront connection, including products, member login and cart. The build can pass with this missing. |
| `WIX_CLIENT_SECRET` | Secret for the same Wix client. Required for the Wix contact form and custom delivery fees. Store it as sensitive and keep it server-side. |
| `FEATURED_PRODUCTS_CATEGORY_ID` | Wix Stores category ID for Customer Favourites. That section requests an unfiltered list when this is blank. |
| `NEW_PRODUCTS_CATEGORY_ID` | Wix Stores category ID for New Products. That section requests an unfiltered list when this is blank. |
| `NEXT_PUBLIC_MWALEO_WHATSAPP_NUMBER` | Confirmed number in international digits with no plus sign or spaces. WhatsApp links are hidden when the value is missing or invalid. |
| `NEXT_PUBLIC_MWALEO_FREE_DELIVERY_FROM` | Approved free-delivery threshold in KES, if there is one. Leave blank to use the rate from Wix. |

Add the full callback URL for each environment to the Wix Headless client's allowed redirects, for example `https://mwaleogreenenergy.co.ke/login/callback` for production. Redeploy after adding or changing Vercel variables. A checkout backed by the live Wix store creates a real order. Coordinate any order verification with the owner.
