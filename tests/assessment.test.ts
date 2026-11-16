import { describe, expect, it } from 'vitest';
import { concerns } from '../src/data/concerns';
import { questions } from '../src/data/questions';
import { assessmentReducer } from '../src/app/assessmentReducer';
import { getActiveAnswers, getActiveQuestions, questionProgress } from '../src/app/sequence';
import { normalizeSession, type AssessmentSession } from '../src/app/session';

describe('branch-aware progress',()=>{
 it('reserves room for follow-ups without changing progress when an answer reveals them',()=>{
  const before=questionProgress(['face'],'face_goal',{});
  const after=questionProgress(['face'],'face_goal',{face_goal:['acne_or_bumps']});
  const next=questionProgress(['face'],'face_breakout_pattern',{face_goal:['acne_or_bumps']});
  const final=questionProgress(['face'],'face_skin_type',{face_goal:['acne_or_bumps'],face_breakout_pattern:'occasional'});
  expect(after?.fraction).toBe(before?.fraction);
  expect(next!.fraction).toBeGreaterThan(after!.fraction);
  expect(final!.fraction).toBeGreaterThan(next!.fraction);
  expect(final!.fraction).toBeLessThan(1);
 });
 it('allocates the second selected concern after the first and keeps shared questions below completion',()=>{
  const answers={underarm_concerns:['pigmentation'],sun_areas:['face']};
  const first=questionProgress(['underarm_pigmentation','tanning_sun_damage'],'underarm_concerns',answers);
  const next=questionProgress(['underarm_pigmentation','tanning_sun_damage'],'sun_areas',answers);
  const shared=questionProgress(['underarm_pigmentation','tanning_sun_damage'],'shared_pregnancy',answers);
  expect(next!.fraction).toBeGreaterThan(first!.fraction);
  expect(shared!.fraction).toBeGreaterThan(next!.fraction);
  expect(shared!.fraction).toBeLessThan(1);
 });
});
const base: AssessmentSession = { schemaVersion:1, sessionId:'id', createdAt:'2026-01-01T00:00:00.000Z', currentStep:{name:'concerns'}, selectedConcerns:[], answers:{}, photoStatuses:{}, photosBypassed:false };
describe('assessment data and sequence', () => {
 it('defines nine unique concerns and the complete ordered question set', () => {
  expect(concerns).toHaveLength(9); expect(new Set(concerns.map(c => c.id)).size).toBe(9);
  expect(questions.map(q => q.id)).toContain('shared_body_skin');
  expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
  for (const q of questions) { expect(concerns.some(c => c.id === q.concernId)).toBe(true); expect(q.options.length).toBeGreaterThan(0); expect(new Set(q.options.map(o => o.id)).size).toBe(q.options.length); }
 });
 it('sequences only selected concerns in canonical order without duplicates', () => {
  expect(getActiveQuestions([])).toEqual([]);
  expect(getActiveQuestions(['hair']).every(q => q.concernId === 'hair')).toBe(true);
  const active = getActiveQuestions(['hair','body_acne_marks','hair']); expect(active.map(q => q.id)).toEqual(['body_acne_goal','shared_body_skin','hair_concerns_new']);
  expect(questionProgress(['hair','body_acne_marks'], 'hair_concerns_new')).toMatchObject({concernIndex:2, concernTotal:2, questionIndex:1, questionTotal:1});
 });
});
describe('assessment transitions', () => {
 it('keeps answers, canonicalizes choices, distinguishes skip and filters active answers', () => {
  let s = assessmentReducer(base,{type:'toggleConcern',id:'hair'}); s = assessmentReducer(s,{type:'toggleConcern',id:'body_acne_marks'});
  expect(s.selectedConcerns).toEqual(['body_acne_marks','hair']); s=assessmentReducer(s,{type:'continue'}); s=assessmentReducer(s,{type:'withoutPhotos'});
  s=assessmentReducer(s,{type:'toggleOption',questionId:'body_acne_goal',optionId:'both'}); s=assessmentReducer(s,{type:'continue'});
  s=assessmentReducer(s,{type:'toggleOption',questionId:'shared_body_skin',optionId:'dry'}); s=assessmentReducer(s,{type:'continue'});
  s=assessmentReducer(s,{type:'back'}); expect(s.currentStep).toEqual({name:'question',questionId:'shared_body_skin'});
  s=assessmentReducer(s,{type:'toggleConcern',id:'body_acne_marks'}); expect(getActiveAnswers(s.selectedConcerns,s.answers)).toEqual({});
  s=assessmentReducer(s,{type:'toggleConcern',id:'body_acne_marks'}); expect(s.answers.body_acne_goal).toBe('both');
 });
 it('does not equate an empty multi-selection with skip', () => {
  let s = {...base, selectedConcerns:['hair'] as AssessmentSession['selectedConcerns'],currentStep:{name:'question',questionId:'hair_goal'} as AssessmentSession['currentStep']};
  s=assessmentReducer(s,{type:'toggleOption',questionId:'hair_goal',optionId:'other'}); s=assessmentReducer(s,{type:'toggleOption',questionId:'hair_goal',optionId:'other'});
  expect(s.answers.hair_goal).toBeUndefined(); expect(assessmentReducer(s,{type:'continue'})).toBe(s);
 });
 it('migrates Step 1 and repairs stored answers and invalid current question', () => {
  const legacy = normalizeSession({schemaVersion:1,sessionId:'id',createdAt:base.createdAt,currentStep:'concerns'}); expect(legacy).toMatchObject({selectedConcerns:[],answers:{},currentStep:{name:'concerns'}});
  const repaired=normalizeSession({...base,selectedConcerns:['hair','hair','bogus'],currentStep:{name:'question',questionId:'underarm_goal'},answers:{hair_goal:['other','bad','other','general_hair_care'],hair_duration:'bad',unknown:'x'}});
  expect(repaired).toMatchObject({selectedConcerns:['hair'],currentStep:{name:'question',questionId:'hair_concerns_new'},answers:{hair_goal:['general_hair_care','other']}}); expect(repaired?.answers.hair_duration).toBeUndefined();
 });
});
