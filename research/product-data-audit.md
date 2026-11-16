# Product data audit

Audited 117 chatbot catalogue records from src/data/productCatalogue.json and the prepared-answer library.

## How to read this audit

- “Not recorded” means the structured field is empty; information may exist in unstructured product text or on the official page. It does not mean the product has no such property.
- A “full ingredient list: possible non-ingredient text” flag is a heuristic for suspected extraction errors. It requires manual review; it is not a definitive classification.
- Prepared answers are separate from the underlying product information. Their status can be draft or needs review.
- Frequency, application area, amount and time of day are listed when not separately captured; some may be in the general usage text or may not apply.
- Source, names, prices, links, usage and other present fields are not automatically verified. Prices and availability are snapshots.
- For kits, request the ingredient and safety information for every component, including pack variants.

## Product-by-product audit

### 1. 1% Salicylic Acid Body Wash - 375 mL

- **Product ID:** `1-salicylic-acid-body-wash-350ml`
- **Official page:** https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml
- **Missing or not separately recorded:** time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** warnings.skin_type_suitability.
- **Catalogue status:** partially_verified.

### 2. 4% AHA BHA Underarm Roll On - Fragrance Free - 75 ml

- **Product ID:** `4-aha-bha-underarm-rollon-frag-free-75`
- **Official page:** https://bebodywise.com/product/4-aha-bha-underarm-rollon-frag-free-75
- **Missing or not separately recorded:** time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** variant.fragrance; ingredient/fragrance scope.
- **Catalogue status:** partially_verified.

### 3. 6% AHA BHA Underarm Roll On - 75ml - Flora

- **Product ID:** `6-aha-bha-underarm-roll-on-flora-75ml`
- **Official page:** https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml
- **Missing or not separately recorded:** time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 4. 10% Urea Body Lotion - 300 ml

- **Product ID:** `10-urea-lotion-300ml`
- **Official page:** https://bebodywise.com/product/10-urea-lotion-300ml
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 5. 20% Urea Foot Roll On - 75 ml

- **Product ID:** `20-urea-roll-on-75ml`
- **Official page:** https://bebodywise.com/product/20-urea-roll-on-75ml
- **Missing or not separately recorded:** time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 6. 2% Salicylic Acid Face Wash

- **Product ID:** `2-salicylic-acid-face-wash`
- **Official page:** https://bebodywise.com/product/2-salicylic-acid-face-wash
- **Missing or not separately recorded:** results timeline.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 7. 1% Peptide & Ceramide Moisturizer

- **Product ID:** `1-peptide-ceramide-moisturizer`
- **Official page:** https://bebodywise.com/product/1-peptide-ceramide-moisturizer
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.highlighted.Copper Tripeptide-1.percentage.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 8. Ultra Light Sunscreen SPF50+

- **Product ID:** `ultra-light-sunscreen-spf50`
- **Official page:** https://bebodywise.com/product/ultra-light-sunscreen-spf50
- **Missing or not separately recorded:** usage frequency (not separately recorded); time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 9. Advanced Hair Growth Serum — 50 mL

