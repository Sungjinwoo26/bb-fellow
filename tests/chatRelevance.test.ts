import {afterEach,describe,expect,it,vi} from 'vitest';
import {answerChat} from '../worker/productChat';
describe('relevance safeguards',()=>{
 afterEach(()=>vi.unstubAllGlobals());
 it.each(['😭😭 help skin','help my hair','help with body','12345'])('asks for clarification without products for %s',async message=>{
  const r=await answerChat({message,input_source:'typed',selected_product_ids:['niacinamide-body-lotion']},{});expect(r.status).toBe('clarify');expect(r.selected_product_ids).toEqual([]);expect((r as any).recommendations??[]).toHaveLength(0);
 });
 it.each(['do you have a product for ingrown hair after waxing','razor bumps after shaving'])('routes %s to an area question',async message=>{
  const r=await answerChat({message,input_source:'typed'},{});expect((r as any).catalogue).not.toBe(true);expect((r as any).choices).toContain('Bikini area');expect(r.product_options).toHaveLength(0);
 });
 it('offers a body product for ingrown hairs on legs',async()=>{
  const r=await answerChat({message:'Legs',input_source:'button',history:[{role:'user',text:'ingrown hair after waxing'},{role:'assistant',text:'Where are you noticing the ingrown hairs?'}]},{});expect((r as any).recommendations.map((p:any)=>p.id)).toEqual(['glycolic-acid-stick']);expect(r.message).toMatch(/settled/);
 });
 it('does not guess a bikini-area product',async()=>{
  const r=await answerChat({message:'Bikini area',input_source:'button',history:[{role:'user',text:'ingrown hair after waxing'}]},{});expect((r as any).recommendations??[]).toHaveLength(0);expect(r.message).toMatch(/specifically says it is suitable/);
 });
 it.each(['Heyy siggest me something for body smell','I need help with body smell','What can I use for sweaty smell?'])('asks where for %s and follows underarm selection',async message=>{
  const first=await answerChat({message,input_source:'typed'},{});expect((first as any).choices).toContain('Underarms');expect((first as any).recommendations??[]).toHaveLength(0);
  const next=await answerChat({message:'Underarms',input_source:'button',history:[{role:'user',text:message},{role:'assistant',text:first.message}]},{});
  expect((next as any).recommendations.map((p:any)=>p.id)).toContain('6-aha-bha-underarm-roll-on-flora-75ml');expect(next.message).not.toMatch(/don.t see/);
 });
 it('recovers the underarm odour concern after a pigmentation question',async()=>{
  const r=await answerChat({message:'Yes',input_source:'button',history:[{role:'user',text:'Heyy siggest me something for body smell'},{role:'assistant',text:'Is it mainly underarms?'},{role:'user',text:'Underarms'},{role:'assistant',text:'Are you also concerned about darker-looking underarms?'}]},{});
  expect((r as any).recommendations.map((p:any)=>p.id)).toContain('6-aha-bha-underarm-roll-on-flora-75ml');expect((r as any).recommendations.map((p:any)=>p.id)).not.toContain('niacinamide-body-lotion');
 });
 it.each([
  ['Dry body skin','10-urea-lotion-300ml'],
  ['I have dry skin on my arms','10-urea-lotion-300ml'],
  ['Very dry body skin','20-urea-lotion-xp'],
  ['Very dry or flaky body skin','20-urea-lotion-xp'],
  ['Flaky skin on my legs','20-urea-lotion-xp']
 ])('matches %s to the body lotion',async(message,id)=>{
  const r=await answerChat({message,input_source:'button',history:[{role:'user',text:'Body care'},{role:'assistant',text:'What body-care concern would you like help with?'}]},{});expect((r as any).recommendations.map((p:any)=>p.id)).toContain(id);if(id==='20-urea-lotion-xp')expect((r as any).recommendations.map((p:any)=>p.id)).not.toContain('10-urea-lotion');expect(r.message).not.toMatch(/foot roll/i);
 });
 it('does not select a body lotion for a face-only dry skin concern',async()=>{const r=await answerChat({message:'very dry face skin',input_source:'typed'},{});expect(r.selected_product_ids).not.toContain('20-urea-lotion-xp')});
 function mockInterpretation(overrides:Record<string,unknown>={}){
  const turn={action:'find_product',reference_scope:'none',referenced_products:[],product_types:['body wash'],concerns:['dryness'],body_areas:['body'],excluded_ingredients:[],intents:[],missing_information:[],confidence:'high',...overrides};
  const fetcher=vi.fn().mockImplementation(async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(turn)}]}]})));vi.stubGlobal('fetch',fetcher);return fetcher;
 }
 it('recommends only body washes for a dry body skin search',async()=>{
  const fetcher=mockInterpretation();const r=await answerChat({message:'I need a body wash for dry skin',input_source:'typed'},{OPENAI_API_KEY:'test'});
  expect(fetcher).toHaveBeenCalledTimes(2);expect(r.status).toBe('answered');expect(r.product_cards.length).toBeGreaterThan(0);
  expect(r.product_cards.every(p=>/body\s*wash/i.test(p.name))).toBe(true);expect(r.message).not.toMatch(/10% Urea Body Lotion/i);
 });
 it('retains the discussed body wash for a dry-skin suitability question',async()=>{
  const id='1-salicylic-acid-body-wash-350ml';mockInterpretation({action:'product_question',reference_scope:'active_product',referenced_products:[id],product_types:[],body_areas:['body']});
  const r=await answerChat({message:'I have dry skin can I use it',input_source:'typed',selected_product_ids:[id],history:[{role:'user',text:'Tell me about the body wash'}]},{OPENAI_API_KEY:'test'});
  expect(r.selected_product_ids).toEqual([id]);expect(r.status).toBe('no_information');expect(r.message).toMatch(/can.t confirm/i);expect(r.message).not.toMatch(/10% Urea Body Lotion/i);
 });
 it('does not reuse a previous lotion when a new body wash is requested',async()=>{
  mockInterpretation();const r=await answerChat({message:'I need a body wash for dry skin',input_source:'typed',selected_product_ids:['10-urea-lotion-300ml']},{OPENAI_API_KEY:'test'});
  expect(r.status).toBe('answered');expect(r.product_cards.length).toBeGreaterThan(0);expect(r.product_cards.every(p=>/body\s*wash/i.test(p.name))).toBe(true);
  expect(r.selected_product_ids).not.toContain('10-urea-lotion-300ml');
 });
 it('does not link a product the AI explicitly says is unsuitable',async()=>{
  const body={answer:'I would not recommend the Face Razor for bikini-area bumps; it is intended for facial hair removal.',recommended_product_ids:['face-razor-for-women'],focused_product_ids:[],choices:[]};
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(body)}]}]}),{status:200})));
  const r=await answerChat({message:'Is Face Razor useful for my legs?',input_source:'typed'}, {OPENAI_API_KEY:'test'});expect((r as any).recommendations??[]).toHaveLength(0);
 });
});
