import {describe,expect,it} from 'vitest';
import {answerChat} from '../worker/productChat';

describe('multiple questions about an active product',()=>{
 it('answers both price and ingredients without a provider call',async()=>{
  const result=await answerChat({message:'What are its ingredients and price?',selected_product_ids:['1-salicylic-acid-body-wash-350ml'],input_source:'typed'},{});
  expect(result.status).toBe('answered');
  expect(result.message).toMatch(/ingredients:/i);
  expect(result.message).toMatch(/price:/i);
  expect(result.selected_product_ids).toEqual(['1-salicylic-acid-body-wash-350ml']);
 });
});
