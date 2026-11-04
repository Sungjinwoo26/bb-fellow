import { concerns, canonicalConcerns, type ConcernId } from '../data/concerns';
import { questions } from '../data/questions';
import type { AnswerValue } from './session';

export function getActiveQuestions(selected: ConcernId[]) { const active = canonicalConcerns(selected); return active.flatMap(id => questions.filter(q => q.concernId === id)); }
export function getActiveAnswers(selected: ConcernId[], answers: Record<string, AnswerValue>) { return Object.fromEntries(getActiveQuestions(selected).filter(q => Object.hasOwn(answers, q.id)).map(q => [q.id, answers[q.id]])); }
export function questionIndex(selected: ConcernId[], id: string) { return getActiveQuestions(selected).findIndex(q => q.id === id); }
export function previousQuestion(selected: ConcernId[], id: string) { return getActiveQuestions(selected)[questionIndex(selected, id) - 1]; }
export function nextQuestion(selected: ConcernId[], id: string) { return getActiveQuestions(selected)[questionIndex(selected, id) + 1]; }
export function questionProgress(selected: ConcernId[], id: string) {
  const active = getActiveQuestions(selected); const current = active.find(q => q.id === id);
  if (!current) return null;
  const selectedOrdered = canonicalConcerns(selected); const group = active.filter(q => q.concernId === current.concernId);
  return { concernIndex: selectedOrdered.indexOf(current.concernId) + 1, concernTotal: selectedOrdered.length, concernLabel: concerns.find(c => c.id === current.concernId)!.label, questionIndex: group.findIndex(q => q.id === id) + 1, questionTotal: group.length, overallIndex: active.indexOf(current) + 1, overallTotal: active.length };
}
