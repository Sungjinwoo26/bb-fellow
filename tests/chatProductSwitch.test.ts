import {describe,it,expect} from 'vitest';
import {answerChat} from '../worker/productChat';
describe('product switching after a button selection',()=>{
 const old='6-aha-bha-underarm-roll-on-flora-75ml';
 it('switches to the explicitly named face wash',async()=>{const r=await answerChat({message:'How do I use the 2% Salicylic Acid Face Wash?',input_source:'typed',selected_product_ids:[old]},{});expect(r.selected_product_ids).toEqual(['2-salicylic-acid-face-wash']);expect(r.message).not.toMatch(/underarm/i)});
 it('asks which face wash instead of using a selected roll-on',async()=>{const r=await answerChat({message:'How do I use the face wash?',input_source:'typed',selected_product_ids:[old]},{});expect(r.status).toBe('clarify');expect(r.product_options.length).toBeGreaterThan(1);expect(r.product_options.every(p=>/face\s*wash/i.test(p.name))).toBe(true)});
 it('uses a selected face wash when the format is unambiguous',async()=>{const id='2-salicylic-acid-face-wash';const r=await answerChat({message:'How do I use the face wash?',input_source:'typed',selected_product_ids:[id]},{});expect(r.selected_product_ids).toEqual([id]);});
});
