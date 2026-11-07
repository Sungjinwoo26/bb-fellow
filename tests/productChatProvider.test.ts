import { beforeEach, describe, expect, it, vi } from 'vitest';
const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));
vi.mock('@google/genai', () => ({ GoogleGenAI: class { models = { generateContent }; } }));
import { answerChat } from '../worker/productChat';
const env = { GEMINI_API_KEY: 'test-key', GEMINI_MODEL: 'test-model' };
const input = { message: 'How often should I use it?', selected_product_ids: ['4-aha-bha-underarm-rollon-frag-free-75'] };
describe('Gemini response handling', () => {
 beforeEach(() => { generateContent.mockReset(); });
 it('retries a truncated response and uses the completed answer', async () => {
  generateContent.mockResolvedValueOnce({ text: 'Cut off', candidates: [{ finishReason: 'MAX_TOKENS' }] }).mockResolvedValueOnce({ text: 'Use it daily.', candidates: [{ finishReason: 'STOP' }] });
  const result = await answerChat(input, env);
  expect(result.message).toBe('Use it daily.'); expect(generateContent).toHaveBeenCalledTimes(2);
  expect(generateContent.mock.calls[1][0].config.maxOutputTokens).toBeGreaterThan(generateContent.mock.calls[0][0].config.maxOutputTokens);
 });
 it('returns the local fact instead of a repeatedly truncated response', async () => {
  generateContent.mockResolvedValue({ text: 'Cut off', candidates: [{ finishReason: 'MAX_TOKENS' }] });
  const result = await answerChat(input, env);
  expect(result.answer_mode).toBe('verified_data_fallback'); expect(result.message).toContain('Daily'); expect(result.message).not.toContain('Cut off');
 });
 it('returns the local fact when Gemini fails', async () => {
  generateContent.mockRejectedValue(Object.assign(new Error('private provider detail'), { status: 429 }));
  const result = await answerChat(input, env);
  expect(result.answer_mode).toBe('verified_data_fallback'); expect(result.message).toContain('Daily'); expect(result.message).not.toContain('private provider detail');
 });
 it('sends both product use cases to Gemini for a plain-language comparison', async () => {
  generateContent.mockResolvedValue({ text: 'Choose the first for mild pigmentation or the second for a more exfoliating option.', candidates: [{ finishReason: 'STOP' }] });
  const result = await answerChat({message:'Compare two products',selected_product_ids:['4-aha-bha-underarm-rollon-frag-free-75','6-aha-bha-underarm-roll-on-flora-75ml'],selection_confirmed:true},env);
  expect(result.answer_mode).toBe('ai');const sent=JSON.parse(generateContent.mock.calls[0][0].contents);expect(sent.products).toHaveLength(2);expect(sent.products[0].purpose).toMatch(/mild pigmentation/i);expect(sent.products[1].purpose).toMatch(/stubborn pigmentation/i);expect(sent.products[0]).not.toHaveProperty('ingredients');
 });
 it('does not return an unconfirmed fragrance claim in a comparison',async()=>{
  generateContent.mockResolvedValue({text:'The first is fragrance-free and the second has a floral scent.',candidates:[{finishReason:'STOP'}]});
  const result=await answerChat({message:'Compare two products',selected_product_ids:['4-aha-bha-underarm-rollon-frag-free-75','6-aha-bha-underarm-roll-on-flora-75ml'],selection_confirmed:true},env);
  expect(result.answer_mode).toBe('verified_data_fallback');expect(result.message).not.toMatch(/floral scent/i);expect(result.message).toMatch(/mild pigmentation/i);
 });
});
