// api/skills/index.ts
// GET /api/skills          → tüm yetenekler
// GET /api/skills?category=Frontend  → kategoriye göre filtrele

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';
import { applyCors } from '../../lib/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // req.query'deki değerler "string | string[] | undefined" olabilir
    // (örn. ?category=A&category=B yazılırsa array gelir).
    // Biz her zaman tek bir string bekliyoruz, o yüzden kontrol ediyoruz.
    const categoryParam = req.query.category;
    const category = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;

    let query = supabase.from('skills').select('*').order('id');

    if (category) {
      query = query.ilike('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('Supabase hatası:', message);
    res.status(500).json({ error: 'Veriler alınamadı' });
  }
}
