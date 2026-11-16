import {describe,it,expect} from 'vitest';
import products from '../worker/data/chatProducts.json';
import {rankProducts} from '../worker/productMatcher';
describe('product matching',()=>{
 it('finds products from misspellings and merged words',()=>{expect(rankProducts('hair growt rollon serum',products).slice(0,4).some(p=>/hair.*serum.*roll/i.test(p.name))).toBe(true)});
 it('searches full ingredient lists',()=>{const found=rankProducts('products with niacinamide',products);expect(found.length).toBeGreaterThan(0);expect(found.slice(0,4).every(p=>/niacinamide/i.test(`${p.ingredients} ${p.full_ingredients}`))).toBe(true)});
 it('matches written-out percentages to the right underarm variant',()=>{const found=rankProducts('four percent underarm rollon',products);expect(found[0].id).toBe('4-aha-bha-underarm-rollon-frag-free-75')});
});
