import { describe, expect, it, vi } from 'vitest';
import { redactReviewText, saveChatReview } from '../worker/chatReview';
describe('chat review storage',()=>{
 it('stores answered messages by default with obvious contact details redacted',async()=>{
  const run=vi.fn().mockResolvedValue({});const bind=vi.fn(()=>({run}));const db={prepare:vi.fn(()=>({bind}))};
  await saveChatReview(db,{message:'Email me at example@test.com'},{message:'Try this',status:'answered',answer_mode:'ai'});expect(run).toHaveBeenCalledOnce();expect(bind.mock.calls[0].join(' ')).not.toContain('example@test.com');
  await saveChatReview(db,{message:'Hello'},{message:'Please retry',status:'unavailable'});expect(run).toHaveBeenCalledOnce();
  expect(redactReviewText('Call +91 98765 43210')).toContain('[number removed]');
 });
 it('groups ordered turns by conversation and records answer route, product IDs and button source',async()=>{
  const run=vi.fn().mockResolvedValue({});const bind=vi.fn(()=>({run}));const db={prepare:vi.fn(()=>({bind}))};
  await saveChatReview(db,{conversation_id:'11111111-1111-4111-8111-111111111111',turn_index:2,message:'How do I use it?',input_source:'button',selected_product_ids:['hair-fall-control-shampoo']},{message:'Follow the label.',status:'answered',answer_mode:'prepared_answer',selected_product_ids:['hair-fall-control-shampoo'],recommendations:[{id:'hair-fall-control-shampoo'}]});
  expect(db.prepare).toHaveBeenCalledTimes(2);const recorded=bind.mock.calls[1] as unknown[];expect(recorded[0]).toBe('11111111-1111-4111-8111-111111111111');expect(recorded[1]).toBe(2);expect(recorded[4]).toBe('button');expect(recorded[6]).toContain('hair-fall-control-shampoo');expect(recorded[11]).toBe('prepared_answer');
 });
 it('records provider-unavailable replies in a conversation even though legacy review excludes them',async()=>{
  const run=vi.fn().mockResolvedValue({});const bind=vi.fn(()=>({run}));const db={prepare:vi.fn(()=>({bind}))};await saveChatReview(db,{conversation_id:'11111111-1111-4111-8111-111111111111',turn_index:3,message:'Next?'},{message:'Please try again.',status:'unavailable',answer_mode:'ai'});expect(db.prepare).toHaveBeenCalledOnce();expect(db.prepare.mock.calls[0][0]).toContain('chat_conversation_turns');
 });
});
