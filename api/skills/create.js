// api/skills/create.js
// POST /api/skills/create → yeni yetenek ekle (token gerekli)

import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyToken(req);
  if (!auth) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  const { name, category, level } = req.body;

  if (!name || !category || !level) {
    return res.status(400).json({ error: 'name, category ve level zorunludur' });
  }

  try {
    const { data, error } = await auth.supabase
      .from('skills')
      .insert({ name, category, level })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('Supabase hatası:', err.message);
    res.status(500).json({ error: 'Yetenek eklenemedi' });
  }
}
