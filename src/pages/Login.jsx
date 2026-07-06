// src/pages/Login.jsx
import { useState } from 'react';

export default function Login({ onLogin, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
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
          <p className="login-eyebrow">Admin Girişi</p>
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
                autoComplete="current-password"
              />
              <label className="login-label" htmlFor="password">Şifre</label>
            </div>

            {errorMsg && <p className="login-error">{errorMsg}</p>}

            <button
              className="login-btn"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? <span className="btn-spinner" /> : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
