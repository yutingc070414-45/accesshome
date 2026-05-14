import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:8080';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = () => {
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
      .then(r => r.text())
      .then(result => {
        if (result === 'SUCCESS') navigate('/login');
        else if (result === 'EMAIL_EXISTS') setError('Email already registered.');
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
          <p>Create your account</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Name</label>
            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="auth-btn" onClick={register}>Register</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </main>
    </>
  );
}
