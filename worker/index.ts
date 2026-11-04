import { kitRoute } from './kit';
import { catalogueRoute, recommendationsRoute, configuredData } from './recommendations';
import { photoAnalysis, publicConfig, type AnalysisEnv } from './analysis';
type Limiter={limit(input:{key:string}):Promise<{success:boolean}>};
export async function checkPhotoRate(request:Request, env:{PHOTO_CLIENT_LIMIT?:Limiter;PHOTO_LOCATION_LIMIT?:Limiter}):Promise<Response|null> {
 try {
  if(!env.PHOTO_CLIENT_LIMIT || !env.PHOTO_LOCATION_LIMIT) throw new Error('limiter unavailable');
  const client=request.headers.get('CF-Connecting-IP') || 'unknown';
  const [byClient,byLocation]=await Promise.all([env.PHOTO_CLIENT_LIMIT.limit({key:client}),env.PHOTO_LOCATION_LIMIT.limit({key:'photo-analysis'})]);
  if(!byClient.success || !byLocation.success) return Response.json({error:{code:'ANALYSIS_LIMITED',message:'Photo analysis is busy. Please try again later.',requestId:crypto.randomUUID()}},{status:429,headers:{'Cache-Control':'no-store','Retry-After':'60'}});
  return null;
 } catch {return Response.json({error:{code:'ANALYSIS_UNAVAILABLE',message:'Photo analysis is temporarily unavailable.',requestId:crypto.randomUUID()}},{status:503,headers:{'Cache-Control':'no-store'}});}
}
export default {
 async fetch(request:Request, env:AnalysisEnv & {ASSETS:{fetch(request:Request):Promise<Response>};PHOTO_CLIENT_LIMIT?:Limiter;PHOTO_LOCATION_LIMIT?:Limiter}):Promise<Response> {
  const url=new URL(request.url);
  if(url.pathname==='/api/quote' && request.method==='POST') return kitRoute(request);
  if(url.pathname==='/api/checkout/simulate' && request.method==='POST') return kitRoute(request,true);
  if(url.pathname==='/api/recommendations/version' && request.method==='GET') {const data=configuredData();return data ? Response.json({catalogueVersion:data.catalogue.version,rulesVersion:data.rules.version},{headers:{'Cache-Control':'no-store'}}) : Response.json({error:{code:'CATALOGUE_UNAVAILABLE'}},{status:503});}
  if(url.pathname==='/api/catalogue' && request.method==='GET') return catalogueRoute();
  if(url.pathname==='/api/recommendations' && request.method==='POST') return recommendationsRoute(request);
  if(url.pathname==='/api/health' && request.method==='GET') return Response.json({status:'ok',service:'find-my-routine-api'});
  if(url.pathname==='/api/photo-analysis/config' && request.method==='GET') return Response.json(publicConfig(env),{headers:{'Cache-Control':'no-store'}});
  if(url.pathname==='/api/photo-analysis' && request.method==='POST') {const limited=await checkPhotoRate(request,env);return limited ?? photoAnalysis(request,env);}
  if(url.pathname==='/api' || url.pathname.startsWith('/api/')) return Response.json({error:{code:'NOT_FOUND',message:'API route not found.'}},{status:404});
  return env.ASSETS.fetch(request);
 }
};
