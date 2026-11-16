import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat} from '../worker/productChat';
afterEach(()=>vi.unstubAllGlobals());
describe('body area and follow-up context',()=>{
 it.each(['i have pimples on my back and chest, what should i use','what products for back acne','I have chest pimples','I have body acne'])('returns body-area options for %s',async(message)=>{
  const r=await answerChat({message,input_source:'typed'},{});expect(r.answer_mode).toBe('prepared_answer');expect(r.message).not.toMatch(/face wash|facial/i);expect(r.selected_product_ids).toEqual(['1-salicylic-acid-body-wash-350ml','salicylic-ceramide-bodywash']);
 });
 it('asks which product an ambiguous follow-up refers to',async()=>{const ids=['1-salicylic-acid-body-wash-350ml','salicylic-ceramide-bodywash'];const r=await answerChat({message:'how often should i apply it',input_source:'typed',selected_product_ids:ids},{});expect(r.status).toBe('clarify');expect(r.product_options.map(p=>p.id)).toEqual(ids);});
 it('uses the selected product once the customer picks one',async()=>{const r=await answerChat({message:'how often should i apply it',selection_confirmed:true,input_source:'button',selected_product_ids:['1-salicylic-acid-body-wash-350ml']},{},false);expect(r.selected_product_ids).toEqual(['1-salicylic-acid-body-wash-350ml']);expect(r.message).toMatch(/daily/i);});
 function mockInterpreter(){
  const turn={action:'find_product',reference_scope:'none',referenced_products:[],product_types:[],concerns:['acne'],body_areas:['body'],excluded_ingredients:[],intents:[],missing_information:[],confidence:'high'};
  const fetcher=vi.fn().mockImplementation(async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(turn)}]}]})));
  vi.stubGlobal('fetch',fetcher);return fetcher;
 }
 it('returns body-acne products, not facial products, for oily pimples on the back',async()=>{
  const fetcher=mockInterpreter();const r=await answerChat({message:'I have oily pimples on my back and chest',input_source:'typed'},{OPENAI_API_KEY:'x'});
  expect(fetcher).toHaveBeenCalledTimes(2);expect(r.status).toBe('answered');expect(r.product_cards.length).toBeGreaterThan(0);
  expect(r.product_cards.every(p=>/body/i.test(p.name))).toBe(true);expect(r.message).not.toMatch(/face wash|facial/i);
  expect(r.conversation_state.areas).toContain('body');
 });
 it('uses the latest explicit area when a conversation switches from face to back',async()=>{
  mockInterpreter();const r=await answerChat({message:'I have oily pimples on my back',input_source:'typed',history:[{role:'user',text:'I had pimples on my face'},{role:'assistant',text:'What would you like to explore?'}]},{OPENAI_API_KEY:'x'});
  expect(r.status).toBe('answered');expect(r.product_cards.length).toBeGreaterThan(0);expect(r.product_cards.every(p=>/body/i.test(p.name))).toBe(true);expect(r.message).not.toMatch(/face wash|facial/i);
  expect(r.conversation_state.areas).toEqual(['body']);
 });
});
