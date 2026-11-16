import {afterEach,describe,expect,it,vi} from 'vitest';
import {interpretWithModel} from '../worker/messageInterpreter';
import {groundedAnswer,writeV1Reference} from '../worker/groundedWriter';
import {chatRoute} from '../worker/productChat';
import {initialChatState} from '../src/shared/chatState';

const requestId='diagnostic-test-123';
const env={OPENAI_API_KEY:'private-test-key',V1_TYPED_AI:'true',CHAT_DIAGNOSTIC:{requestId}};
const model=(x:unknown)=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(x)}]}]}),{headers:{'x-request-id':'provider-test-id'}});
const turn={action:'find_product',reference_scope:'none',referenced_products:[],product_types:[],concerns:['acne'],hair_concerns:[],concern_relation:'none',body_areas:['face'],excluded_ingredients:[],intents:[],missing_information:[],confidence:'high'};
const events=(spy:ReturnType<typeof vi.spyOn>)=>spy.mock.calls.filter(c=>c[0]==='ai_diagnostic').map(c=>c[1] as Record<string,unknown>);
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
describe('privacy-conscious AI diagnostics',()=>{
 it.each([
  ['rate limit',()=>new Response('',{status:429,headers:{'x-request-id':'provider-test-id'}}),'provider_rate_limited'],
  ['provider failure',()=>new Response('',{status:503}),'provider_http_error'],
  ['malformed JSON',()=>new Response('{invalid'),'malformed_response'],
  ['invalid schema',()=>model({wrong:'shape'}),'invalid_schema'],
 ])('records %s separately for each interpreter attempt',async(_label,response,reason)=>{
  const log=vi.spyOn(console,'info').mockImplementation(()=>{});vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>response()));
  expect(await interpretWithModel('private customer text',initialChatState(),env)).toBeNull();const rows=events(log);
  expect(rows.map(x=>x.reason)).toEqual([reason,reason]);expect(rows.map(x=>x.attempt)).toEqual([1,2]);
  for(const row of rows){expect(row.request_id).toBe(requestId);expect(row.stage).toBe('interpreter');expect(row.duration_ms).toBeTypeOf('number');}
  expect(JSON.stringify(rows)).not.toContain('private customer text');expect(JSON.stringify(rows)).not.toContain('private-test-key');
 });
 it.each([['timeout',new DOMException('hidden detail','TimeoutError'),'timeout'],['network',new TypeError('hidden detail'),'network_error']])('classifies %s exceptions without logging error text',async(_label,error,reason)=>{
  const log=vi.spyOn(console,'info').mockImplementation(()=>{});vi.stubGlobal('fetch',vi.fn().mockRejectedValue(error));
  await interpretWithModel('private customer text',initialChatState(),env);const rows=events(log);expect(rows[0].reason).toBe(reason);expect(JSON.stringify(rows)).not.toContain('hidden detail');
 });
 it('records a grounded answer validation rejection and repair attempt',async()=>{
  const log=vi.spyOn(console,'info').mockImplementation(()=>{});vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>model({claims:[{text:'Guaranteed cure.',fact_keys:['2-salicylic-acid-face-wash:purpose'],intent:'purpose'}],requested_fields:[]})));
  expect(await groundedAnswer('private input',['2-salicylic-acid-face-wash'],['purpose'],env)).toBeNull();const rows=events(log);
  expect(rows.some(x=>x.stage==='answer_validation'&&x.reason==='prohibited_claim')).toBe(true);expect(rows.filter(x=>x.stage==='grounded_writer').map(x=>x.attempt)).toEqual([1,2]);expect(JSON.stringify(rows)).not.toContain('Guaranteed cure');
 });
 it('distinguishes writer rate limiting from malformed reference output',async()=>{
  const log=vi.spyOn(console,'info').mockImplementation(()=>{});vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>new Response('',{status:429,headers:{'x-request-id':'provider-rate-1'}})));
  expect(await groundedAnswer('private',['2-salicylic-acid-face-wash'],['purpose'],env)).toBeNull();
  expect(events(log)).toContainEqual(expect.objectContaining({request_id:requestId,stage:'grounded_writer',reason:'provider_rate_limited',status:429,provider_request_id:'provider-rate-1',attempt:1}));
  vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>new Response('{broken')));
  expect(await writeV1Reference('private','Where is your acne?','clarify',env)).toBeNull();
  expect(events(log).some(x=>x.stage==='reference_writer'&&x.reason==='malformed_response')).toBe(true);
 });
 it('records reference validation failures and all retry numbers',async()=>{
  const log=vi.spyOn(console,'info').mockImplementation(()=>{});vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>model({text:'Wrong answer.'})));
  expect(await writeV1Reference('private','Where is your acne?','clarify',env)).toBeNull();const rows=events(log).filter(x=>x.stage==='reference_validation');expect(rows.map(x=>x.attempt)).toEqual([1,2,3]);expect(rows.every(x=>x.reason==='reference_mismatch')).toBe(true);
 });
 it('times answer validation separately from provider latency',async()=>{
  const log=vi.spyOn(console,'info').mockImplementation(()=>{});let clock=1000;vi.spyOn(Date,'now').mockImplementation(()=>clock);
  vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>{clock+=5000;return model({claims:[{text:'For Mild Occasional Acne.',fact_keys:['2-salicylic-acid-face-wash:purpose'],intent:'purpose'}],requested_fields:[]});}));
  expect(await groundedAnswer('private',['2-salicylic-acid-face-wash'],['purpose'],env)).not.toBeNull();
  const rows=events(log);expect(rows.find(x=>x.stage==='grounded_writer')?.duration_ms).toBe(5000);expect(rows.find(x=>x.stage==='answer_validation')?.duration_ms).toBe(0);
 });
 it('returns a server-generated request ID correlated with logs, including invalid input',async()=>{
  const log=vi.spyOn(console,'info').mockImplementation(()=>{});vi.stubGlobal('fetch',vi.fn().mockImplementation(async(_url,init)=>{const b=JSON.parse(init.body);if(b.text.format.name==='chat_turn')return model(turn);const input=JSON.parse(b.input);return model({claims:input.facts.map((f:{key:string;value:string})=>({text:f.value,fact_keys:[f.key],intent:'purpose'})),requested_fields:[]});}));
  const response=await chatRoute(new Request('https://test/api/chat',{method:'POST',body:JSON.stringify({message:'private customer text',input_source:'typed'})}),env);const body=await response.json() as {request_id:string};
  expect(body.request_id).toMatch(/^[0-9a-f-]{36}$/);expect(response.headers.get('x-request-id')).toBe(body.request_id);expect(events(log).some(x=>x.request_id===body.request_id)).toBe(true);expect(JSON.stringify(log.mock.calls)).not.toContain('private customer text');
  const invalid=await chatRoute(new Request('https://test/api/chat',{method:'POST',body:'{broken'}),env);expect(invalid.status).toBe(400);expect(invalid.headers.get('x-request-id')).toMatch(/^[0-9a-f-]{36}$/);
 });
});
