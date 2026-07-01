// lib/supabase.js
// Supabase bağlantısını tek bir yerden yönetiyoruz.
// Her API endpoint'i buradan import eder — tekrar tekrar yazmaya gerek yok.
//
// process.env.SUPABASE_URL ve process.env.SUPABASE_ANON_KEY değerleri
// Vercel'de environment variable olarak tanımladığımız bilgiler.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'SUPABASE_URL veya SUPABASE_ANON_KEY environment variable tanımlı değil.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
