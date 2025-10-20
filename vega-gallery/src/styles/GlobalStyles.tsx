import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';
import { localFontFaces, fontCSSVariables, fontStacks } from './fonts';

// Utility to convert hex color to RGB format
const hexToRgb = (hex: string) => {
  // Handle non-hex values gracefully
  if (!hex || typeof hex !== 'string' || !hex.includes('#')) {
    // For non-hex values, try to extract RGB values or return default
    if (hex.includes('rgb')) {
      const match = hex.match(/rgba?\((\d+),?\s*(\d+),?\s*(\d+)/);
      if (match) {
        return `${match[1]}, ${match[2]}, ${match[3]}`;
      }
    }
    // Default fallback for complex values like gradients
    return '0, 0, 0';
  }
  
  // Remove the hash if it exists
  const cleanHex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(cleanHex.length === 3 ? cleanHex[0] + cleanHex[0] : cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.length === 3 ? cleanHex[1] + cleanHex[1] : cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.length === 3 ? cleanHex[2] + cleanHex[2] : cleanHex.substring(4, 6), 16);
  
  // Check for invalid values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return '0, 0, 0';
  }
  
  // Return the RGB values as a comma-separated string
  return `${r}, ${g}, ${b}`;
};

// Helper function to safely get theme mode
const getThemeMode = (theme: Theme): string => theme?.mode || 'light';

