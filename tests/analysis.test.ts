import { describe, expect, it, vi } from 'vitest';
import { toggleReviewOption, toggleNotSure, type AreaAnalysis } from '../src/app/analysisState';
import { checkPhotoRate } from '../worker/index';
import { photoAnalysis, publicConfig, validateModel } from '../worker/analysis';
import { AREA_ALLOWED_OPTIONS, preselected } from '../src/shared/visualOptions';
const env={GEMINI_API_KEY:'test-key',GEMINI_MODEL:'gemini-2.5-flash',GEMINI_DATA_MODE:'paid'};
const valid={imageQuality:'usable',observations:[{optionId:'visible_bumps',status:'suggested'}]};
const jpeg=new Uint8Array([255,216,255,224,1,2,255,217]);
function request(area='affected_body', bytes=jpeg, type='image/jpeg') {const f=new FormData(); f.append('area',area); f.append('image',new Blob([bytes],{type}),'test.jpg'); return new Request('https://example.test/api/photo-analysis',{method:'POST',body:f,headers:{Origin:'https://example.test'}});}
function provider(model:unknown,status=200):typeof fetch {return vi.fn(async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(model)}]}}]}),{status,headers:{'Content-Type':'application/json'}})) as unknown as typeof fetch;}
describe('visual validation',()=>{
 it('enforces area allowlists, uniqueness, schema and config',()=>{
  expect(AREA_ALLOWED_OPTIONS.scalp_hair).toEqual(['visible_flakes']); expect(validateModel(valid,'affected_body')).toEqual(valid);
  expect(validateModel(valid,'scalp_hair')).toBeNull(); expect(validateModel({...valid,observations:[...valid.observations,...valid.observations]},'affected_body')).toBeNull();
  expect(validateModel({...valid,extra:true},'affected_body')).toBeNull(); expect(publicConfig({...env,GEMINI_DATA_MODE:'invalid'}).analysisAvailable).toBe(false); expect(publicConfig({...env,GEMINI_DATA_MODE:undefined}).analysisAvailable).toBe(false);
 });
 it('preselects suggested observations, not uncertain ones',()=>{
  const obs=[{optionId:'visible_bumps' as const,status:'suggested' as const},{optionId:'visible_marks' as const,status:'uncertain' as const}];
  expect(preselected(obs)).toEqual(['visible_bumps']);
 });
});
describe('photo analysis Worker',()=>{
 it('sends a valid image to a provider and validates its answer',async()=>{
  const mock=provider(valid); const res=await photoAnalysis(request(),env,mock); expect(res.status).toBe(200); expect(await res.json()).toMatchObject({area:'affected_body',status:'complete',observations:valid.observations});
  expect(mock).toHaveBeenCalledOnce(); const [url,init]=vi.mocked(mock).mock.calls[0]; expect(String(url)).toContain('gemini-2.5-flash:generateContent'); expect(String(init?.body)).toContain('inlineData');
 });
 it('returns no observations for unusable images',async()=>{const res=await photoAnalysis(request(),env,provider({...valid,imageQuality:'unusable'}));expect(await res.json()).toMatchObject({status:'unusable_image',observations:[]});});
 it('rejects missing files, invalid area, image type and size',async()=>{
  const f=new FormData(); f.append('area','face'); expect((await photoAnalysis(new Request('https://example.test/api/photo-analysis',{method:'POST',body:f}),env)).status).toBe(400);
  expect((await photoAnalysis(request('invalid'),env)).status).toBe(422); expect((await photoAnalysis(request('face',jpeg,'image/png'),env)).status).toBe(415);
  expect((await photoAnalysis(request('face',new Uint8Array([1,2,3,4])),env)).status).toBe(415);
  const large=new Uint8Array(2*1024*1024+1); expect((await photoAnalysis(request('face',large),env)).status).toBe(413);
 });
 it('handles configuration, malformed response, unknown labels, rate limit and timeout',async()=>{
  expect((await photoAnalysis(request(),{...env,GEMINI_API_KEY:''})).status).toBe(503);
  expect((await photoAnalysis(request(),env,provider({bad:true}))).status).toBe(502);
  expect((await photoAnalysis(request(),env,provider({imageQuality:'usable',observations:[{optionId:'visible_flakes',status:'suggested'}]}))).status).toBe(502);
  expect((await photoAnalysis(request(),env,provider({},429))).status).toBe(429);
  const stalled=(()=>new Promise(()=>{})) as typeof fetch; expect((await photoAnalysis(request(),env,stalled,5)).status).toBe(504);
 });
});

describe('review choices',()=>{
 it('keeps Not sure exclusive and lets user choices override suggestions',()=>{
  const initial:AreaAnalysis={revision:'1',status:'complete',observations:[{optionId:'visible_bumps',status:'suggested'}],selectedOptionIds:['visible_bumps'],notSure:false,confirmed:true};
  const removed=toggleReviewOption(initial,'visible_bumps'); expect(removed.selectedOptionIds).toEqual([]); expect(removed.confirmed).toBe(false);
  const unsure=toggleNotSure(initial); expect(unsure.notSure).toBe(true); expect(unsure.selectedOptionIds).toEqual([]);
  const changed=toggleReviewOption(unsure,'visible_marks'); expect(changed.notSure).toBe(false); expect(changed.selectedOptionIds).toEqual(['visible_marks']);
 });
});

describe('photo endpoint rate limiter',()=>{
 it('fails closed when unavailable and returns 429 if either limit is exceeded',async()=>{
  const req=request(); expect((await checkPhotoRate(req,{}))?.status).toBe(503);
  const allowed={limit:vi.fn(async()=>({success:true}))};const blocked={limit:vi.fn(async()=>({success:false}))};
  expect(await checkPhotoRate(req,{PHOTO_CLIENT_LIMIT:allowed,PHOTO_LOCATION_LIMIT:allowed})).toBeNull();
  const limited=await checkPhotoRate(req,{PHOTO_CLIENT_LIMIT:blocked,PHOTO_LOCATION_LIMIT:allowed});expect(limited?.status).toBe(429);expect(await limited?.json()).toMatchObject({error:{code:'ANALYSIS_LIMITED'}});
  expect((await checkPhotoRate(req,{PHOTO_CLIENT_LIMIT:allowed,PHOTO_LOCATION_LIMIT:blocked}))?.status).toBe(429);
 });
});
