import {describe,it,expect} from 'vitest';
import {answerChat} from '../worker/productChat';
type Turn={role:'user'|'assistant';text:string};
async function flow(choices:string[]){let history:Turn[]=[];let selected:string[]=[];let r:any;for(const message of ['Find a product for my concern',...choices]){r=await answerChat({message,input_source:'button',history,selected_product_ids:selected},{});history.push({role:'user',text:message},{role:'assistant',text:r.message});selected=r.selected_product_ids;}return r;}
const cases:[string[],string[]][]=[
 [['Face care','Individual surfaced pimples'],['hydrocolloid-acne-pimple-patch']],
 [['Face care','Acne or bumps','Oily'],['2-salicylic-acid-face-wash']],
 [['Face care','Acne or bumps','Dry or combination'],['acne-control-wash']],
 [['Face care','Oiliness','Not sure'],['2-salicylic-acid-face-wash','acne-control-wash']],
 [['Face care','Dryness'],['1-peptide-ceramide-moisturizer']],
 [['Hair care','Hair fall or thinning','Yes'],['dandruff-and-hairfall-kit']],
 [['Hair care','Hair fall or thinning','No'],['hair-growth-serum-roll-on']],
 [['Hair care','Hair fall or thinning','Not sure'],['hair-growth-serum-roll-on','1-zpto-anti-dandruff-shampoo']],
 [['Hair care','Dandruff or flakes'],['1-zpto-anti-dandruff-shampoo']],
 [['Hair care','Hair fall and dandruff'],['dandruff-and-hairfall-kit']],
 [['Hair care','Dry or frizzy lengths'],['anti-frizz-serum']],
 [['Body care','Body acne or marks','Active body acne','Yes'],['salicylic-ceramide-bodywash']],
 [['Body care','Body acne or marks','Active body acne','No'],['1-salicylic-acid-body-wash-350ml']],
 [['Body care','Body acne or marks','Marks'],['niacinamide-body-lotion']],
 [['Body care','Body acne or marks','Both'],['1-salicylic-acid-body-wash-350ml','niacinamide-body-lotion']],
 [['Body care','Strawberry skin or bumps','Body wash'],['1-salicylic-acid-body-wash-350ml']],
 [['Body care','Strawberry skin or bumps','Body lotion'],['5-lactic-acid-body-lotion']],
 [['Body care','Strawberry skin or bumps','Body scrub'],['10-aha-body-scrub-300']],
 [['Body care','Body pigmentation','Cream'],['pigmentation-repair-cream']],
 [['Body care','Body pigmentation','Exfoliating stick'],['glycolic-acid-stick']],
 [['Body care','Body pigmentation','Kit'],['body-exfoliation-pigmentation-kit']],
 [['Body care','Underarm pigmentation','Odour'],['4-aha-bha-underarm-rollon-frag-free-75']],
 [['Body care','Underarm pigmentation','Pigmentation'],['6-aha-bha-underarm-roll-on-flora-75ml']],
 [['Body care','Underarm pigmentation','Both'],['advanced-underarm-pigmentation-kit']],
 [['Body care','Body odour','Underarms','Odour'],['4-aha-bha-underarm-rollon-frag-free-75']],
 [['Body care','Dry skin or heels','Mild or moderate dry body skin'],['10-urea-lotion-300ml']],
 [['Body care','Dry skin or heels','Very dry or flaky body skin'],['20-urea-lotion-xp']],
 [['Body care','Dry skin or heels','Rough or cracked heels'],['20-urea-roll-on-75ml']],
 [['Body care','Everyday cleansing'],['triple-milk-deep-hydrating-bodywash-xp']],
 [['Body care','Ingrown hairs','Legs'],['glycolic-acid-stick']],
 [['Sun protection','Face'],['ultra-light-sunscreen-spf50']],
 [['Sun protection','Body'],['body-sunscreen-lotion-with-spf-50']],
 [['Sun protection','Both'],['ultra-light-sunscreen-spf50','body-sunscreen-lotion-with-spf-50']],
];
describe('approved guided concern outcomes',()=>{
 it.each(cases)('%s returns the intended products',async(choices,ids)=>{const r=await flow(choices);expect(r.answer_mode).toBe('prepared_answer');expect(r.recommendations?.map((p:any)=>p.id)).toEqual(ids);if(choices[0]==='Face care'&&['Oily','Dry or combination'].includes(choices.at(-1)??''))expect(r.message).toMatch(/would you like to know how to use it/i);else expect(r.message).not.toContain('?');});
 it('keeps bikini-area advice free of unsupported product recommendations',async()=>{const r=await flow(['Body care','Ingrown hairs','Bikini area']);expect(r.recommendations??[]).toHaveLength(0);expect(r.message).toMatch(/suitable for this area/i)});
});
