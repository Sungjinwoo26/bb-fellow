// @vitest-environment jsdom
import { afterEach,beforeEach,describe,expect,it,vi } from 'vitest';
import { act,cleanup,fireEvent,render,screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { PreparationScreen } from '../src/components/PreparationScreen';
import { fingerprint } from '../src/utils/preparation';
import { InformationCards } from '../src/components/InformationCards';
import type { RecommendationRequest } from '../src/shared/recommendations';
const request:RecommendationRequest={sessionId:'a',selectedConcerns:['hair'],answers:{},confirmedPhotoSelections:[]};
const result={catalogueVersion:'v1',rulesVersion:'v1',currency:'INR',items:[],unmatchedConcernIds:['hair']};
const props={request,preparation:null,onSave:vi.fn(),onBack:vi.fn(),onWelcome:vi.fn()};
beforeEach(()=>{vi.useFakeTimers();vi.setSystemTime(new Date('2026-01-01'));props.onSave.mockReset();});
afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();});
async function tick(ms:number){await act(async()=>{await vi.advanceTimersByTimeAsync(ms);});}
describe('preparation request and timer',()=>{
 it('starts one request under Strict Mode, waits 30 seconds, and accepts an empty result',async()=>{
  const fetcher=vi.fn(async()=>new Response(JSON.stringify(result),{status:200}));vi.stubGlobal('fetch',fetcher);
  render(<StrictMode><PreparationScreen {...props}/></StrictMode>);expect(screen.getByText('00:30')).toBeTruthy();await tick(1);expect(fetcher).toHaveBeenCalledTimes(1);expect((screen.getByRole('button',{name:'See my personalised kit'}) as HTMLButtonElement).disabled).toBe(true);
  await tick(29998);expect((screen.getByRole('button',{name:'See my personalised kit'}) as HTMLButtonElement).disabled).toBe(true);await tick(1);expect((screen.getByRole('button',{name:'See my personalised kit'}) as HTMLButtonElement).disabled).toBe(false);
  fireEvent.click(screen.getByRole('button',{name:'See my personalised kit'}));expect(screen.getByText('No sample products matched')).toBeTruthy();
 });
 it('waits for a slow response after the timer and ignores late results after unmount',async()=>{
  let resolve!:(v:Response)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(r=>{resolve=r;})));const view=render(<PreparationScreen {...props}/>);await tick(30001);expect(screen.getByText('Your sample kit is taking a little longer.')).toBeTruthy();expect((screen.getByRole('button',{name:'See my personalised kit'}) as HTMLButtonElement).disabled).toBe(true);view.unmount();await act(async()=>resolve(new Response(JSON.stringify(result),{status:200})));expect(props.onSave.mock.calls.filter(x=>x[0].recommendation).length).toBe(0);
 });
 it('allows retry after failure without resetting elapsed time',async()=>{
  const fetcher=vi.fn().mockResolvedValueOnce(new Response('',{status:503})).mockResolvedValueOnce(new Response(JSON.stringify(result),{status:200}));vi.stubGlobal('fetch',fetcher);render(<PreparationScreen {...props}/>);await tick(30000);expect(screen.getAllByText('We couldn’t prepare your sample kit.').length).toBeGreaterThan(0);fireEvent.click(screen.getByRole('button',{name:'Retry'}));await tick(1);expect((screen.getByRole('button',{name:'See my personalised kit'}) as HTMLButtonElement).disabled).toBe(false);expect(screen.getByText('00:00')).toBeTruthy();
 });
 it('reuses a saved successful result after checking catalogue and rule versions',async()=>{
  const fetcher=vi.fn(async()=>new Response(JSON.stringify({catalogueVersion:'v1',rulesVersion:'v1'}),{status:200}));vi.stubGlobal('fetch',fetcher);
  const startedAt=Date.now()-12000;const saved={startedAt,inputFingerprint:fingerprint(request),recommendation:result as never,containsPhotoChoices:false};render(<PreparationScreen {...props} preparation={saved}/>);await tick(1);expect(fetcher).toHaveBeenCalledTimes(1);expect(String(fetcher.mock.calls[0]?.[0])).toBe('/api/recommendations/version');expect(screen.getByText('00:18')).toBeTruthy();expect((screen.getByRole('button',{name:'See my personalised kit'}) as HTMLButtonElement).disabled).toBe(true);
 });
 it('requests a fresh result when saved catalogue versions change without restarting the timer',async()=>{
  const fetcher=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({catalogueVersion:'v2',rulesVersion:'v1'}),{status:200})).mockResolvedValueOnce(new Response(JSON.stringify(result),{status:200}));vi.stubGlobal('fetch',fetcher);
  const saved={startedAt:Date.now()-31000,inputFingerprint:fingerprint(request),recommendation:result as never,containsPhotoChoices:false};render(<PreparationScreen {...props} preparation={saved}/>);await tick(1);expect(fetcher).toHaveBeenCalledTimes(2);expect(screen.getByText('00:00')).toBeTruthy();expect((screen.getByRole('button',{name:'See my personalised kit'}) as HTMLButtonElement).disabled).toBe(false);
 });
});

describe('information-card rotation',()=>{
 it('pauses when hidden or focused and provides manual navigation',async()=>{
  let hidden=false;const spy=vi.spyOn(document,'hidden','get').mockImplementation(()=>hidden);const approved={...result,items:[{product:{id:'x',name:'x',variant:'x',pricePaise:100,currency:'INR' as const,imagePath:'/products/placeholder.svg',dataStatus:'unverified_demo' as const,ingredientSummary:'Approved ingredient note.',ingredientSummaryApproved:true},quantity:1 as const,matchedConcernIds:[],reasons:[]}]};
  render(<InformationCards selected={['hair']} result={approved}/>);expect(screen.getByText('Concerns being considered')).toBeTruthy();hidden=true;act(()=>document.dispatchEvent(new Event('visibilitychange')));await tick(12000);expect(screen.getByText('Concerns being considered')).toBeTruthy();
  hidden=false;act(()=>document.dispatchEvent(new Event('visibilitychange')));await tick(6000);expect(screen.getByText('Ingredients to know')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'Next'}));expect(screen.getByText('Concerns being considered')).toBeTruthy();
  fireEvent.focus(screen.getByRole('button',{name:'Next'}));await tick(6000);expect(screen.getByText('Concerns being considered')).toBeTruthy();spy.mockRestore();
 });
});
