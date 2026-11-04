# Deployment and release handover

Status on 4 November 2026: Worker `find-my-routine` was deployed to the authenticated Cloudflare account, version `d3f669eb-4070-4379-9722-705cc7351830`. Its newly registered address is https://find-my-routine.wellness-prototype-7d3.workers.dev. The homepage and health endpoint returned HTTP 200 over HTTPS. The full deployed journey has not been independently verified.

## Verification

- `npm test`: 58 tests passed. `npm run build`, including catalogue validation, and `npm run lint` passed. The isolated Playwright suite has 11 browser tests; see the latest run for its result.
- Browser tests cover the no-photo simulated checkout, mocked photo flow, state recovery, unmatched concerns, changing answers, quote and checkout errors, discount tiers, and several viewport sizes. A previous manual local check waited the actual 30 seconds; automated timer tests simulate time.
- Real local and deployed Worker requests to Gemini 3.6 Flash using synthetic non-personal images returned HTTP 200 and `unusable_image`. It verifies connectivity and the expected rejection of that image, not accuracy on a human photo. No personal photo was tested. Browser tests mock Gemini and run in an isolated configuration without the local `.dev.vars`.
- Welcome-screen widths from 320 to 1280 CSS pixels and several narrow-screen flows were checked. A limited 200% CSS zoom and keyboard check passed; no physical phone, native camera, full browser-zoom or assistive-technology audit was performed.
- Deployment output included both rate-limit bindings and three hidden secret values; secret names and types were subsequently confirmed. Public HTTPS, health, and synthetic-image provider connectivity passed. The full deployed checkout remains unverified. Sixteen invalid photo requests returned 400 rather than 429, so live rate-limit enforcement remains unverified.

## Configuration and safeguards

The user confirmed the Gemini project is free tier. The deployed model is `gemini-3.6-flash` and data mode is `free`. Google's [Gemini terms](https://ai.google.dev/gemini-api/terms) say not to submit personal or sensitive information to unpaid services. **Do not use real personal photos with this free-tier configuration.** The photo screen describes the data mode. Review applicable privacy, age and region restrictions before real-user use. The app does not enforce all such restrictions.

The Worker sends a processed image after the user proceeds with a photo, and does not intentionally persist images or log request bodies. Photo-linked review and kit state clear on refresh. Google data-use and retention terms still apply. Suggested visual labels are preselected for user review; their accuracy has not been evaluated.

Two approximate Cloudflare bindings limit photo requests: 12 per 60 seconds per connecting IP and 60 per 60 seconds per Cloudflare location. Missing bindings fail closed. These are not a strict global spending cap; shared mobile IPs may be affected. Namespaces are `73420301` and `73420302`; verify uniqueness and live enforcement. See [Cloudflare Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

The catalogue and rules versions are `demo-2026-11-04` and `demo-rules-2026-11-04a`. Products, prices, mappings and discount are unverified sample data; checkout is simulated and creates no order or payment. Product images are placeholders. Licensed Neue Haas Grotesk Display Pro and FreightBig Pro files were not supplied, so fallbacks apply; the hair core colour is unconfirmed.

## Costs

The user reports a free Gemini project; actual quotas and spend controls were not independently inspected. The Cloudflare account plan is unknown. Published [Cloudflare limits](https://developers.cloudflare.com/workers/platform/limits/) for Workers Free include 100,000 requests per day and 10 ms CPU per HTTP request; paid limits differ. Gemini limits depend on account and model; inspect [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [pricing](https://ai.google.dev/gemini-api/docs/pricing), and billing controls in the account. No global cost cap has been verified.

## Run and redeploy

```powershell
npm install
npm test
npm run build
npm run lint
npm run test:e2e
npm run dev
```

On systems without a Playwright browser, install Chromium with `npx playwright install chromium`. Keep `.dev.vars` private and Git-ignored; never put a key in frontend code or logs. The deployed configuration was uploaded from `.dev.vars` as three Cloudflare secrets. To update code and those values on the same verified account and Worker:

```powershell
npm run build
npx wrangler deploy --secrets-file .dev.vars --strict
```

Review the secret names in the local file without exposing values before deploying. Ordinary redeploys retain existing secrets, but changing `.dev.vars` locally does not update deployed secrets unless they are uploaded again. Do not share the local `dist` directory: the build may contain local development configuration outside the public client assets.

Test the complete no-photo journey and simulated checkout in a fresh browser and investigate live rate limiting. Test provider connectivity using a non-personal synthetic image while the account is on the free tier. Do not treat an address as verified until those checks pass.

## Rollback

```powershell
npx wrangler deployments list --name find-my-routine
$VersionId = 'REPLACE_WITH_VERIFIED_PREVIOUS_VERSION_ID'
npx wrangler rollback $VersionId --name find-my-routine
```

Rollback changes the active deployment immediately; verify the target and version first. See [Cloudflare rollback documentation](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

