/**
 * Comprehensive Vega-Lite Theme Configuration for Design System Integration
 * Each theme provides complete visual styling that matches the app's design philosophy
 * Now uses CSS custom properties for dynamic color updating
 */

import { Config } from 'vega-lite';
import { ThemeMode } from '../styles/theme';

export interface SemanticColorSets {
  financial: string[];
  sentiment: string[];
  status: string[];
  performance: string[];
  temperature: string[];
  priority: string[];
  categories: string[];
  diverging: string[];
}

/**
 * Get semantic color sets for the current theme
 */
const getSemanticColorSets = (): SemanticColorSets => {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme') as ThemeMode || 'light';
  
  const colorSets: Record<ThemeMode, SemanticColorSets> = {
    light: {
      financial: ['#2e7d32', '#66bb6a', '#4caf50', '#81c784', '#a5d6a7'], // Greens for money/growth
      sentiment: ['#f44336', '#ff9800', '#4caf50'], // Red (negative), Orange (neutral), Green (positive)
      status: ['#4caf50', '#ff9800', '#f44336', '#2196f3'], // Success, Warning, Error, Info
      performance: ['#d32f2f', '#ff5722', '#ff9800', '#fbc02d', '#689f38', '#4caf50'], // Bad to Good gradient
      temperature: ['#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'], // Cool to Warm
      priority: ['#e8f5e8', '#c8e6c9', '#ffcc02', '#ff6b35'], // Low, Medium, High, Critical
      categories: ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c2185b', '#0097a7', '#512da8', '#d32f2f'], // Standard categorical
      diverging: ['#d32f2f', '#f57c00', '#fdd835', '#ffffff', '#81c784', '#4caf50', '#2e7d32'] // Red to Green through white
    },
    dark: {
      financial: ['#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9', '#e8f5e8'], // Lighter greens for dark bg
      sentiment: ['#ef5350', '#ffb74d', '#66bb6a'], // Brighter colors for dark theme
      status: ['#66bb6a', '#ffb74d', '#ef5350', '#42a5f5'], // Bright success, warning, error, info
      performance: ['#ef5350', '#ff7043', '#ffb74d', '#fff176', '#aed581', '#66bb6a'], // Bright bad to good
      temperature: ['#42a5f5', '#26c6da', '#26a69a', '#66bb6a', '#9ccc65', '#d4e157', '#ffee58', '#ffca28', '#ffb74d', '#ff8a65'], // Bright cool to warm
      priority: ['#424242', '#757575', '#ffca28', '#ff6b35'], // Dark low, medium, bright high, critical
      categories: ['#90caf9', '#81c784', '#ffb74d', '#ce93d8', '#f48fb1', '#4dd0e1', '#b39ddb', '#ef5350'], // Bright categories
      diverging: ['#ef5350', '#ffb74d', '#fff176', '#37474f', '#81c784', '#66bb6a', '#4caf50'] // Bright diverging
    },
    fluent: {
      financial: ['#107c10', '#13a10e', '#16c60c', '#54b399', '#86d7d1'], // Microsoft green tones
      sentiment: ['#d13438', '#ff8c00', '#107c10'], // Fluent red, orange, green
      status: ['#107c10', '#ff8c00', '#d13438', '#0078d4'], // Fluent status colors
      performance: ['#d13438', '#e74856', '#ff8c00', '#fce100', '#486600', '#107c10'], // Fluent performance scale
      temperature: ['#0078d4', '#40e0d0', '#00bcf2', '#00b7c3', '#038387', '#486600', '#107c10', '#dfb900', '#ff8c00', '#d83b01'], // Fluent temperature
      priority: ['#f3f2f1', '#edebe9', '#ff8c00', '#d83b01'], // Fluent priority levels
      categories: ['#0078d4', '#107c10', '#ff8c00', '#5c2d91', '#e3008c', '#00bcf2', '#8764b8', '#d13438'], // Fluent categorical
      diverging: ['#d13438', '#ff8c00', '#fce100', '#f3f2f1', '#54b399', '#107c10', '#038387'] // Fluent diverging
    },
    neon: {
      financial: ['#39ff14', '#00ff7f', '#00ffff', '#7fff00', '#adff2f'], // Bright cyber greens/cyans
      sentiment: ['#ff073a', '#ff006e', '#39ff14'], // Neon red, magenta, green
      status: ['#39ff14', '#ffff00', '#ff073a', '#00f5ff'], // Neon success, warning, error, info
      performance: ['#ff073a', '#ff1744', '#ff006e', '#ffff00', '#7fff00', '#39ff14'], // Neon performance scale
      temperature: ['#00f5ff', '#00ffff', '#7fffd4', '#00ff7f', '#39ff14', '#7fff00', '#ffff00', '#ffa500', '#ff4500', '#ff073a'], // Cyber temperature
      priority: ['#1a1a1a', '#333333', '#ffff00', '#ff073a'], // Dark to bright neon
      categories: ['#00f5ff', '#ff006e', '#39ff14', '#ffff00', '#ff073a', '#00ff7f', '#ff1493', '#00ffff'], // Bright neon colors
      diverging: ['#ff073a', '#ff006e', '#ffff00', '#000000', '#00ff7f', '#39ff14', '#00f5ff'] // Neon diverging through black
    },
    material3: {
      financial: ['#006e1c', '#0f5132', '#1e6091', '#0277bd', '#00838f'], // Material 3 green/blue tones
      sentiment: ['#ba1a1a', '#7d5260', '#006e1c'], // Material 3 error, neutral, success
      status: ['#006e1c', '#7d5260', '#ba1a1a', '#0061a4'], // Material 3 status palette
      performance: ['#ba1a1a', '#c4454d', '#7d5260', '#947051', '#3e6837', '#006e1c'], // Material 3 performance
      temperature: ['#0061a4', '#0277bd', '#00838f', '#00695c', '#2e7d32', '#558b2f', '#9e9d24', '#f9a825', '#ff8f00', '#f57c00'], // Material temp
      priority: ['#f7f2fa', '#ede7f6', '#ff8f00', '#d84315'], // Material priority
      categories: ['#6750a4', '#625b71', '#006e1c', '#7d5260', '#ba1a1a', '#0061a4', '#8e4ec6', '#1e6091'], // Material categorical
      diverging: ['#ba1a1a', '#7d5260', '#947051', '#f7f2fa', '#3e6837', '#006e1c', '#0f5132'] // Material diverging
    },
    neumorphism: {
      financial: ['#10b981', '#34d399', '#6ee7b7', '#86efac', '#a7f3d0'], // Soft green tones
      sentiment: ['#ef4444', '#f59e0b', '#10b981'], // Soft red, amber, green
      status: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'], // Soft status colors
      performance: ['#ef4444', '#f87171', '#f59e0b', '#fbbf24', '#65a30d', '#10b981'], // Soft performance scale
      temperature: ['#3b82f6', '#06b6d4', '#14b8a6', '#059669', '#16a34a', '#65a30d', '#a3a702', '#eab308', '#f59e0b', '#ea580c'], // Soft temperature
      priority: ['#f8fafc', '#e2e8f0', '#f59e0b', '#dc2626'], // Neumorphic priority
      categories: ['#667eea', '#9ca3af', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4'], // Soft categorical
      diverging: ['#ef4444', '#f59e0b', '#fbbf24', '#f8fafc', '#86efac', '#10b981', '#059669'] // Soft diverging
    },
    brutalist: {
      financial: ['#00ff00', '#008000', '#228b22', '#32cd32', '#90ee90'], // Raw web-safe greens
      sentiment: ['#ff0000', '#ffff00', '#00ff00'], // Pure RGB sentiment
      status: ['#00ff00', '#ffff00', '#ff0000', '#0000ff'], // Pure status colors
      performance: ['#ff0000', '#ff4500', '#ffff00', '#adff2f', '#32cd32', '#00ff00'], // Raw performance scale
      temperature: ['#0000ff', '#0080ff', '#00ffff', '#40e0d0', '#00ff7f', '#adff2f', '#ffff00', '#ffa500', '#ff4500', '#ff0000'], // Raw temperature
      priority: ['#c0c0c0', '#808080', '#ffff00', '#ff0000'], // Raw priority levels
      categories: ['#000000', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff'], // Pure web colors
      diverging: ['#ff0000', '#ffff00', '#adff2f', '#ffffff', '#00ff7f', '#00ff00', '#008000'] // Raw diverging
    },
    retro: {
      financial: ['#228b22', '#daa520', '#cd853f', '#f4a460', '#deb887'], // Vintage gold/green tones
      sentiment: ['#dc143c', '#daa520', '#228b22'], // Vintage red, gold, green
      status: ['#228b22', '#daa520', '#dc143c', '#4682b4'], // Retro status colors
      performance: ['#dc143c', '#cd5c5c', '#daa520', '#bdb76b', '#9acd32', '#228b22'], // Vintage performance
      temperature: ['#4682b4', '#5f9ea0', '#48d1cc', '#20b2aa', '#3cb371', '#9acd32', '#bdb76b', '#daa520', '#cd853f', '#d2691e'], // Vintage temp
      priority: ['#f5deb3', '#deb887', '#daa520', '#b22222'], // Vintage priority
      categories: ['#d2691e', '#8b4513', '#228b22', '#daa520', '#dc143c', '#4682b4', '#9932cc', '#ff6347'], // Vintage categorical
      diverging: ['#dc143c', '#daa520', '#bdb76b', '#f5deb3', '#9acd32', '#228b22', '#006400'] // Vintage diverging
    }
  };
  
  return colorSets[currentTheme] || colorSets.light;
};

/**
 * Get theme colors from CSS custom properties
 * This allows colors to be truly dynamic and update when themes change
 */
const getThemeColorsFromCSS = () => {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  
  // Get the current theme mode
  const currentTheme = root.getAttribute('data-theme') as ThemeMode || 'light';
  
  // Define color mappings for each theme
  const themeColorMappings = {
    light: {
      category: ['#1976d2', '#757575', '#2e7d32', '#ed6c02', '#d32f2f', '#0288d1', '#7b1fa2', '#388e3c'],
      primary: '#1976d2',
      secondary: '#757575',
      accent: '#2e7d32'
    },
    dark: {
      category: ['#90caf9', '#b0bec5', '#66bb6a', '#ffb74d', '#f44336', '#4fc3f7', '#ba68c8', '#81c784'],
      primary: '#90caf9',
      secondary: '#b0bec5',
      accent: '#66bb6a'
    },
    fluent: {
      category: ['#0078d4', '#605e5c', '#107c10', '#ff8c00', '#d13438', '#0078d4', '#5c2d91', '#00bcf2'],
      primary: '#0078d4',
      secondary: '#605e5c',
      accent: '#107c10'
    },
    neon: {
      category: ['#00f5ff', '#ff006e', '#39ff14', '#ffff00', '#ff073a', '#00f5ff', '#ff1493', '#00ff7f'],
      primary: '#00f5ff',
      secondary: '#ff006e',
      accent: '#39ff14'
    },
    material3: {
      category: ['#6750a4', '#625b71', '#006e1c', '#7d5260', '#ba1a1a', '#0061a4', '#8e4ec6', '#1e6091'],
      primary: '#6750a4',
      secondary: '#625b71',
      accent: '#006e1c'
    },
    neumorphism: {
      category: ['#667eea', '#9ca3af', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4'],
      primary: '#667eea',
      secondary: '#9ca3af',
      accent: '#10b981'
    },
    brutalist: {
      category: ['#000000', '#ff0000', '#00ff00', '#ffff00', '#ff0000', '#0000ff', '#ff00ff', '#00ffff'],
      primary: '#000000',
      secondary: '#ff0000',
      accent: '#00ff00'
    },
    retro: {
      category: ['#d2691e', '#8b4513', '#228b22', '#ffa500', '#dc143c', '#4682b4', '#9932cc', '#ff6347'],
      primary: '#d2691e',
      secondary: '#8b4513',
      accent: '#228b22'
    }
  };
  
  const colors = themeColorMappings[currentTheme] || themeColorMappings.light;
  
  console.log(`[Theme Colors] Getting colors for theme: ${currentTheme}`, colors);
  
  return colors;
};

// Base theme configuration with common settings
const createBaseTheme = (): Config => {
  const colors = getThemeColorsFromCSS();
  
  return {
    background: 'transparent',
    padding: 20,
    autosize: {
      type: 'fit',
      contains: 'padding',
    },
    axis: {
      labelFontSize: 11,
      titleFontSize: 12,
      grid: true,
      gridOpacity: 0.3,
      domain: false,
      ticks: false,
      labelPadding: 4,
      titlePadding: 8,
      labelColor: 'var(--vega-text-color, #666666)',
      titleColor: 'var(--vega-title-color, #333333)',
      gridColor: 'var(--vega-grid-color, #e0e0e0)',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    legend: {
      labelFontSize: 11,
      titleFontSize: 12,
      padding: 10,
      symbolSize: 100,
      symbolStrokeWidth: 2,
      labelColor: 'var(--vega-text-color, #666666)',
      titleColor: 'var(--vega-title-color, #333333)',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      fontSize: 14,
      fontWeight: 400,
      anchor: 'start',
      offset: 20,
      color: 'var(--vega-title-color, #333333)',
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    view: {
      stroke: 'transparent',
    },
    range: {
      category: colors.category,
      diverging: [colors.category[4], '#ffffff', colors.primary],
      heatmap: ['#ffffff', colors.category[1], colors.primary],
      ordinal: [colors.primary, colors.category[1], colors.category[2], colors.category[3]],
    },
    mark: {
      color: colors.primary,
      stroke: colors.primary,
      strokeWidth: 1.5,
    },
  };
};

// Light theme - Clean and professional
export const createLightTheme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    legend: {
      ...base.legend,
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      ...base.title,
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
  };
};

// Dark theme - Easy on the eyes with high contrast
export const createDarkTheme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelColor: '#b0bec5',
      titleColor: '#ffffff',
      gridColor: '#424242',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    legend: {
      ...base.legend,
      labelColor: '#b0bec5',
      titleColor: '#ffffff',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      ...base.title,
      color: '#ffffff',
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
  };
};

// Fluent theme - Microsoft glassmorphism design
export const createFluentTheme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelColor: '#605e5c',
      titleColor: '#323130',
      gridOpacity: 0.5,
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    legend: {
      ...base.legend,
      labelColor: '#605e5c',
      titleColor: '#323130',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      ...base.title,
      color: '#323130',
      fontWeight: 400,
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    mark: {
      ...base.mark,
      opacity: 0.9,
    },
  };
};

// Neon Cyberpunk theme - Futuristic with glowing effects
export const createNeonTheme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelColor: '#00f5ff',
      titleColor: '#ffffff',
      gridColor: 'rgba(0, 245, 255, 0.3)',
      gridOpacity: 0.6,
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFontWeight: 400,
      labelFontWeight: 400,
    },
    legend: {
      ...base.legend,
      labelColor: '#00f5ff',
      titleColor: '#ffffff',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      ...base.title,
      color: '#ffffff',
      fontWeight: 400,
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    mark: {
      ...base.mark,
      strokeWidth: 2,
      strokeOpacity: 0.8,
    },
  };
};

