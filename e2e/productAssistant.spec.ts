import { test, expect } from '@playwright/test';
test('homepage assistant opens, clarifies, follows selected product and resets',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByText('Ask me about')).toBeVisible();await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await expect(panel).toBeVisible();await panel.getByRole('textbox',{name:'Your product question'}).fill('How often should I use the body wash?');await panel.getByRole('button',{name:'Send message'}).click();await expect(panel.getByText('Which product do you mean?')).toBeVisible();await panel.getByRole('button',{name:/1% Salicylic Acid Body Wash/}).first().click();await expect(panel.getByText(/product information I found/i)).toBeVisible();await expect(panel.getByRole('link',{name:/1% Salicylic Acid Body Wash/})).toHaveAttribute('href',/bebodywise\.com\/product\//);await panel.getByRole('button',{name:'Start new chat'}).click();await expect(panel.getByText('Which product do you mean?')).toHaveCount(0);await panel.getByRole('button',{name:'Close product assistant'}).click();await expect(panel).toHaveCount(0);
});

test('the chat displays the answer without a Gemini label',async({page})=>{
 await page.route('**/api/chat',route=>route.fulfill({json:{message:'You can use it daily, and feel free to ask me more.',status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai'}}));await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();await page.getByRole('textbox',{name:'Your product question'}).fill('How often can I use it?');await page.getByRole('button',{name:'Send message'}).click();await expect(page.getByText('You can use it daily, and feel free to ask me more.')).toBeVisible();await expect(page.getByText('Explained with Gemini')).toHaveCount(0);
});

test('formats assistant comparisons as readable bold and list content on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.route('**/api/chat',route=>route.fulfill({json:{message:'Here is how they compare:\n\n* **First product:** For mild dryness.\n* **Second product:** For very dry skin.\n\n**Which one to choose:** Pick based on your goal.',status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai'}}));
 await page.goto('/');await page.getByRole('button',{name:'Ask the product assistant'}).click();
 const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});
 await panel.getByRole('textbox',{name:'Your product question'}).fill('Compare them');await panel.getByRole('button',{name:'Send message'}).click();
 await expect(panel.locator('.assistant-rich-text strong').filter({hasText:'First product:'})).toBeVisible();
 await expect(panel.locator('.assistant-rich-text li')).toHaveCount(2);
 await expect(panel.locator('.assistant-rich-text').last()).not.toContainText('**');
});
