import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Nav from "../components/Nav";

const API = "http://localhost:8080";
const ROOMS = [
  {
    key: "lr",
    nameKey: "rooms.livingRoom",
    apiName: "Living Room",
    defaultOpen: 60,
  },
  {
    key: "br",
    nameKey: "rooms.bedroom",
    apiName: "Bedroom",
    defaultOpen: 0,
  },
  {
    key: "kt",
    nameKey: "rooms.kitchen",
    apiName: "Kitchen",
    defaultOpen: 100,
  },
  {
    key: "of",
    nameKey: "rooms.studyRoom",
    apiName: "Study Room",
    defaultOpen: 40,
  },
];

export default function Curtain() {
  const { t } = useTranslation();
  const [openPct, setOpenPct] = useState(
    ROOMS.reduce((acc, r) => ({ ...acc, [r.key]: r.defaultOpen }), {}),
  );

  useEffect(() => {
    fetch(`${API}/api/curtain`)
      .then((r) => r.json())
      .then((rooms) => {
        setOpenPct((prev) => {
          const next = { ...prev };
          rooms.forEach((room) => {
            const match = ROOMS.find((r) => r.apiName === room.room);
            if (match) next[match.key] = room.openPercent;
          });
          return next;
        });
      })
      .catch(() => {});
  }, []);

  function setVal(key, val) {
    setOpenPct((prev) => ({ ...prev, [key]: val }));
    const room = ROOMS.find((r) => r.key === key);
    fetch(`${API}/api/curtain/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: room.apiName, openPercent: val }),
    }).catch(() => {});
  }

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>
      <Nav />
      <main className="page-wrap">
        <div className="page-header fade-up">
          <h2>{t("curtain.title")}</h2>
          <p>{t("curtain.desc")}</p>
        </div>
        <div className="curtain-grid">
          {ROOMS.map((room, i) => {
            const open = openPct[room.key];
            const closed = (100 - open) / 2;
            return (
              <div
                key={room.key}
                className={`curtain-card ${open > 0 ? "open" : ""} fade-up fade-up-d${i + 1}`}
              >
                <div className="curtain-card-top">
                  <div className="curtain-room">{t(room.nameKey)}</div>
                  <span className="device-extra">{open}%</span>
                </div>
                <div className="curtain-visual">
                  <div className="curtain-rod"></div>
                  <div
                    className="curtain-l"
                    style={{ width: `${closed}%` }}
                  ></div>
                  <div
                    className="curtain-r"
                    style={{ width: `${closed}%` }}
                  ></div>
                  <div className="curtain-pct">{open}% open</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={open}
                  onChange={(e) => setVal(room.key, parseInt(e.target.value))}
                />
                <div className="curtain-btns">
                  <button
                    className={`curtain-btn ${open === 100 ? "primary" : ""}`}
                    onClick={() => setVal(room.key, 100)}
                  >
                    {t("curtain.open")}
                  </button>
                  <button
                    className={`curtain-btn ${open === 50 ? "primary" : ""}`}
                    onClick={() => setVal(room.key, 50)}
                  >
                    {t("curtain.half")}
                  </button>
                  <button
                    className={`curtain-btn ${open === 0 ? "primary" : ""}`}
                    onClick={() => setVal(room.key, 0)}
                  >
                    {t("curtain.close")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