// Material Design 3 theme - Google's Material You
export const createMaterial3Theme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelColor: '#49454f',
      titleColor: '#1c1b1f',
      gridColor: '#79747e',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    legend: {
      ...base.legend,
      labelColor: '#49454f',
      titleColor: '#1c1b1f',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      ...base.title,
      color: '#1c1b1f',
      fontWeight: 400,
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    mark: {
      ...base.mark,
      cornerRadius: 8,
    },
  };
};

// Neumorphism theme - Soft, tactile design
export const createNeumorphismTheme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelColor: '#4a5568',
      titleColor: '#2d3748',
      gridColor: '#c8ced8',
      gridOpacity: 0.4,
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    legend: {
      ...base.legend,
      labelColor: '#4a5568',
      titleColor: '#2d3748',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      ...base.title,
      color: '#2d3748',
      fontWeight: 400,
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    mark: {
      ...base.mark,
      cornerRadius: 12,
    },
  };
};

// Brutalist theme - Raw, powerful, high contrast
export const createBrutalistTheme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelColor: '#000000',
      titleColor: '#000000',
      gridColor: '#000000',
      gridOpacity: 1,
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFontWeight: 700,
      labelFontWeight: 600,
    },
    legend: {
      ...base.legend,
      labelColor: '#000000',
      titleColor: '#000000',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFontWeight: 700,
    },
    title: {
      ...base.title,
      color: '#000000',
      fontWeight: 700,
      fontSize: 16,
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    mark: {
      ...base.mark,
      strokeWidth: 3,
      cornerRadius: 0,
    },
  };
};

