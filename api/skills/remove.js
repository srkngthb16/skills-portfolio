// api/skills/remove.js
// DELETE /api/skills/remove?id=12 → bir yeteneği sil

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'id parametresi zorunludur' });
  }

  try {
    const { data, error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Yetenek bulunamadı' });
    }

    res.status(200).json({ message: 'Yetenek silindi', deleted: data[0] });
  } catch (err) {
    console.error('Supabase hatası:', err.message);
    res.status(500).json({ error: 'Yetenek silinemedi' });
  }
}
