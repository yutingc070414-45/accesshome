import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MODES = [
  { id: "standard", label: "Standard Mode", icon: "☀️" },
  { id: "contrast", label: "Contrast Mode", icon: "◐" },
];

export default function Nav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modeIdx, setModeIdx] = useState(() => {
    const saved = localStorage.getItem("ah-mode") || "standard";
    return MODES.findIndex((m) => m.id === saved);
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatar = localStorage.getItem("ah-avatar");
  const name = localStorage.getItem("ah-user") || "";
  const email = localStorage.getItem("ah-email") || "";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const mode = MODES[modeIdx];
    document.body.classList.toggle("contrast-mode", mode.id === "contrast");
    localStorage.setItem("ah-mode", mode.id);
  }, [modeIdx]);

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const toggleMode = () => setModeIdx((i) => (i + 1) % MODES.length);
  const mode = MODES[modeIdx];

  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">
        Access<span className="green">Home</span>
        <div className="logo-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b8f53a"
            strokeWidth="1.8"
          >
            <path d="M3 10L12 3l9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
            <circle cx="12" cy="13" r="2.2" />
            <circle
              cx="12"
              cy="13"
              r="4.5"
              strokeDasharray="2 2"
              opacity=".5"
            />
          </svg>
        </div>
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/">{t("nav.home")}</NavLink>
        </li>
        <li>
          <NavLink to="/lights">{t("nav.lights")}</NavLink>
        </li>
        <li>
          <NavLink to="/ac">{t("nav.ac")}</NavLink>
        </li>
        <li>
          <NavLink to="/curtain">{t("nav.curtain")}</NavLink>
        </li>
        <li>
          <NavLink to="/contact">{t("nav.contact")}</NavLink>
        </li>
      </ul>

      <div className="nav-right">
        <div
          className="mode-badge"
          onClick={toggleMode}
          role="button"
          tabIndex={0}
        >
          <div
            className="mode-dot"
            style={{
              background: mode.id === "contrast" ? "#ffff00" : "var(--accent)",
            }}
          ></div>
          <span>{mode.icon}</span> <span>{mode.label}</span>
        </div>

        <div
          className="avatar"
          onClick={() => navigate("/profile")}
          style={{
            backgroundImage: avatar ? `url(${avatar})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
        >
          {!avatar && initials}
        </div>

        {dropdownOpen && (
          <div
            className="profile-dropdown open"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-header">
              <div
                className="dropdown-avatar"
                style={
                  avatar
                    ? {
                        backgroundImage: `url(${avatar})`,
                        backgroundSize: "cover",
                      }
                    : {}
                }
              >
                {!avatar && initials}
              </div>
              <div>
                <div className="dropdown-name">{name}</div>
                <div className="dropdown-email">{email}</div>
              </div>
            </div>
            <hr className="dropdown-divider" />
            <span
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDropdownOpen(false);
                navigate("/profile");
              }}
            >
              Profile &amp; Settings
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
