import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:8080";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          localStorage.setItem("ah-user", result.name);
          localStorage.setItem("ah-email", email);
          localStorage.setItem("ah-token", result.token);

          navigate("/");
        } else if (result.status === "NOT_FOUND") {
          setError("Email not found.");
        } else if (result.status === "WRONG_PASSWORD") {
          setError("Wrong password.");
        }
      })
      .catch(() => setError("Could not npm run devconnect to server."));
  };

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>
      <main className="page-wrap ac-page">
        <div className="auth-box fade-up">
          <h2>
            Access<span className="green">Home</span>
          </h2>
          <p>Sign in to control your home</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
          <button className="auth-btn" onClick={login}>
            Sign In
          </button>
          <p className="auth-switch">
            No account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </main>
    </>
  );
}
