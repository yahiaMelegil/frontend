import React, { createContext, useContext, useMemo } from 'react';
import { EXPERT_DEFAULT_LANGUAGE, getExpertDirection, translateExpert } from './expertTranslations';

const ExpertI18nContext = createContext({
  language: EXPERT_DEFAULT_LANGUAGE,
  direction: 'rtl',
  t: (key, replacements) => translateExpert(EXPERT_DEFAULT_LANGUAGE, key, replacements),
});

export function ExpertI18nProvider({ language, children }) {
  const value = useMemo(() => ({
    language,
    direction: getExpertDirection(language),
    t: (key, replacements) => translateExpert(language, key, replacements),
  }), [language]);

  return <ExpertI18nContext.Provider value={value}>{children}</ExpertI18nContext.Provider>;
}

export function useExpertI18n() {
  return useContext(ExpertI18nContext);
}
