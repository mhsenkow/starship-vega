import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, fluentTheme, neonTheme, material3Theme, neumorphismTheme, brutalistTheme, retroTheme, themes, ThemeMode, Theme } from './theme';
import { GlobalStyles } from './GlobalStyles';
import { type SemanticColorSets } from '../utils/vegaThemes';

// Define context type
interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  theme: any; // Use any to avoid type conflicts between different theme implementations
  selectedColorSet: keyof SemanticColorSets | null;
  setSelectedColorSet: (colorSet: keyof SemanticColorSets | null) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  theme: lightTheme,
  selectedColorSet: null,
  setSelectedColorSet: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get initial theme from system preference or localStorage
  const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    
    if (savedTheme && ['light', 'dark', 'fluent', 'neon', 'material3', 'neumorphism', 'brutalist', 'retro'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const [selectedColorSet, setSelectedColorSet] = useState<keyof SemanticColorSets | null>(null);
  const theme = themes[mode];

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', mode);
    
    // Update data-theme attribute on the document for CSS variables
    document.documentElement.setAttribute('data-theme', mode);
    
    // Update selected color set attribute for Vega themes
    if (selectedColorSet) {
      document.documentElement.setAttribute('data-color-set', selectedColorSet);
    } else {
      document.documentElement.removeAttribute('data-color-set');
    }
    
    // Clean up previous theme classes
    const body = document.body;
    body.classList.remove(
      'fluent-theme', 
      'neon-theme', 
      'material3-theme', 
      'neumorphism-theme', 
      'brutalist-theme', 
      'retro-theme'
    );
    
    // Add specific theme class for special effects
    if (mode !== 'light' && mode !== 'dark') {
      body.classList.add(`${mode}-theme`);
    }
  }, [mode, selectedColorSet]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Add listener with fallback for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - For older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Toggle between themes (cycles through all themes)
  const toggleTheme = () => {
    const themeOrder: ThemeMode[] = ['light', 'dark', 'fluent', 'neon', 'material3', 'neumorphism', 'brutalist', 'retro'];
    const currentIndex = themeOrder.indexOf(mode);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setMode(themeOrder[nextIndex]);
  };

  // Set specific theme
  const setTheme = (mode: ThemeMode) => {
    setMode(mode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme, theme, selectedColorSet, setSelectedColorSet }}>
      <StyledThemeProvider theme={theme as any}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}; 