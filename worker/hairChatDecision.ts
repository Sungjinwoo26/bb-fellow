import type {ChatState,ChatTurn} from '../src/shared/chatState';
import type {HairConcern} from '../src/shared/hairConcerns';
import {distinctProductSizes,selectProducts} from './recommendationPipeline';
import {matchesProductFormat} from './productMatcher';

type HairProduct=ReturnType<typeof selectProducts>['eligible'][number];
type HairEvidence={product:HairProduct;reason:'hair_thinning'|'hair_shedding'|'scalp_flakes'|'dry_lengths'|'breakage';source_url:string};
const evidencePatterns:Record<Exclude<HairConcern,'fine_hair'|'fall_or_thinning'>,RegExp>={thinning:/\b(?:hair thinning|hair regrowth|new hair growth)\b/i,shedding:/\b(?:hair fall|hairfall|hair shedding)\b/i,flakes:/\b(?:dandruff|scalp flakes|flakiness)\b/i,dry_lengths:/\b(?:frizz|dry (?:and )?damaged hair|dry hair)\b/i,breakage:/\b(?:breakage|damaged hair|damage repair)\b/i};
const reasonMap={thinning:'hair_thinning',shedding:'hair_shedding',flakes:'scalp_flakes',dry_lengths:'dry_lengths',breakage:'breakage'} as const;
/** Chat-specific suggestions based on supported catalogue purposes and mandatory filters. */
export function hairChatCandidates(state:ChatState,turn:ChatTurn,limit=2):HairEvidence[]{
 const observed=[...new Set([...(state.hair_context?.observed??[]),...(turn.hair_concerns??[])])];
 const focus=state.hair_context?.focus;const selected=focus?[focus]:observed;const goals=selected.flatMap(x=>x==='fall_or_thinning'?['shedding' as const,'thinning' as const]:x==='fine_hair'?[]:[x]).sort((a,b)=>(a==='flakes'?-1:0)-(b==='flakes'?-1:0));
 const all=selectProducts('hair scalp',{...state,areas:['hair']}).eligible.filter(p=>!!p.purpose&&!p.review_fields.some(f=>f==='purpose'||f.startsWith('purpose.'))&&!/\b(?:kit|pack|bundle|gumm(?:y|ies)|ketoconazole)\b/i.test(p.name));
 const output:HairEvidence[]=[];const seenNames=new Set<string>();
 for(const goal of goals){const matches=distinctProductSizes(all.filter(p=>evidencePatterns[goal].test(`${p.name} ${p.purpose}`))).filter(p=>!state.requested_product_type||matchesProductFormat(p,state.requested_product_type));
  for(const product of matches){const family=product.name.toLowerCase().replace(/\b(?:roll[ -]?on|dropper|spray|\d+(?:\.\d+)?\s*(?:ml|g))\b/gi,' ').replace(/[^a-z]+/g,' ').replace(/\s+/g,' ').trim();if(seenNames.has(family))continue;seenNames.add(family);output.push({product,reason:reasonMap[goal],source_url:product.source_url});if(output.length>=limit)return output;break;}
 }
 return output;
}

/** Find catalogue-supported options for several stated concerns. A kit is
 * offered only when its own purpose supports both dandruff and hair fall. */
export function combinedHairCandidates(state:ChatState,turn:ChatTurn):HairProduct[]{
 const observed=[...new Set([...(state.hair_context?.observed??[]),...(turn.hair_concerns??[])])];
 const hasFlakes=observed.includes('flakes');
 const hasFall=observed.some(x=>x==='shedding'||x==='fall_or_thinning');
 const unrestricted=!state.requested_product_type;
 const eligible=selectProducts('hair scalp',{...state,areas:['hair']}).eligible;
 const kit=unrestricted&&hasFlakes&&hasFall?eligible.find(p=>/\b(?:kit|pack|bundle)\b/i.test(p.name)&&/\b(?:dandruff|flakes)\b/i.test(p.purpose??'')&&/\bhair\s*fall\b/i.test(p.purpose??'')&&!p.review_fields.some(f=>f==='purpose'||f.startsWith('purpose.'))):undefined;
 if(!kit)return hairChatCandidates({...state,hair_context:{observed,focus:null,flakes:state.hair_context?.flakes??null}},{...turn,hair_concerns:[]},3).map(x=>x.product);
 const remaining=observed.filter(x=>!['flakes','shedding','fall_or_thinning'].includes(x));
 const others=remaining.length?hairChatCandidates({...state,hair_context:{observed:remaining,focus:null,flakes:state.hair_context?.flakes??null}},{...turn,hair_concerns:[]},2).map(x=>x.product):[];
 return [kit,...others].slice(0,3);
}
