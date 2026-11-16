import {describe,it,expect,vi,afterEach} from 'vitest';
import {answerChat} from '../worker/productChat';

describe('concern choice paths',()=>{
 afterEach(()=>vi.unstubAllGlobals());
 it.each(['Individual pimples or spots','I have a few pimples','single pimple'])('connects %s to the surfaced-pimple patch',async message=>{
  const r=await answerChat({message,input_source:'button',history:[{role:'user',text:'I need face products'},{role:'assistant',text:'What would you like to address?'}]},{});
  expect(r.selected_product_ids).toEqual(['hydrocolloid-acne-pimple-patch']);
  expect(r.message).toMatch(/surfaced pimple/i);expect((r as any).recommendations[0].id).toBe('hydrocolloid-acne-pimple-patch');
 });
 it('does not route a body concern to a face patch',async()=>{
  const r=await answerChat({message:'individual pimples',input_source:'button',history:[{role:'user',text:'I need body products for my back'}]},{});
  expect(r.selected_product_ids).not.toContain('hydrocolloid-acne-pimple-patch');
 });
 it.each(['I have strawberry legs','What products for body acne?','I have body pigmentation','I have underarm pigmentation','I have body odor','I have pimples','I have hair fall'])('keeps every prepared choice actionable for %s',async message=>{
  const first=await answerChat({message,input_source:'typed'},{});
  const choices=(first as any).choices as string[];expect(choices.length).toBeGreaterThan(0);
  for(const choice of choices){
   const next=await answerChat({message:choice,input_source:'button',selected_product_ids:first.selected_product_ids,history:[{role:'user',text:message},{role:'assistant',text:first.message}]},{});
   expect((next as any).recommendations?.length||next.product_options.length,`${message}: ${choice}`).toBeGreaterThan(0);
   expect(next.status).not.toBe('unavailable');
  }
 });
 it('handles unmatched conversational choices safely',async()=>{
  const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({answer:'What kind of hair care are you looking for?',recommended_product_ids:[],focused_product_ids:[],choices:['Hair fall','Dandruff']})}]}]}),{status:200}));vi.stubGlobal('fetch',fetcher);
  const r=await answerChat({message:'Something else',input_source:'button',history:[{role:'user',text:'I need hair products'},{role:'assistant',text:'What would you like to address?'}]},{OPENAI_API_KEY:'test'});
  expect(r.message).toBeTruthy();expect(r.message).not.toContain('undefined');expect(r.message).not.toContain('test-secret');
 });
});
