// tests/helpers/mockReqRes.ts
// Vercel'in gerçek req/res objelerini test sırasında oluşturmak imkansız
// (gerçek bir HTTP sunucusu gerektirir). Bunun yerine, handler'ların
// ihtiyaç duyduğu kadarını taklit eden ("mock") basit objeler kuruyoruz.
//
// Bu yaklaşıma "test double" denir — gerçek nesnenin yerine geçen,
// test amaçlı basitleştirilmiş bir versiyon.

import { vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface MockReqOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[]>;
  headers?: Record<string, string>;
}

export function createMockReq(options: MockReqOptions = {}): VercelRequest {
  return {
    method: options.method ?? 'GET',
    body: options.body ?? {},
    query: options.query ?? {},
    headers: options.headers ?? {},
  } as unknown as VercelRequest;
}

// res.status(200).json({...}) şeklindeki zincirlemeyi taklit ediyoruz.
// Gerçekte hiçbir yere yazmıyor, sadece "hangi status ve body ile
// çağrıldın?" bilgisini test edebilmemiz için saklıyor.
export function createMockRes() {
  const res: {
    statusCode: number;
    body: unknown;
    headers: Record<string, string>;
    status: (code: number) => typeof res;
    json: (data: unknown) => typeof res;
    end: () => typeof res;
    setHeader: (key: string, value: string) => typeof res;
  } = {
    statusCode: 200,
    body: undefined,
    headers: {},
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: unknown) {
      res.body = data;
      return res;
    },
    end() {
      return res;
    },
    setHeader(key: string, value: string) {
      res.headers[key] = value;
      return res;
    },
  };

  // vitest'in "bu fonksiyon kaç kez, neyle çağrıldı" takibini de ekleyelim
  res.status = vi.fn(res.status);
  res.json = vi.fn(res.json);

  return res as unknown as VercelResponse & typeof res;
}
