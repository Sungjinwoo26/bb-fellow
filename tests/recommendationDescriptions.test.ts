import {describe,it,expect} from 'vitest';
import {catalogue,catalogueById} from '../worker/catalogue';
import {deterministicRecommendations} from '../worker/recommendationPipeline';
import {productDescription} from '../worker/concernFlow';

describe('recommendation descriptions',()=>{
 it('uses readable, relevant copy for the body pigmentation example',()=>{
  const cream=catalogueById.get('pigmentation-repair-cream')!;
  expect(deterministicRecommendations([cream])).toContain('areas of uneven tone');
 });
 it('provides a usable description or a clear information limit across the catalogue',()=>{
  for(const product of catalogue){
   const description=productDescription(product);
   expect(description.length).toBeGreaterThan(20);
   expect(description).not.toMatch(/undefined|null|^for\s*:/i);
  }
 });
});
