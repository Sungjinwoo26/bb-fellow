import { useEffect, useRef, useState } from 'react';
import { recommendationSchema } from '../shared/recommendationSchema';
import type { RecommendationRequest, RecommendationResult } from '../shared/recommendations';
import type { PreparationState } from '../app/session';
import { PREPARATION_DURATION_MS, canOpen, fingerprint, timer, validStart } from '../utils/preparation';
import { KitScreen } from './KitScreen';
import { PersonalisedReport } from './PersonalisedReport';
import type { KitState } from '../shared/kit';

type Props={request:RecommendationRequest;preparation:PreparationState|null|undefined;kit?:KitState|null;onSave:(state:PreparationState)=>void;onSaveKit?:(state:KitState)=>void;onBack:()=>void;onWelcome:()=>void;onStartOver?:()=>void;onRefreshRecommendations?:()=>void};
type Status='loading'|'success'|'error';
export function PreparationScreen({request,preparation,kit,onSave,onSaveKit,onBack,onWelcome,onStartOver,onRefreshRecommendations}:Props){
 const identity=fingerprint(request);const serialized=JSON.stringify(request);const containsPhotoChoices=request.confirmedPhotoSelections.length>0;
 const [initial]=useState(()=>{const now=Date.now();return preparation?.inputFingerprint===identity && validStart(preparation.startedAt,now) ? preparation : {startedAt:now,inputFingerprint:identity,recommendation:null,containsPhotoChoices};});
 const [startedAt]=useState(initial.startedAt);const [result,setResult]=useState<RecommendationResult|null>(initial.recommendation);const [status,setStatus]=useState<Status>('loading');const [now,setNow]=useState(Date.now);const [attempt,setAttempt]=useState(0);const [preview,setPreview]=useState(!!kit?.open && kit.recommendationFingerprint===identity);
 const [returnedFromKit,setReturnedFromKit]=useState(!!kit && !kit.open && kit.recommendationFingerprint===identity);
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
 const t=timer(startedAt,now);const ready=returnedFromKit ? status==='success' && !!result : canOpen(t.remaining,status,result);
 function returnToReport(){if(kit && onSaveKit)onSaveKit({...kit,open:false});setReturnedFromKit(true);setPreview(false);}
 const message=status==='error'?'We couldn’t prepare your sample kit.':ready?'Your personalised kit is ready!':t.remaining===0?'Your kit is taking a little longer.':'We’re putting your personalised kit together.';
 // Announce only meaningful transitions, never the per-second countdown.
 const announcement=status==='error'?'We couldn’t prepare your sample kit.':ready?'Your personalised kit is ready to view.':t.remaining===0?'Preparation time is complete. Your kit is taking a little longer.':'Your personalised kit is being prepared.';
 if(preview && ready && result)return <KitScreen data={result} identity={identity} kit={kit} onSave={onSaveKit ?? (()=>{})} onBack={onBack} onReport={returnToReport} onWelcome={onWelcome} onStartOver={onStartOver ?? onWelcome} onRefreshRecommendations={onRefreshRecommendations ?? onBack}/>;
 return <section className="assessment preparation-screen" aria-labelledby="preparation-title"><h1 id="preparation-title" ref={screenHeading} tabIndex={-1} className="preparation-title">Your personalised report</h1>
 <PersonalisedReport request={request} result={result} status={status}/>
 <div className={`prep-sticky ${ready?'is-ready':''}`}>{!returnedFromKit && <><div className="timer-block"><p>Preparation time remaining <strong>{t.display}</strong></p><progress max={100} value={Math.round(t.progress*100)} aria-label="Preparation progress">{Math.round(t.progress*100)}%</progress></div><p className="prep-status">{message}</p></>}<span className="sr-only" role="status" aria-live="polite">{announcement}</span><div className="photo-controls prep-actions">{ready&&!returnedFromKit&&<span className="kit-confetti" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i}/>)}</span>}<button className={`button primary kit-ready-button ${ready?'is-ready':''}`} disabled={!ready} onClick={()=>setPreview(true)}>See my personalised kit <span aria-hidden="true">{ready?'→':'✦'}</span></button>{status==='error' && <button className="button secondary" onClick={()=>{setStatus('loading');setResult(null);setAttempt(x=>x+1);}}>Retry</button>}</div></div>{!returnedFromKit && <span className="sr-only">Fixed preparation duration: {PREPARATION_DURATION_MS/1000} seconds.</span>}</section>;
}
