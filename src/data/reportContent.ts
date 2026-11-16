export type Ingredient = {name:string;description:string;art:number};
const ingredients:Record<string,Ingredient>={
 salicylic:{name:'Salicylic acid',description:'Helps exfoliate inside pores and loosen buildup on the skin.',art:0},
 niacinamide:{name:'Niacinamide',description:'Helps support the skin barrier and improve the appearance of uneven tone.',art:1},
 ceramide:{name:'Ceramides',description:'Help support the skin barrier and retain moisture.',art:2},
 urea:{name:'Urea',description:'Helps draw moisture into skin and soften dry, rough areas.',art:3},
 lactic:{name:'Lactic acid',description:'An exfoliating acid that can help smooth rough-feeling skin.',art:4},
 glycolic:{name:'Glycolic acid',description:'Helps exfoliate the skin’s surface and improve the look of uneven texture.',art:5},
 allantoin:{name:'Allantoin',description:'A skin-conditioning ingredient that helps soothe and comfort skin.',art:6},
 glycerin:{name:'Glycerin',description:'A humectant that draws moisture to the skin.',art:7},
 peptide:{name:'Peptides',description:'Skin-conditioning ingredients that support a smooth, supple feel.',art:8},
 peroxide:{name:'Benzoyl peroxide',description:'Helps reduce acne-causing bacteria and supports care for breakouts.',art:0},
 zinc:{name:'Zinc pyrithione',description:'An anti-dandruff ingredient that helps control flakes.',art:1},
 biotin:{name:'Biotin',description:'A conditioning ingredient included in the matched hair-care formula.',art:2},
 keratin:{name:'Keratin',description:'A hair-conditioning protein that helps hair feel smoother.',art:3},
 panthenol:{name:'Panthenol',description:'A conditioning ingredient that helps hair and skin retain moisture.',art:4},
 rosemary:{name:'Rosemary',description:'A botanical ingredient included in your matched scalp-care formula.',art:5},
 redensyl:{name:'Redensyl',description:'A cosmetic ingredient blend used in scalp and hair-care products.',art:6},
 mineral:{name:'Mineral UV filters',description:'Zinc oxide and titanium dioxide help protect skin from UV radiation.',art:7},
 filters:{name:'UV filters',description:'Sunscreen filters help protect exposed skin from ultraviolet radiation.',art:8},
 hydrocolloid:{name:'Hydrocolloid',description:'Absorbs fluid and creates a protective cover over a spot.',art:0},
 arbutin:{name:'Alpha arbutin',description:'A skin-conditioning ingredient used to address the appearance of uneven tone.',art:1},
 aloe:{name:'Aloe vera',description:'A skin-conditioning ingredient that helps provide a comfortable feel.',art:2},
 shea:{name:'Shea butter',description:'An emollient that helps soften and moisturise skin.',art:3},
 argan:{name:'Argan oil',description:'A conditioning oil that helps hair feel softer and smoother.',art:4},
 bakuchiol:{name:'Bakuchiol',description:'A botanical-derived ingredient used in skin-conditioning formulas.',art:5},
 mandelic:{name:'Mandelic acid',description:'An exfoliating AHA used to smooth the appearance of skin.',art:6},
};
const productIngredients:Record<string,string[]>={
 demo_sa_body_wash:['salicylic'],demo_ceramide_body_wash:['salicylic','ceramide','glycerin'],demo_niacinamide_lotion:['niacinamide'],demo_body_acne_pack:['salicylic','niacinamide'],demo_aha_scrub:['lactic'],demo_pigmentation_cream:['lactic','urea'],demo_exfoliation_pigmentation_kit:['glycolic','lactic','urea'],demo_underarm_roll_on:['salicylic','mandelic','lactic','arbutin'],demo_underarm_kit:['salicylic','mandelic','lactic','urea'],demo_urea_body_lotion:['urea','shea'],demo_20_urea_lotion:['urea','ceramide'],demo_urea_foot_roll_on:['urea','lactic'],demo_hydrating_body_wash:['glycerin','shea'],demo_stretch_mark_serum:['bakuchiol'],demo_face_sa_1:['salicylic','glycolic'],demo_face_sa_2:['salicylic','allantoin'],demo_face_bp_25:['peroxide','aloe'],demo_pimple_patch:['hydrocolloid'],demo_face_moisturizer:['ceramide','peptide','panthenol'],demo_face_sunscreen:['filters','niacinamide'],demo_mineral_sunscreen:['mineral','niacinamide'],demo_body_sunscreen:['filters','niacinamide'],demo_sun_duo:['filters','niacinamide'],demo_hair_fall_shampoo:['keratin','biotin'],demo_hair_growth_serum:['redensyl','rosemary'],demo_zpto_shampoo:['zinc','salicylic','allantoin'],demo_hair_conditioner:['biotin','argan'],demo_frizz_serum:['keratin','ceramide','panthenol'],
};
export function ingredientsFor(ids:string[]):Ingredient[]{return ids.flatMap(id=>productIngredients[id]??[]).filter((id,index,all)=>all.indexOf(id)===index).map(id=>ingredients[id]).filter(Boolean);}
export type RoutineStep={title:string;timing:string;description:string};
export function routineFor(id:string):RoutineStep|null {
 if(['demo_sa_body_wash','demo_ceramide_body_wash','demo_body_acne_pack'].includes(id))return {title:'Cleanse the affected body areas',timing:'IN THE SHOWER',description:'Gently apply the body wash to wet skin and rinse thoroughly. Avoid harsh scrubbing; start gradually if your skin feels sensitive.'};
 if(['demo_face_sa_1','demo_face_sa_2','demo_face_bp_25'].includes(id))return {title:'Cleanse your face',timing:'ONCE DAILY TO START',description:'Massage the cleanser gently onto damp skin, rinse well and pat dry. Reduce use if it causes dryness or irritation.'};
 if(id==='demo_face_cleanser')return {title:'Cleanse your face',timing:'MORNING AND EVENING',description:'Massage the cleanser gently onto damp skin, rinse and pat dry.'};
 if(id==='demo_pimple_patch')return {title:'Cover individual spots',timing:'ON CLEAN, DRY SKIN',description:'Apply a patch to a clean, dry spot and leave it in place as directed.'};
 if(['demo_aha_scrub','demo_exfoliation_pigmentation_kit'].includes(id))return {title:'Exfoliate gently',timing:'AS DIRECTED',description:'Use the exfoliating product as directed on intact skin. Avoid combining multiple exfoliants on the same area at the same time.'};
 if(['demo_underarm_roll_on','demo_underarm_kit'].includes(id))return {title:'Care for your underarms',timing:'ON CLEAN, DRY SKIN',description:'Apply the roll-on to clean, dry underarms as directed. Avoid using it on irritated or freshly shaved skin.'};
 if(['demo_urea_body_lotion','demo_20_urea_lotion','demo_niacinamide_lotion','demo_pigmentation_cream','demo_stretch_mark_serum','demo_lactic_body_lotion'].includes(id))return {title:'Care for your skin',timing:'AFTER CLEANSING',description:'Apply the matched moisturising or targeted product to the relevant area as directed.'};
 if(id==='demo_urea_foot_roll_on')return {title:'Soften dry heels',timing:'ON CLEAN, DRY FEET',description:'Apply to dry, rough heel areas as directed; avoid broken skin.'};
 if(['demo_face_moisturizer'].includes(id))return {title:'Moisturise your face',timing:'AFTER CLEANSING',description:'Smooth moisturiser onto clean skin. In the morning, follow with sunscreen.'};
 if(['demo_face_sunscreen','demo_mineral_sunscreen','demo_body_sunscreen','demo_sun_duo'].includes(id))return {title:'Protect exposed skin',timing:'EVERY MORNING',description:'Apply sunscreen generously before sun exposure and reapply about every two hours outdoors and after swimming or sweating.'};
 if(['demo_hair_fall_shampoo','demo_zpto_shampoo'].includes(id))return {title:'Cleanse your scalp',timing:'ON WASH DAYS',description:'Apply the shampoo to wet scalp and hair, then rinse thoroughly. Follow the product directions for frequency.'};
 if(['demo_hair_conditioner','demo_keratin_conditioner'].includes(id))return {title:'Condition your hair lengths',timing:'AFTER SHAMPOO',description:'Apply conditioner through the hair lengths, avoiding the scalp, then rinse.'};
 if(id==='demo_hair_growth_serum')return {title:'Care for your scalp',timing:'AS DIRECTED',description:'Apply the scalp serum as directed to the areas you want to care for.'};
 if(id==='demo_frizz_serum')return {title:'Smooth hair lengths',timing:'AFTER WASHING',description:'Shake the serum, rub a small amount between your palms and apply through the hair lengths.'};
 if(id==='demo_hydrating_body_wash')return {title:'Cleanse gently',timing:'IN THE SHOWER',description:'Apply the body wash to wet skin and rinse thoroughly.'};
 return null;
}
