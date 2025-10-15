import { 
  palette, 
  spacing, 
  typography, 
  elevation, 
  borderRadius, 
  breakpoints, 
  zIndex, 
  transitions 
} from './tokens';

// Type definitions for our theme - now supporting 8 theme variants
export type ThemeMode = 'light' | 'dark' | 'fluent' | 'neon' | 'material3' | 'neumorphism' | 'brutalist' | 'retro';

// Shared theme structure that's independent of theme mode
const baseTheme = {
  spacing,
  elevation,
  zIndex,
  transitions,
  breakpoints,
  // Media query helpers
  media: {
    xs: `@media (min-width: ${breakpoints.xs})`,
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    xxl: `@media (min-width: ${breakpoints.xxl})`,
  }
};

// ENHANCED Light theme - Modern, clean, and highly readable
export const lightTheme = {
  ...baseTheme,
  mode: 'light' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "JetBrains Mono", "Fira Code", "Monaco", monospace',
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  colors: {
    // Premium light mode palette with better contrast
    primary: '#2563eb',     // More vibrant blue
    secondary: '#64748b',   // Sophisticated slate
    success: '#059669',     // Rich emerald
    warning: '#d97706',     // Warm amber
    error: '#dc2626',       // Clear red
    info: '#0891b2',        // Cyan blue
    
    // Refined light backgrounds with subtle warmth
    background: '#fafafa',  // Slightly warmer white
    surface: '#ffffff',     // Pure white surfaces
    surfaceHover: '#f8fafc', // Subtle hover
    surfaceActive: '#f1f5f9', // Clear active state
    
    // Crisp borders
    border: '#e2e8f0',      // Soft but visible
    
    // Enhanced text hierarchy with perfect contrast
    text: {
      primary: '#0f172a',   // Deep slate for maximum readability
      secondary: '#475569', // Medium slate
      tertiary: '#64748b',  // Light slate
      disabled: '#cbd5e1',  // Subtle disabled
      inverse: '#ffffff',   // Clean white
    },
    
    // Component-specific enhancements
    appBar: '#ffffff',
    appBarText: '#0f172a',
    sideNav: '#ffffff',
    tooltip: '#1e293b',
    
    // Enhanced focus ring with accessibility
    focusRing: 'rgba(37, 99, 235, 0.5)',
    
    // Clean chart styling
    chartBackground: '#ffffff',
    chartBorder: '#e2e8f0',
    
    // Professional sampling indicator
    samplingIndicator: {
      background: '#fef3c7',
      border: '#f59e0b',
      text: '#92400e',
      icon: '#d97706',
    },
  },
};

// ENHANCED Dark theme - Sophisticated and easy on the eyes
export const darkTheme = {
  ...baseTheme,
  mode: 'dark' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "JetBrains Mono", "Fira Code", "Monaco", monospace',
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  colors: {
    // Professional dark mode with rich colors
    primary: '#60a5fa',     // Bright blue for dark mode
    secondary: '#94a3b8',   // Lighter slate for contrast
    success: '#34d399',     // Vibrant emerald
    warning: '#fbbf24',     // Bright amber
    error: '#f87171',       // Softer red for dark mode
    info: '#38bdf8',        // Sky blue
    
    // Rich dark backgrounds with depth
    background: '#020617',  // Deep navy black
    surface: '#0f172a',     // Slate black surfaces
    surfaceHover: '#1e293b', // Subtle hover
    surfaceActive: '#334155', // Clear active state
    
    // Visible dark borders
    border: '#334155',      // Balanced contrast
    
    // Optimized text for dark mode
    text: {
      primary: '#f8fafc',   // Soft white for comfort
      secondary: '#cbd5e1', // Light slate
      tertiary: '#94a3b8',  // Medium slate
      disabled: '#475569',  // Subtle disabled
      inverse: '#0f172a',   // Dark inverse
    },
    
    // Dark mode components
    appBar: '#0f172a',
    appBarText: '#f8fafc',
    sideNav: '#0f172a',
    tooltip: '#f8fafc',
    
    // Clear focus for dark mode
    focusRing: 'rgba(96, 165, 250, 0.6)',
    
    // Dark chart styling
    chartBackground: '#0f172a',
    chartBorder: '#334155',
    
    // Dark sampling indicator
    samplingIndicator: {
      background: 'rgba(251, 191, 36, 0.1)',
      border: 'rgba(251, 191, 36, 0.5)',
      text: '#fbbf24',
      icon: '#fbbf24',
    },
  },
};

