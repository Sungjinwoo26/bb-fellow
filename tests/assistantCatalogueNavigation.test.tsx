// @vitest-environment jsdom
import {afterEach,describe,it,expect,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {ProductAssistant} from '../src/components/ProductAssistant';
afterEach(()=>{cleanup();vi.unstubAllGlobals()});
describe('assistant welcome and catalogue navigation',()=>{
 it('shows the new welcome shortcuts and navigates back within a catalogue',async()=>{
  const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({message:'Here are face care products (1–8 of 9).',status:'answered',catalogue:true,product_options:[],selected_product_ids:[],sources:[],answer_mode:'prepared_answer',catalogue_next:{category:'face',offset:8}}),{status:200})).mockResolvedValueOnce(new Response(JSON.stringify({message:'Here are face care products (1–8 of 9).',status:'answered',catalogue:true,product_options:[],selected_product_ids:[],sources:[],answer_mode:'prepared_answer',catalogue_next:{category:'face',offset:8}}),{status:200})).mockResolvedValueOnce(new Response(JSON.stringify({message:'Here are face care products (9–9 of 9).',status:'answered',catalogue:true,product_options:[],selected_product_ids:[],sources:[],answer_mode:'prepared_answer',catalogue_previous:{category:'face',offset:0}}),{status:200}));
  vi.stubGlobal('fetch',fetcher);render(<ProductAssistant onProduct={()=>{}} onConsult={()=>{}}/>);fireEvent.click(screen.getByRole('button',{name:'Open product assistant'}));
  for(const label of ['Find a product for my concern','Compare products','How do I use a product?','Explore ingredients'])expect(screen.getByRole('button',{name:label})).toBeTruthy();
  const input=screen.getByPlaceholderText('Ask about a product…');fireEvent.change(input,{target:{value:'show face care products'}});fireEvent.click(screen.getByRole('button',{name:'Send message'}));
  fireEvent.click(await screen.findByRole('button',{name:'Show more products'}));fireEvent.click(await screen.findByRole('button',{name:'Previous products'}));
  await waitFor(()=>expect(fetcher).toHaveBeenCalledTimes(3));const sent=JSON.parse(fetcher.mock.calls[2][1].body);expect(sent.catalogue_cursor).toEqual({category:'face',offset:0});
 });
});
