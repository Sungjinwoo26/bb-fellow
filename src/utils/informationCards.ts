import type { RecommendationResult } from '../shared/recommendations';
import type { ConcernId } from '../data/concerns';
import { concernText } from './preparation';
type Card={title:string;body:string};
export function informationCards(selected:ConcernId[],result:RecommendationResult|null):Card[] {
 const cards:Card[]=[{title:'Concerns being considered',body:concernText(selected)}];
 const ingredients=result?.items.map(i=>i.product.ingredientSummaryApproved === true ? i.product.ingredientSummary?.trim() : undefined).filter((v):v is string=>!!v) ?? [];
 const guidance=result?.items.map(i=>i.product.usageGuidanceApproved === true ? i.product.usageGuidance?.trim() : undefined).filter((v):v is string=>!!v) ?? [];
 if(ingredients.length)cards.push({title:'Ingredients to know',body:[...new Set(ingredients)].join(' ')});
 if(guidance.length)cards.push({title:'Usage and results',body:[...new Set(guidance)].join(' ')+' Experiences and results can vary.'});
 return cards;
}
