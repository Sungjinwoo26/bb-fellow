import { initialChatState, turnSchema, type ChatState, type ChatTurn } from '../src/shared/chatState';
import { conversationContext } from './conversationContext';
import { normalizeSearch, requestedProductFormat } from './productMatcher';
import { exclusions } from './recommendationPipeline';

type Product={id:string;name:string};
type History={role:'user'|'assistant';text:string}[];
type Result={message:string;status:string;selected_product_ids:string[];product_options:{id:string}[];recommendations?:{id:string}[]};
const unique=(values:string[],limit:number)=>[...new Set(values)].slice(-limit);
export function interpretTurn(message:string,history:History,state:ChatState,products:Product[],selected:string[]){
 const context=conversationContext(message,history,selected.length?selected:state.active_product_ids);
 const text=normalizeSearch(message);const active=selected.length?selected:state.active_product_ids;
 const named=products.filter(p=>{const name=normalizeSearch(p.name);return name.length>=12&&(` ${text} `).includes(` ${name} `)}).map(p=>p.id);
 const ordinal=/\b(?:the )?(first|1st|second|2nd|third|3rd)(?: one| product)?\b/i.exec(message);
 const position=ordinal?({first:0,'1st':0,second:1,'2nd':1,third:2,'3rd':2} as Record<string,number>)[ordinal[1].toLowerCase()]:-1;
 const ordinalId=position>=0?(state.recommended_product_ids[position]??active[position]):undefined;
 const references=named.length?named:ordinalId?[ordinalId]:context.action==='product_follow_up'?active:[];
 const scope=named.length?'new_product':ordinal&&!ordinalId?'ambiguous':references.length>1?'multiple_products':references.length===1?'active_product':context.action==='product_follow_up'?'ambiguous':'none';
 const comparisonFollowUp=active.length===2&&/\b(?:which|what)\b.{0,35}\b(?:better|best|choose|prefer|suit)\b/i.test(message);
 const action=context.action==='comparison'||comparisonFollowUp?'compare':context.action==='product_search'?'find_product':scope==='active_product'||scope==='multiple_products'?'product_question':/^(yes|no|yeah|nope|oily|dry)$/i.test(message.trim())?'answer_follow_up':'unknown';
 if(comparisonFollowUp&&!named.length){references.splice(0,references.length,...active);}
 return turnSchema.parse({action,reference_scope:scope,referenced_products:references.slice(0,4),product_types:requestedProductFormat(message)?[requestedProductFormat(message)!]:[],concerns:context.concerns,body_areas:context.areas,excluded_ingredients:exclusions(message),intents:context.intents,missing_information:scope==='ambiguous'?['referenced_product']:[],confidence:scope==='ambiguous'||action==='unknown'?'low':named.length||ordinalId||action==='compare'?'high':'medium'});
}
export function advanceState(previous:ChatState|undefined,message:string,history:History,selected:string[],result:Result,products:Product[],interpreted?:ChatTurn){
 const old=previous??initialChatState();const turn=interpreted??interpretTurn(message,history,old,products,selected);
 const freshContext=conversationContext(message,[],[]);const newSearch=turn.action==='find_product';
 const question=result.message.match(/([^.!?\n]*\?)\s*$/)?.[1]?.trim();
 const last=history.at(-1);const answered=last?.role==='assistant'&&last.text.includes('?')&&!message.includes('?')&&message.trim().split(/\s+/).length<=8?{question:last.text.slice(0,500),answer:message.slice(0,500)}:null;
 const recommendations=(result.recommendations??[]).map(x=>x.id);
 const active=result.selected_product_ids.length?result.selected_product_ids:turn.referenced_products.length?turn.referenced_products:newSearch?[]:old.active_product_ids;
 const pregnancy=/\bpost[ -]?partum|after (?:giving birth|childbirth)\b/i.test(message)?'postpartum':/\bbreast[ -]?feed(?:ing)?\b/i.test(message)?'breastfeeding':/\bpregnan(?:t|cy)\b/i.test(message)?'pregnant':old.pregnancy_context;
 const skin=(/\b(oily|dry|combination|sensitive)\s+(?:skin|scalp|hair)\b/i.exec(message)?.[1]??(/^(oily|dry|combination|sensitive)$/i.test(message.trim())?message.trim():undefined))?.toLowerCase()??old.skin_hair_type;
 const priorQuestions=newSearch?[]:old.asked_questions;
 const asked=question?unique([...priorQuestions,question],20):priorQuestions;
 const stage=turn.action==='compare'?'comparing_products':recommendations.length?'recommended':turn.action==='product_question'?'answering_product_question':result.status==='clarify'?'narrowing_products':old.stage;
 const previousHair=old.hair_context??{observed:[],focus:null,flakes:null};
 const observed=[...new Set([...previousHair.observed,...(turn.hair_concerns??[])])].slice(0,6);
 const lastQuestion=old.asked_questions.at(-1)??[...history].reverse().find(item=>item.role==='assistant')?.text??'';
 const flakesAnswer=/dandruff|(?:scalp )?flakes/i.test(lastQuestion)?/^(?:yes|yeah|yep)$/i.test(message.trim())?'yes':/^(?:no|nope)$/i.test(message.trim())?'no':/^(?:not sure|unsure)$/i.test(message.trim())?'unknown':null:null;
 if(flakesAnswer==='yes'&&!observed.includes('flakes')){if(observed.length>=6)observed.shift();observed.push('flakes');}
 const focus=/\b(?:only|just)\b/i.test(message)&&/\b(?:thinn?ing|tinn?nging|hair\s*(?:fall|loss))\b/i.test(message)?'thinning':previousHair.focus;
 const newConcerns=freshContext.concerns.length?freshContext.concerns:turn.concerns;
 const additive=turn.concern_relation==='add'||(/^(?:and|also)\b/i.test(message.trim())&&!/\b(?:instead|only|just|rather)\b/i.test(message));
 return {turn,state:{...old,stage,active_product_ids:active.slice(0,4),recommended_product_ids:newSearch?recommendations:unique([...old.recommended_product_ids,...recommendations],20),concerns:additive&&newConcerns.length?unique([...old.concerns,...newConcerns],12):newConcerns.length?newConcerns:old.concerns,observed_concerns:unique([...(old.observed_concerns??[]),...old.concerns,...newConcerns],20),areas:freshContext.areas.length?freshContext.areas:turn.body_areas.length?turn.body_areas:old.areas,excluded_ingredients:unique([...(old.excluded_ingredients??[]),...exclusions(message),...turn.excluded_ingredients],12),requested_product_type:turn.product_types.map(type=>/^(?:acne|pimple|breakout)s?\s+(?:treatment|care|product|products)$/i.test(type)?null:requestedProductFormat(type)??(normalizeSearch(message).includes(normalizeSearch(type))?type:null)).find(Boolean)??(newSearch?null:old.requested_product_type),skin_hair_type:skin,pregnancy_context:pregnancy,...(observed.length||focus||flakesAnswer||old.hair_context?{hair_context:{observed,focus,flakes:flakesAnswer??previousHair.flakes}}:{}),answered_questions:answered?[...(newSearch?[]:old.answered_questions),answered].slice(-20):newSearch?[]:old.answered_questions,asked_questions:asked,remaining_questions:Math.max(0,3-asked.length)} satisfies ChatState};
}
