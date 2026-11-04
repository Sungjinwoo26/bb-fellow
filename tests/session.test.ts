import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SESSION_KEY, readSession, startSession } from '../src/app/session';

const data = new Map<string, string>();
const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); }, removeItem: (k: string) => { data.delete(k); } };
beforeEach(() => { data.clear(); vi.stubGlobal('sessionStorage', storage); });
describe('assessment session', () => {
  it('restores a valid session', () => { const s = startSession(); expect(readSession()).toEqual(s); });
  it('discards malformed JSON', () => { data.set(SESSION_KEY, '{'); expect(readSession()).toBeNull(); expect(data.has(SESSION_KEY)).toBe(false); });
  it('discards unsupported versions', () => { data.set(SESSION_KEY, JSON.stringify({schemaVersion: 2})); expect(readSession()).toBeNull(); expect(data.has(SESSION_KEY)).toBe(false); });
  it('starts over without removing other keys', () => { data.set('other', 'keep'); const old = startSession(); const fresh = startSession(); expect(fresh.sessionId).not.toBe(old.sessionId); expect(data.get('other')).toBe('keep'); });
  it('continues in memory when storage fails', () => { vi.stubGlobal('sessionStorage', {getItem: () => { throw Error(); }, removeItem: () => { throw Error(); }, setItem: () => { throw Error(); }}); const s = startSession(); expect(readSession()).toEqual(s); });
});
