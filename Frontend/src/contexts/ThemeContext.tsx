import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'premium' | 'proximite';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'proximite',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const themeLabels: Record<ThemeName, string> = {
  premium: 'Premium',
  proximite: 'Proximité',
};

const STORAGE_KEY = 'cosmos-theme';
const VALID_THEMES: ThemeName[] = ['premium', 'proximite'];

const loadInitialTheme = (): ThemeName => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored as ThemeName)) {
      return stored as ThemeName;
    }
  } catch {
    // localStorage indispo (Safari private)
  }
  // Marque officielle : palette Forêt + Or (le bleu nuit est exclu, cf. cahier des charges)
  return 'proximite';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>(loadInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
