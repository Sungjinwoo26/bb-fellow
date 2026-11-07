# Product research and coverage report

Checked: 7 November 2026. All 56 exact product URLs were retrieved. The supplied dataset is retained in `research/product-information-reviewed.json` with field-level status and source evidence; the chatbot index is `worker/data/chatProducts.json`. The second file contains only selected usable fields and does not contain all research evidence.

## Counting method

- Previous assistant: 11 products.
- Supplied dataset: 56 product records, including separate source URLs even when names repeat.
- Explicit missing-field entries in the supplied file: 589; each product/field pair counts once. This is not the number of missing ingredients or facts.
- Additional explicit fields located during this pass: 3 across two products; remaining supplied missing-field entries: 586.
- Review-field entries in the supplied file: 47; separate from missing fields. Conflicts are not counted as resolved simply because a demo preference is recorded.
- Across the supplied five field groups, the file marked 752 field entries as verified and 531 as not found; after this pass those counts are 755 and 528 respectively. These are the supplied source-status labels plus three checked findings, not a fresh independent audit of every entry.

## Assistant coverage

The counts below mean at least one usable source-backed value is present in that broad group, not that every subfield is complete. Previously recorded warnings for 6% roll-on overlap one of the three newly filled slots in the supplied file.

| Information group | Previous 11 products | Current 56 products |
|---|---:|---:|
| Purpose | 11 | 56 |
| Ingredients | 3 | 54 |
| Usage | 3 | 56 |
| Timeline | 3 | 45 |
| Warnings | 1 | 50 |

## New findings in the supplied file

- 6% AHA BHA Underarm Roll On, Flora, 75 mL: the product page says not to apply to broken or irritated skin. This warning was already present in the previous chatbot seed; it filled a blank in the supplied file.
- 1% ZPTO Anti-Dandruff Shampoo, 200 mL: the product page says not to apply to injured areas.
- 1% ZPTO Anti-Dandruff Shampoo, 200 mL: the product page supplies other cautions including eye contact, external use and stopping if the condition worsens.

## Demo decisions and conflict policy

The preferences below are assumptions for this demo, not confirmed label facts. For medication, supplements, ingredient concentrations, allergy exclusions and conflicting instructions, the chatbot should not convert an assumption into an unqualified recommendation.

