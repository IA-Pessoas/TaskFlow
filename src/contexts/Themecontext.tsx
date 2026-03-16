import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
type Theme = 'light' | 'dark';

interface ThemeontextType{
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeontextType | null>(null);

export function ThemeProvider({ children } : { children: React.ReactNode }){
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

    const toggleTheme = () => 
        setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
        </ThemeContext.Provider>
    );
}

// Hook helper — centraliza o erro e evita checar null em todo lugar
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return ctx;
}