// Retro/Vintage theme - Warm, nostalgic design
export const createRetroTheme = (): Config => {
  const base = createBaseTheme();
  return {
    ...base,
    axis: {
      ...base.axis,
      labelColor: '#5d4e37',
      titleColor: '#2f1b14',
      gridColor: '#d2b48c',
      gridOpacity: 0.5,
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFontStyle: 'normal',
    },
    legend: {
      ...base.legend,
      labelColor: '#5d4e37',
      titleColor: '#2f1b14',
      labelFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
    title: {
      ...base.title,
      color: '#2f1b14',
      fontWeight: 400,
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      fontStyle: 'normal',
    },
    mark: {
      ...base.mark,
      cornerRadius: 4,
    },
  };
};

// Main function to get Vega theme based on mode
export const getVegaTheme = (mode: ThemeMode): Config => {
  switch (mode) {
    case 'light':
      return createLightTheme();
    case 'dark':
      return createDarkTheme();
    case 'fluent':
      return createFluentTheme();
    case 'neon':
      return createNeonTheme();
    case 'material3':
      return createMaterial3Theme();
    case 'neumorphism':
      return createNeumorphismTheme();
    case 'brutalist':
      return createBrutalistTheme();
    case 'retro':
      return createRetroTheme();
    default:
      return createLightTheme();
  }
};

/**
 * Get the appropriate theme based on the current theme mode
 */
export const getCurrentVegaTheme = (): Config => {
  const currentTheme = document.documentElement.getAttribute('data-theme') as ThemeMode;
  const selectedColorSet = document.documentElement.getAttribute('data-color-set') as keyof SemanticColorSets | null;
  
  console.log(`[Vega Themes] Getting current theme. Document theme: ${currentTheme}, Color set: ${selectedColorSet}`);
  
  let theme: Config;
  if (currentTheme && ['light', 'dark', 'fluent', 'neon', 'material3', 'neumorphism', 'brutalist', 'retro'].includes(currentTheme)) {
    theme = getVegaTheme(currentTheme);
  } else {
    theme = createLightTheme();
  }
  
  // If a color set is selected, override the theme colors
  if (selectedColorSet) {
    const semanticColors = getSemanticColorSets();
    const colorSet = semanticColors[selectedColorSet];
    
    if (colorSet && colorSet.length > 0) {
      console.log(`[Vega Themes] Overriding theme colors with ${selectedColorSet} color set:`, colorSet);
      
      // Override the theme's color range with the selected color set
      theme = {
        ...theme,
        range: {
          ...theme.range,
          category: colorSet,
          ordinal: colorSet,
        },
        mark: {
          ...theme.mark,
          color: colorSet[0],
        }
      };
      
      console.log(`[Vega Themes] Applied ${selectedColorSet} color set override. New colors:`, theme.range?.category);
      return theme;
    }
  }
  
  console.log(`[Vega Themes] Applied ${currentTheme || 'light'} theme. Colors:`, theme.range?.category);
  return theme;
};

/**
 * Determine if current theme is dark mode
 */
export const isDarkTheme = (): boolean => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  return currentTheme === 'dark' || currentTheme === 'neon';
};

