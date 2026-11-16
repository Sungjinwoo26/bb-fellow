import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

async function start(page:Page,labels:string[]) { await page.goto('/'); await page.getByRole('button',{name:'Get your personalized kit'}).first().click(); await page.getByRole('button',{name:'Find my kit',exact:true}).click(); for(const label of labels)await page.getByRole('checkbox',{name:label,exact:true}).check(); await page.getByRole('button',{name:'Continue',exact:true}).click(); }
async function noOverflow(page:Page){await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);}
async function skipQuestions(page:Page,count:number){for(let n=0;n<count;n++)await page.getByRole('button',{name:'Skip',exact:true}).click();}
async function prepareAndOpen(page:Page){await expect(page.getByRole('heading',{name:'Your routine focus'})).toBeVisible(); await expect(page.getByRole('button',{name:'See my personalised kit'})).toBeDisabled(); await page.clock.fastForward(30_000); await expect(page.getByRole('button',{name:'See my personalised kit'})).toBeEnabled(); await page.getByRole('button',{name:'See my personalised kit'}).click();}

test('body-odour no-photo journey: retry quote, discount, refresh and simulated checkout',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.clock.install({time:new Date('2026-11-04T00:00:00Z')});let quoteAttempts=0;
 await page.route('**/api/quote',async route=>{quoteAttempts++;if(quoteAttempts===1)await route.fulfill({status:503,json:{error:{code:'CATALOGUE_UNAVAILABLE'}}});else await route.continue();});
 await start(page,['Body Odour']);await expect(page.getByRole('heading',{name:'When do you tend to smell the most?'})).toBeVisible();
 await page.getByRole('button',{name:'Skip',exact:true}).click();await page.getByRole('radio',{name:'Underarms'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await prepareAndOpen(page);await noOverflow(page);
 await expect(page.getByText('We couldn’t update your summary.')).toBeVisible();await expect(page.getByRole('button',{name:'Proceed to checkout'})).toBeDisabled();
 await page.getByRole('button',{name:'Retry',exact:true}).click();await page.clock.runFor(300);await expect(page.getByRole('button',{name:'Proceed to checkout'})).toBeEnabled();
 const increase=page.getByRole('button',{name:'Increase quantity of 4% AHA BHA Underarm Roll-On'});await increase.click();await page.clock.runFor(300);await expect(page.getByText('10%',{exact:true})).toBeVisible();await increase.click();await page.clock.runFor(300);await expect(page.getByText('20%',{exact:true})).toBeVisible();await increase.click();await page.clock.runFor(300);await expect(page.getByText('30%',{exact:true})).toBeVisible();
 await page.reload();await expect(page.getByLabel('Quantity 4')).toBeVisible();await page.clock.runFor(300);await expect(page.getByRole('button',{name:'Proceed to checkout'})).toBeEnabled();await page.getByRole('button',{name:'Proceed to checkout'}).click();await expect(page.getByRole('heading',{name:'Demo checkout complete'})).toBeVisible();await expect(page.getByText('You’ve reached the end of the prototype. No order or payment was created.')).toBeVisible();await page.getByRole('button',{name:'Return to kit'}).click();await page.getByRole('button',{name:'Remove 4% AHA BHA Underarm Roll-On'}).click();await expect(page.getByRole('heading',{name:'Your kit is empty'})).toBeVisible();
});

test('multi-concern photo flow uses mocked analysis after proceeding',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.clock.install({time:new Date('2026-11-04T00:00:00Z')});let calls=0;
 await page.route('**/api/photo-analysis/config',route=>route.fulfill({json:{provider:'Google Gemini',dataMode:'paid',analysisAvailable:true}}));
 await page.route('**/api/photo-analysis',async route=>{calls++;await route.fulfill({json:{analysisId:'test',area:'affected_body',status:'complete',observations:[{optionId:'visible_bumps',status:'suggested'}]}});});
 await start(page,['Body Acne & Marks','Underarm Pigmentation','Hair']);await noOverflow(page);await noOverflow(page);await expect(page.getByText('Photo 1 of 3')).toBeVisible();await page.locator('input[type=file][accept="image/jpeg,image/png,image/webp"]').setInputFiles('public/brand/logo-reference.png');await expect(page.getByAltText('Preview of the selected photo for affected body area')).toBeVisible();expect(calls).toBe(0);const storage=await page.evaluate(()=>JSON.stringify({session:{...sessionStorage},local:{...localStorage}}));expect(storage).not.toContain('blob:');expect(storage).not.toContain('data:image');expect(storage).not.toContain('logo-reference.png');
 await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByText('Photo 2 of 3')).toBeVisible();await page.getByRole('button',{name:'Skip this photo'}).click();await expect(page.getByText('Photo 3 of 3')).toBeVisible();await page.getByRole('button',{name:'Skip this photo'}).click();await expect(page.getByRole('heading',{name:'Review photo suggestions'})).toBeVisible();await noOverflow(page);expect(calls).toBe(1);const bumps=page.getByRole('checkbox',{name:/Visible bumps/});await expect(bumps).toBeChecked();await page.getByRole('button',{name:'Continue',exact:true}).click();
 await skipQuestions(page,8);await prepareAndOpen(page);await expect(page.getByRole('heading',{name:'1% Salicylic Acid Body Wash'})).toBeVisible();await expect(page.getByText('We don’t have a sample product match for every selection.')).toBeVisible();
});

