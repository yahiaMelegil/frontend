import React, { useEffect, useState } from 'react';
import '../../../adminDashboard/AdminDashboard.css';
import '../../ExpertDashboard.css';
import { ExpertI18nProvider } from '../../i18n/ExpertI18nContext';
import { getExpertDirection } from '../../i18n/expertTranslations';
import ExpertSidebar from '../ExpertSidebar/ExpertSidebar';
import ExpertTopbar from '../ExpertTopbar/ExpertTopbar';

const readPreference = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) || fallback;
};

export default function ExpertShell({ activePage = 'overview', children, verificationStatus = 'draft' }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => readPreference('ecp-expert-theme', 'light'));
  const [language, setLanguage] = useState(() => readPreference('ecp-expert-language', 'ar'));
  const direction = getExpertDirection(language);

  useEffect(() => {
    window.localStorage.setItem('ecp-expert-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('ecp-expert-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [direction, language]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1040) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1040px)').matches) {
      setMobileOpen((value) => !value);
      return;
    }
    setCollapsed((value) => !value);
  };

  return (
    <ExpertI18nProvider language={language}>
      <div className="admin-dashboard-page expert-dashboard-page">
        <div
          className={`admin-app-shell expert-app-shell${collapsed ? ' is-sidebar-collapsed' : ''}`}
          data-theme={theme}
          dir={direction}
        >
          <ExpertSidebar
            activePage={activePage}
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            verificationStatus={verificationStatus}
            onToggleSidebar={toggleSidebar}
            onExpandSidebar={() => setCollapsed(false)}
            onCloseMobile={() => setMobileOpen(false)}
          />
          <div className="admin-main-column">
            <ExpertTopbar
              onMenuToggle={toggleSidebar}
              menuOpen={mobileOpen}
              theme={theme}
              onThemeToggle={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
              language={language}
              onLanguageChange={setLanguage}
              verificationStatus={verificationStatus}
            />
            <main className="admin-content expert-content">{children}</main>
          </div>
        </div>
      </div>
    </ExpertI18nProvider>
  );
}
