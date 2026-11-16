import { describe, expect, it } from 'vitest';
import { configuredData, generateRecommendations } from '../worker/recommendations';
import storefront from '../src/data/storefrontProducts.json';
import links from '../worker/data/storefrontPriceLinks.json';
import { calculateQuote } from '../worker/kit';

describe('assessment and storefront pricing',()=>{
 it('uses the storefront price for each explicitly matched product',()=>{
  const data=configuredData()!;expect(data).not.toBeNull();
  for(const [id,storeId] of Object.entries(links)){
   const product=data.catalogue.products.find(p=>p.id===id);const store=storefront.find(p=>p.id===storeId);
   expect(product,id).toBeDefined();expect(store,storeId).toBeDefined();expect(product!.pricePaise,id).toBe(Number(store!.price.slice(1).replace(/,/g,''))*100);
  }
  const recommendation=generateRecommendations({sessionId:'price-test',selectedConcerns:['body_acne_marks'],answers:{body_acne_goal:'active_bumps',shared_body_skin:'oily'},confirmedPhotoSelections:[]},data.catalogue,data.rules);expect(recommendation.items[0].product.pricePaise).toBe(39900);
  expect(data.catalogue.products.find(p=>p.id==='demo_sa_body_wash')!.pricePaise).toBe(39900);expect(calculateQuote([{productId:'demo_sa_body_wash',quantity:1}],data.catalogue).subtotalPaise).toBe(39900);
 });
});
