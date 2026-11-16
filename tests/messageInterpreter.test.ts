import {afterEach,describe,expect,it,vi} from 'vitest';
import {interpretWithModel} from '../worker/messageInterpreter';
import {initialChatState} from '../src/shared/chatState';
const turn={action:'product_question',reference_scope:'active_product',referenced_products:['1-salicylic-acid-body-wash-350ml'],product_types:[],concerns:[],body_areas:[],excluded_ingredients:[],intents:['ingredients','price'],missing_information:[],confidence:'high'};
const provider=(value:unknown)=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]}));
afterEach(()=>vi.unstubAllGlobals());
describe('structured model interpretation',()=>{
 it('uses Luna fast mode and low reasoning with a strict schema',async()=>{
  const fetcher=vi.fn().mockImplementation(async()=>provider(turn));vi.stubGlobal('fetch',fetcher);
  expect(await interpretWithModel('What are its ingredients and price?',initialChatState(),{OPENAI_API_KEY:'test'})).toEqual({...turn,hair_concerns:[]});
  const request=JSON.parse(fetcher.mock.calls[0][1].body);expect(request.model).toBe('gpt-6-luna');expect(request.service_tier).toBe('fast');expect(request.reasoning.effort).toBe('low');expect(request.text.format.strict).toBe(true);
 });
 it('rejects a model-invented product id',async()=>{vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>provider({...turn,referenced_products:['invented-product']})));expect(await interpretWithModel('tell me about it',initialChatState(),{OPENAI_API_KEY:'test'})).toBeNull();});
 it('does not call a provider when no key exists',async()=>{const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);expect(await interpretWithModel('hello',initialChatState(),{})).toBeNull();expect(fetcher).not.toHaveBeenCalled();});
});