test('refresh clears an image but preserves selected concerns',async({page})=>{
 await start(page,['Face']);await page.getByRole('button',{name:'Continue without a photo'}).click();await page.getByRole('checkbox',{name:'Dryness'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByRole('button',{name:'Back',exact:true}).click();await page.locator('input[type=file][accept="image/jpeg,image/png,image/webp"]').setInputFiles('public/brand/logo-reference.png');await expect(page.getByAltText('Preview of the selected photo for face')).toBeVisible();await page.reload();await expect(page.getByText('Your photo was cleared after refresh. You can add it again or continue without it.')).toBeVisible();await expect(page.getByAltText('Preview of the selected photo for face')).toHaveCount(0);await page.getByRole('button',{name:'Back',exact:true}).click();await expect(page.getByRole('checkbox',{name:'Face',exact:true})).toBeChecked();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue without a photo'}).click();await expect(page.getByRole('checkbox',{name:'Dryness'})).toBeChecked();
});

test('hairline-only selection does not invent a product',async({page})=>{
 await page.clock.install({time:new Date('2026-11-04T00:00:00Z')});await start(page,['Hair']);await page.getByRole('button',{name:'Continue without a photo'}).click();await page.getByRole('checkbox',{name:'Hairline concerns'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await skipQuestions(page,2);await prepareAndOpen(page);await expect(page.getByRole('heading',{name:'No sample products matched'})).toBeVisible();
});

test('essential screens do not overflow at phone, tablet and desktop widths',async({page})=>{
 for(const width of [320,360,375,390,430,768,1280]){await page.setViewportSize({width,height:800});await page.goto('/');await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);}
});


test('recommendation and checkout errors offer a working retry',async({page})=>{
 await page.clock.install({time:new Date('2026-11-04T00:00:00Z')});let rec=0,checkout=0;await page.route('**/api/recommendations',async route=>{rec++;if(rec===1)await route.fulfill({status:503,json:{error:{code:'RECOMMENDATION_ERROR'}}});else await route.continue();});await page.route('**/api/checkout/simulate',async route=>{checkout++;if(checkout===1)await route.fulfill({status:503,json:{error:{code:'CHECKOUT_UNAVAILABLE'}}});else await route.continue();});
 await start(page,['Body Odour']);await page.getByRole('button',{name:'Skip',exact:true}).click();await page.getByRole('radio',{name:'Underarms'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByText('We couldn’t prepare your sample kit.',{exact:true}).first()).toBeVisible();await page.clock.fastForward(30000);await page.getByRole('button',{name:'Retry',exact:true}).click();await page.clock.runFor(1);await expect(page.getByRole('button',{name:'See my personalised kit'})).toBeEnabled();await page.getByRole('button',{name:'See my personalised kit'}).click();await page.clock.runFor(300);await page.getByRole('button',{name:'Proceed to checkout'}).click();await expect(page.getByRole('alert')).toContainText('couldn’t complete');await page.getByRole('button',{name:'Retry checkout'}).click();await expect(page.getByRole('heading',{name:'Demo checkout complete'})).toBeVisible();
});

test('failed photo analysis can be retried without losing the photo',async({page})=>{
 let calls=0;await page.route('**/api/photo-analysis/config',route=>route.fulfill({json:{provider:'Google Gemini',dataMode:'paid',analysisAvailable:true}}));await page.route('**/api/photo-analysis',async route=>{calls++;if(calls===1)await route.fulfill({status:429,json:{error:{code:'ANALYSIS_LIMITED'}}});else await route.fulfill({json:{analysisId:'test',area:'face',status:'complete',observations:[{optionId:'visible_marks',status:'suggested'}]}});});
 await start(page,['Face']);await page.locator('input[type=file][accept="image/jpeg,image/png,image/webp"]').setInputFiles('public/brand/logo-reference.png');await expect(page.getByAltText('Preview of the selected photo for face')).toBeVisible();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByText('We couldn’t analyse this photo. You can retry, replace it, or choose what applies yourself.')).toBeVisible();await page.getByRole('button',{name:'Retry',exact:true}).click();await expect(page.getByText('Suggested from your photo',{exact:true})).toBeVisible();expect(calls).toBe(2);
});

test('keyboard focus, 200% CSS zoom and reduced motion preserve usable controls',async({page})=>{
 await page.setViewportSize({width:640,height:800});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.evaluate(()=>{document.body.style.zoom='200%';});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);await page.keyboard.press('Tab');const focused=page.locator(':focus-visible');await expect(focused).toBeVisible();const outline=await focused.evaluate(el=>getComputedStyle(el).outlineStyle);expect(outline).not.toBe('none');await page.getByRole('button',{name:'Get your personalized kit'}).first().click();await page.getByRole('button',{name:'Find my kit',exact:true}).click();await page.getByRole('checkbox',{name:'Body Odour'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();const skip=page.getByRole('button',{name:'Skip',exact:true});const box=await skip.boundingBox();expect(box).not.toBeNull();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);
});


test('changing an answer invalidates the previous kit and restarts preparation',async({page})=>{
 await page.clock.install({time:new Date('2026-11-04T00:00:00Z')});await start(page,['Body Odour']);await page.getByRole('button',{name:'Skip',exact:true}).click();await page.getByRole('radio',{name:'Underarms'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await prepareAndOpen(page);await page.clock.runFor(300);await page.getByRole('button',{name:'Increase quantity of 4% AHA BHA Underarm Roll-On'}).click();await page.clock.runFor(300);await page.getByRole('button',{name:'Back to questions'}).click();await page.getByRole('radio',{name:'Other',exact:true}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByText('00:30')).toBeVisible();await expect(page.getByRole('button',{name:'See my personalised kit'})).toBeDisabled();await page.clock.fastForward(30000);await expect(page.getByRole('button',{name:'See my personalised kit'})).toBeEnabled();await page.getByRole('button',{name:'See my personalised kit'}).click();await expect(page.getByRole('heading',{name:'No sample products matched'})).toBeVisible();
});

test('actual Worker returns safe unavailable response without a provider key',async({request})=>{
 const config=await request.get('/api/photo-analysis/config');expect(await config.json()).toEqual({provider:'Google Gemini',analysisAvailable:false});
 const response=await request.post('/api/photo-analysis',{multipart:{area:'face',image:{name:'synthetic.jpg',mimeType:'image/jpeg',buffer:Buffer.from([255,216,255,224,1,2,255,217])}}});expect(response.status()).toBe(503);expect((await response.json()).error.code).toBe('ANALYSIS_UNAVAILABLE');
});


test('catalogue mismatch disables checkout and returns to assessment',async({page})=>{
 await page.clock.install({time:new Date('2026-11-04T00:00:00Z')});await page.route('**/api/quote',route=>route.fulfill({status:409,json:{error:{code:'CATALOGUE_CHANGED'}}}));await start(page,['Body Odour']);await page.getByRole('button',{name:'Skip',exact:true}).click();await page.getByRole('radio',{name:'Underarms'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await prepareAndOpen(page);await page.clock.runFor(300);await expect(page.getByText('Sample product information has changed. Please refresh your recommendations.')).toBeVisible();await expect(page.getByRole('button',{name:'Proceed to checkout'})).toBeDisabled();await page.getByRole('button',{name:'Back to assessment'}).click();await expect(page.getByRole('radio',{name:'Underarms'})).toBeChecked();
});



test('face and body skin choices share a screen and face concerns get their own sample',async({page})=>{
 await page.setViewportSize({width:375,height:800});await page.clock.install({time:new Date('2026-11-04T00:00:00Z')});await start(page,['General Body Care','Face']);await expect(page.getByText('Photo 1 of 1')).toBeVisible();await page.getByRole('button',{name:'Continue without a photo'}).click();await page.getByRole('checkbox',{name:'Hydration',exact:true}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('radio',{name:'Oily',exact:true}).first().check();await page.getByRole('radio',{name:'Dry',exact:true}).last().check();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('checkbox',{name:'Acne or bumps'})).toBeVisible();await page.getByRole('checkbox',{name:'Acne or bumps'}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('heading',{name:'Your routine focus'})).toBeVisible();await expect(page.getByText('What you told us',{exact:true})).toHaveCount(0);await expect(page.getByText('Confirmed from your photo',{exact:true})).toHaveCount(0);await expect(page.getByText('You’re looking for support with facial bumps or acne.')).toBeVisible();await prepareAndOpen(page);await expect(page.getByRole('heading',{name:'Gentle Face Cleanser'})).toBeVisible();await expect(page.getByRole('heading',{name:'10% Urea Body Lotion'})).toBeVisible();await noOverflow(page);
});


test('mobile storefront navigation, carousel, product tabs and demo cart',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByRole('heading',{name:'Every Body Works Wonders'})).toBeVisible();await noOverflow(page);await page.getByRole('button',{name:'Show banner 2'}).click();await expect(page.getByRole('button',{name:'Show banner 2'})).toHaveAttribute('aria-current','true');await page.getByRole('button',{name:'Open menu'}).click();await expect(page.getByRole('button',{name:'Shop By Category'})).toBeVisible();await page.getByRole('button',{name:'Close menu'}).click();await page.getByRole('button',{name:/Hair Care Hair Fall/}).click();await expect(page.getByRole('heading',{name:'Best Sellers'})).toBeVisible();await page.getByRole('button',{name:'ADD',exact:true}).first().click();await page.getByRole('button',{name:'Open demo cart, 1 items'}).click();await expect(page.getByRole('dialog',{name:'Demo cart'})).toContainText('Biotin Hair Gummies');await page.getByRole('button',{name:'Close cart'}).click();await page.getByRole('tab',{name:'Body Care'}).click();await expect(page.getByRole('heading',{name:'10% Urea Body Lotion - 300 ml'})).toBeVisible();await page.getByRole('button',{name:'View details for 10% Urea Body Lotion - 300 ml'}).click();await expect(page.getByRole('main',{name:'10% Urea Body Lotion - 300 ml details'})).toBeVisible();await page.getByRole('button',{name:'Back to shop'}).click();await page.getByRole('button',{name:'Get your personalized kit'}).first().click();await expect(page.getByRole('heading',{name:'Your kit, made for you.'})).toBeVisible();
});

test('all storefront categories show their own product images and details on mobile and desktop',async({page})=>{
 for(const width of [375,1280]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  for(const name of ['Hair Care','Body Care','Winter Care','Health & Fitness','Offers','Sun Shield','Face Care']){
   await page.getByRole('tab',{name,exact:true}).click();const card=page.locator('.store-product').first();await expect(card).toBeVisible();const picture=card.locator('img');await expect(picture).toBeVisible();await expect.poll(()=>picture.evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);await card.getByRole('button',{name:/View details for/}).click();await expect(page.locator('.product-page')).toBeVisible();await page.getByRole('button',{name:'Back to shop'}).click();
  }
  await noOverflow(page);
 }
});

test('every catalogue product has a reloadable page',async({page})=>{
 test.setTimeout(120000);const catalogue=JSON.parse(readFileSync('src/data/storefrontProducts.json','utf8')) as {id:string;name:string}[];await page.setViewportSize({width:390,height:844});
 for(const product of catalogue){await page.goto(`/?product=${encodeURIComponent(product.id)}`);await expect(page.locator('.product-page h1'),product.id).toHaveText(product.name);await expect(page.locator('.product-page img')).toBeVisible();}
});

test('the Be Bodywise logo returns from the assessment to the storefront',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Get your personalized kit'}).first().click();await page.getByRole('button',{name:'Find my kit',exact:true}).click();await expect(page.getByRole('heading',{name:'What would you like help with?'})).toBeVisible();await page.getByRole('button',{name:'Be Bodywise home'}).click();await expect(page.getByRole('heading',{name:'Every Body Works Wonders'})).toBeVisible();
});

test('category cards remain selectable and keyboard accessible without visible checkboxes',async({page})=>{
 for(const viewport of [{width:390,height:844},{width:320,height:700}]){
  await page.setViewportSize(viewport);await page.goto('/');await page.evaluate(()=>{sessionStorage.clear();history.replaceState(null,'','/')});await page.reload();await page.getByRole('button',{name:'Get your personalized kit'}).last().click();await page.getByRole('button',{name:'Find my kit',exact:true}).click();
  const cards=page.locator('.concerns-screen .choice-card');await expect(cards).toHaveCount(9);const card=cards.first(),check=card.getByRole('checkbox');const art=await card.locator('.concern-art').boundingBox();const bounds=await card.boundingBox();expect(art!.x+art!.width).toBeLessThanOrEqual(bounds!.x+bounds!.width);await card.click();await expect(check).toBeChecked();await expect(card).toHaveClass(/selected/);await check.focus();await page.keyboard.press('Space');await expect(check).not.toBeChecked();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
 }
});

test('featured carousel moves smoothly with controls and scrolling',async({page})=>{
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});await page.goto('/');const carousel=page.getByRole('region',{name:'Featured offers'});const track=carousel.locator('.hero-track');
  await carousel.getByRole('button',{name:'Next banner'}).click();await expect(carousel.getByRole('button',{name:'Show banner 2'})).toHaveAttribute('aria-current','true');await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeGreaterThan(10);
  await carousel.getByRole('button',{name:'Show banner 3'}).click();await expect(carousel.getByRole('button',{name:'Show banner 3'})).toHaveAttribute('aria-current','true');await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeGreaterThan(20);
  await carousel.getByRole('button',{name:'Previous banner'}).click();await expect(carousel.getByRole('button',{name:'Show banner 2'})).toHaveAttribute('aria-current','true');
  await track.dispatchEvent('pointerdown');await track.evaluate(el=>el.scrollTo({left:0,behavior:'instant'}));await expect(carousel.getByRole('button',{name:'Show banner 1'})).toHaveAttribute('aria-current','true');await noOverflow(page);
 }
});

test('featured carousel responds to a phone swipe and arrow keys',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');const carousel=page.getByRole('region',{name:'Featured offers'});const track=carousel.locator('.hero-track');const rect=await track.boundingBox();const session=await context.newCDPSession(page);const y=rect!.y+rect!.height/2;await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:330,y}]});for(const x of [290,250,210,170,130,90])await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(carousel.getByRole('button',{name:'Show banner 2'})).toHaveAttribute('aria-current','true');await carousel.getByRole('button',{name:'Next banner'}).focus();await page.keyboard.press('ArrowRight');await expect(carousel.getByRole('button',{name:'Show banner 3'})).toHaveAttribute('aria-current','true');
});