// ENHANCED Fluent Design theme - Microsoft's beautiful glassmorphism
export const fluentTheme = {
  ...baseTheme,
  mode: 'fluent' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Segoe UI Variable", "Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono: '"Cascadia Code", "Consolas", "SF Mono", "Monaco", monospace',
      heading: '"Segoe UI Variable", "Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '8px',
    md: '12px',
    lg: '20px',  // More rounded for fluent design
  },
  colors: {
    // Microsoft Fluent Design System colors
    primary: '#0078d4',     // Microsoft blue
    secondary: '#605e5c',   // Neutral gray
    success: '#107c10',     // Microsoft green
    warning: '#ff8c00',     // Microsoft orange
    error: '#d13438',       // Microsoft red
    info: '#0078d4',        // Information blue
    
    // Ultra-transparent glassmorphism backgrounds
    background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.1) 0%, rgba(230, 245, 255, 0.15) 100%)',
    surface: 'rgba(255, 255, 255, 0.12)',
    surfaceHover: 'rgba(255, 255, 255, 0.20)',
    surfaceActive: 'rgba(255, 255, 255, 0.28)',
    
    // Delicate glass borders
    border: 'rgba(255, 255, 255, 0.18)',
    
    // High-contrast text on glass
    text: {
      primary: 'rgba(32, 31, 30, 0.95)',
      secondary: 'rgba(50, 49, 48, 0.85)',
      tertiary: 'rgba(96, 94, 92, 0.75)',
      disabled: 'rgba(161, 159, 157, 0.6)',
      inverse: 'rgba(255, 255, 255, 0.95)',
    },
    
    // Glass-like components
    appBar: 'rgba(248, 249, 250, 0.08)',
    appBarText: 'rgba(32, 31, 30, 0.9)',
    sideNav: 'rgba(255, 255, 255, 0.06)',
    tooltip: 'rgba(32, 31, 30, 0.9)',
    
    // Fluent focus ring
    focusRing: 'rgba(0, 120, 212, 0.4)',
    
    // Transparent chart containers
    chartBackground: 'rgba(255, 255, 255, 0.08)',
    chartBorder: 'rgba(255, 255, 255, 0.15)',
    
    // Glass sampling indicator
    samplingIndicator: {
      background: 'rgba(255, 185, 0, 0.06)',
      border: 'rgba(255, 185, 0, 0.25)',
      text: 'rgba(194, 124, 23, 0.95)',
      icon: 'rgba(255, 140, 0, 0.85)',
    },
  },
};

