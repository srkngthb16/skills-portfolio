// tests/helpers/supabaseMock.ts
// Gerçek Supabase client'ı ".from().insert().select().single()" gibi
// zincirleme metodlarla çalışır ve zincirin HERHANGİ bir noktasında
// "await" edilebilir (yani zincirdeki her obje aynı zamanda bir Promise
// gibi davranır — buna "thenable" denir).
//
// Bu mock, JavaScript'in Proxy özelliğini kullanarak şunu yapıyor:
// "Üzerimde çağrılan HERHANGİ bir metod (from, insert, select, eq, vb.)
// beni tekrar döndürsün; ama biri beni 'await' ederse, önceden
// belirlenmiş sonucu (result) versin."
//
// Böylece gerçek bir veritabanına bağlanmadan, Supabase'in davranışını
// gerçekçi şekilde taklit edebiliyoruz.

import { vi } from 'vitest';

export function createChainableSupabase(result: { data: unknown; error: unknown }) {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === 'then') {
        // await edildiğinde çalışacak kısım
        return (resolve: (value: typeof result) => void) => resolve(result);
      }
      // from(), insert(), select(), eq(), ilike(), delete(), update() vb.
      // hepsi çağrılabilir bir fonksiyon olmalı ve zinciri (proxy'yi) döndürmeli.
      return vi.fn(() => proxy);
    },
  };

  const proxy = new Proxy({}, handler);
  return proxy;
}
