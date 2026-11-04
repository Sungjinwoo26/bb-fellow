export type ProcessedPhoto = { blob: Blob; width: number; height: number; mimeType: 'image/jpeg' };
export const MAX_INPUT_BYTES = 10 * 1024 * 1024;
export const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const INVALID_IMAGE = 'We couldn’t use this image. Please choose a JPEG, PNG, or WebP photo, or take a new photo.';
export const PROCESSING_ERROR = 'We couldn’t prepare this photo. Try a smaller image, take another photo, or skip this step.';
export function fittedDimensions(width: number, height: number, max = 1600) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}
function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error(PROCESSING_ERROR)), 'image/jpeg', quality));
}
export async function processPhoto(file: File): Promise<ProcessedPhoto> {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error(INVALID_IMAGE);
  if (file.size > MAX_INPUT_BYTES) throw new Error('This photo is larger than 10 MB. Choose a smaller image or take another photo.');
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file, { imageOrientation:'from-image' }); } catch { throw new Error(INVALID_IMAGE); }
  try {
    if (!bitmap.width || !bitmap.height) throw new Error(PROCESSING_ERROR);
    let { width, height } = fittedDimensions(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d'); if (!context) throw new Error(PROCESSING_ERROR);
    for (let attempt = 0; attempt < 6; attempt++) {
      canvas.width = width; canvas.height = height;
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, width, height); context.drawImage(bitmap, 0, 0, width, height);
      for (const quality of [0.85, 0.75, 0.65]) {
        const blob = await encode(canvas, quality);
        if (blob.type === 'image/jpeg' && blob.size <= MAX_OUTPUT_BYTES) return { blob, width, height, mimeType:'image/jpeg' };
      }
      width = Math.max(1, Math.round(width * 0.8)); height = Math.max(1, Math.round(height * 0.8));
    }
    throw new Error(PROCESSING_ERROR);
  } catch { throw new Error(PROCESSING_ERROR); } finally { bitmap.close(); }
}
