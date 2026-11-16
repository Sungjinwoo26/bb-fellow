import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat} from '../worker/productChat';
import {initialChatState} from '../src/shared/chatState';

const id='pigmentation-repair-cream';
const env={OPENAI_API_KEY:'test',V1_TYPED_AI:'true'};
const state={...initialChatState(),active_product_ids:[id]};
const model={action:'product_question',reference_scope:'active_product',referenced_products:[id],product_types:[],concerns:[],hair_concerns:[],body_areas:[],excluded_ingredients:[],intents:['usage'],missing_information:[],confidence:'high'};
const reply=()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(model)}]}]}));
afterEach(()=>vi.unstubAllGlobals());
describe('layering and follow-up context',()=>{
 it('addresses the moisturiser question without inventing compatibility',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>reply()));
  const first=await answerChat({message:'can i use moisturizer on this',input_source:'typed',conversation_state:state},env);
  expect(first.message).toMatch(/can.t confirm.*moisturi[sz]er/i);
  expect(first.message).toMatch(/which moisturiser/i);
  expect(first.conversation_state.active_product_ids).toEqual([id]);
  const next=await answerChat({message:'My own body lotion',input_source:'typed',conversation_state:first.conversation_state,history:[{role:'assistant',text:first.message}]},env);
  expect(next.message).toMatch(/can.t confirm.*moisturi[sz]er/i);
  expect(next.message).not.toMatch(/which moisturiser/i);
 });
 it('handles yes to a broad offer in context',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(reply()));
  const answer=await answerChat({message:'Yes',input_source:'typed',conversation_state:state,history:[{role:'assistant',text:'For Pigmentation Repair Cream, Reducing Body Pigmentation. Would you like to know more?'}]},env);
  expect(answer.message).toMatch(/how to use it.*ingredients/i);
  expect(answer.message).not.toMatch(/share the product name/i);
 });
});