// ENHANCED Neon Cyberpunk theme - Full cyberpunk aesthetic
export const neonTheme = {
  ...baseTheme,
  mode: 'neon' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Orbitron", "JetBrains Mono", -apple-system, BlinkMacSystemFont, system-ui, monospace',
      mono: '"JetBrains Mono", "SF Mono", "Monaco", monospace',
      heading: '"Orbitron", "JetBrains Mono", -apple-system, BlinkMacSystemFont, system-ui, monospace',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '2px',      // Sharp, angular design
    md: '3px',
    lg: '4px',
  },
  colors: {
    // Electric cyberpunk palette
    primary: '#00ffff',     // Electric cyan
    secondary: '#ff0080',   // Hot pink
    success: '#00ff41',     // Matrix green
    warning: '#ffff00',     // Electric yellow
    error: '#ff0040',       // Neon red
    info: '#0080ff',        // Electric blue
    
    // Deep cyber backgrounds
    background: 'radial-gradient(ellipse at center, #001122 0%, #000000 70%)',
    surface: 'rgba(0, 20, 40, 0.8)',
    surfaceHover: 'rgba(0, 40, 80, 0.6)',
    surfaceActive: 'rgba(0, 60, 120, 0.5)',
    
    // Glowing borders
    border: 'rgba(0, 255, 255, 0.4)',
    
    // High-contrast neon text
    text: {
      primary: '#ffffff',     // Pure white
      secondary: '#00ffff',   // Cyan accent
      tertiary: '#ff0080',    // Pink accent
      disabled: '#004466',    // Dark cyan
      inverse: '#000000',     // Black
    },
    
    // Cyber components
    appBar: 'rgba(0, 0, 0, 0.95)',
    appBarText: '#00ffff',
    sideNav: 'rgba(0, 10, 20, 0.95)',
    tooltip: 'rgba(0, 255, 255, 0.95)',
    
    // Glowing focus
    focusRing: 'rgba(0, 255, 255, 0.8)',
    
    // Cyber chart styling
    chartBackground: 'rgba(0, 0, 0, 0.9)',
    chartBorder: 'rgba(0, 255, 255, 0.6)',
    
    // Neon sampling indicator
    samplingIndicator: {
      background: 'rgba(255, 255, 0, 0.1)',
      border: 'rgba(255, 255, 0, 0.8)',
      text: '#ffff00',
      icon: '#ffff00',
    },
  },
};

// ENHANCED Material Design 3 theme - Google's latest design language
export const material3Theme = {
  ...baseTheme,
  mode: 'material3' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Roboto Flex", "Roboto", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono: '"Roboto Mono", "JetBrains Mono", "SF Mono", monospace',
      heading: '"Roboto Flex", "Roboto", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',   // Material 3 scale
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.75rem',  // Display medium
      xxxl: '2.25rem', // Display large
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '12px',     // Material 3 rounded corners
    md: '16px',
    lg: '28px',     // Extra rounded
  },
  colors: {
    // Material You dynamic color palette
    primary: '#6750a4',     // Purple primary
    secondary: '#625b71',   // Neutral variant
    success: '#146c2e',     // Green
    warning: '#7d5260',     // Tertiary
    error: '#ba1a1a',       // Error
    info: '#0061a4',        // Blue
    
    // Material 3 surface tones
    background: '#fffbfe',  // Surface bright
    surface: '#fffbfe',     // Surface
    surfaceHover: '#f7f2fa', // Surface container low
    surfaceActive: '#f3edf7', // Surface container
    
    // Material 3 outline
    border: '#79747e',      // Outline
    
    // Material 3 on-surface colors
    text: {
      primary: '#1c1b1f',   // On surface
      secondary: '#49454f', // On surface variant
      tertiary: '#79747e',  // Outline
      disabled: '#c4c7c5',  // Disabled
      inverse: '#f2f0f4',   // Inverse on surface
    },
    
    // Material 3 containers
    appBar: '#eaddff',      // Primary container
    appBarText: '#21005d',  // On primary container
    sideNav: '#fffbfe',     // Surface
    tooltip: '#313033',     // Inverse surface
    
    // Material 3 focus
    focusRing: 'rgba(103, 80, 164, 0.12)',
    
    // Material 3 charts
    chartBackground: '#fffbfe',
    chartBorder: '#cac4d0',  // Outline variant
    
    // Material 3 sampling indicator
    samplingIndicator: {
      background: '#fff8e1',
      border: '#e8a317',
      text: '#5a4a00',
      icon: '#7d5260',
    },
  },
};

