// tests/lib/validate.test.ts
import { describe, it, expect } from 'vitest';
import { validateSkillInput, validateSkillUpdateInput } from '../../lib/validate.js';

describe('validateSkillInput', () => {
  it('geçerli bir yeteneği kabul eder', () => {
    const result = validateSkillInput({
      name: 'TypeScript',
      category: 'Frontend',
      level: 'Orta',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data).toEqual({
        name: 'TypeScript',
        category: 'Frontend',
        level: 'Orta',
      });
    }
  });

  it('baştaki/sondaki boşlukları temizler (trim)', () => {
    const result = validateSkillInput({
      name: '  TypeScript  ',
      category: 'Frontend',
      level: 'Orta',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.name).toBe('TypeScript');
    }
  });

  it('boş isim reddedilir', () => {
    const result = validateSkillInput({ name: '', category: 'Frontend', level: 'Orta' });
    expect(result.valid).toBe(false);
  });

  it('eksik alan reddedilir', () => {
    const result = validateSkillInput({ name: 'TypeScript' });
    expect(result.valid).toBe(false);
  });

  it('60 karakterden uzun isim reddedilir', () => {
    const longName = 'a'.repeat(61);
    const result = validateSkillInput({
      name: longName,
      category: 'Frontend',
      level: 'Orta',
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/60 karakter/);
    }
  });

  it('whitelist dışı kategori reddedilir', () => {
    const result = validateSkillInput({
      name: 'TypeScript',
      category: 'GeçersizKategori',
      level: 'Orta',
    });
    expect(result.valid).toBe(false);
  });

  it('whitelist dışı seviye reddedilir', () => {
    const result = validateSkillInput({
      name: 'TypeScript',
      category: 'Frontend',
      level: 'Uzman', // izin verilen listede yok
    });
    expect(result.valid).toBe(false);
  });

  it('string olmayan (örn. sayı veya obje) girdileri güvenle reddeder', () => {
    // Bu, birinin normalde string beklenen bir alana kötü amaçlı bir
    // obje göndermeye çalıştığı senaryoyu simüle ediyor.
    const result = validateSkillInput({
      name: { malicious: true },
      category: 'Frontend',
      level: 'Orta',
    });
    expect(result.valid).toBe(false);
  });
});

describe('validateSkillUpdateInput', () => {
  it('sadece gönderilen tek bir alanı günceller', () => {
    const result = validateSkillUpdateInput({ level: 'İleri' });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data).toEqual({ level: 'İleri' });
    }
  });

  it('hiçbir alan gönderilmezse reddeder', () => {
    const result = validateSkillUpdateInput({});
    expect(result.valid).toBe(false);
  });

  it('geçersiz kategoriyle güncellemeyi reddeder', () => {
    const result = validateSkillUpdateInput({ category: 'OlmayanKategori' });
    expect(result.valid).toBe(false);
  });

  it('birden fazla geçerli alanı aynı anda günceller', () => {
    const result = validateSkillUpdateInput({ name: 'Yeni İsim', level: 'Başlangıç' });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data).toEqual({ name: 'Yeni İsim', level: 'Başlangıç' });
    }
  });
});
