// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {ProductAssistant} from '../src/components/ProductAssistant';
const id='12345678-1234-4234-8234-123456789abc';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
describe('chat error reference',()=>{
 it.each(['unavailable','http_error'])('shows a support reference for %s',async kind=>{
  const response=kind==='unavailable'?new Response(JSON.stringify({message:'Please try again.',status:'unavailable',request_id:id,product_options:[],selected_product_ids:[],sources:[],answer_mode:'verified_data_fallback'})):new Response('{}',{status:500,headers:{'x-request-id':id}});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(response));render(<ProductAssistant onProduct={()=>{}} onConsult={()=>{}}/>);
  fireEvent.click(screen.getByRole('button',{name:'Open product assistant'}));fireEvent.click(screen.getByRole('button',{name:'Start new chat'}));
  fireEvent.change(screen.getByPlaceholderText('Ask about a product…'),{target:{value:'test'}});fireEvent.click(screen.getByRole('button',{name:'Send message'}));
  expect(await screen.findByText(`Reference: ${id}`)).toBeTruthy();
 });
});