// ENHANCED Neumorphism theme - Soft, tactile design
export const neumorphismTheme = {
  ...baseTheme,
  mode: 'neumorphism' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Nunito", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono: '"SF Mono", "JetBrains Mono", "Monaco", monospace',
      heading: '"Nunito", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '20px',     // Very rounded for soft feel
    md: '24px',
    lg: '32px',
  },
  colors: {
    // Soft, muted neumorphic palette
    primary: '#667eea',     // Soft blue
    secondary: '#9ca3af',   // Neutral gray
    success: '#10b981',     // Soft green
    warning: '#f59e0b',     // Soft orange
    error: '#ef4444',       // Soft red
    info: '#3b82f6',        // Soft blue
    
    // Neumorphic gray backgrounds
    background: 'linear-gradient(145deg, #e0e5ec, #d6dbe2)',
    surface: '#e0e5ec',
    surfaceHover: '#d6dbe2',
    surfaceActive: '#ccd1d8',
    
    // Subtle borders
    border: '#c8ced8',
    
    // Soft, readable text
    text: {
      primary: '#2d3748',   // Dark gray
      secondary: '#4a5568', // Medium gray
      tertiary: '#718096',  // Light gray
      disabled: '#a0aec0',  // Very light gray
      inverse: '#ffffff',   // White
    },
    
    // Neumorphic components
    appBar: '#e0e5ec',
    appBarText: '#2d3748',
    sideNav: '#e0e5ec',
    tooltip: '#4a5568',
    
    // Soft focus
    focusRing: 'rgba(102, 126, 234, 0.3)',
    
    // Neumorphic charts
    chartBackground: '#e0e5ec',
    chartBorder: '#c8ced8',
    
    // Soft sampling indicator
    samplingIndicator: {
      background: '#fef3cd',
      border: '#d69e2e',
      text: '#744210',
      icon: '#f59e0b',
    },
  },
};

// ENHANCED Brutalist theme - Raw, industrial, no-nonsense design
export const brutalistTheme = {
  ...baseTheme,
  mode: 'brutalist' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Arial Black", "Helvetica Bold", "Impact", sans-serif',
      mono: '"Courier New", "Monaco", "Menlo", monospace',
      heading: '"Impact", "Arial Black", "Helvetica Bold", sans-serif',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',   // More reasonable compact sizing
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.375rem',
      xxl: '1.875rem',
      xxxl: '2.5rem',  // Bold headlines
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '700',    // No thin fonts in brutalism
      regular: '800',
      medium: '900',
      semibold: '900',
      bold: '900',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '0px',       // No rounded corners
    md: '0px',
    lg: '0px',
  },
  colors: {
    // Stark, high-contrast brutalist palette
    primary: '#000000',     // Pure black
    secondary: '#ff0000',   // Alert red
    success: '#00ff00',     // Electric green
    warning: '#ffff00',     // Warning yellow
    error: '#ff0000',       // Error red
    info: '#0000ff',        // Information blue
    
    // Stark white backgrounds
    background: '#ffffff',  // Pure white
    surface: '#ffffff',     // White surfaces
    surfaceHover: '#f0f0f0', // Light gray hover
    surfaceActive: '#e0e0e0', // Gray active
    
    // Bold black borders
    border: '#000000',      // Pure black borders
    
    // High-contrast text
    text: {
      primary: '#000000',   // Black text
      secondary: '#333333', // Dark gray
      tertiary: '#666666',  // Medium gray
      disabled: '#999999',  // Light gray
      inverse: '#ffffff',   // White on black
    },
    
    // Bold components
    appBar: '#ffffff',
    appBarText: '#000000',
    sideNav: '#ffffff',
    tooltip: '#000000',
    
    // Aggressive focus
    focusRing: '#ff0000',   // Red focus
    
    // High-contrast charts
    chartBackground: '#ffffff',
    chartBorder: '#000000',
    
    // Bold sampling indicator
    samplingIndicator: {
      background: '#ffff00', // Yellow background
      border: '#000000',     // Black border
      text: '#000000',       // Black text
      icon: '#ff0000',       // Red icon
    },
  },
};

