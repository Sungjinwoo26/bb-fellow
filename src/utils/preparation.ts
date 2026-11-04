import { canonicalConcerns, concerns } from '../data/concerns';
import { getActiveAnswers } from '../app/sequence';
import { getPhotoAreas } from './photoAreas';
import type { AssessmentSession } from '../app/session';
import type { ConfirmedPhotoSelection } from '../app/analysisState';
import type { RecommendationRequest } from '../shared/recommendations';
export const PREPARATION_DURATION_MS=30_000;
export function timer(startedAt:number,now:number) {const elapsed=Math.max(0,now-startedAt);const remaining=Math.max(0,PREPARATION_DURATION_MS-elapsed);return {remaining,progress:Math.min(1,elapsed/PREPARATION_DURATION_MS),display:`${String(Math.floor(Math.ceil(remaining/1000)/60)).padStart(2,'0')}:${String(Math.ceil(remaining/1000)%60).padStart(2,'0')}`};}
export function validStart(value:unknown,now:number):value is number {return typeof value==='number' && Number.isFinite(value) && value>0 && value<=now+1000;}
export function requestFor(session:AssessmentSession,confirmed:ConfirmedPhotoSelection[]):RecommendationRequest {
 const selectedConcerns=canonicalConcerns(session.selectedConcerns); const allowed=getPhotoAreas(selectedConcerns).map(a=>a.id);
 const answers=getActiveAnswers(selectedConcerns,session.answers); const sortedAnswers=Object.fromEntries(Object.entries(answers).sort(([a],[b])=>a.localeCompare(b)));
 const confirmedPhotoSelections=confirmed.filter(c=>allowed.includes(c.areaId)).map(c=>({...c,selectedOptionIds:[...c.selectedOptionIds].sort()})).sort((a,b)=>a.areaId.localeCompare(b.areaId));
 return {sessionId:session.sessionId,selectedConcerns,answers:sortedAnswers,confirmedPhotoSelections};
}
// A stable change detector, not an authentication or security hash.
export function fingerprint(request:RecommendationRequest) {const text=JSON.stringify(request);let a=14695981039346656037n,b=7809847782465536322n;for(let i=0;i<text.length;i++){const n=BigInt(text.charCodeAt(i));a=BigInt.asUintN(64,(a^n)*1099511628211n);b=BigInt.asUintN(64,(b^n)*1099511628211n);}return a.toString(16).padStart(16,'0')+b.toString(16).padStart(16,'0');}
export function concernText(ids:RecommendationRequest['selectedConcerns']) {const labels=canonicalConcerns(ids).map(id=>concerns.find(c=>c.id===id)!.label); const joined=new Intl.ListFormat('en',{style:'long',type:'conjunction'}).format(labels);return `We’re bringing together sample options for ${joined}.`;}
export function canOpen(remaining:number,status:'loading'|'success'|'error',result:unknown){return remaining===0 && status==='success' && result!=null;}
