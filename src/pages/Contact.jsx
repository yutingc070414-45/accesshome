import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Nav from '../components/Nav';

export default function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <>
      <div className="bg-ambient"></div>
      <div className="bg-noise"></div>
      <Nav />

      <main className="page-wrap">
        <div className="contact-wrap">

          <div className="contact-intro fade-up">
            <h2>{t('contact.title')}</h2>
            <p>{t('contact.description')}</p>
          </div>

          <div className="contact-cards fade-up fade-up-d1">
            <div className="contact-info-card">
              <div className="ci-icon">📞</div>
              <div className="ci-label">{t('contact.phone')}</div>
              <div className="ci-value">+00 123 456 789</div>
            </div>

            <div className="contact-info-card">
              <div className="ci-icon">✉️</div>
              <div className="ci-label">{t('contact.email')}</div>
              <div className="ci-value">support@accesshome.io</div>
            </div>

            <div className="contact-info-card">
              <div className="ci-icon">🕐</div>
              <div className="ci-label">{t('contact.hours')}</div>
              <div className="ci-value">{t('contact.hoursValue')}</div>
            </div>
          </div>

          <form className="fade-up fade-up-d2" onSubmit={handleSubmit}>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {t('contact.firstName')}
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder={t('contact.firstNamePlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t('contact.lastName')}
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder={t('contact.lastNamePlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('contact.emailAddress')}
              </label>
              <input
                className="form-input"
                type="email"
                placeholder="sarah@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('contact.subject')}
              </label>

              <select className="form-select form-input">
                <option>{t('contact.subjectOptions.general')}</option>
                <option>{t('contact.subjectOptions.support')}</option>
                <option>{t('contact.subjectOptions.setup')}</option>
                <option>{t('contact.subjectOptions.billing')}</option>
                <option>{t('contact.subjectOptions.feature')}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('contact.message')}
              </label>

              <textarea
                className="form-textarea"
                placeholder={t('contact.messagePlaceholder')}
                required
              ></textarea>
            </div>

            <button className="btn-submit" type="submit">
              {t('contact.send')}
            </button>

            {sent && (
              <div className="success-msg show">
                {t('contact.success')}
              </div>
            )}

          </form>
        </div>
      </main>
    </>
  );
}