// ENHANCED Retro theme - Warm, nostalgic, vintage design
export const retroTheme = {
  ...baseTheme,
  mode: 'retro' as ThemeMode,
  typography: {
    ...typography,
    fontFamily: {
      body: '"Georgia", "Times New Roman", "Palatino", serif',
      mono: '"Courier New", "Monaco", "Andale Mono", monospace',
      heading: '"Georgia", "Times New Roman", "Palatino", serif',
    },
    fontSize: {
      ...typography.fontSize,
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeight: {
      ...typography.fontWeight,
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    ...borderRadius,
    sm: '8px',      // Vintage rounded corners
    md: '12px',
    lg: '16px',
  },
  colors: {
    // Warm, nostalgic vintage palette
    primary: '#cd853f',     // Peru/tan
    secondary: '#8b4513',   // Saddle brown
    success: '#228b22',     // Forest green
    warning: '#daa520',     // Goldenrod
    error: '#cd5c5c',       // Indian red
    info: '#4682b4',        // Steel blue
    
    // Warm, aged backgrounds
    background: 'linear-gradient(135deg, #f5deb3 0%, #faebd7 50%, #f0e68c 100%)', // Wheat to antique white to khaki
    surface: '#faebd7',     // Antique white
    surfaceHover: '#f0e68c', // Khaki
    surfaceActive: '#daa520', // Goldenrod
    
    // Vintage borders
    border: '#d2b48c',      // Tan
    
    // Warm, readable text
    text: {
      primary: '#2f1b14',   // Dark brown
      secondary: '#5d4e37', // Dark olive green
      tertiary: '#8b7355',  // Dark khaki
      disabled: '#a0826d',  // Rosy brown
      inverse: '#ffffff',   // White
    },
    
    // Vintage components
    appBar: '#daa520',      // Goldenrod
    appBarText: '#2f1b14',  // Dark brown
    sideNav: '#faebd7',     // Antique white
    tooltip: '#2f1b14',     // Dark brown
    
    // Warm focus
    focusRing: 'rgba(205, 133, 63, 0.6)', // Peru with opacity
    
    // Vintage charts
    chartBackground: '#faebd7', // Antique white
    chartBorder: '#d2b48c',     // Tan
    
    // Vintage sampling indicator
    samplingIndicator: {
      background: '#ffd700', // Gold
      border: '#b8860b',     // Dark goldenrod
      text: '#2f1b14',       // Dark brown
      icon: '#daa520',       // Goldenrod
    },
  },
};

// Export all themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  fluent: fluentTheme,
  neon: neonTheme,
  material3: material3Theme,
  neumorphism: neumorphismTheme,
  brutalist: brutalistTheme,
  retro: retroTheme,
};

// Enhanced theme metadata for the selector
export const themeMetadata = {
  light: {
    name: 'Light',
    description: 'Modern, clean, and accessible',
    category: 'Classic',
  },
  dark: {
    name: 'Dark',
    description: 'Sophisticated and easy on the eyes',
    category: 'Classic',
  },
  fluent: {
    name: 'Fluent',
    description: 'Microsoft glassmorphism design',
    category: 'Modern',
  },
  neon: {
    name: 'Neon',
    description: 'Cyberpunk electric aesthetic',
    category: 'Modern',
  },
  material3: {
    name: 'Material 3',
    description: 'Google\'s dynamic design system',
    category: 'Modern',
  },
  neumorphism: {
    name: 'Neumorphism',
    description: 'Soft, tactile UI design',
    category: 'Trendy',
  },
  brutalist: {
    name: 'Brutalist',
    description: 'Raw, industrial, no-compromise',
    category: 'Experimental',
  },
  retro: {
    name: 'Retro',
    description: 'Warm vintage nostalgia',
    category: 'Nostalgic',
  },
};

// Default export the light theme
export default lightTheme;

// Type definition for our theme to be used with styled-components
export type Theme = typeof lightTheme; 