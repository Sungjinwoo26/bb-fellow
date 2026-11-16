import { afterEach, describe, expect, it, vi } from 'vitest';
import { answerChat,chatRoute } from '../worker/productChat';
import { catalogue as products } from '../worker/catalogue';
const env={OPENAI_API_KEY:'test-secret',OPENAI_MODEL:'gpt-6-luna'};
const output={answer:'A context-specific answer.',recommended_product_ids:[],focused_product_ids:[],choices:[]};
function mockModel(){return vi.fn().mockImplementation(async()=>new Response(JSON.stringify({status:'completed',usage:{input_tokens:100,input_tokens_details:{cached_tokens:50}},output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(output)}]}]}),{status:200}))}
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers()});
describe('safe general-answer cache',()=>{
 it('reuses a reviewed general answer after typed-message interpretation',async()=>{
  const fetcher=mockModel();vi.stubGlobal('fetch',fetcher);const input={message:'What does niacinamide do?',input_source:'typed' as const};
  const first=await answerChat(input,env);const second=await answerChat(input,env);
  expect(first).toHaveProperty('cache_status','miss');expect(second).toHaveProperty('cache_status','hit');expect(second.message).toEqual(first.message);expect(second.message).toMatch(/skin barrier/);expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('recognises an explicit safe ingredient spelling alias without guessing intent',async()=>{
  const fetcher=mockModel();vi.stubGlobal('fetch',fetcher);const result=await answerChat({message:'What does niacinimide do?',input_source:'typed'},env);expect(result.message).toMatch(/skin barrier/);expect(fetcher).toHaveBeenCalledOnce();
 });
 it.each(['4-aha-bha-underarm-rollon-frag-free-75','6-aha-bha-underarm-roll-on-flora-75ml'])('keeps variant %s in its conversation-specific request',async id=>{
  const fetcher=mockModel();vi.stubGlobal('fetch',fetcher);const history=[{role:'user' as const,text:'My underarms are dry.'},{role:'assistant' as const,text:'Which product?'}];const answer=await answerChat({message:'How do I use this product?',input_source:'typed',selected_product_ids:[id],history},env);expect(answer.selected_product_ids).toEqual([id]);expect(answer.message).toBeTruthy();expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('invalidates an answer when relevant product information changes',async()=>{
  const input={message:'What does urea do?',input_source:'typed' as const};await answerChat(input,env);expect(await answerChat(input,env)).toHaveProperty('cache_status','hit');const product=products.find(p=>p.id==='10-urea-lotion-300ml')!;const original=product.usage;
  try{product.usage='Updated directions for testing';expect(await answerChat(input,env)).toHaveProperty('cache_status','miss')}finally{product.usage=original}
 });
 it('expires cached entries after one hour',async()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date('2026-01-01'));const input={message:'What does lactic acid do?',input_source:'typed' as const};
  expect(await answerChat(input,env)).toHaveProperty('cache_status','miss');expect(await answerChat(input,env)).toHaveProperty('cache_status','hit');vi.advanceTimersByTime(3600001);expect(await answerChat(input,env)).toHaveProperty('cache_status','miss');
 });
 it.each([
  {message:'What does niacinamide do?',history:[{role:'user' as const,text:'I have sensitive skin'}]},
  {message:'What does niacinamide do?',selected_product_ids:['2-salicylic-acid-face-wash']},
  {message:'What does niacinamide do for my redness?'},
  {message:'Is niacinamide safe during pregnancy?'},
 ])('does not share-cache contextual or sensitive question %#',async(input)=>{
  const fetcher=mockModel();vi.stubGlobal('fetch',fetcher);const answer=await answerChat({...input,input_source:'typed'},env);expect(answer).not.toHaveProperty('cache_status');
  if(!/pregnan/i.test(input.message))expect(fetcher).toHaveBeenCalledOnce();else expect(answer).toHaveProperty('expert_card');
 });
 it('preserves prior conversation for a product follow-up instead of using a generic template',async()=>{
  const fetcher=mockModel();vi.stubGlobal('fetch',fetcher);const history=[{role:'user' as const,text:'My skin feels very dry after cleansing.'},{role:'assistant' as const,text:'Which product do you mean?'}];
  const answer=await answerChat({message:'How do I use this product?',input_source:'typed',selected_product_ids:['4-aha-bha-underarm-rollon-frag-free-75'],history},env);
  expect(answer.selected_product_ids).toEqual(['4-aha-bha-underarm-rollon-frag-free-75']);expect(answer.message).toMatch(/underarm|roll/i);expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('reports route and duration without returning the query as performance metadata',async()=>{
  const req=new Request('https://example.test/api/chat',{method:'POST',body:JSON.stringify({message:'What does urea do?',input_source:'typed'})});const first=await chatRoute(req,{});expect(first.headers.get('Server-Timing')).toMatch(/^chat;dur=\d+$/);const next=await chatRoute(new Request('https://example.test/api/chat',{method:'POST',body:JSON.stringify({message:'What does urea do?',input_source:'typed'})}),{});expect(next.headers.get('X-Chat-Route')).toBe('shared-cache');
 });
});
