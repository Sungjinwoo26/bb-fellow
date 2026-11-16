import {describe,it,expect} from 'vitest';
import {assessmentChatProducts,assessmentNextQuestion} from '../worker/assessmentChat';
import {initialChatState} from '../src/shared/chatState';
const state=initialChatState();
describe('assessment to chat catalogue bridge',()=>{
 it('maps an assessment face concern to the linked catalogue product',()=>{const r=assessmentChatProducts(['face'],{face_goal:['individual_spots']},state);expect(r.products.map(p=>p.id)).toContain('hydrocolloid-acne-pimple-patch')});
 it('uses the assessment conditions for hair thinning rather than inventing missing safety answers',()=>{const answers={hair_concerns_new:['fall'],hair_fall_details:['thinning']};expect(assessmentChatProducts(['hair'],answers,state).products).toHaveLength(0);const complete=assessmentChatProducts(['hair'],{...answers,hair_age:'yes',shared_pregnancy:'no'},state);expect(complete.products.map(p=>p.id)).toContain('advanced-hair-growth-serum')});
 it('maps body acne and body sun protection using the assessment answers',()=>{expect(assessmentChatProducts(['body_acne_marks'],{body_acne_goal:'active_bumps'},state).products.map(p=>p.id)).toContain('1-salicylic-acid-body-wash-350ml');expect(assessmentChatProducts(['tanning_sun_damage'],{sun_areas:['body']},state).products.map(p=>p.id)).toContain('body-sunscreen-lotion-with-spf-50')});
 it('does not suggest a question when none of its immediate answers changes a result',()=>{expect(assessmentNextQuestion(['face'],{face_goal:['individual_spots']},state)).toBeNull()});
 it('respects a prior rejected product',()=>{const rejected={...state,rejected_product_ids:['hydrocolloid-acne-pimple-patch']};expect(assessmentChatProducts(['face'],{face_goal:['individual_spots']},rejected).products).toHaveLength(0)});
});
