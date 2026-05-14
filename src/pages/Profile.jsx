import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

const API = 'http://localhost:8080';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [name, setName] = useState(localStorage.getItem('ah-user') || '');
  const [email] = useState(localStorage.getItem('ah-email') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('ah-avatar') || null);
  const [lang, setLangState] = useState(localStorage.getItem('ah-lang') || 'en');
  const [fontSize, setFontSizeState] = useState(localStorage.getItem('ah-fontsize') || 'medium');
  const [nameInput, setNameInput] = useState('');

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  function changeLang(l) {
    setLangState(l);
    localStorage.setItem('ah-lang', l);
    i18n.changeLanguage(l);
  }

  function changeFontSize(size) {
  const map = {
    small: "14px",
    medium: "16px",
    large: "20px",
  };

  setFontSizeState(size);
  localStorage.setItem("ah-fontsize", size);

  window.document.documentElement.style.fontSize = map[size];
}

  function saveName() {
    if (!nameInput.trim()) return;
    localStorage.setItem('ah-user', nameInput.trim());
    setName(nameInput.trim());
    setNameInput('');
  }

  function uploadAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      localStorage.setItem('ah-avatar', ev.target.result);
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function clearDeviceData() {
    if (!confirm('Reset all device data to default?')) return;
    ['lights', 'ac', 'curtain'].forEach(type => {
      fetch(`${API}/api/${type}`).then(r => r.json()).then(rooms => {
        rooms.forEach(room => {
          if (type === 'lights') fetch(`${API}/api/lights/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room: room.room, brightness: 50, on: false }) });
          if (type === 'ac') fetch(`${API}/api/ac/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room: room.room, temperature: 22, mode: 'Cool', fanSpeed: 1, on: false }) });
          if (type === 'curtain') fetch(`${API}/api/curtain/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room: room.room, openPercent: 0 }) });
        });
      }).catch(() => {});
    });
    alert('Device data cleared.');
  }

  function logout() {
    localStorage.removeItem('ah-user');
    localStorage.removeItem('ah-email');
    localStorage.removeItem('ah-avatar');
    navigate('/login');
  }

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>
      <Nav />
      <main className="page-wrap ac-page">
        <div className="gp-layout">
          <div className="gp-left">
            <div
              className="profile-avatar"
              style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {!avatar && initials}
            </div>
            <label className="avatar-upload-btn">
              {t('profile.changePhoto')}
              <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} />
            </label>
            <div className="gp-name">{name}</div>
            <div className="gp-email">{email}</div>
          </div>

          <div className="gp-right">
            {/* Personal Info */}
            <div className="gp-section">
              <div className="gp-section-title">{t('profile.personalInfo')}</div>
              <div className="gp-row">
                <div className="gp-row-left">
                  <div className="gp-row-label">{t('profile.name')}</div>
                  <div className="gp-row-desc">{t('profile.nameDesc')}</div>
                </div>
                <div className="gp-row-right">
                  <input type="text" className="gp-input" placeholder={t('profile.name')} value={nameInput} onChange={e => setNameInput(e.target.value)} />
                  <button className="gp-save-btn" onClick={saveName}>{t('profile.save')}</button>
                </div>
              </div>
            </div>

            {/* Font Size */}
            <div className="gp-section">
              <div className="gp-section-title">{t('profile.accessibility')}</div>
              <div className="gp-row">
                <div className="gp-row-left">
                  <div className="gp-row-label">{t('profile.fontSize')}</div>
                  <div className="gp-row-desc">{t('profile.fontSizeDesc')}</div>
                </div>
                <div className="gp-row-right">
                  <div className="font-size-btns">
                    {['small', 'medium', 'large'].map(size => (
                      <button key={size} className={`font-btn ${fontSize === size ? 'active' : ''}`} onClick={() => changeFontSize(size)}>A</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="gp-section">
              <div className="gp-section-title">{t('profile.language')}</div>
              <div className="gp-row">
                <div className="gp-row-left">
                  <div className="gp-row-label">{t('profile.displayLanguage')}</div>
                  <div className="gp-row-desc">{t('profile.displayLangDesc')}</div>
                </div>
                <div className="gp-row-right">
                  <div className="lang-btns">
                    {[['en', 'English'], ['zh', 'Chinese'], ['pl', 'Polish'], ['fr', 'French']].map(([code, label]) => (
                      <button key={code} className={`lang-btn ${lang === code ? 'active' : ''}`} onClick={() => changeLang(code)}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="gp-section">
              <div className="gp-section-title">{t('profile.privacy')}</div>
              <div className="gp-row">
                <div className="gp-row-left">
                  <div className="gp-row-label">{t('profile.deviceData')}</div>
                  <div className="gp-row-desc">{t('profile.deviceDataDesc')}</div>
                </div>
                <div className="gp-row-right">
                  <button className="profile-danger-btn" onClick={clearDeviceData}>{t('profile.clearData')}</button>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="gp-section">
              <div className="gp-section-title">{t('profile.account')}</div>
              <div className="gp-row">
                <div className="gp-row-left">
                  <div className="gp-row-label">{t('profile.signOut')}</div>
                  <div className="gp-row-desc">{t('profile.signOutDesc')}</div>
                </div>
                <div className="gp-row-right">
                  <button className="profile-danger-btn" onClick={logout}>{t('profile.logout')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
