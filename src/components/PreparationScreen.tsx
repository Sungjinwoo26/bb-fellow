import { useEffect, useRef, useState } from 'react';
import { recommendationSchema } from '../shared/recommendationSchema';
import type { RecommendationRequest, RecommendationResult } from '../shared/recommendations';
import type { PreparationState } from '../app/session';
import { PREPARATION_DURATION_MS, canOpen, fingerprint, timer, validStart } from '../utils/preparation';
import { KitScreen } from './KitScreen';
import type { KitState } from '../shared/kit';
import { concerns } from '../data/concerns';
import { questions } from '../data/questions';
import { VISUAL_OPTIONS } from '../shared/visualOptions';

type Props={request:RecommendationRequest;preparation:PreparationState|null|undefined;kit?:KitState|null;onSave:(state:PreparationState)=>void;onSaveKit?:(state:KitState)=>void;onBack:()=>void;onWelcome:()=>void;onStartOver?:()=>void;onRefreshRecommendations?:()=>void};
type Status='loading'|'success'|'error';
export function PreparationScreen({request,preparation,kit,onSave,onSaveKit,onBack,onWelcome,onStartOver,onRefreshRecommendations}:Props){
 const identity=fingerprint(request);const serialized=JSON.stringify(request);const containsPhotoChoices=request.confirmedPhotoSelections.length>0;
 const [initial]=useState(()=>{const now=Date.now();return preparation?.inputFingerprint===identity && validStart(preparation.startedAt,now) ? preparation : {startedAt:now,inputFingerprint:identity,recommendation:null,containsPhotoChoices};});
 const [startedAt]=useState(initial.startedAt);const [result,setResult]=useState<RecommendationResult|null>(initial.recommendation);const [status,setStatus]=useState<Status>('loading');const [now,setNow]=useState(Date.now);const [attempt,setAttempt]=useState(0);const [preview,setPreview]=useState(!!kit?.open && kit.recommendationFingerprint===identity);
 const screenHeading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{screenHeading.current?.focus();},[]);
 const activeRequest=useRef('');const saveRef=useRef(onSave);useEffect(()=>{saveRef.current=onSave;},[onSave]);
 useEffect(()=>{saveRef.current(initial);},[initial]);
 useEffect(()=>{const tick=()=>setNow(Date.now());const id=window.setInterval(tick,250);document.addEventListener('visibilitychange',tick);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',tick);};},[]);
 useEffect(()=>{const controller=new AbortController();const id=crypto.randomUUID();activeRequest.current=id;let deferred:number;
  async function load(){try {
   if(initial.recommendation && attempt===0){const versions=await fetch('/api/recommendations/version',{signal:controller.signal});if(versions.ok){const v=await versions.json() as {catalogueVersion?:string;rulesVersion?:string};if(v.catalogueVersion===initial.recommendation.catalogueVersion && v.rulesVersion===initial.recommendation.rulesVersion){if(activeRequest.current===id && !controller.signal.aborted){setResult(initial.recommendation);setStatus('success');}return;}}}
   if(initial.recommendation && attempt===0 && activeRequest.current===id && !controller.signal.aborted) {setResult(null);saveRef.current({...initial,recommendation:null});}
   const response=await fetch('/api/recommendations',{method:'POST',headers:{'Content-Type':'application/json'},body:serialized,signal:controller.signal});if(!response.ok)throw new Error('unavailable');const parsed=recommendationSchema.safeParse(await response.json());if(!parsed.success)throw new Error('invalid response');
   if(activeRequest.current!==id || controller.signal.aborted)return;
   setResult(parsed.data);setStatus('success');saveRef.current({startedAt,inputFingerprint:identity,recommendation:parsed.data,containsPhotoChoices});
  }catch{if(activeRequest.current===id && !controller.signal.aborted){setResult(null);setStatus('error');}} }
  deferred=window.setTimeout(load,0);return()=>{clearTimeout(deferred);controller.abort();if(activeRequest.current===id)activeRequest.current='';};
 },[identity,serialized,attempt,initial,startedAt,containsPhotoChoices]);
 const t=timer(startedAt,now);const ready=canOpen(t.remaining,status,result);
 const message=status==='error'?'We couldn’t prepare your sample kit.':status==='success' && t.remaining===0?'Your sample kit is ready.':status==='success'?'Your sample kit is ready. You can view it when the preparation time ends.':t.remaining===0?'Your sample kit is taking a little longer.':'';
 // Announce only meaningful transitions, never the per-second countdown.
 const announcement=status==='error'?'We couldn’t prepare your sample kit.':ready?'Your sample kit is ready to view.':status==='success'?'Your sample kit is ready. Preparation time is still running.':t.remaining===0?'Preparation time is complete. Your sample kit is taking a little longer.':'Preparation started.';
 if(preview && ready && result)return <KitScreen data={result} identity={identity} kit={kit} onSave={onSaveKit ?? (()=>{})} onBack={onBack} onWelcome={onWelcome} onStartOver={onStartOver ?? onWelcome} onRefreshRecommendations={onRefreshRecommendations ?? onBack}/>;
 return <section className="assessment preparation-screen" aria-labelledby="preparation-title"><p className="assessment-kicker">Your personalised report</p><h1 id="preparation-title" ref={screenHeading} tabIndex={-1}>Your routine focus</h1><p className="prep-support">{request.selectedConcerns.map(id=>concerns.find(c=>c.id===id)?.label).filter(Boolean).join(' · ')}</p>
 <div className="report-card"><h2>What you told us</h2>{request.selectedConcerns.map(id=><article key={id}><h3>{concerns.find(c=>c.id===id)?.label}</h3><p className="report-source">From your answers</p>{questions.filter(q=>q.concernId===id && request.answers[q.id] != null).map(q=>{const value=request.answers[q.id];const ids=Array.isArray(value)?value:[value];return <p key={q.id}><strong>{q.label}</strong> {q.options.filter(o=>ids.includes(o.id)).map(o=>o.label).join(', ')}</p>;})}{!questions.some(q=>q.concernId===id && request.answers[q.id]!=null) && <p>We don’t have enough information about this yet.</p>}</article>)}</div>
 {request.confirmedPhotoSelections.some(x=>x.selectedOptionIds.length || x.notSure) && <div className="report-card"><h2>Confirmed from your photo</h2>{request.confirmedPhotoSelections.map(x=><p key={x.areaId}>{x.selectedOptionIds.map(id=>VISUAL_OPTIONS[id]).join(', ')}{x.notSure && 'Not sure'}</p>)}</div>}
 <div className="report-card"><h2>What your sample routine may include</h2>{status==='success' && result ? <p>{result.items.length ? result.items.map(x=>x.product.name).join(', ') : 'No sample matches are available for these selections yet.'}</p> : <p>{status==='error'?'Your sample kit could not be loaded yet.':'Your sample kit is being prepared.'}</p>}<ul><li>Follow product directions.</li><li>Avoid aggressive scrubbing.</li><li>Use sun protection as appropriate.</li></ul></div>
 <div className="report-card"><h2>Ingredients in your sample kit</h2>{result?.items.some(x=>x.product.ingredientSummaryApproved && x.product.ingredientSummary) ? result.items.filter(x=>x.product.ingredientSummaryApproved && x.product.ingredientSummary).map(x=><p key={x.product.id}><strong>{x.product.name}:</strong> {x.product.ingredientSummary}</p>) : <p>Ingredient details will be added when product information is verified.</p>}</div>
 <div className="report-card expert-card"><h2>Consult an expert</h2><p>Skin and hair concerns can have different causes. An expert can help you understand what may apply to you.</p><a className="button primary" href="https://bebodywise.com/concern/experts" target="_blank" rel="noreferrer">Consult an expert ↗</a></div>
 <div className="report-card"><h2>Customer experiences: {request.selectedConcerns.includes('hair') ? 'Hair care' : 'Body care'}</h2><p>Customer reviews and photos will be added here.</p></div>
 <div className="report-card"><h2>FAQs</h2>{[['How were these suggestions created?','They use your selections, answers, and any confirmed photo suggestions.'],['Are these recommendations a diagnosis?','The prototype does not provide a diagnosis.'],['Are the products and prices final?','The catalogue and prices are sample data.'],['Can I change my kit?','Products can be removed and quantities adjusted on the kit screen.']].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
 <div className="prep-sticky"><div className="timer-block"><p>Preparation time remaining <strong>{t.display}</strong></p><progress max={100} value={Math.round(t.progress*100)} aria-label="Preparation progress">{Math.round(t.progress*100)}%</progress></div><p className="prep-status">{message}</p><span className="sr-only" role="status" aria-live="polite">{announcement}</span><div className="photo-controls prep-actions"><button className="button primary" disabled={!ready} onClick={()=>setPreview(true)}>See my personalised kit</button>{status==='error' && <button className="button secondary" onClick={()=>{setStatus('loading');setResult(null);setAttempt(x=>x+1);}}>Retry</button>}<button className="button secondary" onClick={onBack}>Back to questions</button></div></div><span className="sr-only">Fixed preparation duration: {PREPARATION_DURATION_MS/1000} seconds.</span></section>;
}
