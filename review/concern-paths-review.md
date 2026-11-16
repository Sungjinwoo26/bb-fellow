# Find a product for my concern — review draft

This document is for approval. It is not connected to the chatbot. Product links below point to the demo site; each uses `/?product=PRODUCT_ID` on the current site. Product-specific descriptions are based on the local catalogue and should be reviewed before use.

## Shared opening and rules

**Assistant:** What would you like help with?  
**Choices:** Face care · Hair care · Body care · Sun protection · Something else

- Ask only questions needed to distinguish products, with at most three follow-up questions for a concern. If a customer already provided an answer, skip that question.
- “Not sure” presents the stated shortlist without guessing. “Something else” asks the customer to describe their concern, then uses the custom-question path.
- Concerns can be combined: offer the applicable recommendations for each area, remove duplicates and keep their individual links; if the customer asks to focus on one, focus on that one. Do not treat a face-and-body kit as body-only.
- Do not assume pregnancy, allergies, broken skin or a diagnosis. For concerning symptoms, product reactions or pregnancy-related safety, use the existing expert guidance rather than inventing product suitability.
- These are guided choices, not an exhaustive enumeration of every possible free-text question or multiple-concern combination.

## Face care

**Assistant:** What would you like help with?  
**Choices:** Individual surfaced pimples · Acne or bumps · Dryness · Oiliness · Marks or uneven tone · Sun protection · Something else

| Choice | Next question or final answer | Product link |
|---|---|---|
| Individual surfaced pimples | **Hydrocolloid Acne Pimple Patch:** Absorbs fluid from an individual surfaced pimple and helps protect it from picking. | [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=hydrocolloid-acne-pimple-patch) |
| Acne or bumps / Oiliness | Ask: **How would you describe your skin?** Oily · Dry or combination · Not sure. See outcomes below. | — |
| Dryness | **1% Peptide & Ceramide Moisturizer:** Peptides and ceramides help support the skin barrier and keep skin moisturised. | [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=1-peptide-ceramide-moisturizer) |
| Marks or uneven tone | **Ultra Light Sunscreen SPF50+:** Helps protect facial skin from UV exposure as part of an everyday routine. For a product aimed at marks, ask what kind of marks and check the catalogue; do not claim sunscreen removes them. | [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=ultra-light-sunscreen-spf50) |
| Sun protection | Go to **Sun protection → Face** below. | — |
| Something else | Ask the customer to describe the concern; use the custom-question path. | — |

**Acne or oiliness outcomes:**

- **Oily:** **2% Salicylic Acid Face Wash:** Salicylic acid clears excess oil and helps unclog pores, making it an option for oily skin and mild, occasional acne. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=2-salicylic-acid-face-wash)
- **Dry or combination:** **1% Salicylic Acid Face Wash (Foam-Based):** Salicylic acid exfoliates and helps clear pores in a foaming wash listed for mild, occasional acne and dry or combination skin. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=acne-control-wash)
- **Not sure:** Show both options above, each with its own link, without assigning a skin type.

## Hair care

**Assistant:** What would you like help with?  
**Choices:** Hair fall or thinning · Dandruff or flakes · Hair fall and dandruff · Dry or frizzy lengths · Everyday hair care · Something else

| Choice | Final answer | Product link |
|---|---|---|
| Hair fall or thinning | **Advanced Hair Growth Serum Roll-On:** Applied directly to areas of thinning on the scalp, it is designed for hair thinning and new hair growth. | [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=hair-growth-serum-roll-on) |
| Dandruff or flakes | **1% ZPTO Anti-Dandruff Shampoo:** Cleanses the scalp and is designed to control moderate dandruff without as much dryness. | [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=1-zpto-anti-dandruff-shampoo) |
| Hair fall and dandruff | **Dandruff & Hairfall Kit:** Combines care for dandruff with hair-fall support in one routine. | [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=dandruff-and-hairfall-kit) |
| Dry or frizzy lengths | **Frizz Control and Damage Repair Hair Serum:** Smooths the lengths of the hair and is designed for frizzy, damaged-looking hair. | [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=anti-frizz-serum) |
| Everyday hair care | Ask what the customer wants help with before choosing a product; use the custom-question path if needed. | — |
| Something else | Ask the customer to describe the concern; use the custom-question path. | — |

For hair fall where dandruff is not already known, optionally ask **Do you also notice dandruff or flakes?** Yes → hair-fall-and-dandruff kit; No → hair growth roll-on; Not sure → show the roll-on and dandruff shampoo as separate options. Do not suggest a post-pregnancy product unless that context is explicitly raised; safety questions use expert guidance.

## Body care

**Assistant:** What would you like help with?  
**Choices:** Body acne or marks · Strawberry skin or bumps · Body pigmentation · Underarm pigmentation · Body odour · Dry skin or heels · Everyday cleansing · Ingrown hairs · Something else

### Body acne or marks

**Assistant:** What would you like to focus on?  
**Choices:** Active body acne · Marks · Both · Not sure

- **Active body acne:** Ask **Does the skin on your body often feel dry?** Yes → **1% Salicylic Ceramide Body Wash:** Salicylic acid exfoliates while ceramides support the skin barrier, making it an option for body acne with dry skin. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=salicylic-ceramide-bodywash) No → **1% Salicylic Acid Body Wash:** Salicylic acid exfoliates and helps clear pores, making it an option for body acne and bumps. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=1-salicylic-acid-body-wash-350ml) Not sure → show both with separate links.
- **Marks:** **10% Niacinamide Body Lotion:** Niacinamide supports skin care for marks left by mild body acne. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=niacinamide-body-lotion)
- **Both:** Show the salicylic body wash and niacinamide body lotion above with separate links; if dryness is already known, use the ceramide body wash instead.
- **Not sure:** Show the salicylic body wash and niacinamide body lotion as options for bumps and marks respectively, without deciding which concern the customer has.

