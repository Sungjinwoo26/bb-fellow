// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {ProductAssistant} from '../src/components/ProductAssistant';
afterEach(()=>{cleanup();vi.unstubAllGlobals()});
describe('concern clarification choices',()=>{
 it('renders the supplied concern options and sends the chosen text',async()=>{
  const base={status:'clarify',product_options:[],selected_product_ids:[],sources:[],answer_mode:'prepared_answer'};
  const fetcher=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({...base,message:'What would you like to focus on?',choices:['Active breakouts','Marks','Both','Not sure']}),{status:200})).mockResolvedValueOnce(new Response(JSON.stringify({...base,message:'What area?',choices:['Back','Chest']}),{status:200}));
  vi.stubGlobal('fetch',fetcher);render(<ProductAssistant onProduct={()=>{}} onConsult={()=>{}}/>);
  fireEvent.click(screen.getByRole('button',{name:'Open product assistant'}));
  fireEvent.click(screen.getByRole('button',{name:'Start new chat'}));
  const input=screen.getByPlaceholderText('Ask about a product…');fireEvent.change(input,{target:{value:'I have body acne'}});fireEvent.click(screen.getByRole('button',{name:'Send message'}));
  fireEvent.click(await screen.findByRole('button',{name:'Active breakouts'}));
  await waitFor(()=>expect(fetcher).toHaveBeenCalledTimes(2));
  expect(JSON.parse(fetcher.mock.calls[1][1].body).message).toBe('Active breakouts');
 });
});
