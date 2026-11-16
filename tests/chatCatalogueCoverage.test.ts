import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import storefront from '../src/data/storefrontProducts.json';
import chat from '../worker/data/chatProducts.json';
describe('storefront and chat catalogue coverage',()=>{
 it('makes every storefront product available to the assistant with its own image',()=>{
  const ids=new Set(chat.map(p=>p.id));expect(ids.size).toBe(chat.length);
  for(const p of storefront){const slug=new URL(p.source).pathname.split('/').pop()!;expect(ids.has(slug),p.name).toBe(true);expect(existsSync(`public${p.image}`),p.name).toBe(true)}
 });
});
