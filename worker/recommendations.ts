import { z } from 'zod';
import productsFile from './data/products.json';
import rulesFile from './data/rules.json';
import { concerns, canonicalConcerns, type ConcernId } from '../src/data/concerns';
import { questions } from '../src/data/questions';
import { getPhotoAreas } from '../src/utils/photoAreas';
import { AREA_ALLOWED_OPTIONS } from '../src/shared/visualOptions';
import type { PhotoAreaId } from '../src/data/photoAreas';
import type { RecommendationRequest, RecommendationResult, PublicProduct } from '../src/shared/recommendations';

const predicateSchema=z.discriminatedUnion('type',[
 z.object({type:z.literal('answer_any_of'),questionId:z.string(),optionIds:z.array(z.string()).min(1)}).strict(),
 z.object({type:z.literal('answer_contains_any'),questionId:z.string(),optionIds:z.array(z.string()).min(1)}).strict(),
 z.object({type:z.literal('answer_contains_none'),questionId:z.string(),optionIds:z.array(z.string()).min(1)}).strict(),
 z.object({type:z.literal('confirmed_photo_any_of'),areaId:z.string(),optionIds:z.array(z.string()).min(1)}).strict(),
]);
const productSchema=z.object({id:z.string().min(1),name:z.string().min(1),variant:z.string().min(1),pricePaise:z.number().int().nonnegative(),currency:z.literal('INR'),imagePath:z.string().regex(/^\/products\/[a-zA-Z0-9._-]+$/),active:z.boolean(),discountEligible:z.boolean(),preMadeKit:z.boolean(),dataStatus:z.enum(['unverified_demo','verified']),ingredientSummary:z.string().nullable(),usageGuidance:z.string().nullable()}).strict();
const catalogueSchema=z.object({version:z.string().min(1),currency:z.literal('INR'),products:z.array(productSchema)}).strict();
const ruleSchema=z.object({id:z.string().min(1),enabled:z.boolean(),reviewStatus:z.literal('demo_only'),concernId:z.string(),productId:z.string(),priority:z.number().int(),condition:z.object({all:z.array(predicateSchema).min(1)}).strict(),reason:z.string().min(1)}).strict();
const rulesSchema=z.object({version:z.string().min(1),rules:z.array(ruleSchema)}).strict();
export type Catalogue=z.infer<typeof catalogueSchema>; export type RuleSet=z.infer<typeof rulesSchema>; type Predicate=z.infer<typeof predicateSchema>;
const excluded=new Set(['demo_biotin_hair_gummies','demo_post_pregnancy_hair_gummies','demo_benzoyl_peroxide_body_wash','demo_ketoconazole_shampoo']);
const excludedProduct=(p:Catalogue['products'][number])=>excluded.has(p.id) || /biotin hair gummies|hair gummies for post-pregnancy hair fall|benzoyl peroxide body wash|ketoconazole anti-dandruff shampoo/i.test(p.name);
export function validateData(c:unknown,r:unknown):{catalogue:Catalogue;rules:RuleSet}|null {
 const cp=catalogueSchema.safeParse(c),rp=rulesSchema.safeParse(r); if(!cp.success || !rp.success)return null;
 const catalogue=cp.data,rules=rp.data; if(new Set(catalogue.products.map(p=>p.id)).size!==catalogue.products.length || new Set(rules.rules.map(x=>x.id)).size!==rules.rules.length)return null;
 for(const rule of rules.rules){
  if(!concerns.some(c=>c.id===rule.concernId))return null;
  const product=catalogue.products.find(p=>p.id===rule.productId); if(!product || (rule.enabled && (!product.active || product.preMadeKit || excludedProduct(product))))return null;
  for(const predicate of rule.condition.all){
   if(predicate.type==='confirmed_photo_any_of') {const allowed=AREA_ALLOWED_OPTIONS[predicate.areaId as PhotoAreaId]; if(!allowed || predicate.optionIds.some(id=>!allowed.includes(id as never)) || !getPhotoAreas([rule.concernId]).some(a=>a.id===predicate.areaId))return null;}
   else {const q=questions.find(q=>q.id===predicate.questionId); if(!q || q.concernId!==rule.concernId || (predicate.type==='answer_any_of' ? q.type!=='single' : q.type!=='multi') || predicate.optionIds.some(id=>!q.options.some(o=>o.id===id)))return null;}
  }
 }
 return {catalogue,rules};
}
export function publicProduct(p:Catalogue['products'][number]):PublicProduct {return {id:p.id,name:p.name,variant:p.variant,pricePaise:p.pricePaise,currency:p.currency,imagePath:p.imagePath,dataStatus:p.dataStatus};}
const inputSchema=z.object({sessionId:z.string().trim().min(1).max(128),selectedConcerns:z.array(z.string()).min(1).max(9),answers:z.record(z.string(),z.unknown()),confirmedPhotoSelections:z.array(z.object({areaId:z.string(),selectedOptionIds:z.array(z.string()),notSure:z.boolean(),source:z.literal('user_confirmed_photo_review')}).strict()).max(6)}).strict();
export function validateInput(raw:unknown): {value:RecommendationRequest|null;fields:string[]} {
 const result=inputSchema.safeParse(raw); if(!result.success) return {value:null,fields:[...new Set(result.error.issues.map(i=>i.path.join('.') || 'request'))]};
 const input=result.data; const fields:string[]=[];
 if(new Set(input.selectedConcerns).size!==input.selectedConcerns.length || input.selectedConcerns.some(id=>!concerns.some(c=>c.id===id))) fields.push('selectedConcerns');
 const selected=canonicalConcerns(input.selectedConcerns);
 for(const [id,value] of Object.entries(input.answers)) {
  const q=questions.find(q=>q.id===id); if(!q || !selected.includes(q.concernId)){fields.push(`answers.${id}`);continue;}
  if(value===null)continue;
  if(q.type==='single' && (typeof value!=='string' || !q.options.some(o=>o.id===value)))fields.push(`answers.${id}`);
  if(q.type==='multi' && (!Array.isArray(value) || value.length===0 || new Set(value).size!==value.length || value.some(v=>typeof v!=='string' || !q.options.some(o=>o.id===v)))) fields.push(`answers.${id}`);
 }
 const validAreas=getPhotoAreas(selected).map(a=>a.id); const seen=new Set<string>();
 for(const [index,item] of input.confirmedPhotoSelections.entries()){
  const allowed=AREA_ALLOWED_OPTIONS[item.areaId as PhotoAreaId];
  if(!allowed || !validAreas.includes(item.areaId as PhotoAreaId) || seen.has(item.areaId) || new Set(item.selectedOptionIds).size!==item.selectedOptionIds.length || item.selectedOptionIds.some(id=>!allowed.includes(id as never)) || (item.notSure && item.selectedOptionIds.length>0))fields.push(`confirmedPhotoSelections.${index}`);
  seen.add(item.areaId);
 }
 if(fields.length)return {value:null,fields};
 return {value:{...input,selectedConcerns:selected} as RecommendationRequest,fields:[]};
}
export function matches(p:Predicate, input:RecommendationRequest):boolean {
 if(p.type==='confirmed_photo_any_of'){const photo=input.confirmedPhotoSelections.find(x=>x.areaId===p.areaId && x.source==='user_confirmed_photo_review'); return !!photo && !photo.notSure && p.optionIds.some(id=>photo.selectedOptionIds.includes(id as never));}
 const answer=input.answers[p.questionId]; if(p.type==='answer_any_of')return typeof answer==='string' && p.optionIds.includes(answer);
 if(!Array.isArray(answer))return false;
 return p.type==='answer_contains_any' ? p.optionIds.some(id=>answer.includes(id)) : p.optionIds.every(id=>!answer.includes(id));
}
export function generateRecommendations(input:RecommendationRequest,catalogue:Catalogue,rules:RuleSet):RecommendationResult {
 const items:RecommendationResult['items']=[],unmatchedConcernIds:ConcernId[]=[];
 const selected=input.selectedConcerns;
 const add=(id:string,concern:ConcernId,reason:string)=>{const permittedKits=['demo_body_acne_pack','demo_exfoliation_pigmentation_kit'];const product=catalogue.products.find(p=>p.id===id&&p.active&&(!p.preMadeKit||permittedKits.includes(p.id))&&!excludedProduct(p));if(!product)return false;const existing=items.find(i=>i.product.id===id);if(existing){if(!existing.matchedConcernIds.includes(concern))existing.matchedConcernIds.push(concern);if(!existing.reasons.includes(reason))existing.reasons.push(reason);}else items.push({product:publicProduct(product),quantity:1,matchedConcernIds:[concern],reasons:[reason]});return true;};
 const streamlined:ConcernId[]=['body_acne_marks','strawberry_bumpy_skin','body_pigmentation','body_odour','general_body_care','face'];
 const sameArea=selected.includes('body_pigmentation')&&selected.includes('strawberry_bumpy_skin')&&input.answers.bumpy_pigmentation_same_area==='yes';
 for(const concern of canonicalConcerns(input.selectedConcerns)){
  if(streamlined.includes(concern)){
   let added=false;const put=(id:string,why:string)=>{added=add(id,concern,why)||added;};
   if(concern==='body_acne_marks'){
    const goal=input.answers.body_acne_goal; const dry=input.answers.shared_body_skin==='dry';
    if(goal==='active_bumps')put(dry?'demo_ceramide_body_wash':'demo_sa_body_wash','A sample wash for the body acne you described.');
    if(goal==='marks_left_behind')put('demo_niacinamide_lotion','A sample lotion for the marks you described.');
    if(goal==='both'){if(dry){put('demo_ceramide_body_wash','A sample wash for body acne and dry skin.');put('demo_niacinamide_lotion','A sample lotion for the marks you described.');}else put('demo_body_acne_pack','A sample pack for body acne and marks.');}
   }
   if(concern==='body_pigmentation')put(sameArea?'demo_exfoliation_pigmentation_kit':'demo_pigmentation_cream','A sample option for the body pigmentation you selected.');
   if(concern==='strawberry_bumpy_skin'){
    if(sameArea)put('demo_exfoliation_pigmentation_kit','A sample option for bumps and pigmentation in the same area.');
    else if(selected.includes('body_acne_marks') && (input.answers.body_acne_goal==='active_bumps'||input.answers.body_acne_goal==='both')){const dry=input.answers.shared_body_skin==='dry';put(input.answers.body_acne_goal==='both'&&!dry?'demo_body_acne_pack':dry?'demo_ceramide_body_wash':'demo_sa_body_wash','The sample body wash also addresses your selected bumpy-skin concern.');}
    else put('demo_aha_scrub','A sample scrub for the bumpy skin you selected.');
   }
   if(concern==='body_odour')put('demo_underarm_roll_on','A sample underarm option for body odour.');
   if(concern==='general_body_care'){
    const goals=Array.isArray(input.answers.body_care_goal)?input.answers.body_care_goal:[];
    if(goals.includes('very_dry'))put('demo_20_urea_lotion','A sample lotion for very dry skin.');else if(goals.includes('hydration'))put('demo_urea_body_lotion','A sample lotion for dry body skin.');
    if(goals.includes('dry_feet_or_heels'))put('demo_urea_foot_roll_on','A sample option for rough or dry heels.');
    if(goals.includes('stretch_marks'))put('demo_stretch_mark_serum','A sample option for the stretch marks you selected.');
   }
   if(concern==='face'){
    const goals=Array.isArray(input.answers.face_goal)?input.answers.face_goal:[];
    if(goals.includes('acne_or_bumps')){
     if(input.answers.face_breakout_pattern==='persistent_painful')put('demo_face_bp_25','A sample face wash for the persistent breakouts you described.');
     else if(input.answers.face_breakout_pattern==='occasional' && ['oily','dry','combination','normal'].includes(String(input.answers.face_skin_type)))put(input.answers.face_skin_type==='oily'?'demo_face_sa_2':'demo_face_sa_1','A sample face wash matched to your breakouts and skin type.');
    }
    if(goals.includes('individual_spots'))put('demo_pimple_patch','A sample patch for individual spots.');
    if(goals.includes('dryness'))put('demo_face_moisturizer','A sample moisturizer for facial dryness.');
    if(goals.includes('everyday_protection'))put('demo_face_sunscreen','A sample sunscreen for everyday face protection.');
   }
   if(!added)unmatchedConcernIds.push(concern);continue;
  }
  const candidates=rules.rules.filter(r=>r.enabled && r.concernId===concern && r.condition.all.every(p=>matches(p,input))).filter(r=>catalogue.products.some(p=>p.id===r.productId && p.active && !p.preMadeKit && !excludedProduct(p))).sort((a,b)=>b.priority-a.priority || a.id.localeCompare(b.id));
  const rule=candidates[0]; if(!rule){unmatchedConcernIds.push(concern);continue;}
  const product=catalogue.products.find(p=>p.id===rule.productId)!; const existing=items.find(i=>i.product.id===product.id);
  if(existing){if(!existing.matchedConcernIds.includes(concern))existing.matchedConcernIds.push(concern);if(!existing.reasons.includes(rule.reason))existing.reasons.push(rule.reason);}
  else items.push({product:publicProduct(product),quantity:1,matchedConcernIds:[concern],reasons:[rule.reason]});
 }
 return {catalogueVersion:catalogue.version,rulesVersion:rules.version,currency:'INR',items,unmatchedConcernIds};
}
export const configuredData=()=>validateData(productsFile,rulesFile);
function error(status:number,code:string,message:string,fields?:string[]){return Response.json({error:{code,message,...(fields?{fields}:{}),requestId:crypto.randomUUID()}},{status,headers:{'Cache-Control':'no-store'}});}
export function catalogueRoute():Response {const data=configuredData();if(!data)return error(503,'CATALOGUE_UNAVAILABLE','Sample catalogue is unavailable.');return Response.json({version:data.catalogue.version,currency:'INR',products:data.catalogue.products.filter(p=>p.active && !p.preMadeKit).map(publicProduct)});}
export async function recommendationsRoute(request:Request):Promise<Response>{
 const len=Number(request.headers.get('content-length'));if(Number.isFinite(len) && len>32768)return error(413,'REQUEST_TOO_LARGE','Request is too large.');
 let body='';try{const reader=request.body?.getReader();let size=0;const decoder=new TextDecoder();if(reader)while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>32768){await reader.cancel();return error(413,'REQUEST_TOO_LARGE','Request is too large.');}body+=decoder.decode(value,{stream:true});}body+=decoder.decode();}catch{return error(400,'INVALID_JSON','Request body is not valid JSON.');}
 let raw:unknown;try{raw=JSON.parse(body);}catch{return error(400,'INVALID_JSON','Request body is not valid JSON.');}
 const input=validateInput(raw);if(!input.value)return error(422,'INVALID_INPUT','One or more assessment selections are invalid.',input.fields);
 const data=configuredData();if(!data)return error(503,'CATALOGUE_UNAVAILABLE','Sample catalogue is unavailable.');
 try{return Response.json(generateRecommendations(input.value,data.catalogue,data.rules),{headers:{'Cache-Control':'no-store'}});}catch{return error(500,'RECOMMENDATION_ERROR','Could not prepare sample recommendations.');}
}
