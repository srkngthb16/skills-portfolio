// api/skills/create.ts
// POST /api/skills/create → yeni yetenek ekle (token gerekli)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../../lib/auth.js';
import type { NewSkill } from '../../lib/types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyToken(req);
  if (!auth) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  // req.body'nin NewSkill şekline uyduğunu belirtiyoruz —
  // yani { name, category, level } bekliyoruz.
  const { name, category, level } = req.body as NewSkill;

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
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('Supabase hatası:', message);
    res.status(500).json({ error: 'Yetenek eklenemedi' });
  }
}
