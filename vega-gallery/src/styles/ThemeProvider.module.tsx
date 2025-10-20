import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode } from './theme';
import { type SemanticColorSets } from '../utils/vegaThemes';

// Define context type
interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  theme: ThemeMode; // Simplified to just use the mode
  selectedColorSet: keyof SemanticColorSets | null;
  setSelectedColorSet: (colorSet: keyof SemanticColorSets | null) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  theme: 'light',
  selectedColorSet: null,
  setSelectedColorSet: () => {},
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'light';
  });
  
  const [selectedColorSet, setSelectedColorSet] = useState<keyof SemanticColorSets | null>(() => {
    const savedColorSet = localStorage.getItem('selectedColorSet');
    return savedColorSet as keyof SemanticColorSets || null;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all existing theme classes
    root.classList.remove(
      'light-theme', 'dark-theme', 'fluent-theme', 'neon-theme', 
      'material3-theme', 'neumorphism-theme', 'brutalist-theme', 'retro-theme'
    );
    
    // Add new theme class
    root.classList.add(`${mode}-theme`);
    
    // Set data attribute for Vega theme system
    root.setAttribute('data-theme', mode);
    
    // Save to localStorage
    localStorage.setItem('theme', mode);
    
    // Set CSS custom property for theme mode
    root.style.setProperty('--theme-mode', mode);
    
    // Dispatch custom event for theme change
    const themeChangeEvent = new CustomEvent('theme-changed', {
      detail: {
        theme: mode,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(themeChangeEvent);
  }, [mode]);

  // Apply color set to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (selectedColorSet) {
      root.style.setProperty('--selected-color-set', selectedColorSet);
      root.setAttribute('data-color-set', selectedColorSet);
      localStorage.setItem('selectedColorSet', selectedColorSet);
    } else {
      root.style.removeProperty('--selected-color-set');
      root.removeAttribute('data-color-set');
      localStorage.removeItem('selectedColorSet');
    }
    
    // Dispatch custom event for color set change
    const colorSetChangeEvent = new CustomEvent('color-set-changed', {
      detail: {
        colorSet: selectedColorSet,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(colorSetChangeEvent);
  }, [selectedColorSet]);

  const toggleTheme = useCallback(() => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  const handleSetSelectedColorSet = useCallback((colorSet: keyof SemanticColorSets | null) => {
    setSelectedColorSet(colorSet);
  }, []);

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme,
    theme: mode,
    selectedColorSet,
    setSelectedColorSet: handleSetSelectedColorSet,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