### Strawberry skin or body bumps

**Assistant:** Which format would you prefer?  
**Choices:** Body wash · Body lotion · Body scrub · Not sure

- **Body wash:** **1% Salicylic Acid Body Wash:** Salicylic acid helps clear pores as you cleanse, making it an option for body acne and strawberry skin. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=1-salicylic-acid-body-wash-350ml)
- **Body lotion:** **5% Lactic Acid Body Lotion:** Lactic acid exfoliates while the lotion moisturises, making it an option for strawberry skin. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=5-lactic-acid-body-lotion)
- **Body scrub:** **10% AHA Body Scrub:** Lactic acid removes dead skin in a rinse-off scrub made for rough-looking strawberry legs. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=10-aha-body-scrub-300)
- **Not sure:** Show all three descriptions and links.

### Body pigmentation

**Assistant:** Which format would you prefer?  
**Choices:** Cream · Exfoliating stick · Kit · Not sure

- **Cream:** **Pigmentation Repair Cream:** Applied to areas of uneven tone, it is designed to reduce the appearance of body pigmentation. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=pigmentation-repair-cream)
- **Exfoliating stick:** **7% Glycolic Acid Exfoliating Body Stick:** Glycolic and salicylic acids exfoliate skin, targeting uneven-looking pigmentation and ingrown hairs. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=glycolic-acid-stick)
- **Kit:** **Body Exfoliation & Pigmentation Kit:** Combines an exfoliating stick and cream for rough skin and body pigmentation. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=body-exfoliation-pigmentation-kit)
- **Not sure:** Show the cream and stick with their individual links.

### Underarm pigmentation and odour

**Assistant:** What would you like help with?  
**Choices:** Odour · Pigmentation · Both · Not sure

- **Odour:** **4% AHA BHA Underarm Roll On — Fragrance Free:** Exfoliating acids support underarm odour control in a fragrance-free format. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=4-aha-bha-underarm-rollon-frag-free-75)
- **Pigmentation:** **6% AHA BHA Underarm Roll On — Flora:** Exfoliating acids remove dead skin and are intended for underarm pigmentation and odour. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=6-aha-bha-underarm-roll-on-flora-75ml)
- **Both:** **Advanced Underarm Pigmentation Kit:** Combines a roll-on and cream for underarm odour and pigmentation. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=advanced-underarm-pigmentation-kit)
- **Not sure:** Show the two roll-ons with individual links, identifying one as fragrance-free and the other as Flora; do not infer an undisclosed preference.

For general **body odour**, first ask **Where do you notice the odour?** Underarms → the choices above; Another area / Not sure → ask for the area or let the customer describe it, without assuming an underarm roll-on is appropriate.

### Dry body skin and heels

**Assistant:** What would you like help with?  
**Choices:** Mild or moderate dry body skin · Very dry or flaky body skin · Rough or cracked heels · Not sure

- **Mild or moderate:** **10% Urea Body Lotion — 300 ml:** Urea draws moisture into the skin to soften and hydrate mild to moderately dry body skin. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=10-urea-lotion-300ml)
- **Very dry or flaky:** **20% Urea Lotion — 300 ml:** Urea draws moisture into the skin and helps soften dry, flaky areas. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=20-urea-lotion-xp)
- **Rough or cracked heels:** **20% Urea Foot Roll On:** Urea helps soften rough, dry skin in a roll-on designed for cracked heels. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=20-urea-roll-on-75ml)
- **Not sure:** Show the 10% body lotion and the 20% body lotion with individual links; do not infer severity.

**Review decision:** Use the 300 ml 10% lotion for the mild-to-moderate path and do not show the 200 ml 10% lotion as an option for the very-dry path. The current source page nevertheless labels the 200 ml product for very dry and flaky skin; this is a requested demo recommendation choice, not a correction of the source label.

### Everyday body cleansing

**Triple Milk Deep Hydrating Body Wash:** Cleanses in a formula designed for dry, dehydrated skin. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=triple-milk-deep-hydrating-bodywash-xp)

### Ingrown hairs

**Assistant:** Where do you notice them?  
**Choices:** Legs · Arms · Underarms · Bikini area · Another area

- **Legs / Arms:** **7% Glycolic Acid Exfoliating Body Stick:** Exfoliates skin and is designed for ingrown hairs; use only once recently waxed skin has settled and follow the product label. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=glycolic-acid-stick)
- **Underarms / Bikini area:** Check that a product specifically says it is suitable for that area; avoid applying exfoliating products to freshly waxed, broken or irritated skin. Do not suggest a product without area-specific evidence.
- **Another area:** Ask which area before recommending; use the custom-question path.

## Sun protection

**Assistant:** Which area would you like to protect?  
**Choices:** Face · Body · Both · Not sure

- **Face:** **Ultra Light Sunscreen SPF50+:** Provides broad-spectrum sun protection for an everyday facial routine. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=ultra-light-sunscreen-spf50)
- **Body:** **De-Tan SPF 50+ Body Sunscreen Lotion:** Offers body sun protection in a lotion designed for sun exposure and tan correction. [Explore more](https://find-my-routine.wellness-prototype-7d3.workers.dev/?product=body-sunscreen-lotion-with-spf-50)
- **Both:** Show the face and body options above, each with its own link.
- **Not sure:** Ask whether the customer wants face or body protection; do not pick an area for them.

## What remains for review

- Verify the product-specific descriptions and any claims against the current product labels before connecting this draft.
- Other and free-text answers need the custom-question path. If no supported product matches, provide a useful explanation without inventing a match.
- Product selection should reflect allergy, irritation and other safety information when the customer raises it; the three-question limit does not override safety.
