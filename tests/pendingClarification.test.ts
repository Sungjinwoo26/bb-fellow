import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat,chatRoute} from '../worker/productChat';
import {initialChatState} from '../src/shared/chatState';

afterEach(()=>vi.unstubAllGlobals());
describe('pending product clarification',()=>{
 const ids=['10-urea-lotion-300ml','20-urea-roll-on-75ml'];
 const env={V1_TYPED_AI:'true',OPENAI_API_KEY:'test'};
 it('retains the original frequency question and selectable products',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{}',{status:503})));
  const request=new Request('https://example.test/api/chat',{method:'POST',body:JSON.stringify({message:'How often should I use it?',input_source:'typed',conversation_state:{...initialChatState(),active_product_ids:ids}})});
  const response=await chatRoute(request,env);const body=await response.json();
  expect(body.status).toBe('clarify');
  expect(body.product_options.map((p:{id:string})=>p.id)).toEqual(ids);
  expect(body.conversation_state.pending_question).toEqual({message:'How often should I use it?',product_ids:ids});
 });
 it('resumes a pending question after a product-card selection',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{}',{status:503})));
  const state={...initialChatState(),pending_question:{message:'How often should I use it?',product_ids:ids}};
  const result=await answerChat({message:'How often should I use it?',input_source:'button',selection_confirmed:true,selected_product_ids:[ids[0]],conversation_state:state},env);
  expect(result.selected_product_ids).toEqual([ids[0]]);
  expect(result.status).not.toBe('clarify');
  expect(result.message).toMatch(/often|directions|daily|day|frequency/i);
 });
 it('answers a pending frequency question when the customer identifies the wash and also asks about the lotion',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{}',{status:503})));
  const productIds=['1-salicylic-acid-body-wash-350ml','niacinamide-body-lotion'];
  const state={...initialChatState(),active_product_ids:productIds,pending_question:{message:'How often should I use it?',product_ids:productIds}};
  const result=await answerChat({message:'I meant the wash. Can I use niacinamide lotion after it?',input_source:'typed',conversation_state:state},env);
  expect(result.message).toMatch(/frequency|daily|day|often/i);
  expect(result.message).toMatch(/lotion/i);
  expect(result.selected_product_ids).toEqual(expect.arrayContaining(productIds));
 });
});
describe('pending concern clarification',()=>{
 it('records the original request and offered concern choices',async()=>{
  const request=new Request('https://example.test/api/chat',{method:'POST',body:JSON.stringify({message:'Find a product for my concern',input_source:'button'})});
  const response=await chatRoute(request,{V1_TYPED_AI:'true'});const body=await response.json();
  expect(body.status).toBe('clarify');
  expect(body.conversation_state.pending_clarification.original_message).toBe('Find a product for my concern');
  expect(body.conversation_state.pending_clarification.choices).toContain('Body care');
  const next=await chatRoute(new Request('https://example.test/api/chat',{method:'POST',body:JSON.stringify({message:'Body care',input_source:'button',conversation_state:body.conversation_state})}),{V1_TYPED_AI:'true'});
  const resumed=await next.json();
  expect(resumed.message).toMatch(/body/i);
  expect(resumed.choices).toContain('Body acne or marks');
 });
});
