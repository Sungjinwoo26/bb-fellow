import {describe,it,expect} from 'vitest';
import {hairChatCandidates} from '../worker/hairChatDecision';
import {initialChatState,type ChatTurn} from '../src/shared/chatState';
const base:ChatTurn={action:'find_product',reference_scope:'none',referenced_products:[],product_types:[],concerns:[],body_areas:['hair'],excluded_ingredients:[],intents:[],missing_information:[],confidence:'high'};
describe('chat-specific catalogue hair suggestions',()=>{
 it('suggests a product with relevant catalogue evidence',()=>{const result=hairChatCandidates(initialChatState(),{...base,hair_concerns:['shedding']});expect(result.length).toBeGreaterThan(0);expect(result.every(x=>/hair fall|hairfall|hair shedding/i.test(`${x.product.name} ${x.product.purpose}`))).toBe(true);expect(result.every(x=>x.source_url===x.product.source_url)).toBe(true)});
 it('does not guess what ambiguous fine hair needs',()=>expect(hairChatCandidates(initialChatState(),{...base,hair_concerns:['fine_hair']})).toHaveLength(0));
 it('respects the requested format and product exclusions',()=>{const state={...initialChatState(),requested_product_type:'shampoo',rejected_product_ids:['hair-fall-control-shampoo']};expect(hairChatCandidates(state,{...base,hair_concerns:['shedding']}).every(x=>/shampoo/i.test(x.product.name)&&x.product.id!=='hair-fall-control-shampoo')).toBe(true)});
 it('uses the requested focus without deleting reported flakes',()=>{const state={...initialChatState(),hair_context:{observed:['thinning','flakes'] as const,focus:'thinning' as const,flakes:'yes' as const}};const result=hairChatCandidates({...state,hair_context:{...state.hair_context,observed:[...state.hair_context.observed]}},base);expect(result.every(x=>x.reason==='hair_thinning')).toBe(true)});
 it('returns at most one option for a single concern and covers both reported concerns when possible',()=>{const thinning=hairChatCandidates(initialChatState(),{...base,hair_concerns:['thinning']});expect(thinning.length).toBeLessThanOrEqual(1);const both=hairChatCandidates(initialChatState(),{...base,hair_concerns:['thinning','flakes']});expect(both.map(x=>x.reason)).toEqual(['scalp_flakes','hair_thinning']);});
});
