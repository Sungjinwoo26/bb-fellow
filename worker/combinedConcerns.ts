import type {ChatState} from '../src/shared/chatState';
import {selectProducts} from './recommendationPipeline';

const patterns={acne:/\b(?:acne|pimples?|breakouts?|bacne)\b/i,pigmentation:/\b(?:pigmentation|uneven (?:skin )?tone|dark marks?)\b/i,odour:/\b(?:odou?r|smell)\b/i,dryness:/\b(?:dry(?:ness)?|dehydrated|flaky skin)\b/i,roughness:/\b(?:rough|bumpy|strawberry skin)\b/i,tanning:/\b(?:tan|tanned|tanning|de[ -]?tan)\b/i,sun:/\b(?:sun protection|sunscreen|spf)\b/i} as const;
export function combinedConcernPatterns(oldConcerns:string[],newConcerns:string[]){
 const classify=(values:string[])=>Object.entries(patterns).filter(([,pattern])=>values.some(v=>pattern.test(v))).map(([key])=>key as keyof typeof patterns);
 const before=classify(oldConcerns),now=classify(newConcerns);
 if(!before.length||!now.length||!now.some(x=>!before.includes(x)))return null;
 const all=[...new Set([...before,...now])];return all.length>=2&&all.length<=4?all.map(key=>patterns[key]):null;
}
export function supportedCombinedProduct(state:ChatState,oldConcerns:string[],newConcerns:string[],kitsOnly=false){
 const all=combinedConcernPatterns(oldConcerns,newConcerns);if(!all||state.areas.length!==1)return null;
 // Only a kit whose own catalogue purpose explicitly covers each concern
 // qualifies; do not infer compatibility between independent products.
 const candidates=selectProducts('',{...state,concerns:[]}).eligible.filter(p=>(!kitsOnly||/\b(?:kit|pack|bundle)\b/i.test(p.name))&&!/\b(?:severe|twin)\b/i.test(`${p.name} ${p.purpose??''}`)&&!!p.purpose&&!p.review_fields.some(x=>x==='purpose'||x.startsWith('purpose.'))&&all.every(pattern=>pattern.test(p.purpose!)));
 return candidates.find(p=>/\b(?:kit|pack|bundle)\b/i.test(p.name))??candidates[0]??null;
}
export const supportedCombinedKit=(state:ChatState,oldConcerns:string[],newConcerns:string[])=>supportedCombinedProduct(state,oldConcerns,newConcerns,true);
