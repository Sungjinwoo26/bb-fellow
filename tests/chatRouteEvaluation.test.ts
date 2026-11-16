import { expect,it } from 'vitest';
import { answerChat,answerChatLegacy } from '../worker/productChat';
import { initialChatState } from '../src/shared/chatState';

type Scenario={name:string;turns:string[];initial?:string[]};
const cases:Scenario[]=[
 {name:'Body wash for dry body skin',turns:['I need a body wash for dry skin']},
 {name:'Explicit product format and fragrance exclusion',turns:['I need a body wash for dry body skin without fragrance']},
 {name:'Misspellings and merged words',turns:['Pls sugest a bodywash for body acne']},
 {name:'Misspelled hair loss',turns:['my hair is fallng a lot what shampoo should i use']},
 {name:'Face and body area distinction',turns:['I have pimples on my back and chest, what should I use?']},
 {name:'Two product comparison and prices',initial:['1-salicylic-acid-body-wash-350ml','salicylic-ceramide-bodywash'],turns:['Compare these products and tell me both prices']},
 {name:'Comparison, usage and ingredients',initial:['1-salicylic-acid-body-wash-350ml','salicylic-ceramide-bodywash'],turns:['Compare both, what ingredients do they contain and how do I use them?']},
 {name:'Comparison and individual recommendation',initial:['1-zpto-anti-dandruff-shampoo','hair-fall-control-shampoo'],turns:['Compare these shampoos and tell me which is better for an oily scalp and the prices']},
 {name:'Two exact named products in one question',turns:['Compare 2% Salicylic Acid Face Wash and 2.5% Benzoyl Peroxide Facewash, what do they cost?']},
 {name:'Single product multiple questions',initial:['1-salicylic-acid-body-wash-350ml'],turns:['What are its ingredients and price?']},
 {name:'Ambiguous pronoun with two products',initial:['1-salicylic-acid-body-wash-350ml','salicylic-ceramide-bodywash'],turns:['How often should I apply it?']},
 {name:'Pregnancy and ingredient constraint',turns:['I am pregnant; recommend a body wash without salicylic acid']},
 {name:'Unrelated question',turns:['Can you write a poem about the moon?']},
 {name:'Noisy voice-like transcription',turns:['body smell armpit roll on no perfume please']},
 {name:'Concern then area then product',turns:['I have body odour','Underarms','How do I use it?']},
 {name:'Product detail followed by yes',initial:['6-aha-bha-underarm-roll-on-flora-75ml'],turns:['How do I use this product?','Yes']},
 {name:'Switch from face to body',turns:['I have pimples on my face','I also need something for pimples on my back','I need a body wash for that']},
 {name:'Irritation and product caution',turns:['My underarms are bleeding after using an acid roll on, should I use more?']}
];
it('records identical synthetic scenarios through both local routes',async()=>{
 const records=[];
 for(const c of cases){
  const runs=[];
  for(const [route,fn] of [['legacy',answerChatLegacy],['new',answerChat]] as const){
   let selected=c.initial??[];let state=initialChatState();let followUp:'usage'|'routine'|'timeline'|undefined;let history:{role:'user'|'assistant';text:string}[]=[];
   const steps=[];
   for(const message of c.turns){
    const input={message,input_source:'button' as const,selected_product_ids:selected,history,follow_up:followUp,...(route==='new'?{conversation_state:state}:{})};
    const result=await fn(input,{},false);
    steps.push({question:message,status:result.status,response:result.message,selected:result.selected_product_ids,options:result.product_options,sources:result.sources,recommendations:'recommendations' in result?result.recommendations:[],cards:'product_cards' in result?result.product_cards:[],follow_up:'follow_up' in result?result.follow_up:null});
    if(result.selected_product_ids.length)selected=result.selected_product_ids;
    if('conversation_state' in result)state=result.conversation_state;
    followUp='follow_up' in result?result.follow_up:undefined;
    history=[...history,{role:'user',text:message},{role:'assistant',text:result.message}];
   }
   runs.push({route,steps});
  }
  records.push({name:c.name,runs});
 }
 expect(records).toHaveLength(cases.length);
 for(const record of records)for(const run of record.runs)for(const step of run.steps){expect(step.response,record.name).toBeTruthy();expect(step.response).not.toMatch(/private provider detail|undefined/);}
},30000);
