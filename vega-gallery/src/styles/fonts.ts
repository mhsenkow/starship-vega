/**
 * Local font fallback system to replace Google Fonts dependencies
 * This ensures the app works offline and doesn't depend on external font loading
 */

// Font face declarations for locally hosted fonts (when available)
export const localFontFaces = `
  /* Fallback system fonts that work across all platforms */
  @font-face {
    font-family: 'System UI';
    font-style: normal;
    font-weight: 300 900;
    font-display: swap;
    src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont'), local('Segoe UI'), local('Roboto'), local('Helvetica Neue'), local('Arial'), local('sans-serif');
  }

  @font-face {
    font-family: 'System Mono';
    font-style: normal;
    font-weight: 300 700;
    font-display: swap;
    src: local('SF Mono'), local('Monaco'), local('Inconsolata'), local('Roboto Mono'), local('Source Code Pro'), local('Consolas'), local('monospace');
  }
`;

// Font stack definitions with proper fallbacks
export const fontStacks = {
  // Primary font stack with system UI fallbacks
  body: `'System UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
  
  // Monospace font stack for code
  mono: `'System Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', Consolas, monospace`,
  
  // Heading font stack (can use system UI or a more distinctive fallback)
  heading: `'System UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
  
  // Display font for special cases
  display: `'System UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Futura', 'Trebuchet MS', sans-serif`
} as const;

// CSS custom properties for font families
export const fontCSSVariables = `
  --font-family-body: ${fontStacks.body};
  --font-family-mono: ${fontStacks.mono};
  --font-family-heading: ${fontStacks.heading};
  --font-family-display: ${fontStacks.display};
`;

// Font weight constants for consistency
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900
} as const;

// Font size scale for consistent typography
export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
} as const;

// Line height scale
export const lineHeights = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2
} as const;
