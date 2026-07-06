// api/skills/create.ts
// POST /api/skills/create → yeni yetenek ekle (token gerekli)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../../lib/auth.js';
import { applyCors } from '../../lib/cors.js';
import { validateSkillInput } from '../../lib/validate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyToken(req);
  if (!auth) {
    return res.status(401).json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  // Girdiyi doğruluyoruz — sadece "boş mu" değil, uzunluk ve izin verilen
  // kategori/seviye değerlerine de bakıyoruz.
  const result = validateSkillInput(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const { data, error } = await auth.supabase
      .from('skills')
      .insert(result.data)
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