- **1% Salicylic Acid Body Wash - 375 mL** ([source](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml)): Use 375 mL as the demo variant because the current page heading and selector say 375 mL; do not use the 350 mL URL slug as a size claim. Do not state all-skin suitability because the page conflicts on very dry skin.
- **4% AHA BHA Underarm Roll On - Fragrance Free - 75 ml** ([source](https://bebodywise.com/product/4-aha-bha-underarm-rollon-frag-free-75)): Use the product heading as the variant name, but do not claim fragrance-free suitability: the ingredient block lists perfume. Treat that conflict as unresolved until the label or brand confirms it.
- **Advanced Hair Growth Serum** ([source](https://bebodywise.com/product/advanced-hair-growth-serum)): For demo navigation use the 50 mL dropper selected by the product page; do not assume the conflicting spray instruction or pick 1% versus 3% rosemary without the label.
- **Advanced Hair Growth Serum (30ml)** ([source](https://bebodywise.com/product/advanced-hair-growth-serum-30ml)): For demo navigation use the 30 mL dropper shown in the selector; do not infer the conflicting spray steps or rosemary percentage.
- **Frizz Control and Damage Repair Hair Serum** ([source](https://bebodywise.com/product/anti-frizz-serum)): Prefer the current text how-to of 2–3 pumps as a tentative demo reference; the gallery says 1–2, so do not serve an unqualified dosage and direct the user to the product label.
- **5-in-1 Magnesium Gummies with Glycinate & Vitamin D3 (60N)** ([source](https://bebodywise.com/product/magnesium-glycinate-gummies-60n)): The page says its updated recommendation is two gummies while existing packaging says one; prefer the updated page as a tentative demo reference, but disclose the mismatch and do not resolve dosage without the label or professional advice.
- **Multivitamin Gummies** ([source](https://bebodywise.com/product/multivitamin-gummies)): Prefer the how-to and nutrition label showing one gummy as a tentative reference; because an FAQ says two, do not give an unqualified dose or select one disputed ingredient list.
- **30% Urea Foot Roll On - 50ml** ([source](https://bebodywise.com/product/30-urea-foot-roll-on)): Treat the silicone-free exclusion as unconfirmed because the ingredient list names silicones; do not present the product as silicone-free.
- **1% Peptide & Ceramide Moisturizer** ([source](https://bebodywise.com/product/1-peptide-ceramide-moisturizer)): Do not select a copper tripeptide concentration: 1% and 2000 ppm are materially inconsistent and may describe different scopes.
- **Folli Advanced+ Hair Growth Serum Roll On - 3% Redensyl, 3% Rosemary (25 ml)** ([source](https://bebodywise.com/product/folli-advanced-plus-hair-growth-serum)): Do not select an AnaGain percentage: the text and image give different values, and the source does not establish their equivalence.
- **Daily Hydration Kit** ([source](https://bebodywise.com/product/daily-hydration-kit)): Keep the named 10% lotion and body wash as the kit identity and do not assign the mismatched 20% product ingredient block to either component.
- **Daily Sun Shield Kit** ([source](https://bebodywise.com/product/face-body-sunscreen-kit)): Keep the kit products separate; do not choose a disputed size or assert both are fragrance-free from the conflicting page blocks.
- **Hydrocolloid Acne Pimple Patch** ([source](https://bebodywise.com/product/hydrocolloid-acne-pimple-patch)): Prefer the detailed how-to as a tentative reference, but report that the FAQ gives a conflicting duration and do not recommend a single wear-time as confirmed.
- **Calcium Gummies** ([source](https://bebodywise.com/product/calcium-gummies)): Do not assume elemental calcium equals the mass of calcium salt or convert the ambiguous nutrition table into a dose.
- **Dandruff & Hairfall Kit** ([source](https://bebodywise.com/product/dandruff-and-hairfall-kit)): Do not claim sulfate-free because the kit shampoo ingredient list names a sulfate.
- **Sun Care Duo for Face and Body** ([source](https://bebodywise.com/product/sun-care-duo-head-to-toe)): Do not claim the whole kit is fragrance-free while the component information conflicts.
- **Summer Essentials Trio** ([source](https://bebodywise.com/product/summer-essentials-kit)): Do not apply an unscoped fragrance-free statement to all three components.

Other flagged review fields remain unresolved; consult the individual product record, page, and current packaging. No assumption that an unlisted contraindication, timeline, ingredient or use direction does not exist is made.

## Product-by-product gaps and review flags

### 1% Salicylic Acid Body Wash - 375 mL
Source: https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml
Missing fields (10): usage.time_of_day, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (1): warnings.skin_type_suitability
Notes: Suitability conflict within the official FAQ: it says all skin types can use the body wash, but also would not recommend it for very dry skin. Do not flatten this into an all-skin-types recommendation.; URL slug says 350ml, but current heading and Additional Information both say 375 ml. Recorded 375 ml, no inference from slug.

### 4% AHA BHA Underarm Roll On - Fragrance Free - 75 ml
Source: https://bebodywise.com/product/4-aha-bha-underarm-rollon-frag-free-75
Missing fields (8): usage.amount, usage.time_of_day, usage.wet_or_dry, usage.storage, timeline.package_duration, warnings.age_restrictions, warnings.prescription_status, warnings.broken_or_irritated_skin
Needs review (2): variant.fragrance, ingredient/fragrance scope
Notes: Page identity says Fragrance Free / No Fragrance while full ingredient list includes Perfume. FAQ also claims no fragrances. Do not answer fragrance suitability without review.; All benefit, safety and result statements are attributed brand claims, not independent medical validation.

### 6% AHA BHA Underarm Roll On - 75ml - Flora
Source: https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml
Missing fields (6): usage.amount, usage.time_of_day, usage.storage, timeline.package_duration, warnings.age_restrictions, warnings.prescription_status
Needs review (0): None listed.

### 10% Urea Body Lotion - 300 ml
Source: https://bebodywise.com/product/10-urea-lotion-300ml
Missing fields (10): usage.wet_or_dry, usage.storage, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### 20% Urea Foot Roll On - 75 ml
Source: https://bebodywise.com/product/20-urea-roll-on-75ml
Missing fields (11): usage.amount, usage.time_of_day, usage.storage, timeline.expected_results_timeframe, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### 2% Salicylic Acid Face Wash
Source: https://bebodywise.com/product/2-salicylic-acid-face-wash
Missing fields (11): usage.wet_or_dry, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (0): None listed.

### 1% Peptide & Ceramide Moisturizer
Source: https://bebodywise.com/product/1-peptide-ceramide-moisturizer
Missing fields (10): usage.wet_or_dry, usage.storage, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (1): ingredients.highlighted.Copper Tripeptide-1.percentage
Notes: Ingredient card labels Copper Tripeptide-1 as both 1% and 2000 ppm; concentration left null pending clarification. Do not convert or silently reconcile.; All benefit, safety and result statements are attributed brand claims, not independent medical validation.

### Ultra Light Sunscreen SPF50+
Source: https://bebodywise.com/product/ultra-light-sunscreen-spf50
Missing fields (11): usage.frequency, usage.time_of_day, usage.rinse_or_leave_on, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Advanced Hair Growth Serum
Source: https://bebodywise.com/product/advanced-hair-growth-serum
Missing fields (11): usage.amount, usage.time_of_day, usage.wet_or_dry, usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (3): usage.steps, variant.format, ingredients.highlighted.Rosemary.percentage
Notes: Dropper format in size selector but how-to says Spray.; Rosemary 1% in description versus 3% ingredient card.

### Anti-Dandruff Serum
Source: https://bebodywise.com/product/anti-dandruff-serum
Missing fields (9): usage.wet_or_dry, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (0): None listed.

### 1% Ketoconazole Anti-Dandruff Shampoo (250ml)
Source: https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-250ml
Missing fields (10): usage.frequency, usage.time_of_day, usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.pregnancy_breastfeeding, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (1): ingredients.full_list
Notes: Two materially different full ingredient lists on the same page.; Page body recommends at least 1 month, FAQ at least 12 weeks; do not collapse.

### Biotin Hair Gummies (30)
Source: https://bebodywise.com/product/hair-health-gummies
Missing fields (7): usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Advanced Hair Growth Serum
Source: https://bebodywise.com/product/hair-growth-serum-roll-on
Missing fields (9): ingredients.excluded_ingredients, usage.wet_or_dry, usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (2): ingredients.full_list, timeline.expected_results_timeframe
Notes: Gallery expected-results image says Month 3 reduction in hair fall/new growth, Month 4 new hair starts growing, Month 6+ volume; description instead says Month 2 baby hair, Month 3 less thinning, Month 4+ volume. Keep source-specific timelines.; No full ingredient list in accessible product-page sections; do not borrow dropper or kit formulation.

### Advanced Hair Growth Pack with Roll On 25ml
Source: https://bebodywise.com/product/hair-growth-pack-rosemary-roll-on-xp-2
Missing fields (10): usage.wet_or_dry, usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### Frizz Control and Damage Repair Hair Serum
Source: https://bebodywise.com/product/anti-frizz-serum
Missing fields (15): ingredients.excluded_ingredients, usage.rinse_or_leave_on, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (2): ingredients.full_list, usage.amount
Notes: How-to text says 2-3 pumps; gallery how-to says 1-2 pumps. Amount is null pending review. Ingredient gallery also highlights oils not named in the newer short description.; No full ingredient list in accessible product-page sections; ingredient visuals and description are not an INCI list.

### Keratin Shampoo for Hair Fall
Source: https://bebodywise.com/product/hair-fall-control-shampoo
Missing fields (10): usage.time_of_day, usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Hair Growth Serum Spray (30 ml)
Source: https://bebodywise.com/product/hair-growth-serum-spray
Missing fields (9): ingredients.excluded_ingredients, usage.wet_or_dry, usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (2): ingredients.full_list, timeline.expected_results_timeframe
Notes: Gallery expected-results image says Month 2 reduction in hair fall, Month 3 baby hair and Month 4 thinning/volume; description says baby hair at Month 2. Timelines are not reconciled.; Full ingredient list unavailable in accessible product-page sections; no borrowing from roll-on or dropper.

### Folli Advanced+ Hair Growth Serum Roll On - 3% Redensyl, 3% Rosemary (25 ml)
Source: https://bebodywise.com/product/folli-advanced-plus-hair-growth-serum
Missing fields (8): ingredients.excluded_ingredients, usage.time_of_day, usage.wet_or_dry, timeline.package_duration, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (2): ingredients.full_list, ingredients.highlighted.Anagain.percentage
Notes: Gallery shows 4% AnaGain, but textual highlighted ingredient metadata says 2% Anagain. Concentration is null with the conflict preserved; do not substitute an older roll-on formula.; Full ingredient list unavailable; Additional Information only lists four highlighted actives, not an INCI list.

### Keratin Conditioner
Source: https://bebodywise.com/product/deep-moisturizing-conditioner
Missing fields (10): usage.time_of_day, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Hair Gummies for Post-Pregnancy Hair Fall (30N)
Source: https://bebodywise.com/product/biotin-hair-gummies-breastfeeding-moms-30n-xp
Missing fields (7): usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Scalp Massager
Source: https://bebodywise.com/product/scalp-massager
Missing fields (14): purpose.concern_tags, usage.amount, usage.frequency, usage.wet_or_dry, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### Hair Strengthening Serum (100mL)
Source: https://bebodywise.com/product/hair-strengthening-serum
Missing fields (12): usage.rinse_or_leave_on, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### 1% ZPTO Anti-Dandruff Shampoo (200ml)
Source: https://bebodywise.com/product/1-zpto-anti-dandruff-shampoo
Missing fields (13): ingredients.excluded_ingredients, usage.amount, usage.frequency, usage.time_of_day, usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Advanced Hair Growth Serum (30ml)
Source: https://bebodywise.com/product/advanced-hair-growth-serum-30ml
Missing fields (11): usage.amount, usage.time_of_day, usage.wet_or_dry, usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (4): usage.steps, variant.format, variant.size, ingredients.highlighted.Rosemary.percentage
Notes: Dropper (30 ml) selector but how-to says Spray.; Description Rosemary 1% versus 3% ingredient card.

### 1% Salicylic Ceramide Body Wash
Source: https://bebodywise.com/product/salicylic-ceramide-bodywash
Missing fields (15): ingredients.excluded_ingredients, usage.frequency, usage.time_of_day, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (1): ingredients.full_list
Notes: Full ingredient list unavailable in accessible product-page sections; dual-pump product kept separate from ordinary 1% body wash.; All benefit, safety and result statements are attributed brand claims, not independent medical validation.

### 5% AHA BHA Exfoliating Body Wash (700ml)
Source: https://bebodywise.com/product/5-aha-bha-bodywash-700ml
Missing fields (11): ingredients.highlighted, usage.time_of_day, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (0): None listed.

### Advanced Underarm Pigmentation Kit
Source: https://bebodywise.com/product/advanced-underarm-pigmentation-kit
Missing fields (6): usage.storage, timeline.package_duration, warnings.age_restrictions, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (1): ingredients.full_list
Notes: Kit full ingredient block lists roll-on only; cream full list not supplied there.; Breast Feeding Safe icon is a kit-level brand claim; pregnancy guidance not supplied. Do not infer retinol/pregnancy safety.

### Sun Care Duo for Face and Body
Source: https://bebodywise.com/product/sun-care-duo-head-to-toe
Missing fields (11): ingredients.excluded_ingredients, usage.storage, timeline.recommended_usage_duration, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (2): ingredients.full_list, ingredient/fragrance scope
Notes: Comparison table says fragrance-free for the duo, but the included body lotion page lists Fragrance.; Kit page provides highlighted components/claims, not both complete INCI lists.

### De-Tan SPF 50+ Body Sunscreen Lotion
Source: https://bebodywise.com/product/body-sunscreen-lotion-with-spf-50
Missing fields (15): ingredients.excluded_ingredients, usage.rinse_or_leave_on, usage.wet_or_dry, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### De-Tan Kit
Source: https://bebodywise.com/product/body-de-tan-kit
Missing fields (15): ingredients.excluded_ingredients, usage.wet_or_dry, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (1): ingredients.full_list
Notes: No full ingredient list in kit page sections.; Kit ingredients/usage are only those stated on this exact kit page. Component formulations were not copied from similarly named individual products.

### Triple Milk Deep Hydrating Body wash
Source: https://bebodywise.com/product/triple-milk-deep-hydrating-bodywash-xp
Missing fields (11): ingredients.excluded_ingredients, usage.time_of_day, usage.storage, timeline.recommended_usage_duration, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (2): ingredients.full_list, ingredients.highlighted.Glycerine - Hyaluronic Acid Complex.percentage
Notes: Gallery deep-hydration panel says 1% moisture-infused beads, while text says 0.8% dual-action beads. Concentration is unresolved.; A complete full ingredient/materials list is not present in accessible page sections. Highlighted ingredients are not a substitute for INCI or full materials.

### Anti-Stretch Mark Serum Roll On
Source: https://bebodywise.com/product/anti-stretch-mark-roll-on
Missing fields (12): ingredients.excluded_ingredients, usage.amount, usage.time_of_day, usage.wet_or_dry, usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (1): ingredients.full_list
Notes: Bottle-side ingredient text is present in the official hero image, but not fully legible at the available resolution. Complete INCI remains needs_review.; A complete full ingredient/materials list is not present in accessible page sections. Highlighted ingredients are not a substitute for INCI or full materials.

### Daily Hydration Kit
Source: https://bebodywise.com/product/daily-hydration-kit
Missing fields (11): usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (1): ingredients.full_list
Notes: Kit components are 10% Urea Lotion plus Triple Milk Bodywash, but its full-ingredient block is labelled 20% Urea Lotion plus 20% Urea Roll On. That mismatched block is retained only as evidence, not assigned as this kit formulation.; Kit ingredients/usage are only those stated on this exact kit page. Component formulations were not copied from similarly named individual products.

### Urea Heel & Skin Repair Kit - 50ml
Source: https://bebodywise.com/product/advanced-urea-skin-heel-repair-kit-50ml
Missing fields (10): usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### 30% Urea Foot Roll On - 50ml
Source: https://bebodywise.com/product/30-urea-foot-roll-on
Missing fields (11): usage.amount, usage.time_of_day, usage.storage, timeline.expected_results_timeframe, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (1): ingredients.excluded_ingredients
Notes: The Formulated Without block says silicone, while full ingredients name Dimethicone and Cyclopentasiloxane. Reconcile before answering silicone-exclusion questions.; All benefit, safety and result statements are attributed brand claims, not independent medical validation.

### 10% Magnesium Body Lotion - 300 ml
Source: https://bebodywise.com/product/10-magnesium-lotion-300ml
Missing fields (11): usage.wet_or_dry, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### Deep Moisturization Kit
Source: https://bebodywise.com/product/deep-moisturization-kit
Missing fields (12): ingredients.excluded_ingredients, usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (1): ingredients.full_list
Notes: No full ingredient list in kit page sections.; Kit ingredients/usage are only those stated on this exact kit page. Component formulations were not copied from similarly named individual products.

### Triple Milk Deep Hydrating Body wash
Source: https://bebodywise.com/product/triple-milk-deep-hydrating-bodywash
Missing fields (11): ingredients.excluded_ingredients, usage.time_of_day, usage.storage, timeline.recommended_usage_duration, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (1): ingredients.full_list
Notes: A complete full ingredient/materials list is not present in accessible page sections. Highlighted ingredients are not a substitute for INCI or full materials.; Two requested Triple Milk URLs show same current name and 250 mL size; retained as distinct page records, not presumed different formulas.

### Urea Skin & Heel Repair Kit
Source: https://bebodywise.com/product/urea-skin-heel-repair-kit
Missing fields (10): usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (1): ingredients.full_list
Notes: The kit gives one full ingredient list without a component label; it does not provide separately labelled complete lists for both lotion and foot roll-on. Scope needs review.; Kit ingredients/usage are only those stated on this exact kit page. Component formulations were not copied from similarly named individual products.

### 20% Urea Lotion - 300ml
Source: https://bebodywise.com/product/20-urea-lotion-xp
Missing fields (11): usage.wet_or_dry, usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### 2.5% Benzoyl Peroxide Body wash
Source: https://bebodywise.com/product/2-5-benzoyl-peroxide-bodywash
Missing fields (13): usage.time_of_day, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### Calcium Gummies
Source: https://bebodywise.com/product/calcium-gummies
Missing fields (10): ingredients.excluded_ingredients, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance, variant.size
Needs review (1): ingredients.supplement_facts
Notes: Nutrition image lists quantities per serving without defining gummy count; hero says 1 gummy = 500 mg calcium as tricalcium phosphate, table distinguishes 500 mg tricalcium phosphate and 200 mg calcium. Do not convert to a daily dose.; Flavour Mixed berry in page ingredient list versus Strawberry on nutrition image.

### 5-in-1 Magnesium Gummies with Glycinate & Vitamin D3 (60N)
Source: https://bebodywise.com/product/magnesium-glycinate-gummies-60n
Missing fields (11): ingredients.excluded_ingredients, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance, variant.size
Needs review (2): usage.amount (packaging mismatch), ingredients.supplement_facts
Notes: Updated page recommends 2 gummies and explicitly says packaging still states 1. Do not hide packaging mismatch.; Nutrition image per-serve count is not explicitly defined; do not assume or scale nutrient amounts to two gummies.

### Multivitamin Gummies
Source: https://bebodywise.com/product/multivitamin-gummies
Missing fields (10): usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (2): ingredients.full_list, usage.amount
Notes: Two full ingredient blocks use different bases: Chicory Root Extract versus Fructooligosaccharides (FOS) Fibre. Alternatives retained; no single list selected.; How-to and nutrition label: 1 gummy; one FAQ: recommended 2 gummies/day. Amount is unresolved.

### Glutathione Gummies (60N)
Source: https://bebodywise.com/product/glutathione-gummies-60
Missing fields (10): ingredients.excluded_ingredients, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance, variant.size
Needs review (1): ingredients.supplement_facts
Notes: Nutrition table per-serving gummy count not printed; hero associates two gummies with 250 mg glutathione. No nutrient rescaling.; All benefit, safety and result statements are attributed brand claims, not independent medical validation.

### Collagen Builder Gummies
Source: https://bebodywise.com/product/collagen-skin-gummies
Missing fields (7): usage.storage, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (2): ingredients.full_list, ingredients.supplement_facts
Notes: Text highlights 115 mg collagen-boosting blend, gallery nutrition list differs from text full ingredient list (e.g. D2/K2/glutathione); formulation needs review.; Description says at least 4 months; gallery says visible results 3 months and study endpoints 4/8/12 weeks.

### Body Sunscreen Spray with SPF 50
Source: https://bebodywise.com/product/body-sunscreen-spray-with-spf-50
Missing fields (12): usage.time_of_day, usage.wet_or_dry, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Summer Essentials Trio
Source: https://bebodywise.com/product/summer-essentials-kit
Missing fields (13): usage.frequency, usage.time_of_day, usage.storage, timeline.recommended_usage_duration, timeline.expected_results_timeframe, timeline.what_it_relates_to, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (1): ingredient/fragrance scope
Notes: All three component INCI lists are present. The final Formulated Without Fragrance block is not explicitly scoped, while body wash and roll-on lists contain fragrance/Perfume. Do not apply the exclusion to the whole kit.; Kit ingredients/usage are only those stated on this exact kit page. Component formulations were not copied from similarly named individual products.

### Daily Sun Shield Kit
Source: https://bebodywise.com/product/face-body-sunscreen-kit
Missing fields (9): usage.time_of_day, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.prescription_status, variant.fragrance
Needs review (1): ingredient/fragrance scope
Notes: Description says each tube 50 ml, while Additional Information specifies face sunscreen 50 g and body spray 100 ml.; Kit FAQ says both fragrance free and its displayed spray list omits Perfume; the separate 100 ml spray page lists Perfume. Do not assume formulation equivalence across the kit and individual page.

### Lightest Mineral Sunscreen SPF 50+
Source: https://bebodywise.com/product/lightest-mineral-sunscreen-spf50
Missing fields (12): usage.amount, usage.frequency, usage.rinse_or_leave_on, usage.wet_or_dry, usage.storage, timeline.expected_results_timeframe, timeline.results_vary, timeline.package_duration, warnings.broken_or_irritated_skin, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (1): warnings.age_restrictions
Notes: FAQ 3 months versus Important Information 3-4 months, both recommendations.; Safe for kids claim has no numeric minimum age; do not infer infant/child suitability.

### Hydrocolloid Acne Pimple Patch
Source: https://bebodywise.com/product/hydrocolloid-acne-pimple-patch
Missing fields (9): ingredients.excluded_ingredients, timeline.results_vary, timeline.package_duration, warnings.patch_test, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (2): ingredients.full_list, usage.rinse_or_leave_on
Notes: Gallery specifies 8 patches each at 12 mm, 10 mm and 8 mm; recorded as package contents, not different products.; A complete full ingredient/materials list is not present in accessible page sections. Highlighted ingredients are not a substitute for INCI or full materials.

### 1% Salicylic Acid Face Wash (Foam-Based)
Source: https://bebodywise.com/product/acne-control-wash
Missing fields (10): usage.time_of_day, usage.wet_or_dry, usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance, warnings.broken_or_irritated_skin
Needs review (0): None listed.

### Ice Roller (1 N)
Source: https://bebodywise.com/product/ice-roller
Missing fields (9): usage.wet_or_dry, timeline.expected_results_timeframe, timeline.results_vary, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.

### 2.5% Benzoyl Peroxide Facewash
Source: https://bebodywise.com/product/benzoyl-peroxide-facewash
Missing fields (8): usage.amount, usage.storage, timeline.results_vary, timeline.package_duration, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, variant.fragrance
Needs review (0): None listed.

### Dandruff & Hairfall Kit
Source: https://bebodywise.com/product/dandruff-and-hairfall-kit
Missing fields (8): usage.storage, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (1): ingredients.excluded_ingredients
Notes: Kit Formulated Without block excludes Sulfates for Keto Shampoo, while the kit shampoo list names Sodium Lauryl Ether Sulphate. The exclusion is unresolved.; Kit ingredients/usage are only those stated on this exact kit page. Component formulations were not copied from similarly named individual products.

### Anti-Dandruff & Hair Fall Kit
Source: https://bebodywise.com/product/1-zpto-ads-hg30-kit
Missing fields (10): usage.storage, timeline.recommended_usage_duration, timeline.results_vary, timeline.package_duration, warnings.age_restrictions, warnings.broken_or_irritated_skin, warnings.pregnancy_breastfeeding, warnings.prescription_status, warnings.other, variant.fragrance
Needs review (0): None listed.
