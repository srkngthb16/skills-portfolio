// lib/auth.ts
// Token doğrulama — her korumalı endpoint bunu kullanır.
//
// 1. anon key ile token'ı doğruluyoruz (kullanıcı kim?)
// 2. Geçerliyse service_role key ile bir client oluşturuyoruz
//    service_role RLS'i bypass eder — tam yetki verir
//    Bu güvenli çünkü token kontrolünü biz yapıyoruz
//
// TypeScript notu: VercelRequest tipi, req.headers'ın hangi alanlara
// sahip olabileceğini tanımlar. Bu sayede "req.haeders" gibi bir yazım
// hatası yaparsan (headers'ı yanlış yazsan), kod çalışmadan editör hata verir.

import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

// Bu fonksiyonun ne döndüreceğini açıkça tanımlıyoruz:
// ya null (giriş yapılmamış), ya da { user, supabase } objesi
type AuthResult = { user: User; supabase: SupabaseClient } | null;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function verifyToken(req: VercelRequest): Promise<AuthResult> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase environment variable\'ları tanımlı değil.');
  }

  const token = authHeader.split(' ')[1];

  // Token'ı doğrula
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await anonClient.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  // Token geçerli — service_role client döndür
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  return { user: data.user, supabase: serviceClient };
}
