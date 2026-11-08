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
 });
 it('serves every unique comparison without calling Gemini, regardless of order',async()=>{
  for(let i=0;i<products.length;i++)for(let j=i+1;j<products.length;j++){
   const ids=[products[j].id,products[i].id];const result=await answerChat({message:'Compare two products.',selected_product_ids:ids,selection_confirmed:true},env);
   expect(result.answer_mode,ids.join(' / ')).toBe('prepared_answer');expect(result.selected_product_ids).toEqual(ids);
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
 it('calls Gemini for a specific custom question not answered by the prepared routine',async()=>{
  generateContent.mockResolvedValue({text:'Use it daily.',candidates:[{finishReason:'STOP'}]});
  const result=await answerChat({message:'How often should I use it?',selected_product_ids:['4-aha-bha-underarm-rollon-frag-free-75']},env);
  expect(result.answer_mode).toBe('ai');expect(generateContent).toHaveBeenCalledOnce();
 });
});
