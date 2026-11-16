import { beforeEach, describe, expect, it, vi } from 'vitest';
import products from '../worker/data/chatProducts.json';
import answerData from '../worker/data/preparedAnswers.json';
const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));
vi.mock('@google/genai',()=>({GoogleGenAI:class{models={generateContent}}}));
import { answerChat } from '../worker/productChat';
const env={GEMINI_API_KEY:'test-key',GEMINI_MODEL:'test-model'};
describe('prepared answer routing',()=>{
 beforeEach(()=>generateContent.mockReset());
 it('serves the three standard questions for every product without calling Gemini',async()=>{
  for(const p of products)for(const message of ['How do I use a product?','Tell me about an ingredient.','When might I see results?']){
   const result=await answerChat({message,selected_product_ids:[p.id],selection_confirmed:true},env);
   expect(result.answer_mode,p.name+' / '+message).toBe('prepared_answer');expect(result.message).toBeTruthy();
  }
  expect(generateContent).not.toHaveBeenCalled();
 },30000);
 it('preserves both exact products for representative comparisons without an AI writer',async()=>{
  for(const ids of [['hair-fall-control-shampoo','1-ketoconazole-dandruff-shampoo-250ml'],['20-urea-roll-on-75ml','10-urea-lotion-300ml'],['4-aha-bha-underarm-rollon-frag-free-75','6-aha-bha-underarm-roll-on-flora-75ml']]){
   for(const pair of [ids,[...ids].reverse()]){const result=await answerChat({message:'Compare these and give both prices.',selected_product_ids:pair},env);expect(result.selected_product_ids).toEqual(pair);expect(result.product_cards.map(p=>p.id)).toEqual(pair);}
  }
  expect(generateContent).not.toHaveBeenCalled();
 });
 it('answers each named ingredient from the researched guide without Gemini',async()=>{
  for(const a of answerData.answers.filter(x=>x.type==='ingredient')){
   if(!('ingredient' in a)||!a.ingredient)continue;
   const result=await answerChat({message:a.ingredient,pending_ingredient:true},env);
   expect(result.answer_mode,a.ingredient).toBe('prepared_answer');
  }
  expect(generateContent).not.toHaveBeenCalled();
 });
 it('continues from the prepared ingredient answer into the routine after yes',async()=>{
  const selected_product_ids=['4-aha-bha-underarm-rollon-frag-free-75'];
  const first=await answerChat({message:'Tell me about an ingredient.',selected_product_ids,selection_confirmed:true},env);
  expect(first.follow_up).toBe('usage');
  const next=await answerChat({message:'yes please',selected_product_ids,follow_up:first.follow_up},env);
  expect(next.answer_mode).toBe('prepared_answer');expect(next.message).toMatch(/roll/i);expect(generateContent).not.toHaveBeenCalled();
 });
 it('answers yes with a distinct useful follow-up for every product usage answer',async()=>{
  for(const p of products){
   const first=await answerChat({message:'How do I use this product?',selected_product_ids:[p.id]},env);
   expect(first.follow_up,p.id).toBe('routine');
   const next=await answerChat({message:'Yes',selected_product_ids:[p.id],follow_up:first.follow_up},env);
   expect(next.status,p.id).toBe('answered');
   expect(next.selected_product_ids,p.id).toEqual([p.id]);
   expect(next.message,p.id).not.toBe(first.message);
   expect(next.message,p.id).not.toMatch(/could you tell me a little more|would you like help fitting/i);
  }
  expect(generateContent).not.toHaveBeenCalled();
 });
 it('handles the underarm roll-on conversation through the public API',async()=>{
  const id='6-aha-bha-underarm-roll-on-flora-75ml';
  const first=await answerChat({message:'How do I use this product?',selected_product_ids:[id]},env);
  expect(first.message).toMatch(/tips for using it comfortably/i);
  const next=await answerChat({message:'yes please',selected_product_ids:[id],follow_up:first.follow_up},env);
  expect(next.message).toMatch(/freshly shaved skin/i);
 });
 it('answers frequency using catalogue facts rather than Gemini',async()=>{
  const result=await answerChat({message:'How often should I use it?',selected_product_ids:['4-aha-bha-underarm-rollon-frag-free-75']},env);
  expect(result.message).toMatch(/daily/i);expect(result.selected_product_ids).toEqual(['4-aha-bha-underarm-rollon-frag-free-75']);expect(generateContent).not.toHaveBeenCalled();
 });
});
