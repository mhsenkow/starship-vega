import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './design-system/global.css' // Single source of truth for CSS variables

// Set essential CSS variables immediately before React renders to ensure they're available
function initializeCSSVariables() {
  const root = document.documentElement;
  
  // Get the current theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = savedTheme && ['light', 'dark', 'fluent', 'neon', 'material3', 'neumorphism', 'brutalist', 'retro'].includes(savedTheme) 
    ? savedTheme 
    : 'light'; // Always default to light mode
  
  // Set theme class immediately - this is the key class used by CSS
  root.classList.add(`${currentTheme}-theme`);
  
  // Set essential spacing, typography, and color variables here - Consistent with design system
  root.style.setProperty('--spacing-xs', '4px');
  root.style.setProperty('--spacing-sm', '8px');
  root.style.setProperty('--spacing-md', '16px');
  root.style.setProperty('--spacing-lg', '24px');
  root.style.setProperty('--spacing-xl', '32px');
  root.style.setProperty('--radius-sm', '4px');
  root.style.setProperty('--radius-base', '8px');
  root.style.setProperty('--radius-lg', '12px');
  root.style.setProperty('--typography-fontSize-sm', '0.875rem');
  root.style.setProperty('--typography-fontSize-lg', '1.125rem');
  root.style.setProperty('--typography-fontWeight-medium', '500');
  root.style.setProperty('--typography-fontWeight-semibold', '600');
  
  // Set essential color variables with fallbacks
  root.style.setProperty('--color-surface', 'var(--color-surface-primary, #ffffff)');
  root.style.setProperty('--color-background', 'var(--color-background-primary, #ffffff)');
  
  // Set text colors based on theme - CRITICAL for proper contrast
  if (currentTheme === 'light' || !currentTheme) {
    root.style.setProperty('--color-text-primary', '#000000');
    root.style.setProperty('--color-text-secondary', '#666666');
    root.style.setProperty('--color-text-tertiary', '#999999');
  } else {
    root.style.setProperty('--color-text-primary', '#ffffff');
    root.style.setProperty('--color-text-secondary', '#b3b3b3');
    root.style.setProperty('--color-text-tertiary', '#808080');
  }
  
  root.style.setProperty('--color-border', 'var(--color-border-light, #e0e0e0)');
  root.style.setProperty('--color-primary', 'var(--color-primary-500, #1976d2)');
  root.style.setProperty('--color-primary-light', 'var(--color-primary-100, rgba(25, 118, 210, 0.1))');
  root.style.setProperty('--color-surface-hover', 'var(--color-surface-hover, rgba(0, 0, 0, 0.04))');
  root.style.setProperty('--transition-fast', '0.2s ease');
  root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
}

// Initialize CSS variables before React renders
initializeCSSVariables();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
