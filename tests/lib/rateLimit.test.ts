// tests/lib/rateLimit.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isRateLimited, getClientIp } from '../../lib/rateLimit.js';

describe('isRateLimited', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ilk 5 denemeye izin verir, 6.\'yı engeller', () => {
    // Her test kendi benzersiz key'ini kullanır — böylece testler
    // birbirinin sayacını etkilemez (modül seviyesindeki Map paylaşımlı).
    const key = 'test-ip-1';

    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key)).toBe(false);
    }

    // 6. deneme artık engellenmeli
    expect(isRateLimited(key)).toBe(true);
  });

  it('zaman penceresi dolunca sayaç sıfırlanır', () => {
    const key = 'test-ip-2';

    for (let i = 0; i < 5; i++) {
      isRateLimited(key);
    }
    expect(isRateLimited(key)).toBe(true); // limit doldu

    // 5 dakika + 1 saniye ileri sar
    vi.advanceTimersByTime(5 * 60 * 1000 + 1000);

    // Pencere yenilendiği için tekrar izin vermeli
    expect(isRateLimited(key)).toBe(false);
  });

  it('farklı key\'ler (IP\'ler) birbirinden bağımsız sayılır', () => {
    const keyA = 'test-ip-a';
    const keyB = 'test-ip-b';

    for (let i = 0; i < 5; i++) {
      isRateLimited(keyA);
    }
    expect(isRateLimited(keyA)).toBe(true); // A'nın limiti doldu

    // B hiç istek atmadı, hâlâ izinli olmalı
    expect(isRateLimited(keyB)).toBe(false);
  });
});

describe('getClientIp', () => {
  it('x-forwarded-for string ise ilk IP\'yi döner', () => {
    const req = { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } };
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('x-forwarded-for array ise ilk elemanı döner', () => {
    const req = { headers: { 'x-forwarded-for': ['9.9.9.9', '1.1.1.1'] } };
    expect(getClientIp(req)).toBe('9.9.9.9');
  });

  it('header hiç yoksa "unknown" döner', () => {
    const req = { headers: {} };
    expect(getClientIp(req)).toBe('unknown');
  });
});
