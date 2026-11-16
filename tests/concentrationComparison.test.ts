import { describe, expect, it } from 'vitest';
import { catalogueById } from '../worker/catalogue';
import { addConcentrationContext } from '../worker/concentrationComparison';

const get=(id:string)=>catalogueById.get(id)!;
const message=(ids:string[])=>ids.map(id=>`**${get(id).name}:** An option.`).join('\n\n');

describe('concentration descriptions',()=>{
 it('does not invent a suitability difference for the underarm roll-ons',()=>{
  const ids=['4-aha-bha-underarm-roll-on','6-aha-bha-underarm-roll-on-flora-75ml'];
  const answer=addConcentrationContext(message(ids),ids.map(get));
  expect(answer).toContain('product information does not say which is better');
  expect(answer).not.toMatch(/gentler|stronger|sensitive/i);
 });
 it('shows the distinct catalogue skin types for face washes',()=>{
  const ids=['2-salicylic-acid-face-wash','acne-control-wash'];
  const answer=addConcentrationContext(message(ids),ids.map(get));
  expect(answer).toContain('Oily Skin Type');
  expect(answer).toContain('Dry/Combination Skin Type');
 });
 it('does not compare unrelated formats or sizes',()=>{
  const ids=['2-salicylic-acid-face-wash','1-salicylic-acid-body-wash-350ml'];
  const existing=ids.map(get);
  expect(addConcentrationContext(message(ids),existing)).toBe(message(ids));
 });
});
