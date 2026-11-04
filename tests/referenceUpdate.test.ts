import { describe, expect, it } from 'vitest';
import references from '../docs/reference-products.json';
import { questions } from '../src/data/questions';

describe('updated assessment reference',()=>{
 it('keeps every product observation explicitly unverified',()=>{expect(references).toHaveLength(12);for(const entry of references){expect(entry.dataStatus).toBe('unverified_reference');expect(entry.referencePriceRupees).toBeGreaterThan(0);}});
 it('offers the requested new answers without guessing the missing hair source questions',()=>{expect(questions.find(q=>q.id==='bumpy_pain_itch')?.options.map(o=>o.id)).toEqual(['yes','no','not_sure']);expect(questions.find(q=>q.id==='body_pigmentation_description')?.options.map(o=>o.id)).toEqual(['dark_spots','dark_patches','not_sure']);expect(questions.find(q=>q.id==='body_care_skin_feel')?.options.map(o=>o.id)).toEqual(['dry','normal','oily','not_sure']);});
});
