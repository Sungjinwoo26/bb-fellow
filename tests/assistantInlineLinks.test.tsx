// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {AssistantText} from '../src/components/ProductAssistant';
afterEach(cleanup);
const products=[{id:'wash',name:'2% Salicylic Acid Face Wash',category:'Face Care',image_url:''},{id:'foam',name:'1% Salicylic Acid Face Wash (Foam-Based)',category:'Face Care',image_url:''},{id:'patch',name:'Hydrocolloid Acne Pimple Patch',category:'Face Care',image_url:''}];
describe('inline product links',()=>{
 it('places the correct link below each product and before the question',()=>{
  const go=vi.fn();const {container}=render(<AssistantText text={'Here are options:\n\n1. **2% Salicylic Acid Face Wash**: For oily skin.\n2. **1% Salicylic Acid Face Wash (Foam-Based)**: For combination skin.\n3. **Hydrocolloid Acne Pimple Patch**: For a spot.\n\nWhich is your skin type?'} recommendations={products} onProduct={go}/>);
  const paragraphs=[...container.querySelectorAll('p')];expect(paragraphs[1].textContent).toContain('Explore 2% Salicylic Acid Face Wash');expect(paragraphs[2].textContent).toContain('Explore 1% Salicylic Acid Face Wash');expect(paragraphs[3].textContent).toContain('Explore Hydrocolloid Acne Pimple Patch');expect(paragraphs[4].textContent).toBe('Which is your skin type?');
  fireEvent.click(within(paragraphs[1]).getByRole('link'));expect(go).toHaveBeenCalledWith('wash');fireEvent.click(within(paragraphs[2]).getByRole('link'));expect(go).toHaveBeenCalledWith('foam');
 });
 it('links product names in bullet lists for any category',()=>{
  render(<AssistantText text={'A hair option:\n- **Keratin Shampoo**: Helps cleanse hair.'} recommendations={[{id:'hair',name:'Keratin Shampoo',category:'Hair Care',image_url:''}]}/>);expect(screen.getByRole('link',{name:'Explore more about Keratin Shampoo'}).getAttribute('href')).toContain('hair');
 });
 it('matches an unambiguous shortened AI product name to the right link',()=>{
  const {container}=render(<AssistantText text={'- **Hair Growth Pack with Roll-On** pairs a scalp serum with hair gummies.'} recommendations={[{id:'growth-pack',name:'Advanced Hair Growth Pack with Roll On 25ml',category:'Hair Care',image_url:''}]}/>);
  expect(container.querySelector('li a')?.getAttribute('href')).toBe('/?product=growth-pack');
 });
 it('does not match an abbreviated name shared by two variants',()=>{
  const variants=[{id:'a',name:'Advanced Hair Growth Pack with Roll On 25ml',category:'Hair Care',image_url:''},{id:'b',name:'Advanced Hair Growth Pack with Roll On 50ml',category:'Hair Care',image_url:''}];
  const {container}=render(<AssistantText text={'- **Hair Growth Pack with Roll-On** may help.'} recommendations={variants}/>);expect(container.querySelector('li a')).toBeNull();expect(container.querySelectorAll('.assistant-unmatched-links a')).toHaveLength(2);
 });
 it('does not guess when two variants share a shortened name',()=>{
  const variants=[{id:'a',name:'Body Lotion - 100 ml',category:'Body Care',image_url:''},{id:'b',name:'Body Lotion - 200 ml',category:'Body Care',image_url:''}];const {container}=render(<AssistantText text={'**Body Lotion**: Helps moisturise.'} recommendations={variants}/>);expect(container.querySelector('p a')).toBeNull();expect(screen.getByRole('link',{name:/Explore Body Lotion - 100 ml/})).toBeTruthy();expect(screen.getByRole('link',{name:/Explore Body Lotion - 200 ml/})).toBeTruthy();
 });
});
