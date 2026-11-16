// @vitest-environment jsdom
import {afterEach,describe,expect,it} from 'vitest';
import {cleanup,render,screen} from '@testing-library/react';
import {PersonalisedReport} from '../src/components/PersonalisedReport';
import type {RecommendationRequest,RecommendationResult} from '../src/shared/recommendations';
afterEach(cleanup);
describe('personalised report',()=>{
 it('combines answers, product ingredients and real reviews without inventing a rating',()=>{
  const request:RecommendationRequest={sessionId:'test',selectedConcerns:['hair','face'],answers:{face_goal:['acne_or_bumps'],hair_concerns_new:['flakes']},confirmedPhotoSelections:[]};
  const product=(id:string,name:string,concern:string)=>({product:{id,name,variant:'',pricePaise:100,currency:'INR' as const,imagePath:'/x',dataStatus:'unverified_demo' as const},quantity:1,matchedConcernIds:[concern],reasons:[]});
  const result:RecommendationResult={catalogueVersion:'1',rulesVersion:'1',currency:'INR',unmatchedConcernIds:[],items:[product('demo_face_sa_2','Face wash','face'),product('demo_zpto_shampoo','Shampoo','hair')]};
  render(<PersonalisedReport request={request} result={result} status="success"/>);
  expect(screen.getByText('Salicylic acid')).toBeTruthy();expect(screen.getByText('Zinc pyrithione')).toBeTruthy();expect(screen.getByText('Cleanse your scalp')).toBeTruthy();expect(screen.getAllByText('Customer review')).toHaveLength(2);
 });
 it('shows only two genuine reviews in one section when a mixed kit has enough',()=>{
  const request:RecommendationRequest={sessionId:'test',selectedConcerns:['body_odour','face'],answers:{face_goal:['acne_or_bumps']},confirmedPhotoSelections:[]};
  const product=(id:string,name:string,concern:'face'|'body_odour')=>({product:{id,name,variant:'',pricePaise:100,currency:'INR' as const,imagePath:'/x',dataStatus:'unverified_demo' as const},quantity:1,matchedConcernIds:[concern],reasons:[]});
  const result:RecommendationResult={catalogueVersion:'1',rulesVersion:'1',currency:'INR',unmatchedConcernIds:[],items:[product('demo_face_sa_2','Face wash','face'),product('demo_underarm_roll_on','Roll-on','body_odour')]};
  const {container}=render(<PersonalisedReport request={request} result={result} status="success"/>);
  expect(container.querySelectorAll('.fr-reviews')).toHaveLength(1);
  expect(container.querySelectorAll('.fr-review-card')).toHaveLength(2);
  expect(screen.queryByText(/Fictional example/)).toBeNull();
  expect(screen.getAllByText('Customer review')).toHaveLength(2);
 });
 it('shows two clearly labelled fictional examples when a product has no eligible reviews',()=>{
  const request:RecommendationRequest={sessionId:'test',selectedConcerns:['body_odour'],answers:{},confirmedPhotoSelections:[]};
  const result:RecommendationResult={catalogueVersion:'1',rulesVersion:'1',currency:'INR',unmatchedConcernIds:[],items:[{product:{id:'demo_underarm_roll_on',name:'Roll-on',variant:'',pricePaise:100,currency:'INR',imagePath:'/x',dataStatus:'unverified_demo'},quantity:1,matchedConcernIds:['body_odour'],reasons:[]}]};
  const {container}=render(<PersonalisedReport request={request} result={result} status="success"/>);
  expect(container.querySelectorAll('.fr-reviews')).toHaveLength(1);expect(container.querySelectorAll('.fr-review-card')).toHaveLength(2);
  expect(screen.getAllByText(/Fictional example · Not a customer review/)).toHaveLength(2);
  expect(screen.queryByText('Alpha arbutin')).toBeNull();
  expect(screen.getByText('Salicylic acid')).toBeTruthy();
 });
});
