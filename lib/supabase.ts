// lib/supabase.ts
// Supabase bağlantısını tek bir yerden yönetiyoruz.
// Her API endpoint'i buradan import eder — tekrar tekrar yazmaya gerek yok.
//
// process.env.SUPABASE_URL ve process.env.SUPABASE_ANON_KEY değerleri
// Vercel'de environment variable olarak tanımladığımız bilgiler.
//
// TypeScript notu: process.env üzerindeki her değer "string | undefined"
// tipindedir — yani "tanımlı olabilir de olmayabilir de" demektir.
// Aşağıdaki if kontrolü sayesinde TypeScript, kontrolden sonraki satırlarda
// bu değerlerin kesinlikle "string" olduğunu anlar (buna "type narrowing" denir).

import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
const supabaseKey: string | undefined = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'SUPABASE_URL veya SUPABASE_ANON_KEY environment variable tanımlı değil.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
