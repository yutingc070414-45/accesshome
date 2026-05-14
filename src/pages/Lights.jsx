import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Nav from '../components/Nav';

const API = 'http://localhost:8080';
const ROOMS = [
  { key: 'lr', nameKey: 'rooms.livingRoom', apiName: 'Living Room', defaultBrightness: 75 },
  { key: 'br', nameKey: 'rooms.bedroom', apiName: 'Bedroom', defaultBrightness: 30 },
  { key: 'kt', nameKey: 'rooms.kitchen', apiName: 'Kitchen', defaultBrightness: 100 },
  { key: 'bt', nameKey: 'rooms.bathroom', apiName: 'Bathroom', defaultBrightness: 50 },
];
const SWATCHES = ['#fff9e6', '#b0d4ff', '#ffd0a0', '#b8f53a'];

export default function Lights() {
  const { t } = useTranslation();
  const [roomData, setRoomData] = useState(
    ROOMS.reduce((acc, r) => ({ ...acc, [r.key]: { on: false, brightness: r.defaultBrightness, color: SWATCHES[0] } }), {})
  );

  useEffect(() => {
    fetch(`${API}/api/lights`).then(r => r.json()).then(rooms => {
      setRoomData(prev => {
        const next = { ...prev };
        rooms.forEach(room => {
          const match = ROOMS.find(r => r.apiName === room.room);
          if (match) next[match.key] = { ...next[match.key], on: room.on, brightness: room.brightness };
        });
        return next;
      });
    }).catch(() => {});
  }, []);

  function update(key, patch) {
    setRoomData(prev => {
      const next = { ...prev, [key]: { ...prev[key], ...patch } };
      const room = ROOMS.find(r => r.key === key);
      fetch(`${API}/api/lights/update`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: room.apiName, brightness: next[key].brightness, on: next[key].on }),
      }).catch(() => {});
      return next;
    });
  }

  const BulbSvg = () => (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
  );

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>
      <Nav />
      <main className="page-wrap">
        <div className="page-header fade-up">
          <h2>{t('lights.title')}</h2>
          <p>{t('lights.desc')}</p>
        </div>
        <div className="lights-grid">
          {ROOMS.map((room, i) => {
            const d = roomData[room.key];
            return (
              <div key={room.key} className={`light-card fade-up fade-up-d${i + 1} ${d.on ? 'on' : ''}`}>
                <div className="light-card-header">
                  <div>
                    <div className="light-room">{t(room.nameKey)}</div>
                    <div className="light-status">{d.on ? `On · ${d.brightness}%` : 'Off'}</div>
                  </div>
                  <div className={`toggle-track ${d.on ? 'on' : ''}`} onClick={() => update(room.key, { on: !d.on })}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
                <div className="light-icon" style={{ background: d.color }}><BulbSvg /></div>
                <div className="slider-wrap">
                  <div className="slider-label">
                    <span>{t('lights.brightness')}</span>
                    <span>{d.brightness}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={d.brightness}
                    onChange={e => update(room.key, { brightness: parseInt(e.target.value) })} />
                </div>
                <div className="color-swatches">
                  {SWATCHES.map(color => (
                    <div key={color} className={`swatch ${d.color === color ? 'active' : ''}`}
                      style={{ background: color }} onClick={() => update(room.key, { color })} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
