import React, { useEffect, useState } from 'react';
import { AdminI18nProvider } from '../../i18n/AdminI18nContext';
import { getAdminDirection } from '../../i18n/adminTranslations';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminTopbar from '../AdminTopbar/AdminTopbar';

const readPreference = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) || fallback;
};

export default function AdminShell({ activePage = 'overview', children, searchValue, onSearchChange, onAction }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => readPreference('ecp-admin-theme', 'light'));
  const [language, setLanguage] = useState(() => readPreference('ecp-admin-language', 'ar'));

  const direction = getAdminDirection(language);

  useEffect(() => {
    window.localStorage.setItem('ecp-admin-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('ecp-admin-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [direction, language]);

  useEffect(() => {
    const closeDrawerAfterResize = () => {
      if (window.innerWidth > 1040) setMobileOpen(false);
    };
    window.addEventListener('resize', closeDrawerAfterResize);
    return () => window.removeEventListener('resize', closeDrawerAfterResize);
  }, []);

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1040px)').matches) {
      setMobileOpen((value) => !value);
      return;
    }
    setCollapsed((value) => !value);
  };

  const expandSidebar = () => setCollapsed(false);

  return (
    <AdminI18nProvider language={language}>
      <div
        className={`admin-app-shell${collapsed ? ' is-sidebar-collapsed' : ''}`}
        data-theme={theme}
        dir={direction}
      >
        <AdminSidebar
          activePage={activePage}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggleSidebar={toggleSidebar}
          onExpandSidebar={expandSidebar}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="admin-main-column">
          <AdminTopbar
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onMenuToggle={toggleSidebar}
            menuOpen={mobileOpen}
            onAction={onAction}
            theme={theme}
            onThemeToggle={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            language={language}
            onLanguageChange={setLanguage}
          />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </AdminI18nProvider>
  );
}