- **Product ID:** `advanced-hair-growth-serum`
- **Official page:** https://bebodywise.com/product/advanced-hair-growth-serum
- **Missing or not separately recorded:** application steps (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** usage.steps; variant.format; ingredients.highlighted.Rosemary.percentage.
- **Catalogue status:** partially_verified.

### 10. Anti-Dandruff Serum

- **Product ID:** `anti-dandruff-serum`
- **Official page:** https://bebodywise.com/product/anti-dandruff-serum
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 11. 1% Ketoconazole Anti-Dandruff Shampoo (250ml)

- **Product ID:** `1-ketoconazole-dandruff-shampoo-250ml`
- **Official page:** https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-250ml
- **Missing or not separately recorded:** full ingredient list; usage frequency (not separately recorded); time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 12. Biotin Hair Gummies (30)

- **Product ID:** `hair-health-gummies`
- **Official page:** https://bebodywise.com/product/hair-health-gummies
- **Missing or not separately recorded:** application area (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 13. Advanced Hair Growth Serum Roll-On — 25 mL

- **Product ID:** `hair-growth-serum-roll-on`
- **Official page:** https://bebodywise.com/product/hair-growth-serum-roll-on
- **Missing or not separately recorded:** full ingredient list.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; timeline.expected_results_timeframe.
- **Catalogue status:** partially_verified.

### 14. Advanced Hair Growth Pack with Roll On 25ml

- **Product ID:** `hair-growth-pack-rosemary-roll-on-xp-2`
- **Official page:** https://bebodywise.com/product/hair-growth-pack-rosemary-roll-on-xp-2
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 15. Frizz Control and Damage Repair Hair Serum

- **Product ID:** `anti-frizz-serum`
- **Official page:** https://bebodywise.com/product/anti-frizz-serum
- **Missing or not separately recorded:** full ingredient list; results timeline; warnings / precautions; application steps (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; usage.amount.
- **Catalogue status:** partially_verified.

### 16. Keratin Shampoo for Hair Fall

- **Product ID:** `hair-fall-control-shampoo`
- **Official page:** https://bebodywise.com/product/hair-fall-control-shampoo
- **Missing or not separately recorded:** warnings / precautions; time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 17. Hair Growth Serum Spray (30 ml)

- **Product ID:** `hair-growth-serum-spray`
- **Official page:** https://bebodywise.com/product/hair-growth-serum-spray
- **Missing or not separately recorded:** full ingredient list.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; timeline.expected_results_timeframe.
- **Catalogue status:** partially_verified.

### 18. Folli Advanced+ Hair Growth Serum Roll On - 3% Redensyl, 3% Rosemary (25 ml)

- **Product ID:** `folli-advanced-plus-hair-growth-serum`
- **Official page:** https://bebodywise.com/product/folli-advanced-plus-hair-growth-serum
- **Missing or not separately recorded:** full ingredient list; time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; ingredients.highlighted.Anagain.percentage.
- **Catalogue status:** partially_verified.

### 19. Keratin Conditioner

- **Product ID:** `deep-moisturizing-conditioner`
- **Official page:** https://bebodywise.com/product/deep-moisturizing-conditioner
- **Missing or not separately recorded:** time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 20. Hair Gummies for Post-Pregnancy Hair Fall (30N)

- **Product ID:** `biotin-hair-gummies-breastfeeding-moms-30n-xp`
- **Official page:** https://bebodywise.com/product/biotin-hair-gummies-breastfeeding-moms-30n-xp
- **Missing or not separately recorded:** application area (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 21. Scalp Massager

- **Product ID:** `scalp-massager`
- **Official page:** https://bebodywise.com/product/scalp-massager
- **Missing or not separately recorded:** key ingredients; full ingredient list; warnings / precautions; usage frequency (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 22. Hair Strengthening Serum (100mL)

- **Product ID:** `hair-strengthening-serum`
- **Official page:** https://bebodywise.com/product/hair-strengthening-serum
- **Missing or not separately recorded:** results timeline.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 23. 1% ZPTO Anti-Dandruff Shampoo (200ml)

- **Product ID:** `1-zpto-anti-dandruff-shampoo`
- **Official page:** https://bebodywise.com/product/1-zpto-anti-dandruff-shampoo
- **Missing or not separately recorded:** usage frequency (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 24. Advanced Hair Growth Serum (30ml)

- **Product ID:** `advanced-hair-growth-serum-30ml`
- **Official page:** https://bebodywise.com/product/advanced-hair-growth-serum-30ml
- **Missing or not separately recorded:** application steps (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** usage.steps; variant.format; variant.size; ingredients.highlighted.Rosemary.percentage.
- **Catalogue status:** partially_verified.

### 25. 1% Salicylic Ceramide Body Wash

- **Product ID:** `salicylic-ceramide-bodywash`
- **Official page:** https://bebodywise.com/product/salicylic-ceramide-bodywash
- **Missing or not separately recorded:** full ingredient list; results timeline; usage frequency (not separately recorded); time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 26. 5% AHA BHA Exfoliating Body Wash (700ml)

- **Product ID:** `5-aha-bha-bodywash-700ml`
- **Official page:** https://bebodywise.com/product/5-aha-bha-bodywash-700ml
- **Missing or not separately recorded:** time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 27. Advanced Underarm Pigmentation Kit

- **Product ID:** `advanced-underarm-pigmentation-kit`
- **Official page:** https://bebodywise.com/product/advanced-underarm-pigmentation-kit
- **Missing or not separately recorded:** full ingredient list.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.

### 28. Sun Care Duo for Face and Body

- **Product ID:** `sun-care-duo-head-to-toe`
- **Official page:** https://bebodywise.com/product/sun-care-duo-head-to-toe
- **Missing or not separately recorded:** full ingredient list; warnings / precautions.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; ingredient/fragrance scope.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 29. De-Tan SPF 50+ Body Sunscreen Lotion

- **Product ID:** `body-sunscreen-lotion-with-spf-50`
- **Official page:** https://bebodywise.com/product/body-sunscreen-lotion-with-spf-50
- **Missing or not separately recorded:** results timeline.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 30. De-Tan Kit

- **Product ID:** `body-de-tan-kit`
- **Official page:** https://bebodywise.com/product/body-de-tan-kit
- **Missing or not separately recorded:** full ingredient list; results timeline.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.

### 31. Triple Milk Deep Hydrating Body Wash — reference page A

- **Product ID:** `triple-milk-deep-hydrating-bodywash-xp`
- **Official page:** https://bebodywise.com/product/triple-milk-deep-hydrating-bodywash-xp
- **Missing or not separately recorded:** full ingredient list; time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; ingredients.highlighted.Glycerine - Hyaluronic Acid Complex.percentage.
- **Catalogue status:** partially_verified.

### 32. Anti-Stretch Mark Serum Roll On

- **Product ID:** `anti-stretch-mark-roll-on`
- **Official page:** https://bebodywise.com/product/anti-stretch-mark-roll-on
- **Missing or not separately recorded:** full ingredient list; time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.

### 33. Daily Hydration Kit

- **Product ID:** `daily-hydration-kit`
- **Official page:** https://bebodywise.com/product/daily-hydration-kit
- **Missing or not separately recorded:** full ingredient list; results timeline.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 34. Urea Heel & Skin Repair Kit - 50ml

- **Product ID:** `advanced-urea-skin-heel-repair-kit-50ml`
- **Official page:** https://bebodywise.com/product/advanced-urea-skin-heel-repair-kit-50ml
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 35. 30% Urea Foot Roll On - 50ml

- **Product ID:** `30-urea-foot-roll-on`
- **Official page:** https://bebodywise.com/product/30-urea-foot-roll-on
- **Missing or not separately recorded:** time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.excluded_ingredients.
- **Catalogue status:** partially_verified.

### 36. 10% Magnesium Body Lotion - 300 ml

- **Product ID:** `10-magnesium-lotion-300ml`
- **Official page:** https://bebodywise.com/product/10-magnesium-lotion-300ml
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 37. Deep Moisturization Kit

- **Product ID:** `deep-moisturization-kit`
- **Official page:** https://bebodywise.com/product/deep-moisturization-kit
- **Missing or not separately recorded:** full ingredient list; warnings / precautions.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.

### 38. Triple Milk Deep Hydrating Body Wash — reference page B

- **Product ID:** `triple-milk-deep-hydrating-bodywash`
- **Official page:** https://bebodywise.com/product/triple-milk-deep-hydrating-bodywash
- **Missing or not separately recorded:** full ingredient list; time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.

### 39. Urea Skin & Heel Repair Kit

- **Product ID:** `urea-skin-heel-repair-kit`
- **Official page:** https://bebodywise.com/product/urea-skin-heel-repair-kit
- **Missing or not separately recorded:** full ingredient list.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list.
- **Catalogue status:** partially_verified.

### 40. 20% Urea Lotion - 300ml

- **Product ID:** `20-urea-lotion-xp`
- **Official page:** https://bebodywise.com/product/20-urea-lotion-xp
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 41. 2.5% Benzoyl Peroxide Body wash

- **Product ID:** `2-5-benzoyl-peroxide-bodywash`
- **Official page:** https://bebodywise.com/product/2-5-benzoyl-peroxide-bodywash
- **Missing or not separately recorded:** results timeline; time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 42. Calcium Gummies

- **Product ID:** `calcium-gummies`
- **Official page:** https://bebodywise.com/product/calcium-gummies
- **Missing or not separately recorded:** application area (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.supplement_facts.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 43. 5-in-1 Magnesium Gummies with Glycinate & Vitamin D3 (60N)

- **Product ID:** `magnesium-glycinate-gummies-60n`
- **Official page:** https://bebodywise.com/product/magnesium-glycinate-gummies-60n
- **Missing or not separately recorded:** warnings / precautions; application steps (not separately recorded); application area (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** usage.amount (packaging mismatch); ingredients.supplement_facts.
- **Catalogue status:** partially_verified.

### 44. Multivitamin Gummies

- **Product ID:** `multivitamin-gummies`
- **Official page:** https://bebodywise.com/product/multivitamin-gummies
- **Missing or not separately recorded:** full ingredient list; results timeline; application steps (not separately recorded); application area (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; usage.amount.
- **Catalogue status:** partially_verified.

### 45. Glutathione Gummies (60N)

- **Product ID:** `glutathione-gummies-60`
- **Official page:** https://bebodywise.com/product/glutathione-gummies-60
- **Missing or not separately recorded:** application area (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.supplement_facts.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 46. Collagen Builder Gummies

- **Product ID:** `collagen-skin-gummies`
- **Official page:** https://bebodywise.com/product/collagen-skin-gummies
- **Missing or not separately recorded:** full ingredient list; application area (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; ingredients.supplement_facts.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 47. Body Sunscreen Spray with SPF 50

- **Product ID:** `body-sunscreen-spray-with-spf-50`
- **Official page:** https://bebodywise.com/product/body-sunscreen-spray-with-spf-50
- **Missing or not separately recorded:** results timeline; time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 48. Summer Essentials Trio

- **Product ID:** `summer-essentials-kit`
- **Official page:** https://bebodywise.com/product/summer-essentials-kit
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredient/fragrance scope.
- **Catalogue status:** partially_verified.

### 49. Daily Sun Shield Kit

- **Product ID:** `face-body-sunscreen-kit`
- **Official page:** https://bebodywise.com/product/face-body-sunscreen-kit
- **Missing or not separately recorded:** time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredient/fragrance scope.
- **Catalogue status:** partially_verified.

### 50. Lightest Mineral Sunscreen SPF 50+

- **Product ID:** `lightest-mineral-sunscreen-spf50`
- **Official page:** https://bebodywise.com/product/lightest-mineral-sunscreen-spf50
- **Missing or not separately recorded:** usage frequency (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** warnings.age_restrictions.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 51. Hydrocolloid Acne Pimple Patch

- **Product ID:** `hydrocolloid-acne-pimple-patch`
- **Official page:** https://bebodywise.com/product/hydrocolloid-acne-pimple-patch
- **Missing or not separately recorded:** full ingredient list; application steps (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.full_list; usage.rinse_or_leave_on.
- **Catalogue status:** partially_verified.

### 52. 1% Salicylic Acid Face Wash (Foam-Based)

- **Product ID:** `acne-control-wash`
- **Official page:** https://bebodywise.com/product/acne-control-wash
- **Missing or not separately recorded:** time of day (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.
- **Variant check:** this product page is associated with multiple storefront entries; verify the exact size, formula, price and availability for each.

### 53. Ice Roller (1 N)

- **Product ID:** `ice-roller`
- **Official page:** https://bebodywise.com/product/ice-roller
- **Missing or not separately recorded:** key ingredients; full ingredient list.
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 54. 2.5% Benzoyl Peroxide Facewash

- **Product ID:** `benzoyl-peroxide-facewash`
- **Official page:** https://bebodywise.com/product/benzoyl-peroxide-facewash
- **Missing or not separately recorded:** amount per use (not separately recorded).
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 55. Dandruff & Hairfall Kit

- **Product ID:** `dandruff-and-hairfall-kit`
- **Official page:** https://bebodywise.com/product/dandruff-and-hairfall-kit
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** ingredients.excluded_ingredients.
- **Catalogue status:** partially_verified.

### 56. Anti-Dandruff & Hair Fall Kit

- **Product ID:** `1-zpto-ads-hg30-kit`
- **Official page:** https://bebodywise.com/product/1-zpto-ads-hg30-kit
- **Missing or not separately recorded:** None of the audited fields are empty..
- **Prepared answer types missing:** None of the four audited types..
- **Review flags from catalogue:** None recorded.
- **Catalogue status:** partially_verified.

### 57. Hair Cleansing and Conditioning Kit

- **Product ID:** `hair-fall-control-mini`
- **Official page:** https://bebodywise.com/product/hair-fall-control-mini
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 58. 1% Salicylic Acid Face Wash (Foam-Based)

- **Product ID:** `salicylic-acid-face-wash`
- **Official page:** https://bebodywise.com/product/salicylic-acid-face-wash
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 59. Hair Growth Pack

- **Product ID:** `hair-pro-growth-pack`
- **Official page:** https://bebodywise.com/product/hair-pro-growth-pack
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 60. Biotin Hair Gummies (60)

- **Product ID:** `biotin-multivitamin-hair-gummies-2m`
- **Official page:** https://bebodywise.com/product/biotin-multivitamin-hair-gummies-2m
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 61. AHA-BHA Body Pack

- **Product ID:** `aha-bha-body-pack`
- **Official page:** https://bebodywise.com/product/aha-bha-body-pack
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 62. 1% Salicylic Acid Body Wash - 250 mL

- **Product ID:** `1-salicylic-acid-body-wash`
- **Official page:** https://bebodywise.com/product/1-salicylic-acid-body-wash
- **Missing or not separately recorded:** key ingredients; results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 63. 10% Niacinamide Body Lotion

- **Product ID:** `niacinamide-body-lotion`
- **Official page:** https://bebodywise.com/product/niacinamide-body-lotion
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 64. 5% Lactic Acid Body Lotion

- **Product ID:** `5-lactic-acid-body-lotion`
- **Official page:** https://bebodywise.com/product/5-lactic-acid-body-lotion
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 65. Biotin Hair Gummies (120)

- **Product ID:** `biotin-hair-gummies-120`
- **Official page:** https://bebodywise.com/product/biotin-hair-gummies-120
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 66. 5% Niacinamide Body Wash

- **Product ID:** `5-niacinamide-body-wash`
- **Official page:** https://bebodywise.com/product/5-niacinamide-body-wash
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 67. 2% AHA Body Wash

- **Product ID:** `2-aha-body-wash`
- **Official page:** https://bebodywise.com/product/2-aha-body-wash
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 68. 4% AHA BHA Underarm Roll On - 50 mL - Flora

- **Product ID:** `4-aha-bha-underarm-roll-on`
- **Official page:** https://bebodywise.com/product/4-aha-bha-underarm-roll-on
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 69. 10% AHA Body Scrub (200g)

- **Product ID:** `10-aha-body-scrub`
- **Official page:** https://bebodywise.com/product/10-aha-body-scrub
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 70. Pigmentation Repair Cream

- **Product ID:** `pigmentation-repair-cream`
- **Official page:** https://bebodywise.com/product/pigmentation-repair-cream
- **Missing or not separately recorded:** key ingredients; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 71. 4% AHA BHA Underarm Roll On - 50 mL - No Fragrance

- **Product ID:** `4-aha-bha-underarm-roll-on-no-fragrance`
- **Official page:** https://bebodywise.com/product/4-aha-bha-underarm-roll-on-no-fragrance
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 72. 4% AHA BHA Underarm Roll On - 50 mL - Watermelon

- **Product ID:** `4-aha-bha-underarm-roll-on-watermelon`
- **Official page:** https://bebodywise.com/product/4-aha-bha-underarm-roll-on-watermelon
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 73. Strawberry Skin Pack

- **Product ID:** `strawberry-skin-pack`
- **Official page:** https://bebodywise.com/product/strawberry-skin-pack
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 74. Underarm Pigmentation Kit - No Fragrance

- **Product ID:** `underarm-pigmentation-kit-no-fragrance`
- **Official page:** https://bebodywise.com/product/underarm-pigmentation-kit-no-fragrance
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 75. Advanced Hair Growth Pack

- **Product ID:** `advanced-hair-growth-pack`
- **Official page:** https://bebodywise.com/product/advanced-hair-growth-pack
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 76. Strawberry Skin Exfoliation kit

- **Product ID:** `sabodywash-scrub`
- **Official page:** https://bebodywise.com/product/sabodywash-scrub
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 77. Advanced Hair Growth Pack

- **Product ID:** `advanced-hair-growth-pack-xp`
- **Official page:** https://bebodywise.com/product/advanced-hair-growth-pack-xp
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 78. Advanced Hair Growth Serum Roll-On (Pack of 2)

- **Product ID:** `hair-growth-serum-roll-on-2-months-xp`
- **Official page:** https://bebodywise.com/product/hair-growth-serum-roll-on-2-months-xp
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 79. Advanced Hair Growth Serum Roll-On for Post-Pregnancy Hair Thinning

- **Product ID:** `hair-growth-serum-pp-roll-on`
- **Official page:** https://bebodywise.com/product/hair-growth-serum-pp-roll-on
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 80. 2% AHA Body Wash

- **Product ID:** `aha-body-wash-deal`
- **Official page:** https://bebodywise.com/product/aha-body-wash-deal
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 81. Brow & Lash Growth Serum

- **Product ID:** `brow-lash-serum`
- **Official page:** https://bebodywise.com/product/brow-lash-serum
- **Missing or not separately recorded:** warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 82. Advanced Hair Growth Pack with Dropper 30ml

- **Product ID:** `hair-growth-pack-30ml-xp`
- **Official page:** https://bebodywise.com/product/hair-growth-pack-30ml-xp
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 83. Advanced Hair Growth Serum (30ml)

- **Product ID:** `hair-growth-serum-30ml-xp-1`
- **Official page:** https://bebodywise.com/product/hair-growth-serum-30ml-xp-1
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 84. 20% Urea Foot Roll On - 50 ml

- **Product ID:** `20-urea-roll-on-50ml`
- **Official page:** https://bebodywise.com/product/20-urea-roll-on-50ml
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 85. 4% AHA BHA Underarm Roll On - 50 mL - Aqua

- **Product ID:** `4-aha-bha-underarm-roll-on-aqua`
- **Official page:** https://bebodywise.com/product/4-aha-bha-underarm-roll-on-aqua
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 86. 4% AHA BHA Underarm Roll On - 50 mL - Oudh

- **Product ID:** `4-aha-bha-underarm-roll-on-oudh`
- **Official page:** https://bebodywise.com/product/4-aha-bha-underarm-roll-on-oudh
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 87. 4% AHA BHA Underarm Roll On - 75 mL - Flora

- **Product ID:** `4-aha-bha-underarm-rollon-75`
- **Official page:** https://bebodywise.com/product/4-aha-bha-underarm-rollon-75
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 88. 1% Salicylic Acid Body Wash - 700 ml

- **Product ID:** `salicylic-acid-body-wash-700`
- **Official page:** https://bebodywise.com/product/salicylic-acid-body-wash-700
- **Missing or not separately recorded:** key ingredients; results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 89. 5% AHA BHA Exfoliating Body Wash - 250 mL

- **Product ID:** `5-aha-bha-bodywash`
- **Official page:** https://bebodywise.com/product/5-aha-bha-bodywash
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 90. 5-in-1 Magnesium Gummies with Glycinate & Vitamin D3 (60N)

- **Product ID:** `advanced-magnesium-gummies-60n`
- **Official page:** https://bebodywise.com/product/advanced-magnesium-gummies-60n
- **Missing or not separately recorded:** results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 91. Body Exfoliation & Pigmentation Kit

- **Product ID:** `body-exfoliation-pigmentation-kit`
- **Official page:** https://bebodywise.com/product/body-exfoliation-pigmentation-kit
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 92. Body Sunscreen Spray with SPF 50

- **Product ID:** `body-sunscreen-spray-with-spf-50-deal`
- **Official page:** https://bebodywise.com/product/body-sunscreen-spray-with-spf-50-deal
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 93. 6% AHA BHA Underarm Roll On - 50 ml - Aqua

- **Product ID:** `6-aha-bha-underarm-roll-on-aqua`
- **Official page:** https://bebodywise.com/product/6-aha-bha-underarm-roll-on-aqua
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 94. 30% Urea Foot Roll On 75 ml

- **Product ID:** `30-urea-foot-roll-on-75ml`
- **Official page:** https://bebodywise.com/product/30-urea-foot-roll-on-75ml
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 95. 6% AHA BHA Underarm Roll On - 75 ml - Aqua

- **Product ID:** `6-aha-bha-underarm-roll-on-aqua-75ml`
- **Official page:** https://bebodywise.com/product/6-aha-bha-underarm-roll-on-aqua-75ml
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 96. Advanced Hair Growth Pack with Roll On 25ml

- **Product ID:** `hair-growth-pack-rosemary-roll-on-90n`
- **Official page:** https://bebodywise.com/product/hair-growth-pack-rosemary-roll-on-90n
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 97. Strawberry Skin Kit

- **Product ID:** `strawberry-skin-kit`
- **Official page:** https://bebodywise.com/product/strawberry-skin-kit
- **Missing or not separately recorded:** full ingredient list; results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 98. Advanced Hair Growth Roll On 50mL

- **Product ID:** `hair-growth-serum-roll-on-50ml`
- **Official page:** https://bebodywise.com/product/hair-growth-serum-roll-on-50ml
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 99. Hair Strengthening Serum (50mL)

- **Product ID:** `hair-strengthening-serum-50-ml`
- **Official page:** https://bebodywise.com/product/hair-strengthening-serum-50-ml
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 100. 10% Urea Body Lotion - 200 ml

- **Product ID:** `10-urea-lotion`
- **Official page:** https://bebodywise.com/product/10-urea-lotion
- **Missing or not separately recorded:** results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 101. Complete Magnesium Care

- **Product ID:** `magnesium-gummies-and-lotion-kit`
- **Official page:** https://bebodywise.com/product/magnesium-gummies-and-lotion-kit
- **Missing or not separately recorded:** results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 102. 7% Glycolic Acid Exfoliating Body Stick - 30g

- **Product ID:** `glycolic-acid-stick`
- **Official page:** https://bebodywise.com/product/glycolic-acid-stick
- **Missing or not separately recorded:** full ingredient list; results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 103. 10% AHA Body Scrub (300g)

- **Product ID:** `10-aha-body-scrub-300`
- **Official page:** https://bebodywise.com/product/10-aha-body-scrub-300
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 104. 6% AHA BHA Underarm Roll On - 50mL - Flora

- **Product ID:** `6-aha-bha-underarm-roll-on`
- **Official page:** https://bebodywise.com/product/6-aha-bha-underarm-roll-on
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 105. Face & Body Acne Kit

- **Product ID:** `face-and-body-acne-kit`
- **Official page:** https://bebodywise.com/product/face-and-body-acne-kit
- **Missing or not separately recorded:** key ingredients; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 106. Underarm Twin Defence Pack

- **Product ID:** `6-aha-bha-underarm-roll-on-twin-pack-75ml`
- **Official page:** https://bebodywise.com/product/6-aha-bha-underarm-roll-on-twin-pack-75ml
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 107. Anti Hair Fall Kit

- **Product ID:** `keratin-shampoo-with-roll-on`
- **Official page:** https://bebodywise.com/product/keratin-shampoo-with-roll-on
- **Missing or not separately recorded:** full ingredient list; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 108. 5% AHA BHA Exfoliating Body Wash - Flora (700ml)

- **Product ID:** `5-aha-bha-bodywash-700ml-flora`
- **Official page:** https://bebodywise.com/product/5-aha-bha-bodywash-700ml-flora
- **Missing or not separately recorded:** key ingredients; results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 109. Face Razor

- **Product ID:** `face-razor-for-women`
- **Official page:** https://bebodywise.com/product/face-razor-for-women
- **Missing or not separately recorded:** results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 110. 1% Ketoconazole Dandruff Shampoo

- **Product ID:** `1-ketoconazole-dandruff-shampoo-150ml`
- **Official page:** https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-150ml
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 111. 5% Niacinamide Body Wash - 700 ml

- **Product ID:** `niacinamide-body-wash-700`
- **Official page:** https://bebodywise.com/product/niacinamide-body-wash-700
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
- **Possible extraction error:** the full-ingredient field begins with prose rather than an ingredient list; verify the full list from the label or official source.

### 112. 5-in-1 Magnesium Gummies with Beads 30N

- **Product ID:** `advanced-magnesium-gummies-30n`
- **Official page:** https://bebodywise.com/product/advanced-magnesium-gummies-30n
- **Missing or not separately recorded:** results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 113. 6% AHA BHA Underarm Roll On - 50 ml - Watermelon

- **Product ID:** `6-aha-bha-underarm-roll-on-watermelon`
- **Official page:** https://bebodywise.com/product/6-aha-bha-underarm-roll-on-watermelon
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 114. 6% AHA BHA Underarm Roll On - 50 ml - Fragrance free

- **Product ID:** `6-aha-bha-underarm-roll-on-frag-free`
- **Official page:** https://bebodywise.com/product/6-aha-bha-underarm-roll-on-frag-free
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 115. 12% AHA Scrub - 300gm

- **Product ID:** `12-aha-scrub`
- **Official page:** https://bebodywise.com/product/12-aha-scrub
- **Missing or not separately recorded:** usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 116. 10% Magnesium Body Lotion - 200 ml

- **Product ID:** `10-magnesium-lotion`
- **Official page:** https://bebodywise.com/product/10-magnesium-lotion
- **Missing or not separately recorded:** results timeline; warnings / precautions; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.

### 117. 5% AHA BHA Exfoliating Body Wash - Flora (250ml)

- **Product ID:** `5-aha-bha-bodywash-250ml-flora`
- **Official page:** https://bebodywise.com/product/5-aha-bha-bodywash-250ml-flora
- **Missing or not separately recorded:** results timeline; usage frequency (not separately recorded); application area (not separately recorded); time of day (not separately recorded); amount per use (not separately recorded).
- **Prepared answer types missing:** overview, usage, ingredients, timeline.
- **Review flags from catalogue:** source import: verify product data before use.
- **Catalogue status:** source_snapshot.
