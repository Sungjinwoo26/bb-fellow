import {describe,it,expect} from 'vitest';
import {initialChatState} from '../src/shared/chatState';
import {supportedCombinedKit} from '../worker/combinedConcerns';
import {advanceState} from '../worker/chatState';
import {combinedHairCandidates} from '../worker/hairChatDecision';

describe('combined concern selection',()=>{
 it('finds a body kit only when its stated purpose covers both concerns',()=>{
  const state={...initialChatState(),areas:['underarm'],concerns:['underarm odour']};
  const kit=supportedCombinedKit(state,state.concerns,['pigmentation']);
  expect(kit).toBeTruthy();expect(kit!.purpose).toMatch(/odou?r/i);expect(kit!.purpose).toMatch(/pigmentation/i);expect(kit!.purpose).not.toMatch(/severe/i);
 });
 it('does not use a kit when a product-format constraint excludes it',()=>{
  const state={...initialChatState(),areas:['underarm'],requested_product_type:'roll on'};
  expect(supportedCombinedKit(state,['underarm odour'],['pigmentation'])).toBeNull();
 });
 it('keeps both non-hair concerns when a new one is explicitly added',()=>{
  const state={...initialChatState(),areas:['underarm'],concerns:['odour']};
  const result={message:'Here is an option.',status:'answered',selected_product_ids:[],product_options:[]};
  const turn={action:'find_product' as const,reference_scope:'none' as const,referenced_products:[],product_types:[],concerns:['pigmentation'],concern_relation:'add' as const,body_areas:['underarm'],excluded_ingredients:[],intents:[],missing_information:[],confidence:'high' as const};
  expect(advanceState(state,'and pigmentation',[],[],result,[],turn).state.concerns).toEqual(expect.arrayContaining(['odour','pigmentation']));
 });
 it('keeps ingredient exclusions when choosing combined hair options',()=>{
  const state={...initialChatState(),areas:['hair'],excluded_ingredients:['fragrance'],hair_context:{observed:['flakes','shedding'] as ('flakes'|'shedding')[],focus:null,flakes:'yes' as const}};
  const turn={action:'find_product' as const,reference_scope:'none' as const,referenced_products:[],product_types:[],concerns:['hair fall'],hair_concerns:['shedding'] as const,body_areas:['hair'],excluded_ingredients:['fragrance'],intents:[],missing_information:[],confidence:'high' as const};
  const result=combinedHairCandidates(state,{...turn,hair_concerns:[...turn.hair_concerns]});
  for(const p of result){expect(p.full_ingredients).toBeTruthy();expect(p.full_ingredients).not.toMatch(/\b(?:fragrance|parfum|perfume)\b/i);}
 });
});