/**
 * Determine if current theme supports transparency/glassmorphism
 */
export const isTransparentTheme = (): boolean => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  return currentTheme === 'fluent';
};

/**
 * Get theme-specific chart styling for containers
 */
export const getThemeSpecificChartStyles = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  switch (currentTheme) {
    case 'fluent':
      return {
        containerStyle: {
          backdropFilter: 'blur(45px) saturate(1.8) brightness(1.15)',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: `
            0 12px 40px rgba(31, 38, 135, 0.15),
            0 6px 20px rgba(31, 38, 135, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1)
          `,
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
        }
      };
    case 'neon':
      return {
        containerStyle: {
          background: 'rgba(5, 5, 5, 0.9)',
          border: '1px solid rgba(0, 245, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.2), inset 0 0 20px rgba(0, 245, 255, 0.1)',
          borderRadius: '4px',
        }
      };
    case 'neumorphism':
      return {
        containerStyle: {
          background: '#e0e5ec',
          boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff',
          borderRadius: '20px',
          border: 'none',
        }
      };
    case 'brutalist':
      return {
        containerStyle: {
          background: '#ffffff',
          border: '3px solid #000000',
          boxShadow: '5px 5px 0px #000000',
          borderRadius: '0px',
        }
      };
    case 'material3':
      return {
        containerStyle: {
          background: '#fffbfe',
          border: '1px solid #79747e',
          borderRadius: '16px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
        }
      };
    case 'retro':
      return {
        containerStyle: {
          background: 'linear-gradient(135deg, #faebd7, #f5deb3)',
          border: '2px solid #d2b48c',
          borderRadius: '10px',
          boxShadow: '4px 4px 8px rgba(139, 69, 19, 0.3)',
        }
      };
    default:
      return {
        containerStyle: {}
      };
  }
};

