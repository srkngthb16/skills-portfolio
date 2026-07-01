// api/skills/[id].js
// GET /api/skills/:id → tek bir yeteneği id'ye göre getir

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)   // WHERE id = :id
      .single();       // tek satır bekliyoruz

    if (error) {
      return res.status(404).json({ error: 'Yetenek bulunamadı' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Supabase hatası:', err.message);
    res.status(500).json({ error: 'Veri alınamadı' });
  }
}
