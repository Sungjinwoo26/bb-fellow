import { concerns, canonicalConcerns, type ConcernId } from '../data/concerns';
import { questions } from '../data/questions';
import type { AnswerValue } from './session';

export function getActiveQuestions(selected: ConcernId[], answers: Record<string, AnswerValue> = {}) {
 const active=canonicalConcerns(selected);
 const streamlined=['body_acne_marks','strawberry_bumpy_skin','body_pigmentation','body_odour','general_body_care'];
 return active.flatMap(id=>questions.filter(q=>{
  if(q.concernId!==id)return false;
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
}
export function getActiveAnswers(selected: ConcernId[], answers: Record<string, AnswerValue>) { const active=getActiveQuestions(selected,answers); return Object.fromEntries(active.filter(q=>Object.hasOwn(answers,q.id)).map(q=>[q.id,answers[q.id]])); }
export function questionIndex(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) { return getActiveQuestions(selected,answers).findIndex(q => q.id === id); }
export function previousQuestion(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) { return getActiveQuestions(selected,answers)[questionIndex(selected, id, answers) - 1]; }
export function nextQuestion(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) { return getActiveQuestions(selected,answers)[questionIndex(selected, id, answers) + 1]; }
export function questionProgress(selected: ConcernId[], id: string, answers: Record<string, AnswerValue> = {}) {
  const active = getActiveQuestions(selected,answers); const current = active.find(q => q.id === id);
  if (!current) return null;
  const selectedOrdered = canonicalConcerns(selected); const group = active.filter(q => q.concernId === current.concernId);
  return { concernIndex: selectedOrdered.indexOf(current.concernId) + 1, concernTotal: selectedOrdered.length, concernLabel: concerns.find(c => c.id === current.concernId)!.label, questionIndex: group.findIndex(q => q.id === id) + 1, questionTotal: group.length, overallIndex: active.indexOf(current) + 1, overallTotal: active.length };
}
