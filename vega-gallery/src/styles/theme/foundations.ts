// Core design tokens
export const colors = {
  // Primary palette
  primary: {
    50: '#ebf8ff',
    100: '#bee3f8',
    200: '#90cdf4',
    300: '#63b3ed',
    400: '#4299e1',
    500: '#3182ce',
    600: '#2b6cb0',
    700: '#2c5282',
    800: '#2a4365',
    900: '#1a365d',
  },
  // Neutral palette
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  // Surface variations
  surface: {
    default: '#ffffff',
    raised: '#f8fafc',
    sunken: '#f1f5f9',
    overlay: 'rgba(255, 255, 255, 0.95)'
  },
  // Chart-specific palette
  charts: {
    sequential: [
      '#4C78A8',
      '#72B7B2',
      '#89C07E',
      '#BAB0AC',
      '#F28E2B',
      '#E15759',
      '#76B7B2'
    ],
    categorical: [
      '#4C78A8',
      '#E15759',
      '#76B7B2',
      '#FF9DA7',
      '#9C755F',
      '#BAB0AC'
    ],
    diverging: [
      '#2166AC',
      '#67A9CF',
      '#D1E5F0',
      '#F7F7F7',
      '#FDDBC7',
      '#EF8A62',
      '#B2182B'
    ]
  },
  error: '#dc3545',
  border: '#e2e8f0',
  text: '#1e293b',
  background: '#f8f9fa',
  blue: {
    50: '#ebf8ff',
    100: '#bee3f8',
    200: '#90cdf4',
    300: '#63b3ed',
    400: '#4299e1',
    500: '#3182ce',
    600: '#2b6cb0',
    700: '#2c5282',
    800: '#2a4365',
    900: '#1a365d',
  },
  green: {
    50: '#f0fff4',
    100: '#c6f6d5',
    200: '#9ae6b4',
    300: '#68d391',
    400: '#48bb78',
    500: '#38a169',
    600: '#2f855a',
    700: '#276749',
    800: '#22543d',
    900: '#1c4532',
  },
  purple: {
    50: '#faf5ff',
    100: '#e9d8fd',
    200: '#d6bcfa',
    300: '#b794f4',
    400: '#9f7aea',
    500: '#805ad5',
    600: '#6b46c1',
    700: '#553c9a',
    800: '#44337a',
    900: '#322659',
  },
  orange: {
    50: '#fff8f1',
    100: '#feebcb',
    200: '#fbd38d',
    300: '#f6ad55',
    400: '#ed8936',
    500: '#dd6b20',
    600: '#c05621',
    700: '#9c4221',
    800: '#7b341e',
    900: '#652b19',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
} as const;

export const typography = {
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: '"IBM Plex Mono", monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem'
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
} as const;

export const borders = {
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    xxl: '16px',
    round: '9999px'
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px'
  }
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
} as const;

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms'
  },
  timing: {
    ease: 'ease',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
} as const;

// Add new spacing utilities
export const layout = {
  maxWidth: '1440px',
  contentWidth: '1200px',
  sidebarWidth: '280px',
  headerHeight: '64px',
  footerHeight: '48px'
} as const;

// Add z-index management
export const zIndex = {
  modal: 1000,
  overlay: 900,
  drawer: 800,
  header: 700,
  dropdown: 600
} as const; 