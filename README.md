# Find My Routine

A mobile-first Be Bodywise prototype with concern selection, optional photos, Google Gemini photo analysis after the user proceeds with a photo, editable visual suggestions, concern-specific questions, and a deterministic sample kit with simulated checkout. Suggestions are experimental observations, not diagnoses or measurements. Discounts and checkout are simulated prototype features.

Requires Node.js 22.12+ (or a newer version supported by Vite and Wrangler) and npm.

```powershell
npm install
npm run dev
npm test
npm run build
npm run lint
npm run test:e2e
```

Open the URL printed by Vite. The Worker and frontend share an origin; `GET /api/health` checks the Worker. `npm test` uses a mocked Gemini provider for route tests and does not make a live provider call.

## Gemini setup

Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey) and verify that the selected model is available to the associated account. Copy `.dev.vars.example` to `.dev.vars` and set `GEMINI_API_KEY`, `GEMINI_MODEL` (for example `gemini-3.6-flash`), and `GEMINI_DATA_MODE` (`free` or `paid`). Never commit `.dev.vars`, place keys in frontend code, or share keys in screenshots or logs. The deployed configuration stores all three values as Worker secrets. Missing or invalid data mode, key, or model disables analysis. The example leaves the mode blank so analysis stays disabled until it is explicitly set. The mode only controls the notice and does not alter Google's terms.

