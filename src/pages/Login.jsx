import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:8080';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(r => r.text())
      .then(result => {
        if (result.startsWith('SUCCESS')) {
          const name = result.split(':')[1];
          localStorage.setItem('ah-user', name);
          localStorage.setItem('ah-email', email);
          navigate('/');
        } else if (result === 'NOT_FOUND') setError('Email not found.');
        else if (result === 'WRONG_PASSWORD') setError('Wrong password.');
      })
      .catch(() => setError('Could not connect to server.'));
  };

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>
      <main className="page-wrap ac-page">
        <div className="auth-box fade-up">
          <h2>Access<span className="green">Home</span></h2>
          <p>Sign in to control your home</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          </div>
          <button className="auth-btn" onClick={login}>Sign In</button>
          <p className="auth-switch">No account? <Link to="/register">Register here</Link></p>
        </div>
      </main>
    </>
  );
}
