import { concerns, canonicalConcerns, type ConcernId } from '../data/concerns';
import { questions } from '../data/questions';
import type { AnswerValue } from './session';

export function getActiveQuestions(selected: ConcernId[], answers: Record<string, AnswerValue> = {}) {
 const active=canonicalConcerns(selected);
 const streamlined=['body_acne_marks','strawberry_bumpy_skin','body_pigmentation','body_odour','general_body_care'];
 const result=active.flatMap(id=>questions.filter(q=>{
  if(q.id==='shared_pregnancy')return false;
  if(q.concernId!==id)return false;
  if(id==='underarm_pigmentation')return q.id==='underarm_concerns'||(q.id==='underarm_irritation'&&Array.isArray(answers.underarm_concerns)&&answers.underarm_concerns.includes('pigmentation'));
  if(id==='tanning_sun_damage')return q.id==='sun_areas';
  if(id==='hair'){
   const goals=Array.isArray(answers.hair_concerns_new)?answers.hair_concerns_new:[];
   if(q.id==='hair_concerns_new')return true;
   if(q.id==='hair_fall_details')return goals.includes('fall');
   if(q.id==='hair_age')return goals.includes('fall')&&Array.isArray(answers.hair_fall_details)&&answers.hair_fall_details.some(x=>x==='thinning'||x==='hairline');
   if(q.id==='hair_flake_details')return goals.includes('flakes');
   if(q.id==='hair_length_details')return goals.includes('dry')||goals.includes('damage');
   return false;
  }
  if(id==='face') {
   const goals=Array.isArray(answers.face_goal)?answers.face_goal:[];
   if(q.id==='face_goal')return true;
   if(q.id==='face_breakout_pattern')return goals.includes('acne_or_bumps');
   if(q.id==='face_skin_type')return goals.includes('acne_or_bumps') && answers.face_breakout_pattern==='occasional';
   return false;
  }
  if(!streamlined.includes(id))return true;
  if(id==='body_acne_marks')return q.id==='body_acne_goal'||q.id==='shared_body_skin';
  if(id==='strawberry_bumpy_skin')return q.id==='bumpy_pigmentation_same_area' && active.includes('body_pigmentation');
  if(id==='general_body_care')return q.id==='body_care_goal';
  return false;
 }));
 const sun=active.includes('tanning_sun_damage')&&Array.isArray(answers.sun_areas)&&answers.sun_areas.includes('face');
 const hair=active.includes('hair')&&Array.isArray(answers.hair_fall_details)&&answers.hair_fall_details.some(x=>x==='thinning'||x==='hairline');
 const underarm=active.includes('underarm_pigmentation')&&Array.isArray(answers.underarm_concerns)&&answers.underarm_concerns.includes('pigmentation');
 if(underarm||sun||hair)result.push({...questions.find(q=>q.id==='shared_pregnancy')!,concernId:active.at(-1)!});
 return result;
}
export function getActiveAnswers(selected: ConcernId[], answers: Record<string, AnswerValue>) { const active=getActiveQuestions(selected,answers); return Object.fromEntries(active.filter(q=>Object.hasOwn(answers,q.id)).map(q=>[q.id,answers[q.id]])); }
export function questionIndex(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) { return getActiveQuestions(selected,answers).findIndex(q => q.id === id); }
export function previousQuestion(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) { return getActiveQuestions(selected,answers)[questionIndex(selected, id, answers) - 1]; }
export function nextQuestion(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) { return getActiveQuestions(selected,answers)[questionIndex(selected, id, answers) + 1]; }
// Fixed question positions reserve room for conditional follow-ups before the
// answers that reveal them are known. No question count is presented to users.
const progressSlots: Record<ConcernId,string[]> = {
 body_acne_marks:['body_acne_goal','shared_body_skin'],
 strawberry_bumpy_skin:['bumpy_pigmentation_same_area'],
 body_pigmentation:[], underarm_pigmentation:['underarm_concerns','underarm_irritation'],
 body_odour:[], tanning_sun_damage:['sun_areas'], general_body_care:['body_care_goal'],
 face:['face_goal','face_breakout_pattern','face_skin_type'],
 hair:['hair_concerns_new','hair_fall_details','hair_age','hair_flake_details','hair_length_details'],
};
export function questionProgress(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) {
  const active = getActiveQuestions(selected,answers); const current = active.find(q => q.id === id);
  if (!current) return null;
  const selectedOrdered = canonicalConcerns(selected); const group = active.filter(q => q.concernId === current.concernId);
  const groupIndex=selectedOrdered.indexOf(current.concernId);const slots=progressSlots[current.concernId];
  // The shared follow-up is always last, after all selected concern questions.
  const slot=id==='shared_pregnancy'?slots.length:Math.max(0,slots.indexOf(id));
  const capacity=Math.max(1,slots.length+(groupIndex===selectedOrdered.length-1?1:0));
  const fraction=Math.min(.99,(groupIndex+slot/capacity)/selectedOrdered.length);
  return { concernIndex: groupIndex + 1, concernTotal: selectedOrdered.length, concernLabel: concerns.find(c => c.id === current.concernId)!.label, questionIndex: group.findIndex(q => q.id === id) + 1, questionTotal: group.length, overallIndex: active.indexOf(current) + 1, overallTotal: active.length, fraction };
}
