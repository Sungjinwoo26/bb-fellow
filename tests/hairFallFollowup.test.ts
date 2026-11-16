import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat} from '../worker/productChat';
import {initialChatState} from '../src/shared/chatState';
const model={action:'product_question',reference_scope:'ambiguous',referenced_products:[],product_types:[],concerns:['hair fall'],hair_concerns:['shedding'],body_areas:['hair'],excluded_ingredients:[],intents:['purpose'],missing_information:[],confidence:'medium'};
const reply=(value:unknown)=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]}));
afterEach(()=>vi.unstubAllGlobals());
describe('hair fall after dandruff and thinning',()=>{
 it('uses a supported hair-fall product when the writer is unavailable and preserves flakes',async()=>{
  const fetcher=vi.fn().mockImplementation(async(_url,init)=>JSON.parse(init.body).text.format.name==='chat_turn'?reply(model):new Response('',{status:503}));vi.stubGlobal('fetch',fetcher);
  const state={...initialChatState(),areas:['hair'],active_product_ids:['anti-dandruff-serum','advanced-hair-growth-serum'],hair_context:{observed:['thinning','flakes'] as ('thinning'|'flakes')[],focus:null,flakes:'yes' as const}};
  const result=await answerChat({message:'and for hair fall',input_source:'typed',conversation_state:state}, {OPENAI_API_KEY:'test',V1_TYPED_AI:'true'});
  expect(result.status).toBe('answered');expect(result.message).toMatch(/hair fall/i);expect(result.message).not.toMatch(/try again|do you also notice/i);
  expect(result.conversation_state.hair_context?.observed).toContain('flakes');
  expect(result.product_cards.length).toBeGreaterThan(0);
 });
 it('adds fall and thinning to dandruff, offers an evidenced kit and retains all observations',async()=>{
  const fetcher=vi.fn().mockImplementation(async(_url,init)=>{const body=JSON.parse(init.body);if(body.text.format.name!=='chat_turn')return new Response('',{status:503});const input=JSON.parse(body.input);return reply({...model,concern_relation:'add',concerns:input.message.includes('thinning')?['hair thinning']:['hair fall'],hair_concerns:input.message.includes('thinning')?['thinning']:['shedding']});});vi.stubGlobal('fetch',fetcher);
  const state={...initialChatState(),areas:['hair'],concerns:['dandruff'],active_product_ids:['anti-dandruff-serum'],hair_context:{observed:['flakes'] as ('flakes'|'thinning'|'shedding')[],focus:null,flakes:null}};
  const first=await answerChat({message:'and hair fall',input_source:'typed',conversation_state:state}, {OPENAI_API_KEY:'test',V1_TYPED_AI:'true'});
  expect(first.status).toBe('answered');expect(first.selected_product_ids).toContain('1-zpto-ads-hg30-kit');expect(first.conversation_state.hair_context?.observed).toEqual(expect.arrayContaining(['flakes','shedding']));
  const second=await answerChat({message:'and hair thinning',input_source:'typed',conversation_state:first.conversation_state}, {OPENAI_API_KEY:'test',V1_TYPED_AI:'true'});
  expect(second.status).toBe('answered');expect(second.selected_product_ids).toContain('1-zpto-ads-hg30-kit');expect(second.selected_product_ids).toContain('advanced-hair-growth-serum');expect(second.conversation_state.hair_context?.observed).toEqual(expect.arrayContaining(['flakes','shedding','thinning']));
 });
 it('treats an explicit switch as a new focus while retaining observed flakes',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockImplementation(async(_url,init)=>JSON.parse(init.body).text.format.name==='chat_turn'?reply({...model,concern_relation:'switch',hair_concerns:['thinning']}):new Response('',{status:503})));
  const state={...initialChatState(),areas:['hair'],hair_context:{observed:['flakes'] as ('flakes'|'thinning')[],focus:null,flakes:'yes' as const}};
  const r=await answerChat({message:'instead only hair thinning',input_source:'typed',conversation_state:state}, {OPENAI_API_KEY:'test',V1_TYPED_AI:'true'});
  expect(r.selected_product_ids).toEqual(['advanced-hair-growth-serum']);expect(r.conversation_state.hair_context?.observed).toContain('flakes');expect(r.conversation_state.hair_context?.focus).toBe('thinning');
 });
 it('asks when the relationship is unclear and handles both-concerns button without another AI call',async()=>{
  const fetcher=vi.fn().mockImplementation(async()=>reply({...model,action:'find_product',concern_relation:'unclear',concerns:['hair thinning'],hair_concerns:['thinning']}));vi.stubGlobal('fetch',fetcher);
  const state={...initialChatState(),areas:['hair'],concerns:['dandruff'],active_product_ids:['anti-dandruff-serum'],hair_context:{observed:['flakes'] as ('flakes')[],focus:null,flakes:null}};
  const first=await answerChat({message:'hair thinning',input_source:'typed',conversation_state:state}, {OPENAI_API_KEY:'test',V1_TYPED_AI:'true'});
  expect(first.message).toMatch(/both concerns.*only the new concern/i);expect(first.choices).toEqual(['Both concerns','Only the new concern']);
  const next=await answerChat({message:'Both concerns',input_source:'button',conversation_state:first.conversation_state}, {OPENAI_API_KEY:'test',V1_TYPED_AI:'true'});
  expect(next.status).toBe('answered');expect(next.conversation_state.hair_context.observed).toEqual(expect.arrayContaining(['flakes','thinning']));expect(fetcher).toHaveBeenCalledTimes(1);
 });
});
