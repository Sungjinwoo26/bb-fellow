import { describe, expect, it } from 'vitest';
import { configuredData,generateRecommendations,validateInput,recommendationsRoute,catalogueRoute,matches, type RuleSet } from '../worker/recommendations';
import type { RecommendationRequest } from '../src/shared/recommendations';
const data=configuredData()!;
const base:RecommendationRequest={sessionId:'test',selectedConcerns:['underarm_pigmentation','body_odour'],answers:{underarm_goal:'mild',odour_location:'underarms'},confirmedPhotoSelections:[]};
const generate=(input:RecommendationRequest)=>generateRecommendations(input,data.catalogue,data.rules);
const post=(value:unknown)=>new Request('https://example.test/api/recommendations',{method:'POST',headers:{'Content-Type':'application/json'},body:typeof value==='string'?value:JSON.stringify(value)});
describe('recommendation engine',()=>{
 it('merges a shared product and preserves both reasons and canonical concerns',()=>{const r=generate(base);expect(r.items).toHaveLength(1);expect(r.items[0]).toMatchObject({product:{id:'demo_underarm_roll_on'},quantity:1,matchedConcernIds:['underarm_pigmentation','body_odour']});expect(r.items[0].reasons).toHaveLength(2);expect(r.unmatchedConcernIds).toEqual([]);expect(r).not.toHaveProperty('discount');});
 it('returns distinct products in canonical order and no invented match',()=>{const r=generate({...base,selectedConcerns:['hair','body_acne_marks'],answers:{hair_goal:['hairline_concerns'],body_acne_goal:'active_bumps'}});expect(r.items.map(x=>x.product.id)).toEqual(['demo_sa_body_wash']);expect(r.unmatchedConcernIds).toEqual(['hair']);});
 it('matches only explicit answers and confirmed photo choices',()=>{
  const photo:RecommendationRequest={...base,selectedConcerns:['body_acne_marks'],answers:{body_acne_goal:'not_sure'},confirmedPhotoSelections:[{areaId:'affected_body',selectedOptionIds:['visible_bumps'],notSure:false,source:'user_confirmed_photo_review'}]};expect(generate(photo).items[0].product.id).toBe('demo_sa_body_wash');
  expect(generate({...photo,confirmedPhotoSelections:[]}).items).toEqual([]);expect(generate({...photo,answers:{body_acne_goal:null},confirmedPhotoSelections:[]}).items).toEqual([]);
  expect(matches({type:'answer_contains_none',questionId:'sun_location',optionIds:['arms']},photo)).toBe(false);
 });
 it('prioritizes answer rules over photos and breaks ties alphabetically',()=>{
  const input:RecommendationRequest={...base,selectedConcerns:['body_acne_marks'],answers:{body_acne_goal:'both'},confirmedPhotoSelections:[{areaId:'affected_body',selectedOptionIds:['visible_bumps'],notSure:false,source:'user_confirmed_photo_review'}]};expect(generate(input).items[0].reasons[0]).toContain('mentioned');
  const baseRule=data.rules.rules.find(r=>r.id==='body_acne_answer_bumps')!;const altered:RuleSet={...data.rules,rules:[{...baseRule,id:'z_rule',productId:'demo_lactic_body_lotion'},{...baseRule,id:'a_rule'}]};expect(generateRecommendations(input,data.catalogue,altered).items[0].product.id).toBe('demo_sa_body_wash');
 });
 it('uses the face sunscreen only for face-only sun location',()=>{
  function sun(location:string[]|null,goal:string|null='patches'){return generate({...base,selectedConcerns:['tanning_sun_damage'],answers:{sun_goal:goal,...(location?{sun_location:location}:{})}}).items.map(x=>x.product.id);}
  expect(sun(['face'])).toEqual(['demo_face_sunscreen']);expect(sun(['arms'])).toEqual(['demo_body_sunscreen']);expect(sun(['face','arms'])).toEqual(['demo_body_sunscreen']);expect(sun(null)).toEqual(['demo_body_sunscreen']);expect(sun(['face'],null)).toEqual([]);
 });
 it('leaves painful bumps and dry body care unmatched without reviewed mappings',()=>{expect(generate({...base,selectedConcerns:['strawberry_bumpy_skin'],answers:{bumpy_goal:'rough_texture',bumpy_pain_itch:'yes'}}).items).toEqual([]);expect(generate({...base,selectedConcerns:['general_body_care'],answers:{body_care_goal:['hydration'],body_care_skin_feel:'dry'}}).items).toEqual([]);});
 it('includes a face-specific sample for selected acne or bumps',()=>{const r=generate({...base,selectedConcerns:['general_body_care','face'],answers:{body_care_goal:['hydration'],face_goal:['acne_or_bumps']}});expect(r.items.map(x=>x.product.id)).toEqual(['demo_urea_body_lotion','demo_face_cleanser']);expect(r.unmatchedConcernIds).toEqual([]);});
 it('excludes inactive products and pre-made kits',()=>{for(const change of [{active:false},{preMadeKit:true}]){const catalogue={...data.catalogue,products:data.catalogue.products.map(p=>p.id==='demo_underarm_roll_on'?{...p,...change}:p)};const r=generateRecommendations(base,catalogue,data.rules);expect(r.items).toEqual([]);expect(r.unmatchedConcernIds).toHaveLength(2);}});
});
describe('recommendation API validation',()=>{
 it('rejects invalid inputs including unrelated and duplicated selections',()=>{
  const bad=[{...base,selectedConcerns:['bad']},{...base,selectedConcerns:['body_odour','body_odour']},{...base,answers:{unknown:'x'}},{...base,answers:{hair_goal:['other']}},{...base,answers:{odour_location:'bad'}},{...base,selectedConcerns:['hair'],answers:{hair_goal:['other','other']}},{...base,selectedConcerns:['hair'],answers:{hair_goal:['bad']}},
   {...base,confirmedPhotoSelections:[{areaId:'unknown',selectedOptionIds:[],notSure:false,source:'user_confirmed_photo_review'}]},
   {...base,confirmedPhotoSelections:[{areaId:'underarms',selectedOptionIds:['visible_bumps'],notSure:false,source:'user_confirmed_photo_review'}]},
   {...base,confirmedPhotoSelections:[{areaId:'underarms',selectedOptionIds:['visible_marks'],notSure:true,source:'user_confirmed_photo_review'}]},
   {...base,confirmedPhotoSelections:[{areaId:'underarms',selectedOptionIds:[],notSure:false,source:'model'}]},
   {...base,confirmedPhotoSelections:[{areaId:'underarms',selectedOptionIds:[],notSure:false,source:'user_confirmed_photo_review'},{areaId:'underarms',selectedOptionIds:[],notSure:false,source:'user_confirmed_photo_review'}]}];
  for(const value of bad)expect(validateInput(value).value).toBeNull();
 });
 it('handles JSON, size, validation and valid no-match requests',async()=>{
  expect((await recommendationsRoute(post('{'))).status).toBe(400);expect((await recommendationsRoute(post('x'.repeat(32769)))).status).toBe(413);
  expect((await recommendationsRoute(post({...base,answers:{bad:'x'}}))).status).toBe(422);
  const r=await recommendationsRoute(post({...base,selectedConcerns:['hair'],answers:{hair_goal:['hairline_concerns']}}));expect(r.status).toBe(200);expect(await r.json()).toMatchObject({items:[],unmatchedConcernIds:['hair']});
  const c=await catalogueRoute().json() as {products:Record<string,unknown>[]}; expect(c.products).toHaveLength(11);expect(c.products[0]).not.toHaveProperty('active');
 });
});
