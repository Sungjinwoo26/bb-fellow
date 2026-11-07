import { describe, expect, it } from 'vitest';
import products from '../worker/data/chatProducts.json';
import descriptions from '../worker/data/productDescriptions.json';
import { answerChat } from '../worker/productChat';
describe('catalogue-wide assistant coverage',()=>{
 it('has a product description for all 56 products',()=>{for(const p of products)expect(descriptions[p.id as keyof typeof descriptions],p.name).toBeTruthy();});
 it('answers usage and timeline questions for each selected product without changing its identity',async()=>{
  for(const p of products){for(const message of ['How do I use it?','When might I see results?']){
   const r=await answerChat({message,selected_product_ids:[p.id]}, {}, false);
   expect(r.message,p.name+' '+message).toBeTruthy();
   expect(r.selected_product_ids,p.name+' '+message).toContain(p.id);
   expect(r.message,p.name+' '+message).not.toContain('temporarily unavailable');
  }}
 });
});