After the user proceeds with selected photos, the app sends one processed JPEG at a time to the Worker and Google Gemini. The photo screen discloses the provider and links to its terms. The app does not intentionally persist or log images or raw provider responses. Google data-use and retention terms still apply. In unpaid mode Google may use submissions to improve products and states that personal or sensitive information must not be submitted to unpaid services. See [Google's current Gemini terms](https://ai.google.dev/gemini-api/terms) and [data retention documentation](https://ai.google.dev/gemini-api/docs/zdr). The owner must review applicable age, region, privacy and provider restrictions before any real-user deployment; the app does not enforce all such restrictions.

To test live, use a properly configured account and an image whose use complies with the applicable provider terms. Start the app, select a concern, add the image, read the provider disclosure, proceed, and inspect the review flow. Do not use personal or sensitive images on unpaid services. A local request to Gemini 3.6 Flash with a synthetic, non-personal image succeeded and returned `unusable_image`; no personal photo or visual accuracy was tested.

The model may return `visible_bumps`, `visible_marks`, `uneven_looking_tone`, or `visible_flakes`, restricted by photo area. Suggested visual observations are preselected for user review; accuracy has not been evaluated and users can remove or add selections. Before relying on this feature, evaluate labels on a diverse consented test set with qualified reviewers, document false positives, false negatives and unusable-image results, and set acceptance thresholds. Re-evaluate after meaningful changes. Review selections and raw observations remain in memory only; refresh clears them along with photos. Concern selections and question answers remain in current-tab `sessionStorage`.

## Deployment protection

The Worker configuration declares approximate Cloudflare Rate Limiting bindings for photo analysis: 12 requests per 60 seconds per connecting IP and 60 requests per 60 seconds per Cloudflare location. The Worker returns 429 when either limit is exceeded and fails closed if a limiter is unavailable. These are not strict global limits, and shared mobile IPs may be affected. The deployment reported both bindings, but a burst of 16 invalid requests did not produce a 429, so live enforcement remains unverified. Verify namespace uniqueness, actual behavior and provider spending controls; use an account-supported WAF rule or stronger control where appropriate. See the [Cloudflare Rate Limiting API](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

Deployment and cost details, exact commands, rollback instructions and release blockers are in [docs/deployment.md](docs/deployment.md). The deployed public address passed its HTTPS and health checks.

Photos remain in browser memory until sent for analysis or cleared by refresh, tab close, replacement, or reset. JPEG, PNG and WebP files up to 10 MB are processed as JPEG, at most 1600px on the longest side and at most 2 MB. Camera capture uses a native file input and behavior depends on the device. HEIC, an orientation-tagged phone photo, and an actual iOS or Android camera were not verified. Browser emulation does not establish phone camera behavior. Full assistive-technology and 200% zoom audits remain outstanding.

No licensed font files were supplied. Neue Haas Grotesk Display Pro and FreightBig Pro use documented fallbacks when unavailable. The supplied black logo is used, and the hair core colour remains unconfirmed.

## Sample catalogue and recommendations

The versioned sample catalogue is in `worker/data/products.json`; deterministic rules are in `worker/data/rules.json`. The engine validates selected concerns, answers and user-confirmed photo-review choices, then chooses at most one rule per concern, prioritizes explicit answers, and merges duplicate products. Confirmed photo choices can trigger area-specific rules; the vision model never chooses products. Unsupported concerns can return no match. The preparation stage stores a fingerprint and timestamp in current-tab session storage. Valid successful results without photo-review choices are also stored and checked against the current catalogue and rules versions on return or refresh. Photo-linked results remain in memory only; since confirmed photo choices are not retained across refresh, those inputs change and a new preparation stage starts.

All products, variants, prices, and mappings are illustrative, unverified demo data, not verified Be Bodywise SKUs, inventory or suitability advice. The rules require qualified product review before real use. No authorized product images were supplied, so cards use a clearly marked local placeholder. Quantity controls, the proposed discount and simulated checkout are available; none creates an order or takes payment.

Run `npm run validate:data` to validate catalogue and rule integrity and confirm placeholder assets exist; this check also runs as part of `npm run build`. `GET /api/catalogue` returns public sample products and `POST /api/recommendations` returns the combined demo result. Phone-sized layouts were checked in a desktop in-app browser; an actual phone and full 200% zoom audit were not available.

## Preparation stage

After the final question, a fixed 30-second preparation screen runs at the same time as the recommendation request. **See my personalised kit** becomes available only after the full time has elapsed and a validated response is ready, including empty or partial results. A failed request can be retried without restarting the timer. Back to questions preserves the timestamp and successful result while inputs remain unchanged; changing a concern, answer, or confirmed photo choice invalidates them. Returning with the same inputs reuses the timer.

Refresh during loading restores the timestamp and starts a new request. A stored successful non-photo result is reused only after the current catalogue and rule versions are checked. When browser storage is unavailable, state continues in memory and may restart after refresh. The timestamp uses the device clock: this is a client-side prototype interaction, not a security control, and changing the clock can affect the wait.

The concern information card is always available. Ingredient and usage cards are hidden unless approved text is supplied; customer experiences are hidden because no permissioned reviews are available. After preparation, the kit opens with server-calculated sample pricing and simulated checkout. The preparation layout was checked in desktop browser emulation, not on an actual phone; a full 200% zoom and assistive-technology audit remain outstanding.

## Sample kit and simulated checkout

Recommended products begin at quantity 1. Each line can be changed from 1 to 10 or removed; removed lines stay removed for the current kit. The proposed prototype discount counts eligible product units, including duplicates: 0% for 0–1 units, 10% for 2, 20% for 3 and 30% for 4 or more. The discount applies only to eligible merchandise; pre-made kits are ineligible. These tiers are not a current Be Bodywise offer.

The Worker uses catalogue prices in integer paise. `POST /api/quote` validates product IDs, quantities and catalogue version and returns the current sample calculation. `POST /api/checkout/simulate` validates the same inputs, recalculates server-side and returns a display-only demo reference. It does not store an order or contact a payment provider. Sample prices and variants are unverified; delivery is a ₹0.00 demo assumption and taxes are shown as included in sample prices.

Kit lines and removals are stored in the current tab and the quote is requested again after refresh. For photo-linked recommendations, the existing privacy policy does not persist photo-review choices or their inferred recommendation; after refresh those selections and their kit must be regenerated, so quantities for that photo-linked kit cannot be restored. An actual phone, 200% zoom and complete assistive-technology audit were not available. Run `npm test` and `npm run build` for the automated checks.

## Release verification

Run `npm run test:e2e` for the Playwright suite; it starts an isolated local Worker and uses the installed Chrome on Windows, or a Playwright Chromium installation on other systems (`npx playwright install chromium`). Photo analysis is mocked in the browser tests. The separate synthetic-image test reached the configured Gemini model, but did not assess its accuracy. See [Google’s model documentation](https://ai.google.dev/gemini-api/docs/models).


## Local update (4 November 2026)

The updated private-prototype flow removes the separate consent checkbox, starts photo analysis after the user proceeds, and provides a scrollable report. The current version is deployed to the public Worker URL. Reference products and prices are held separately in `docs/reference-products.json` with `unverified_reference` status; they are not a verified live catalogue. Hair combinations and the missing source-question wording are documented in `docs/hair-reference.md`. The updated Worker was tested locally against Gemini with a synthetic image only.
## Storefront landing page

The entry page is a mobile-first storefront prototype based on the supplied screenshots. The toolbar opens the existing self-assessment. The menu, featured banners, category tabs, search and a browser-local demo cart are interactive; the cart does not create an order or accept payment. Product names, prices, offers and screenshots are reference examples rather than a live catalogue. Original screenshot crops are stored in `public/storefront`. The exact licensed fonts were not supplied; the existing brand font fallbacks apply.

The storefront product cards use a snapshot of publicly listed Be Bodywise products and images retrieved on 7 November 2026. Prices, availability and ratings may change, and the prototype does not place real orders. Product detail panels link to the source product page. These listings are separate from the assessment's unverified sample recommendation catalogue.

## Product assistant

The homepage chat button opens the Be Bodywise Product Assistant. It uses `worker/data/chatProducts.json` as a product index and `worker/data/preparedAnswers.json` for prepared overviews, usage, ingredient and timeline answers, plus product-pair comparisons. Common questions use these records without a Gemini request; more specific questions can use Gemini. `worker/productChat.ts` handles matching, clarification, follow-up context, source links and `POST /api/chat` / `GET /api/products/search`. The existing Cloudflare Worker uses the official `@google/genai` SDK server-side. The chat uses in-memory current-page context and can be reset. Closing or refreshing the page clears it.

Run `npm install` and `npm run dev`; open the local URL and use the chat button. To configure Gemini, put `GEMINI_API_KEY` and `GEMINI_MODEL` in the ignored `.dev.vars` file (copy `.dev.vars.example` as a starting point). `gemini-3.8-flash` is an available model identifier in Google's documentation, but availability and pricing depend on the project. This workspace currently uses the already-configured model; do not change account billing without authorization. Missing credentials or provider errors return clearly labelled verified-data fallback. Never put secrets in frontend code. Questions can be sent to Google when a product fact is available, so do not enter personal or health information, especially with an unpaid service. See Google's current data terms. The assistant is included in the Worker deployment.

Add product records to `worker/data/chatProducts.json` only after checking the exact variant and source. Leave unknown fields null and update `last_verified_at`; do not copy assumed uses or timelines. See `docs/product-assistant-coverage.md` for the coverage report. Run `npx vitest run tests/productChat.test.ts` and `npm run test:e2e -- --grep "homepage assistant"` for focused checks. The model can still produce errors, and synonym matching is limited; public use requires a data/privacy review, stronger abuse controls, factual evaluation, and product-content review.
