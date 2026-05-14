import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Lights from './pages/Lights';
import AC from './pages/AC';
import Curtain from './pages/Curtain';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('ah-user');
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  useEffect(() => {
    const savedFont = localStorage.getItem('ah-fontsize') || 'medium';
    const map = { small: '14px', medium: '16px', large: '20px' };
    document.documentElement.style.fontSize = map[savedFont] || '16px';
    const savedMode = localStorage.getItem('ah-mode') || 'standard';
    document.body.classList.toggle('contrast-mode', savedMode === 'contrast');
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/lights" element={<PrivateRoute><Lights /></PrivateRoute>} />
      <Route path="/ac" element={<PrivateRoute><AC /></PrivateRoute>} />
      <Route path="/curtain" element={<PrivateRoute><Curtain /></PrivateRoute>} />
      <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
