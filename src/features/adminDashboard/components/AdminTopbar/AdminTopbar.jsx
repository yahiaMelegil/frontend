import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '../../data/adminDashboardData';
import { useAdminI18n } from '../../i18n/AdminI18nContext';
import AdminIcon from '../AdminIcon/AdminIcon';
import { PATHS } from '../../../../routes/paths';

export default function AdminTopbar({
  searchValue,
  onSearchChange,
  onMenuToggle,
  menuOpen,
  onAction,
  theme,
  onThemeToggle,
  language,
  onLanguageChange,
}) {
  const { t } = useAdminI18n();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__start">
        <button
          className="admin-mobile-menu"
          type="button"
          aria-label={t('topbar.openMenu')}
          aria-controls="admin-sidebar"
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
        >
          <AdminIcon name="menu" size={22} />
        </button>
        <label className="admin-global-search">
          <AdminIcon name="search" size={20} />
          <span className="sr-only">{t('topbar.searchLabel')}</span>
          <input
            ref={searchRef}
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('topbar.searchPlaceholder')}
          />
          <kbd>⌘ K</kbd>
        </label>
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

        <div className="admin-topbar__menu-wrap">
          <button
            className="admin-icon-button admin-notification-button"
            type="button"
            aria-label={t('topbar.notificationsAria', { count: notifications.length })}
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((value) => !value);
              setProfileOpen(false);
            }}
          >
            <AdminIcon name="bell" size={21} />
            <span>3</span>
          </button>
          {notificationsOpen && (
            <div className="admin-popover admin-notifications" role="dialog" aria-label={t('topbar.notifications')}>
              <div className="admin-popover__header"><div><b>{t('topbar.notifications')}</b><small>{t('topbar.newAlerts', { count: notifications.length })}</small></div><button type="button" onClick={() => setNotificationsOpen(false)} aria-label={t('topbar.close')}><AdminIcon name="close" size={18}/></button></div>
              <div className="admin-notifications__list">
                {notifications.map((item) => (
                  <button type="button" key={item.id} onClick={() => onAction(t(item.titleKey))}>
                    <i className={`is-${item.tone}`} />
                    <span><b>{t(item.titleKey)}</b><small>{t(item.timeKey)}</small></span>
                  </button>
                ))}
              </div>
              <button className="admin-popover__footer" type="button" onClick={() => onAction(t('topbar.viewAllNotifications'))}>{t('topbar.viewAllNotifications')} <AdminIcon name="arrow" size={16}/></button>
            </div>
          )}
        </div>

        <span className="admin-topbar__divider" />

        <div className="admin-topbar__menu-wrap">
          <button
            className="admin-profile-button"
            type="button"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((value) => !value);
              setNotificationsOpen(false);
            }}
          >
            <span className="admin-profile-button__avatar"><AdminIcon name="person" size={19} /></span>
            <span className="admin-profile-button__copy"><b>{t('topbar.platformAdmin')}</b><small>{t('topbar.platformOwner')}</small></span>
            <AdminIcon name="chevron" size={16} />
          </button>
          {profileOpen && (
            <div className="admin-popover admin-profile-menu" role="menu">
              <div className="admin-profile-menu__identity"><span><AdminIcon name="person" size={19} /></span><div><b>{t('topbar.platformAdmin')}</b><small>admin@example.com</small></div></div>
              <button type="button" role="menuitem" onClick={() => onAction(t('topbar.accountSettings'))}><AdminIcon name="settings" size={18}/> {t('topbar.accountSettings')}</button>
              <button type="button" role="menuitem" onClick={() => onAction(t('topbar.helpCenter'))}><AdminIcon name="help" size={18}/> {t('topbar.helpCenter')}</button>
              <Link to={PATHS.ADMIN_LOGIN} role="menuitem"><AdminIcon name="logout" size={18}/> {t('topbar.logout')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
