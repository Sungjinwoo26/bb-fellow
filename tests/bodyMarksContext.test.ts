import {describe,it,expect} from 'vitest';
import {bodyPolicy,bodyDecision} from '../worker/bodyChat';
import {initialChatState} from '../src/shared/chatState';
const turn={action:'unknown',reference_scope:'none',referenced_products:[],product_types:[],concerns:['body marks'],hair_concerns:[],body_areas:['body'],excluded_ingredients:[],intents:[],missing_information:['type of marks'],confidence:'medium'} as const;
describe('ambiguous body marks',()=>{
 it('asks what kind of marks rather than assuming active acne',()=>{
  const match=bodyPolicy('i have body marks',turn,'');
  expect(match?.category).toBe('marks');
  const decision=bodyDecision(match!.category,match!.choice,initialChatState(),turn);
  expect(decision?.products).toEqual([]);
  expect(decision?.choices).toContain('Marks after breakouts');
 });
 it('routes the two answers separately and does not repeat the question for not sure',()=>{
  const question='Are the marks left by breakouts, or are you noticing uneven skin tone?';
  expect(bodyPolicy('Marks after breakouts',turn,question)?.category).toBe('acne');
  expect(bodyPolicy('Uneven skin tone',turn,question)?.category).toBe('pigmentation');
  expect(bodyPolicy('Not sure',turn,question)?.category).toBe('marks_unknown');
 });
});
