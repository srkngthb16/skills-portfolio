// tests/lib/cors.test.ts
import { describe, it, expect } from 'vitest';
import { applyCors } from '../../lib/cors.js';
import { createMockReq, createMockRes } from '../helpers/mockReqRes.js';

describe('applyCors', () => {
  it('izinli origin\'e Access-Control-Allow-Origin header\'ı ekler', () => {
    const req = createMockReq({
      method: 'GET',
      headers: { origin: 'https://skills-portfolio-opal.vercel.app' },
    });
    const res = createMockRes();

    applyCors(req, res);

    expect(res.headers['Access-Control-Allow-Origin']).toBe(
      'https://skills-portfolio-opal.vercel.app'
    );
  });

  it('izinli olmayan origin\'e header eklemez', () => {
    const req = createMockReq({
      method: 'GET',
      headers: { origin: 'https://kotu-site.com' },
    });
    const res = createMockRes();

    applyCors(req, res);

    expect(res.headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('OPTIONS (preflight) isteğinde 204 döner ve true ile handler\'ı durdurur', () => {
    const req = createMockReq({ method: 'OPTIONS' });
    const res = createMockRes();

    const shouldStop = applyCors(req, res);

    expect(shouldStop).toBe(true);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('normal (GET/POST) istekte false döner, handler devam edebilir', () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    const shouldStop = applyCors(req, res);

    expect(shouldStop).toBe(false);
  });
});
