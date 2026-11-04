import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import products from '../worker/data/products.json';
import rules from '../worker/data/rules.json';
import { validateData } from '../worker/recommendations';
describe('catalogue and rules',()=>{
 it('validates all demo records, mappings, and local assets',()=>{const data=validateData(products,rules);expect(data).not.toBeNull();expect(data!.catalogue.products).toHaveLength(10);for(const p of data!.catalogue.products)expect(existsSync(`public${p.imagePath}`)).toBe(true);});
 it('rejects duplicate IDs, missing products, invalid references and unsafe enabled products',()=>{
  expect(validateData({...products,products:[...products.products,products.products[0]]},rules)).toBeNull();
  expect(validateData(products,{...rules,rules:[...rules.rules,rules.rules[0]]})).toBeNull();
  expect(validateData(products,{...rules,rules:[{...rules.rules[0],productId:'missing'}]})).toBeNull();
  expect(validateData(products,{...rules,rules:[{...rules.rules[0],condition:{all:[{type:'answer_any_of',questionId:'body_acne_goal',optionIds:['wrong']}]}}]})).toBeNull();
  expect(validateData({...products,products:products.products.map((p,i)=>i===0?{...p,preMadeKit:true}:p)},rules)).toBeNull();
  expect(validateData({...products,products:products.products.map((p,i)=>i===0?{...p,name:'Biotin Hair Gummies'}:p)},rules)).toBeNull();
 });
});
