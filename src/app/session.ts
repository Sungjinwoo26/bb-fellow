import { canonicalConcerns, type ConcernId } from '../data/concerns';
import { questions } from '../data/questions';
import { getActiveQuestions } from './sequence';
import { getPhotoAreas } from '../utils/photoAreas';
import type { PhotoAreaId } from '../data/photoAreas';
import type { RecommendationResult } from '../shared/recommendations';
import { recommendationSchema } from '../shared/recommendationSchema';
import { validStart } from '../utils/preparation';
import { kitRequestSchema, type KitState } from '../shared/kit';
export type AnswerValue = string | string[] | null;
export type PhotoAreaStatus = 'not_started' | 'added' | 'skipped' | 'needs_readding';
export type AssessmentStep = { name: 'concerns' } | { name: 'photo_preparation' } | { name: 'photo_area'; areaId: PhotoAreaId } | { name: 'photo_analysis' } | { name: 'question'; questionId: string } | { name: 'next_step_placeholder' };
export type PreparationState={startedAt:number;inputFingerprint:string;recommendation:RecommendationResult|null;containsPhotoChoices:boolean};
export type AssessmentSession = { schemaVersion: 1; sessionId: string; createdAt: string; currentStep: AssessmentStep; selectedConcerns: ConcernId[]; answers: Record<string, AnswerValue>; photoStatuses: Partial<Record<PhotoAreaId, PhotoAreaStatus>>; photosBypassed: boolean; photoReviewed?: boolean; preparation?:PreparationState|null; kit?:KitState|null };
export const SESSION_KEY = 'bb-find-my-routine:v1';
let memory: AssessmentSession | null = null;
let unavailable = false;
export function storageUnavailable() { return unavailable; }
export function normalizeSession(value: unknown, afterRefresh = false): AssessmentSession | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const s = value as Record<string, unknown>;
  if (s.schemaVersion !== 1 || typeof s.sessionId !== 'string' || !s.sessionId.trim() || typeof s.createdAt !== 'string' || Number.isNaN(Date.parse(s.createdAt))) return null;
  // Step 1 used the string "concerns" and had no selections or answers.
  const legacy = s.currentStep === 'concerns' && s.selectedConcerns === undefined && s.answers === undefined;
  if (!legacy && (!Array.isArray(s.selectedConcerns) || !s.answers || typeof s.answers !== 'object' || Array.isArray(s.answers))) return null;
  const selectedConcerns = legacy ? [] : canonicalConcerns((s.selectedConcerns as unknown[]).filter((x): x is string => typeof x === 'string'));
  const source = legacy ? {} : s.answers as Record<string, unknown>;
  const answers: Record<string, AnswerValue> = {};
  for (const q of questions) {
    if (!Object.hasOwn(source, q.id)) continue;
    const value = source[q.id];
    if (value === null) answers[q.id] = null;
    else if (q.type === 'single' && typeof value === 'string' && q.options.some(o => o.id === value)) answers[q.id] = value;
    else if (q.type === 'multi' && Array.isArray(value)) {
      const clean = q.options.filter(o => value.includes(o.id)).map(o => o.id);
      if (clean.length) answers[q.id] = clean;
    }
  }
  const areas = getPhotoAreas(selectedConcerns);
  const rawStatuses = s.photoStatuses && typeof s.photoStatuses === 'object' && !Array.isArray(s.photoStatuses) ? s.photoStatuses as Record<string, unknown> : {};
  const photoStatuses: AssessmentSession['photoStatuses'] = {};
  for (const area of areas) {
    const status = rawStatuses[area.id];
    if (status === 'added' || status === 'skipped' || status === 'not_started' || status === 'needs_readding') photoStatuses[area.id] = afterRefresh && status === 'added' ? 'needs_readding' : status;
  }
  let currentStep: AssessmentStep = { name: 'concerns' };
  const active = getActiveQuestions(selectedConcerns);
  if (!legacy && s.currentStep && typeof s.currentStep === 'object') {
    const step = s.currentStep as Record<string, unknown>;
    if (step.name === 'photo_preparation' && areas.length) currentStep = { name: 'photo_preparation' };
    if (step.name === 'photo_area' && typeof step.areaId === 'string') { const area = areas.find(a => a.id === step.areaId); currentStep = area ? { name: 'photo_area', areaId: area.id } : areas.length ? { name: 'photo_preparation' } : { name: 'concerns' }; }
    if (step.name === 'photo_analysis' && areas.length) currentStep = afterRefresh ? {name:'photo_area',areaId:areas[0].id} : {name:'photo_analysis'};
    if (step.name === 'question' && typeof step.questionId === 'string') currentStep = active.some(q => q.id === step.questionId) ? { name: 'question', questionId: step.questionId } : active.length ? { name: 'question', questionId: active[0].id } : { name: 'concerns' };
    if (step.name === 'next_step_placeholder' && active.length) currentStep = { name: 'next_step_placeholder' };
  }
  let preparation:PreparationState|null=null;
  if(s.preparation && typeof s.preparation==='object' && !Array.isArray(s.preparation)) {const p=s.preparation as Record<string,unknown>; if(validStart(p.startedAt,Date.now()) && typeof p.inputFingerprint==='string' && /^[a-f0-9]{32}$/.test(p.inputFingerprint)) {const result=recommendationSchema.safeParse(p.recommendation);preparation={startedAt:p.startedAt,inputFingerprint:p.inputFingerprint,recommendation:result.success && !(afterRefresh && p.containsPhotoChoices===true) ? result.data : null,containsPhotoChoices:p.containsPhotoChoices===true};}}
  let kit:KitState|null=null;
  if(preparation?.recommendation && s.kit && typeof s.kit==='object' && !Array.isArray(s.kit)) {const k=s.kit as Record<string,unknown>;const parsed=kitRequestSchema.safeParse({catalogueVersion:k.catalogueVersion,items:k.items});if(parsed.success && k.recommendationFingerprint===preparation.inputFingerprint && parsed.data.catalogueVersion===preparation.recommendation.catalogueVersion && typeof k.open==='boolean' && parsed.data.items.every(line=>preparation!.recommendation!.items.some(item=>item.product.id===line.productId)))kit={...parsed.data,recommendationFingerprint:preparation.inputFingerprint,open:k.open};}
  return { schemaVersion: 1, sessionId: s.sessionId, createdAt: s.createdAt, currentStep, selectedConcerns, answers, photoStatuses, photosBypassed: s.photosBypassed === true, photoReviewed: !afterRefresh && s.photoReviewed === true, preparation, kit };
}
export function readSession(): AssessmentSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return memory;
    let parsed: unknown; try { parsed = JSON.parse(raw); } catch { parsed = null; }
    const session = normalizeSession(parsed, true);
    if (!session) { memory = null; sessionStorage.removeItem(SESSION_KEY); return null; }
    memory = session; return session;
  } catch { unavailable = true; return memory; }
}
export function saveSession(session: AssessmentSession) {
  memory = session;
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session.preparation?.containsPhotoChoices ? {...session,preparation:{...session.preparation,recommendation:null},kit:null} : session)); } catch { unavailable = true; }
}
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16)); bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
  const h = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
export function startSession(): AssessmentSession {
  const session: AssessmentSession = { schemaVersion: 1, sessionId: uuid(), createdAt: new Date().toISOString(), currentStep: { name: 'concerns' }, selectedConcerns: [], answers: {}, photoStatuses: {}, photosBypassed: false, photoReviewed:false, preparation:null, kit:null };
  try { sessionStorage.removeItem(SESSION_KEY); } catch { unavailable = true; }
  saveSession(session); return session;
}
