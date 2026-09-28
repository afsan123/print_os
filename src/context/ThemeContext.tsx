'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (t === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('print_os_theme') as Theme | null;
    const initial =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('print_os_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};
