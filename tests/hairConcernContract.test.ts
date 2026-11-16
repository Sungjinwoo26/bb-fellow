import {describe,it,expect} from 'vitest';
import {normalizeHairConcern} from '../src/shared/hairConcerns';
import {chatStateSchema,initialChatState} from '../src/shared/chatState';
import {advanceState} from '../worker/chatState';
import type {ChatTurn} from '../src/shared/chatState';
const turn:ChatTurn={action:'find_product',reference_scope:'none',referenced_products:[],product_types:[],concerns:['hair_fall'],hair_concerns:['thinning'],body_areas:['hair'],excluded_ingredients:[],intents:[],missing_information:[],confidence:'high'};
const empty={message:'Do you also notice dandruff or scalp flakes?',status:'clarify',selected_product_ids:[],product_options:[]};
describe('structured hair state',()=>{
 it.each([['hair thinning','thinning'],['thining','thinning'],['hair fall','shedding'],['scalp flakes','flakes'],['dry hair','dry_lengths'],['thin hair','fine_hair']])('normalizes %s', (raw,expected)=>expect(normalizeHairConcern(raw)).toBe(expected));
 it('retains observed flakes when the customer focuses only on thinning',()=>{const first=advanceState(initialChatState(),'I have thinning',[],[],empty,[],turn).state;const yes=advanceState(first,'Yes',[],[],{...empty,message:'Here are options.',status:'answered'},[],{...turn,hair_concerns:[]}).state;expect(yes.hair_context?.flakes).toBe('yes');expect(yes.hair_context?.observed).toContain('flakes');const focus=advanceState(yes,'only thinning',[],[],{...empty,message:'Options.',status:'answered'},[],turn).state;expect(focus.hair_context).toEqual({observed:['thinning','flakes'],focus:'thinning',flakes:'yes'});});
 it('accepts old saved state without hair context',()=>expect(chatStateSchema.safeParse(initialChatState()).success).toBe(true));
});