test('desktop carousel ends with the last poster and no trailing block',async({page})=>{
 for(const width of [625,1280]){
  await page.setViewportSize({width,height:844});await page.goto('/');const carousel=page.getByRole('region',{name:'Featured offers'});await carousel.getByRole('button',{name:'Show banner 3'}).click();await expect(carousel.getByRole('button',{name:'Show banner 3'})).toHaveAttribute('aria-current','true');const track=carousel.locator('.hero-track');await expect.poll(()=>track.evaluate(el=>Math.abs(el.scrollWidth-el.clientWidth-el.scrollLeft))).toBeLessThan(10);expect(await track.evaluate(el=>getComputedStyle(el,'::after').display)).toBe('none');
 }
});

test('featured carousel advances every seven seconds and pauses on interaction',async({page})=>{
 await page.clock.install();await page.setViewportSize({width:1280,height:844});await page.goto('/');const carousel=page.getByRole('region',{name:'Featured offers'});await expect(carousel.getByRole('button',{name:'Show banner 1'})).toHaveAttribute('aria-current','true');await page.clock.runFor(7100);await expect(carousel.getByRole('button',{name:'Show banner 2'})).toHaveAttribute('aria-current','true');await carousel.hover();await page.clock.runFor(9000);await expect(carousel.getByRole('button',{name:'Show banner 2'})).toHaveAttribute('aria-current','true');
});
