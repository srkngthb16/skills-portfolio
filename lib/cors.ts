// lib/cors.ts
// CORS (Cross-Origin Resource Sharing) — bir web sitesinin JavaScript ile
// BAŞKA bir domain'deki API'ye istek atabilmesini kontrol eden tarayıcı
// güvenlik mekanizması.
//
// Varsayılan durumda (hiçbir header eklemezsek) tarayıcılar farklı
// origin'lerden gelen fetch isteklerini genelde zaten engeller, AMA bu
// engel sadece TARAYICI güvenliğidir — curl, Postman, başka bir sunucu
// bu korumadan hiç etkilenmez. Aşağıdaki kontrol, API'nin KENDİSİNİN de
// "hangi origin'lere güveniyorum" diye açıkça karar vermesini sağlar.

import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://skills-portfolio-opal.vercel.app',
  'http://localhost:3000', // vercel dev ile yerel test
  'http://localhost:5173', // vite dev sunucusu (bağımsız çalıştırılırsa)
];

/**
 * Her API handler'ının en başında çağrılır.
 * - Origin izinliyse CORS header'larını ekler.
 * - İstek bir "preflight" (OPTIONS) isteğiyse hemen 204 döner ve true verir
 *   (bu durumda handler'ın devam ETMEMESİ gerekir — asıl işlem yapılmaz).
 * - Normal istekse false döner, handler normal akışına devam eder.
 */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true; // handler burada dursun
  }

  return false; // handler normal işine devam etsin
}
