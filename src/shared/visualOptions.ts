import type { PhotoAreaId } from '../data/photoAreas';
export const VISUAL_OPTIONS = { visible_bumps:'Visible bumps (including acne-like bumps)', visible_spots:'Individual visible spots', visible_marks:'Visible marks', uneven_looking_tone:'Uneven-looking tone', visible_flakes:'Visible flakes', visible_frizz:'Visible frizz or flyaways', surface_shine:'Visible surface shine' } as const;
export type VisualOptionId = keyof typeof VISUAL_OPTIONS;
export const AREA_ALLOWED_OPTIONS: Record<PhotoAreaId, VisualOptionId[]> = {
 affected_body:['visible_bumps','visible_marks','uneven_looking_tone'], elbows_knees_neck:['visible_marks','uneven_looking_tone'], underarms:['visible_marks','uneven_looking_tone'], sun_exposed_area:['visible_marks','uneven_looking_tone'], face:['visible_bumps','visible_spots','visible_marks','uneven_looking_tone','surface_shine'], scalp_hair:['visible_flakes','visible_frizz'],
};
export type PhotoObservation = {optionId:VisualOptionId; status:'suggested'|'uncertain'|'not_observed'; boxes?: number[][]};
export type AnalysisResponse = {analysisId:string; area:PhotoAreaId; status:'complete'|'unusable_image'; observations:PhotoObservation[]};
export function preselected(observations: PhotoObservation[]): VisualOptionId[] { return observations.filter(o => o.status === 'suggested').map(o => o.optionId); }
