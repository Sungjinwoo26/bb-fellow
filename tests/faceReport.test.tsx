// @vitest-environment jsdom
import {afterEach,describe,expect,it} from 'vitest';
import {cleanup,render,screen} from '@testing-library/react';
import {FaceReport} from '../src/components/FaceReport';
import type {RecommendationRequest,RecommendationResult} from '../src/shared/recommendations';
const request:RecommendationRequest={sessionId:'test',selectedConcerns:['face'],answers:{face_goal:['acne_or_bumps'],face_breakout_pattern:'occasional',face_skin_type:'oily'},confirmedPhotoSelections:[]};
const result:RecommendationResult={catalogueVersion:'1',rulesVersion:'1',currency:'INR',unmatchedConcernIds:[],items:[{product:{id:'demo_face_sa_2',name:'2% Salicylic Acid Face Wash',variant:'sample',pricePaise:23200,currency:'INR',imagePath:'/products/2-salicylic-acid-face-wash.jpg',dataStatus:'unverified_demo'},quantity:1,matchedConcernIds:['face'],reasons:['Selected for your skin type.']}]};
afterEach(cleanup);
describe('face report',()=>{
 it('shows the selected concern and ingredients only for matched products',()=>{render(<FaceReport request={request} result={result} status="success"/>);expect(screen.getByText(/Breakouts & bumps/)).toBeTruthy();expect(screen.getByText('Salicylic acid')).toBeTruthy();expect(screen.queryByText('Ceramides')).toBeNull();expect(screen.queryByText('Your quiz answers')).toBeNull();});
 it('orders ingredients before routine and links real product reviews',()=>{const {container}=render(<FaceReport request={request} result={result} status="success"/>);const sections=[...container.querySelectorAll('.face-report > section')].map(x=>x.className);expect(sections.indexOf('fr-section fr-ingredients')).toBeLessThan(sections.indexOf('fr-section fr-plan'));expect(sections.indexOf('fr-section fr-reviews')).toBeLessThan(sections.indexOf('fr-section fr-expert'));expect(screen.getByText('Cleanse with salicylic acid')).toBeTruthy();expect(screen.getByText('Moisturise your skin')).toBeTruthy();expect(screen.getByText('Protect with sunscreen')).toBeTruthy();expect(screen.getByText(/my skin became softer and my blackheads have reduced/)).toBeTruthy();expect(screen.getAllByRole('link',{name:/Read on Be Bodywise/})[0].getAttribute('href')).toBe('https://bebodywise.com/product/2-salicylic-acid-face-wash');});
 it('shows honest unavailable states for missing recommendations and reviews',()=>{render(<FaceReport request={request} result={null} status="error"/>);expect(screen.getByText(/couldn’t load your routine/)).toBeTruthy();expect(screen.getByText(/Reviews will appear when your routine loads/)).toBeTruthy();expect(screen.queryByText('Salicylic acid')).toBeNull();});
});

