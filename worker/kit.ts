import { configuredData, type Catalogue } from './recommendations';
import { kitRequestSchema, type KitLine, type Quote } from '../src/shared/kit';
const limit=32768;
export function calculateQuote(lines:KitLine[],catalogue:Catalogue):Quote {
 let subtotalPaise=0,eligibleSubtotalPaise=0,eligibleUnits=0;
 for(const line of lines){const p=catalogue.products.find(x=>x.id===line.productId);if(!p || !p.active)throw new Error('invalid product');const amount=p.pricePaise*line.quantity;subtotalPaise+=amount;if(p.discountEligible && !p.preMadeKit){eligibleSubtotalPaise+=amount;eligibleUnits+=line.quantity;}}
 const discountPercent=eligibleUnits>=4?30:eligibleUnits===3?20:eligibleUnits===2?10:0;const discountPaise=Math.round(eligibleSubtotalPaise*discountPercent/100);const deliveryPaise=0;
 return {catalogueVersion:catalogue.version,currency:'INR',subtotalPaise,eligibleSubtotalPaise,eligibleUnits,discountPercent,discountPaise,deliveryPaise,totalPaise:subtotalPaise-discountPaise+deliveryPaise};
}
function error(status:number,code:string,message:string,fields?:string[]){return Response.json({error:{code,message,...(fields?{fields}:{}),requestId:crypto.randomUUID()}},{status,headers:{'Cache-Control':'no-store'}});}
export async function kitRoute(request:Request,checkout=false,getData:typeof configuredData=configuredData):Promise<Response>{
 const length=Number(request.headers.get('content-length'));if(Number.isFinite(length)&&length>limit)return error(413,'REQUEST_TOO_LARGE','Request is too large.');
 let body='';try{const reader=request.body?.getReader();let size=0;const decoder=new TextDecoder();if(reader)while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();return error(413,'REQUEST_TOO_LARGE','Request is too large.');}body+=decoder.decode(value,{stream:true});}body+=decoder.decode();}catch{return error(400,'INVALID_JSON','Request body is not valid JSON.');}
 let raw:unknown;try{raw=JSON.parse(body);}catch{return error(400,'INVALID_JSON','Request body is not valid JSON.');}
 const parsed=kitRequestSchema.safeParse(raw);if(!parsed.success)return error(422,'INVALID_INPUT','One or more kit selections are invalid.',[...new Set(parsed.error.issues.map(i=>i.path.length?i.path.map((p,j)=>typeof p==='number'?`[${p}]`:j?`.${String(p)}`:String(p)).join(''):'request'))]);
 const data=getData();if(!data)return error(503,checkout?'CHECKOUT_UNAVAILABLE':'CATALOGUE_UNAVAILABLE','Sample product information is unavailable.');
 if(parsed.data.catalogueVersion!==data.catalogue.version)return error(409,'CATALOGUE_CHANGED','Sample product information has changed. Please refresh your recommendations.');
 if(checkout && !parsed.data.items.length)return error(422,'EMPTY_KIT','Your kit is empty.');
 const invalid=parsed.data.items.flatMap((line,i)=>data.catalogue.products.some(p=>p.id===line.productId && p.active)?[]:[`items[${i}].productId`]);if(invalid.length)return error(422,'INVALID_INPUT','One or more kit selections are invalid.',invalid);
 try{const quote=calculateQuote(parsed.data.items,data.catalogue);if(!checkout)return Response.json(quote,{headers:{'Cache-Control':'no-store'}});const bytes=crypto.getRandomValues(new Uint8Array(3));const reference='DEMO-'+Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();return Response.json({status:'simulated',reference,message:'Demo complete. No order or payment was created.',quote},{headers:{'Cache-Control':'no-store'}});}catch{return error(503,checkout?'CHECKOUT_UNAVAILABLE':'CATALOGUE_UNAVAILABLE','Sample product information is unavailable.');}
}
