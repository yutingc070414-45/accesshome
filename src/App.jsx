import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Lights from "./pages/Lights";
import AC from "./pages/AC";
import Curtain from "./pages/Curtain";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";


function ProtectedRoute({ children }) {
  const user = localStorage.getItem("ah-user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default function App() {

  useEffect(() => {
    const savedFont = localStorage.getItem("ah-fontsize") || "medium";

    const map = {
      small: "14px",
      medium: "16px",
      large: "20px"
    };

    document.documentElement.style.fontSize =
      map[savedFont] || "16px";

    const savedMode =
      localStorage.getItem("ah-mode") || "standard";

    document.body.classList.toggle(
      "contrast-mode",
      savedMode === "contrast"
    );

  }, []);


  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lights"
        element={
          <ProtectedRoute>
            <Lights />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ac"
        element={
          <ProtectedRoute>
            <AC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/curtain"
        element={
          <ProtectedRoute>
            <Curtain />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}