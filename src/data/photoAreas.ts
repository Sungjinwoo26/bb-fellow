import type { ConcernId } from './concerns';
export const PHOTO_AREAS = [
  { id:'affected_body', label:'Affected body area', description:'For example, your back, chest, arms, legs, or another relevant area.' },
  { id:'elbows_knees_neck', label:'Elbows, knees, or neck', description:'' },
  { id:'underarms', label:'Underarms', description:'' },
  { id:'sun_exposed_area', label:'Area affected by tanning or sun exposure', description:'' },
  { id:'face', label:'Face', description:'' },
  { id:'scalp_hair', label:'Scalp or hairline', description:'' },
] as const;
export type PhotoAreaId = typeof PHOTO_AREAS[number]['id'];
export type PhotoAreaDefinition = typeof PHOTO_AREAS[number];
export const PHOTO_AREA_ORDER: PhotoAreaId[] = PHOTO_AREAS.map(area => area.id);
export const CONCERN_PHOTO_AREA: Partial<Record<ConcernId, PhotoAreaId>> = { body_acne_marks:'affected_body', strawberry_bumpy_skin:'affected_body', body_pigmentation:'elbows_knees_neck', underarm_pigmentation:'underarms', tanning_sun_damage:'sun_exposed_area', general_body_care:'affected_body', face:'face', hair:'scalp_hair' };
