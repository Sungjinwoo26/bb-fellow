import { afterEach, describe, expect, it, vi } from 'vitest';
import { answerChat } from '../worker/productChat';
const id='4-aha-bha-underarm-rollon-frag-free-75';
const env={OPENAI_API_KEY:'test-key'};
afterEach(()=>vi.unstubAllGlobals());
describe('structured interpreter failure handling',()=>{
 it.each([new Response('private provider detail',{status:429}),new Response(JSON.stringify({status:'incomplete',output:[]}))])('uses local facts if the interpreter is unavailable or incomplete',async response=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(response));const r=await answerChat({message:'How frequently should I apply it?',selected_product_ids:[id],input_source:'typed'},env);expect(r.selected_product_ids).toEqual([id]);expect(r.message).not.toMatch(/private provider detail|cut off/i);expect(r.message).toBeTruthy()});
 it('returns both exact products in a comparison without invented fragrance claims',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('error',{status:429})));const pair=[id,'6-aha-bha-underarm-roll-on-flora-75ml'];const r=await answerChat({message:'Compare these products for odour',selected_product_ids:pair,input_source:'typed'},env);expect(r.selected_product_ids).toEqual(pair);expect(r.product_cards.map(p=>p.id)).toEqual(pair);expect(r.message).not.toMatch(/floral scent/i)});
});
