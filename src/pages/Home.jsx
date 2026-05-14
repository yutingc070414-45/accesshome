import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Nav from "../components/Nav";

const API = "http://localhost:8080";

const LightSvg = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const ACSvg = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="9" rx="2.5" />
    <path d="M6 16v3M12 16v3M18 16v3" />
    <line x1="6" y1="11" x2="18" y2="11" />
    <path d="M7 11c0-2 2-2.5 5-2.5s5 .5 5 2.5" />
  </svg>
);

const CurtainSvg = () => (
  <svg viewBox="0 0 24 24">
    <line x1="4" y1="4" x2="20" y2="4" strokeWidth="2" />
    <path d="M4 4c0 6 2.5 11 8 11 5.5 0 8-5 8-11" />
    <line x1="8" y1="4" x2="6" y2="20" />
    <line x1="16" y1="4" x2="18" y2="20" />
  </svg>
);

const DeviceCard = ({
  icon: Icon,
  name,
  extra,
  isOn,
  onToggle,
  onNavigate,
  delay,
  t,
}) => (
  <div
    className={`device-card fade-up ${delay} ${isOn ? "on" : ""}`}
    onClick={onNavigate}
    style={{ cursor: "pointer" }}
  >
    <div className="icon-box">
      <Icon />
    </div>

    <div className="device-name">{name}</div>
    <div className="device-extra">{extra}</div>

    <div className="toggle-row">
      <div
        className={`toggle-track ${isOn ? "on" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(!isOn);
        }}
      >
        <div className="toggle-thumb"></div>
      </div>

      <span className="toggle-label">
        {isOn ? t("common.on") : t("common.off")}
      </span>
    </div>
  </div>
);

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [lights, setLights] = useState({ active: 0, on: false });
  const [ac, setAc] = useState({ active: 0, on: false });
  const [curtain, setCurtain] = useState({ active: 0, on: false });

  function loadAll() {
    fetch(`${API}/api/lights`)
      .then((r) => r.json())
      .then((rooms) => {
        const active = rooms.filter((r) => r.on).length;
        setLights({ active, on: active > 0 });
      });

    fetch(`${API}/api/ac`)
      .then((r) => r.json())
      .then((rooms) => {
        const active = rooms.filter((r) => r.on).length;
        setAc({ active, on: active > 0 });
      });

    fetch(`${API}/api/curtain`)
      .then((r) => r.json())
      .then((rooms) => {
        const active = rooms.filter((r) => r.openPercent > 0).length;
        setCurtain({ active, on: active > 0 });
      });
  }

  useEffect(() => {
    loadAll();
  }, []);

  function toggleLights(isOn) {
    setLights((prev) => ({ ...prev, on: isOn }));
  }

  function toggleAC(isOn) {
    setAc((prev) => ({ ...prev, on: isOn }));
  }

  function toggleCurtain(isOn) {
    setCurtain((prev) => ({ ...prev, on: isOn }));
  }

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>

      <Nav />

      <main className="page-wrap" id="page-home">
        <div className="home-hero fade-up">
          <h1>
            Access<span className="green">Home</span>
          </h1>

          <p>{t("home.desc")}</p>
        </div>

        <div className="device-grid">
          <DeviceCard
            icon={LightSvg}
            name={t("home.light")}
            extra={`${lights.active} ${t("common.roomsOn")}`}
            isOn={lights.on}
            onToggle={toggleLights}
            onNavigate={() => navigate("/lights")}
            delay="fade-up-d1"
            t={t}
          />

          <DeviceCard
            icon={ACSvg}
            name={t("home.ac")}
            extra={`${ac.active} ${t("common.roomsOn")}`}
            isOn={ac.on}
            onToggle={toggleAC}
            onNavigate={() => navigate("/ac")}
            delay="fade-up-d2"
            t={t}
          />

          <DeviceCard
            icon={CurtainSvg}
            name={t("home.curtain")}
            extra={`${curtain.active} ${t("common.roomsOn")}`}
            isOn={curtain.on}
            onToggle={toggleCurtain}
            onNavigate={() => navigate("/curtain")}
            delay="fade-up-d3"
            t={t}
          />
        </div>
      </main>
    </>
  );
}
