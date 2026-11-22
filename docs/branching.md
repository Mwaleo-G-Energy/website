# How a change reaches the live site

`develop` is the preview branch. `main` is the production branch for `mwaleogreenenergy.co.ke`.

1. Branch from `develop` and open a draft pull request into it.
2. Run lint, type-check, tests, and build. Review the pull request in a fresh session once CI is green, then merge it with a merge commit.
3. Ask the owner to review the Vercel preview. Use the URL for the Mwaleo Vercel project.
4. Open a release pull request from `develop` into `main` after the owner approves the preview.

For a production hotfix, open the pull request into `main`, then merge `main` back into `develop` through a pull request.

## Preview configuration

Set the Mwaleo Wix configuration in both Vercel Preview and Production. A successful build can still leave the catalogue or sign-in unavailable when the Wix client ID is missing.

Set `NEXT_PUBLIC_MWALEO_WHATSAPP_NUMBER` to the confirmed international number in digits. When it is missing or invalid, WhatsApp links are hidden. Set `NEXT_PUBLIC_MWALEO_FREE_DELIVERY_FROM` only if Mwaleo confirms a free-delivery threshold in KES. Without it, the delivery engine uses the rate from Wix.

A checkout on a preview backed by the live Wix store creates a real order. Coordinate any order verification with the owner.
