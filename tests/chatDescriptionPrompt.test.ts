import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat,PRODUCT_ASSISTANT_PROMPT,PRODUCT_DESCRIPTION_STYLE} from '../worker/productChat';
const result=()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({answer:'Here are some options.',recommended_product_ids:[],focused_product_ids:[],choices:[]})}]}]}),{status:200});
describe('product description framing',()=>{
 afterEach(()=>vi.unstubAllGlobals());
 it('uses the same grounded description rule in the product explanation prompt',()=>{
  expect(PRODUCT_ASSISTANT_PROMPT).toContain(PRODUCT_DESCRIPTION_STYLE);
  expect(PRODUCT_DESCRIPTION_STYLE).toMatch(/meaningful, supported distinction/);
  expect(PRODUCT_DESCRIPTION_STYLE).toMatch(/do not fabricate/);
 });
 it.each(['I want to understand body washes for rough skin','What hair gummies are available?','I want to understand face washes for oily skin','Tell me about hair serums for thinning'])('returns a grounded response and valid cards for %s',async message=>{
  const f=vi.fn().mockResolvedValue(result());vi.stubGlobal('fetch',f);
  const answer=await answerChat({message,input_source:'typed'},{OPENAI_API_KEY:'test'});
  expect(answer.message).toBeTruthy();expect(answer.message).not.toMatch(/not-a-real-product|undefined|null/i);
  for(const card of answer.product_cards)expect(card.url).toMatch(/^https:\/\/bebodywise\.com\/product\//);
 });
});
