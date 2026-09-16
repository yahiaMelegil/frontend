import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminIcon from '../../../adminDashboard/components/AdminIcon/AdminIcon';
import { useExpertI18n } from '../../i18n/ExpertI18nContext';
import { PATHS } from '../../../../routes/paths';

export default function ExpertTopbar({
  onMenuToggle,
  menuOpen,
  theme,
  onThemeToggle,
  language,
  onLanguageChange,
  verificationStatus,
}) {
  const { t } = useExpertI18n();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onKeyboard = (event) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };
    window.addEventListener('keydown', onKeyboard);
    return () => window.removeEventListener('keydown', onKeyboard);
  }, []);

  return (
    <header className="admin-topbar expert-topbar">
      <div className="admin-topbar__start expert-topbar__start">
        <button
          className="admin-mobile-menu"
          type="button"
          aria-label={t('topbar.openMenu')}
          aria-controls="expert-sidebar"
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
        >
          <AdminIcon name="menu" size={22} />
        </button>
        <div className="expert-topbar-context" aria-label={`${t('topbar.expertStatus')}: ${t(`status.${verificationStatus}`)}`}>
          <span><AdminIcon name="shield" size={17} /></span>
          <div><b>{t('topbar.expertStatus')}</b><small>{t(`status.${verificationStatus}`)}</small></div>
        </div>
      </div>

      <div className="admin-topbar__actions">
        <button
          className="admin-icon-button admin-theme-toggle"
          type="button"
          aria-label={theme === 'dark' ? t('topbar.enableLight') : t('topbar.enableDark')}
          title={theme === 'dark' ? t('topbar.lightMode') : t('topbar.darkMode')}
          onClick={onThemeToggle}
        >
          <AdminIcon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
        </button>

        <label className="admin-language-select" title={t('topbar.interfaceLanguage')}>
          <AdminIcon name="globe" size={19} />
          <span className="sr-only">{t('topbar.interfaceLanguage')}</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value)} aria-label={t('topbar.interfaceLanguage')}>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </label>

        <span className="admin-topbar__divider" />

        <div className="admin-topbar__menu-wrap">
          <button
            className="admin-profile-button"
            type="button"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((value) => !value)}
          >
            <span className="admin-profile-button__avatar"><AdminIcon name="person" size={19} /></span>
            <span className="admin-profile-button__copy"><b>{t('topbar.expertName')}</b><small>{t('topbar.expertStatus')}</small></span>
            <AdminIcon name="chevron" size={16} />
          </button>
          {profileOpen && (
            <div className="admin-popover admin-profile-menu" role="menu">
              <div className="admin-profile-menu__identity"><span><AdminIcon name="person" size={19} /></span><div><b>{t('topbar.expertName')}</b><small>{t(`status.${verificationStatus}`)}</small></div></div>
              <Link to={PATHS.EXPERT_PROFILE} role="menuitem" onClick={() => setProfileOpen(false)}><AdminIcon name="person" size={18} /> {t('topbar.profile')}</Link>
              <Link to={PATHS.EXPERT_KYC} role="menuitem" onClick={() => setProfileOpen(false)}><AdminIcon name="verified" size={18} /> {t('topbar.verification')}</Link>
              <Link to={PATHS.EXPERT_LOGIN} role="menuitem"><AdminIcon name="logout" size={18} /> {t('topbar.logout')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
