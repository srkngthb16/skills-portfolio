// src/pages/Login.jsx
import { useState } from 'react';

export default function Login({ onLogin, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  function switchMode(next) {
    setMode(next);
    setStatus('idle');
    setErrorMsg('');
    setInfoMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    setInfoMsg('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Bir şeyler ters gitti');
        return;
      }

      if (mode === 'signup') {
        // Kayıt başarılı — Supabase genelde e-posta doğrulaması bekler,
        // bu yüzden direkt giriş yapmıyoruz, kullanıcıyı bilgilendiriyoruz.
        setStatus('success');
        setInfoMsg('Hesap oluşturuldu. E-postanı doğruladıktan sonra giriş yapabilirsin.');
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      setStatus('idle');
      onLogin(data.access_token);
    } catch {
      setStatus('error');
      setErrorMsg('Sunucuya bağlanılamadı');
    }
  }

  return (
    <div
      className="login-bg"
      onClick={(e) => {
        // Sadece arka plana (kartın dışına) tıklanınca kapat
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="login-card">
        <div className="login-header">
          <span className="login-dot" />
          <span className="login-dot" />
          <span className="login-dot" />
          <button
            type="button"
            className="login-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        <div className="login-body">
          <p className="login-eyebrow">
            {mode === 'login' ? 'Admin Girişi' : 'Hesap Oluştur'}
          </p>
          <h1 className="login-title">Serkan Dalgıç</h1>
          <p className="login-sub">Skills Portfolio yönetim paneli</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field-wrap">
              <input
                className="login-input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                autoComplete="email"
              />
              <label className="login-label" htmlFor="email">E-posta</label>
            </div>

            <div className="field-wrap">
              <input
                className="login-input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <label className="login-label" htmlFor="password">Şifre</label>
            </div>

            {errorMsg && <p className="login-error">{errorMsg}</p>}
            {infoMsg && <p className="login-info">{infoMsg}</p>}

            <button
              className={`login-btn ${status === 'loading' ? 'loading' : ''}`}
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="btn-spinner" />
              ) : mode === 'login' ? (
                'Giriş Yap'
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>

          <p className="login-switch">
            {mode === 'login' ? (
              <>Hesabın yok mu?{' '}
                <button type="button" onClick={() => switchMode('signup')}>
                  Kayıt ol
                </button>
              </>
            ) : (
              <>Zaten hesabın var mı?{' '}
                <button type="button" onClick={() => switchMode('login')}>
                  Giriş yap
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
