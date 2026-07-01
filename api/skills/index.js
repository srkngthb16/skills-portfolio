// api/skills/index.js
// GET /api/skills          → tüm yetenekler
// GET /api/skills?category=Frontend  → kategoriye göre filtrele
//
// Artık data/skills.json yerine Supabase'deki "skills" tablosundan okuyoruz.

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category } = req.query;

    // Supabase'den veri çekiyoruz
    // .from('skills')  → hangi tablodan
    // .select('*')     → tüm kolonları getir
    let query = supabase.from('skills').select('*').order('id');

    // Eğer ?category= parametresi varsa, SQL'deki WHERE gibi filtrele
    if (category) {
      query = query.ilike('category', category); // büyük/küçük harf duyarsız
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Supabase hatası:', err.message);
    res.status(500).json({ error: 'Veriler alınamadı' });
  }
}
