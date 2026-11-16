import { catalogue } from './catalogue';

type Database={prepare(query:string):{bind(...values:unknown[]):{run():Promise<unknown>}}};
type ChatResult={message:string;status:string;answer_mode?:string;cache_status?:string;selected_product_ids?:string[];recommendations?:{id:string}[];product_options?:{id:string}[];choices?:string[]};
type Capture={message:string;selection_confirmed?:boolean;selected_product_ids?:string[];input_source?:'typed'|'button';conversation_id?:string;turn_index?:number};

// Basic redaction helps, but does not make free text anonymous.
export function redactReviewText(text:string){return text.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,'[email removed]').replace(/(?:\+?\d[\d ()-]{8,}\d)/g,'[number removed]').replace(/https?:\/\/\S+/gi,'[link removed]').trim();}
export async function saveChatReview(db:Database|undefined,input:Capture,result:ChatResult){
 if(!db||!result.message)return;
 const selected=(input.selected_product_ids??[]).map(id=>catalogue.find(p=>p.id===id)?.name).filter(Boolean);
 const question=redactReviewText(input.selection_confirmed&&selected.length?`${input.message} — ${selected.join(' & ')}`:input.message).slice(0,1000);
 const answer=redactReviewText(result.message).slice(0,4000);
 if(!question||!answer)return;
 const key=question.toLowerCase().replace(/[^\p{L}\p{N}%]+/gu,' ').trim();
 // Retain the existing anonymous question index for earlier review workflows.
 if(result.status!=='unavailable')await db.prepare('INSERT INTO chat_review (id,question,question_key,answer,answer_mode,status) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),question,key,answer,result.answer_mode??'unknown',result.status).run();
 if(input.conversation_id&&input.turn_index){
  const ids=(values:string[]|undefined)=>JSON.stringify((values??[]).filter(id=>catalogue.some(p=>p.id===id)).slice(0,8));
  await db.prepare('INSERT OR IGNORE INTO chat_conversation_turns (conversation_id,turn_index,question,answer,input_source,selection_confirmed,requested_product_ids,selected_product_ids,recommended_product_ids,offered_product_ids,response_choices,answer_mode,cache_status,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(input.conversation_id,input.turn_index,question,answer,input.input_source??'typed',input.selection_confirmed?1:0,ids(input.selected_product_ids),ids(result.selected_product_ids),ids(result.recommendations?.map(p=>p.id)),ids(result.product_options?.map(p=>p.id)),JSON.stringify((result.choices??[]).slice(0,8).map(c=>redactReviewText(c).slice(0,120))),result.answer_mode??'unknown',result.cache_status??null,result.status).run();
 }
}
