import { describe, expect, it } from 'vitest';
import { answerChat } from '../worker/productChat';
import products from '../worker/data/chatProducts.json';

describe('catalogue browsing and concern suggestions',()=>{
 it('pages through the complete catalogue without an AI call or duplicates',async()=>{
  const first=await answerChat({message:'list all your products',input_source:'typed'},{});
  expect(first).toHaveProperty('catalogue',true);expect(first.message).toContain(`of ${products.length}`);
  const ids:string[]=[];let page=first as typeof first & {catalogue_next?:{category:'all';offset:number}};
  while(true){ids.push(...page.product_options.map(p=>p.id));if(!page.catalogue_next)break;page=await answerChat({message:'Show more products',catalogue_cursor:page.catalogue_next,input_source:'button'}, {}) as typeof page;}
  expect(ids).toHaveLength(products.length);expect(new Set(ids).size).toBe(products.length);
 });
 it.each(['show all products','show face care products','show hair care products','show body care products','show face wash products','show body wash products'])('returns to the previous page in %s',async message=>{
  const first=await answerChat({message,input_source:'typed'},{});const a=first as any;
  expect(a.catalogue).toBe(true);expect(a.catalogue_previous).toBeUndefined();
  if(!a.catalogue_next)return;
  const second=await answerChat({message:'Show more products',input_source:'button',catalogue_cursor:a.catalogue_next},{});const b=second as any;
  expect(b.catalogue_previous).toEqual({category:a.catalogue_next.category,offset:0});
  const back=await answerChat({message:'Previous products',input_source:'button',catalogue_cursor:b.catalogue_previous},{});expect(back.product_options.map(p=>p.id)).toEqual(first.product_options.map(p=>p.id));expect((back as any).catalogue_previous).toBeUndefined();
 });
 it('starts product discovery with tappable care categories',async()=>{const r=await answerChat({message:'Find a product for my concern',input_source:'button'},{});expect((r as any).choices).toContain('Face care');expect((r as any).choices).toContain('Hair care')});
 it('filters product types and does not misinterpret inventory questions',async()=>{
  const wash=await answerChat({message:'show face wash products',input_source:'typed'},{});
  expect(wash.product_options.length).toBeGreaterThan(0);expect(wash.product_options.every(p=>/face\s*wash/i.test(p.name))).toBe(true);
  const stock=await answerChat({message:'how much is in the inventory',input_source:'typed'},{});expect(stock).not.toHaveProperty('catalogue',true);
 });
 it('corrects a prior incomplete catalogue list',async()=>{
  const result=await answerChat({message:'only two?',input_source:'typed',history:[{role:'user',text:'list all your products'},{role:'assistant',text:'There are two.'}]},{});
  expect(result.message).toContain(`of ${products.length}`);
 });
 it.each(['I have pimples','I have hair fall'])('offers three linked options and a useful question for %s',async(message)=>{
  const result=await answerChat({message,input_source:'typed'},{});
  expect(result).toHaveProperty('recommendations');const r=result as typeof result & {recommendations:{id:string}[];choices:string[]};
  expect(r.recommendations).toHaveLength(3);expect(new Set(r.recommendations.map(p=>p.id)).size).toBe(3);expect(r.message).toContain('?');expect(r.choices.length).toBeGreaterThan(1);expect(r.selected_product_ids).toEqual(r.recommendations.map(p=>p.id));
 });
 it.each([
  ['I have strawberry legs','5-lactic-acid-body-lotion','Body lotion'],
  ['What products for body acne?','salicylic-ceramide-bodywash','Yes'],
  ['I have body pigmentation','pigmentation-repair-cream','Cream'],
  ['I have underarm pigmentation','advanced-underarm-pigmentation-kit','Underarm care kit'],
  ['I have body odor','6-aha-bha-underarm-roll-on-flora-75ml','Underarm roll-on']
 ])('offers relevant products and narrows %s',async(message,id,choice)=>{
  const first=await answerChat({message,input_source:'typed'},{});
  const a=first as typeof first & {recommendations:{id:string}[];choices:string[]};
  expect(a.answer_mode).toBe('prepared_answer');expect(a.recommendations.length).toBeGreaterThanOrEqual(2);expect(a.recommendations.length).toBeLessThanOrEqual(3);expect(a.choices).toContain(choice);expect(a.message).toContain('?');expect(a.selected_product_ids).toEqual(a.recommendations.map(p=>p.id));
  const next=await answerChat({message:choice,input_source:'typed',history:[{role:'user',text:message},{role:'assistant',text:first.message.slice(0,400)}]},{});
  expect(next.selected_product_ids).toEqual([id]);expect((next as typeof next & {recommendations:{id:string}[]}).recommendations[0].id).toBe(id);
 });
 it.each([
  ['I have pimples','Oily','2-salicylic-acid-face-wash'],
  ['I have hair fall','Yes','dandruff-and-hairfall-kit'],
  ['I have hair fall','No','hair-growth-serum-roll-on']
 ])('narrows %s with one useful answer',async(message,choice,id)=>{
  const first=await answerChat({message,input_source:'typed'},{});
  const next=await answerChat({message:choice,input_source:'typed',selected_product_ids:first.selected_product_ids,history:[{role:'user',text:message},{role:'assistant',text:first.message}]},{});
  expect(next.selected_product_ids).toEqual([id]);
  expect((next as typeof next & { recommendations?: { id: string }[] }).recommendations?.map(p=>p.id)).toEqual([id]);
  expect(next.message).toContain('Would you like to know how to use it?');
 });
 it.each(['I have painful strawberry legs','I have a bleeding rash and body acne','I have an allergy and body odour'])('does not use a prepared recommendation for %s',async(message)=>{
  const result=await answerChat({message,input_source:'typed'},{});expect(result.answer_mode).not.toBe('prepared_answer');
 });
 it('uses distinct hair formats and the approved one-sentence descriptions',async()=>{
  const result=await answerChat({message:'hair fall',input_source:'typed'},{});
  const list=(result as typeof result & {recommendations:{id:string}[]}).recommendations;
  expect(list.map(p=>p.id)).toEqual(['hair-fall-control-shampoo','hair-growth-serum-roll-on','hair-health-gummies']);
  expect(result.message).toContain('Gently cleansing the hair and scalp');expect(result.message).toContain('biotin, zinc and multivitamins');
 });
 it.each(['hair fal','hair faill','hair falll','My hair drop drop'])('routes the common typo %s to the prepared hair flow',async(message)=>{
  const result=await answerChat({message,input_source:'typed'},{});expect(result.answer_mode).toBe('prepared_answer');expect((result as typeof result & {recommendations:{id:string}[]}).recommendations).toHaveLength(3);
 });
 it('does not shortcut allergy or severe symptom questions',async()=>{
  const r=await answerChat({message:'I have pimples and an allergy',input_source:'typed'},{});expect(r).not.toHaveProperty('recommendations');
 });
});
