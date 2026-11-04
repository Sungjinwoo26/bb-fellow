import type { PhotoAreaId } from '../data/photoAreas';
import type { PhotoObservation, VisualOptionId } from '../shared/visualOptions';
export type AreaAnalysis = { revision:string; status:'waiting'|'analysing'|'complete'|'unusable_image'|'failed'|'skipped'; observations:PhotoObservation[]; selectedOptionIds:VisualOptionId[]; notSure:boolean; confirmed:boolean };
export type Analyses = Partial<Record<PhotoAreaId, AreaAnalysis>>;
export type ConfirmedPhotoSelection = {areaId:PhotoAreaId;selectedOptionIds:VisualOptionId[];notSure:boolean;source:'user_confirmed_photo_review'};
export function toggleReviewOption(item:AreaAnalysis, id:VisualOptionId):AreaAnalysis { return {...item, selectedOptionIds:item.selectedOptionIds.includes(id) ? item.selectedOptionIds.filter(x=>x!==id) : [...item.selectedOptionIds,id],notSure:false,confirmed:false}; }
export function toggleNotSure(item:AreaAnalysis):AreaAnalysis { return {...item,notSure:!item.notSure,selectedOptionIds:[],confirmed:false}; }
