import { describe, expect, it } from 'vitest';
import { getActiveAnswers, getActiveQuestions } from '../src/app/sequence';
import { configuredData, generateRecommendations } from '../worker/recommendations';
import type { RecommendationRequest } from '../src/shared/recommendations';
const data=configuredData()!;
function run(answers:RecommendationRequest['answers'],selectedConcerns:RecommendationRequest['selectedConcerns']=['face']) {return generateRecommendations({sessionId:'test',selectedConcerns,answers,confirmedPhotoSelections:[]},data.catalogue,data.rules);}
describe('face assessment',()=>{
 it('asks only relevant follow-ups and removes stale answers',()=>{
  expect(getActiveQuestions(['face']).map(q=>q.id)).toEqual(['face_goal']);
  expect(getActiveQuestions(['face'],{face_goal:['acne_or_bumps']}).map(q=>q.id)).toEqual(['face_goal','face_breakout_pattern']);
  const answers={face_goal:['acne_or_bumps'],face_breakout_pattern:'occasional',face_skin_type:'oily'};
  expect(getActiveQuestions(['face'],answers).map(q=>q.id)).toEqual(['face_goal','face_breakout_pattern','face_skin_type']);
  expect(getActiveAnswers(['face'],{...answers,face_goal:['dryness']})).toEqual({face_goal:['dryness']});
 });
 it('routes breakout and skin-type branches',()=>{
  for(const [skin,id] of [['oily','demo_face_sa_2'],['dry','demo_face_sa_1'],['combination','demo_face_sa_1'],['normal','demo_face_sa_1']]) expect(run({face_goal:['acne_or_bumps'],face_breakout_pattern:'occasional',face_skin_type:skin}).items[0].product.id).toBe(id);
  expect(run({face_goal:['acne_or_bumps'],face_breakout_pattern:'persistent_painful'}).items[0].product.id).toBe('demo_face_bp_25');
  expect(run({face_goal:['acne_or_bumps']}).items).toEqual([]);
 });
 it('combines concerns without duplicate face sunscreen',()=>{
  const result=run({face_goal:['dryness','individual_spots','everyday_protection'],sun_goal:'patches',sun_location:['face']},['tanning_sun_damage','face']);
  expect(result.items.map(x=>x.product.id)).toEqual(['demo_face_sunscreen','demo_pimple_patch','demo_face_moisturizer']);
  expect(result.items[0].matchedConcernIds).toEqual(['tanning_sun_damage','face']);
 });
});
