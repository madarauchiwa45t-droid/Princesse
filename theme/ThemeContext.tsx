import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@megan_theme_v2';

export interface Theme {
  name: string;
  background: string;
  customImage: string | null;
  opacity: number;
  particles: boolean;
}

const DEFAULT_THEME: Theme = {
  name: 'Neon Blue',
  background: 'neon-blue',
  customImage: null,
  opacity: 0.6,
  particles: true,
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  loaded: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  loaded: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [loaded, setLoaded] = useState(false);

  // Charger le thème sauvegardé
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setThemeState({ ...DEFAULT_THEME, ...parsed });
        }
      } catch (e) {
        console.warn('Échec chargement thème', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(t));
    } catch (e) {
      console.warn('Échec sauvegarde thème', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loaded }}>
      {children}
    </ThemeContext.Provider>
  );
}