/**
 * Apply theme configuration to a Vega-Lite specification
 */
export const applyThemeToSpec = (spec: any): any => {
  const theme = getCurrentVegaTheme();
  
  console.log(`[Apply Theme] Applying theme to spec. Theme range:`, theme.range);
  console.log(`[Apply Theme] Original spec config:`, spec.config);
  console.log(`[Apply Theme] Theme mark color:`, theme.mark?.color);
  
  // Create a deep copy to avoid mutation
  const result = JSON.parse(JSON.stringify(spec));
  
  // Ensure config exists
  if (!result.config) {
    result.config = {};
  }
  
  // Apply theme configuration with proper priority
  result.config = {
    ...result.config, // Start with existing config
    ...theme, // Apply theme (overwrites conflicting keys)
    // Specifically ensure range is applied correctly
    range: {
      ...result.config.range, // Keep any existing range config
      ...theme.range, // Apply theme range colors
    },
    // Ensure axis, legend, etc. are properly merged
    axis: { ...theme.axis, ...result.config.axis },
    legend: { ...theme.legend, ...result.config.legend },
    title: { ...theme.title, ...result.config.title },
    view: { ...theme.view, ...result.config.view },
    mark: { ...theme.mark, ...result.config.mark },
  };
  
  // CRITICAL: For charts without explicit color encoding, ensure they use theme colors
  if (result.encoding && !result.encoding.color) {
    // If there's no color encoding, the chart should use the default mark color
    console.log(`[Apply Theme] No color encoding found, ensuring mark uses theme color`);
    
    const categoryColors = theme.range?.category as string[] || [];
    
    if (typeof result.mark === 'string') {
      result.mark = {
        type: result.mark,
        color: theme.mark?.color || categoryColors[0]
      };
    } else if (result.mark && typeof result.mark === 'object') {
      result.mark = {
        ...result.mark,
        color: result.mark.color || theme.mark?.color || categoryColors[0]
      };
    }
  }
  
  // CRITICAL: For categorical color encoding, ensure it uses the theme color scheme
  if (result.encoding?.color) {
    const colorEncoding = result.encoding.color;
    
    // If it's a categorical field without an explicit scale, apply theme colors
    if (colorEncoding.type === 'nominal' || colorEncoding.type === 'ordinal') {
      if (!colorEncoding.scale) {
        colorEncoding.scale = {};
      }
      
      if (!colorEncoding.scale.range) {
        console.log(`[Apply Theme] Applying theme colors to categorical color encoding`);
        colorEncoding.scale.range = theme.range?.category;
      }
    }
  }
  
  console.log(`[Apply Theme] Final spec config range:`, result.config.range);
  console.log(`[Apply Theme] Final spec config mark:`, result.config.mark);
  console.log(`[Apply Theme] Final spec mark:`, result.mark);
  console.log(`[Apply Theme] Final spec color encoding:`, result.encoding?.color);
  
  return result;
};

