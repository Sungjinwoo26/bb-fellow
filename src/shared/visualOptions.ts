import type { PhotoAreaId } from '../data/photoAreas';
export const VISUAL_OPTIONS = { visible_bumps:'Visible bumps', visible_marks:'Visible marks', uneven_looking_tone:'Uneven-looking tone', visible_flakes:'Visible flakes' } as const;
export type VisualOptionId = keyof typeof VISUAL_OPTIONS;
export const AREA_ALLOWED_OPTIONS: Record<PhotoAreaId, VisualOptionId[]> = {
 affected_body:['visible_bumps','visible_marks','uneven_looking_tone'], elbows_knees_neck:['visible_marks','uneven_looking_tone'], underarms:['visible_marks','uneven_looking_tone'], sun_exposed_area:['visible_marks','uneven_looking_tone'], face:['visible_bumps','visible_marks','uneven_looking_tone'], scalp_hair:['visible_flakes'],
};
export const VISUAL_LABEL_CONFIG: {optionId: VisualOptionId; autoPreselectEnabled:boolean; evaluationReference:string|null}[] = (Object.keys(VISUAL_OPTIONS) as VisualOptionId[]).map(optionId => ({optionId,autoPreselectEnabled:false,evaluationReference:null}));
export type PhotoObservation = {optionId:VisualOptionId; status:'suggested'|'uncertain'|'not_observed'};
export type AnalysisResponse = {analysisId:string; area:PhotoAreaId; status:'complete'|'unusable_image'; observations:PhotoObservation[]};
export function preselected(observations: PhotoObservation[], config = VISUAL_LABEL_CONFIG): VisualOptionId[] { return observations.filter(o => o.status === 'suggested' && config.some(c => c.optionId === o.optionId && c.autoPreselectEnabled && !!c.evaluationReference)).map(o => o.optionId); }
