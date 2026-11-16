import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat} from '../worker/productChat';
import {initialChatState} from '../src/shared/chatState';
import {catalogueById} from '../worker/catalogue';
import {bodyPolicy} from '../worker/bodyChat';
const env={OPENAI_API_KEY:'test',V1_TYPED_AI:'true'};
const turn={action:'product_question',reference_scope:'ambiguous',referenced_products:[],product_types:[],concerns:[],body_areas:[],excluded_ingredients:[],intents:[],missing_information:[],confidence:'medium'};
function mock(){vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(turn)}]}]}))));}
afterEach(()=>vi.unstubAllGlobals());
describe('reported product and context defects',()=>{
 it('correctly classifies the foam face wash',()=>expect(catalogueById.get('salicylic-acid-face-wash')?.category).toBe('Face Care'));
 it('keeps the existing body acne question when the user specifies their back',()=>expect(bodyPolicy('on my back',turn,'What would you like to focus on for your body skin?')?.category).toBe('acne'));
 it('keeps the acne conversation after a body choice and a typed back detail',async()=>{
  const acne={...turn,action:'find_product',reference_scope:'none',concerns:['acne'],body_areas:[],missing_information:['body area'],confidence:'high'};
  vi.stubGlobal('fetch',vi.fn().mockImplementation(async(_url,init)=>{const body=JSON.parse(init.body),input=JSON.parse(body.input);const data=body.text.format.name==='chat_turn'?acne:body.text.format.name==='grounded_answer'?{claims:input.facts.map((f:{key:string;value:string})=>({text:f.value,fact_keys:[f.key],intent:'purpose'})),requested_fields:[]}:{text:input.reference};return new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(data)}]}]}));}));
  const first=await answerChat({message:'I have achne',input_source:'typed'},env);
  const second=await answerChat({message:'Body',input_source:'button',conversation_state:first.conversation_state},env);
  const third=await answerChat({message:'on my back',input_source:'typed',conversation_state:second.conversation_state,history:[{role:'assistant',text:second.message}]},env);
  expect(third.status).toBe('clarify');expect(third.message).toMatch(/body skin/i);expect(third.message).not.toMatch(/try again/i);
 });
 it.each(['pigmentation-repair-cream','hair-fall-control-shampoo'])('answers price for the active product %s',async id=>{mock();const state={...initialChatState(),active_product_ids:[id]};const r=await answerChat({message:'how much is it',input_source:'typed',conversation_state:state},env);expect(r.selected_product_ids).toEqual([id]);expect(r.message).toMatch(/catalogue|price/i);expect(r.status).toBe('answered');});
 it('compares the prices of the two active products',async()=>{mock();const ids=['ultra-light-sunscreen-spf50','lightest-mineral-sunscreen-spf50'];const r=await answerChat({message:'which one is cheaper',input_source:'typed',conversation_state:{...initialChatState(),active_product_ids:ids}},env);expect(r.selected_product_ids).toEqual(ids);for(const id of ids)expect(r.message).toContain(catalogueById.get(id)!.name);});
 it('resolves a named lotion instead of reusing the active product',async()=>{mock();const r=await answerChat({message:'how much is the niacinamide body lotion',input_source:'typed',conversation_state:{...initialChatState(),active_product_ids:['hair-fall-control-shampoo']}},env);expect(r.selected_product_ids).toEqual(['niacinamide-body-lotion']);});
 it('keeps both selected products in a comparison even if interpretation omits them',async()=>{mock();const ids=['10-urea-lotion-300ml','20-urea-lotion-xp'];const r=await answerChat({message:'compare these products',input_source:'typed',conversation_state:{...initialChatState(),active_product_ids:ids}},env);expect(r.selected_product_ids).toEqual(ids);for(const id of ids)expect(r.message).toContain(catalogueById.get(id)!.name);});
 it('compares both specifically requested urea lotions',async()=>{mock();const r=await answerChat({message:'compare 20% vs 10% urea lotion',input_source:'typed'},env);expect(r.selected_product_ids).toEqual(expect.arrayContaining(['10-urea-lotion-300ml','20-urea-lotion-xp']));expect(r.selected_product_ids).toHaveLength(2);});
 it('makes the comparison picker explain that the first product is being chosen',async()=>{const r=await answerChat({message:'Compare products',input_source:'button'},env);expect(r.message).toMatch(/compare first/i);});
});
