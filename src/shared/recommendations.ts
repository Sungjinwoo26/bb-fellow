import type { ConcernId } from '../data/concerns';
import type { PhotoAreaId } from '../data/photoAreas';
import type { VisualOptionId } from './visualOptions';
type AnswerValue = string | string[] | null;
type ConfirmedPhotoSelection = {areaId:PhotoAreaId;selectedOptionIds:VisualOptionId[];notSure:boolean;source:'user_confirmed_photo_review'};
export type RecommendationRequest={sessionId:string;selectedConcerns:ConcernId[];answers:Record<string,AnswerValue>;confirmedPhotoSelections:ConfirmedPhotoSelection[]};
export type PublicProduct={id:string;name:string;variant:string;pricePaise:number;currency:'INR';imagePath:string;dataStatus:'unverified_demo'|'verified';ingredientSummary?:string|null;ingredientSummaryApproved?:boolean;usageGuidance?:string|null;usageGuidanceApproved?:boolean};
export type RecommendationResult={catalogueVersion:string;rulesVersion:string;currency:'INR';items:{product:PublicProduct;quantity:1;matchedConcernIds:ConcernId[];reasons:string[]}[];unmatchedConcernIds:ConcernId[]};
