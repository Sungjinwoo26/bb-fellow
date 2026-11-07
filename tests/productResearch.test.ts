import { describe, expect, it } from 'vitest';
import products from '../worker/data/chatProducts.json';
import report from '../research/product-coverage-summary.json';
describe('researched product catalogue',()=>{
 it('keeps all 56 unique product variants and provenance',()=>{expect(products).toHaveLength(56);expect(new Set(products.map(p=>p.id)).size).toBe(56);for(const p of products)expect(p.source_url).toMatch(/^https:\/\/bebodywise\.com\/product\//);});
 it('records the research findings without treating missing data as complete',()=>{expect(report.research_fields_added).toBe(3);expect(report.remaining_missing_field_entries).toBe(586);const shampoo=products.find(p=>p.id==='1-zpto-anti-dandruff-shampoo')!;expect(shampoo.warnings).toContain('injured');const rollon=products.find(p=>p.id==='6-aha-bha-underarm-roll-on-flora-75ml')!;expect(rollon.warnings).toContain('broken');});
 it('retains dosage conflicts without presenting a single assumed amount',()=>{const serum=products.find(p=>p.id==='anti-frizz-serum')!;expect(serum.usage_fields).not.toHaveProperty('amount');expect(serum.demo_assumption).toContain('2–3');expect(serum.demo_assumption).toContain('1–2');});
});
