import { canonicalConcerns, type ConcernId } from '../data/concerns';
import { questions } from '../data/questions';
import { getActiveQuestions, nextQuestion, previousQuestion } from './sequence';
import type { AssessmentSession, AssessmentStep, PhotoAreaStatus } from './session';
import { getPhotoAreas } from '../utils/photoAreas';
import type { PhotoAreaId } from '../data/photoAreas';
export type AssessmentAction =
 | { type: 'toggleConcern'; id: ConcernId }
 | { type: 'toggleOption'; questionId: string; optionId: string }
 | { type: 'withoutAnalysis' } | { type: 'reviewFinished' } | { type: 'photoStatus'; areaId: PhotoAreaId; status: PhotoAreaStatus } | { type: 'withoutPhotos' } | { type: 'photoStart' }
 | { type: 'continue' } | { type: 'skip' } | { type: 'back' } | { type: 'navigate'; step: AssessmentStep };
export function assessmentReducer(s: AssessmentSession, action: AssessmentAction): AssessmentSession {
  if (action.type === 'toggleConcern') {
    const selectedConcerns = canonicalConcerns(s.selectedConcerns.includes(action.id) ? s.selectedConcerns.filter(id => id !== action.id) : [...s.selectedConcerns, action.id]);
    const valid = getPhotoAreas(selectedConcerns).map(a => a.id);
    const photoStatuses = Object.fromEntries(Object.entries(s.photoStatuses).filter(([id]) => valid.includes(id as PhotoAreaId)));
    return { ...s, selectedConcerns, photoStatuses, photosBypassed:false };
  }
  if (action.type === 'photoStatus') return { ...s, photoReviewed:false, photoStatuses: { ...s.photoStatuses, [action.areaId]: action.status } };
  const areas = getPhotoAreas(s.selectedConcerns);
  const firstQuestion = getActiveQuestions(s.selectedConcerns)[0];
  const questionStep: AssessmentStep = firstQuestion ? { name:'question', questionId:firstQuestion.id } : { name:'concerns' };
  if (action.type === 'withoutAnalysis') return { ...s, photosBypassed:true, photoReviewed:false, currentStep:questionStep };
  if (action.type === 'reviewFinished') return { ...s, photoReviewed:true, currentStep:questionStep };
  if (action.type === 'withoutPhotos') return { ...s, photoStatuses:Object.fromEntries(areas.map(a => [a.id, 'skipped'])), photosBypassed:true, photoReviewed:false, currentStep:questionStep };
  if (action.type === 'photoStart') return areas.length ? { ...s, photosBypassed:false, currentStep:{name:'photo_area',areaId:areas[0].id} } : s;
  if (action.type === 'navigate') return { ...s, currentStep: action.step };
  if (action.type === 'toggleOption') {
    const q = questions.find(q => q.id === action.questionId);
    if (!q || !s.selectedConcerns.includes(q.concernId) || !q.options.some(o => o.id === action.optionId)) return s;
    const previous = s.answers[q.id];
    if (q.type === 'single') return { ...s, answers: { ...s.answers, [q.id]: action.optionId } };
    const selected = Array.isArray(previous) ? previous : [];
    const ids = selected.includes(action.optionId) ? selected.filter(id => id !== action.optionId) : [...selected, action.optionId];
    const answers = { ...s.answers }; const ordered = q.options.filter(o => ids.includes(o.id)).map(o => o.id);
    if (ordered.length) answers[q.id] = ordered; else delete answers[q.id];
    return { ...s, answers };
  }
  const step = s.currentStep;
  if (action.type === 'back') {
    if (step.name === 'next_step_placeholder') { const last = getActiveQuestions(s.selectedConcerns).at(-1); return { ...s, currentStep: last ? { name: 'question', questionId: last.id } : { name: 'concerns' } }; }
    if (step.name === 'photo_analysis') { const last = areas.at(-1); return { ...s, currentStep:last ? {name:'photo_area',areaId:last.id} : {name:'concerns'} }; }
    if (step.name === 'photo_preparation') return { ...s, currentStep:{name:'concerns'} };
    if (step.name === 'photo_area') { const index = areas.findIndex(a => a.id === step.areaId); return { ...s, currentStep: index > 0 ? {name:'photo_area',areaId:areas[index-1].id} : {name:'photo_preparation'} }; }
    if (step.name === 'question') { const prev = previousQuestion(s.selectedConcerns, step.questionId); const lastArea = areas.at(-1); return { ...s, currentStep: prev ? { name: 'question', questionId: prev.id } : lastArea ? (s.photoReviewed ? {name:'photo_analysis'} : s.photosBypassed ? {name:'photo_preparation'} : {name:'photo_area',areaId:lastArea.id}) : { name: 'concerns' } }; }
    return s;
  }
  if (step.name === 'concerns' && action.type === 'continue') return firstQuestion ? { ...s, photosBypassed:false, currentStep:areas.length ? {name:'photo_preparation'} : questionStep } : s;
  if (step.name === 'photo_area' && (action.type === 'continue' || action.type === 'skip')) {
    if (action.type === 'continue' && s.photoStatuses[step.areaId] !== 'added') return s;
    const index = areas.findIndex(a => a.id === step.areaId); if (index < 0) return s;
    const next = areas[index + 1];
    const hasPhotos = Object.values(s.photoStatuses).some(status => status === 'added');
    return { ...s, photosBypassed: !next && !hasPhotos ? true : s.photosBypassed, photoStatuses:action.type === 'skip' ? {...s.photoStatuses,[step.areaId]:'skipped'} : s.photoStatuses, currentStep:next ? {name:'photo_area',areaId:next.id} : hasPhotos ? {name:'photo_analysis'} : questionStep };
  }
  if (step.name === 'question' && (action.type === 'continue' || action.type === 'skip')) {
    const answer = s.answers[step.questionId];
    if (action.type === 'continue' && (answer == null || (Array.isArray(answer) && !answer.length))) return s;
    const next = nextQuestion(s.selectedConcerns, step.questionId);
    return { ...s, answers: action.type === 'skip' ? { ...s.answers, [step.questionId]: null } : s.answers, currentStep: next ? { name: 'question', questionId: next.id } : { name: 'next_step_placeholder' } };
  }
  return s;
}
