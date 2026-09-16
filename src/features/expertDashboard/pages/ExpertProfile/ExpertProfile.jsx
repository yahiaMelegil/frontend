import React, { useMemo, useState } from 'react';
import AdminIcon from '../../../adminDashboard/components/AdminIcon/AdminIcon';
import ExpertShell from '../../components/ExpertShell/ExpertShell';
import { emptyExpertProfile, EXPERT_VERIFICATION_STATUS } from '../../data/expertDashboardData';
import useAuth from '../../../../hooks/useAuth';
import { getExpertKycRequest } from '../../../kyc/data/kycStore';
import { useExpertI18n } from '../../i18n/ExpertI18nContext';

const countryOptions = {
  ar: [['', 'اختر البلد'], ['jo', 'الأردن'], ['ps', 'فلسطين'], ['us', 'الولايات المتحدة'], ['other', 'بلد آخر']],
  en: [['', 'Choose country'], ['jo', 'Jordan'], ['ps', 'Palestine'], ['us', 'United States'], ['other', 'Other country']],
};

const languageOptions = [['', '—'], ['ar', 'العربية'], ['en', 'English'], ['ar-en', 'العربية وEnglish']];

const domainOptions = {
  ar: [['', 'اختر المجال'], ['legal', 'قانون واستشارات قانونية'], ['technology', 'تقنية وبرمجيات'], ['finance', 'مالية ومحاسبة'], ['business', 'أعمال وتشغيل'], ['engineering', 'هندسة وعقار'], ['career', 'مسار مهني وموارد بشرية'], ['other', 'مجال آخر']],
  en: [['', 'Choose domain'], ['legal', 'Legal'], ['technology', 'Technology & software'], ['finance', 'Finance & accounting'], ['business', 'Business & operations'], ['engineering', 'Engineering & real estate'], ['career', 'Career & HR'], ['other', 'Other']],
};

function ProfileField({ label, id, error, hint, children }) {
  return (
    <label className={`expert-field${error ? ' is-error' : ''}`} htmlFor={id}>
      <span>{label}</span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && <small className="expert-field-error" id={`${id}-error`}>{error}</small>}
    </label>
  );
}

