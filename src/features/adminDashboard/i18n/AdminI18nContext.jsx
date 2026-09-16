import React, { createContext, useContext, useMemo } from 'react';
import { ADMIN_DEFAULT_LANGUAGE, getAdminDirection, translateAdmin } from './adminTranslations';

const AdminI18nContext = createContext({
  language: ADMIN_DEFAULT_LANGUAGE,
  direction: 'rtl',
  t: (key, replacements) => translateAdmin(ADMIN_DEFAULT_LANGUAGE, key, replacements),
});

export function AdminI18nProvider({ language, children }) {
  const value = useMemo(() => ({
    language,
    direction: getAdminDirection(language),
    t: (key, replacements) => translateAdmin(language, key, replacements),
  }), [language]);

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n() {
  return useContext(AdminI18nContext);
}
