import {describe,expect,it} from 'vitest';
import {conversationContext} from '../worker/conversationContext';

describe('conversation context',()=>{
 it('keeps the active product and concern for a follow-up',()=>{
  const state=conversationContext('Can I use it?', [{role:'user',text:'I have dry skin on my body'}],['wash']);
  expect(state.action).toBe('product_follow_up');
  expect(state.active_product_ids).toEqual(['wash']);
  expect(state.areas).toContain('body');
  expect(state.concerns).toContain('dryness');
 });
 it('recognises an explicit new product format',()=>{
  const state=conversationContext('I need a body wash for dry skin',[],[]);
  expect(state.action).toBe('product_search');
  expect(state.requested_product_type).toBe('body wash');
 });
 it('tracks answers to recent assistant questions',()=>{
  const state=conversationContext('Oily',[{role:'assistant',text:'Is your scalp oily or dry?'}],[]);
  expect(state.answered_questions).toEqual([{question:'Is your scalp oily or dry?',answer:'Oily'}]);
 });
 it('does not record a new question as an answer to the previous question',()=>{
  const state=conversationContext('What is the price?',[{role:'assistant',text:'Is your scalp oily or dry?'}],[]);
  expect(state.answered_questions).toEqual([]);
 });
 it('retains multiple questions in a single message',()=>{
  const state=conversationContext('What are its ingredients and price?',[],['product']);
  expect(state.action).toBe('product_follow_up');
  expect(state.intents).toEqual(expect.arrayContaining(['price','ingredients']));
 });
 it('remembers a product type from an earlier turn and recognises a new search',()=>{
  const state=conversationContext('Show me another option',[{role:'user',text:'I need a shampoo for dry hair'}],['previous']);
  expect(state.action).toBe('product_search');expect(state.requested_product_type).toBe('shampoo');expect(state.concerns).toContain('dryness');
 });
});
