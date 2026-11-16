# Chatbot route comparison

Generated: 2026-11-14T11:41:56.508Z

## Method

Synthetic questions; provider disabled; same catalogue and starting context. New route calls legacy internally.

These are synthetic conversations. Each route starts with the same selected products and receives its own prior conversation turns. Responses are recorded verbatim; product links are taken from the response source and card fields. No external model was called.

## 1. Body wash for dry body skin

### Legacy route

**Question:** I need a body wash for dry skin

**Status:** answered

**Response:**

**5% Niacinamide Body Wash:** Glow & Pollution Protection

**5% Niacinamide Body Wash - 700 ml:** Glow & Pollution Protection

**1% Salicylic Ceramide Body Wash:** For Body Acne and Dry Skin

**Selected product IDs:** `5-niacinamide-body-wash`, `niacinamide-body-wash-700`, `salicylic-ceramide-bodywash`

**Sources:** [5% Niacinamide Body Wash](https://bebodywise.com/product/5-niacinamide-body-wash); [5% Niacinamide Body Wash - 700 ml](https://bebodywise.com/product/niacinamide-body-wash-700); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

### New route

**Question:** I need a body wash for dry skin

**Status:** answered

**Response:**

**5% Niacinamide Body Wash:** Glow & Pollution Protection

**5% Niacinamide Body Wash - 700 ml:** Glow & Pollution Protection

**1% Salicylic Ceramide Body Wash:** For Body Acne and Dry Skin

**Selected product IDs:** `5-niacinamide-body-wash`, `niacinamide-body-wash-700`, `salicylic-ceramide-bodywash`

**Sources:** [5% Niacinamide Body Wash](https://bebodywise.com/product/5-niacinamide-body-wash); [5% Niacinamide Body Wash - 700 ml](https://bebodywise.com/product/niacinamide-body-wash-700); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

**Product cards:** [5% Niacinamide Body Wash](https://bebodywise.com/product/5-niacinamide-body-wash); [5% Niacinamide Body Wash - 700 ml](https://bebodywise.com/product/niacinamide-body-wash-700); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

## 2. Explicit product format and fragrance exclusion

### Legacy route

**Question:** I need a body wash for dry body skin without fragrance

**Status:** answered

**Response:**

**1% Salicylic Acid Body Wash - 375 mL:** FOR: Body Acne & Strawberry Skin

**2.5% Benzoyl Peroxide Body wash:** FOR: Reducing Severe Back, Butt & Body Acne

**1% Salicylic Acid Body Wash - 250 mL:** Controlling Body Acne & Bumps

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `2-5-benzoyl-peroxide-bodywash`, `1-salicylic-acid-body-wash`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [2.5% Benzoyl Peroxide Body wash](https://bebodywise.com/product/2-5-benzoyl-peroxide-bodywash); [1% Salicylic Acid Body Wash - 250 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash)

### New route

**Question:** I need a body wash for dry body skin without fragrance

**Status:** no_information

**Response:**

I couldn’t find an available product that meets those requirements.

**Selected product IDs:** None

## 3. Misspellings and merged words

### Legacy route

**Question:** Pls sugest a bodywash for body acne

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** None

**Product options:** 1% Salicylic Acid Body Wash - 375 mL (1-salicylic-acid-body-wash-350ml); 1% Salicylic Ceramide Body Wash (salicylic-ceramide-bodywash); 2.5% Benzoyl Peroxide Body wash (2-5-benzoyl-peroxide-bodywash); 1% Salicylic Acid Face Wash (Foam-Based) (salicylic-acid-face-wash); 1% Salicylic Acid Body Wash - 250 mL (1-salicylic-acid-body-wash); 10% Niacinamide Body Lotion (niacinamide-body-lotion); 1% Salicylic Acid Body Wash - 700 ml (salicylic-acid-body-wash-700); Face & Body Acne Kit (face-and-body-acne-kit)

### New route

**Question:** Pls sugest a bodywash for body acne

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** None

**Product options:** 1% Salicylic Acid Body Wash - 375 mL (1-salicylic-acid-body-wash-350ml); 1% Salicylic Ceramide Body Wash (salicylic-ceramide-bodywash); 2.5% Benzoyl Peroxide Body wash (2-5-benzoyl-peroxide-bodywash); 1% Salicylic Acid Face Wash (Foam-Based) (salicylic-acid-face-wash); 1% Salicylic Acid Body Wash - 250 mL (1-salicylic-acid-body-wash); 10% Niacinamide Body Lotion (niacinamide-body-lotion); 1% Salicylic Acid Body Wash - 700 ml (salicylic-acid-body-wash-700); Face & Body Acne Kit (face-and-body-acne-kit)

## 4. Misspelled hair loss

### Legacy route

**Question:** my hair is fallng a lot what shampoo should i use

**Status:** answered

**Response:**

**Keratin Shampoo for Hair Fall:** Sulphate Free Shampoo for Hair Fall Clinically Tested

**1% Ketoconazole Dandruff Shampoo:** Dandruff Control

**1% Ketoconazole Anti-Dandruff Shampoo (250ml):** For Reducing Dandruff & Flakiness

**Selected product IDs:** `hair-fall-control-shampoo`, `1-ketoconazole-dandruff-shampoo-150ml`, `1-ketoconazole-dandruff-shampoo-250ml`

**Sources:** [Keratin Shampoo for Hair Fall](https://bebodywise.com/product/hair-fall-control-shampoo); [1% Ketoconazole Dandruff Shampoo](https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-150ml); [1% Ketoconazole Anti-Dandruff Shampoo (250ml)](https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-250ml)

### New route

**Question:** my hair is fallng a lot what shampoo should i use

**Status:** answered

**Response:**

**Keratin Shampoo for Hair Fall:** Sulphate Free Shampoo for Hair Fall Clinically Tested

**1% Ketoconazole Dandruff Shampoo:** Dandruff Control

**1% Ketoconazole Anti-Dandruff Shampoo (250ml):** For Reducing Dandruff & Flakiness

**Selected product IDs:** `hair-fall-control-shampoo`, `1-ketoconazole-dandruff-shampoo-150ml`, `1-ketoconazole-dandruff-shampoo-250ml`

**Sources:** [Keratin Shampoo for Hair Fall](https://bebodywise.com/product/hair-fall-control-shampoo); [1% Ketoconazole Dandruff Shampoo](https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-150ml); [1% Ketoconazole Anti-Dandruff Shampoo (250ml)](https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-250ml)

**Product cards:** [Keratin Shampoo for Hair Fall](https://bebodywise.com/product/hair-fall-control-shampoo); [1% Ketoconazole Dandruff Shampoo](https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-150ml); [1% Ketoconazole Anti-Dandruff Shampoo (250ml)](https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-250ml)

## 5. Face and body area distinction

### Legacy route

**Question:** I have pimples on my back and chest, what should I use?

**Status:** answered

**Response:**

Here are a few options for body acne and marks:

1. **1% Salicylic Acid Body Wash**: Salicylic acid exfoliates and clears pores, making it useful for body acne and bumps.
2. **1% Salicylic Ceramide Body Wash**: Salicylic acid exfoliates while ceramides support the skin barrier, making it useful for body acne and dry skin.

Does your body skin often feel dry?

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

### New route

**Question:** I have pimples on my back and chest, what should I use?

**Status:** answered

**Response:**

Here are a few options for body acne and marks:

1. **1% Salicylic Acid Body Wash**: Salicylic acid exfoliates and clears pores, making it useful for body acne and bumps.
2. **1% Salicylic Ceramide Body Wash**: Salicylic acid exfoliates while ceramides support the skin barrier, making it useful for body acne and dry skin.

Does your body skin often feel dry?

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

**Product cards:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

## 6. Two product comparison and prices

### Legacy route

**Question:** Compare these products and tell me both prices

**Status:** answered

**Response:**

**1% Salicylic Acid Body Wash:** MRP ₹489; current price ₹399.

**1% Salicylic Ceramide Body Wash:** ₹549.

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

### New route

**Question:** Compare these products and tell me both prices

**Status:** answered

**Response:**

**1% Salicylic Acid Body Wash - 375 mL:** FOR: Body Acne & Strawberry Skin Catalogue price: ₹399.

**1% Salicylic Ceramide Body Wash:** For Body Acne and Dry Skin Catalogue price: ₹549.

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

**Product cards:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

## 7. Comparison, usage and ingredients

### Legacy route

**Question:** Compare both, what ingredients do they contain and how do I use them?

**Status:** answered

**Response:**

1% Salicylic Acid Body Wash - 375 mL: FOR: Body Acne & Strawberry Skin 1% Salicylic Ceramide Body Wash: For Body Acne and Dry Skin What would you most like help with?

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

### New route

**Question:** Compare both, what ingredients do they contain and how do I use them?

**Status:** answered

**Response:**

**1% Salicylic Acid Body Wash - 375 mL:** FOR: Body Acne & Strawberry Skin Ingredients: 1% Salicylic Acid, Chamomile Extract, Pentavitin. Use: Daily; Step 1 : Take adequate amount of bodywash in your palms/loofah. Step 2 : Apply on wet skin in a gentle circular motion. Step 3 : Rinse thoroughly once you are done.; Rinse thoroughly.

**1% Salicylic Ceramide Body Wash:** For Body Acne and Dry Skin Ingredients: not confirmed in the catalogue. Use: Step 1: Apply a generous amount of body wash to your palms or loofah. Massage onto wet skin in a circular motion. Step 2: Rinse thoroughly after cleansing. Remember to apply sun protection after exfoliating.; Rinse thoroughly.

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

**Product cards:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

## 8. Comparison and individual recommendation

### Legacy route

**Question:** Compare these shampoos and tell me which is better for an oily scalp and the prices

**Status:** answered

**Response:**

**1% ZPTO Anti-Dandruff Shampoo:** MRP ₹549; current price ₹499.

**Keratin Shampoo for Hair Fall:** MRP ₹499; current price ₹449.

**Selected product IDs:** `1-zpto-anti-dandruff-shampoo`, `hair-fall-control-shampoo`

**Sources:** [1% ZPTO Anti-Dandruff Shampoo (200ml)](https://bebodywise.com/product/1-zpto-anti-dandruff-shampoo); [Keratin Shampoo for Hair Fall](https://bebodywise.com/product/hair-fall-control-shampoo)

### New route

**Question:** Compare these shampoos and tell me which is better for an oily scalp and the prices

**Status:** answered

**Response:**

**1% ZPTO Anti-Dandruff Shampoo (200ml):** To control moderate dandruff without the dryness Catalogue price: ₹499.

**Keratin Shampoo for Hair Fall:** Sulphate Free Shampoo for Hair Fall Clinically Tested Catalogue price: ₹449.

The available product information does not establish which is better for your individual needs.

**Selected product IDs:** `1-zpto-anti-dandruff-shampoo`, `hair-fall-control-shampoo`

**Sources:** [1% ZPTO Anti-Dandruff Shampoo (200ml)](https://bebodywise.com/product/1-zpto-anti-dandruff-shampoo); [Keratin Shampoo for Hair Fall](https://bebodywise.com/product/hair-fall-control-shampoo)

**Product cards:** [1% ZPTO Anti-Dandruff Shampoo (200ml)](https://bebodywise.com/product/1-zpto-anti-dandruff-shampoo); [Keratin Shampoo for Hair Fall](https://bebodywise.com/product/hair-fall-control-shampoo)

## 9. Two exact named products in one question

### Legacy route

**Question:** Compare 2% Salicylic Acid Face Wash and 2.5% Benzoyl Peroxide Facewash, what do they cost?

**Status:** answered

**Response:**

**2% Salicylic Acid Face Wash:** MRP ₹299; current price ₹232.

**2.5% Benzoyl Peroxide Facewash:** MRP ₹399; current price ₹199.

**Selected product IDs:** `2-salicylic-acid-face-wash`, `benzoyl-peroxide-facewash`

**Sources:** [2% Salicylic Acid Face Wash](https://bebodywise.com/product/2-salicylic-acid-face-wash); [2.5% Benzoyl Peroxide Facewash](https://bebodywise.com/product/benzoyl-peroxide-facewash)

### New route

**Question:** Compare 2% Salicylic Acid Face Wash and 2.5% Benzoyl Peroxide Facewash, what do they cost?

**Status:** answered

**Response:**

**2% Salicylic Acid Face Wash:** For Mild Occasional Acne | Oily Skin Type | Suitable for 13+ yrs Catalogue price: ₹232.

**2.5% Benzoyl Peroxide Facewash:** For Persistent Severe Acne | All Skin Types | Suitable for 13+ yrs Catalogue price: ₹199.

**Selected product IDs:** `2-salicylic-acid-face-wash`, `benzoyl-peroxide-facewash`

**Sources:** [2% Salicylic Acid Face Wash](https://bebodywise.com/product/2-salicylic-acid-face-wash); [2.5% Benzoyl Peroxide Facewash](https://bebodywise.com/product/benzoyl-peroxide-facewash)

**Product cards:** [2% Salicylic Acid Face Wash](https://bebodywise.com/product/2-salicylic-acid-face-wash); [2.5% Benzoyl Peroxide Facewash](https://bebodywise.com/product/benzoyl-peroxide-facewash)

## 10. Single product multiple questions

### Legacy route

**Question:** What are its ingredients and price?

**Status:** answered

**Response:**

Price: ₹399 (catalogue price).

Ingredients: The product page highlights 1% Salicylic Acid, Chamomile Extract, Pentavitin.

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml)

### New route

**Question:** What are its ingredients and price?

**Status:** answered

**Response:**

Price: ₹399 (catalogue price).

Ingredients: The product page highlights 1% Salicylic Acid, Chamomile Extract, Pentavitin.

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml)

**Product cards:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml)

## 11. Ambiguous pronoun with two products

### Legacy route

**Question:** How often should I apply it?

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Product options:** 1% Salicylic Acid Body Wash - 375 mL (1-salicylic-acid-body-wash-350ml); 1% Salicylic Ceramide Body Wash (salicylic-ceramide-bodywash)

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

### New route

**Question:** How often should I apply it?

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`

**Product options:** 1% Salicylic Acid Body Wash - 375 mL (1-salicylic-acid-body-wash-350ml); 1% Salicylic Ceramide Body Wash (salicylic-ceramide-bodywash)

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash)

## 12. Pregnancy and ingredient constraint

### Legacy route

**Question:** I am pregnant; recommend a body wash without salicylic acid

**Status:** no_information

**Response:**

I can’t diagnose or offer personalised medical advice, but a qualified expert can guide you.

**Selected product IDs:** None

### New route

**Question:** I am pregnant; recommend a body wash without salicylic acid

**Status:** no_information

**Response:**

I can’t diagnose or offer personalised medical advice, but a qualified expert can guide you.

**Selected product IDs:** None

## 13. Unrelated question

### Legacy route

**Question:** Can you write a poem about the moon?

**Status:** answered

**Response:**

I can help with Bodywise products, ingredients, skincare and hair care.

**Selected product IDs:** None

### New route

**Question:** Can you write a poem about the moon?

**Status:** answered

**Response:**

I can help with Bodywise products, ingredients, skincare and hair care.

**Selected product IDs:** None

## 14. Noisy voice-like transcription

### Legacy route

**Question:** body smell armpit roll on no perfume please

**Status:** answered

**Response:**

Here are a few options for body odour:

1. **6% AHA BHA Underarm Roll On - 75ml - Flora**: Exfoliating acids remove dead skin, targeting underarm odour and pigmentation.
2. **Advanced Underarm Pigmentation Kit**: The roll-on and cream work together as a routine for underarm odour and pigmentation.

Which format would you prefer?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

### New route

**Question:** body smell armpit roll on no perfume please

**Status:** answered

**Response:**

Here are a few options for body odour:

1. **6% AHA BHA Underarm Roll On - 75ml - Flora**: Exfoliating acids remove dead skin, targeting underarm odour and pigmentation.
2. **Advanced Underarm Pigmentation Kit**: The roll-on and cream work together as a routine for underarm odour and pigmentation.

Which format would you prefer?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

**Product cards:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

## 15. Concern then area then product

### Legacy route

**Question:** I have body odour

**Status:** answered

**Response:**

Here are a few options for body odour:

1. **6% AHA BHA Underarm Roll On - 75ml - Flora**: Exfoliating acids remove dead skin, targeting underarm odour and pigmentation.
2. **Advanced Underarm Pigmentation Kit**: The roll-on and cream work together as a routine for underarm odour and pigmentation.

Which format would you prefer?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

**Question:** Underarms

**Status:** answered

**Response:**

Here are a few options for body odour:

1. **6% AHA BHA Underarm Roll On - 75ml - Flora**: Exfoliating acids remove dead skin, targeting underarm odour and pigmentation.
2. **Advanced Underarm Pigmentation Kit**: The roll-on and cream work together as a routine for underarm odour and pigmentation.

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

**Question:** How do I use it?

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Product options:** 6% AHA BHA Underarm Roll On - 75ml - Flora (6-aha-bha-underarm-roll-on-flora-75ml); Advanced Underarm Pigmentation Kit (advanced-underarm-pigmentation-kit)

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

### New route

**Question:** I have body odour

**Status:** answered

**Response:**

Here are a few options for body odour:

1. **6% AHA BHA Underarm Roll On - 75ml - Flora**: Exfoliating acids remove dead skin, targeting underarm odour and pigmentation.
2. **Advanced Underarm Pigmentation Kit**: The roll-on and cream work together as a routine for underarm odour and pigmentation.

Which format would you prefer?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

**Product cards:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

**Question:** Underarms

**Status:** answered

**Response:**

Here are a few options for body odour:

1. **6% AHA BHA Underarm Roll On - 75ml - Flora**: Exfoliating acids remove dead skin, targeting underarm odour and pigmentation.
2. **Advanced Underarm Pigmentation Kit**: The roll-on and cream work together as a routine for underarm odour and pigmentation.

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

**Product cards:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

**Question:** How do I use it?

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`, `advanced-underarm-pigmentation-kit`

**Product options:** 6% AHA BHA Underarm Roll On - 75ml - Flora (6-aha-bha-underarm-roll-on-flora-75ml); Advanced Underarm Pigmentation Kit (advanced-underarm-pigmentation-kit)

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml); [Advanced Underarm Pigmentation Kit](https://bebodywise.com/product/advanced-underarm-pigmentation-kit)

## 16. Product detail followed by yes

### Legacy route

**Question:** How do I use this product?

**Status:** answered

**Response:**

Apply directly on the underarm skin Roll evenly on and allow the product to dry completely. Would you like a few tips for using it comfortably?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml)

**Question:** Yes

**Status:** answered

**Response:**

Avoid applying it to irritated or freshly shaved skin. Follow the pack directions for how often to use it, and stop using it if it causes persistent irritation.

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml)

### New route

**Question:** How do I use this product?

**Status:** answered

**Response:**

Apply directly on the underarm skin Roll evenly on and allow the product to dry completely. Would you like a few tips for using it comfortably?

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml)

**Product cards:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml)

**Question:** Yes

**Status:** answered

**Response:**

Avoid applying it to irritated or freshly shaved skin. Follow the pack directions for how often to use it, and stop using it if it causes persistent irritation.

**Selected product IDs:** `6-aha-bha-underarm-roll-on-flora-75ml`

**Sources:** [6% AHA BHA Underarm Roll On - 75ml - Flora](https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml)

## 17. Switch from face to body

### Legacy route

**Question:** I have pimples on my face

**Status:** answered

**Response:**

Here are a few options for face acne:

1. **2% Salicylic Acid Face Wash**: Salicylic acid clears excess oil and unclogs pores, making it useful for oily skin and mild, occasional acne.
2. **1% Salicylic Acid Face Wash (Foam-Based)**: Salicylic acid exfoliates and clears pores, making it useful for mild, occasional acne and dry or combination skin.
3. **Hydrocolloid Acne Pimple Patch**: Hydrocolloid absorbs fluid from a surfaced spot, making it useful for individual pimples.

Which best describes your skin?

**Selected product IDs:** `2-salicylic-acid-face-wash`, `acne-control-wash`, `hydrocolloid-acne-pimple-patch`

**Sources:** [2% Salicylic Acid Face Wash](https://bebodywise.com/product/2-salicylic-acid-face-wash); [1% Salicylic Acid Face Wash (Foam-Based)](https://bebodywise.com/product/acne-control-wash); [Hydrocolloid Acne Pimple Patch](https://bebodywise.com/product/hydrocolloid-acne-pimple-patch)

**Question:** I also need something for pimples on my back

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** None

**Product options:** Scalp Massager (scalp-massager); 2.5% Benzoyl Peroxide Body wash (2-5-benzoyl-peroxide-bodywash)

**Question:** I need a body wash for that

**Status:** answered

**Response:**

**1% Salicylic Acid Body Wash - 375 mL:** FOR: Body Acne & Strawberry Skin

**1% Salicylic Ceramide Body Wash:** For Body Acne and Dry Skin

**5% AHA BHA Exfoliating Body Wash (700ml):** All in one body wash that exfoliates, detans and hydrates skin!

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`, `5-aha-bha-bodywash-700ml`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash); [5% AHA BHA Exfoliating Body Wash (700ml)](https://bebodywise.com/product/5-aha-bha-bodywash-700ml)

### New route

**Question:** I have pimples on my face

**Status:** answered

**Response:**

Here are a few options for face acne:

1. **2% Salicylic Acid Face Wash**: Salicylic acid clears excess oil and unclogs pores, making it useful for oily skin and mild, occasional acne.
2. **1% Salicylic Acid Face Wash (Foam-Based)**: Salicylic acid exfoliates and clears pores, making it useful for mild, occasional acne and dry or combination skin.
3. **Hydrocolloid Acne Pimple Patch**: Hydrocolloid absorbs fluid from a surfaced spot, making it useful for individual pimples.

Which best describes your skin?

**Selected product IDs:** `2-salicylic-acid-face-wash`, `acne-control-wash`, `hydrocolloid-acne-pimple-patch`

**Sources:** [2% Salicylic Acid Face Wash](https://bebodywise.com/product/2-salicylic-acid-face-wash); [1% Salicylic Acid Face Wash (Foam-Based)](https://bebodywise.com/product/acne-control-wash); [Hydrocolloid Acne Pimple Patch](https://bebodywise.com/product/hydrocolloid-acne-pimple-patch)

**Product cards:** [2% Salicylic Acid Face Wash](https://bebodywise.com/product/2-salicylic-acid-face-wash); [1% Salicylic Acid Face Wash (Foam-Based)](https://bebodywise.com/product/acne-control-wash); [Hydrocolloid Acne Pimple Patch](https://bebodywise.com/product/hydrocolloid-acne-pimple-patch)

**Question:** I also need something for pimples on my back

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** None

**Product options:** Scalp Massager (scalp-massager); 2.5% Benzoyl Peroxide Body wash (2-5-benzoyl-peroxide-bodywash)

**Question:** I need a body wash for that

**Status:** answered

**Response:**

**1% Salicylic Acid Body Wash - 375 mL:** FOR: Body Acne & Strawberry Skin

**1% Salicylic Ceramide Body Wash:** For Body Acne and Dry Skin

**5% AHA BHA Exfoliating Body Wash (700ml):** All in one body wash that exfoliates, detans and hydrates skin!

**Selected product IDs:** `1-salicylic-acid-body-wash-350ml`, `salicylic-ceramide-bodywash`, `5-aha-bha-bodywash-700ml`

**Sources:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash); [5% AHA BHA Exfoliating Body Wash (700ml)](https://bebodywise.com/product/5-aha-bha-bodywash-700ml)

**Product cards:** [1% Salicylic Acid Body Wash - 375 mL](https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml); [1% Salicylic Ceramide Body Wash](https://bebodywise.com/product/salicylic-ceramide-bodywash); [5% AHA BHA Exfoliating Body Wash (700ml)](https://bebodywise.com/product/5-aha-bha-bodywash-700ml)

## 18. Irritation and product caution

### Legacy route

**Question:** My underarms are bleeding after using an acid roll on, should I use more?

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** None

**Product options:** 1% Salicylic Acid Body Wash - 250 mL (1-salicylic-acid-body-wash); 1% Salicylic Acid Body Wash - 700 ml (salicylic-acid-body-wash-700); 1% Salicylic Acid Body Wash - 375 mL (1-salicylic-acid-body-wash-350ml); 4% AHA BHA Underarm Roll On - Fragrance Free - 75 ml (4-aha-bha-underarm-rollon-frag-free-75); 6% AHA BHA Underarm Roll On - 75ml - Flora (6-aha-bha-underarm-roll-on-flora-75ml); 20% Urea Foot Roll On - 75 ml (20-urea-roll-on-75ml); 2% Salicylic Acid Face Wash (2-salicylic-acid-face-wash); Advanced Hair Growth Serum Roll-On — 25 mL (hair-growth-serum-roll-on)

### New route

**Question:** My underarms are bleeding after using an acid roll on, should I use more?

**Status:** clarify

**Response:**

Which product do you mean?

**Selected product IDs:** None

**Product options:** 1% Salicylic Acid Body Wash - 250 mL (1-salicylic-acid-body-wash); 1% Salicylic Acid Body Wash - 700 ml (salicylic-acid-body-wash-700); 1% Salicylic Acid Body Wash - 375 mL (1-salicylic-acid-body-wash-350ml); 4% AHA BHA Underarm Roll On - Fragrance Free - 75 ml (4-aha-bha-underarm-rollon-frag-free-75); 6% AHA BHA Underarm Roll On - 75ml - Flora (6-aha-bha-underarm-roll-on-flora-75ml); 20% Urea Foot Roll On - 75 ml (20-urea-roll-on-75ml); 2% Salicylic Acid Face Wash (2-salicylic-acid-face-wash); Advanced Hair Growth Serum Roll-On — 25 mL (hair-growth-serum-roll-on)

