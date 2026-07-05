// src/pages/Admin.jsx
import { useState, useEffect } from 'react';

const CATEGORIES = ['Frontend', 'Backend', 'Veritabanı', 'Araçlar', 'Diller', 'Diğer'];
const LEVELS = ['Başlangıç', 'Orta', 'İleri'];

export default function Admin({ token, onLogout }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', level: 'Orta' });
  const [addStatus, setAddStatus] = useState('idle'); // idle | loading | success | error
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchSkills() {
    setLoading(true);
    const res = await fetch('/api/skills');
    const data = await res.json();
    setSkills(data);
    setLoading(false);
  }

  useEffect(() => { fetchSkills(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setAddStatus('loading');
    try {
      const res = await fetch('/api/skills/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(newSkill),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      setSkills((prev) => [...prev, added]);
      setNewSkill({ name: '', category: 'Frontend', level: 'Orta' });
      setAddStatus('success');
      showToast(`"${added.name}" eklendi`);
      setTimeout(() => setAddStatus('idle'), 1500);
    } catch {
      setAddStatus('error');
      showToast('Eklenemedi', 'error');
      setTimeout(() => setAddStatus('idle'), 1500);
    }
  }

  function startEdit(skill) {
    setEditingId(skill.id);
    setEditForm({ name: skill.name, category: skill.category, level: skill.level });
  }

  async function handleUpdate(id) {
    try {
      const res = await fetch(`/api/skills/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setEditingId(null);
      showToast(`"${updated.name}" güncellendi`);
    } catch {
      showToast('Güncellenemedi', 'error');
    }
  }

  async function handleRemove(skill) {
    setRemovingId(skill.id);
    await new Promise((r) => setTimeout(r, 350)); // animasyon için bekle
    try {
      const res = await fetch(`/api/skills/remove?id=${skill.id}`, {
        method: 'DELETE',
        headers: authHeader,
      });
      if (!res.ok) throw new Error();
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      showToast(`"${skill.name}" silindi`);
    } catch {
      showToast('Silinemedi', 'error');
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="admin-wrap">

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-eyebrow">Admin Paneli</span>
          <h1 className="admin-title">Yetenekler</h1>
        </div>
        <div className="admin-header-right">
          <a href="/" className="admin-link">← Siteye dön</a>
          <button className="admin-logout" onClick={onLogout}>Çıkış</button>
        </div>
      </header>

      <main className="admin-main">

        {/* Yetenek listesi */}
        <section className="admin-section">
          <p className="admin-section-label">Mevcut Yetenekler ({skills.length})</p>

          {loading ? (
            <div className="admin-loading">
              <div className="spinner" />
            </div>
          ) : (
            <div className="skills-table">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`skill-row ${removingId === skill.id ? 'removing' : ''}`}
                >
                  {editingId === skill.id ? (
                    <>
                      <input
                        className="edit-input"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <select
                        className="edit-select"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <select
                        className="edit-select"
                        value={editForm.level}
                        onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                      >
                        {LEVELS.map((l) => <option key={l}>{l}</option>)}
                      </select>
                      <div className="row-actions">
                        <button className="btn-save" onClick={() => handleUpdate(skill.id)}>Kaydet</button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="row-name">{skill.name}</span>
                      <span className="row-category">{skill.category}</span>
                      <span className="row-level">{skill.level}</span>
                      <div className="row-actions">
                        <button className="btn-edit" onClick={() => startEdit(skill)}>Düzenle</button>
                        <button className="btn-delete" onClick={() => handleRemove(skill)}>Sil</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Yeni yetenek ekle */}
        <section className="admin-section">
          <p className="admin-section-label">Yeni Yetenek Ekle</p>
          <form className="add-form" onSubmit={handleAdd}>
            <input
              className="add-input"
              placeholder="Yetenek adı (örn. TypeScript)"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              required
            />
            <select
              className="add-select"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              className="add-select"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            >
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button
              className={`add-btn ${addStatus}`}
              type="submit"
              disabled={addStatus === 'loading'}
            >
              {addStatus === 'loading' ? <span className="btn-spinner" /> :
               addStatus === 'success' ? '✓ Eklendi' :
               addStatus === 'error' ? '✕ Hata' : '+ Ekle'}
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}
