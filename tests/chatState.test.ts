import {describe,it,expect} from 'vitest';
import {initialChatState,chatStateSchema} from '../src/shared/chatState';
import {interpretTurn,advanceState} from '../worker/chatState';
import {catalogue} from '../worker/catalogue';
import {chatRoute} from '../worker/productChat';
const product=catalogue.find(p=>p.id==='1-salicylic-acid-body-wash-350ml')!;
describe('structured conversation state',()=>{
 it('resolves a pronoun to an active product',()=>{const state={...initialChatState(),active_product_ids:[product.id]};const turn=interpretTurn('What are its ingredients?',[],state,catalogue,[]);expect(turn.referenced_products).toEqual([product.id]);expect(turn.reference_scope).toBe('active_product');});
 it('resolves an ordinal and refuses a missing ordinal',()=>{const state={...initialChatState(),recommended_product_ids:[product.id]};expect(interpretTurn('the first one',[],state,catalogue,[]).referenced_products).toEqual([product.id]);expect(interpretTurn('the second one',[],state,catalogue,[]).missing_information).toContain('referenced_product');});
 it('records answers and retains them across an empty-history turn',()=>{const first=advanceState(initialChatState(),'Dry skin',[{role:'assistant',text:'Is your skin dry or oily?'}],[],{message:'Here is an option.',status:'answered',selected_product_ids:[product.id],product_options:[],recommendations:[{id:product.id}]},catalogue).state;const second=advanceState(first,'How do I use it?',[],[],{message:'Apply to wet skin.',status:'answered',selected_product_ids:[product.id],product_options:[]},catalogue).state;expect(second.answered_questions).toHaveLength(1);expect(second.active_product_ids).toEqual([product.id]);expect(chatStateSchema.safeParse(second).success).toBe(true);});
 it('keeps product provenance and marks missing information honestly',()=>{expect(product.evidence.usage.source_url).toBe(product.source_url);expect(product.catalogue_version).toBeTruthy();});
 it('rejects state that refers to an unknown product',async()=>{const req=new Request('http://local/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Tell me about it',conversation_state:{...initialChatState(),active_product_ids:['not-in-catalogue']}})});expect((await chatRoute(req,{})).status).toBe(400);});
});
