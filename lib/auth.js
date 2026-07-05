// lib/auth.js
// Token doğrulama — her korumalı endpoint bunu kullanır.
//
// 1. anon key ile token'ı doğruluyoruz (kullanıcı kim?)
// 2. Geçerliyse service_role key ile bir client oluşturuyoruz
//    service_role RLS'i bypass eder — tam yetki verir
//    Bu güvenli çünkü token kontrolünü biz yapıyoruz

import { createClient } from '@supabase/supabase-js';

export async function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  // Token'ı doğrula
  const anonClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await anonClient.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  // Token geçerli — service_role client döndür
  const serviceClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  return { user: data.user, supabase: serviceClient };
}
