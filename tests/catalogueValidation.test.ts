import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import products from '../worker/data/products.json';
import rules from '../worker/data/rules.json';
import { validateData } from '../worker/recommendations';
describe('catalogue and rules',()=>{
 it('validates all demo records, mappings, and local assets',()=>{const data=validateData(products,rules);expect(data).not.toBeNull();expect(data!.catalogue.products.length).toBeGreaterThanOrEqual(19);for(const p of data!.catalogue.products)expect(existsSync(`public${p.imagePath}`)).toBe(true);});
 it('uses product images for every new assessment outcome',()=>{
  const ids=['demo_sa_body_wash','demo_ceramide_body_wash','demo_niacinamide_lotion','demo_body_acne_pack','demo_aha_scrub','demo_pigmentation_cream','demo_exfoliation_pigmentation_kit','demo_underarm_roll_on','demo_urea_body_lotion','demo_20_urea_lotion','demo_urea_foot_roll_on','demo_stretch_mark_serum','demo_face_sa_1','demo_face_sa_2','demo_face_bp_25','demo_pimple_patch','demo_face_moisturizer','demo_face_sunscreen'];
  for(const id of ids){const product=products.products.find(p=>p.id===id);expect(product?.imagePath, id).toBeTruthy();expect(product!.imagePath, id).not.toBe('/products/placeholder.svg');expect(existsSync(`public${product!.imagePath}`), id).toBe(true);}
 });
 it('rejects duplicate IDs, missing products, invalid references and unsafe enabled products',()=>{
  expect(validateData({...products,products:[...products.products,products.products[0]]},rules)).toBeNull();
  expect(validateData(products,{...rules,rules:[...rules.rules,rules.rules[0]]})).toBeNull();
  expect(validateData(products,{...rules,rules:[{...rules.rules[0],productId:'missing'}]})).toBeNull();
  expect(validateData(products,{...rules,rules:[{...rules.rules[0],condition:{all:[{type:'answer_any_of',questionId:'body_acne_goal',optionIds:['wrong']}]}}]})).toBeNull();
  const target=rules.rules[0].productId;
  expect(validateData({...products,products:products.products.map(p=>p.id===target?{...p,preMadeKit:true}:p)},rules)).toBeNull();
  expect(validateData({...products,products:products.products.map(p=>p.id===target?{...p,name:'Biotin Hair Gummies'}:p)},rules)).toBeNull();
 });
});