function ExpertProfileContent() {
  const { language, t } = useExpertI18n();
  const [profile, setProfile] = useState(() => ({ ...emptyExpertProfile }));
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const errors = useMemo(() => {
    const next = {};
    ['fullName', 'email', 'country', 'language', 'professionalTitle', 'domain'].forEach((field) => {
      if (!String(profile[field] || '').trim()) next[field] = t('profile.required');
    });
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) next.email = t('profile.emailInvalid');
    if (profile.bio.length > 600) next.bio = t('profile.bioTooLong');
    return next;
  }, [profile, t]);

  const update = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const onPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
    update('photo', file);
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview('');
    update('photo', null);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    setSaved(true);
  };

  return (
    <>
      <header className="admin-page-heading expert-page-heading">
        <div>
          <nav aria-label={t('profile.breadcrumb')}><span>{t('dashboard.workspace')}</span><AdminIcon name="chevron" size={14} /><strong>{t('profile.breadcrumb')}</strong></nav>
          <h1>{t('profile.title')}</h1>
          <p>{t('profile.subtitle')}</p>
        </div>
      </header>

      <div className="expert-inline-note is-info"><AdminIcon name="info" size={18} /><span>{t('profile.registrationNote')}</span></div>

      <form className="expert-profile-form" onSubmit={onSubmit} noValidate>
        <section className="expert-form-section" aria-labelledby="expert-profile-basic-title">
          <header className="expert-form-section__header"><div><span className="expert-section-kicker"><AdminIcon name="person" size={16} />01</span><h2 id="expert-profile-basic-title">{t('profile.basicTitle')}</h2><p>{t('profile.basicBody')}</p></div></header>
          <div className="expert-photo-row">
            <div className="expert-photo-preview">{photoPreview ? <img src={photoPreview} alt="" /> : <AdminIcon name="person" size={28} />}</div>
            <div><b>{t('profile.photo')}</b><p>{t('profile.photoHint')}</p><div className="expert-photo-actions"><label className="expert-secondary-button is-compact"><input type="file" accept="image/*" onChange={onPhotoChange} />{t('profile.changePhoto')}</label>{profile.photo && <button className="expert-text-button" type="button" onClick={removePhoto}>{t('profile.removePhoto')}</button>}</div></div>
          </div>
          <div className="expert-form-grid">
            <ProfileField label={t('profile.fullName')} id="expert-profile-name" error={submitted ? errors.fullName : ''}><input id="expert-profile-name" value={profile.fullName} onChange={(event) => update('fullName', event.target.value)} aria-invalid={Boolean(submitted && errors.fullName)} aria-describedby={submitted && errors.fullName ? 'expert-profile-name-error' : undefined} autoComplete="name" /></ProfileField>
            <ProfileField label={t('profile.email')} id="expert-profile-email" error={submitted ? errors.email : ''}><input id="expert-profile-email" type="email" value={profile.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(submitted && errors.email)} aria-describedby={submitted && errors.email ? 'expert-profile-email-error' : undefined} autoComplete="email" /></ProfileField>
          </div>
        </section>

        <section className="expert-form-section" aria-labelledby="expert-profile-professional-title">
          <header className="expert-form-section__header"><div><span className="expert-section-kicker"><AdminIcon name="briefcase" size={16} />02</span><h2 id="expert-profile-professional-title">{t('profile.professionalTitle')}</h2><p>{t('profile.professionalBody')}</p></div></header>
          <div className="expert-form-grid">
            <ProfileField label={t('profile.jobTitle')} id="expert-profile-job" error={submitted ? errors.professionalTitle : ''}><input id="expert-profile-job" value={profile.professionalTitle} onChange={(event) => update('professionalTitle', event.target.value)} /></ProfileField>
            <ProfileField label={t('profile.domain')} id="expert-profile-domain" error={submitted ? errors.domain : ''}><select id="expert-profile-domain" value={profile.domain} onChange={(event) => update('domain', event.target.value)}>{domainOptions[language].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></ProfileField>
            <ProfileField label={t('profile.specialties')} id="expert-profile-specialties" hint={t('profile.specialtiesHint')}><input id="expert-profile-specialties" value={profile.specialties} onChange={(event) => update('specialties', event.target.value)} /></ProfileField>
            <ProfileField label={t('profile.bio')} id="expert-profile-bio" error={submitted ? errors.bio : ''} hint={`${t('profile.bioHint')} ${profile.bio.length}/600`}><textarea id="expert-profile-bio" rows="5" maxLength="650" value={profile.bio} onChange={(event) => update('bio', event.target.value)} /></ProfileField>
          </div>
        </section>

        <section className="expert-form-section" aria-labelledby="expert-profile-contact-title">
          <header className="expert-form-section__header"><div><span className="expert-section-kicker"><AdminIcon name="globe" size={16} />03</span><h2 id="expert-profile-contact-title">{t('profile.contactTitle')}</h2><p>{t('profile.contactBody')}</p></div></header>
          <div className="expert-form-grid">
            <ProfileField label={t('profile.country')} id="expert-profile-country" error={submitted ? errors.country : ''}><select id="expert-profile-country" value={profile.country} onChange={(event) => update('country', event.target.value)}>{countryOptions[language].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></ProfileField>
            <ProfileField label={t('profile.language')} id="expert-profile-language" error={submitted ? errors.language : ''}><select id="expert-profile-language" value={profile.language} onChange={(event) => update('language', event.target.value)}>{languageOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></ProfileField>
            <ProfileField label={t('profile.timezone')} id="expert-profile-timezone"><input id="expert-profile-timezone" value={profile.timezone} onChange={(event) => update('timezone', event.target.value)} placeholder="UTC+03:00" /></ProfileField>
          </div>
        </section>

        <div className="expert-form-footer">
          <div className="expert-form-footer__message" role="status">{saved && <><AdminIcon name="check" size={17} /><span>{t('profile.saved')}</span></>}</div>
          <button className="expert-primary-button" type="submit"><AdminIcon name="save" size={17} />{t('profile.save')}</button>
        </div>
      </form>
    </>
  );
}

export default function ExpertProfile() {
  const { sessions } = useAuth();
  const expertEmail = sessions.expert?.account?.email || 'expert@solveit.local';
  const request = getExpertKycRequest(expertEmail);
  const verificationStatus = request?.status || sessions.expert?.kycStatus || EXPERT_VERIFICATION_STATUS;

  return (
    <ExpertShell activePage="profile" verificationStatus={verificationStatus}>
      <ExpertProfileContent />
    </ExpertShell>
  );
}
