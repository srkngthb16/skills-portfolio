// api/skills/remove/[id].js
// DELETE /api/skills/remove/:id → bir yeteneği sil
//
// Örnek: DELETE /api/skills/remove/12 → id'si 12 olan yeteneği sil

import { supabase } from '../../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const { data, error } = await supabase
      .from('skills')
      .delete()          // SQL: DELETE FROM skills
      .eq('id', id)      // SQL: WHERE id = :id
      .select();         // silinen satırı geri döndür (silindi mi teyit et)

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Yetenek bulunamadı' });
    }

    // 200 OK — silinen kaydı döndür
    res.status(200).json({ message: 'Yetenek silindi', deleted: data[0] });
  } catch (err) {
    console.error('Supabase hatası:', err.message);
    res.status(500).json({ error: 'Yetenek silinemedi' });
  }
}
