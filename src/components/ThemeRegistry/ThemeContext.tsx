'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ThemeName = 'dorado' | 'verde' | 'cian' | 'gris';

const STORAGE_KEY = 'theme';
const VALID_THEMES: ThemeName[] = ['dorado', 'verde', 'cian', 'gris'];

function getInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return 'cian';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && VALID_THEMES.includes(stored as ThemeName)) {
    return stored as ThemeName;
  }
  return 'cian';
}

interface ThemeContextValue {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'cian',
  setThemeName: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(STORAGE_KEY, themeName);
  }, [themeName]);

  const setThemeName = useCallback((name: ThemeName) => {
    setThemeNameState(name);
  }, []);

  return <ThemeContext.Provider value={{ themeName, setThemeName }}>{children}</ThemeContext.Provider>;
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
