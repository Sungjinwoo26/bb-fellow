import { PHOTO_AREAS, CONCERN_PHOTO_AREA, type PhotoAreaDefinition } from '../data/photoAreas';
import type { ConcernId } from '../data/concerns';
export function getPhotoAreas(selected: readonly string[]): PhotoAreaDefinition[] {
  const ids = new Set(selected.map(id => CONCERN_PHOTO_AREA[id as ConcernId]).filter(Boolean));
  return PHOTO_AREAS.filter(area => ids.has(area.id));
}