/**
 * Test function to verify current theme application
 */
export const testCurrentTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const theme = getCurrentVegaTheme();
  
  console.log(`=== THEME TEST ===`);
  console.log(`Current document theme: ${currentTheme}`);
  console.log(`Theme colors:`, theme.range?.category);
  console.log(`Theme mark color:`, theme.mark?.color);
  console.log(`==================`);
  
  return {
    currentTheme,
    colors: theme.range?.category,
    markColor: theme.mark?.color
  };
};

/**
 * Enhanced theme application that also handles mark-specific theming
 */
export const applyEnhancedThemeToSpec = (spec: any, markType?: string): any => {
  const themedSpec = applyThemeToSpec(spec);
  const theme = getCurrentVegaTheme();
  
  // Apply mark-specific configurations
  if (markType && theme[markType as keyof Config] && typeof theme[markType as keyof Config] === 'object') {
    const markConfig = theme[markType as keyof Config] as Record<string, any>;
    
    // If mark is a string, convert to object and apply theme
    if (typeof themedSpec.mark === 'string') {
      themedSpec.mark = {
        type: themedSpec.mark,
        ...markConfig
      };
    } else if (typeof themedSpec.mark === 'object' && themedSpec.mark !== null) {
      // Merge with existing mark configuration, preserving user settings
      themedSpec.mark = {
        ...markConfig,
        ...themedSpec.mark
      };
    }
  }
  
  return themedSpec;
};

