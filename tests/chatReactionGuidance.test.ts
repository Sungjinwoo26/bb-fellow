import {describe,expect,it} from 'vitest';
import {answerChat} from '../worker/productChat';

describe('customer-reported skin reactions',()=>{
 it.each(['I have a rash, can I use this?','My skin got red after using the wash','It gave me a rash','My skin is getting red','I used this product and got rashes'])('offers expert guidance for %s',async message=>{
  const result=await answerChat({message,input_source:'typed'},{V1_TYPED_AI:'true'},true);
  expect(result.expert_card).toMatchObject({title:'Consult an expert'});
  expect(result.message).not.toMatch(/stop using/i);
 });
 it.each(['Does this product cause redness?','I do not have a rash','I have this product. Does it cause redness?'])('does not assume a reaction from %s',async message=>{
  const result=await answerChat({message,input_source:'typed'},{V1_TYPED_AI:'true'},true);
  expect(result.expert_card).toBeUndefined();
 });
 it('retains urgent guidance for trouble breathing',async()=>{
  const result=await answerChat({message:'My skin is red and I have trouble breathing',input_source:'typed'},{V1_TYPED_AI:'true'},true);
  expect(result.message).toMatch(/emergency/i);
 });
});
