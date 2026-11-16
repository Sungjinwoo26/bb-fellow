import type {ChatState,ChatTurn} from '../src/shared/chatState';
import {selectProducts,distinctProductSizes} from './recommendationPipeline';
import {matchesProductFormat} from './productMatcher';
type Policy={question:string;choices:string[];patterns:RegExp[];area:'body'|'underarm'};
const policies:Record<string,Policy>={
 acne:{question:'What would you like to focus on for your body skin?',choices:['Active breakouts','Marks after breakouts','Both','Not sure'],patterns:[/body acne|body wash.*acne/i,/acne marks/i,/body acne|acne marks/i,/body acne|acne marks/i],area:'body'},
 strawberry:{question:'What are you noticing most on your skin?',choices:['Rough bumps','Dryness as well','Not sure'],patterns:[/strawberry|keratosis|bumpy skin/i,/strawberry|keratosis|bumpy skin/i,/strawberry|keratosis|bumpy skin/i],area:'body'},
 pigmentation:{question:'Where would you like help with uneven-looking skin tone?',choices:['Underarms','Other body areas','Not sure'],patterns:[/underarm.*pigmentation|pigmentation.*underarm/i,/body pigmentation|pigmentation.*body/i,/body pigmentation|pigmentation.*body/i],area:'body'},
 underarm:{question:'What would you like help with under your arms?',choices:['Pigmentation','Odour','Both','Not sure'],patterns:[/underarm.*pigmentation|pigmentation.*underarm/i,/underarm.*odour|odour.*underarm/i,/underarm.*(?:pigmentation|odour)|(?:pigmentation|odour).*underarm/i,/underarm.*(?:pigmentation|odour)|(?:pigmentation|odour).*underarm/i],area:'underarm'},
 odour:{question:'Where do you notice the odour?',choices:['Underarms','Another area','Not sure'],patterns:[/underarm.*odour|odour.*underarm/i,/$a/,/$a/],area:'body'},
 dry:{question:'Where would you like help with dryness?',choices:['Body skin','Rough or cracked heels','Not sure'],patterns:[/dry skin|dryness/i,/cracked.*heels|rough.*heels/i,/dry skin|dryness/i],area:'body'},
 bodycare:{question:'What would you like help with for your body skin?',choices:['Dry body skin','Rough or cracked heels','Stretch marks','Everyday cleansing','Not sure'],patterns:[/dry skin|dryness/i,/cracked.*heels|rough.*heels/i,/stretch mark/i,/body wash.*dry|body wash.*hydrat/i,/$a/],area:'body'},
};
export function bodyPolicy(message:string,turn:ChatTurn,historyQuestion:string):{category:string;choice:number|null;followup?:boolean;format_override?:string}|null{
 if(historyQuestion==='Would you like to see heel roll-ons instead?'&&/^(?:yes|yes please|show heel roll-ons)$/i.test(message.trim()))return {category:'dry',choice:1,followup:true,format_override:'roll on'};
 if(historyQuestion==='Would you like to see heel roll-ons instead?'&&/^(?:no|no thanks)$/i.test(message.trim()))return {category:'heel_alternative_declined',choice:null,followup:true};
 if(historyQuestion===policies.acne.question&&/^(?:(?:on|around)\s+)?(?:my\s+)?(?:back|chest|shoulders|arms|legs)[.!]?$/i.test(message.trim()))return {category:'acne',choice:null,followup:true};
 if(historyQuestion==='Are the marks left by breakouts, or are you noticing uneven skin tone?' ){
  if(/^marks after breakouts$/i.test(message.trim()))return {category:'acne',choice:1,followup:true};
  if(/^uneven skin tone$/i.test(message.trim()))return {category:'pigmentation',choice:null,followup:true};
  if(/^not sure$/i.test(message.trim()))return {category:'marks_unknown',choice:null,followup:true};
 }
 for(const [key,policy] of Object.entries(policies)){if(historyQuestion===policy.question){const index=policy.choices.findIndex(x=>x.toLowerCase()===message.trim().toLowerCase());if(index>=0)return {category:key,choice:index,followup:true};}}
 if(historyQuestion==='Which area do you notice the odour in?'&&/^(?:my |on my |the )?(?:underarms?|armpits?|feet|foot|hands?|legs?|chest|back|groin|body|not sure|unsure)[.!]?$/i.test(message.trim()))return {category:'odour',choice:/underarms?|armpits?/i.test(message)?0:3,followup:true};
 if(/^(?:body|my body|on my body|back|chest)$/i.test(message.trim())){if(historyQuestion==='Where are you noticing the acne?')return {category:'acne',choice:null};if(historyQuestion==='Where are you noticing the pigmentation?')return {category:'pigmentation',choice:null};if(historyQuestion==='Where are you noticing the dryness?')return {category:'dry',choice:null};}
 if(/\b(?:ingredients?|how (?:do|can|should) i use|how to use|price|cost|compare|versus|vs|difference|interact|mix)\b/i.test(message))return null;
 const text=message.toLowerCase();const body=/\b(?:body|boddy|back|chest|shoulders|arms|legs|elbows|knees|neck)\b/.test(text);const under=/\b(?:underarm|armpit)s?\b/.test(text);const interpreted=turn.concerns.map(c=>c.toLowerCase().replace(/[_-]+/g,' ')).join(' ');
 if(body&&/\bmarks?\b/.test(text)&&!/\b(?:acne|breakouts?|pimples?|stretch)\b/.test(text))return {category:'marks',choice:null};
 if(/\bstretch marks?\b/.test(text))return {category:'bodycare',choice:2};
 if(/strawberry (?:skin|legs)|keratosis pilaris/.test(text))return {category:'strawberry',choice:null};
 if(under&&/pigment|dark|uneven|odou?r|smell/.test(text)){const pigmentation=/pigment|dark|uneven/.test(text),odour=/odou?r|smell/.test(text);return {category:'underarm',choice:pigmentation&&odour?2:pigmentation?0:1};}
 if(body&&/acne|pimples?|breakouts?|bacne/.test(text))return {category:'acne',choice:null};
 if(body&&/pigment|dark (?:elbows|knees|neck)|uneven (?:tone|skin)/.test(text))return {category:'pigmentation',choice:/\b(?:elbows|knees|neck|arms|legs)\b/.test(text)?1:null};
 if((body||/heels?|feet/.test(text))&&/dry|rough|cracked/.test(text))return {category:'dry',choice:/\b(?:heels?|feet)\b/.test(text)?1:/\bbody skin\b/.test(text)?0:null};
 if(/\bbody odou?r\b|\bbody smell\b/.test(text))return {category:'odour',choice:null};
 if(/\bbody care\b/.test(text)&&/\b(?:need|want|help|recommend|suggest|looking)\b/.test(text))return {category:'bodycare',choice:null};
 if(body&&/strawberry|bumpy skin/.test(interpreted))return {category:'strawberry',choice:null};
 if(under&&/pigment|odou?r/.test(interpreted))return {category:'underarm',choice:null};
 if(body&&/acne|pimples?|breakouts?/.test(interpreted))return {category:'acne',choice:null};
 if(body&&/pigment|uneven tone/.test(interpreted))return {category:'pigmentation',choice:null};
 if(body&&/dryness|dry skin/.test(interpreted))return {category:'dry',choice:null};
 return null;
}
export function bodyDecision(category:string,choice:number|null,state:ChatState,turn:ChatTurn){
 if(category==='heel_alternative_declined')return {products:[],question:null,choices:[],area:'body',reason:'alternative_declined'};
 if(category==='marks')return {products:[],question:'Are the marks left by breakouts, or are you noticing uneven skin tone?',choices:['Marks after breakouts','Uneven skin tone','Not sure'],area:'body',reason:'marks_type_needed'};
 if(category==='marks_unknown')return {products:[],question:'Could you describe what the marks look like?',choices:[],area:'body',reason:'marks_detail_needed'};
 const policy=policies[category];if(!policy)return null;
 if(category==='odour'&&choice===1)return {products:[],question:'Which area do you notice the odour in?',choices:[],area:'body',reason:'area_needed'};
 if(category==='odour'&&choice===3)return {products:[],question:null,choices:[],area:'body',reason:'area_not_confirmed'};
 const areas=category==='odour'&&(choice===null||choice===0)||category==='pigmentation'&&choice===0?['underarm']:[policy.area];
 const stateForSearch={...state,areas,concerns:[],excluded_ingredients:[...new Set([...(state.excluded_ingredients??[]),...turn.excluded_ingredients])]};
 const candidates=selectProducts(areas[0],stateForSearch).eligible.filter(p=>!!p.purpose&&!p.review_fields.some(f=>f==='purpose'||f.startsWith('purpose.'))&&!/\b(?:severe|benzoyl peroxide|kit|pack|bundle)\b/i.test(`${p.name} ${p.purpose}`)&&(areas[0]!=='body'||/\bbody\b/i.test(`${p.category} ${p.name}`))&&(!(category==='dry'||category==='bodycare'&&choice===0)||!/\b(?:acne|breakouts?)\b/i.test(`${p.name} ${p.purpose}`))&&(!(category==='bodycare'&&choice===3)||!/\b(?:salicylic|aha|bha|exfoliat|acne)\b/i.test(`${p.name} ${p.purpose}`)));
 const find=(pattern:RegExp)=>distinctProductSizes(candidates.filter(p=>pattern.test(`${p.name} ${p.purpose}`))).filter(p=>!state.requested_product_type||matchesProductFormat(p,state.requested_product_type)).slice(0,2);
 const acneMix=()=>[...new Map([find(policy.patterns[0])[0],find(policy.patterns[1])[0]].filter((p):p is NonNullable<typeof p>=>!!p).map(p=>[p.id,p])).values()];
 const products=category==='acne'&&(choice===null||choice===2||choice===3)?acneMix():choice===null?(category==='bodycare'?[]:find(category==='pigmentation'?policy.patterns[1]:category==='strawberry'||category==='odour'?policy.patterns[0]:new RegExp(policy.patterns.map(p=>p.source).join('|'),'i'))):find(policy.patterns[choice]);
 if(category==='dry'&&choice===1&&state.requested_product_type==='cream'&&!products.length){const alternatives=selectProducts('body',{...stateForSearch,requested_product_type:'roll on'}).eligible;const available=distinctProductSizes(alternatives.filter(p=>!!p.purpose&&!p.review_fields.some(f=>f==='purpose'||f.startsWith('purpose.'))&&!/\b(?:severe|kit|pack|bundle)\b/i.test(`${p.name} ${p.purpose}`)&&policy.patterns[1].test(`${p.name} ${p.purpose}`)&&matchesProductFormat(p,'roll on')));if(available.length)return {products:[],question:'I couldn’t confirm a heel cream. Would you like to see heel roll-ons instead?',choices:['Yes','No'],area:'body',reason:'alternative_format_available'};}
 const outcomes=policy.patterns.map(pattern=>find(pattern).map(p=>p.id).sort().join('|'));
 const ask=choice===null&&category!=='odour'&&new Set(outcomes).size>1;
 return {products,question:ask?policy.question:null,choices:ask?policy.choices:[],area:areas[0],reason:products.length?'catalogue_match':'no_supported_match'};
}