/**
 * Get theme-appropriate default colors for encodings
 */
export const getThemeColors = () => {
  const theme = getCurrentVegaTheme();
  return {
    primary: (theme.range?.category as string[])?.[0] || '#1976d2',
    secondary: (theme.range?.category as string[])?.[1] || '#757575',
    tertiary: (theme.range?.category as string[])?.[2] || '#2e7d32',
    categoryScheme: theme.range?.category as string[] || [],
    divergingScheme: theme.range?.diverging as string[] || [],
    ordinalScheme: theme.range?.ordinal as string[] || [],
  };
};

/**
 * Get semantic color sets for the current theme
 * These are purpose-built color palettes for specific chart types and concepts
 */
export const getSemanticColors = (): SemanticColorSets => {
  return getSemanticColorSets();
};

/**
 * Apply a semantic color set to a chart specification
 */
export const applySemanticColors = (spec: any, colorSetName: keyof SemanticColorSets): any => {
  const semanticColors = getSemanticColorSets();
  const colorSet = semanticColors[colorSetName];
  
  console.log(`[Semantic Colors] Applying ${colorSetName} color set:`, colorSet);
  
  // Create a deep copy
  const result = JSON.parse(JSON.stringify(spec));
  
  // Apply the semantic colors to the spec
  if (!result.config) {
    result.config = {};
  }
  
  if (!result.config.range) {
    result.config.range = {};
  }
  
  // Set the category colors to the semantic set
  result.config.range.category = colorSet;
  
  // If there's a color encoding, apply the semantic colors
  if (result.encoding?.color) {
    const colorEncoding = result.encoding.color;
    if (colorEncoding.type === 'nominal' || colorEncoding.type === 'ordinal') {
      if (!colorEncoding.scale) {
        colorEncoding.scale = {};
      }
      colorEncoding.scale.range = colorSet;
    }
  }
  
  // If no color encoding but chart should use colors, apply first color from set
  if (!result.encoding?.color && colorSet.length > 0) {
    if (typeof result.mark === 'string') {
      result.mark = {
        type: result.mark,
        color: colorSet[0]
      };
    } else if (result.mark && typeof result.mark === 'object') {
      result.mark = {
        ...result.mark,
        color: result.mark.color || colorSet[0]
      };
    }
  }
  
  console.log(`[Semantic Colors] Applied ${colorSetName} colors to spec:`, result);
  return result;
};

