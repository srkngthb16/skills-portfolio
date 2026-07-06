// lib/validate.ts
// Kullanıcıdan (veya saldırgandan) gelen veriyi veritabanına yazmadan önce
// doğrulayıp temizliyoruz. Buna "input validation & sanitization" denir.
//
// Neden önemli?
// - Uzunluk sınırı olmasa biri devasa bir string gönderip veritabanını/
//   arayüzü şişirebilir (basit bir "denial of service" türü).
// - category/level gibi alanlarda sadece belirli değerlere izin vermek,
//   beklenmedik veya kötü amaçlı verinin veritabanına girmesini engeller.
// - trim() ile baştaki/sondaki boşlukları temizlemek veri kalitesini korur.
//
// Not: React zaten kullanıcıya gösterilen metni otomatik "escape" ettiği
// için klasik <script> enjeksiyonu (XSS) burada çalışmaz — ama yine de
// veritabanına neyin girdiğini kontrol etmek iyi bir pratiktir.

export const ALLOWED_CATEGORIES = [
  'Frontend',
  'Backend',
  'Veritabanı',
  'Araçlar',
  'Diller',
  'Diğer',
] as const;

export const ALLOWED_LEVELS = ['Başlangıç', 'Orta', 'İleri'] as const;

const MAX_NAME_LENGTH = 60;

// "Discriminated union" — valid: true ise data KESİNLİKLE var,
// valid: false ise error KESİNLİKLE var. TypeScript bu ayrımı otomatik
// anlar: "if (!result.valid) return" sonrasında result.data'nın var
// olduğunu garanti eder, bizim ekstra kontrol yapmamıza gerek kalmaz.
//
// <T> bir "generic" — bu tipi farklı veri şekilleriyle yeniden kullanmamızı
// sağlıyor: create için tam obje, update için kısmi (Partial) obje.
export type ValidationResult<T> = { valid: true; data: T } | { valid: false; error: string };

/**
 * Bir yetenek objesinin (name, category, level) geçerli olup olmadığını
 * kontrol eder. Geçerliyse temizlenmiş (trim edilmiş) veriyi döner.
 */
export function validateSkillInput(input: {
  name?: unknown;
  category?: unknown;
  level?: unknown;
}): ValidationResult<{ name: string; category: string; level: string }> {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const category = typeof input.category === 'string' ? input.category.trim() : '';
  const level = typeof input.level === 'string' ? input.level.trim() : '';

  if (!name || !category || !level) {
    return { valid: false, error: 'name, category ve level zorunludur' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      valid: false,
      error: `İsim en fazla ${MAX_NAME_LENGTH} karakter olabilir`,
    };
  }

  if (!ALLOWED_CATEGORIES.includes(category as (typeof ALLOWED_CATEGORIES)[number])) {
    return { valid: false, error: 'Geçersiz kategori' };
  }

  if (!ALLOWED_LEVELS.includes(level as (typeof ALLOWED_LEVELS)[number])) {
    return { valid: false, error: 'Geçersiz seviye' };
  }

  return { valid: true, data: { name, category, level } };
}

/**
 * Güncelleme isteklerinde her alan opsiyonel olabilir — sadece
 * gönderilen alanları doğrular, eksik olanları görmezden gelir.
 */
export function validateSkillUpdateInput(input: {
  name?: unknown;
  category?: unknown;
  level?: unknown;
}): ValidationResult<Partial<{ name: string; category: string; level: string }>> {
  const updates: { name?: string; category?: string; level?: string } = {};

  if (input.name !== undefined) {
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    if (!name) return { valid: false, error: 'name boş olamaz' };
    if (name.length > MAX_NAME_LENGTH) {
      return { valid: false, error: `İsim en fazla ${MAX_NAME_LENGTH} karakter olabilir` };
    }
    updates.name = name;
  }

  if (input.category !== undefined) {
    const category = typeof input.category === 'string' ? input.category.trim() : '';
    if (!ALLOWED_CATEGORIES.includes(category as (typeof ALLOWED_CATEGORIES)[number])) {
      return { valid: false, error: 'Geçersiz kategori' };
    }
    updates.category = category;
  }

  if (input.level !== undefined) {
    const level = typeof input.level === 'string' ? input.level.trim() : '';
    if (!ALLOWED_LEVELS.includes(level as (typeof ALLOWED_LEVELS)[number])) {
      return { valid: false, error: 'Geçersiz seviye' };
    }
    updates.level = level;
  }

  if (Object.keys(updates).length === 0) {
    return { valid: false, error: 'Güncellenecek en az bir alan gerekli' };
  }

  return { valid: true, data: updates };
}