export const GlobalStyles = createGlobalStyle<{ theme?: Theme }>`
  /* Local font system for robust offline functionality */
  ${localFontFaces}
  
  :root {
    /* Font family variables with robust fallbacks */
    ${fontCSSVariables}
    
    /* Override with theme-specific fonts if available, otherwise use system fallbacks */
    --font-family-body: ${({ theme }) => theme?.typography?.fontFamily?.body || fontStacks.body};
    --font-family-mono: ${({ theme }) => theme?.typography?.fontFamily?.mono || fontStacks.mono};
    --font-family-heading: ${({ theme }) => theme?.typography?.fontFamily?.heading || fontStacks.heading};
    
    /* Typography variables */
    --typography-fontFamily-primary: ${({ theme }) => theme?.typography?.fontFamily?.body || fontStacks.body};
    --typography-fontFamily-mono: ${({ theme }) => theme?.typography?.fontFamily?.mono || fontStacks.mono};
    --typography-fontSize-xs: ${({ theme }) => theme?.typography?.fontSize?.xs || '0.75rem'};
    --typography-fontSize-sm: ${({ theme }) => theme?.typography?.fontSize?.sm || '0.875rem'};
    --typography-fontSize-base: ${({ theme }) => theme?.typography?.fontSize?.md || '1rem'};
    --typography-fontSize-lg: ${({ theme }) => theme?.typography?.fontSize?.lg || '1.125rem'};
    --typography-fontSize-xl: ${({ theme }) => theme?.typography?.fontSize?.xl || '1.25rem'};
    --typography-fontWeight-regular: ${({ theme }) => theme?.typography?.fontWeight?.regular || '400'};
    --typography-fontWeight-medium: ${({ theme }) => theme?.typography?.fontWeight?.medium || '500'};
    --typography-fontWeight-semibold: ${({ theme }) => theme?.typography?.fontWeight?.semibold || '600'};
    --typography-lineHeight-normal: ${({ theme }) => theme?.typography?.lineHeight?.normal || '1.5'};
    --typography-lineHeight-tight: ${({ theme }) => theme?.typography?.lineHeight?.tight || '1.25'};
    --typography-lineHeight-loose: ${({ theme }) => theme?.typography?.lineHeight?.loose || '1.75'};
    
    /* Design System compatibility aliases */
    --font-family-primary: ${({ theme }) => theme?.typography?.fontFamily?.body || fontStacks.body};
    --color-background-primary: ${({ theme }) => theme?.colors?.background || '#ffffff'};
    --color-surface-primary: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
    --color-border-light: ${({ theme }) => theme?.colors?.border || '#e0e0e0'};
    
    /* Spacing aliases for design system */
    --spacing-1: ${({ theme }) => theme?.spacing?.xs || '4px'};
    --spacing-2: ${({ theme }) => theme?.spacing?.sm || '8px'};
    --spacing-3: ${({ theme }) => theme?.spacing?.md || '12px'};
    --spacing-4: ${({ theme }) => theme?.spacing?.md || '16px'};
    --spacing-6: ${({ theme }) => theme?.spacing?.lg || '24px'};
    --spacing-8: ${({ theme }) => theme?.spacing?.xl || '32px'};
    
    /* Component aliases */
    --component-button-fontWeight: ${({ theme }) => theme?.typography?.fontWeight?.medium || '500'};
    --component-button-borderRadius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
    --component-button-height-small: 32px;
    --component-button-height-medium: 40px;
    --component-button-height-large: 48px;
    --component-button-padding-small: ${({ theme }) => theme?.spacing?.sm || '8px'} ${({ theme }) => theme?.spacing?.md || '16px'};
    --component-button-padding-medium: ${({ theme }) => theme?.spacing?.md || '12px'} ${({ theme }) => theme?.spacing?.lg || '20px'};
    --component-button-padding-large: ${({ theme }) => theme?.spacing?.lg || '16px'} ${({ theme }) => theme?.spacing?.xl || '24px'};
    
    /* Transition aliases */
    --transition-duration-normal: ${({ theme }) => theme?.transitions?.normal || '0.3s ease'};
    --transition-easing-standard: ease;
    
    /* Shadow aliases */
    --shadow-sm: ${({ theme }) => theme?.elevation?.sm || '0px 1px 2px rgba(0, 0, 0, 0.05)'};
    --shadow-base: ${({ theme }) => theme?.elevation?.md || '0px 2px 4px rgba(0, 0, 0, 0.1)'};
    --shadow-md: ${({ theme }) => theme?.elevation?.md || '0px 2px 4px rgba(0, 0, 0, 0.1)'};
    --shadow-lg: ${({ theme }) => theme?.elevation?.lg || '0px 4px 8px rgba(0, 0, 0, 0.12)'};
    
    /* Border radius aliases */
    --radius-sm: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
    --radius-base: ${({ theme }) => theme?.borderRadius?.md || '8px'};
    --radius-md: ${({ theme }) => theme?.borderRadius?.md || '8px'};
    --radius-lg: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
    --radius-full: 9999px;
    
    /* Base colors */
    --color-primary: ${({ theme }) => theme?.colors?.primary || '#1976d2'};
    --color-primary-light: ${({ theme }) => (theme?.colors?.primary || '#1976d2') + '20'};
    --color-secondary: ${({ theme }) => theme?.colors?.secondary || '#666666'};
    --color-success: ${({ theme }) => theme?.colors?.success || '#4caf50'};
    --color-success-light: ${({ theme }) => (theme?.colors?.success || '#4caf50') + '20'};
    --color-warning: ${({ theme }) => theme?.colors?.warning || '#ff9800'};
    --color-warning-light: ${({ theme }) => (theme?.colors?.warning || '#ff9800') + '20'};
    --color-error: ${({ theme }) => theme?.colors?.error || '#f44336'};
    --color-error-light: ${({ theme }) => (theme?.colors?.error || '#f44336') + '20'};
    --color-error-dark: ${({ theme }) => getThemeMode(theme) === 'dark' || getThemeMode(theme) === 'neon' ? '#ff1744' : '#c82333'};
    --color-info: ${({ theme }) => theme?.colors?.info || '#2196f3'};
    
    /* RGB variants for opacity manipulation */
    --color-primary-rgb: ${({ theme }) => hexToRgb(theme?.colors?.primary || '#1976d2')};
    --color-secondary-rgb: ${({ theme }) => hexToRgb(theme?.colors?.secondary || '#666666')};
    --color-success-rgb: ${({ theme }) => hexToRgb(theme?.colors?.success || '#4caf50')};
    --color-warning-rgb: ${({ theme }) => hexToRgb(theme?.colors?.warning || '#ff9800')};
    --color-error-rgb: ${({ theme }) => hexToRgb(theme?.colors?.error || '#f44336')};
    --color-info-rgb: ${({ theme }) => hexToRgb(theme?.colors?.info || '#2196f3')};
    --color-text-primary-rgb: ${({ theme }) => hexToRgb(theme?.colors?.text?.primary || '#000000')};
    --color-text-secondary-rgb: ${({ theme }) => hexToRgb(theme?.colors?.text?.secondary || '#666666')};
    
    /* Background & surface colors */
    --color-background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
    --color-surface: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
    --color-surface-hover: ${({ theme }) => theme?.colors?.surfaceHover || '#f5f5f5'};
    --color-surface-active: ${({ theme }) => theme?.colors?.surfaceActive || '#eeeeee'};
    
    /* Border colors */
    --color-border: ${({ theme }) => theme?.colors?.border || '#e0e0e0'};
    
    /* Text colors */
    --color-text-primary: ${({ theme }) => theme?.colors?.text?.primary || '#000000'};
    --color-text-secondary: ${({ theme }) => theme?.colors?.text?.secondary || '#666666'};
    --color-text-tertiary: ${({ theme }) => theme?.colors?.text?.tertiary || '#999999'};
    --color-text-disabled: ${({ theme }) => theme?.colors?.text?.disabled || '#cccccc'};
    --color-text-inverse: ${({ theme }) => theme?.colors?.text?.inverse || '#ffffff'};
    
    /* Specific UI elements */
    --color-app-bar: ${({ theme }) => theme?.colors?.appBar || '#ffffff'};
    --color-app-bar-text: ${({ theme }) => theme?.colors?.appBarText || '#000000'};
    --color-appBar: ${({ theme }) => theme?.colors?.appBar || '#ffffff'};
    --color-appBarText: ${({ theme }) => theme?.colors?.appBarText || '#000000'};
    --color-text-on-primary: ${({ theme }) => theme?.colors?.text?.inverse || '#ffffff'};
    --color-primary-hover: ${({ theme }) => {
      const primary = theme?.colors?.primary || '#1976d2';
      return getThemeMode(theme) === 'dark' ? primary + 'cc' : primary + 'e0';
    }};
    --color-focus-ring: ${({ theme }) => theme?.colors?.focusRing || 'rgba(25, 118, 210, 0.5)'};
    
    /* Chart-specific colors */
    --color-chart-background: ${({ theme }) => theme?.colors?.chartBackground || '#ffffff'};
    --color-chart-border: ${({ theme }) => theme?.colors?.chartBorder || '#e0e0e0'};
    
    /* Sampling indicator */
    --sampling-indicator-bg: ${({ theme }) => theme?.colors?.samplingIndicator?.background || '#fffce8'};
    --sampling-indicator-border: ${({ theme }) => theme?.colors?.samplingIndicator?.border || '#ffe58f'};
    --sampling-indicator-text: ${({ theme }) => theme?.colors?.samplingIndicator?.text || '#755c0d'};
    --sampling-indicator-icon: ${({ theme }) => theme?.colors?.samplingIndicator?.icon || '#f5a623'};
    
    /* Sampling indicator aliases for backward compatibility */
    --color-samplingIndicator-background: ${({ theme }) => theme?.colors?.samplingIndicator?.background || '#fffce8'};
    --color-samplingIndicator-border: ${({ theme }) => theme?.colors?.samplingIndicator?.border || '#ffe58f'};
    --color-samplingIndicator-text: ${({ theme }) => theme?.colors?.samplingIndicator?.text || '#755c0d'};
    --color-samplingIndicator-icon: ${({ theme }) => theme?.colors?.samplingIndicator?.icon || '#f5a623'};
    
    /* Spacing */
    --spacing-xs: ${({ theme }) => theme?.spacing?.xs || '4px'};
    --spacing-sm: ${({ theme }) => theme?.spacing?.sm || '8px'};
    --spacing-md: ${({ theme }) => theme?.spacing?.md || '16px'};
    --spacing-lg: ${({ theme }) => theme?.spacing?.lg || '24px'};
    --spacing-xl: ${({ theme }) => theme?.spacing?.xl || '32px'};
    
    /* Border radius */
    --border-radius-sm: ${({ theme }) => theme?.borderRadius?.sm || '4px'};
    --border-radius-md: ${({ theme }) => theme?.borderRadius?.md || '8px'};
    --border-radius-lg: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
    
    /* Transitions */
    --transition-fast: ${({ theme }) => theme?.transitions?.fast || '0.15s ease'};
    --transition-normal: ${({ theme }) => theme?.transitions?.normal || '0.3s ease'};
    --transition-slow: ${({ theme }) => theme?.transitions?.slow || '0.5s ease'};
    
    /* Elevation (shadows) */
    --elevation-sm: ${({ theme }) => theme?.elevation?.sm || '0px 1px 2px rgba(0, 0, 0, 0.05)'};
    --elevation-md: ${({ theme }) => theme?.elevation?.md || '0px 2px 4px rgba(0, 0, 0, 0.1)'};
    --elevation-lg: ${({ theme }) => theme?.elevation?.lg || '0px 4px 8px rgba(0, 0, 0, 0.12)'};
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: ${({ theme }) => theme?.typography?.fontFamily?.body || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'};
    font-size: 16px;
    line-height: ${({ theme }) => theme?.typography?.lineHeight?.normal || '1.5'};
    background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
    color: ${({ theme }) => theme?.colors?.text?.primary || '#000000'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    
    /* Theme-specific font weights */
    font-weight: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return '800';
      if (mode === 'neon') return '400';
      return '400';
    }};
  }
  
  /* Typography scale with theme-specific adjustments */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme?.typography?.fontFamily?.heading || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'};
    font-weight: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return '900';
      if (mode === 'neon') return '700';
      if (mode === 'retro') return '600';
      return theme?.typography?.fontWeight?.semibold || '600';
    }};
    line-height: ${({ theme }) => theme?.typography?.lineHeight?.tight || '1.2'};
    color: ${({ theme }) => theme?.colors?.text?.primary || '#000000'};
    margin-bottom: ${({ theme }) => theme?.spacing?.md || '16px'};
    
    /* Theme-specific text transformations */
    text-transform: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return 'uppercase';
      return 'none';
    }};
    
    /* Theme-specific letter spacing */
    letter-spacing: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return '1px';
      if (mode === 'neon') return '0.5px';
      return 'normal';
    }};
  }

  h1 { 
    font-size: ${({ theme }) => theme?.typography?.fontSize?.xxxl || '2.5rem'};
    ${({ theme }) => getThemeMode(theme) === 'neon' && 'text-shadow: 0 0 10px rgba(0, 245, 255, 0.8);'}
  }
  h2 { 
    font-size: ${({ theme }) => theme?.typography?.fontSize?.xxl || '2rem'};
    ${({ theme }) => getThemeMode(theme) === 'neon' && 'text-shadow: 0 0 8px rgba(0, 245, 255, 0.6);'}
  }
  h3 { 
    font-size: ${({ theme }) => theme?.typography?.fontSize?.xl || '1.5rem'};
    ${({ theme }) => getThemeMode(theme) === 'neon' && 'text-shadow: 0 0 6px rgba(0, 245, 255, 0.5);'}
  }
  h4 { font-size: ${({ theme }) => theme?.typography?.fontSize?.lg || '1.25rem'}; }
  h5 { font-size: ${({ theme }) => theme?.typography?.fontSize?.md || '1rem'}; }
  h6 { font-size: ${({ theme }) => theme?.typography?.fontSize?.md || '1rem'}; }

  p {
    margin-bottom: ${({ theme }) => theme?.spacing?.md || '16px'};
    font-family: ${({ theme }) => theme?.typography?.fontFamily?.body || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'};
    
    /* Theme-specific paragraph styling */
    ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'retro') return 'font-style: italic;';
      return '';
    }}
  }

  a {
    color: ${({ theme }) => theme?.colors?.primary || '#1976d2'};
    text-decoration: none;
    transition: color ${({ theme }) => theme?.transitions?.fast || '0.15s ease'};
    
    &:hover {
      color: ${({ theme }) => getThemeMode(theme) === 'light' ? '#1565c0' : '#64b5f6'};
      ${({ theme }) => getThemeMode(theme) === 'neon' && 'text-shadow: 0 0 8px currentColor;'}
    }
  }

  /* Theme-specific focus styles */
  button:focus, 
  a:focus, 
  input:focus, 
  select:focus, 
  textarea:focus {
    outline: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return '3px solid #ff0000';
      if (mode === 'neon') return '2px solid rgba(0, 245, 255, 0.8)';
      return `3px solid ${theme?.colors?.focusRing || 'rgba(25, 118, 210, 0.5)'}`;
    }};
    outline-offset: ${({ theme }) => getThemeMode(theme) === 'brutalist' ? '0px' : '2px'};
    border-radius: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return '0px';
      if (mode === 'neumorphism') return '8px';
      return '4px';
    }};
  }

  /* Enhanced code elements with theme fonts */
  code, pre {
    font-family: ${({ theme }) => theme?.typography?.fontFamily?.mono || '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", "Consolas", "Courier New", monospace'};
    background-color: ${({ theme }) => 
      getThemeMode(theme) === 'light' ? '#f5f7fa' : 
      getThemeMode(theme) === 'neon' ? 'rgba(0, 245, 255, 0.1)' :
      getThemeMode(theme) === 'brutalist' ? '#f0f0f0' : '#2a2a2a'};
    border-radius: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return '0px';
      return theme?.borderRadius?.sm || '4px';
    }};
    ${({ theme }) => getThemeMode(theme) === 'brutalist' && 'border: 1px solid #000000;'}
  }
  
  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
    ${({ theme }) => getThemeMode(theme) === 'neon' && 'color: #00f5ff;'}
  }
  
  pre {
    padding: ${({ theme }) => theme?.spacing?.md || '16px'};
    overflow-x: auto;
    
    code {
      padding: 0;
      background-color: transparent;
    }
  }

  /* Global data sampling indicator styles */
  .sampling-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: var(--sampling-indicator-bg);
    border: 1px solid var(--sampling-indicator-border);
    border-radius: ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return '0px';
      if (mode === 'neumorphism') return '12px';
      return '4px';
    }};
    font-size: 12px;
    color: var(--sampling-indicator-text);
    z-index: 100;
    font-family: ${({ theme }) => theme?.typography?.fontFamily?.body || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'};
    
    ${({ theme }) => {
      const mode = getThemeMode(theme);
      if (mode === 'brutalist') return 'border: 2px solid #000000; font-weight: bold; text-transform: uppercase;';
      if (mode === 'neon') return 'box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);';
      return '';
    }}
  }

  .sampling-indicator svg {
    font-size: 16px;
    color: var(--sampling-indicator-icon);
  }

  .chart-sampling-notice {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .inline-sampling-notice {
    display: inline-flex;
    margin-left: 8px;
  }

  /* Enhanced theme-specific body styling with special effects */
  body.fluent-theme {
    /* Enhanced glassmorphism backdrop with subtle movement */
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 120, 212, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(16, 124, 16, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 140, 0, 0.06) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgba(240, 248, 255, 0.1) 0%, 
        rgba(230, 245, 255, 0.15) 50%, 
        rgba(255, 255, 255, 0.05) 100%
      );
    background-attachment: fixed;
    backdrop-filter: blur(80px) saturate(2) brightness(1.15);
    -webkit-backdrop-filter: blur(80px) saturate(2) brightness(1.15);
    animation: fluentFloat 20s ease-in-out infinite;
    
    /* Enhanced glass containers with deeper transparency */
    .glass-surface,
    [class*="MuiPaper"]:not(.chart-container):not([class*="vega"]):not(.vega-embed):not([data-chart-type]):not([class*="Chart"]),
    [class*="MuiCard"]:not(.chart-container):not([class*="vega"]):not(.vega-embed):not([data-chart-type]):not([class*="Chart"]),
    [role="dialog"]:not(.chart-container):not([class*="vega"]):not(.vega-embed):not([data-chart-type]):not([class*="Chart"]),
    .theme-panel {
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(60px) saturate(2) brightness(1.3) !important;
      -webkit-backdrop-filter: blur(60px) saturate(2) brightness(1.3) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      box-shadow: 
        0 16px 48px rgba(31, 38, 135, 0.2),
        0 8px 24px rgba(31, 38, 135, 0.15),
        inset 0 2px 0 rgba(255, 255, 255, 0.5),
        inset 0 -2px 0 rgba(255, 255, 255, 0.15) !important;
      border-radius: 20px !important;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Chart containers - minimal styling to avoid rendering issues */
    .chart-container,
    .vega-embed,
    [class*="vega"],
    .chart-preview,
    .chart-wrapper,
    [data-chart-type],
    [class*="Chart"]:not(.theme-panel),
    [class*="chart"]:not(.theme-panel) {
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 12px !important;
      backdrop-filter: none !important; /* Disable backdrop filter for charts */
      -webkit-backdrop-filter: none !important;
      transform: none !important; /* Disable transforms for charts */
      animation: none !important; /* Disable animations for charts */
      position: relative !important;
      overflow: visible !important; /* Ensure charts aren't clipped */
      font-family: inherit !important; /* Preserve chart fonts */
      
      /* Ensure proper dimensions */
      canvas, svg {
        max-width: 100% !important;
        height: auto !important;
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        transform: none !important;
        font-family: inherit !important;
      }
      
      /* Preserve text in charts */
      text, tspan {
        font-family: inherit !important;
        transform: none !important;
      }
    }
    
    /* Ultra-smooth glass effects for interactive elements */
    button:not(.chart-container button):not(.vega-embed button):not([data-chart-type] button):not([class*="Chart"] button):not([class*="chart"] button),
    .MuiButton-root:not(.chart-container .MuiButton-root):not(.vega-embed .MuiButton-root):not([data-chart-type] .MuiButton-root):not([class*="Chart"] .MuiButton-root):not([class*="chart"] .MuiButton-root),
    .MuiToggleButton-root:not(.chart-container .MuiToggleButton-root):not(.vega-embed .MuiToggleButton-root):not([data-chart-type] .MuiToggleButton-root):not([class*="Chart"] .MuiToggleButton-root):not([class*="chart"] .MuiToggleButton-root),
    .MuiIconButton-root:not(.chart-container .MuiIconButton-root):not(.vega-embed .MuiIconButton-root):not([data-chart-type] .MuiIconButton-root):not([class*="Chart"] .MuiIconButton-root):not([class*="chart"] .MuiIconButton-root) {
      background: rgba(255, 255, 255, 0.08) !important;
      backdrop-filter: blur(40px) saturate(1.8) !important;
      -webkit-backdrop-filter: blur(40px) saturate(1.8) !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;
      box-shadow: 
        0 8px 24px rgba(31, 38, 135, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
      &:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        backdrop-filter: blur(50px) saturate(2.2) brightness(1.2) !important;
        -webkit-backdrop-filter: blur(50px) saturate(2.2) brightness(1.2) !important;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 12px 32px rgba(31, 38, 135, 0.25),
          inset 0 2px 0 rgba(255, 255, 255, 0.7) !important;
      }
      
      &:active {
        background: rgba(255, 255, 255, 0.25) !important;
        transform: translateY(0px) scale(1);
      }
    }
    
    /* Premium navigation glass with depth */
    .MuiDrawer-paper,
    nav:not(.chart-container nav):not([data-chart-type] nav):not([class*="Chart"] nav):not([class*="chart"] nav),
    .sidebar {
      background: rgba(248, 249, 250, 0.03) !important;
      backdrop-filter: blur(80px) saturate(2.5) brightness(1.2) !important;
      -webkit-backdrop-filter: blur(80px) saturate(2.5) brightness(1.2) !important;
      border-right: 1px solid rgba(255, 255, 255, 0.25) !important;
      box-shadow: 
        0 0 60px rgba(31, 38, 135, 0.15),
        inset 0 2px 0 rgba(255, 255, 255, 0.4) !important;
    }
  }
  
  /* Cyberpunk Neon theme - More balanced electric aesthetic */
  body.neon-theme {
    background: 
      radial-gradient(ellipse at 25% 25%, rgba(0, 255, 255, 0.06) 0%, transparent 70%),
      radial-gradient(ellipse at 75% 75%, rgba(255, 0, 128, 0.04) 0%, transparent 50%),
      linear-gradient(180deg, #000000 0%, #001122 50%, #000000 100%);
    background-attachment: fixed;
    
    /* Simplified grid overlay - no heavy animations */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 48px,
          rgba(0, 255, 255, 0.02) 50px,
          rgba(0, 255, 255, 0.02) 52px
        );
      pointer-events: none;
      z-index: -1;
    }
    
    /* Moderate cyber design */
    *:not(.chart-container):not(.chart-container *):not(.vega-embed):not(.vega-embed *):not([data-chart-type]):not([data-chart-type] *):not([class*="Chart"]):not([class*="Chart"] *):not([class*="chart"]):not([class*="chart"] *) {
      border-radius: 4px !important;
      transition: all 0.2s ease;
    }
    
    /* Chart containers - preserve functionality with subtle theming */
    .chart-container,
    .vega-embed,
    [class*="vega"],
    .chart-preview,
    .chart-wrapper,
    [data-chart-type],
    [class*="Chart"]:not(.theme-panel),
    [class*="chart"]:not(.theme-panel) {
      background: rgba(0, 20, 40, 0.85) !important;
      border: 1px solid rgba(0, 255, 255, 0.3) !important;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.1) !important;
      transform: none !important;
      animation: none !important;
      position: relative !important;
      overflow: visible !important;
      font-family: inherit !important;
      border-radius: 4px !important;
      
      canvas, svg {
        background: transparent !important;
        transform: none !important;
        max-width: 100% !important;
        height: auto !important;
        font-family: inherit !important;
      }
      
      /* Preserve text in charts */
      text, tspan {
        font-family: inherit !important;
        transform: none !important;
      }
      
      &:hover {
        border-color: rgba(0, 255, 255, 0.5) !important;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.2) !important;
        transform: none !important;
      }
    }
    
    /* Balanced glow effects for non-chart elements */
    .MuiPaper-root:not(.chart-container):not([class*="vega"]):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]), 
    .MuiCard-root:not(.chart-container):not([class*="vega"]):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]) {
      background: rgba(0, 20, 40, 0.8) !important;
      border: 1px solid rgba(0, 255, 255, 0.4) !important;
      box-shadow: 
        0 0 15px rgba(0, 255, 255, 0.2),
        inset 0 0 10px rgba(0, 255, 255, 0.05) !important;
      
      &:hover {
        border-color: rgba(0, 255, 255, 0.6) !important;
        box-shadow: 
          0 0 20px rgba(0, 255, 255, 0.3),
          inset 0 0 15px rgba(0, 255, 255, 0.08) !important;
      }
    }
    
    .MuiButton-root:not(.chart-container .MuiButton-root):not([data-chart-type] .MuiButton-root):not([class*="Chart"] .MuiButton-root):not([class*="chart"] .MuiButton-root) {
      background: rgba(0, 20, 40, 0.7) !important;
      border: 1px solid rgba(0, 255, 255, 0.5) !important;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.2) !important;
      color: #ffffff !important;
      
      &:hover {
        border-color: rgba(0, 255, 255, 0.8) !important;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.4) !important;
        background: rgba(0, 40, 80, 0.8) !important;
      }
    }
    
    /* Balanced text glow effects - exclude chart text */
    h1:not(.chart-container h1):not([data-chart-type] h1):not([class*="Chart"] h1):not([class*="chart"] h1), 
    h2:not(.chart-container h2):not([data-chart-type] h2):not([class*="Chart"] h2):not([class*="chart"] h2), 
    h3:not(.chart-container h3):not([data-chart-type] h3):not([class*="Chart"] h3):not([class*="chart"] h3) {
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
      font-family: "Orbitron", monospace !important;
      letter-spacing: 1px;
    }
    
    h4:not(.chart-container h4):not([data-chart-type] h4):not([class*="Chart"] h4):not([class*="chart"] h4), 
    h5:not(.chart-container h5):not([data-chart-type] h5):not([class*="Chart"] h5):not([class*="chart"] h5), 
    h6:not(.chart-container h6):not([data-chart-type] h6):not([class*="Chart"] h6):not([class*="chart"] h6) {
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.4);
      font-family: "JetBrains Mono", monospace !important;
    }
    
    /* Cyber input fields with better readability */
    input:not(.chart-container input):not([data-chart-type] input):not([class*="Chart"] input):not([class*="chart"] input), 
    textarea:not(.chart-container textarea):not([data-chart-type] textarea):not([class*="Chart"] textarea):not([class*="chart"] textarea), 
    select:not(.chart-container select):not([data-chart-type] select):not([class*="Chart"] select):not([class*="chart"] select) {
      background: rgba(0, 0, 0, 0.8) !important;
      border: 1px solid rgba(0, 255, 255, 0.4) !important;
      color: #ffffff !important;
      font-size: 1rem !important; /* Ensure readable size */
      
      &:focus {
        border-color: rgba(0, 255, 255, 0.8) !important;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important;
      }
    }
    
    /* Simplified scrollbars */
    ::-webkit-scrollbar {
      width: 10px;
      background: rgba(0, 0, 0, 0.8);
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #00ffff, #0080ff);
      border-radius: 2px;
      
      &:hover {
        background: linear-gradient(180deg, #ff0080, #ff0040);
      }
    }
  }
  
  /* Material 3 theme - Google's dynamic design */
  body.material3-theme {
    background: linear-gradient(135deg, #fffbfe 0%, #f7f2fa 50%, #f3edf7 100%);
    
    /* Material 3 rounded corners everywhere - exclude charts */
    *:not(.chart-container):not(.chart-container *):not(.vega-embed):not(.vega-embed *):not([data-chart-type]):not([data-chart-type] *):not([class*="Chart"]):not([class*="Chart"] *):not([class*="chart"]):not([class*="chart"] *) {
      border-radius: var(--border-radius-lg) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Chart containers preserve default styling */
    .chart-container,
    .vega-embed,
    [class*="vega"],
    .chart-preview,
    .chart-wrapper,
    [data-chart-type],
    [class*="Chart"]:not(.theme-panel),
    [class*="chart"]:not(.theme-panel) {
      background: #fffbfe !important;
      border: 1px solid #cac4d0 !important;
      border-radius: 16px !important;
      transform: none !important;
      animation: none !important;
      font-family: inherit !important;
      
      canvas, svg {
        background: transparent !important;
        transform: none !important;
        font-family: inherit !important;
      }
      
      text, tspan {
        font-family: inherit !important;
        transform: none !important;
      }
    }
    
    /* Material You color surfaces - exclude charts */
    .MuiPaper-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]), 
    .MuiCard-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]) {
      background: #fffbfe !important;
      border: 1px solid #cac4d0 !important;
      box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24) !important;
      
      &:hover {
        box-shadow: 
          0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23) !important;
        transform: translateY(-2px);
      }
    }
    
    /* Material 3 buttons with state layers - exclude chart buttons */
    .MuiButton-root:not(.chart-container .MuiButton-root):not([data-chart-type] .MuiButton-root):not([class*="Chart"] .MuiButton-root):not([class*="chart"] .MuiButton-root) {
      background: #eaddff !important;
      color: #21005d !important;
      font-weight: 500 !important;
      text-transform: none !important;
      box-shadow: none !important;
      
      &:hover {
        background: #d6c7f7 !important;
        box-shadow: 
          0 1px 3px rgba(0, 0, 0, 0.12),
          0 1px 2px rgba(0, 0, 0, 0.24) !important;
      }
    }
    
    /* Material 3 typography - exclude chart text */
    h1:not(.chart-container h1):not([data-chart-type] h1):not([class*="Chart"] h1):not([class*="chart"] h1), 
    h2:not(.chart-container h2):not([data-chart-type] h2):not([class*="Chart"] h2):not([class*="chart"] h2), 
    h3:not(.chart-container h3):not([data-chart-type] h3):not([class*="Chart"] h3):not([class*="chart"] h3), 
    h4:not(.chart-container h4):not([data-chart-type] h4):not([class*="Chart"] h4):not([class*="chart"] h4), 
    h5:not(.chart-container h5):not([data-chart-type] h5):not([class*="Chart"] h5):not([class*="chart"] h5), 
    h6:not(.chart-container h6):not([data-chart-type] h6):not([class*="Chart"] h6):not([class*="chart"] h6) {
      font-family: "Roboto Flex", "Roboto", sans-serif !important;
      font-weight: 400 !important;
      color: #1c1b1f !important;
    }
    
    /* Material 3 floating action elements */
    .MuiFab-root, .MuiSpeedDial-root {
      background: #6750a4 !important;
      color: #ffffff !important;
      box-shadow: 
        0 3px 5px -1px rgba(0, 0, 0, 0.2),
        0 6px 10px 0 rgba(0, 0, 0, 0.14),
        0 1px 18px 0 rgba(0, 0, 0, 0.12) !important;
    }
  }
  
  /* Neumorphism theme - Optimized soft design */
  body.neumorphism-theme {
    background: linear-gradient(145deg, #e0e5ec, #d6dbe2);
    
    /* Balanced soft design - exclude charts */
    *:not(.chart-container):not(.chart-container *):not(.vega-embed):not(.vega-embed *):not([data-chart-type]):not([data-chart-type] *):not([class*="Chart"]):not([class*="Chart"] *):not([class*="chart"]):not([class*="chart"] *) {
      border-radius: 16px !important;
      transition: all 0.3s ease;
    }
    
    /* Chart containers preserve default styling */
    .chart-container,
    .vega-embed,
    [class*="vega"],
    .chart-preview,
    .chart-wrapper,
    [data-chart-type],
    [class*="Chart"]:not(.theme-panel),
    [class*="chart"]:not(.theme-panel) {
      background: #e0e5ec !important;
      border: none !important;
      border-radius: 20px !important;
      box-shadow: 
        8px 8px 16px #d1d6dd,
        -8px -8px 16px #eff4fb !important;
      transform: none !important;
      animation: none !important;
      font-family: inherit !important;
      
      canvas, svg {
        background: transparent !important;
        transform: none !important;
        font-family: inherit !important;
      }
      
      text, tspan {
        font-family: inherit !important;
        transform: none !important;
      }
    }
    
    /* Optimized neumorphic shadows - exclude charts */
    .MuiPaper-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]), 
    .MuiCard-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]) {
      background: #e0e5ec !important;
      border: none !important;
      box-shadow: 
        8px 8px 16px #d1d6dd,
        -8px -8px 16px #eff4fb !important;
      
      &:hover {
        box-shadow: 
          10px 10px 20px #d1d6dd,
          -10px -10px 20px #eff4fb !important;
        transform: translateY(-1px);
      }
    }
    
    /* Balanced neumorphic buttons - exclude chart buttons */
    .MuiButton-root:not(.chart-container .MuiButton-root):not([data-chart-type] .MuiButton-root):not([class*="Chart"] .MuiButton-root):not([class*="chart"] .MuiButton-root) {
      background: #e0e5ec !important;
      color: #2d3748 !important;
      border: none !important;
      box-shadow: 
        6px 6px 12px #d1d6dd,
        -6px -6px 12px #eff4fb !important;
      font-size: 1rem !important; /* Ensure readable size */
      
      &:hover {
        box-shadow: 
          3px 3px 6px #d1d6dd,
          -3px -3px 6px #eff4fb !important;
      }
      
      &:active {
        box-shadow: 
          inset 3px 3px 6px #d1d6dd,
          inset -3px -3px 6px #eff4fb !important;
      }
    }
    
    /* Optimized input fields - exclude chart inputs */
    input:not(.chart-container input):not([data-chart-type] input):not([class*="Chart"] input):not([class*="chart"] input), 
    textarea:not(.chart-container textarea):not([data-chart-type] textarea):not([class*="Chart"] textarea):not([class*="chart"] textarea), 
    select:not(.chart-container select):not([data-chart-type] select):not([class*="Chart"] select):not([class*="chart"] select) {
      background: #e0e5ec !important;
      border: none !important;
      box-shadow: 
        inset 4px 4px 8px #d1d6dd,
        inset -4px -4px 8px #eff4fb !important;
      font-size: 1rem !important; /* Ensure readable size */
      
      &:focus {
        box-shadow: 
          inset 6px 6px 12px #d1d6dd,
          inset -6px -6px 12px #eff4fb !important;
      }
    }
    
    /* Readable typography - exclude chart text */
    h1:not(.chart-container h1):not([data-chart-type] h1):not([class*="Chart"] h1):not([class*="chart"] h1), 
    h2:not(.chart-container h2):not([data-chart-type] h2):not([class*="Chart"] h2):not([class*="chart"] h2), 
    h3:not(.chart-container h3):not([data-chart-type] h3):not([class*="Chart"] h3):not([class*="chart"] h3), 
    h4:not(.chart-container h4):not([data-chart-type] h4):not([class*="Chart"] h4):not([class*="chart"] h4), 
    h5:not(.chart-container h5):not([data-chart-type] h5):not([class*="Chart"] h5):not([class*="chart"] h5), 
    h6:not(.chart-container h6):not([data-chart-type] h6):not([class*="Chart"] h6):not([class*="chart"] h6) {
      font-family: "Nunito", sans-serif !important;
      font-weight: 600 !important;
      color: #2d3748 !important;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
    }
  }
  
  /* Retro theme - Optimized vintage design */
  body.retro-theme {
    background: 
      radial-gradient(circle at 20% 80%, rgba(210, 105, 30, 0.08) 0%, transparent 50%),
      linear-gradient(135deg, #f5deb3 0%, #faebd7 50%, #f0e68c 100%);
    background-attachment: fixed;
    
    /* Subtle film grain effect - no heavy animations */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle, transparent 1px, rgba(139, 69, 19, 0.01) 1px);
      background-size: 3px 3px;
      pointer-events: none;
      z-index: -1;
      opacity: 0.7;
    }
    
    /* Balanced vintage rounded corners - exclude charts */
    *:not(.chart-container):not(.chart-container *):not(.vega-embed):not(.vega-embed *):not([data-chart-type]):not([data-chart-type] *):not([class*="Chart"]):not([class*="Chart"] *):not([class*="chart"]):not([class*="chart"] *) {
      border-radius: 8px !important;
      transition: all 0.3s ease;
    }
    
    /* Chart containers preserve default styling */
    .chart-container,
    .vega-embed,
    [class*="vega"],
    .chart-preview,
    .chart-wrapper,
    [data-chart-type],
    [class*="Chart"]:not(.theme-panel),
    [class*="chart"]:not(.theme-panel) {
      background: 
        linear-gradient(135deg, #faebd7 0%, #f0e68c 100%) !important;
      border: 1px solid #d2b48c !important;
      border-radius: 8px !important;
      box-shadow: 
        0 3px 6px rgba(139, 69, 19, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
      transform: none !important;
      animation: none !important;
      font-family: inherit !important;
      filter: none !important; /* Disable sepia filter for charts */
      
      canvas, svg {
        background: transparent !important;
        transform: none !important;
        font-family: inherit !important;
      }
      
      text, tspan {
        font-family: inherit !important;
        transform: none !important;
      }
    }
    
    /* Optimized vintage surfaces - exclude charts */
    .MuiPaper-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]), 
    .MuiCard-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]) {
      background: 
        linear-gradient(135deg, #faebd7 0%, #f0e68c 100%) !important;
      border: 1px solid #d2b48c !important;
      box-shadow: 
        0 3px 6px rgba(139, 69, 19, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
      
      &:hover {
        background: 
          linear-gradient(135deg, #f0e68c 0%, #daa520 100%) !important;
        box-shadow: 
          0 4px 8px rgba(139, 69, 19, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
      }
    }
    
    /* Balanced vintage buttons - exclude chart buttons */
    .MuiButton-root:not(.chart-container .MuiButton-root):not([data-chart-type] .MuiButton-root):not([class*="Chart"] .MuiButton-root):not([class*="chart"] .MuiButton-root) {
      background: 
        linear-gradient(135deg, #daa520 0%, #cd853f 100%) !important;
      color: #2f1b14 !important;
      border: 1px solid #8b4513 !important;
      box-shadow: 
        0 2px 4px rgba(139, 69, 19, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
      font-family: "Georgia", serif !important;
      font-weight: 600 !important;
      font-size: 1rem !important; /* Ensure readable size */
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.2);
      
      &:hover {
        background: 
          linear-gradient(135deg, #cd853f 0%, #a0522d 100%) !important;
        box-shadow: 
          0 3px 6px rgba(139, 69, 19, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
      }
    }
    
    /* Optimized vintage input fields - exclude chart inputs */
    input:not(.chart-container input):not([data-chart-type] input):not([class*="Chart"] input):not([class*="chart"] input), 
    textarea:not(.chart-container textarea):not([data-chart-type] textarea):not([class*="Chart"] textarea):not([class*="chart"] textarea), 
    select:not(.chart-container select):not([data-chart-type] select):not([class*="Chart"] select):not([class*="chart"] select) {
      background: 
        linear-gradient(135deg, #faebd7 0%, #f5deb3 100%) !important;
      border: 1px solid #d2b48c !important;
      color: #2f1b14 !important;
      font-family: "Georgia", serif !important;
      font-size: 1rem !important; /* Ensure readable size */
      box-shadow: 
        inset 1px 1px 2px rgba(139, 69, 19, 0.1) !important;
      
      &:focus {
        border-color: #cd853f !important;
        box-shadow: 
          0 0 0 2px rgba(205, 133, 63, 0.2),
          inset 1px 1px 2px rgba(139, 69, 19, 0.15) !important;
      }
    }
    
    /* Balanced vintage typography - exclude chart text */
    h1:not(.chart-container h1):not([data-chart-type] h1):not([class*="Chart"] h1):not([class*="chart"] h1), 
    h2:not(.chart-container h2):not([data-chart-type] h2):not([class*="Chart"] h2):not([class*="chart"] h2), 
    h3:not(.chart-container h3):not([data-chart-type] h3):not([class*="Chart"] h3):not([class*="chart"] h3), 
    h4:not(.chart-container h4):not([data-chart-type] h4):not([class*="Chart"] h4):not([class*="chart"] h4), 
    h5:not(.chart-container h5):not([data-chart-type] h5):not([class*="Chart"] h5):not([class*="chart"] h5), 
    h6:not(.chart-container h6):not([data-chart-type] h6):not([class*="Chart"] h6):not([class*="chart"] h6) {
      font-family: "Georgia", "Times New Roman", serif !important;
      font-weight: 600 !important; /* Reduced from 700 */
      color: #2f1b14 !important;
      text-shadow: 
        1px 1px 2px rgba(255, 255, 255, 0.6),
        1px 1px 3px rgba(139, 69, 19, 0.1);
    }
    
    /* Balanced scrollbars */
    ::-webkit-scrollbar {
      width: 12px;
      background: linear-gradient(135deg, #faebd7, #f0e68c);
      border: 1px solid #d2b48c;
      border-radius: 6px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #daa520, #cd853f);
      border: 1px solid #8b4513;
      border-radius: 6px;
      
      &:hover {
        background: linear-gradient(135deg, #cd853f, #a0522d);
      }
    }
    
    /* Subtle sepia filter - less aggressive, exclude charts */
    img:not(.chart-container img):not([data-chart-type] img):not([class*="Chart"] img):not([class*="chart"] img) {
      filter: sepia(0.1) contrast(1.05) brightness(1.02);
    }
    
    /* Explicitly disable sepia for chart SVGs and canvas */
    .chart-container canvas, 
    .chart-container svg,
    [data-chart-type] canvas,
    [data-chart-type] svg,
    [class*="Chart"] canvas,
    [class*="Chart"] svg,
    [class*="chart"] canvas,
    [class*="chart"] svg {
      filter: none !important;
    }
  }
  
  /* Brutalist theme - Balanced industrial design */
  body.brutalist-theme {
    background: 
      linear-gradient(45deg, #ffffff 25%, transparent 25%),
      linear-gradient(-45deg, #ffffff 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ffffff 75%),
      linear-gradient(-45deg, transparent 75%, #ffffff 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    
    /* No rounded corners - pure brutalism, exclude charts */
    *:not(.chart-container):not(.chart-container *):not(.vega-embed):not(.vega-embed *):not([data-chart-type]):not([data-chart-type] *):not([class*="Chart"]):not([class*="Chart"] *):not([class*="chart"]):not([class*="chart"] *) {
      border-radius: 0px !important;
      transition: all 0.1s ease;
    }
    
    /* Chart containers preserve default styling */
    .chart-container,
    .vega-embed,
    [class*="vega"],
    .chart-preview,
    .chart-wrapper,
    [data-chart-type],
    [class*="Chart"]:not(.theme-panel),
    [class*="chart"]:not(.theme-panel) {
      background: #ffffff !important;
      border: 2px solid #000000 !important;
      border-radius: 0px !important;
      box-shadow: 6px 6px 0px #000000 !important;
      transform: none !important;
      animation: none !important;
      font-family: inherit !important;
      
      canvas, svg {
        background: transparent !important;
        transform: none !important;
        font-family: inherit !important;
      }
      
      text, tspan {
        font-family: inherit !important;
        transform: none !important;
      }
    }
    
    /* Bold, angular shadows - exclude charts */
    .MuiPaper-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]), 
    .MuiCard-root:not(.chart-container):not([data-chart-type]):not([class*="Chart"]):not([class*="chart"]) {
      background: #ffffff !important;
      border: 2px solid #000000 !important;
      box-shadow: 6px 6px 0px #000000 !important;
      
      &:hover {
        box-shadow: 8px 8px 0px #000000 !important;
        transform: translate(-1px, -1px);
      }
    }
    
    /* Bold buttons with reasonable styling - exclude chart buttons */
    .MuiButton-root:not(.chart-container .MuiButton-root):not([data-chart-type] .MuiButton-root):not([class*="Chart"] .MuiButton-root):not([class*="chart"] .MuiButton-root) {
      background: #ffffff !important;
      color: #000000 !important;
      border: 2px solid #000000 !important;
      box-shadow: 3px 3px 0px #000000 !important;
      font-weight: 700 !important;
      font-size: 1rem !important; /* Ensure readable size */
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      
      &:hover {
        background: #f0f0f0 !important;
        box-shadow: 4px 4px 0px #000000 !important;
        transform: translate(-1px, -1px);
      }
      
      &:active {
        box-shadow: 1px 1px 0px #000000 !important;
        transform: translate(2px, 2px);
      }
    }
    
    /* Bold input fields - exclude chart inputs */
    input:not(.chart-container input):not([data-chart-type] input):not([class*="Chart"] input):not([class*="chart"] input), 
    textarea:not(.chart-container textarea):not([data-chart-type] textarea):not([class*="Chart"] textarea):not([class*="chart"] textarea), 
    select:not(.chart-container select):not([data-chart-type] select):not([class*="Chart"] select):not([class*="chart"] select) {
      background: #ffffff !important;
      border: 2px solid #000000 !important;
      color: #000000 !important;
      font-weight: 600 !important;
      font-size: 1rem !important; /* Ensure readable size */
      
      &:focus {
        border-color: #333333 !important;
        box-shadow: 0 0 0 2px #333333 !important;
      }
    }
    
    /* Bold, impactful typography - exclude chart text */
    h1:not(.chart-container h1):not([data-chart-type] h1):not([class*="Chart"] h1):not([class*="chart"] h1), 
    h2:not(.chart-container h2):not([data-chart-type] h2):not([class*="Chart"] h2):not([class*="chart"] h2), 
    h3:not(.chart-container h3):not([data-chart-type] h3):not([class*="Chart"] h3):not([class*="chart"] h3), 
    h4:not(.chart-container h4):not([data-chart-type] h4):not([class*="Chart"] h4):not([class*="chart"] h4), 
    h5:not(.chart-container h5):not([data-chart-type] h5):not([class*="Chart"] h5):not([class*="chart"] h5), 
    h6:not(.chart-container h6):not([data-chart-type] h6):not([class*="Chart"] h6):not([class*="chart"] h6) {
      font-family: "Arial Black", "Impact", sans-serif !important;
      font-weight: 900 !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      color: #000000 !important;
      text-shadow: 2px 2px 0px #ffffff;
    }
    
    /* Bold scrollbars */
    ::-webkit-scrollbar {
      width: 14px;
      background: #ffffff;
      border: 2px solid #000000;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #000000;
      border: 1px solid #ffffff;
      
      &:hover {
        background: #333333;
      }
    }
  }

  /* Enhanced animations for all themes - Simplified and optimized */
  @keyframes fluentFloat {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-2px);
    }
  }
  
  /* Removed heavy animations: cyberPulse, neonPulse, neonScan, retroWave, vintageFlicker */
  /* These were causing performance issues and have been replaced with more subtle effects */

  /* Enhanced focus styles for all themes */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => {
      const mode = theme?.mode;
      if (mode === 'neon') return 'rgba(0, 245, 255, 0.8)';
      if (mode === 'fluent') return 'rgba(0, 120, 212, 0.6)';
      if (mode === 'material3') return 'rgba(103, 80, 164, 0.6)';
      if (mode === 'neumorphism') return 'rgba(102, 126, 234, 0.5)';
      if (mode === 'brutalist') return '#ff0000';
      if (mode === 'retro') return 'rgba(210, 105, 30, 0.7)';
      return mode === 'dark' ? 'rgba(144, 202, 249, 0.6)' : 'rgba(25, 118, 210, 0.4)';
    }};
    outline-offset: 2px;
    border-radius: ${({ theme }) => {
      const mode = theme?.mode;
      if (mode === 'brutalist') return '0px';
      if (mode === 'neumorphism') return '8px';
      return '4px';
    }};
  }

  /* Enhanced selection styles */
  ::selection {
    background-color: ${({ theme }) => {
      const mode = theme?.mode;
      if (mode === 'neon') return 'rgba(0, 245, 255, 0.3)';
      if (mode === 'fluent') return 'rgba(0, 120, 212, 0.3)';
      if (mode === 'material3') return 'rgba(103, 80, 164, 0.3)';
      if (mode === 'neumorphism') return 'rgba(102, 126, 234, 0.3)';
      if (mode === 'brutalist') return '#ffff00';
      if (mode === 'retro') return 'rgba(210, 105, 30, 0.3)';
      return mode === 'dark' ? 'rgba(144, 202, 249, 0.3)' : 'rgba(25, 118, 210, 0.3)';
    }};
    color: ${({ theme }) => {
      const mode = theme?.mode;
      if (mode === 'neon') return '#000000';
      if (mode === 'brutalist') return '#000000';
      return mode === 'dark' ? '#ffffff' : '#000000';
    }};
  }

  /* Fix select dropdown behavior across all themes */
  select {
    /* Ensure dropdowns are not affected by theme pointer-events */
    pointer-events: auto !important;
    
    /* Ensure proper z-index for dropdowns */
    &:focus {
      position: relative;
      z-index: 9999 !important;
    }
    
    /* Prevent theme-specific transforms from affecting dropdowns */
    transform: none !important;
    
    /* Disable any backdrop effects that might interfere */
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    
    /* Ensure dropdown options are properly styled */
    option {
      background: var(--color-surface) !important;
      color: var(--color-text-primary) !important;
      padding: 8px 12px !important;
      border: none !important;
      outline: none !important;
      /* Override any theme-specific option styling */
      transform: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: none !important;
      pointer-events: auto !important;
    }
    
    /* Ensure optgroup labels are readable */
    optgroup {
      background: var(--color-surface) !important;
      color: var(--color-text-secondary) !important;
      font-weight: 600 !important;
      font-size: 0.9rem !important;
      pointer-events: auto !important;
    }
  }

  /* Critical: Override ALL theme-specific effects for dropdowns and encoding panels */
  .encoding-panel select,
  .visual-editor select,
  .chart-editor select,
  .MuiSelect-root,
  .MuiSelect-select,
  .encoding-controls select,
  .DroppableEncodingControl select,
  .EncodingOptionSelect,
  select[class*="encoding"],
  select[class*="Encoding"],
  [class*="encoding"] select,
  [class*="Encoding"] select {
    /* Force normal behavior */
    position: relative !important;
    z-index: 9999 !important;
    pointer-events: auto !important;
    transform: none !important;
    animation: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: none !important;
    
    /* Ensure proper styling */
    background: var(--color-surface) !important;
    color: var(--color-text-primary) !important;
    border: 1px solid var(--color-border) !important;
    border-radius: 4px !important;
    font-family: inherit !important;
    
    /* Ensure dropdown stays open when focused */
    &:focus,
    &:focus-visible,
    &:focus-within {
      z-index: 99999 !important;
      position: relative !important;
      outline: none !important;
      border-color: var(--color-primary) !important;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2) !important;
    }
    
    /* Force option styling */
    option {
      background: var(--color-surface) !important;
      color: var(--color-text-primary) !important;
      padding: 8px 12px !important;
      border: none !important;
      outline: none !important;
      transform: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: none !important;
      pointer-events: auto !important;
      position: relative !important;
      z-index: 99999 !important;
    }
    
    optgroup {
      background: var(--color-surface) !important;
      color: var(--color-text-secondary) !important;
      font-weight: 600 !important;
      font-size: 0.9rem !important;
      pointer-events: auto !important;
      position: relative !important;
      z-index: 99999 !important;
    }
  }

  /* Override theme effects specifically for dropdown containers */
  .DroppableEncodingControl,
  .encoding-panel,
  .visual-editor,
  .chart-editor,
  [class*="encoding"],
  [class*="Encoding"] {
    /* Ensure dropdowns aren't affected by container effects */
    select {
      isolation: isolate !important;
      contain: none !important;
      
      /* Override any parent transforms or filters */
      &:focus {
        transform: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
    }
  }

  /* Theme-specific dropdown overrides */
  body.fluent-theme .encoding-panel select,
  body.fluent-theme .visual-editor select,
  body.fluent-theme [class*="encoding"] select,
  body.fluent-theme [class*="Encoding"] select {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
  }

  body.neon-theme .encoding-panel select,
  body.neon-theme .visual-editor select,
  body.neon-theme [class*="encoding"] select,
  body.neon-theme [class*="Encoding"] select {
    background: rgba(0, 0, 0, 0.9) !important;
    border: 1px solid rgba(0, 245, 255, 0.3) !important;
    color: #ffffff !important;
    
    option {
      background: rgba(0, 0, 0, 0.95) !important;
      color: #ffffff !important;
    }
  }

  body.neumorphism-theme .encoding-panel select,
  body.neumorphism-theme .visual-editor select,
  body.neumorphism-theme [class*="encoding"] select,
  body.neumorphism-theme [class*="Encoding"] select {
    background: #e0e5ec !important;
    border: none !important;
    box-shadow: inset 2px 2px 4px #d1d6dd, inset -2px -2px 4px #eff4fb !important;
  }

  body.brutalist-theme .encoding-panel select,
  body.brutalist-theme .visual-editor select,
  body.brutalist-theme [class*="encoding"] select,
  body.brutalist-theme [class*="Encoding"] select {
    background: #ffffff !important;
    border: 2px solid #000000 !important;
    border-radius: 0px !important;
    color: #000000 !important;
    
    option {
      background: #ffffff !important;
      color: #000000 !important;
    }
  }

  body.retro-theme .encoding-panel select,
  body.retro-theme .visual-editor select,
  body.retro-theme [class*="encoding"] select,
  body.retro-theme [class*="Encoding"] select {
    background: linear-gradient(135deg, #faebd7, #f5deb3) !important;
    border: 1px solid #d2b48c !important;
    color: #2f1b14 !important;
    
    option {
      background: #faebd7 !important;
      color: #2f1b14 !important;
    }
  }

  body.material3-theme .encoding-panel select,
  body.material3-theme .visual-editor select,
  body.material3-theme [class*="encoding"] select,
  body.material3-theme [class*="Encoding"] select {
    background: #fffbfe !important;
    border: 1px solid #79747e !important;
    border-radius: 8px !important;
    color: #1c1b1f !important;
    
    option {
      background: #fffbfe !important;
      color: #1c1b1f !important;
    }
  }

  /* CRITICAL: Create complete isolation for dropdowns from all theme effects */
  
  /* Disable theme container effects for all dropdown parent elements */
  .DroppableEncodingControl:has(select:focus),
  .encoding-panel:has(select:focus),
  .visual-editor:has(select:focus),
  .chart-editor:has(select:focus),
  [class*="encoding"]:has(select:focus),
  [class*="Encoding"]:has(select:focus) {
    transform: none !important;
    animation: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    transition: none !important;
    will-change: auto !important;
    contain: none !important;
    isolation: auto !important;
    pointer-events: auto !important;
    overflow: visible !important;
  }

  /* Alternative approach for browsers that don't support :has() */
  .dropdown-active .DroppableEncodingControl,
  .dropdown-active .encoding-panel,
  .dropdown-active .visual-editor,
  .dropdown-active .chart-editor,
  .dropdown-active [class*="encoding"],
  .dropdown-active [class*="Encoding"] {
    transform: none !important;
    animation: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    transition: none !important;
    will-change: auto !important;
    contain: none !important;
    isolation: auto !important;
    pointer-events: auto !important;
    overflow: visible !important;
  }

  /* SIMPLE AND DIRECT: Disable ALL theme effects when dropdown is active */
  body.dropdown-open {
    /* Disable all pseudo-elements that might interfere */
    *::before,
    *::after {
      display: none !important;
    }
    
    /* Disable all transforms, filters, and effects */
    * {
      transform: none !important;
      animation: none !important;
      filter: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
      will-change: auto !important;
      contain: none !important;
    }
    
    /* Force all select elements to work normally */
    select {
      all: revert !important;
      position: relative !important;
      z-index: 999999 !important;
      background: var(--color-surface) !important;
      color: var(--color-text-primary) !important;
      border: 1px solid var(--color-border) !important;
      border-radius: 4px !important;
      padding: 8px 12px !important;
      font-family: inherit !important;
      font-size: inherit !important;
      pointer-events: auto !important;
      
      &:focus {
        border-color: var(--color-primary) !important;
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2) !important;
      }
      
      option {
        background: var(--color-surface) !important;
        color: var(--color-text-primary) !important;
        padding: 8px 12px !important;
        pointer-events: auto !important;
      }
    }
  }

  /* Ensure dropdowns are rendered above all theme effects */
  select:focus,
  select:focus-within {
    /* Create new stacking context */
    position: relative !important;
    z-index: 999999 !important;
    
    /* Disable all effects that could interfere */
    transform: none !important;
    animation: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    will-change: auto !important;
    contain: none !important;
    isolation: isolate !important;
    
    /* Force native dropdown behavior */
    appearance: auto !important;
    -webkit-appearance: auto !important;
    -moz-appearance: auto !important;
  }

  /* CRITICAL: Override any ::before or ::after pseudo-elements that might interfere */
  .DroppableEncodingControl::before,
  .DroppableEncodingControl::after,
  .encoding-panel::before,
  .encoding-panel::after,
  .visual-editor::before,
  .visual-editor::after,
  [class*="encoding"]::before,
  [class*="encoding"]::after,
  [class*="Encoding"]::before,
  [class*="Encoding"]::after {
    /* When a select is focused, disable pseudo-elements that might interfere */
    body:has(select:focus) & {
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -1 !important;
    }
  }

  /* Alternative for browsers that don't support :has() - use a class */
  body.dropdown-open .DroppableEncodingControl::before,
  body.dropdown-open .DroppableEncodingControl::after,
  body.dropdown-open .encoding-panel::before,
  body.dropdown-open .encoding-panel::after,
  body.dropdown-open .visual-editor::before,
  body.dropdown-open .visual-editor::after,
  body.dropdown-open [class*="encoding"]::before,
  body.dropdown-open [class*="encoding"]::after,
  body.dropdown-open [class*="Encoding"]::before,
  body.dropdown-open [class*="Encoding"]::after {
    display: none !important;
  }

  /* Force all select elements to use system styling when focused to avoid any custom interference */
  select:focus {
    /* Completely override any custom styling when focused */
    all: revert !important;
    position: relative !important;
    z-index: 999999 !important;
    background: var(--color-surface) !important;
    color: var(--color-text-primary) !important;
    border: 1px solid var(--color-primary) !important;
    border-radius: 4px !important;
    padding: 8px 12px !important;
    font-family: inherit !important;
    font-size: inherit !important;
    
    /* Ensure options are properly styled */
    option {
      background: var(--color-surface) !important;
      color: var(--color-text-primary) !important;
      padding: 8px 12px !important;
    }
  }

  /* Proper icon sizing across all themes */
  .MuiSvgIcon-root,
  .MuiIcon-root,
  svg[class*="icon"],
  [class*="icon"] svg,
  .icon,
  .material-icons,
  .material-icons-outlined,
  .material-icons-round,
  .material-icons-sharp,
  .material-icons-two-tone {
    /* Ensure icons maintain proper sizes regardless of theme font-size */
    font-size: 1.25rem !important; /* 20px default */
    width: 1.25rem !important;
    height: 1.25rem !important;
    
    /* Size variants */
    &.MuiSvgIcon-fontSizeSmall,
    &[class*="small"] {
      font-size: 1rem !important; /* 16px */
      width: 1rem !important;
      height: 1rem !important;
    }
    
    &.MuiSvgIcon-fontSizeLarge,
    &[class*="large"] {
      font-size: 1.75rem !important; /* 28px */
      width: 1.75rem !important;
      height: 1.75rem !important;
    }
    
    &.MuiSvgIcon-fontSizeInherit {
      font-size: inherit !important;
      width: 1em !important;
      height: 1em !important;
    }
  }

  /* Specific button icon sizing */
  .MuiButton-root .MuiSvgIcon-root,
  .MuiIconButton-root .MuiSvgIcon-root,
  .MuiToggleButton-root .MuiSvgIcon-root {
    font-size: 1.25rem !important;
    width: 1.25rem !important;
    height: 1.25rem !important;
  }

  /* App bar and navigation icon sizing */
  .MuiAppBar-root .MuiSvgIcon-root,
  .MuiToolbar-root .MuiSvgIcon-root,
  nav .MuiSvgIcon-root {
    font-size: 1.5rem !important; /* 24px for nav */
    width: 1.5rem !important;
    height: 1.5rem !important;
  }

  /* Chart and data visualization icon sizing */
  .chart-container .MuiSvgIcon-root,
  .vega-embed .MuiSvgIcon-root,
  .chart-controls .MuiSvgIcon-root {
    font-size: 1.125rem !important; /* 18px for charts */
    width: 1.125rem !important;
    height: 1.125rem !important;
  }

  /* Theme selector icon sizing */
  .theme-selector .MuiSvgIcon-root,
  .MuiToggleButtonGroup-root .MuiSvgIcon-root {
    font-size: 1.375rem !important; /* 22px for theme selector */
    width: 1.375rem !important;
    height: 1.375rem !important;
  }

  /* Menu and dropdown icon sizing */
  .MuiMenu-root .MuiSvgIcon-root,
  .MuiMenuItem-root .MuiSvgIcon-root,
  .MuiSelect-root .MuiSvgIcon-root {
    font-size: 1.125rem !important; /* 18px for menus */
    width: 1.125rem !important;
    height: 1.125rem !important;
  }

  /* FAB and prominent action icon sizing */
  .MuiFab-root .MuiSvgIcon-root,
  .MuiSpeedDial-root .MuiSvgIcon-root {
    font-size: 1.5rem !important; /* 24px for FABs */
    width: 1.5rem !important;
    height: 1.5rem !important;
  }

  /* Theme-specific icon adjustments */
  body.neon-theme {
    .MuiSvgIcon-root,
    .MuiIcon-root {
      /* Maintain icon sizes even with smaller base font */
      font-size: 1.25rem !important;
      width: 1.25rem !important;
      height: 1.25rem !important;
      
      /* Add subtle glow to neon icons */
      filter: drop-shadow(0 0 4px rgba(0, 255, 255, 0.3));
      
      &:hover {
        filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.6));
      }
    }
  }

  body.brutalist-theme {
    .MuiSvgIcon-root,
    .MuiIcon-root {
      /* Maintain icon sizes even with compact font settings */
      font-size: 1.25rem !important;
      width: 1.25rem !important;
      height: 1.25rem !important;
      
      /* Bold icon appearance for brutalist theme */
      stroke-width: 2px;
      font-weight: bold;
    }
  }

  body.fluent-theme {
    .MuiSvgIcon-root,
    .MuiIcon-root {
      /* Slightly larger icons for glassmorphism theme */
      font-size: 1.375rem !important;
      width: 1.375rem !important;
      height: 1.375rem !important;
      
      /* Subtle transparency for glass effect */
      opacity: 0.9;
    }
  }

  body.neumorphism-theme {
    .MuiSvgIcon-root,
    .MuiIcon-root {
      /* Soft icon appearance */
      font-size: 1.25rem !important;
      width: 1.25rem !important;
      height: 1.25rem !important;
      
      /* Soft shadow for neumorphic icons */
      filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
    }
  }

  body.retro-theme {
    .MuiSvgIcon-root,
    .MuiIcon-root {
      /* Slightly vintage sizing */
      font-size: 1.25rem !important;
      width: 1.25rem !important;
      height: 1.25rem !important;
      
      /* Vintage sepia effect */
      filter: sepia(0.2) contrast(1.1);
    }
  }

  body.material3-theme {
    .MuiSvgIcon-root,
    .MuiIcon-root {
      /* Material 3 icon sizing */
      font-size: 1.25rem !important;
      width: 1.25rem !important;
      height: 1.25rem !important;
    }
  }

  /* Print styles */
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
    
    body::before {
      display: none !important;
    }
  }

  /* Custom component styles */
  .transformed-badge {
    background-color: ${({ theme }) => getThemeMode(theme) === 'light' ? '#f0f4c3' : '#2c3308'} !important;
    color: ${({ theme }) => getThemeMode(theme) === 'light' ? '#33691e' : '#c5e1a5'} !important;
  }

  /* Critical: Preserve chart text rendering across all themes */
  .chart-container text,
  .chart-container tspan,
  .vega-embed text,
  .vega-embed tspan,
  [data-chart-type] text,
  [data-chart-type] tspan,
  [class*="Chart"] text,
  [class*="Chart"] tspan,
  [class*="chart"] text,
  [class*="chart"] tspan,
  .vega-bind text,
  .vega-bind tspan,
  svg text,
  svg tspan {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    font-weight: 400 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    text-shadow: none !important;
    filter: none !important;
    font-style: normal !important;
    
    /* Override any theme-specific font changes */
    &, * {
      font-family: inherit !important;
    }
  }

  /* Critical: Preserve chart axis and label rendering */
  .chart-container .role-axis text,
  .chart-container .role-axis-label text,
  .chart-container .role-axis-title text,
  .chart-container .role-legend text,
  .chart-container .role-legend-title text,
  .vega-embed .role-axis text,
  .vega-embed .role-axis-label text,
  .vega-embed .role-axis-title text,
  .vega-embed .role-legend text,
  .vega-embed .role-legend-title text,
  [data-chart-type] .role-axis text,
  [data-chart-type] .role-axis-label text,
  [data-chart-type] .role-axis-title text,
  [data-chart-type] .role-legend text,
  [data-chart-type] .role-legend-title text {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    font-weight: 400 !important;
    font-size: 11px !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    text-shadow: none !important;
    filter: none !important;
    font-style: normal !important;
  }

  /* Critical: Override theme-specific font changes for chart containers */
  body.neon-theme .chart-container,
  body.neon-theme .vega-embed,
  body.neon-theme [data-chart-type],
  body.neon-theme [class*="Chart"]:not(.theme-panel),
  body.neon-theme [class*="chart"]:not(.theme-panel),
  body.material3-theme .chart-container,
  body.material3-theme .vega-embed,
  body.material3-theme [data-chart-type],
  body.material3-theme [class*="Chart"]:not(.theme-panel),
  body.material3-theme [class*="chart"]:not(.theme-panel),
  body.neumorphism-theme .chart-container,
  body.neumorphism-theme .vega-embed,
  body.neumorphism-theme [data-chart-type],
  body.neumorphism-theme [class*="Chart"]:not(.theme-panel),
  body.neumorphism-theme [class*="chart"]:not(.theme-panel),
  body.brutalist-theme .chart-container,
  body.brutalist-theme .vega-embed,
  body.brutalist-theme [data-chart-type],
  body.brutalist-theme [class*="Chart"]:not(.theme-panel),
  body.brutalist-theme [class*="chart"]:not(.theme-panel),
  body.retro-theme .chart-container,
  body.retro-theme .vega-embed,
  body.retro-theme [data-chart-type],
  body.retro-theme [class*="Chart"]:not(.theme-panel),
  body.retro-theme [class*="chart"]:not(.theme-panel) {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    
    /* Override all text elements inside charts */
    text, tspan, * {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-weight: 400 !important;
      letter-spacing: normal !important;
      text-transform: none !important;
      text-shadow: none !important;
      filter: none !important;
      font-style: normal !important;
    }
  }

  /* Critical: Disable any transforms that could interfere with charts */
  .chart-container,
  .vega-embed,
  [data-chart-type],
  [class*="Chart"]:not(.theme-panel),
  [class*="chart"]:not(.theme-panel) {
    transform: none !important;
    animation: none !important;
    transition: background-color 0.2s ease, border-color 0.2s ease !important;
    will-change: auto !important;
    contain: layout !important;
    
    /* Disable any effects that could interfere with rendering */
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    
    /* Ensure proper text rendering */
    -webkit-font-smoothing: auto !important;
    -moz-osx-font-smoothing: auto !important;
    text-rendering: auto !important;
    
    /* Preserve chart responsiveness */
    svg, canvas {
      max-width: 100% !important;
      height: auto !important;
      transform: none !important;
      filter: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
  }

  /* Enhanced reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    body.neon-theme::before,
    body.retro-theme::before {
      animation: none;
    }
  }
`; 