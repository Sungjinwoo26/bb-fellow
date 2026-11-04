export const concerns = [
  { id: 'body_acne_marks', label: 'Body Acne & Marks' },
  { id: 'strawberry_bumpy_skin', label: 'Strawberry Legs or Bumpy Skin' },
  { id: 'body_pigmentation', label: 'Pigmentation on Elbows/Knees/Neck' },
  { id: 'underarm_pigmentation', label: 'Underarm Pigmentation' },
  { id: 'body_odour', label: 'Body Odour' },
  { id: 'tanning_sun_damage', label: 'Tanning & Sun Damage' },
  { id: 'general_body_care', label: 'General Body Care' },
  { id: 'face', label: 'Face' },
  { id: 'hair', label: 'Hair' },
] as const;
export type ConcernId = typeof concerns[number]['id'];
export function canonicalConcerns(ids: readonly string[]): ConcernId[] { return concerns.filter(c => ids.includes(c.id)).map(c => c.id); }
