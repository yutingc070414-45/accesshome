import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Nav from '../components/Nav';

const API = 'http://localhost:8080';
const ROOMS = [
  {
    key: 'lr',
    nameKey: 'rooms.livingRoom',
    apiName: 'Living Room',
    defaultTemp: 22
  },
  {
    key: 'br',
    nameKey: 'rooms.bedroom',
    apiName: 'Bedroom',
    defaultTemp: 20
  },
  {
    key: 'of',
    nameKey: 'rooms.studyRoom',
    apiName: 'Study Room',
    defaultTemp: 24
  },
];

export default function AC() {
  const { t } = useTranslation();
  const [roomData, setRoomData] = useState(
    ROOMS.reduce((acc, r) => ({
      ...acc,
      [r.key]: { on: false, temperature: r.defaultTemp, mode: 'Cool', fanSpeed: 2 }
    }), {})
  );

  useEffect(() => {
    fetch(`${API}/api/ac`).then(r => r.json()).then(rooms => {
      setRoomData(prev => {
        const next = { ...prev };
        rooms.forEach(room => {
          const match = ROOMS.find(r => r.apiName === room.room);
          if (match) next[match.key] = { on: room.on, temperature: room.temperature, mode: room.mode, fanSpeed: room.fanSpeed };
        });
        return next;
      });
    }).catch(() => {});
  }, []);

  function update(key, patch) {
    setRoomData(prev => {
      const next = { ...prev, [key]: { ...prev[key], ...patch } };
      const room = ROOMS.find(r => r.key === key);
      const d = next[key];
      fetch(`${API}/api/ac/update`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: room.apiName, temperature: d.temperature, mode: d.mode, fanSpeed: d.fanSpeed, on: d.on }),
      }).catch(() => {});
      return next;
    });
  }

  const MODES = [
    { key: 'cool', label: t('ac.cool') },
    { key: 'heat', label: t('ac.heat') },
    { key: 'fan',  label: t('ac.fan') },
    { key: 'dry',  label: t('ac.dry') },
  ];

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>
      <Nav />
      <main className="page-wrap ac-page">
        <div className="page-header fade-up">
          <h2>{t('ac.title')}</h2>
          <p>{t('ac.desc')}</p>
        </div>
        <div className="ac-grid">
          {ROOMS.map((room, i) => {
            const d = roomData[room.key];
            return (
              <div key={room.key} className={`ac-card fade-up fade-up-d${i + 1} ${d.on ? 'on' : ''}`}>
                <div className="ac-card-top">
                  <div className="ac-room">{t(room.nameKey)}</div>
                  <div className={`toggle-track ${d.on ? 'on' : ''}`} onClick={() => update(room.key, { on: !d.on })}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
                <div className="temp-display">
                  {d.temperature}<span>°C</span>
                </div>
                <div className="temp-controls">
                  <button className="temp-btn" onClick={() => update(room.key, { temperature: Math.max(16, d.temperature - 1) })}>−</button>
                  <button className="temp-btn" onClick={() => update(room.key, { temperature: Math.min(32, d.temperature + 1) })}>+</button>
                </div>
                <div className="ac-modes">
                  {MODES.map(m => (
                    <button key={m.key} className={`ac-mode-btn ${d.mode.toLowerCase() === m.key ? 'active' : ''}`}
                      onClick={() => update(room.key, { mode: m.key.charAt(0).toUpperCase() + m.key.slice(1) })}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="fan-speed">
                  <div className="fan-label">{t('ac.fanSpeed')}</div>
                  <div className="fan-dots">
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <div key={lvl} className={`fan-dot ${lvl <= d.fanSpeed ? 'active' : ''}`}
                        onClick={() => update(room.key, { fanSpeed: lvl })} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
