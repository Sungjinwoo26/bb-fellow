import type {ConcernId} from '../src/data/concerns';
import type {RecommendationRequest} from '../src/shared/recommendations';
import type {ChatState,ChatTurn} from '../src/shared/chatState';
import catalogueData from '../src/data/productCatalogue.json';
import {getActiveQuestions} from '../src/app/sequence';
import {catalogue} from './catalogue';
import {configuredData,generateRecommendations,validateInput} from './recommendations';
import {selectProducts} from './recommendationPipeline';

type Answers=RecommendationRequest['answers'];
const links:Record<string,string>=catalogueData.assessment_storefront_links;
export function hairAssessmentAnswers(state:ChatState,turn:ChatTurn):Answers{
 const context=state.hair_context;const seen=new Set([...(context?.observed??[]),...(turn.hair_concerns??[])]);
 const goals:string[]=[];const fall:string[]=[];const flakes:string[]=[];const lengths:string[]=[];
 if(seen.has('thinning')){goals.push('fall');fall.push('thinning');}
 if(seen.has('shedding')){goals.push('fall');fall.push('shedding');}
 if(seen.has('flakes')||context?.flakes==='yes'){goals.push('flakes');flakes.push('flakes');}
 if(seen.has('dry_lengths')){goals.push('dry');lengths.push('dry');}
 if(seen.has('breakage')){goals.push('damage');lengths.push('damage');}
 const answers:Answers={};if(goals.length)answers.hair_concerns_new=[...new Set(goals)];if(fall.length)answers.hair_fall_details=[...new Set(fall)];if(flakes.length)answers.hair_flake_details=[...new Set(flakes)];if(lengths.length)answers.hair_length_details=[...new Set(lengths)];
 if(state.pregnancy_context)answers.shared_pregnancy='yes';
 return answers;
}
/** Translate assessment results to exact catalogue records and reapply chat safety filters. */
export function assessmentChatProducts(concerns:ConcernId[],answers:Answers,state:ChatState){
 const checked=validateInput({sessionId:'chat',selectedConcerns:concerns,answers,confirmedPhotoSelections:[]});
 const data=configuredData();if(!checked.value||!data)return {products:[],reason:'assessment_invalid_or_unavailable' as const};
 const outcome=generateRecommendations(checked.value,data.catalogue,data.rules);
 const eligible=new Set(selectProducts('',state).eligible.map(product=>product.id));
 const products=outcome.items.flatMap(item=>{const storefrontId=links[item.product.id];const product=catalogue.find(p=>p.storefront_variants.some(variant=>variant.id===storefrontId));return product&&eligible.has(product.id)?[product]:[]});
 return {products:[...new Map(products.map(product=>[product.id,product])).values()],reason:products.length?'assessment_match' as const:'no_supported_match' as const};
}
/** Return only a question whose immediate choices change eligible products.
 * This deliberately does not infer answers to later dependent questions; callers
 * must not treat null as proof that no useful downstream question exists. */
export function assessmentNextQuestion(concerns:ConcernId[],answers:Answers,state:ChatState){
 const active=getActiveQuestions(concerns,answers).filter(q=>answers[q.id]==null);
 for(const question of active){
  const results=question.options.map(option=>{const value=question.type==='multi'?[option.id]:option.id;return assessmentChatProducts(concerns,{...answers,[question.id]:value},state).products.map(p=>p.id).sort().join('|')});
  if(new Set(results).size>1)return question;
 }
 return null;
}
