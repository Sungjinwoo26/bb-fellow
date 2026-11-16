import {describe,it,expect} from 'vitest';
import {selectProducts,deterministicComparison,cardsFor,distinctProductSizes} from '../worker/recommendationPipeline';
import {catalogue} from '../worker/catalogue';
import {initialChatState} from '../src/shared/chatState';
import {answerChat} from '../worker/productChat';

describe('controlled product pipeline',()=>{
 it('does not recommend the same formula in multiple sizes',()=>{
  expect(distinctProductSizes([{name:'1% Salicylic Acid Body Wash - 250 mL'},{name:'1% Salicylic Acid Body Wash - 700 ml'},{name:'1% Salicylic Ceramide Body Wash'}]).map(p=>p.name)).toEqual(['1% Salicylic Acid Body Wash - 250 mL','1% Salicylic Ceramide Body Wash']);
 });
 it('does not repeat duplicate reference pages for the same product',()=>{
  expect(distinctProductSizes([{name:'Triple Milk Deep Hydrating Body Wash — reference page A'},{name:'Triple Milk Deep Hydrating Body Wash — reference page B'}])).toHaveLength(1);
 });
 it('prioritises bleeding over product search',async()=>{
  const r=await answerChat({message:'My underarms are bleeding after an acid roll on, should I use more?',input_source:'button'},{});
  expect(r.message).toMatch(/stop using/i);expect(r.product_cards).toHaveLength(0);
 });
 it('does not return a fragranced product for a short no-perfume request',async()=>{
  const r=await answerChat({message:'body smell armpit roll on no perfume please',input_source:'button'},{});
  for(const card of r.product_cards){const p=catalogue.find(x=>x.id===card.id)!;expect(p.full_ingredients).toBeTruthy();expect(p.full_ingredients).not.toMatch(/fragrance|parfum|perfume/i);}
 });
 it('applies body wash, body area and ingredient exclusion before ranking',()=>{
  const decision=selectProducts('I need a body wash for dry body skin without fragrance',initialChatState());
  expect(decision.eligible.every(p=>/body\s*wash/i.test(p.name))).toBe(true);
  expect(decision.eligible.every(p=>p.full_ingredients&&!/\b(fragrance|parfum|perfume)\b/i.test(p.full_ingredients))).toBe(true);
  expect(decision.excluded.some(p=>p.reasons.includes('format'))).toBe(true);
 });
 it('does not offer postpartum products without relevant context',()=>{
  const d=selectProducts('show me a hair serum',initialChatState());
  expect(d.eligible.every(p=>!/post.?pregnan|postpartum/i.test(p.name))).toBe(true);
 });
 it('compares two specified products including both prices and correct links',async()=>{
  const ids=['1-salicylic-acid-body-wash-350ml','salicylic-ceramide-bodywash'];
  const r=await answerChat({message:'Compare these products and tell me both prices',selected_product_ids:ids,input_source:'button'},{});
  expect(r.message).toContain(catalogue.find(p=>p.id===ids[0])!.name);
  expect(r.message).toContain(catalogue.find(p=>p.id===ids[1])!.name);
  expect((r.message.match(/Catalogue price:/g)??[])).toHaveLength(2);
  expect(r.product_cards.map(c=>c.id)).toEqual(ids);
  expect(r.product_cards.map(c=>c.url)).toEqual(ids.map(id=>catalogue.find(p=>p.id===id)!.source_url));
 });
 it('does not invent a winner when evidence is unavailable',()=>{
  const pair=catalogue.filter(p=>['1-salicylic-acid-body-wash-350ml','salicylic-ceramide-bodywash'].includes(p.id));
  expect(deterministicComparison(pair,'Which is better?')).toMatch(/does not establish which is better/i);
  expect(cardsFor(pair)).toHaveLength(2);
 });
});
