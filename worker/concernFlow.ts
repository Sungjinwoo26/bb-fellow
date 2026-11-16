import { catalogue as productData } from './catalogue';
type Product={id:string;name:string;category:string;image_url:string;source_url:string};
type Request={message:string;history?:{role:'user'|'assistant';text:string}[];selection_confirmed?:boolean};
const products=productData as Product[];
const clean=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const Q={area:'What would you like help with?',face:'What would you like help with on your face?',hair:'What would you like help with for your hair?',body:'What would you like help with on your body?',sun:'Which area would you like to protect?',skin:'How would you describe your facial skin?',acne:'What would you like to focus on for body acne?',bodydry:'Does the skin on your body often feel dry?',strawberry:'Which format would you prefer for strawberry skin?',pigment:'Which format would you prefer for body pigmentation?',underarm:'What would you like help with for your underarms?',odour:'Where do you notice the odour?',dry:'What would you like help with for dry body skin or heels?',ingrown:'Where do you notice the ingrown hairs?',flakes:'Do you also notice dandruff or flakes?'} as const;
const D:Record<string,string>={
 'hydrocolloid-acne-pimple-patch':'Absorbs fluid from an individual surfaced pimple and helps protect it from picking.',
 '2-salicylic-acid-face-wash':'Salicylic acid clears excess oil and helps unclog pores, making it an option for oily skin and mild, occasional acne.',
 'acne-control-wash':'Salicylic acid exfoliates and helps clear pores in a foaming wash listed for mild, occasional acne and dry or combination skin.',
 '1-peptide-ceramide-moisturizer':'Peptides and ceramides help support the skin barrier and keep skin moisturised.',
 'ultra-light-sunscreen-spf50':'Provides broad-spectrum sun protection for an everyday facial routine.',
 'hair-growth-serum-roll-on':'Applied directly to areas of thinning on the scalp, it is designed for hair thinning and new hair growth.',
 '1-zpto-anti-dandruff-shampoo':'Cleanses the scalp and is designed to control moderate dandruff without as much dryness.',
 'dandruff-and-hairfall-kit':'Combines care for dandruff with hair-fall support in one routine.',
 'anti-frizz-serum':'Smooths the lengths of the hair and is designed for frizzy, damaged-looking hair.',
 '1-salicylic-acid-body-wash-350ml':'Salicylic acid exfoliates and helps clear pores, making it an option for body acne and bumps.',
 'salicylic-ceramide-bodywash':'Salicylic acid exfoliates while ceramides support the skin barrier, making it an option for body acne with dry skin.',
 'niacinamide-body-lotion':'Niacinamide supports skin care for marks left by mild body acne.',
 '5-lactic-acid-body-lotion':'Lactic acid exfoliates while the lotion moisturises, making it an option for strawberry skin.',
 '10-aha-body-scrub-300':'Lactic acid removes dead skin in a rinse-off scrub made for rough-looking strawberry legs.',
 'pigmentation-repair-cream':'Applied to areas of uneven tone, it is designed to reduce the appearance of body pigmentation.',
 'glycolic-acid-stick':'Glycolic and salicylic acids exfoliate skin, targeting uneven-looking pigmentation and ingrown hairs.',
 'body-exfoliation-pigmentation-kit':'Combines an exfoliating stick and cream for rough skin and body pigmentation.',
 '4-aha-bha-underarm-rollon-frag-free-75':'Exfoliating acids support underarm odour control in a fragrance-free format.',
 '6-aha-bha-underarm-roll-on-flora-75ml':'Exfoliating acids remove dead skin and are intended for underarm pigmentation and odour.',
 '4-aha-bha-underarm-roll-on':'An underarm roll-on made for odour and pigmentation, with 4% AHA/BHA.',
 'advanced-underarm-pigmentation-kit':'Combines a roll-on and cream for underarm odour and pigmentation.',
 '10-urea-lotion-300ml':'Urea draws moisture into the skin to soften and hydrate mild to moderately dry body skin.',
 '20-urea-lotion-xp':'Urea draws moisture into the skin and helps soften dry, flaky areas.',
 '20-urea-roll-on-75ml':'Urea helps soften rough, dry skin in a roll-on designed for cracked heels.',
 'triple-milk-deep-hydrating-bodywash-xp':'Cleanses in a formula designed for dry, dehydrated skin.',
 'body-sunscreen-lotion-with-spf-50':'Offers body sun protection in a lotion designed for sun exposure and tan correction.'
};
/** Keep prepared recommendation copy helpful without inventing benefits. */
export function productDescription(product:(typeof productData)[number]):string{
 if(D[product.id])return D[product.id];
 const purpose=product.purpose?.trim().replace(/^for\s*:?\s*/i,'').replace(/[.\s]+$/,'');
 if(!purpose)return 'Product details are limited; check the product page for more information.';
 const readable=purpose.replace(/\s*\|\s*/g, '; ').replace(/\s*\/\s*/g,' and ').replace(/\s*&\s*/g,' and ');
 return `Listed for ${readable.charAt(0).toLowerCase()+readable.slice(1)}.`;
}
function ask(message:string,choices:string[]){return {message,status:'clarify' as const,product_options:[],selected_product_ids:[],sources:[],choices,answer_mode:'prepared_answer' as const};}
function say(message:string){return {message,status:'no_information' as const,product_options:[],selected_product_ids:[],sources:[],answer_mode:'prepared_answer' as const};}
function recommend(ids:string[]){const found=ids.map(id=>products.find(p=>p.id===id)).filter((p):p is Product=>!!p&&!!D[p.id]);if(found.length!==ids.length)return say('Tell me a little more about what you need, and I’ll help you explore the options.');const message=found.map(p=>`**${p.name.replace(/\s*(?:[-–—(]\s*)?\d+\s*(?:ml|g|pcs|n)\)?\s*$/i,'').trim()}:** ${D[p.id]}`).join('\n\n');return {message,status:'answered' as const,product_options:[],selected_product_ids:found.map(p=>p.id),sources:found.map(p=>({title:p.name,url:p.source_url})),recommendations:found.map(p=>({id:p.id,name:p.name,category:p.category,image_url:p.image_url})),answer_mode:'prepared_answer' as const};}
export function guidedRecommendation(ids:string[]){return recommend(ids);}
export function guidedConcern(input:Request){
 if(input.selection_confirmed)return null;
 const q=clean(input.message);const last=[...(input.history??[])].reverse().find(x=>x.role==='assistant')?.text??'';
 if(last===Q.area){if(q==='face care')return ask(Q.face,['Individual surfaced pimples','Acne or bumps','Dryness','Oiliness','Marks or uneven tone','Sun protection','Something else']);if(q==='hair care')return ask(Q.hair,['Hair fall or thinning','Dandruff or flakes','Hair fall and dandruff','Dry or frizzy lengths','Everyday hair care','Something else']);if(q==='body care')return ask(Q.body,['Body acne or marks','Strawberry skin or bumps','Body pigmentation','Underarm pigmentation','Body odour','Dry skin or heels','Everyday cleansing','Ingrown hairs','Something else']);if(q==='sun protection')return ask(Q.sun,['Face','Body','Both','Not sure']);}
 if(q==='something else'||q==='another area'||q==='other')return last&&Object.values(Q).some(v=>v===last)?ask('Please tell me a little more about what you would like help with.',[]):null;
 if(last===Q.face){if(q==='individual surfaced pimples')return recommend(['hydrocolloid-acne-pimple-patch']);if(q==='acne or bumps'||q==='oiliness')return ask(Q.skin,['Oily','Dry or combination','Not sure']);if(q==='dryness')return recommend(['1-peptide-ceramide-moisturizer']);if(q==='sun protection')return ask(Q.sun,['Face','Body','Both','Not sure']);if(q==='marks or uneven tone')return ask('What kind of facial marks or uneven tone would you like help with?',['Marks after pimples','Sun tan','Not sure']);}
 if(last===Q.skin){if(q==='oily')return recommend(['2-salicylic-acid-face-wash']);if(q==='dry or combination')return recommend(['acne-control-wash']);if(q==='not sure')return recommend(['2-salicylic-acid-face-wash','acne-control-wash']);}
 if(last===Q.hair){if(q==='hair fall or thinning')return ask(Q.flakes,['Yes','No','Not sure']);if(q==='dandruff or flakes')return recommend(['1-zpto-anti-dandruff-shampoo']);if(q==='hair fall and dandruff')return recommend(['dandruff-and-hairfall-kit']);if(q==='dry or frizzy lengths')return recommend(['anti-frizz-serum']);if(q==='everyday hair care')return ask('Tell me what you would like help with for everyday hair care.',[]);}
 if(last===Q.flakes){if(q==='yes')return recommend(['dandruff-and-hairfall-kit']);if(q==='no')return recommend(['hair-growth-serum-roll-on']);if(q==='not sure')return recommend(['hair-growth-serum-roll-on','1-zpto-anti-dandruff-shampoo']);}
 if(last===Q.body){if(q==='body acne or marks')return ask(Q.acne,['Active body acne','Marks','Both','Not sure']);if(q==='strawberry skin or bumps')return ask(Q.strawberry,['Body wash','Body lotion','Body scrub','Not sure']);if(q==='body pigmentation')return ask(Q.pigment,['Cream','Exfoliating stick','Kit','Not sure']);if(q==='underarm pigmentation')return ask(Q.underarm,['Odour','Pigmentation','Both','Not sure']);if(q==='body odour')return ask(Q.odour,['Underarms','Another area','Not sure']);if(q==='dry skin or heels')return ask(Q.dry,['Mild or moderate dry body skin','Very dry or flaky body skin','Rough or cracked heels','Not sure']);if(q==='everyday cleansing')return recommend(['triple-milk-deep-hydrating-bodywash-xp']);if(q==='ingrown hairs')return ask(Q.ingrown,['Legs','Arms','Underarms','Bikini area','Another area']);}
 if(last===Q.acne){if(q==='active body acne')return ask(Q.bodydry,['Yes','No','Not sure']);if(q==='marks')return recommend(['niacinamide-body-lotion']);if(q==='both'||q==='not sure')return recommend(['1-salicylic-acid-body-wash-350ml','niacinamide-body-lotion']);}
 if(last===Q.bodydry){if(q==='yes')return recommend(['salicylic-ceramide-bodywash']);if(q==='no')return recommend(['1-salicylic-acid-body-wash-350ml']);if(q==='not sure')return recommend(['salicylic-ceramide-bodywash','1-salicylic-acid-body-wash-350ml']);}
 if(last===Q.strawberry){if(q==='body wash')return recommend(['1-salicylic-acid-body-wash-350ml']);if(q==='body lotion')return recommend(['5-lactic-acid-body-lotion']);if(q==='body scrub')return recommend(['10-aha-body-scrub-300']);if(q==='not sure')return recommend(['1-salicylic-acid-body-wash-350ml','5-lactic-acid-body-lotion','10-aha-body-scrub-300']);}
 if(last===Q.pigment){if(q==='cream')return recommend(['pigmentation-repair-cream']);if(q==='exfoliating stick')return recommend(['glycolic-acid-stick']);if(q==='kit')return recommend(['body-exfoliation-pigmentation-kit']);if(q==='not sure')return recommend(['pigmentation-repair-cream','glycolic-acid-stick']);}
 if(last===Q.odour){if(q==='underarms')return ask(Q.underarm,['Odour','Pigmentation','Both','Not sure']);if(q==='not sure')return ask('Which area would you like help with?',[]);}
 if(last===Q.underarm){if(q==='odour')return recommend(['4-aha-bha-underarm-rollon-frag-free-75']);if(q==='pigmentation')return recommend(['6-aha-bha-underarm-roll-on-flora-75ml']);if(q==='both')return recommend(['advanced-underarm-pigmentation-kit']);if(q==='not sure')return recommend(['4-aha-bha-underarm-rollon-frag-free-75','6-aha-bha-underarm-roll-on-flora-75ml']);}
 if(last===Q.dry){if(q==='mild or moderate dry body skin')return recommend(['10-urea-lotion-300ml']);if(q==='very dry or flaky body skin')return recommend(['20-urea-lotion-xp']);if(q==='rough or cracked heels')return recommend(['20-urea-roll-on-75ml']);if(q==='not sure')return recommend(['10-urea-lotion-300ml','20-urea-lotion-xp']);}
 if(last===Q.ingrown){if(q==='legs'||q==='arms')return {...recommend(['glycolic-acid-stick']),message:'**7% Glycolic Acid Exfoliating Body Stick:** Exfoliates skin and is designed for ingrown hairs. Use only once recently waxed skin has settled and follow the label.'};if(q==='underarms'||q==='bikini area')return say('Check that a product specifically says it is suitable for this area; avoid applying exfoliating products to freshly waxed, broken or irritated skin.');}
 if(last===Q.sun){if(q==='face')return recommend(['ultra-light-sunscreen-spf50']);if(q==='body')return recommend(['body-sunscreen-lotion-with-spf-50']);if(q==='both')return recommend(['ultra-light-sunscreen-spf50','body-sunscreen-lotion-with-spf-50']);if(q==='not sure')return ask('Would you like sun protection for your face or your body?',['Face','Body','Both']);}
 if(last==='Would you like sun protection for your face or your body?'){if(q==='face')return recommend(['ultra-light-sunscreen-spf50']);if(q==='body')return recommend(['body-sunscreen-lotion-with-spf-50']);if(q==='both')return recommend(['ultra-light-sunscreen-spf50','body-sunscreen-lotion-with-spf-50']);}
 return null;
}
