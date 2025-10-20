/**
 * Design System Tokens
 * Centralized design tokens for consistent, maintainable UI components
 * Based on Material Design 3 principles with robust fallbacks
 */

// Color tokens following Material Design 3 with your specified colors
export const colors = {
  // Primary colors - using your specified #2196f3
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Your specified primary color
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  
  // Secondary colors  
  secondary: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0', // Main secondary
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a1b9a',
    900: '#4a148c',
  },
  
  // Tertiary colors - neutral grays for subtle actions
  tertiary: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e', // Main tertiary
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic colors
  success: {
    50: '#e8f5e8',
    100: '#c8e6c8',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Your specified color
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },

  // Data type semantic colors
  blue: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },

  orange: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },

  purple: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0',
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a1b9a',
    900: '#4a148c',
  },

  green: {
    50: '#e8f5e8',
    100: '#c8e6c8',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107', // Your specified color
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  
  // Additional colors from your specification
  lightGreen: {
    50: '#f1f8e9',
    100: '#dcedc8',
    200: '#c5e1a5',
    300: '#aed581',
    400: '#9ccc65',
    500: '#8bc34a', // Your specified color
    600: '#7cb342',
    700: '#689f38',
    800: '#558b2f',
    900: '#33691e',
  },
  
  lime: {
    50: '#f9fbe7',
    100: '#f0f4c3',
    200: '#e6ee9c',
    300: '#dce775',
    400: '#d4e157',
    500: '#cddc39', // Your specified color
    600: '#c0ca33',
    700: '#afb42b',
    800: '#9e9d24',
    900: '#827717',
  },
  
  amber: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffeb3b', // Your specified color
    600: '#ffc107',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336', // Main error
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
  
  info: {
    50: '#e1f5fe',
    100: '#b3e5fc',
    200: '#81d4fa',
    300: '#4fc3f7',
    400: '#29b6f6',
    500: '#03a9f4', // Your specified color
    600: '#039be5',
    700: '#0288d1',
    800: '#0277bd',
    900: '#01579b',
  },
  
  // Additional Material Design colors from your specification
  cyan: {
    50: '#e0f7fa',
    100: '#b2ebf2',
    200: '#80deea',
    300: '#4dd0e1',
    400: '#26c6da',
    500: '#00bcd4', // Your specified color
    600: '#00acc1',
    700: '#0097a7',
    800: '#00838f',
    900: '#006064',
  },
  
  teal: {
    50: '#e0f2f1',
    100: '#b2dfdb',
    200: '#80cbc4',
    300: '#4db6ac',
    400: '#26a69a',
    500: '#009688', // Your specified color
    600: '#00897b',
    700: '#00796b',
    800: '#00695c',
    900: '#004d40',
  },
  
  deepOrange: {
    50: '#fbe9e7',
    100: '#ffccbc',
    200: '#ffab91',
    300: '#ff8a65',
    400: '#ff7043',
    500: '#ff5722', // Your specified color
    600: '#f4511e',
    700: '#e64a19',
    800: '#d84315',
    900: '#bf360c',
  },
  
  // Neutral colors for backgrounds, surfaces, and text
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic surface colors
  surface: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#eeeeee',
    hover: 'rgba(0, 0, 0, 0.04)',
    active: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.12)',
  },
  
  // Text colors with proper contrast ratios
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    tertiary: 'rgba(0, 0, 0, 0.38)',
    disabled: 'rgba(0, 0, 0, 0.12)',
    inverse: '#ffffff',
    link: '#1976d2',
    linkHover: '#1565c0',
  },
  
  // Border colors
  border: {
    light: 'rgba(0, 0, 0, 0.12)',
    medium: 'rgba(0, 0, 0, 0.23)',
    strong: 'rgba(0, 0, 0, 0.38)',
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
  },
  
  // Your specified color palette for easy access
  palette: {
    blue: '#2196f3',      // Primary blue
    lightBlue: '#03a9f4', // Info blue
    cyan: '#00bcd4',      // Cyan
    teal: '#009688',      // Teal
    green: '#4caf50',     // Success green
    lightGreen: '#8bc34a', // Light green
    lime: '#cddc39',      // Lime
    yellow: '#ffeb3b',    // Amber/yellow
    orange: '#ffc107',    // Warning orange
    deepOrange: '#ff9800', // Orange
    red: '#ff5722',       // Deep orange/red
  },
} as const;

// Spacing scale following 8pt grid system
export const spacing = {
  0: '0px',
  0.5: '2px',   // 0.125rem
  1: '4px',     // 0.25rem
  2: '8px',     // 0.5rem
  3: '12px',    // 0.75rem
  4: '16px',    // 1rem
  5: '20px',    // 1.25rem
  6: '24px',    // 1.5rem
  8: '32px',    // 2rem
  10: '40px',   // 2.5rem
  12: '48px',   // 3rem
  16: '64px',   // 4rem
  20: '80px',   // 5rem
  24: '96px',   // 6rem
  32: '128px',  // 8rem
} as const;

// Typography scale following Material Design 3 with system font fallbacks
export const typography = {
  fontFamily: {
    primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    secondary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", "Consolas", "Courier New", monospace',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// Border radius scale
export const borderRadius = {
  none: '0px',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const;

// Shadow/elevation tokens following Material Design
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Material Design elevation shadows
  elevation1: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  elevation2: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
  elevation3: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  elevation4: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  elevation6: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
  elevation8: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
} as const;

// Transition timing functions
export const transitions = {
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerated: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerated: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  duration: {
    fastest: '75ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '700ms',
  },
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      small: '32px',
      medium: '40px',
      large: '48px',
    },
    padding: {
      small: `${spacing[2]} ${spacing[3]}`,
      medium: `${spacing[3]} ${spacing[4]}`,
      large: `${spacing[4]} ${spacing[6]}`,
    },
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  
  input: {
    height: '40px',
    padding: `0 ${spacing[3]}`,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.base,
    borderWidth: '1px',
  },
  
  card: {
    borderRadius: borderRadius.md,
    padding: spacing[6],
    boxShadow: shadows.elevation2,
  },
  
  modal: {
    borderRadius: borderRadius.lg,
    boxShadow: shadows.elevation8,
  },
  
  // New component tokens
  badge: {
    borderRadius: borderRadius.full,
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  
  tooltip: {
    borderRadius: borderRadius.sm,
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.sm,
    maxWidth: '200px',
    zIndex: zIndex.tooltip,
  },
  
  dropdown: {
    borderRadius: borderRadius.base,
    padding: spacing[2],
    boxShadow: shadows.elevation3,
    zIndex: zIndex.dropdown,
  },
  
  tab: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.sm,
  },
} as const;

// Export all tokens as a single object for easy access
export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  transitions,
  components,
} as const;

// Type exports
export type DesignTokens = typeof designTokens;
export type ColorScale = typeof colors.primary;
export type SpacingScale = typeof spacing;
export type TypographyScale = typeof typography;
