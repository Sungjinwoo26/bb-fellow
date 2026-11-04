import type { PhotoAreaId } from '../data/photoAreas';
import type { ProcessedPhoto } from '../services/imageProcessing';
export type InMemoryPhoto = ProcessedPhoto & { areaId: PhotoAreaId; previewUrl: string; revision: string };
// All image bytes and object URLs have one owner, never the serialized session.
export class PhotoStore {
  private photos: Partial<Record<PhotoAreaId, InMemoryPhoto>> = {};
  private generations: Partial<Record<PhotoAreaId, number>> = {};
  getPhoto(id: PhotoAreaId) { return this.photos[id]; }
  begin(id: PhotoAreaId) { const token = (this.generations[id] ?? 0) + 1; this.generations[id] = token; return token; }
  invalidate(id: PhotoAreaId) { this.begin(id); }
  setPhoto(id: PhotoAreaId, photo: ProcessedPhoto, token: number) {
    if (this.generations[id] !== token) return false;
    const previewUrl = URL.createObjectURL(photo.blob);
    const old = this.photos[id]; this.photos[id] = { ...photo, areaId:id, previewUrl, revision:crypto.randomUUID() };
    if (old) URL.revokeObjectURL(old.previewUrl);
    return true;
  }
  removePhoto(id: PhotoAreaId) { this.invalidate(id); const old = this.photos[id]; if (old) URL.revokeObjectURL(old.previewUrl); delete this.photos[id]; }
  retain(ids: readonly PhotoAreaId[]) { for (const id of Object.keys(this.generations) as PhotoAreaId[]) if (!ids.includes(id)) this.removePhoto(id); }
  clearPhotos() { for (const id of Object.keys(this.generations) as PhotoAreaId[]) this.removePhoto(id); }
}
