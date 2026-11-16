import { test, expect } from '@playwright/test';
test('question choices are tappable and send their full text',async({page})=>{
 const sent:string[]=[];await page.route('**/api/chat',route=>{const body=route.request().postDataJSON();sent.push(body.message);return route.fulfill({json:{message:sent.length===1?'Which best describes your skin?\n\n- Oily\n- Dry':'Thanks, I can help with that.',status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai'}})});
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await panel.getByRole('textbox',{name:'Your product question'}).fill('I have pimples');await panel.getByRole('button',{name:'Send message'}).click();await panel.getByRole('button',{name:'Oily',exact:true}).click();await expect(panel.getByText('Thanks, I can help with that.')).toBeVisible();expect(sent).toEqual(['I have pimples','Oily']);
});
test('a recommended product link opens its on-site details',async({page})=>{
 await page.route('**/api/chat',route=>route.fulfill({json:{message:'The 2% Salicylic Acid Face Wash can help cleanse oily skin.',status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai',recommendations:[{id:'2-salicylic-acid-face-wash',name:'2% Salicylic Acid Face Wash',category:'Face Care',image_url:'/storefront/catalogue/2-salicylic-acid-face-wash.jpg'}]}}));
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await panel.getByRole('textbox',{name:'Your product question'}).fill('Oily');await panel.getByRole('button',{name:'Send message'}).click();await panel.getByRole('link',{name:/(?:View|Explore(?: more about)?) 2% Salicylic Acid Face Wash/}).click();await expect(page.getByRole('main',{name:/Salicylic Acid Face Wash.*details/})).toBeVisible();await expect(page.locator('.cart-overlay')).toHaveCount(0);await expect(page).toHaveURL(/product=2-salicylic-acid-face-wash/);await page.goBack();await expect(page.getByRole('dialog',{name:'Bodywise product assistant'})).toBeVisible();await page.getByRole('link',{name:/(?:View|Explore(?: more about)?) 2% Salicylic Acid Face Wash/}).click();await page.reload();await expect(page.getByRole('heading',{name:'2% Salicylic Acid Face Wash',exact:true})).toBeVisible();
});
test('medical questions offer a consultation card on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await panel.getByRole('textbox',{name:'Your product question'}).fill('Can I use this during pregnancy?');await panel.getByRole('button',{name:'Send message'}).click();const card=panel.getByRole('button',{name:/Consult an expert/});await expect(card).toBeVisible();await card.click();await expect(page.getByRole('dialog',{name:'Consult an expert'})).toBeVisible();
});
test('homepage assistant opens, clarifies, follows selected product and resets',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByText('Ask me about')).toBeVisible();await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await expect(panel).toBeVisible();await panel.getByRole('button',{name:'How do I use a product?'}).click();await expect(panel.getByText('Which product would you like to know about?')).toBeVisible();await panel.getByRole('button',{name:/1% Salicylic Acid Body Wash/}).first().click();await expect(panel.getByText(/Apply on wet skin/i)).toBeVisible();await expect(panel.getByRole('link',{name:/1% Salicylic Acid Body Wash/})).toBeVisible();await panel.getByRole('button',{name:'Start new chat'}).click();await expect(panel.getByText('Which product would you like to know about?')).toHaveCount(0);await panel.getByRole('button',{name:'Close product assistant'}).click();await expect(panel).toHaveCount(0);
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


test('opens long product lists at their beginning on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:700});
 const options=Array.from({length:8},(_,i)=>({id:`product-${i}`,name:`Product ${i+1}`,category:'Hair Care',image_url:'/missing.jpg'}));
 await page.route('**/api/chat',route=>route.fulfill({json:{message:'Which product would you like to explore?',status:'clarify',product_options:options,selected_product_ids:[],sources:[],answer_mode:'verified_data_fallback'}}));
 await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();
 const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await panel.getByRole('textbox',{name:'Your product question'}).fill('Show products');await panel.getByRole('button',{name:'Send message'}).click();
 await expect(panel.getByText('Which product would you like to explore?')).toBeInViewport();await expect(panel.getByRole('button',{name:/Product 1/})).toBeInViewport();
 const thread=panel.locator('.assistant-thread');const values=await thread.evaluate(el=>({top:el.scrollTop,max:el.scrollHeight-el.clientHeight}));expect(values.max-values.top).toBeGreaterThan(100);
});


test('sends button choices and typed questions using their correct routes',async({page})=>{
 const seen:string[]=[];await page.route('**/api/chat',async route=>{const body=route.request().postDataJSON();seen.push(body.input_source);if(body.input_source==='button')return route.continue();return route.fulfill({json:{message:'This ingredient helps exfoliate skin.',status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai'}});});
 await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});
 await panel.getByRole('button',{name:'Explore ingredients'}).click();await expect(panel.getByText(/Which ingredient or product/)).toBeVisible();
 await panel.getByRole('textbox',{name:'Your product question'}).fill('Tell me about salicylic acid');await panel.getByRole('button',{name:'Send message'}).click();await expect(panel.getByText('This ingredient helps exfoliate skin.')).toBeVisible();expect(seen).toEqual(['button','typed']);
});

test('structured follow-up choices are tappable',async({page})=>{
 const sent:string[]=[];await page.route('**/api/chat',route=>{sent.push(route.request().postDataJSON().message);return route.fulfill({json:{message:sent.length===1?'Is your skin easily irritated?':'Thanks for sharing.',choices:sent.length===1?['Yes','No']:[],status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai'}})});
 await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await panel.getByRole('textbox',{name:'Your product question'}).fill('I have whiteheads');await panel.getByRole('button',{name:'Send message'}).click();await panel.getByRole('button',{name:'No',exact:true}).click();await expect(panel.getByText('Thanks for sharing.')).toBeVisible();expect(sent).toEqual(['I have whiteheads','No']);
});

test('product page controls have their own space on mobile and desktop',async({page})=>{
 for(const viewport of [{width:390,height:844},{width:1280,height:800}]){
  await page.setViewportSize(viewport);await page.goto('/?product=20-urea-roll-on-75ml');
  const image=page.locator('.product-page-image');const header=page.locator('.store-header');
  const img=await image.boundingBox();const head=await header.boundingBox();expect(img!.y).toBeGreaterThanOrEqual(head!.y+head!.height);
  const cart=page.locator('.product-page .store-cart-action');const launcher=page.getByRole('button',{name:'Open product assistant'});await cart.scrollIntoViewIfNeeded();
  const a=await cart.boundingBox();const b=await launcher.boundingBox();expect(b!.y).toBeGreaterThanOrEqual(a!.y+a!.height);
  await launcher.click();await expect(page.getByRole('dialog',{name:'Bodywise product assistant'})).toBeVisible();
 }
});


test('chat survives navigation and reload until reset',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.route('**/api/chat',route=>route.fulfill({json:{message:'This face wash is for oily skin.',status:'answered',product_options:[],selected_product_ids:['2-salicylic-acid-face-wash'],sources:[],answer_mode:'ai',recommendations:[{id:'2-salicylic-acid-face-wash',name:'2% Salicylic Acid Face Wash',category:'Face Care',image_url:'/storefront/catalogue/2-salicylic-acid-face-wash.jpg'}]}}));
 await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();let panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await panel.getByRole('textbox',{name:'Your product question'}).fill('Tell me about oily skin');await panel.getByRole('button',{name:'Send message'}).click();await panel.getByRole('link',{name:/(?:View|Explore(?: more about)?) 2% Salicylic Acid Face Wash/}).click();await page.getByRole('button',{name:'Open product assistant'}).click();await expect(panel.getByText('Tell me about oily skin')).toBeVisible();await expect(panel.getByText('This face wash is for oily skin.')).toBeVisible();
 await panel.getByRole('button',{name:'Close product assistant'}).click();await page.getByRole('button',{name:'Get your personalized kit'}).last().click();await page.getByRole('button',{name:'Be Bodywise home'}).click();await page.getByRole('button',{name:'Open product assistant'}).click();panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await expect(panel.getByText('Tell me about oily skin')).toBeVisible();await panel.getByRole('button',{name:'Start new chat'}).click();await expect(panel.getByText('Tell me about oily skin')).toHaveCount(0);
 await panel.getByRole('textbox',{name:'Your product question'}).fill('Another question');await panel.getByRole('button',{name:'Send message'}).click();await expect(panel.getByText('Another question')).toBeVisible();await page.reload();await page.getByRole('button',{name:'Open product assistant'}).click();await expect(page.getByRole('dialog',{name:'Bodywise product assistant'}).getByText('Another question')).toBeVisible();
});

test('demo cart survives a reload and saved removals',async({page})=>{
 await page.goto('/?product=2-salicylic-acid-face-wash');await page.getByRole('button',{name:'ADD TO DEMO CART'}).click();await expect(page.getByRole('button',{name:'Open demo cart, 1 items'})).toBeAttached();await page.reload();await expect(page.getByRole('button',{name:'Open demo cart, 1 items'})).toBeVisible();await page.getByRole('button',{name:'Open demo cart, 1 items'}).click();await expect(page.getByRole('dialog',{name:'Demo cart'}).getByText('2% Salicylic Acid Face Wash')).toBeVisible();await page.getByRole('dialog',{name:'Demo cart'}).getByRole('button',{name:'Remove'}).click();await page.reload();await expect(page.getByRole('button',{name:'Open demo cart, 0 items'})).toBeVisible();
});

test('open-ended questions never show mismatched yes/no chips',async({page})=>{
 await page.route('**/api/chat',route=>route.fulfill({json:{message:'Which concern would you like to focus on?',choices:['Yes','No'],status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai'}}));await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});await panel.getByRole('textbox',{name:'Your product question'}).fill('Compare the products');await panel.getByRole('button',{name:'Send message'}).click();await expect(panel.getByText('Which concern would you like to focus on?')).toBeVisible();await expect(panel.getByRole('button',{name:'Yes',exact:true})).toHaveCount(0);await expect(panel.getByRole('button',{name:'No',exact:true})).toHaveCount(0);
});

test('voice recognition adds editable text without sending it',async({page})=>{
 await page.addInitScript(()=>{class FakeRecognition{lang='';continuous=false;interimResults=false;onresult:((event:unknown)=>void)|null=null;onend:(()=>void)|null=null;onerror:((event:unknown)=>void)|null=null;start(){setTimeout(()=>{this.onresult?.({resultIndex:0,results:Object.assign([{0:{transcript:'I need a face wash'},isFinal:true}],{length:1})});this.onend?.()},50)}stop(){this.onend?.()}abort(){this.onend?.()}};(window as unknown as {SpeechRecognition:typeof FakeRecognition}).SpeechRecognition=FakeRecognition});
 let requests=0;await page.route('**/api/chat',route=>{requests++;return route.fulfill({json:{message:'Okay',status:'answered',product_options:[],selected_product_ids:[],sources:[],answer_mode:'ai'}})});await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();const panel=page.getByRole('dialog',{name:'Bodywise product assistant'});const input=panel.getByRole('textbox',{name:'Your product question'});await input.fill('Hello');await panel.getByRole('button',{name:'Start voice input'}).click();await expect(input).toHaveValue('Hello I need a face wash');expect(requests).toBe(0);await input.fill('I need a gentle face wash');await panel.getByRole('button',{name:'Send message'}).click();await expect.poll(()=>requests).toBe(1);
});
test('voice input explains unsupported browsers and denied microphone access',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'SpeechRecognition',{value:undefined,configurable:true});Object.defineProperty(window,'webkitSpeechRecognition',{value:undefined,configurable:true})});await page.goto('/');await page.getByRole('button',{name:'Open product assistant'}).click();await page.getByRole('button',{name:'Start voice input'}).click();await expect(page.getByRole('status')).toContainText('not supported');
 await page.evaluate(()=>{class Denied{lang='';continuous=false;interimResults=false;onresult=null;onend:(()=>void)|null=null;onerror:((event:{error:string})=>void)|null=null;start(){setTimeout(()=>{this.onerror?.({error:'not-allowed'});this.onend?.()},10)}stop(){}abort(){}};(window as unknown as {SpeechRecognition:typeof Denied}).SpeechRecognition=Denied});await page.getByRole('button',{name:'Start voice input'}).click();await expect(page.getByRole('status')).toContainText('Microphone access was denied');
});
