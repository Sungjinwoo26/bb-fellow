import {describe,expect,it} from 'vitest';
import {supportedPairRoutine} from '../worker/productRoutines';
import {selectProducts} from '../worker/recommendationPipeline';
import {initialChatState} from '../src/shared/chatState';

describe('routine and area matching',()=>{
 it('does not reuse a past body wash for a new underarm roll-on request',()=>{
  const history=[{role:'user' as const,text:'1% salicylic body wash and niacinamide lotion'}];
  expect(supportedPairRoutine('Which order for underarm roll-on and niacinamide lotion?',[],history)).toBeNull();
 });
 it('does not reuse a stored pair when active products include an unrelated product',()=>{
  expect(supportedPairRoutine('Which order?', ['1-salicylic-acid-body-wash-350ml','niacinamide-body-lotion','hair-fall-control-shampoo'],[])).toBeNull();
 });
 it('treats ingrown hair on legs as a body concern',()=>{
  const decision=selectProducts('ingrown hair on my legs',initialChatState());
  expect(decision.eligible.some(p=>/hair care/i.test(p.category))).toBe(false);
 });
});
