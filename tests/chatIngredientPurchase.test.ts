import {describe,it,expect,vi,afterEach} from 'vitest';
import {answerChat} from '../worker/productChat';
import data from '../worker/data/chatProducts.json';
afterEach(()=>vi.unstubAllGlobals());
describe('ingredient recommendations and product links',()=>{
 it.each(['do you have a hair growth product with redensyl','do you have a hair growth product with redensil','which hair serum contains redensyl'])('recommends an actual matching hair product for %s',async(message)=>{
  const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);const r=await answerChat({message,input_source:'typed',history:[{role:'user',text:'Tell me about Redensyl'},{role:'assistant',text:'It is used in hair care.'}]},{OPENAI_API_KEY:'x'});const options=(r as typeof r & {recommendations:{id:string}[]}).recommendations;expect(options).toHaveLength(1);const p=data.find(x=>x.id===options[0].id)!;expect(p.category).toBe('Hair Care');expect(p.ingredients).toMatch(/redensyl/i);expect(r.message).toMatch(/redensyl/i);expect(fetcher).toHaveBeenCalledOnce();
 });
 it('uses the selected product for a purchase link, without an external URL',async()=>{const r=await answerChat({message:'Give me the link to buy',input_source:'typed',selected_product_ids:['sun-care-duo-head-to-toe']},{});expect(r.message).toMatch(/Explore more/);expect(r.message).not.toMatch(/https?:/);expect((r as typeof r & {recommendations:{id:string}[]}).recommendations[0].id).toBe('sun-care-duo-head-to-toe');});
 it.each(['send the product link','where can I buy it?','link to purchase','share the buying link','how do I order it?','show me the product URL','where can I shop for it?'])('offers the same product link for %s',async(message)=>{
  const r=await answerChat({message,input_source:'typed',selected_product_ids:['sun-care-duo-head-to-toe'],history:[{role:'user',text:'Tell me about the sunscreen duo.'},{role:'assistant',text:'Sun Care Duo for Face and Body is a sunscreen kit.'}]},{});
  expect(r.message).toMatch(/Tap.*Explore more/);expect((r as typeof r & {recommendations:{id:string}[]}).recommendations.map(p=>p.id)).toEqual(['sun-care-duo-head-to-toe']);expect(r.message).not.toMatch(/https?:/);
 });
 it('asks which product if a purchase request is ambiguous',async()=>{const r=await answerChat({message:'give me the link to buy',input_source:'typed',selected_product_ids:['sun-care-duo-head-to-toe','hair-growth-serum-roll-on']},{});expect(r.status).toBe('clarify');expect(r.product_options).toHaveLength(2);});
 it('does not mistake an ingredient explanation for a product recommendation',async()=>{const r=await answerChat({message:'What does redensyl do?',input_source:'typed'},{});expect(r.message).not.toMatch(/^Yes,/);});
});
