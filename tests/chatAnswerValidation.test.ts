import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat} from '../worker/productChat';
import {matchesProductFormat,requestedProductFormat} from '../worker/productMatcher';

describe('product selection and answer validation',()=>{
 afterEach(()=>vi.unstubAllGlobals());
 it('recognises a body-wash constraint and excludes lotion and kits',()=>{
  expect(requestedProductFormat('I need a bodywash for dry skin')).toBe('body wash');
  expect(matchesProductFormat({name:'10% Urea Body Lotion'},'body wash')).toBe(false);
  expect(matchesProductFormat({name:'Body Wash and Lotion Kit'},'body wash')).toBe(false);
  expect(matchesProductFormat({name:'Triple Milk Hydrating Body Wash'},'body wash')).toBe(true);
 });
 it('keeps body-wash recommendations and links on format when the concern route suggests a lotion',async()=>{
  const r=await answerChat({message:'I need a body wash for dry skin',input_source:'button'}, {},false);
  expect(r.status).toBe('answered');
  expect((r as any).recommendations.length).toBeGreaterThan(0);
  expect((r as any).recommendations.every((p:{name:string})=>matchesProductFormat(p,'body wash'))).toBe(true);
  expect(r.sources.length).toBe((r as any).recommendations.length);
  expect(r.sources.every(s=>s.url.startsWith('https://bebodywise.com/product/'))).toBe(true);
 });
 it('rejects free-form model output containing an unsupported claim',async()=>{
  const body={answer:'This product guarantees results in 987 days.',recommended_product_ids:[],focused_product_ids:['1-salicylic-acid-body-wash-350ml'],choices:[]};
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(body)}]}]}))));
  const r=await answerChat({message:'Would this body wash work for dry skin?',input_source:'typed',selected_product_ids:['1-salicylic-acid-body-wash-350ml']},{OPENAI_API_KEY:'test'});
  expect(r.message).not.toContain('987 days');expect(r.status).toBe('no_information');
 });
});
