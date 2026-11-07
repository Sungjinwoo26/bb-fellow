import { describe, expect, it } from 'vitest';
import { getActiveQuestions } from '../src/app/sequence';
import { configuredData, generateRecommendations } from '../worker/recommendations';
import type { RecommendationRequest } from '../src/shared/recommendations';

const data=configuredData()!;
function run(selectedConcerns:RecommendationRequest['selectedConcerns'],answers:RecommendationRequest['answers']={}) {return generateRecommendations({sessionId:'test',selectedConcerns,answers,confirmedPhotoSelections:[]},data.catalogue,data.rules);}
describe('streamlined concern paths',()=>{
 it('does not ask questions for odour or pigmentation alone',()=>{expect(getActiveQuestions(['body_odour','body_pigmentation'])).toEqual([]);});
 it('asks the overlapping area question once only when both concerns are selected',()=>{expect(getActiveQuestions(['strawberry_bumpy_skin','body_pigmentation']).map(q=>q.id)).toEqual(['bumpy_pigmentation_same_area']);expect(getActiveQuestions(['strawberry_bumpy_skin'])).toEqual([]);});
 it('routes acne with dry skin and merges overlapping bumpy concern',()=>{const r=run(['body_acne_marks','strawberry_bumpy_skin'],{body_acne_goal:'active_bumps',shared_body_skin:'dry'});expect(r.items.map(i=>i.product.id)).toEqual(['demo_ceramide_body_wash']);expect(r.items[0].matchedConcernIds).toHaveLength(2);});
 it('merges same-area pigmentation and bumps into one kit',()=>{const r=run(['body_pigmentation','strawberry_bumpy_skin'],{bumpy_pigmentation_same_area:'yes'});expect(r.items.map(i=>i.product.id)).toEqual(['demo_exfoliation_pigmentation_kit']);expect(r.items[0].matchedConcernIds).toHaveLength(2);});
 it('combines all selected general-care outputs',()=>{const r=run(['general_body_care'],{body_care_goal:['hydration','dry_feet_or_heels','stretch_marks']});expect(r.items.map(i=>i.product.id)).toEqual(['demo_urea_body_lotion','demo_urea_foot_roll_on','demo_stretch_mark_serum']);});
});
