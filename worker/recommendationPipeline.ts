import { catalogue } from './catalogue';
import { matchesProductFormat, rankProducts, requestedProductFormat, normalizeSearch } from './productMatcher';
import type { ChatState } from '../src/shared/chatState';
import { productDescription } from './concernFlow';

type Item=(typeof catalogue)[number];
export type ProductCard={id:string;name:string;category:string;image_url:string;url:string;reason:string};
export type Decision={eligible:Item[];ranked:{product:Item;reason_codes:string[]}[];excluded:{id:string;reasons:string[]}[]};
export function distinctProductSizes<T extends {name:string}>(products:T[]):T[]{
 const seen=new Set<string>();return products.filter(product=>{const key=normalizeSearch(product.name.replace(/\breference\s+page\s+[a-z0-9]+\b/gi,'').replace(/\b\d+(?:\.\d+)?\s*(?:ml|mL|g|gm|grams?|pcs|pieces)\b/gi,'').replace(/[()\-–—]+/g,' '));if(seen.has(key))return false;seen.add(key);return true;});
}
const allowedUrl=(url:string)=>{try{const u=new URL(url);return u.protocol==='https:'&&u.hostname==='bebodywise.com'&&u.pathname.startsWith('/product/')}catch{return false}};
const norm=(s:string)=>normalizeSearch(s);
export function exclusions(message:string){
 const result:string[]=[];
 for(const m of message.matchAll(/\b(?:avoid|without|allergic to|allergy to|sensitive to|no)\s+(fragrance|perfume|salicylic acid|niacinamide|retinol|lactic acid|glycolic acid|urea|sulfates?|sulphates?|parabens?)\b/gi)) result.push(norm(m[1]));
 if(/\b(?:fragrance|perfume)[ -]?free\b/i.test(message))result.push('fragrance');
 return [...new Set(result.map(x=>x==='perfume'?'fragrance':x))];
}
function wantedArea(message:string,state:ChatState):string|null {
 const s=norm(message);
 if(/\b(underarm|underarms|armpit|armpits)\b/.test(s))return 'underarm';
 if(/\b(face|facial|cheek|forehead)\b/.test(s)&&!/\b(?:no|not|without|exclude)\s+(?:the\s+)?(?:face|facial)\b/.test(s))return 'face';
 if(/\b(scalp|hair)\b/.test(s))return 'hair';
 if(/\b(body|back|chest|legs|arms)\b/.test(s))return 'body';
 const areas=state.areas;return areas.length===1?({scalp:'hair',underarms:'underarm'} as Record<string,string>)[areas[0]]??areas[0]:null;
}
export function selectProducts(message:string,state:ChatState):Decision {
 const savedFormat=state.requested_product_type;const format=requestedProductFormat(message)??(savedFormat&&/^(?:acne|pimple|breakout)s?\s+(?:treatment|care|product|products)$/i.test(savedFormat)?null:savedFormat);const area=wantedArea(message,state);const omitted=[...new Set([...(state.excluded_ingredients??[]),...exclusions(message)])];
 const pregnancy=/\bpregnan|breast.?feed|post.?partum\b/i.test(message)||!!state.pregnancy_context;
 const rejected=new Set(state.rejected_product_ids);const eligible:Item[]=[];const excluded:Decision['excluded']=[];
 for(const p of catalogue){const reasons:string[]=[];const name=norm(p.name);const category=norm(p.category);const usage=norm(p.usage_fields.application_area??'');
  if(!allowedUrl(p.source_url))reasons.push('invalid_source');
  if(!p.storefront_variants.some(v=>v.available))reasons.push('availability_unknown_or_unavailable');
  if(rejected.has(p.id))reasons.push('previously_rejected');
  if(format&&!matchesProductFormat(p,format))reasons.push('format');
  if(area==='face'&&!/\b(face|facial)\b/.test(`${category} ${name} ${usage}`))reasons.push('area');
  if(area==='face'&&/\bbody\b/.test(norm(p.purpose??''))&&!/\b(?:face|facial)\b/.test(norm(p.purpose??'')))reasons.push('face_purpose_unconfirmed');
  if(area==='hair'&&!/\b(hair|scalp)\b/.test(`${category} ${name} ${usage}`))reasons.push('area');
  if(area==='underarm'&&!/\b(underarm|armpit)\b/.test(`${name} ${usage}`))reasons.push('area');
  if(area==='body'&&/\bface\b/.test(category)&&!/\bbody\b/.test(`${name} ${usage}`))reasons.push('area');
  const productPregnancy=/\b(post pregnancy|postpartum|pregnan|breastfeeding)\b/.test(name);
  if(productPregnancy&&!pregnancy)reasons.push('pregnancy_context');
  // Individual product suitability in pregnancy cannot be inferred from a name.
  if(pregnancy){const guidance=`${p.warnings??''} ${p.notes??''}`;if(!/\b(?:safe|suitable)\s+(?:for|during)\s+(?:pregnan|breast.?feed)/i.test(guidance)||/\b(?:not|unsafe|avoid|contraindicated)\b.{0,45}\b(?:pregnan|breast.?feed)/i.test(guidance))reasons.push('pregnancy_suitability_unverified');}
  for(const avoid of omitted){const full=p.full_ingredients;if(!full||/^(patch tests|be bodywise|bodywise|to see|how to|we recommend|if you|you can|step\s*\d)/i.test(full.trim())||p.review_fields.some(x=>x.startsWith('full_ingredients'))){reasons.push(`ingredient_unknown:${avoid}`);continue}const hay=norm(full);if(avoid==='fragrance'?/\b(fragrance|parfum|perfume)\b/.test(hay):hay.includes(avoid))reasons.push(`ingredient_excluded:${avoid}`)}
  if(reasons.length)excluded.push({id:p.id,reasons});else eligible.push(p);
 }
 const q=norm(message);const concern=/\b(dry|dryness|dehydrated)\b/.test(q)?/\b(dry|dryness|dehydrated|hydrating|hydration)\b/:/\b(dandruff|flakes|flaking)\b/.test(q)?/\b(dandruff|flakes|flaking)\b/:/\b(acne|pimples?|breakouts?)\b/.test(q)?/\b(acne|pimple|breakout)\b/:/\b(odour|odor|smell)\b/.test(q)?/\b(odour|odor|smell)\b/:null;
 const relevant=distinctProductSizes(rankProducts(message,eligible).filter(p=>!!p.purpose&&(!concern||concern.test(norm(`${p.name} ${p.purpose}`)))));
 return {eligible,excluded,ranked:relevant.map(product=>({product,reason_codes:[...(format?['requested_format']:[]),...(area?['requested_area']:[]),'catalogue_relevance']}))};
}
const displayName=(name:string)=>name.replace(/\s*[—–-]\s*reference\s+page\s+[a-z0-9]+\s*$/i,'').trim();
export function cardsFor(items:Item[]):ProductCard[]{return items.filter(p=>allowedUrl(p.source_url)).map(p=>({id:p.id,name:displayName(p.name),category:p.category,image_url:p.image_url,url:p.source_url,reason:p.purpose??'Product information is limited.'}));}
export function deterministicRecommendations(items:Item[]){return items.map(p=>`**${displayName(p.name)}:** ${productDescription(p)}`).join('\n\n');}
export function deterministicComparison(items:Item[],message:string){
 const showPrices=/\b(prices?|costs?|mrp|how much)\b/i.test(message);
 const showIngredients=/\b(ingredients?|contains?|formulation)\b/i.test(message);
 const showUsage=/\b(how (?:do|can|should)|how to use|how often|usage|apply)\b/i.test(message);
 const showTimeline=/\b(results?|how long|how soon|timeline)\b/i.test(message);
 const showFragrance=/\b(fragrance|perfume|parfum|scented|unscented)\b/i.test(message);
 const lines=items.map(p=>{const prices=[...new Set(p.storefront_variants.filter(v=>v.available).map(v=>v.price).filter(x=>/^₹[\d,]+(?:\.\d+)?$/.test(x)))];const info=[`**${p.name}:** ${p.purpose??'The catalogue does not state its use.'}`];
  if(showPrices)info.push(`Catalogue price: ${prices.length===1?prices[0]:'not confirmed for this variant'}.`);
  if(showIngredients)info.push(`Ingredients: ${p.ingredients&&!p.review_fields.some(x=>x.startsWith('ingredients'))?p.ingredients:'not confirmed in the catalogue'}.`);
  if(showUsage)info.push(`Use: ${p.usage&&!p.review_fields.some(x=>x.startsWith('usage'))?p.usage:'not confirmed in the catalogue'}.`);
  if(showTimeline)info.push(`Timeline: ${p.timeline&&!p.review_fields.some(x=>x.startsWith('timeline'))?p.timeline:'not confirmed in the catalogue'}.`);
  if(showFragrance){
   const ingredients=p.full_ingredients;
   const underReview=p.review_fields.some(x=>/^(?:full_ingredients|ingredients\.full_list|variant\.fragrance|ingredient\/fragrance)/.test(x));
   const corrected=/corrected using product-owner clarification/i.test(p.notes??'');
   if(corrected&&ingredients&&!/\b(?:fragrance|perfume|parfum)\b/i.test(ingredients))info.push('Fragrance: the product-owner clarification says it does not contain added perfume.');
   else if(!ingredients||underReview)info.push('Fragrance: not confirmed for this variant; check the label.');
   else if(/\b(?:fragrance|perfume|parfum)\b/i.test(ingredients))info.push('Fragrance: the stored ingredient list includes perfume or fragrance.');
   else info.push('Fragrance: no perfume or fragrance is listed in the stored full ingredient list.');
  }
  return info.join(' ')});
 if(/\b(better|best|choose|which|recommend|winner)\b/i.test(message))lines.push('The available product information does not establish which is better for your individual needs.');
 return lines.join('\n\n');
}