/**
 * Force apply theme colors to a chart specification
 * This is more aggressive and ensures colors are applied even if the chart has existing color config
 */
export const forceApplyThemeColors = (spec: any): any => {
  const theme = getCurrentVegaTheme();
  const result = JSON.parse(JSON.stringify(spec));
  const categoryColors = theme.range?.category as string[] || [];
  
  console.log(`[Force Apply] Input spec:`, spec);
  console.log(`[Force Apply] Theme:`, theme);
  console.log(`[Force Apply] Forcing theme colors onto chart. Colors:`, categoryColors);
  
  // Ensure config exists and force theme colors
  if (!result.config) {
    result.config = {};
  }
  
  // Force apply color ranges - this is the key part
  result.config.range = {
    category: categoryColors,
    diverging: theme.range?.diverging,
    heatmap: theme.range?.heatmap,
    ordinal: theme.range?.ordinal,
  };
  
  // Force apply mark colors
  result.config.mark = {
    color: categoryColors[0] || '#1976d2',
  };
  
  // If the chart has a color encoding, force the scale to use theme colors
  if (result.encoding?.color) {
    const colorEncoding = result.encoding.color;
    
    // Force apply color scale - this ensures categorical data uses theme colors
    if (!colorEncoding.scale) {
      colorEncoding.scale = {};
    }
    colorEncoding.scale.range = categoryColors;
    
    console.log(`[Force Apply] Applied color encoding scale:`, colorEncoding.scale);
  }
  
  // If no color encoding but the chart should use colors, force it
  if (result.mark && !result.encoding?.color) {
    if (typeof result.mark === 'string') {
      result.mark = {
        type: result.mark,
        color: categoryColors[0] || '#1976d2'
      };
    } else if (typeof result.mark === 'object') {
      result.mark = {
        ...result.mark,
        color: categoryColors[0] || '#1976d2'
      };
    }
    
    console.log(`[Force Apply] Applied mark color:`, result.mark);
  }
  
  console.log(`[Force Apply] Final forced spec:`, result);
  console.log(`[Force Apply] Final color range:`, result.config.range);
  return result;
};

/**
 * Trigger a global chart refresh when color sets change
 */
export const triggerGlobalChartRefresh = () => {
  console.log('[Vega Themes] Triggering global chart refresh for color set change');
  
  // Dispatch a custom event that charts can listen to
  const event = new CustomEvent('vega-color-set-changed', {
    detail: {
      timestamp: Date.now(),
      selectedColorSet: document.documentElement.getAttribute('data-color-set'),
    }
  });
  
  window.dispatchEvent(event);
  
  // Also trigger a resize event as a fallback for charts that listen to resize
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
}; 