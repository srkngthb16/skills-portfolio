// lib/rateLimit.ts
// Basit bir "sliding window" rate limiter — belirli bir süre içinde
// bir IP'den kaç istek geldiğini sayar, limiti aşarsa engeller.
//
// ÖNEMLİ SINIRLAMA (dürüst olalım):
// Vercel serverless fonksiyonları "stateless" çalışır — yani her istek
// teorik olarak sıfırdan başlayabilir. Bu Map, fonksiyon "sıcak" kaldığı
// sürece (aynı fonksiyon örneği tekrar kullanıldığında) hafızada durur,
// ama "cold start" olursa (Vercel fonksiyonu kapatıp yeniden açtığında)
// sıfırlanır. Bu yüzden bu çözüm "iyi bir ilk katman" ama tek başına
// production-grade bir çözüm değildir.
//
// Gerçek production'da: Upstash Redis veya Vercel KV gibi, tüm fonksiyon
// örnekleri arasında PAYLAŞILAN bir depo kullanılır. Bu proje ölçeğinde
// (kişisel portfolyo, tek admin) bu basit çözüm yeterli bir koruma katmanı
// sağlıyor ve maliyetsiz.

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const attempts = new Map<string, RateLimitEntry>();

const WINDOW_MS = 5 * 60 * 1000; // 5 dakikalık pencere
const MAX_ATTEMPTS = 5; // pencere içinde en fazla 5 deneme

/**
 * key: genelde istek yapan IP adresi (bazen + endpoint adı birleştirilir).
 * Dönüş: true → limit aşıldı (isteği reddet), false → izin ver.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // Pencere yok veya süresi geçmiş — yeni pencere başlat
    attempts.set(key, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return true; // limit aşıldı
  }

  entry.count += 1;
  return false;
}

/**
 * Vercel'de gerçek istemci IP'sini almak için doğru header'ı okur.
 * Vercel, istekleri kendi proxy'sinden geçirdiği için IP burada
 * 'x-forwarded-for' header'ında bulunur (req.socket üzerinden değil).
 */
export function getClientIp(req: { headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  return 'unknown';
}
