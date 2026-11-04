import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPhotoAreas } from '../src/utils/photoAreas';
import { PhotoStore } from '../src/app/photoStore';
import { fittedDimensions, processPhoto } from '../src/services/imageProcessing';
import { normalizeSession, type AssessmentSession } from '../src/app/session';
import { assessmentReducer } from '../src/app/assessmentReducer';
const base: AssessmentSession = {schemaVersion:1,sessionId:'id',createdAt:'2026-01-01T00:00:00.000Z',currentStep:{name:'concerns'},selectedConcerns:['body_acne_marks','underarm_pigmentation','hair'],answers:{},photoStatuses:{},photosBypassed:false};
const ids = (s: string[]) => getPhotoAreas(s).map(a => a.id);
describe('photo areas', () => {
 it('maps, deduplicates, orders, and ignores invalid concerns', () => {
  expect(ids(['body_odour'])).toEqual([]); expect(ids(['body_acne_marks','strawberry_bumpy_skin'])).toEqual(['affected_body']);
  expect(ids(['underarm_pigmentation','body_acne_marks'])).toEqual(['affected_body','underarms']);
  expect(ids(['hair','face'])).toEqual(['face','scalp_hair']); expect(ids(['bogus','hair','body_pigmentation','face'])).toEqual(['elbows_knees_neck','face','scalp_hair']);
  expect(ids(['strawberry_bumpy_skin'])).toEqual(ids(['body_acne_marks','strawberry_bumpy_skin']));
 });
});
describe('photo navigation and persistence', () => {
 it('bypasses photos for body odour and returns to preparation after skipping all', () => {
  const odour = {...base, selectedConcerns:['body_odour'] as AssessmentSession['selectedConcerns']}; expect(assessmentReducer(odour,{type:'continue'}).currentStep).toEqual({name:'question',questionId:'odour_timing'});
  let s=assessmentReducer(base,{type:'continue'}); expect(s.currentStep.name).toBe('photo_preparation'); s=assessmentReducer(s,{type:'withoutPhotos'}); expect(s.photoStatuses.underarms).toBe('skipped'); s=assessmentReducer(s,{type:'back'}); expect(s.currentStep.name).toBe('photo_preparation');
 });
 it('moves through areas and restores statuses after refresh without serializing images', () => {
  let s=assessmentReducer(base,{type:'continue'}); s=assessmentReducer(s,{type:'photoStart'}); s=assessmentReducer(s,{type:'photoStatus',areaId:'affected_body',status:'added'}); s=assessmentReducer(s,{type:'continue'}); s=assessmentReducer(s,{type:'skip'});
  expect(s.photoStatuses.underarms).toBe('skipped'); expect(s.currentStep).toEqual({name:'photo_area',areaId:'scalp_hair'});
  const json=JSON.stringify(s); expect(json).not.toContain('blob:'); expect(json).not.toContain('previewUrl');
  const restored=normalizeSession(JSON.parse(json),true)!; expect(restored.photoStatuses.affected_body).toBe('needs_readding'); expect(restored.photoStatuses.underarms).toBe('skipped');
  expect(normalizeSession(JSON.parse(json))?.photoStatuses.affected_body).toBe('added');
 });
 it('removes only statuses no longer relevant', () => {
  let s={...base, selectedConcerns:['body_acne_marks','strawberry_bumpy_skin'] as AssessmentSession['selectedConcerns'],photoStatuses:{affected_body:'added' as const}};
  s=assessmentReducer(s,{type:'toggleConcern',id:'body_acne_marks'}); expect(s.photoStatuses.affected_body).toBe('added');
  s=assessmentReducer(s,{type:'toggleConcern',id:'strawberry_bumpy_skin'}); expect(s.photoStatuses.affected_body).toBeUndefined();
 });
});
describe('photo memory lifecycle', () => {
 const create = vi.fn(); const revoke = vi.fn();
 const result = {blob:new Blob(['photo'],{type:'image/jpeg'}),width:100,height:100,mimeType:'image/jpeg' as const};
 beforeEach(() => { create.mockReset().mockReturnValueOnce('blob:one').mockReturnValueOnce('blob:two').mockReturnValueOnce('blob:three'); revoke.mockReset(); vi.stubGlobal('URL', {createObjectURL:create,revokeObjectURL:revoke}); });
 it('replaces, removes, clears, and ignores stale results', () => {
  const store=new PhotoStore(); const first=store.begin('face'); expect(store.setPhoto('face',result,first)).toBe(true);
  const old=store.begin('face'); const newer=store.begin('face'); expect(store.setPhoto('face',result,old)).toBe(false); expect(store.getPhoto('face')?.previewUrl).toBe('blob:one');
  expect(store.setPhoto('face',result,newer)).toBe(true); expect(revoke).toHaveBeenCalledWith('blob:one');
  store.removePhoto('face'); expect(revoke).toHaveBeenCalledWith('blob:two');
  store.setPhoto('underarms',result,store.begin('underarms')); store.clearPhotos(); expect(revoke).toHaveBeenCalledWith('blob:three');
 });
 it('retains a shared relevant area and removes irrelevant ones', () => {
  const store=new PhotoStore(); store.setPhoto('affected_body',result,store.begin('affected_body')); store.setPhoto('face',result,store.begin('face'));
  store.retain(['affected_body']); expect(store.getPhoto('affected_body')).toBeDefined(); expect(store.getPhoto('face')).toBeUndefined(); expect(revoke).toHaveBeenCalledWith('blob:two');
 });
});
describe('image processing validation', () => {
 it('fits without upscaling and rejects unsupported and oversized files', async () => {
  expect(fittedDimensions(3200,1600)).toEqual({width:1600,height:800}); expect(fittedDimensions(600,400)).toEqual({width:600,height:400});
  await expect(processPhoto(new File(['x'],'x.heic',{type:'image/heic'}))).rejects.toThrow('JPEG, PNG, or WebP');
  await expect(processPhoto(new File([new Uint8Array(10*1024*1024+1)],'big.jpg',{type:'image/jpeg'}))).rejects.toThrow('10 MB');
 });
});
